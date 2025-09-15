"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatWelcome } from '@/lib/formatters';
import html2canvas from "html2canvas";

function ymd(d){
  // Build YYYY-MM-DD in local time to avoid UTC shift (which caused wrong weekend coloring)
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function parseDate(s){ return new Date(s+"T00:00:00"); }
function addDays(d, n){ const x = new Date(d); x.setDate(x.getDate()+n); return x; }
function isWeekend(dateStr){ const d = new Date(dateStr+"T00:00:00"); const w = d.getDay(); return w===0 || w===6; }
function fmtMoney(n){ const v = Number(n||0); return v.toLocaleString('th-TH',{minimumFractionDigits:2, maximumFractionDigits:2}); }
function fmtInt(n){ const v = Number(n||0); return v.toLocaleString('en-US'); }

export default function VendorCostsPage(){
  // session
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [plants, setPlants] = useState([]);
  const [departments, setDepartments] = useState([]);
  useEffect(()=>{ try{ setToken(localStorage.getItem('token')||''); setUser(JSON.parse(localStorage.getItem('user')||'null')); }catch{} },[]);
  // Load minimal masters for greeting formatting
  useEffect(()=>{(async()=>{
    try {
      const hdr = token ? { Authorization:`Bearer ${token}` } : {};
      const [p, d] = await Promise.all([
        fetch('/api/ot/plants', { headers: hdr }),
        fetch('/api/ot/departments', { headers: hdr })
      ]);
      const [pr, dr] = await Promise.all([p.json().catch(()=>[]), d.json().catch(()=>[])]);
      setPlants(Array.isArray(pr)?pr:[]);
      setDepartments(Array.isArray(dr)?dr:[]);
    } catch { setPlants([]); setDepartments([]); }
  })();}, [token]);

  const welcomeText = useMemo(()=> formatWelcome(user, departments, plants), [user, departments, plants]);
  const isAdminga = useMemo(()=>{ const name = String(user?.username||'').toLowerCase(); return name==='adminga' || !!user?.is_super_admin; },[user]);

  // filter
  const today = new Date();
  const [startDate, setStartDate] = useState(()=>{ const d=new Date(today); d.setDate(d.getDate()-29); return ymd(d); });
  const [endDate, setEndDate] = useState(ymd(today));
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  // data
  const [payments, setPayments] = useState({}); // key `${date}|${route_id}` -> { pay_flat, ... }
  const [lockInfo, setLockInfo] = useState({ the_date:null, is_locked:0 });
  const [rates, setRates] = useState({
    rate_flat: 0,
    rate_wait: 0,
    rate_ot_normal: 0,
    rate_trip: 0,
    rate_ot_holiday: 0,
    rate_trip_night: 0,
  });

  // ui
  const [edit, setEdit] = useState({ open:false, date:null, route:null, value:"" });
  const [costEdit, setCostEdit] = useState({ open:false, key:null, label:'', value:'' });
  const tableRef = useRef(null);

  // load routes
  useEffect(()=>{(async()=>{ const res=await fetch('/api/ot/routes'); const r=await res.json(); setRoutes(r||[]); if(r?.length && !selectedRouteId) setSelectedRouteId(r[0].id); })();},[]);

  // build days in range
  const days = useMemo(()=>{ const s=parseDate(startDate), e=parseDate(endDate); const out=[]; for(let d=new Date(s); d<=e; d=addDays(d,1)) out.push(ymd(d)); return out; },[startDate,endDate]);

  // load payments (call per day to avoid changing API)
  useEffect(()=>{(async()=>{
    if(!startDate||!endDate||!selectedRouteId) return;
    const dayList = days;
    const results = await Promise.all(dayList.map(async (d)=>{
      const res = await fetch(`/api/vendor/payments?date=${d}`);
      try { return await res.json(); } catch { return []; }
    }));
    const map={};
    results.forEach((rows, idx)=>{
      const d = dayList[idx];
      (rows||[]).filter(r=>r.route_id===Number(selectedRouteId)).forEach(row=>{ map[`${d}|${row.route_id}`] = row; });
    });
    setPayments(map);
  })();},[startDate,endDate,selectedRouteId,days.length]);

  // lock load for endDate (like OT page)
  useEffect(()=>{(async()=>{ if(!endDate) return; const res=await fetch(`/api/ot/locks?date=${endDate}`); const data=await res.json(); setLockInfo(data||{the_date:endDate,is_locked:0}); })();},[endDate]);

  // load rate (Cost column) from DB via /api/vendor/rates per route (persistent across users)
  useEffect(()=>{(async()=>{
    if(!selectedRouteId) return;
    const defaults = { rate_flat:0, rate_wait:0, rate_ot_normal:0, rate_trip:0, rate_ot_holiday:0, rate_trip_night:0 };
    try {
      const res = await fetch(`/api/vendor/rates?route_id=${selectedRouteId}`);
      const data = await res.json();
      if (res.ok && data && typeof data === 'object') {
        setRates({
          rate_flat: Number(data.rate_flat||0),
          rate_wait: Number(data.rate_wait||0),
          rate_ot_normal: Number(data.rate_ot_normal||0),
          rate_trip: Number(data.rate_trip||0),
          rate_ot_holiday: Number(data.rate_ot_holiday||0),
          rate_trip_night: Number(data.rate_trip_night||0),
        });
      } else {
        setRates(defaults);
      }
    } catch { setRates(defaults); }
  })();},[selectedRouteId]);

  // actions
  function openCell(dateStr){ if(lockInfo?.is_locked && !isAdminga) return; if(isWeekend(dateStr)) return; const route = routes.find(r=>r.id===Number(selectedRouteId)); const row = payments[`${dateStr}|${route?.id}`]||{}; setEdit({ open:true, date:dateStr, route, value:String(row.pay_flat??0) }); }
  async function saveCell(){ if(!edit.open) return; const routeId=edit.route?.id; const val=Math.max(0, Number(edit.value)||0); const body={ the_date: edit.date, route_id: routeId, key:'pay_flat', value: val };
    const res = await fetch('/api/vendor/payments',{ method:'POST', headers:{'Content-Type':'application/json', ...(token?{Authorization:`Bearer ${token}`}:{}) }, body: JSON.stringify(body)});
    if(!res.ok){ alert('บันทึกไม่สำเร็จ'); return; }
    setPayments(prev=>{ const k = `${edit.date}|${routeId}`; const row = { ...(prev[k]||{}), the_date: edit.date, route_id: routeId, pay_flat: val }; return { ...prev, [k]: row }; }); setEdit({ open:false, date:null, route:null, value:"" }); }
  async function toggleLock(force){ const next = typeof force==='boolean' ? (force?1:0) : (lockInfo?.is_locked?0:1); setLockInfo(prev=>({...(prev||{}), the_date:endDate, is_locked:next})); const res=await fetch('/api/ot/locks',{method:'POST', headers:{'Content-Type':'application/json', ...(token?{Authorization:`Bearer ${token}`}:{})}, body: JSON.stringify({ the_date:endDate, is_locked:next })}); if(!res.ok) setLockInfo(prev=>({...(prev||{}), is_locked: next?0:1 })); }
  function logout(){ localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='/'; }
  async function saveImage(){ const el = document.getElementById('vendor-costs-card'); if(!el) return; const canvas = await html2canvas(el); const a=document.createElement('a'); a.download=`vendor-costs-${endDate}.png`; a.href=canvas.toDataURL(); a.click(); }

  // Export the visible table as Excel (HTML .xls)
  function downloadExcel(){
    const table = tableRef.current;
    if (!table) return;
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${table.outerHTML}</body></html>`;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const routeName = (routes.find(r=>r.id===Number(selectedRouteId))?.name || 'all').replace(/\s+/g,'_');
    a.download = `vendor-costs-${startDate}-to-${endDate}-${routeName}.xls`;
    a.href = url; a.click();
    URL.revokeObjectURL(url);
  }

  // edit Cost (rates)
  function openCostEdit(key,label){ if(lockInfo?.is_locked && !isAdminga) return; const mapKeyToRate = { pay_flat:'rate_flat', pay_wait:'rate_wait', pay_ot_normal:'rate_ot_normal', pay_trip:'rate_trip', pay_ot_holiday:'rate_ot_holiday', pay_trip_night:'rate_trip_night' }; const rateKey = mapKeyToRate[key]; const current = rates[rateKey] ?? 0; setCostEdit({ open:true, key, label, value: String(current) }); }
  async function saveCostEdit(){
    if(!costEdit.open || !selectedRouteId) return;
    const value = Math.max(0, Number(costEdit.value)||0);
    const mapKeyToRate = { pay_flat:'rate_flat', pay_wait:'rate_wait', pay_ot_normal:'rate_ot_normal', pay_trip:'rate_trip', pay_ot_holiday:'rate_ot_holiday', pay_trip_night:'rate_trip_night' };
    const rateKey = mapKeyToRate[costEdit.key];
    const updated = { ...rates, [rateKey]: value };
    setRates(updated);
    // persist to DB via vendor/rates API (requires admin/super admin)
    try {
      const res = await fetch('/api/vendor/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token?{Authorization:`Bearer ${token}`}:{}) },
        body: JSON.stringify({ route_id: Number(selectedRouteId), values: updated })
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>({}));
        alert(String(err?.error || 'บันทึกไม่สำเร็จ'));
      }
    } catch (e) {
      alert('บันทึกไม่สำเร็จ');
    }
    setCostEdit({ open:false, key:null, label:'', value:'' });
  }

  // derived
  const selectedRoute = useMemo(()=> routes.find(r=>r.id===Number(selectedRouteId)) || null, [routes, selectedRouteId]);
  const totalDays = useMemo(()=> days.reduce((sum,d)=> sum + (isWeekend(d)?0: (payments[`${d}|${selectedRouteId}`]?.pay_flat||0)), 0), [days, payments, selectedRouteId]);
  const rangeDays = useMemo(()=> days.length, [days]);
  const totalCost = useMemo(()=> Number(rates.rate_flat||0) * rangeDays, [rangeDays, rates]);

  // per-type aggregated totals based on range days (Cost x ผลรวม)
  const totalFlatByRange = useMemo(()=> Number(rates.rate_flat||0) * rangeDays, [rates.rate_flat, rangeDays]);
  const totalWaitByRange = useMemo(()=> Number(rates.rate_wait||0) * rangeDays, [rates.rate_wait, rangeDays]);
  const totalOtnByRange  = useMemo(()=> Number(rates.rate_ot_normal||0) * rangeDays, [rates.rate_ot_normal, rangeDays]);
  const totalTripByRange = useMemo(()=> Number(rates.rate_trip||0) * rangeDays, [rates.rate_trip, rangeDays]);
  const totalOthByRange  = useMemo(()=> Number(rates.rate_ot_holiday||0) * rangeDays, [rates.rate_ot_holiday, rangeDays]);
  const totalTripNByRange= useMemo(()=> Number(rates.rate_trip_night||0) * rangeDays, [rates.rate_trip_night, rangeDays]);
  const grandTotalByRange = useMemo(() => (
    (totalFlatByRange||0) +
    (totalWaitByRange||0) +
    (totalOtnByRange||0) +
    (totalTripByRange||0) +
    (totalOthByRange||0) +
    (totalTripNByRange||0)
  ), [totalFlatByRange, totalWaitByRange, totalOtnByRange, totalTripByRange, totalOthByRange, totalTripNByRange]);

  // styles
  const styles = {
    page:{ padding:20, background:'#e9f0f6', minHeight:'100vh' },
    card:{ background:'#fff', borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,0.06)', padding:16 },
    headerRow:{ display:'flex', alignItems:'center', justifyContent:'space-between' },
    title:{ margin:0, color:'#16364e' },
    logout:{ background:'#e74c3c', color:'#fff', padding:'10px 16px', border:'none', borderRadius:12, fontWeight:800, cursor:'pointer' },
    controls:{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', marginTop:14 },
    label:{ fontWeight:800, color:'#16364e' },
    input:{ padding:'10px 12px', border:'1px solid #cfd8e3', borderRadius:10 },
    select:{ padding:'10px 12px', border:'1px solid #cfd8e3', borderRadius:10 },
  action:{ padding:'10px 12px', background:'#6c7a89', color:'#fff', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer' },
    tableWrap:{ overflowX:'auto', marginTop:14, border:'1px solid #d4e0ec', borderRadius:12, ...(lockInfo?.is_locked?{opacity:0.5, pointerEvents:'none', filter:'grayscale(0.6)'}:{}) },
    table:{ width:'100%', borderCollapse:'collapse' },
    th:{ background:'#17344f', color:'#fff', padding:'8px 10px', borderRight:'1px solid #113045', whiteSpace:'nowrap' },
    td:{ borderTop:'1px solid #e1e8f0', borderRight:'1px solid #eef2f6', padding:'10px', background:'#fff' },
  dayHead:{ width:40, minWidth:40, textAlign:'center', fontWeight:800, fontSize:12, padding:'4px 0' },
  dayCell:{ width:40, minWidth:40, textAlign:'center', fontWeight:800, cursor:'default', verticalAlign:'middle', padding:'2px 3px', whiteSpace:'nowrap', wordBreak:'normal', lineHeight:1.1 },
    weekendHead:{ background:'#ff4d4d' },
    weekdayHead:{ background:'#34b3ff' },
    weekdayCell:{ background:'#e8f6ff', color:'#0f2a40' },
    weekendCell:{ background:'#ff4d4d', color:'#fff', cursor:'not-allowed' },
  rotateNum:{ position:'static', transform:'none', display:'inline-block', whiteSpace:'nowrap', fontSize:12, lineHeight:1.1, zIndex:1, pointerEvents:'none', maxWidth:'100%', textAlign:'center' },
    footer:{ display:'flex', justifyContent:'flex-end', gap:12, marginTop:16 },
    approve:{ background:'#2ecc71', color:'#fff', border:'none', padding:'12px 18px', borderRadius:10, fontWeight:800, cursor:'pointer' },
    reject:{ background:'#e67e22', color:'#fff', border:'none', padding:'12px 18px', borderRadius:10, fontWeight:800, cursor:'pointer' },
    overlay:{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)' },
    modal:{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'#fff', padding:30, borderRadius:12, width:'90%', maxWidth:420, boxShadow:'0 10px 30px rgba(0,0,0,0.2)' },
    modalTitle:{ margin:'0 0 12px 0', color:'#17344f', fontSize:22, fontWeight:600, textAlign:'center' },
    modalInput:{ width:'100%', padding:'10px', border:'1px solid #cfd8e3', borderRadius:8 },
    modalBtns:{ display:'flex', gap:10, marginTop:12, justifyContent:'flex-end' },
  cancelGray:{ background:'#ffffff', color:'#7f8c8d', border:'1px solid #bdc3c7', padding:'12px 18px', borderRadius:10, fontWeight:700, cursor:'pointer' },
  };

  const todayStr = new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' });

  return (
    <div style={styles.page}>
      <div id="vendor-costs-card" style={styles.card}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>คำนวณค่าใช้จ่าย</h1>
            {user && <div style={{ color:'#2f3e4f', fontWeight:600 }}>ยินดีต้อนรับ, {welcomeText}</div>}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ fontSize:18, color:'#2f3e4f' }}>{todayStr}</div>
            <button onClick={()=>{ window.location.href='/'; }} style={{ ...styles.logout, background:'#34495e' }}>กลับเมนูหลัก</button>
            <button onClick={logout} style={styles.logout}>ออกจากระบบ</button>
          </div>
        </div>

        <div style={styles.controls}>
          <span style={styles.label}>เลือกวันที่:</span>
          <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={styles.input} />
          <span style={styles.label}>ถึงวันที่:</span>
          <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} style={styles.input} />
          <span style={styles.label}>สายรถ:</span>
          <select value={selectedRouteId||''} onChange={e=>setSelectedRouteId(Number(e.target.value)||null)} style={styles.select}>
            {routes.map(r=> <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <button onClick={saveImage} style={{...styles.action, background:'#34495e'}}>บันทึกรูปภาพ</button>
          <button onClick={downloadExcel} style={{...styles.action, background:'#2e7d32'}}>ดาวน์โหลด Excel</button>
        </div>

        <div style={styles.tableWrap}>
          <table ref={tableRef} style={styles.table}>
            <thead>
              <tr>
                <th style={{...styles.th, width:240}}>สายรถ</th>
                <th style={{...styles.th, width:120}}>Vendor</th>
                <th style={{...styles.th, width:160}}>Bus cost type</th>
                <th style={{...styles.th, width:120}}>Cost</th>
                {days.map(d=> {
                  const num = parseDate(d).getDate();
                  return (
                    <th key={d} style={{...styles.th, ...styles.dayHead, ...(isWeekend(d)?styles.weekendHead:styles.weekdayHead)}}>
                      {num}
                    </th>
                  );
                })}
                <th style={{...styles.th, width:120}}>ผลรวม</th>
                <th style={{...styles.th, width:140}}>Total cost</th>
              </tr>
            </thead>
            <tbody>
              {selectedRouteId && (()=>{
                const r = routes.find(x=>x.id===Number(selectedRouteId));
                const vendorName = r?.vendor || '';
                return (
                  <>
                    {/* รายเดือน (มีช่องวันให้กรอกเฉพาะ จ-ศ) */}
                    <tr>
                      <td style={{...styles.td, whiteSpace:'nowrap'}}>{r?.name}</td>
                      <td style={styles.td}>{vendorName}</td>
                      <td style={styles.td}>รายเดือน</td>
                      <td style={{...styles.td, textAlign:'right', cursor:(lockInfo?.is_locked && !isAdminga)?'default':'pointer'}} title="คลิกเพื่อแก้ไข" onClick={()=>openCostEdit('pay_flat','รายเดือน')}>{fmtMoney(rates.rate_flat)}</td>
                      {days.map(d=>{
                        const k=`${d}|${selectedRouteId}`; const v = payments[k]?.pay_flat||0;
                        const cellStyle = { ...styles.td, ...styles.dayCell };
                        return (
                          <td key={`flat-${d}`} style={cellStyle}>
                            {v ? <span style={styles.rotateNum}>{fmtInt(v)}</span> : ''}
                          </td>
                        );
                      })}
                      <td style={{...styles.td, textAlign:'right', fontWeight:900}}>{fmtInt(rangeDays)}</td>
                      <td style={{...styles.td, textAlign:'right', fontWeight:900}}>{fmtMoney(totalFlatByRange)}</td>
                    </tr>

                    {/* จอดรอ */}
                    <tr>
                      <td style={{...styles.td, whiteSpace:'nowrap'}}>{r?.name}</td>
                      <td style={styles.td}>{vendorName}</td>
                      <td style={styles.td}>จอดรอ</td>
                      <td style={{...styles.td, textAlign:'right', cursor:(lockInfo?.is_locked && !isAdminga)?'default':'pointer'}} title="คลิกเพื่อแก้ไข" onClick={()=>openCostEdit('pay_wait','จอดรอ')}>{fmtMoney(rates.rate_wait)}</td>
                      {days.map(d=>{
                        const k=`${d}|${selectedRouteId}`; const v = payments[k]?.pay_wait||0;
                        const cellStyle={ ...styles.td, ...styles.dayCell };
                        return (
                          <td key={`wait-${d}`} style={cellStyle}>{v ? <span style={styles.rotateNum}>{fmtInt(v)}</span> : ''}</td>
                        );
                      })}
                      <td style={{...styles.td, textAlign:'right', fontWeight:900}}>{fmtInt(rangeDays)}</td>
                      <td style={{...styles.td, textAlign:'right', fontWeight:900}}>{fmtMoney(totalWaitByRange)}</td>
                    </tr>
                    {/* OT เหมาวัน */}
                    <tr>
                      <td style={{...styles.td, whiteSpace:'nowrap'}}>{r?.name}</td>
                      <td style={styles.td}>{vendorName}</td>
                      <td style={styles.td}>OT เหมาวัน</td>
                      <td style={{...styles.td, textAlign:'right', cursor:(lockInfo?.is_locked && !isAdminga)?'default':'pointer'}} title="คลิกเพื่อแก้ไข" onClick={()=>openCostEdit('pay_ot_normal','OT เหมาวัน')}>{fmtMoney(rates.rate_ot_normal)}</td>
                      {days.map(d=>{
                        const k=`${d}|${selectedRouteId}`; const v = payments[k]?.pay_ot_normal||0;
                        const cellStyle={ ...styles.td, ...styles.dayCell };
                        return (
                          <td key={`otn-${d}`} style={cellStyle}>{v ? <span style={styles.rotateNum}>{fmtInt(v)}</span> : ''}</td>
                        );
                      })}
                      <td style={{...styles.td, textAlign:'right', fontWeight:900}}>{fmtInt(rangeDays)}</td>
                      <td style={{...styles.td, textAlign:'right', fontWeight:900}}>{fmtMoney(totalOtnByRange)}</td>
                    </tr>
                    {/* เหมาเที่ยว */}
                    <tr>
                      <td style={{...styles.td, whiteSpace:'nowrap'}}>{r?.name}</td>
                      <td style={styles.td}>{vendorName}</td>
                      <td style={styles.td}>เหมาเที่ยว</td>
                      <td style={{...styles.td, textAlign:'right', cursor:(lockInfo?.is_locked && !isAdminga)?'default':'pointer'}} title="คลิกเพื่อแก้ไข" onClick={()=>openCostEdit('pay_trip','เหมาเที่ยว')}>{fmtMoney(rates.rate_trip)}</td>
                      {days.map(d=>{
                        const k=`${d}|${selectedRouteId}`; const v = payments[k]?.pay_trip||0;
                        const cellStyle={ ...styles.td, ...styles.dayCell };
                        return (
                          <td key={`trip-${d}`} style={cellStyle}>{v ? <span style={styles.rotateNum}>{fmtInt(v)}</span> : ''}</td>
                        );
                      })}
                      <td style={{...styles.td, textAlign:'right', fontWeight:900}}>{fmtInt(rangeDays)}</td>
                      <td style={{...styles.td, textAlign:'right', fontWeight:900}}>{fmtMoney(totalTripByRange)}</td>
                    </tr>
                    {/* OT เหมาวันหยุด */}
                    <tr>
                      <td style={{...styles.td, whiteSpace:'nowrap'}}>{r?.name}</td>
                      <td style={styles.td}>{vendorName}</td>
                      <td style={styles.td}>OT เหมาวันหยุด</td>
                      <td style={{...styles.td, textAlign:'right', cursor:(lockInfo?.is_locked && !isAdminga)?'default':'pointer'}} title="คลิกเพื่อแก้ไข" onClick={()=>openCostEdit('pay_ot_holiday','OT เหมาวันหยุด')}>{fmtMoney(rates.rate_ot_holiday)}</td>
                      {days.map(d=>{
                        const k=`${d}|${selectedRouteId}`; const v = payments[k]?.pay_ot_holiday||0;
                        const cellStyle={ ...styles.td, ...styles.dayCell };
                        return (
                          <td key={`oth-${d}`} style={cellStyle}>{v ? <span style={styles.rotateNum}>{fmtInt(v)}</span> : ''}</td>
                        );
                      })}
                      <td style={{...styles.td, textAlign:'right', fontWeight:900}}>{fmtInt(rangeDays)}</td>
                      <td style={{...styles.td, textAlign:'right', fontWeight:900}}>{fmtMoney(totalOthByRange)}</td>
                    </tr>
                    {/* เหมาเที่ยวกะดึก */}
                    <tr>
                      <td style={{...styles.td, whiteSpace:'nowrap'}}>{r?.name}</td>
                      <td style={styles.td}>{vendorName}</td>
                      <td style={styles.td}>เหมาเที่ยวกะดึก</td>
                      <td style={{...styles.td, textAlign:'right', cursor:(lockInfo?.is_locked && !isAdminga)?'default':'pointer'}} title="คลิกเพื่อแก้ไข" onClick={()=>openCostEdit('pay_trip_night','เหมาเที่ยวกะดึก')}>{fmtMoney(rates.rate_trip_night)}</td>
                      {days.map(d=>{
                        const k=`${d}|${selectedRouteId}`; const v = payments[k]?.pay_trip_night||0;
                        const cellStyle={ ...styles.td, ...styles.dayCell };
                        return (
                          <td key={`tripn-${d}`} style={cellStyle}>{v ? <span style={styles.rotateNum}>{fmtInt(v)}</span> : ''}</td>
                        );
                      })}
                      <td style={{...styles.td, textAlign:'right', fontWeight:900}}>{fmtInt(rangeDays)}</td>
                      <td style={{...styles.td, textAlign:'right', fontWeight:900}}>{fmtMoney(totalTripNByRange)}</td>
                    </tr>

                    {/* Grand Total (sum of all Total cost rows) */}
                    <tr>
                      <td style={styles.td} colSpan={days.length + 5}></td>
                      <td style={{...styles.td, textAlign:'right', fontWeight:900}}>{fmtMoney(grandTotalByRange)}</td>
                    </tr>
                  </>
                );
              })()}
            </tbody>
          </table>
        </div>

        <div style={styles.footer}>
          <button onClick={()=>toggleLock(true)} style={styles.approve}>บันทึกข้อมูล</button>
          <button onClick={()=>toggleLock(false)} style={styles.cancelGray}>ยกเลิก</button>
        </div>
      </div>

      {edit.open && (
        <>
          <div style={styles.overlay} onClick={()=>setEdit({ open:false, date:null, route:null, value:'' })} />
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>แก้ไขจำนวน (รายเดือน) {edit.route?.name} - {edit.date}</h2>
            <input type="number" min={0} value={edit.value} onChange={e=>setEdit(prev=>({ ...prev, value: e.target.value.replace(/[^0-9]/g,'') }))} style={styles.modalInput} onKeyDown={e=>{ if(e.key==='Enter') saveCell(); }} autoFocus />
            <div style={styles.modalBtns}>
              <button onClick={saveCell} style={{...styles.approve, padding:'8px 14px'}}>บันทึก</button>
              <button onClick={()=>setEdit({ open:false, date:null, route:null, value:'' })} style={{...styles.reject, padding:'8px 14px'}}>ยกเลิก</button>
            </div>
          </div>
        </>
      )}

      {costEdit.open && (
        <>
          <div style={styles.overlay} onClick={()=>setCostEdit({ open:false, key:null, label:'', value:'' })} />
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>แก้ไข Cost ({costEdit.label}) {selectedRoute?.name ? `- ${selectedRoute.name}` : ''}</h2>
            <div style={{ marginBottom:6, color:'#34495e', fontWeight:500 }}>จำนวน:</div>
            <input type="number" step="0.01" min={0}
              value={costEdit.value}
              onChange={e=>{
                const raw = e.target.value.replace(/[^0-9.]/g,'');
                const parts = raw.split('.');
                const safe = parts.length>2 ? `${parts[0]}.${parts.slice(1).join('')}` : raw; // keep only first dot
                setCostEdit(prev=>({ ...prev, value: safe }));
              }}
              style={styles.modalInput}
              onKeyDown={e=>{ if(e.key==='Enter') saveCostEdit(); }}
              autoFocus />
            <div style={styles.modalBtns}>
              <button onClick={saveCostEdit} style={{...styles.approve, padding:'8px 14px'}}>บันทึก</button>
              <button onClick={()=>setCostEdit({ open:false, key:null, label:'', value:'' })} style={{...styles.cancelGray, padding:'8px 14px'}}>ยกเลิก</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
