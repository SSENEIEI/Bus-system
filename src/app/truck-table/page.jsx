"use client";
import { useEffect, useMemo, useRef, useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import { fetchJSON, postJSON } from '@/lib/http';
import { formatWelcome } from '@/lib/formatters';

export default function TruckTable() {
  const router = useRouter();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [user, setUser] = useState(null);
  const [plants, setPlants] = useState([]); // AC/RF/SSC
  const [departments, setDepartments] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [shiftId, setShiftId] = useState(null);
  const [departTimes, setDepartTimes] = useState([]); // by shift
  const [countsBy, setCountsBy] = useState({}); // { dtId: { routeId: { plantId: totalCount } , ttl: { routeId: total } } }
  const [carPlan, setCarPlan] = useState({}); // { dtId: { routeId: car_count } }
  const [carModal, setCarModal] = useState({ open:false, dt:null, route:null, value:0 });
  const [hiddenDepartTimeIds, setHiddenDepartTimeIds] = useState([]); // hides loaded from server for current date+shift
  const [autoHideEnabled, setAutoHideEnabled] = useState(false); // global toggle: auto hide empty times for all dates
  const captureRef = useRef(null);

  useEffect(() => {
    try { const u = JSON.parse(localStorage.getItem('user')||'null'); setUser(u); } catch {}
  }, []);

  // Determine admin privilege early so effects below can depend on it safely
  const isAdminga = useMemo(() => String(user?.username||'').toLowerCase()==='adminga', [user]);

  const plantOrder = useMemo(() => ['AC','RF','SSC'], []);
  const plantsSorted = useMemo(() => {
    return [...plants].sort((a,b) => {
      const ia = plantOrder.indexOf(a.code);
      const ib = plantOrder.indexOf(b.code);
      const sa = ia === -1 ? 999 : ia;
      const sb = ib === -1 ? 999 : ib;
      if (sa !== sb) return sa - sb;
      return String(a.code||'').localeCompare(String(b.code||''));
    });
  }, [plants, plantOrder]);

  const loadMasters = async () => {
    const [plantRowsRaw, routeRowsRaw, shiftRowsRaw, deptRowsRaw] = await Promise.all([
      fetchJSON('/api/ot/plants'),
      fetchJSON('/api/ot/routes'),
      fetchJSON('/api/ot/shifts'),
      fetchJSON('/api/ot/departments')
    ]);
    setPlants(Array.isArray(plantRowsRaw) ? plantRowsRaw : []);
    setRoutes(Array.isArray(routeRowsRaw) ? routeRowsRaw : []);
    const sh = Array.isArray(shiftRowsRaw) ? shiftRowsRaw : [];
    setShifts(sh);
    setDepartments(Array.isArray(deptRowsRaw) ? deptRowsRaw : []);
    if (!shiftId && sh.length) setShiftId(sh[0].id);
  };

  useEffect(() => { loadMasters(); }, []);

  // Load global setting for auto hide
  useEffect(() => {
    (async () => {
      const res = await fetchJSON('/api/ot/settings?name=auto_hide_empty_times');
      const enabled = String(res?.value||'').toLowerCase()==='true';
      setAutoHideEnabled(enabled);
    })();
  }, []);

  const loadDepartTimes = async (sid) => {
    if (!sid) return setDepartTimes([]);
    const data = await fetchJSON(`/api/ot/depart-times?shiftId=${sid}`, {}, { cache:'no-store' });
    setDepartTimes(Array.isArray(data) ? data : []);
  };
  useEffect(() => { loadDepartTimes(shiftId); }, [shiftId]);

  // Load hidden depart times for current date+shift (applies to all users)
  const loadHiddenTimes = async (sid) => {
    if (!sid) return setHiddenDepartTimeIds([]);
    const ids = await fetchJSON(`/api/ot/time-hides?date=${date}&shiftId=${sid}`, {}, { cache: 'no-store' });
    setHiddenDepartTimeIds(Array.isArray(ids) ? ids : []);
  };
  useEffect(() => { loadHiddenTimes(shiftId); }, [date, shiftId]);
  // If global auto hide is enabled, ensure today's date has hides computed proactively
  useEffect(() => {
    (async () => {
      // Only admin (adminga) should persist hides to the server
      if (!autoHideEnabled || !isAdminga || !Array.isArray(shifts) || !shifts.length) return;
      try {
        const tasks = [];
        for (const s of shifts) {
          // eslint-disable-next-line no-await-in-loop
          const empties = await computeEmptyTimesForShift(s.id);
          tasks.push(postJSON('/api/ot/time-hides', { the_date: date, shift_id: s.id, depart_time_ids: empties }));
        }
        await Promise.all(tasks);
        await loadHiddenTimes(shiftId);
      } catch {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoHideEnabled, isAdminga, date, JSON.stringify(shifts)]);

  // Aggregate per depart time -> per route -> per plant (sum across departments)
  const loadCounts = async () => {
    if (!date || !shiftId || departTimes.length===0) { setCountsBy({}); return; }
    const acc = {};
    for (const dt of departTimes) {
      const rows = await fetchJSON(`/api/ot/counts?date=${date}&shiftId=${shiftId}&departTimeId=${dt.id}`) || [];
      const map = {};
      for (const row of (Array.isArray(rows)? rows: [])) {
        const rId = row.route_id; const pId = row.plant_id; const c = Number(row.count)||0;
        if (!map[rId]) map[rId] = {};
        map[rId][pId] = (map[rId][pId]||0) + c; // sum across departments
      }
      const ttl = {};
      Object.keys(map).forEach(rId => {
        ttl[rId] = Object.values(map[rId]).reduce((s,v)=> s + (Number(v)||0), 0);
      });
      acc[dt.id] = { map, ttl };
    }
    setCountsBy(acc);
  };
  useEffect(() => { loadCounts(); }, [date, shiftId, departTimes]);

  // Load car plan overrides per depart time
  const loadCarPlan = async () => {
    if (!date || !shiftId || departTimes.length===0) { setCarPlan({}); return; }
    const acc = {};
    for (const dt of departTimes) {
      const rows = await fetchJSON(`/api/ot/cars?date=${date}&shiftId=${shiftId}&departTimeId=${dt.id}`) || [];
      const m = {};
      for (const r of (Array.isArray(rows)?rows:[])) m[r.route_id] = Number(r.car_count)||0;
      acc[dt.id] = m;
    }
    setCarPlan(acc);
  };
  useEffect(() => { loadCarPlan(); }, [date, shiftId, departTimes]);

  const findPlantIdByCode = (code) => (plants.find(p=>p.code===code)?.id);

  const calcVehicles = (people) => {
    const n = Number(people)||0;
    if (n <= 6) return 0;
    return Math.ceil(n/50);
  };

  const handleSaveAsImage = async () => {
    if (!captureRef.current) return;
    const canvas = await html2canvas(captureRef.current, {
      backgroundColor: isNightShift ? '#000000' : '#ffffff',
    });
    const link = document.createElement('a');
    link.download = `truck-table-${date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  const handleLogout = () => { try { localStorage.removeItem('token'); localStorage.removeItem('user'); } catch {} router.push('/'); };
  
  // Night shift detection (กะกลางคืน)
  // แก้หน้างาน ให้กะกลางคืน (19:50) พื้นหลังดำ และเลื่อน 19:50 ไปซ้ายสุด และ เปลี่ยนจากเวลาออกเป็นเวลาเข้า
  //
  //
  //
  //
  //
  const isNightShift = useMemo(() => {
    try {
      const s = shifts.find(x => x.id === shiftId);
      const name = String(s?.name_th || s?.name_en || '');
      return /กลางคืน/i.test(name) || /night/i.test(name);
    } catch { return false; }
  }, [shifts, shiftId]);
  // For display: always show entry times (is_entry=1) on the left, followed by exit times
  const displayDepartTimes = useMemo(() => {
    let list = Array.isArray(departTimes) ? [...departTimes] : [];
    // Apply server-side hides for current date+shift (hidden for everyone)
    if (Array.isArray(hiddenDepartTimeIds) && hiddenDepartTimeIds.length) {
      const setIds = new Set(hiddenDepartTimeIds);
      list = list.filter(dt => !setIds.has(dt.id));
    }
    // Auto-hide empties dynamically for this date when enabled
    if (autoHideEnabled && countsBy && Object.keys(countsBy).length) {
      list = list.filter(dt => {
        const rec = countsBy[dt.id] || { ttl: {} };
        let ttlTotal = 0;
        for (const v of Object.values(rec.ttl || {})) ttlTotal += Number(v)||0;
        return ttlTotal > 0; // keep only columns that have numbers
      });
    }
    return list.sort((a,b) => {
      const ae = Number(a?.is_entry)||0; const be = Number(b?.is_entry)||0; // entry=1 should come first
      if (ae !== be) return be - ae; // 1 before 0
      const ta = String(a?.time||'');
      const tb = String(b?.time||'');
      return ta.localeCompare(tb);
    });
  }, [departTimes, hiddenDepartTimeIds, autoHideEnabled, countsBy]);
  //
  //
  //
  //
  //
  const openCarEdit = (dt, route, ttl) => {
    if (!isAdminga) return; // only adminga can edit
    const curr = Number(carPlan?.[dt.id]?.[route.id] ?? calcVehicles(ttl));
    setCarModal({ open:true, dt, route, value: curr });
  };
  const saveCarPlan = async () => {
    if (!carModal.open || !carModal.dt || !carModal.route) return;
    try {
      const body = { the_date: date, shift_id: shiftId, depart_time_id: carModal.dt.id, route_id: carModal.route.id, car_count: Math.max(0, Number(carModal.value)||0) };
      await postJSON('/api/ot/cars', body);
      setCarModal({ open:false, dt:null, route:null, value:0 });
      await loadCarPlan();
    } catch (e) {
      alert(String(e.message||e));
    }
  };
  const closeCarModal = () => setCarModal({ open:false, dt:null, route:null, value:0 });

  // Compute empty depart-time ids for a shift (no numbers at all)
  async function computeEmptyTimesForShift(targetShiftId){
    const times = await fetchJSON(`/api/ot/depart-times?shiftId=${targetShiftId}`, {}, { cache:'no-store' }) || [];
    const emptyIds = [];
    for (const t of (Array.isArray(times)? times : [])) {
      const rows = await fetchJSON(`/api/ot/counts?date=${date}&shiftId=${targetShiftId}&departTimeId=${t.id}`) || [];
      let total = 0;
      for (const r of (Array.isArray(rows)? rows: [])) total += Number(r.count)||0;
      if (total === 0) emptyIds.push(t.id);
    }
    return emptyIds;
  }

  // Toggle: if currently hidden -> clear for both shifts; else compute empties and hide for both shifts
  const toggleHideEmptyTimes = async () => {
    if (!isAdminga) return;
    try {
      const newEnabled = !autoHideEnabled;
      await postJSON('/api/ot/settings', { name: 'auto_hide_empty_times', value: String(newEnabled) });
      setAutoHideEnabled(newEnabled);
      // When turning off, clear hides for current date; when turning on, effect will compute & post
      if (!newEnabled) {
        // Clear hides for current date when turning off
        await Promise.all((Array.isArray(shifts)?shifts:[]).map(s => postJSON('/api/ot/time-hides', { the_date: date, shift_id: s.id, depart_time_ids: [] })));
      }
      await loadHiddenTimes(shiftId);
    } catch (e) {
      alert(String(e?.message||e));
    }
  };

  // Greeting labels
  const welcomeText = useMemo(() => formatWelcome(user, departments, plants), [user, departments, plants]);

  return (
    <div style={{
      ...styles.wrapper,
      ...(isNightShift ? { background: '#000000' } : {})
    }}>
      <div style={styles.stack}>
        {/* Panel: Header */}
        <div style={{ ...styles.panelCard, paddingBottom: 16 }}>
          <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>ตารางจัดรถขากลับ</h1>
            <div style={{ color:'#2f3e4f', fontWeight:600 }}>
              ยินดีต้อนรับ, {welcomeText}
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ fontSize:18, color:'#2f3e4f' }}>{new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' })}</div>
            <button onClick={()=>router.push('/')} style={{ ...styles.logoutBtn, background:'#34495e' }}>กลับเมนูหลัก</button>
            <button onClick={handleLogout} style={styles.logoutBtn}>ออกจากระบบ</button>
          </div>
          </div>
        </div>
        {/* Capture Wrapper: Controls + Table */}
        <div ref={captureRef}>
          {/* Panel: Controls */}
          <div style={{ ...styles.panelCard, paddingTop: 16 }}>
            <div style={styles.controls}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={styles.label}>เลือกวันที่:</span>
              <input type="date" value={date} onChange={e=> setDate(e.target.value)} style={styles.input} />
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={styles.label}>กะ:</span>
              <select value={shiftId||''} onChange={e=> setShiftId(Number(e.target.value)||null)} style={styles.input}>
                {shifts.map(s => <option key={s.id} value={s.id}>{s.name_th || s.name_en}</option>)}
              </select>
            </div>
            <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10 }}>
              <button style={{ ...styles.primaryBtn, marginLeft:0 }} onClick={handleSaveAsImage}>บันทึกรูปภาพ</button>
              {isAdminga && (
                <button type="button" onClick={toggleHideEmptyTimes} style={{ ...styles.primaryBtn, marginLeft:0, background:'#8e44ad' }}>
                  {autoHideEnabled ? 'ปิดซ่อนอัตโนมัติ' : 'ซ่อนอัตโนมัติ'}
                </button>
              )}
            </div>
            </div>
          </div>
          {/* Panel: Table */}
          <div style={{ ...styles.panelCardTight }}>
            <div style={{ width:'100%', overflowX:'auto' }}>
              <table style={styles.table}>
            <thead>
              <tr>
                <th style={{...styles.thMain, width:280, textAlign:'center'}} rowSpan={2}>สายรถ</th>
                {displayDepartTimes.map((dt, idx) => (
                  <th
                    key={dt.id}
                    colSpan={(plantsSorted?.length || 0) + 2}
                    style={{...styles.thTime, background:getTimeColor(idx)}}
                  >
                    {(() => { const t = String(dt.time).slice(0,5); const prefix = Number(dt.is_entry)? 'เวลาเข้า' : 'เวลาออก'; return (<>{prefix} <strong>{t}</strong></>); })()}
                  </th>
                ))}
              </tr>
              <tr>
                {displayDepartTimes.map((dt) => (
                  <Fragment key={`hdr-${dt.id}`}>
                    {plantsSorted.map(p => <th key={`p-${dt.id}-${p.id}`} style={styles.thMain}>{p.code}</th>)}
                    <th key={`ttl-${dt.id}`} style={styles.thMain}>TTL</th>
                    <th
                      key={`car-${dt.id}`}
                      style={{ ...styles.thMain, whiteSpace: 'normal', lineHeight: 1.2, paddingTop: 6, paddingBottom: 6 }}
                    >
                      จำนวน<wbr/>รถ
                    </th>
                  </Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {routes.map((r, index) => (
                <tr key={r.id}>
                  <td style={styles.tdRoute}><span style={styles.routeIndex}>{index+1}.</span> <span>{r.name}</span></td>
                  {displayDepartTimes.map((dt, dtIdx) => {
                    const rec = countsBy[dt.id] || { map:{}, ttl:{} };
                    const ttl = Number(rec.ttl?.[r.id]||0);
                    return (
                      <Fragment key={`row-${r.id}-${dt.id}`}>
                        {plantsSorted.map(p => {
                          const pid = p.id; const val = Number(rec.map?.[r.id]?.[pid]||0);
                          return (
                            <td key={`cell-${dt.id}-${r.id}-${pid}`} style={{ ...styles.tdCell, background: getTimeBodyBg(dtIdx) }}>
                              {val>0 ? <span style={{ fontWeight: 700 }}>{val} </span> : ''}
                            </td>
                          );
                        })}
                        <td key={`ttl-${dt.id}-${r.id}`} style={{...styles.tdCell, background: getTimeTotalBg(dtIdx)}}>{ttl>0? <span style={{ fontWeight: 800 }}>{ttl} </span> : ''}</td>
                        <td
                          key={`car-${dt.id}-${r.id}`}
                          style={{
                            ...styles.tdCell,
                            cursor: isAdminga ? 'pointer' : 'default',
                            background: getTimeCarBg(dtIdx)
                          }}
                          onClick={() => openCarEdit(dt, r, ttl)}
                        >
                          <span style={{ fontWeight: 900 }}>
                            {(() => { const c = Number(carPlan?.[dt.id]?.[r.id] ?? calcVehicles(ttl)) || 0; return `${c} คัน`; })()}
                          </span>
                        </td>
                      </Fragment>
                    );
                  })}
                </tr>
              ))}

              {/* Totals row */}
              <tr key="totals-row">
                <td style={styles.tdRouteTotal}><strong>รวม</strong></td>
                {displayDepartTimes.map((dt, dtIdx) => {
                  const rec = countsBy[dt.id] || { map:{}, ttl:{} };
                  // Sum per plant across all routes
                  const plantTotals = plantsSorted.map((p) => {
                    let sum = 0;
                    for (const r of routes) {
                      sum += Number(rec.map?.[r.id]?.[p.id] || 0);
                    }
                    return sum;
                  });
                  // Sum TTL across routes
                  let ttlTotal = 0;
                  for (const r of routes) ttlTotal += Number(rec.ttl?.[r.id] || 0);
                  // Sum vehicles (use override if exists, else derived from ttl)
                  let totalVehicles = 0;
                  for (const r of routes) {
                    const rTtl = Number(rec.ttl?.[r.id] || 0);
                    const cars = Number(carPlan?.[dt.id]?.[r.id] ?? calcVehicles(rTtl)) || 0;
                    totalVehicles += cars;
                  }
                  return (
                    <Fragment key={`totals-${dt.id}`}>
                      {plantTotals.map((val, i) => (
                        <td key={`tot-${dt.id}-p-${i}`} style={{ ...styles.tdTotal, background: getTimeBodyBg(dtIdx) }}><strong>{val>0 ? val : ''}</strong></td>
                      ))}
                      <td key={`tot-${dt.id}-ttl`} style={{ ...styles.tdTotal, background: getTimeTotalBg(dtIdx) }}><strong>{ttlTotal>0 ? ttlTotal : ''}</strong></td>
                      <td key={`tot-${dt.id}-cars`} style={{ ...styles.tdTotal, background: getTimeCarBg(dtIdx) }}><strong>{`${totalVehicles} คัน`}</strong></td>
                    </Fragment>
                  );
                })}
              </tr>
            </tbody>
              </table>
            </div>
          </div>
        </div>

        {carModal.open && (
          <>
            <div style={styles.overlay} onClick={closeCarModal} />
            <div style={styles.modal}
                 onClick={(e)=> e.stopPropagation()}>
              <h2 style={styles.modalTitle}>แก้ไขจำนวนรถ</h2>
              <div style={{ marginBottom:10, color:'#2c3e50' }}>
                สายรถ: <strong>{carModal.route?.name}</strong> | {Number(carModal.dt?.is_entry)? 'เวลาเข้า' : 'เวลาออก'} <strong>{String(carModal.dt?.time).slice(0,5)}</strong>
              </div>
              <div style={styles.modalFormGroup}>
                <label style={styles.modalLabel}>จำนวนรถ:</label>
                <input type="number" min={0} value={carModal.value}
                  onChange={(e)=> setCarModal(m=>({ ...m, value: Math.max(0, Number(e.target.value)||0) }))}
                  onKeyDown={(e)=>{ if (e.key==='Enter') saveCarPlan(); }}
                  style={styles.modalInput}
                  autoFocus
                />
              </div>
              <div style={styles.modalButtonGroup}>
                <button style={styles.confirmButton} onClick={saveCarPlan}>บันทึก</button>
                <button style={styles.cancelButton} onClick={closeCarModal}>ยกเลิก</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight:'100vh', background:'#f0f2f5', padding:20 },
  // stack and panel layout
  stack: { display:'flex', flexDirection:'column', gap:16, width:'100%', maxWidth:1340, margin:'0 auto' },
  panelCard: { background:'#fff', borderRadius:24, width:'100%', padding:24, boxShadow:'0 8px 30px rgba(0,0,0,0.12)' },
  panelCardTight: { background:'#fff', borderRadius:24, width:'100%', padding:0, boxShadow:'0 8px 30px rgba(0,0,0,0.12)', overflow:'hidden' },
  headerRow: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 },
  title: { fontSize:28, fontWeight:900, margin:0, color:'#2f3e4f' },
  controls: { display:'flex', alignItems:'center', gap:16, background:'#f7f9fb', borderRadius:14, padding:12, marginBottom:14, flexWrap:'wrap' },
  label: { fontWeight:700, color:'#2f3e4f' },
  input: { padding:'10px 12px', borderRadius:10, border:'1px solid #bdc3c7', background:'#fff', fontSize:16, minWidth:120 },
  primaryBtn: { padding:'10px 14px', borderRadius:10, background:'#1f8ef1', color:'#fff', border:'none', fontWeight:800, cursor:'pointer', marginLeft:'auto' },
  logoutBtn: { padding:'8px 12px', borderRadius:10, background:'#e74c3c', color:'#fff', border:'none', fontWeight:800, cursor:'pointer' },
  table: { width:'100%', borderCollapse:'collapse', tableLayout:'fixed' },
  thMain: { background:'#102a3b', color:'#fff', padding:8, textAlign:'center', fontWeight:900, whiteSpace:'nowrap', fontSize:12, border:'1px solid #e6edf3' },
  thTime: { color:'#0f2a40', padding:8, textAlign:'center', fontWeight:900, fontSize:14, border:'1px solid #e6edf3' },
  tdRoute: { border:'1px solid #dfe6ee', padding:8, fontWeight:800, color:'#2f3e4f', width:280, background:'#ffffff', fontSize:13, whiteSpace:'nowrap' },
  routeIndex: { display:'inline-block', width:24, textAlign:'right', marginRight:6 },
  tdCell: { border:'1px solid #e6edf3', padding:6, minWidth:60, height:36, background:'#ffffff', textAlign:'center', fontSize:12 },
  tdTotal: { border:'1px solid #e6edf3', padding:6, minWidth:60, height:36, background:'#f6fbff', textAlign:'center', fontSize:12 },
  tdRouteTotal: { border:'1px solid #dfe6ee', padding:8, fontWeight:900, color:'#2f3e4f', width:280, background:'#eef6ff', fontSize:13, whiteSpace:'nowrap', textAlign:'center' },
  overlay: { position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000 },
  modal: { background:'#fff', padding:30, borderRadius:12, boxShadow:'0 10px 30px rgba(0,0,0,0.2)', width:'90%', maxWidth:500, zIndex:1001, position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)' },
  modalTitle: { fontSize:22, fontWeight:600, color:'#2c3e50', marginBottom:20, textAlign:'center' },
  modalFormGroup: { marginBottom:15 },
  modalLabel: { display:'block', marginBottom:5, fontWeight:500, color:'#34495e' },
  modalInput: { width:'100%', padding:10, borderRadius:8, border:'1px solid #bdc3c7', boxSizing:'border-box' },
  modalButtonGroup: { display:'flex', justifyContent:'flex-end', gap:10, marginTop:20 },
  confirmButton: { padding:'12px 20px', border:'none', borderRadius:8, backgroundColor:'#2ecc71', color:'#fff', fontWeight:600, cursor:'pointer' },
  cancelButton: { padding:'12px 20px', border:'1px solid #bdc3c7', borderRadius:8, backgroundColor:'transparent', color:'#7f8c8d', fontWeight:600, cursor:'pointer' },
};

function getTimeColor(idx){
  const palette = ['#FFFB0D', '#F562D6', '#02AE4E', '#00B0EF', '#F07D2E', '#7230A0'];
  return palette[idx % palette.length];
}

// Color utils: blend a base color with white to get softer shades for cell backgrounds
function hexToRgb(hex){
  let c = (hex || '').replace('#','');
  if (c.length === 3) c = c.split('').map((ch) => ch + ch).join('');
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}
function rgbToHex(r,g,b){
  const toHex = (n) => n.toString(16).padStart(2, '0');
  return `#${toHex(Math.min(255, Math.max(0, r)))}${toHex(Math.min(255, Math.max(0, g)))}${toHex(Math.min(255, Math.max(0, b)))}`;
}
// alpha: 0..1, contribution of base color vs white
function blendWithWhite(hex, alpha){
  const { r, g, b } = hexToRgb(hex);
  const nr = Math.round(r * alpha + 255 * (1 - alpha));
  const ng = Math.round(g * alpha + 255 * (1 - alpha));
  const nb = Math.round(b * alpha + 255 * (1 - alpha));
  return rgbToHex(nr, ng, nb);
}
// Derive per-time body and car cell backgrounds
function getTimeBodyBg(idx){
  // Changed: return pure white per user request (previously blended color)
  return '#ffffff';
}
function getTimeTotalBg(idx){
  const base = getTimeColor(idx);
  return blendWithWhite(base, 0.14); // even lighter for totals
}
function getTimeCarBg(idx){
  const base = getTimeColor(idx);
  return blendWithWhite(base, 0.32); // slightly stronger shade
}
