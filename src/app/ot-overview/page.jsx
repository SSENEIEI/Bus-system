"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import { formatWelcome } from '@/lib/formatters';

export default function OtOverview() {
  const router = useRouter();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [plants, setPlants] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [shifts, setShifts] = useState([]);
  // Manual-entry counts for grid: key `${shiftId}:${deptId}` -> number
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [lockInfo, setLockInfo] = useState({ the_date:null, is_locked:0 });
  const isAdminga = useMemo(() => String(user?.username||'').toLowerCase()==='adminga', [user]);
  const captureRef = useRef(null);
  const welcomeText = useMemo(() => formatWelcome(user, departments, plants), [user, departments, plants]);

  const plantColors = useMemo(() => ({ AC: '#2ecc71', RF: '#f1c40f', SSC: '#12b3c7' }), []);
  const getPlantColor = (code) => plantColors[code] || '#95a5a6';

  const fetchMasters = async () => {
    const token = localStorage.getItem('token');
    const [p, d, s] = await Promise.all([
      fetch('/api/ot/plants', { headers:{ Authorization:`Bearer ${token}` }}),
      fetch('/api/ot/departments', { headers:{ Authorization:`Bearer ${token}` }}),
      fetch('/api/ot/shifts', { headers:{ Authorization:`Bearer ${token}` }}),
    ]);
    const [plants, departments, shifts] = await Promise.all([p.json(), d.json(), s.json()]);
    setPlants(Array.isArray(plants) ? plants : []);
    setDepartments(Array.isArray(departments) ? departments : []);
    setShifts(Array.isArray(shifts) ? shifts : []);
  };

  // Load and persist manual grid counts from DB (ot_overview_counts)
  const loadOverviewCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/ot/overview-counts?date=${date}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const rows = await res.json();
      if (res.ok && Array.isArray(rows)) {
        const map = {};
        rows.forEach(r => { map[keyOf(r.shift_id, r.department_id)] = Math.max(0, Number(r.count)||0); });
        setCounts(map);
      } else {
        setCounts({});
      }
    } catch { setCounts({}); }
  };
  useEffect(() => { loadOverviewCounts(); }, [date]);

  useEffect(() => { fetchMasters(); }, []);
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user')||'null');
      setUser(u);
    } catch {}
  }, []);
  useEffect(() => { /* grid manual now */ fetchShopPlan(); }, [date]);
  // Load lock for selected date
  useEffect(()=>{(async()=>{ try { const res=await fetch(`/api/ot/locks?date=${date}`); const data=await res.json(); setLockInfo(data||{the_date:date,is_locked:0}); } catch { setLockInfo({ the_date:date, is_locked:0 }); } })();}, [date]);

  // Build dynamic plant code list (prefer AC/RF/SSC order, then others A-Z)
  const plantOrderPref = useMemo(() => ['AC','RF','SSC'], []);
  const plantCodesDynamic = useMemo(() => {
    const codes = Array.from(new Set(
      (plants.length ? plants.map(p=>p.code) : departments.map(d=>d.plant_code)).filter(Boolean)
    ));
    return codes.sort((a,b)=>{
      const ia = plantOrderPref.indexOf(a); const ib = plantOrderPref.indexOf(b);
      const sa = ia === -1 ? 999 : ia; const sb = ib === -1 ? 999 : ib;
      if (sa !== sb) return sa - sb; return (a||'').localeCompare(b||'');
    });
  }, [plants, departments, plantOrderPref]);
  const deptsFor = (code) => departments.filter(d => d.plant_code === code);

  const keyOf = (shiftId, deptId) => `${shiftId}:${deptId}`;
  const totalBy = (shiftId, deptId) => Number(counts[keyOf(shiftId, deptId)] || 0);

  // Per-shift total across all departments
  const totalShift = (shiftId) => {
    return departments.reduce((sum, d) => sum + Number(totalBy(shiftId, d.id) || 0), 0);
  };

  // Grand total across all shifts and departments
  const grandTotal = useMemo(() => shifts.reduce((s, sh) => s + totalShift(sh.id), 0), [shifts, departments, counts]);

  // Shop plan: auto calc + override API
  const [shopPlan, setShopPlan] = useState({ rice_shops: 0, minimart_shops: 0, noodle_shops: 0 });
  const [shopEdit, setShopEdit] = useState(false);
  const [shopHasOverride, setShopHasOverride] = useState(false); // true only when user saved manually in this session
  const computeAutoShopPlan = (t) => {
    if (t >= 1000) return { rice_shops: 4, minimart_shops: 2, noodle_shops: 2 };
    if (t >= 600) return { rice_shops: 1, minimart_shops: 1, noodle_shops: 2 };
    if (t >= 500) return { rice_shops: 2, minimart_shops: 1, noodle_shops: 1 };
    if (t >= 300) return { rice_shops: 1, minimart_shops: 1, noodle_shops: 1 };
    if (t >= 200) return { rice_shops: 1, minimart_shops: 1, noodle_shops: 0 };
    return { rice_shops: 0, minimart_shops: 0, noodle_shops: 0 };
  };

  const fetchShopPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/ot/shops?date=${date}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok && data) setShopPlan({
        rice_shops: Number(data.rice_shops)||0,
        minimart_shops: Number(data.minimart_shops)||0,
        noodle_shops: Number(data.noodle_shops)||0,
      });
      else setShopPlan(computeAutoShopPlan(grandTotal));
      // After load, treat as non-override so it can auto follow totals unless user edits and saves.
      setShopHasOverride(false);
    } catch { setShopPlan(computeAutoShopPlan(grandTotal)); }
  };

  useEffect(() => {
    // When totals change, if not in edit mode and no explicit override, recalc auto
    if (!shopEdit && !shopHasOverride) {
      const auto = computeAutoShopPlan(grandTotal);
      setShopPlan(auto);
      // Optionally auto-save when adminga to keep DB in sync
      (async ()=>{
        try {
          if (isAdminga) {
            const token = localStorage.getItem('token');
            await fetch('/api/ot/shops', { method:'POST', headers:{ 'Content-Type':'application/json', ...(token?{ Authorization:`Bearer ${token}` }:{}) }, body: JSON.stringify({ the_date: date, ...auto }) });
          }
        } catch {}
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grandTotal]);

  const saveShopPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/ot/shops', { method:'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ the_date: date, ...shopPlan }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'บันทึกล้มเหลว');
      setShopEdit(false);
      setShopHasOverride(true);
      await fetchShopPlan();
      alert('บันทึกจำนวนร้าน OT สำเร็จ');
    } catch (e) {
      alert(String(e.message||e));
    }
  };

  // Reset shops to auto-computed values and persist
  const resetShopPlan = async () => {
    const auto = computeAutoShopPlan(grandTotal);
    // For non-adminga: do local refresh only (no API write)
    if (!isAdminga) {
      setShopPlan(auto);
      setShopEdit(false);
      setShopHasOverride(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/ot/shops', { method:'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ the_date: date, ...auto }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'รีเฟรชไม่สำเร็จ');
      setShopPlan(auto);
      setShopEdit(false);
      setShopHasOverride(false);
      await fetchShopPlan();
    } catch (e) {
      // Even if save fails, revert UI to auto for convenience
      setShopPlan(auto);
      alert(String(e.message||e));
    }
  };

  // Nurse allocation per shift
  // Rule: per shift total people <200 => 0 nurse, >=200 => 1 nurse, >=1000 => 2 nurses
  // Admin (adminga) can override and save; otherwise auto-calculated from current totals.
  const [nursePlan, setNursePlan] = useState({}); // { [shift_id]: nurse_count }
  const [nurseEdit, setNurseEdit] = useState(false);
  const [nurseHasOverride, setNurseHasOverride] = useState(false);
  const nurseFromTotal = (t) => (t >= 1000 ? 2 : t >= 200 ? 1 : 0);
  const computeAutoNursePlan = () => {
    const obj = {};
    shifts.forEach(s => { obj[s.id] = nurseFromTotal(totalShift(s.id)); });
    return obj;
  };
  // When summary or shifts change, refresh auto values if not editing and no override saved
  useEffect(() => {
    if (!nurseEdit && !nurseHasOverride) {
      setNursePlan(computeAutoNursePlan());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counts, shifts]);

  const fetchNursePlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/ot/nurses?date=${date}`, { headers: { Authorization: `Bearer ${token}` } });
      const rows = await res.json();
      if (res.ok && Array.isArray(rows) && rows.length) {
        const obj = {};
        rows.forEach(r => { obj[r.shift_id] = Math.max(0, Number(r.nurse_count)||0); });
        setNursePlan(obj);
        const sum = Object.values(obj).reduce((a,b)=>a+Number(b||0),0);
        setNurseHasOverride(sum > 0); // treat as override only when >0
      } else {
        setNursePlan(computeAutoNursePlan());
        setNurseHasOverride(false);
      }
    } catch {
      setNursePlan(computeAutoNursePlan());
      setNurseHasOverride(false);
    }
  };
  useEffect(() => { fetchNursePlan(); }, [date]);

  const saveNursePlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const items = shifts.map(s => ({ shift_id: s.id, nurse_count: Math.max(0, Number(nursePlan[s.id])||0) }));
      const res = await fetch('/api/ot/nurses', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify({ the_date: date, items }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'บันทึกล้มเหลว');
      setNurseEdit(false);
      setNurseHasOverride(true);
      await fetchNursePlan();
      alert('บันทึกจำนวนพยาบาลต่อกะ สำเร็จ');
    } catch (e) {
      alert(String(e.message||e));
    }
  };

  // Reset nurse plan back to default per shift (computed), and persist
  const resetNursePlan = async () => {
    const defaults = computeAutoNursePlan();
    // For non-adminga: local refresh only
    if (!isAdminga) {
      setNursePlan(defaults);
      setNurseEdit(false);
      setNurseHasOverride(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const items = shifts.map(s => ({ shift_id: s.id, nurse_count: defaults[s.id] }));
      const res = await fetch('/api/ot/nurses', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify({ the_date: date, items }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'รีเฟรชไม่สำเร็จ');
      setNursePlan(defaults);
      setNurseEdit(false);
      await fetchNursePlan();
    } catch (e) {
      setNursePlan(defaults);
      alert(String(e.message||e));
    }
  };

  // Global day-level lock for adminga: locks everyone else but adminga can still edit
  const toggleLock = async (force) => {
    const next = typeof force==='boolean' ? (force?1:0) : (lockInfo?.is_locked?0:1);
    setLockInfo(prev=>({ ...(prev||{}), the_date: date, is_locked: next }));
    if (next) { setShopEdit(false); setNurseEdit(false); }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/ot/locks', { method:'POST', headers:{ 'Content-Type':'application/json', ...(token?{ Authorization:`Bearer ${token}` }:{}) }, body: JSON.stringify({ the_date: date, is_locked: next }) });
      if (!res.ok) throw new Error('lock save failed');
    } catch {
      // revert
      setLockInfo(prev=>({ ...(prev||{}), is_locked: next?0:1 }));
    }
  };

  // Per-department locks for the grid (date-level). Adminga can edit regardless.
  const [deptLocks, setDeptLocks] = useState({}); // department_id -> boolean
  const loadDeptLocks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/ot/locks?date=${date}&list=departments`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await res.json();
      if (res.ok) {
        const map = {};
        (Array.isArray(data) ? data : []).forEach(row => { map[row.department_id] = !!row.is_locked; });
        setDeptLocks(map);
      } else {
        setDeptLocks({});
      }
    } catch { setDeptLocks({}); }
  };
  useEffect(() => { loadDeptLocks(); }, [date, departments.length]);

  const canEditCell = (dept) => {
    if (isAdminga) return true;
    if (lockInfo?.is_locked) return false;
    if (deptLocks && deptLocks[dept.id]) return false;
    // Determine user's departments
    const myDepts = Array.isArray(user?.department_ids) && user.department_ids.length
      ? user.department_ids
      : (user?.department_id ? [user.department_id] : []);
    if (!myDepts.length) return false;
    if (user?.plant_id && dept?.plant_id && user.plant_id !== dept.plant_id) return false;
    return myDepts.includes(dept.id);
  };

  // Count editor modal
  const [countModal, setCountModal] = useState({ open:false, shift:null, dept:null, value:'', canEdit:true });
  const openCountModal = (shift, dept) => {
    const allowed = canEditCell(dept);
    const current = counts[keyOf(shift.id, dept.id)] || 0;
    setCountModal({ open:true, shift, dept, value: String(current), canEdit: allowed });
  };
  const submitCountModal = async () => {
    if (!countModal.canEdit) { setCountModal({ open:false, shift:null, dept:null, value:'', canEdit:true }); return; }
    const val = countModal.value === '' ? 0 : Math.max(0, parseInt(countModal.value) || 0);
    // Prepare new counts map to use for immediate recalculations
    let newCountsSnapshot = {};
    setCounts(prev => {
      const next = { ...prev, [keyOf(countModal.shift.id, countModal.dept.id)]: val };
      newCountsSnapshot = next;
      return next;
    });
    // Persist to DB
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/ot/overview-counts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ the_date: date, department_id: countModal.dept.id, shift_id: countModal.shift.id, count: val })
      });
    } catch {}

    // Recalculate and (if adminga and not overriding) auto-save shop and nurse plans
    try {
      // Helper to compute totals from snapshot
      const totalShiftWith = (shiftId) => (
        departments.reduce((sum, d) => sum + Number(newCountsSnapshot[keyOf(shiftId, d.id)] || 0), 0)
      );
      const grandTotalWith = shifts.reduce((s, sh) => s + totalShiftWith(sh.id), 0);

      // Shops: only when not editing and no explicit override
      if (!shopEdit && !shopHasOverride) {
          const auto = computeAutoShopPlan(grandTotalWith);
          setShopPlan(auto);
          if (isAdminga) {
            try {
              const token = localStorage.getItem('token');
              await fetch('/api/ot/shops', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ the_date: date, ...auto })
              });
            } catch {}
          }
      }

      // Nurses: only when not editing and no override saved
      if (!nurseEdit && !nurseHasOverride) {
        const autoNurse = {};
        shifts.forEach(s => { autoNurse[s.id] = (totalShiftWith(s.id) >= 1000 ? 2 : totalShiftWith(s.id) >= 200 ? 1 : 0); });
        setNursePlan(autoNurse);
        if (isAdminga) {
          try {
            const token = localStorage.getItem('token');
            const items = shifts.map(s => ({ shift_id: s.id, nurse_count: autoNurse[s.id] }));
            await fetch('/api/ot/nurses', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
              body: JSON.stringify({ the_date: date, items })
            });
          } catch {}
        }
      }
    } catch {}
    setCountModal({ open:false, shift:null, dept:null, value:'', canEdit:true });
  };

  // Department self-lock controls (date-level)
  const toggleMyDeptLock = async (forceLocked) => {
    const myDepts = Array.isArray(user?.department_ids) && user.department_ids.length
      ? user.department_ids
      : (user?.department_id ? [user.department_id] : []);
    if (!myDepts.length) return alert('บัญชีของคุณยังไม่ได้ระบุแผนก');
    const anyUnlocked = myDepts.some(id => !deptLocks[id]);
    const next = typeof forceLocked === 'boolean' ? (forceLocked ? 1 : 0) : (anyUnlocked ? 1 : 0);
    // optimistic
    setDeptLocks(prev => {
      const map = { ...(prev||{}) }; myDepts.forEach(id => { map[id] = !!next; }); return map;
    });
    try {
      const token = localStorage.getItem('token');
      const results = await Promise.all(myDepts.map(async (id) => {
        const res = await fetch('/api/ot/locks', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify({ the_date: date, is_locked: next, department_id: id }) });
        return res.ok ? null : (await res.json())?.error || 'error';
      }));
      const firstErr = results.find(Boolean);
      if (firstErr) alert(firstErr || 'สลับล็อคแผนกล้มเหลว');
    } catch { alert('สลับล็อคแผนกล้มเหลว'); }
    finally { await loadDeptLocks(); }
  };

  const handleSaveAsImage = async () => {
    if (!captureRef.current) return;
    const canvas = await html2canvas(captureRef.current);
    const link = document.createElement('a');
    link.download = `ot-overview-${date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch {}
    router.push('/');
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.stack} ref={captureRef}>
        {/* Header Panel */}
        <div style={{ ...styles.panelCard, paddingBottom: 16 }}>
          <div style={styles.headerRow}>
            <div>
              <h1 style={styles.title}>แจ้ง OT ภาพรวม (สำหรับแอดมิน)</h1>
              <div style={{ color:'#2f3e4f', fontWeight:600 }}>ยินดีต้อนรับ, {welcomeText}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ fontSize:18, color:'#2f3e4f' }}>{new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' })}</div>
              <button onClick={()=>router.push('/')} style={{ ...styles.logoutBtn, background:'#34495e' }}>กลับเมนูหลัก</button>
              <button onClick={handleLogout} style={styles.logoutBtn}>ออกจากระบบ</button>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div style={{ ...styles.panelCard, paddingTop: 16 }}>
          <div style={styles.controls}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={styles.label}>เลือกวันที่:</span>
              <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} style={styles.input} />
            </div>
            <button style={styles.primaryBtn} onClick={handleSaveAsImage}>บันทึกรูปภาพ</button>
          </div>
        </div>

        {/* Table Panel (manual-entry grid) */}
        <div style={{ ...styles.panelCard, padding:'0 0 24px 0', overflow:'hidden' }}>
          <div style={{ width:'100%', overflowX:'auto', ...(lockInfo?.is_locked ? (isAdminga?styles.visualLockedWrap:styles.lockedWrap) : {}) }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th rowSpan={2} style={{...styles.thMain, width:140}}>กะ Shift</th>
                  {plantCodesDynamic.map(code => (
                    <th key={`pl-${code}`} colSpan={deptsFor(code).length} style={{...styles.thPlant, backgroundColor: getPlantColor(code)}}>{code}</th>
                  ))}
                  <th rowSpan={2} style={{...styles.thMain, width:64}}>รวม</th>
                </tr>
                <tr>
                  {plantCodesDynamic.flatMap(code => (
                    deptsFor(code).map(d => (
                      <th key={`dept-${code}-${d.id}`} style={styles.thMain}>{d.code || d.name}</th>
                    ))
                  ))}
                </tr>
              </thead>
              <tbody>
                {shifts.map((s) => (
                  <tr key={s.id}>
                    <td style={styles.tdName}>
                      <div style={{ fontWeight:800 }}>กะ{(s.name_th || s.name_en || s.id)}</div>
                      {s.name_en && <div style={{ fontSize:12, color:'#7f8c8d' }}>{s.name_en}</div>}
                    </td>
                    {plantCodesDynamic.flatMap(code => (
                      deptsFor(code).map(d => {
                        const isLockedCell = !!deptLocks[d.id];
                        const canEdit = canEditCell(d);
                        const cellStyle = {
                          ...styles.tdCell,
                          cursor: canEdit ? 'pointer' : 'default',
                          opacity: (isLockedCell ? 0.6 : (canEdit ? 1 : 0.35)),
                          ...(canEdit ? {} : { pointerEvents:'none', background:'#f5f6f7' })
                        };
                        return (
                          <td key={`${s.id}-${code}-${d.id}`} style={cellStyle} onClick={()=>openCountModal(s, d)}>
                            <span style={{ fontWeight:700 }}>{totalBy(s.id, d.id) || 0} คน</span>
                          </td>
                        );
                      })
                    ))}
                    <td style={{...styles.tdCell, fontWeight:900}}>{plantCodesDynamic.flatMap(code => deptsFor(code)).reduce((sum,d)=> sum + (totalBy(s.id, d.id) || 0), 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isAdminga ? (
            <div style={styles.tableFooterRow}>
              <button style={styles.approveBtn} onClick={()=>toggleLock(true)}>ยืนยันการจอง</button>
              <button style={styles.cancelGrayBtn} onClick={()=>toggleLock(false)}>ยกเลิก</button>
            </div>
          ) : ((Array.isArray(user?.department_ids) && user.department_ids.length) || user?.department_id) ? (
            <div style={styles.tableFooterRow}>
              <button style={styles.approveBtn} onClick={()=>toggleMyDeptLock(true)}>ยืนยันการจอง</button>
              <button style={styles.cancelGrayBtn} onClick={()=>toggleMyDeptLock(false)}>ยกเลิก</button>
            </div>
          ) : null}
        </div>

        {/* Summary/Controls Panel */}
        <div style={{ ...styles.panelCard }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, ...(lockInfo?.is_locked ? (isAdminga?styles.visualLockedWrap:styles.lockedWrap) : {}) }}>
            {/* Shops */}
            <div style={styles.infoCard}>
              <div style={styles.infoHeader}>
                <img src="/utensils-solid-full.svg" alt="shops" style={styles.iconMono} />
                <span>คำนวณร้านค้า OT</span>
              </div>
              <div>
                {[{ key:'rice_shops' }, { key:'minimart_shops' }, { key:'noodle_shops' }].map((row, idx) => (
                  <div key={row.key} style={styles.infoRow}>
                    <div style={{ flex:1 }}>{idx===0 ? '1. ร้านข้าว' : idx===1 ? '2. มินิมาร์ท' : '3. ร้านก๋วยเตี๋ยว'}</div>
                    {shopEdit ? (
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <input type="number" min={0} value={shopPlan[row.key]}
                          onChange={(e)=> setShopPlan(prev=>({ ...prev, [row.key]: Math.max(0, Number(e.target.value)||0) }))}
                          style={styles.infoInput} />
                        <span>ร้าน</span>
                      </div>
                    ) : (
                      <div>{(shopPlan[row.key] || 0)} ร้าน</div>
                    )}
                  </div>
                ))}
                <div style={{ marginTop:10, display:'flex', gap:8, justifyContent:'flex-end' }}>
                  {!shopEdit && (
                    <>
                      {isAdminga && <button style={styles.smallBtn} onClick={()=> setShopEdit(true)}>แก้ไข</button>}
                      <button style={{...styles.smallBtn, background:'#7f8c8d'}} onClick={resetShopPlan}>รีเฟรช</button>
                    </>
                  )}
                  {isAdminga && shopEdit && (
                    <>
                      <button style={{...styles.smallBtn, background:'#27ae60'}} onClick={saveShopPlan}>บันทึก</button>
                      <button style={{...styles.smallBtn, background:'#bdc3c7', color:'#2c3e50'}} onClick={()=>{ setShopEdit(false); fetchShopPlan(); }}>ยกเลิก</button>
                    </>
                  )}
                </div>
                <div style={{ marginTop:8, fontSize:12, color:'#7f8c8d' }}>สรุปทั้งหมด: {grandTotal} คน</div>
              </div>
            </div>

            {/* Nurse plan */}
            <div style={styles.infoCard}>
              <div style={styles.infoHeader}>
                <img src="/user-nurse-solid-full.svg" alt="nurse" style={styles.iconMono} />
                <span>คำนวณการจัด OT พยาบาล</span>
              </div>
              <div>
                {shifts.map((s, idx)=> (
                  <div key={s.id} style={styles.infoRow}>
                    <div style={{ flex:1 }}>
                      {idx+1}. {s.name_en || s.name_th || `Shift ${s.id}`}
                    </div>
                    {nurseEdit ? (
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <input type="number" min={0} value={nursePlan[s.id] ?? nurseFromTotal(totalShift(s.id))}
                          onChange={(e)=> setNursePlan(prev=>({ ...prev, [s.id]: Math.max(0, Number(e.target.value)||0) }))}
                          style={styles.infoInput} />
                        <span>คน</span>
                      </div>
                    ) : (
                      <div style={{ width:80, textAlign:'center' }}>{(nursePlan[s.id] ?? nurseFromTotal(totalShift(s.id)))} คน</div>
                    )}
                  </div>
                ))}
                <div style={{ marginTop:10, display:'flex', gap:8, justifyContent:'flex-end' }}>
                  {!nurseEdit && (
                    <>
                      {isAdminga && <button style={styles.smallBtn} onClick={()=> setNurseEdit(true)}>แก้ไข</button>}
                      <button style={{...styles.smallBtn, background:'#7f8c8d'}} onClick={resetNursePlan}>รีเฟรช</button>
                    </>
                  )}
                  {isAdminga && nurseEdit && (
                    <>
                      <button style={{...styles.smallBtn, background:'#27ae60'}} onClick={saveNursePlan}>บันทึก</button>
                      <button style={{...styles.smallBtn, background:'#bdc3c7', color:'#2c3e50'}} onClick={()=>{ setNurseEdit(false); fetchNursePlan(); }}>ยกเลิก</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* (Footer panel removed; buttons are inside the table panel) */}
      </div>
      {/* Count Editor Modal */}
      {countModal.open && (
        <>
          <div style={styles.overlay} onClick={()=>setCountModal({ open:false, shift:null, dept:null, value:'', canEdit:true })} />
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>แก้ไขจำนวน ({countModal.shift?.name_en || countModal.shift?.name_th || `Shift ${countModal.shift?.id}`} - {countModal.dept?.code || countModal.dept?.name})</h2>
            <div style={styles.modalFormGroup}>
              <label style={styles.modalLabel}>จำนวนคน:</label>
              <input
                type="number"
                value={countModal.value}
                onChange={(e)=>{
                  const onlyNum = e.target.value.replace(/[^0-9]/g,'');
                  setCountModal(prev=>({ ...prev, value: onlyNum }));
                }}
                onKeyDown={(e)=>{ if (e.key==='Enter') submitCountModal(); }}
                style={styles.modalInput}
                disabled={!countModal.canEdit}
              />
            </div>
            {!countModal.canEdit && (
              <div style={{ color:'#e74c3c', marginBottom:12 }}>ช่องนี้ถูกล็อกหรือคุณไม่มีสิทธิ์แก้ไข</div>
            )}
            <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
              <button onClick={submitCountModal} style={styles.confirmButton} disabled={!countModal.canEdit}>บันทึก</button>
              <button onClick={()=>setCountModal({ open:false, shift:null, dept:null, value:'', canEdit:true })} style={styles.cancelButton}>ยกเลิก</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  wrapper: { minHeight:'100vh', background:'#f0f2f5', padding:20 },
  // stack and panel layout
  stack: { display:'flex', flexDirection:'column', gap:16, width:'100%', maxWidth:1340, margin:'0 auto' },
  panelCard: { background:'#fff', borderRadius:24, width:'100%', padding:24, boxShadow:'0 8px 30px rgba(0,0,0,0.12)' },
  headerRow: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 },
  title: { fontSize:28, fontWeight:900, margin:0, color:'#2f3e4f' },
  controls: { display:'flex', alignItems:'center', gap:16, background:'#f7f9fb', borderRadius:14, padding:12, marginBottom:14, flexWrap:'wrap' },
  label: { fontWeight:700, color:'#2f3e4f' },
  input: { padding:'10px 12px', borderRadius:10, border:'1px solid #bdc3c7', background:'#fff', fontSize:16, minWidth:120 },
  primaryBtn: { padding:'10px 14px', borderRadius:10, background:'#1f8ef1', color:'#fff', border:'none', fontWeight:800, cursor:'pointer', marginLeft:'auto' },
  logoutBtn: { padding:'8px 12px', borderRadius:10, background:'#e74c3c', color:'#fff', border:'none', fontWeight:800, cursor:'pointer' },
  table: { width:'100%', borderCollapse:'collapse', tableLayout:'fixed', margin:0 },
  thMain: { background:'#102a3b', color:'#fff', padding:8, textAlign:'center', fontWeight:900, whiteSpace:'nowrap', fontSize:12 },
  thPlant: { color:'#0f2a40', padding:8, textAlign:'center', fontWeight:900, fontSize:14 },
  tdName: { border:'1px solid #dfe6ee', padding:8, fontWeight:800, color:'#2f3e4f', width:160, background:'#ffffff', fontSize:13 },
  tdCell: { border:'1px solid #e6edf3', padding:6, minWidth:60, height:36, background:'#ffffff', textAlign:'center', fontSize:12, userSelect:'none' },
  tableFooterRow: { display:'flex', justifyContent:'flex-end', gap:12, padding:'12px 16px 0 16px' },
  infoCard: { background:'#fff', borderRadius:12, padding:16, border:'1px solid #e6edf3' },
  infoHeader: { display:'flex', alignItems:'center', gap:10, background:'#0f2a40', color:'#fff', padding:'10px 12px', borderRadius:10, fontWeight:900, marginBottom:12 },
  iconMono: { width:18, height:18, filter:'grayscale(1) brightness(1000%)', opacity:0.9 },
  infoRow: { display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #ecf0f1', padding:'10px 12px' },
  infoInput: { width:80, padding:'6px 8px', textAlign:'center', border:'1px solid #bdc3c7', borderRadius:6 },
  smallBtn: { padding:'6px 10px', background:'#3498db', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontWeight:700 },
  approveBtn: { padding:'10px 14px', borderRadius:10, background:'#2ecc71', color:'#fff', border:'none', fontWeight:800, cursor:'pointer' },
  cancelGrayBtn: { padding:'10px 14px', borderRadius:10, background:'#ffffff', color:'#7f8c8d', border:'1px solid #bdc3c7', fontWeight:800, cursor:'pointer' },
  lockedWrap: { opacity:0.5, pointerEvents:'none', filter:'grayscale(0.6)' },
  visualLockedWrap: { opacity:0.5, filter:'grayscale(0.6)' },
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:1000 },
  modal: { position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', background:'#fff', padding:20, borderRadius:14, width:'min(480px, 92vw)', zIndex:1001, boxShadow:'0 10px 40px rgba(0,0,0,0.25)' },
  modalTitle: { marginTop:0, marginBottom:14, fontWeight:900, color:'#2f3e4f' },
  modalFormGroup: { marginBottom:12 },
  modalLabel: { display:'block', marginBottom:6, fontWeight:700, color:'#2f3e4f' },
  modalInput: { width:'100%', padding:'10px 12px', border:'1px solid #bdc3c7', borderRadius:8, fontSize:16 },
  confirmButton: { padding:'10px 14px', borderRadius:8, background:'#2ecc71', color:'#fff', border:'none', fontWeight:800, cursor:'pointer' },
  cancelButton: { padding:'10px 14px', borderRadius:8, background:'#bdc3c7', color:'#2c3e50', border:'none', fontWeight:800, cursor:'pointer' },
};

// Count editor modal UI
// Injected after styles definition for simplicity; placed at end of component tree above return earlier using conditional.
