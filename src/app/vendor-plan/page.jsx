"use client";
import { useEffect, useMemo, useRef, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import { fetchJSON, postJSON } from '@/lib/http';
import { formatWelcome } from '@/lib/formatters';

// แผนจัดรถ (สำหรับ Vendor)
// โครงสร้างหน้าคล้ายหน้าอื่น: มีหัวข้อ, ปุ่มบันทึกรูปภาพ, ออกจากระบบ, เลือกวันที่ และตารางใหญ่
export default function VendorPlanPage() {
  const router = useRouter();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [user, setUser] = useState(null);
  const [routes, setRoutes] = useState([]); // [{id, name}]
  const [plants, setPlants] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [shifts, setShifts] = useState([]); // [{id, name_th, name_en}]
  const [departTimesByShift, setDepartTimesByShift] = useState({}); // { shiftId: [{id, time}] }
  const [countsByDepartTime, setCountsByDepartTime] = useState({}); // { dtId: { routeId: people } }
  const [carPlanByDepartTime, setCarPlanByDepartTime] = useState({}); // { dtId: { routeId: car_count } }
  const captureRef = useRef(null);
  const [payments, setPayments] = useState({}); // { routeId: { pay_flat, pay_wait, pay_ot_normal, pay_trip, pay_ot_holiday, pay_trip_night } }
  const [editModal, setEditModal] = useState({ open:false, route:null, key:null, value:'' });
  const [lockInfo, setLockInfo] = useState({ the_date:null, is_locked:0 });
  const isAdminga = useMemo(() => String(user?.username||'').toLowerCase()==='adminga', [user]);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      setUser(u);
    } catch {}
  }, []);

  // Helper: pick day/night shift ids by name
  const dayNightShiftIds = useMemo(() => {
    if (!Array.isArray(shifts) || shifts.length === 0) return { day: null, night: null };
    let day = null; let night = null;
    for (const s of shifts) {
      const th = (s.name_th || "").toLowerCase();
      const en = (s.name_en || "").toLowerCase();
      if (!day && (th.includes("กลางวัน") || en.includes("day"))) day = s.id;
      if (!night && (th.includes("กลางคืน") || en.includes("night"))) night = s.id;
    }
    // fallback: first=day second=night
    if (!day) day = shifts[0]?.id ?? null;
    if (!night) night = shifts.find((x) => x.id !== day)?.id ?? null;
    return { day, night };
  }, [shifts]);

  // Load master data
  useEffect(() => {
    let cancelled = false;
    const loadMasters = async () => {
      try {
        const [routesRows, shiftsRows, plantRows, deptRows] = await Promise.all([
          fetchJSON('/api/ot/routes'),
          fetchJSON('/api/ot/shifts'),
          fetchJSON('/api/ot/plants'),
          fetchJSON('/api/ot/departments'),
        ]);
        if (cancelled) return;
        setRoutes(Array.isArray(routesRows) ? routesRows : []);
        const sh = Array.isArray(shiftsRows) ? shiftsRows : [];
        setShifts(sh);
        setPlants(Array.isArray(plantRows) ? plantRows : []);
        setDepartments(Array.isArray(deptRows) ? deptRows : []);
      } catch (e) {
        if (cancelled) return;
        setRoutes([]); setShifts([]); setPlants([]); setDepartments([]);
      }
    };
    loadMasters();
    return () => { cancelled = true; };
  }, []);

  // Load depart times for both day and night
  useEffect(() => {
    let cancelled = false;
    const loadDepartTimes = async () => {
      if (!dayNightShiftIds.day && !dayNightShiftIds.night) return setDepartTimesByShift({});
      const acc = {};
      for (const sid of [dayNightShiftIds.day, dayNightShiftIds.night].filter(Boolean)) {
        const rows = await fetchJSON(`/api/ot/depart-times?shiftId=${sid}`) || [];
        acc[sid] = (Array.isArray(rows) ? rows : []).sort((a, b) => {
          const ie = (Number(b?.is_entry||0) - Number(a?.is_entry||0));
          if (ie !== 0) return ie; // entries (1) first
          return String(a.time).localeCompare(String(b.time));
        });
      }
      if (!cancelled) setDepartTimesByShift(acc);
    };
    loadDepartTimes();
    return () => { cancelled = true; };
  }, [dayNightShiftIds.day, dayNightShiftIds.night]);

  // Load aggregate counts per depart time (sum across plants/departments)
  useEffect(() => {
    let cancelled = false;
    const loadCounts = async () => {
      const acc = {};
      const allDts = [
        ...(departTimesByShift[dayNightShiftIds.day] || []),
        ...(departTimesByShift[dayNightShiftIds.night] || []),
      ];
      for (const dt of allDts) {
        const rows = await fetchJSON(`/api/ot/counts?date=${date}&shiftId=${dt.shift_id || dayNightShiftIds.day}&departTimeId=${dt.id}`) || [];
        const map = {}; // { routeId: totalPeople }
        for (const row of (Array.isArray(rows) ? rows : [])) {
          const rId = row.route_id; const c = Number(row.count) || 0;
          map[rId] = (map[rId] || 0) + c; // sum across departments
        }
        acc[dt.id] = map;
      }
      if (!cancelled) setCountsByDepartTime(acc);
    };
    loadCounts();
    return () => { cancelled = true; };
  }, [date, departTimesByShift, dayNightShiftIds.day, dayNightShiftIds.night]);

  // Load car overrides per depart time (manual overrides from ot_car_plan)
  useEffect(() => {
    let cancelled = false;
    const loadCars = async () => {
      const acc = {};
      const allDts = [
        ...(departTimesByShift[dayNightShiftIds.day] || []),
        ...(departTimesByShift[dayNightShiftIds.night] || []),
      ];
      for (const dt of allDts) {
        const rows = await fetchJSON(`/api/ot/cars?date=${date}&shiftId=${dt.shift_id || dayNightShiftIds.day}&departTimeId=${dt.id}`) || [];
        const map = {};
        for (const row of (Array.isArray(rows) ? rows : [])) {
          const rId = row.route_id; const c = Number(row.car_count) || 0;
          map[rId] = c;
        }
        acc[dt.id] = map;
      }
      if (!cancelled) setCarPlanByDepartTime(acc);
    };
    loadCars();
    return () => { cancelled = true; };
  }, [date, departTimesByShift, dayNightShiftIds.day, dayNightShiftIds.night]);

  // Load vendor payments for the date
  useEffect(() => {
    let cancelled = false;
    const loadPayments = async () => {
      const rows = await fetchJSON(`/api/vendor/payments?date=${date}`) || [];
      const map = {};
      for (const r of (Array.isArray(rows)?rows:[])) {
        map[r.route_id] = {
          pay_flat: Number(r.pay_flat)||0,
          pay_wait: Number(r.pay_wait)||0,
          pay_ot_normal: Number(r.pay_ot_normal)||0,
          pay_trip: Number(r.pay_trip)||0,
          pay_ot_holiday: Number(r.pay_ot_holiday)||0,
          pay_trip_night: Number(r.pay_trip_night)||0
        };
      }
      if (!cancelled) setPayments(map);
    };
    loadPayments();
    return () => { cancelled = true; };
  }, [date]);

  // Load lock for the selected date (shared with other pages)
  useEffect(()=>{
    let cancelled = false;
    (async()=>{
      const data = await fetchJSON(`/api/ot/locks?date=${date}`);
      if (!cancelled) setLockInfo(data || { the_date:date, is_locked:0 });
    })();
    return () => { cancelled = true; };
  }, [date]);

  // Lock/unlock similar to other pages
  const toggleLock = async (force) => {
    const next = typeof force==='boolean' ? (force?1:0) : (lockInfo?.is_locked?0:1);
    setLockInfo(prev=>({ ...(prev||{}), the_date: date, is_locked: next }));
    if (next) { setEditModal({ open:false, route:null, key:null, value:'' }); }
    try {
      await postJSON('/api/ot/locks', { the_date: date, is_locked: next });
    } catch {
      // revert on failure
      setLockInfo(prev=>({ ...(prev||{}), is_locked: next?0:1 }));
    }
  };

  const openEdit = (route, key) => {
    const current = payments?.[route.id]?.[key] ?? 0;
    setEditModal({ open:true, route, key, value: String(current) });
  };
  const closeEdit = () => setEditModal({ open:false, route:null, key:null, value:'' });
  const saveEdit = async () => {
    if (!editModal.open || !editModal.route || !editModal.key) return;
    try {
      const body = { the_date: date, route_id: editModal.route.id, key: editModal.key, value: Math.max(0, Number(editModal.value)||0) };
      const data = await postJSON('/api/vendor/payments', body);
      setPayments(prev => ({
        ...prev,
        [editModal.route.id]: { ...(prev[editModal.route.id]||{}), [editModal.key]: body.value }
      }));
      closeEdit();
    } catch (e) { alert(String(e.message||e)); }
  };

  const calcVehicles = (people) => {
    const n = Number(people) || 0;
    if (n <= 6) return 0; // ตามตรรกะเดียวกับตารางจัดรถ
    return Math.ceil(n / 50);
  };

  const handleSaveAsImage = async () => {
    if (!captureRef.current) return;
    const canvas = await html2canvas(captureRef.current);
    const link = document.createElement("a");
    link.download = `vendor-plan-${date}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {}
    router.push("/");
  };

  const dayTimes = (departTimesByShift[dayNightShiftIds.day] || []);
  const nightTimes = (departTimesByShift[dayNightShiftIds.night] || []);
  const allTimes = [...dayTimes, ...nightTimes];

  // Totals across all routes per depart time and payment categories
  const totals = useMemo(() => {
    const peopleTotals = {};
    const carTotals = {};
    for (const dt of allTimes) {
      let pSum = 0; let cSum = 0;
      for (const r of routes) {
        const ppl = Number(countsByDepartTime?.[dt.id]?.[r.id] || 0);
        pSum += ppl;
        const override = carPlanByDepartTime?.[dt.id]?.[r.id];
        cSum += (override != null) ? (Number(override) || 0) : calcVehicles(ppl);
      }
      peopleTotals[dt.id] = pSum;
      carTotals[dt.id] = cSum;
    }
    const payKeys = ['pay_flat','pay_wait','pay_ot_normal','pay_trip','pay_ot_holiday','pay_trip_night'];
    const payTotals = {};
    for (const k of payKeys) {
      let s = 0;
      for (const r of routes) s += Number(payments?.[r.id]?.[k] || 0);
      payTotals[k] = s;
    }
    return { peopleTotals, carTotals, payTotals };
  }, [allTimes, routes, countsByDepartTime, payments, carPlanByDepartTime]);

  const welcomeText = useMemo(() => formatWelcome(user, departments, plants), [user, departments, plants]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.stack}>
        {/* Panel: Header */}
        <div style={{ ...styles.panelCard, paddingBottom: 16 }}>
          <div style={styles.headerRow}>
            <div>
              <h1 style={styles.title}>แผนจัดรถ</h1>
              <div style={{ color:'#2f3e4f', fontWeight:600 }}>ยินดีต้อนรับ, {welcomeText}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ fontSize:18, color:'#2f3e4f' }}>
                {new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' })}
              </div>
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
                <input type="date" value={date} onChange={(e)=> setDate(e.target.value)} style={styles.input} />
              </div>
              <button style={styles.primaryBtn} onClick={handleSaveAsImage}>บันทึกรูปภาพ</button>
            </div>
          </div>
          {/* Panel: Table */}
          <div style={{ ...styles.panelCardTight }}>
            <div style={{ width:'100%', overflowX:'auto', ...(lockInfo?.is_locked ? styles.lockedWrap : {}) }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.thMain, width:240 }} rowSpan={3}>สายรถ</th>
                    <th style={{ ...styles.thShift, background:'#FFEB3B' }} colSpan={(dayTimes.length * 2) + 1}>กะกลางวัน <strong>Day Shift</strong></th>
                    <th style={{ ...styles.thShift, background:'#F8BBD0' }} colSpan={(nightTimes.length * 2) + 1}>กะกลางคืน <strong>Night Shift</strong></th>
                    <th style={{ ...styles.thMain }} colSpan={6}>จำนวนการจ่าย Bus cost type</th>
                  </tr>
                  <tr>
                    {dayTimes.map((dt) => (
                      <th key={`d-${dt.id}`} style={{ ...styles.thTime, background:'#FFFB0D' }} colSpan={2} title={dt.is_entry ? 'เวลาเข้า' : 'เวลาออก'}>
                        <div style={styles.timeWrap}>
                          <div>{String(dt.time).slice(0,5)}</div>
                          <div style={{ ...styles.timePill, ...(dt.is_entry ? styles.timePillEntry : styles.timePillExit) }}>
                            {dt.is_entry ? 'เข้า' : 'ออก'}
                          </div>
                        </div>
                      </th>
                    ))}
                    {/* Day shift vertical sum header at right */}
                    <th style={{ ...styles.thTime, background:'#FFFB0D' }} colSpan={1} title="รวมรถ">
                      <div style={styles.timeWrap}>
                        <div>รวมรถ</div>
                      </div>
                    </th>
                    {nightTimes.map((dt) => (
                      <th key={`n-${dt.id}`} style={{ ...styles.thTime, background:'#F5D0D7' }} colSpan={2} title={dt.is_entry ? 'เวลาเข้า' : 'เวลาออก'}>
                        <div style={styles.timeWrap}>
                          <div>{String(dt.time).slice(0,5)}</div>
                          <div style={{ ...styles.timePill, ...(dt.is_entry ? styles.timePillEntry : styles.timePillExit) }}>
                            {dt.is_entry ? 'เข้า' : 'ออก'}
                          </div>
                        </div>
                      </th>
                    ))}
                    {/* Night shift vertical sum header at right */}
                    <th style={{ ...styles.thTime, background:'#F5D0D7' }} colSpan={1} title="รวมรถ">
                      <div style={styles.timeWrap}>
                        <div>รวมรถ</div>
                      </div>
                    </th>
                    <th style={styles.thPayHead} rowSpan={2}>รายเดือน</th>
                    <th style={styles.thPayHead} rowSpan={2}>จอดรอ</th>
                    <th style={styles.thPayHead} rowSpan={2}>OT เหมาวันปกติ</th>
                    <th style={styles.thPayHead} rowSpan={2}>เหมาเที่ยว</th>
                    <th style={styles.thPayHead} rowSpan={2}>OT เหมาวันหยุด</th>
                    <th style={styles.thPayHead} rowSpan={2}>เหมาเที่ยวกะดึก</th>
                  </tr>
                  <tr>
                    {dayTimes.map((dt) => (
                      <Fragment key={`sub-d-${dt.id}`}>
                        <th style={styles.thSub}>คน</th>
                        <th style={styles.thSub}>รถ</th>
                      </Fragment>
                    ))}
                    {/* Day shift vertical sum subheader at right */}
                    <th key={`sub-day-sum`} style={styles.thSub}>รถ</th>
                    {nightTimes.map((dt) => (
                      <Fragment key={`sub-n-${dt.id}`}>
                        <th style={styles.thSub}>คน</th>
                        <th style={styles.thSub}>รถ</th>
                      </Fragment>
                    ))}
                    {/* Night shift vertical sum subheader at right */}
                    <th key={`sub-night-sum`} style={styles.thSub}>รถ</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((r, idx) => (
                    <tr key={r.id}>
                      <td style={styles.tdRoute}><span style={styles.routeIndex}>{idx + 1}.</span> {r.name}</td>
                      {/* Day shift per-time cells */}
                      {dayTimes.map((dt) => {
                        const people = Number(countsByDepartTime?.[dt.id]?.[r.id] || 0);
                        const override = carPlanByDepartTime?.[dt.id]?.[r.id];
                        const cars = (override != null) ? (Number(override) || 0) : calcVehicles(people);
                        return (
                          <Fragment key={`cell-d-${dt.id}-${r.id}`}>
                            <td style={styles.tdCell}>{people > 0 ? <span>{people}</span> : ''}</td>
                            <td style={styles.tdCell}>{cars > 0 ? <b>{cars} คัน</b> : ''}</td>
                          </Fragment>
                        );
                      })}
                      {/* Day shift vertical sum cell at right */}
                      {(() => {
                        const dayCars = dayTimes.reduce((acc, dt) => {
                          const people = Number(countsByDepartTime?.[dt.id]?.[r.id] || 0);
                          const override = carPlanByDepartTime?.[dt.id]?.[r.id];
                          const cars = (override != null) ? (Number(override) || 0) : calcVehicles(people);
                          return acc + cars;
                        }, 0);
                        return (
                          <td style={styles.tdCell} key={`cell-day-sum-${r.id}`}>{dayCars > 0 ? <b>{dayCars} คัน</b> : ''}</td>
                        );
                      })()}
                      {/* Night shift per-time cells */}
                      {nightTimes.map((dt) => {
                        const people = Number(countsByDepartTime?.[dt.id]?.[r.id] || 0);
                        const override = carPlanByDepartTime?.[dt.id]?.[r.id];
                        const cars = (override != null) ? (Number(override) || 0) : calcVehicles(people);
                        return (
                          <Fragment key={`cell-n-${dt.id}-${r.id}`}>
                            <td style={styles.tdCell}>{people > 0 ? <span>{people}</span> : ''}</td>
                            <td style={styles.tdCell}>{cars > 0 ? <b>{cars} คัน</b> : ''}</td>
                          </Fragment>
                        );
                      })}
                      {/* Night shift vertical sum cell at right */}
                      {(() => {
                        const nightCars = nightTimes.reduce((acc, dt) => {
                          const people = Number(countsByDepartTime?.[dt.id]?.[r.id] || 0);
                          const override = carPlanByDepartTime?.[dt.id]?.[r.id];
                          const cars = (override != null) ? (Number(override) || 0) : calcVehicles(people);
                          return acc + cars;
                        }, 0);
                        return (
                          <td style={styles.tdCell} key={`cell-night-sum-${r.id}`}>{nightCars > 0 ? <b>{nightCars} คัน</b> : ''}</td>
                        );
                      })()}
                      <td style={styles.tdPay} onClick={()=>!lockInfo?.is_locked && openEdit(r,'pay_flat')}>{(payments?.[r.id]?.pay_flat||0) || ''}</td>
                      <td style={styles.tdPay} onClick={()=>!lockInfo?.is_locked && openEdit(r,'pay_wait')}>{(payments?.[r.id]?.pay_wait||0) || ''}</td>
                      <td style={styles.tdPay} onClick={()=>!lockInfo?.is_locked && openEdit(r,'pay_ot_normal')}>{(payments?.[r.id]?.pay_ot_normal||0) || ''}</td>
                      <td style={styles.tdPay} onClick={()=>!lockInfo?.is_locked && openEdit(r,'pay_trip')}>{(payments?.[r.id]?.pay_trip||0) || ''}</td>
                      <td style={styles.tdPay} onClick={()=>!lockInfo?.is_locked && openEdit(r,'pay_ot_holiday')}>{(payments?.[r.id]?.pay_ot_holiday||0) || ''}</td>
                      <td style={styles.tdPay} onClick={()=>!lockInfo?.is_locked && openEdit(r,'pay_trip_night')}>{(payments?.[r.id]?.pay_trip_night||0) || ''}</td>
                    </tr>
                  ))}
                  {/* Totals row */}
                  <tr>
                    <td style={styles.tdTotalRoute}>รวม</td>
                    {dayTimes.map((dt) => (
                      <Fragment key={`sum-d-${dt.id}`}>
                        <td style={styles.tdSum}>
                          {(totals.peopleTotals?.[dt.id] ?? 0) > 0 ? <b>{totals.peopleTotals[dt.id]}</b> : ''}
                        </td>
                        <td style={styles.tdSum}>
                          {(totals.carTotals?.[dt.id] ?? 0) > 0 ? <b>{`${totals.carTotals[dt.id]} คัน`}</b> : ''}
                        </td>
                      </Fragment>
                    ))}
                    {/* Day shift vertical sum total at right */}
                    <td style={styles.tdSum}>{(dayTimes.reduce((acc, dt) => acc + (totals.carTotals?.[dt.id] || 0), 0)) > 0 ? <b>{`${dayTimes.reduce((acc, dt) => acc + (totals.carTotals?.[dt.id] || 0), 0)} คัน`}</b> : ''}</td>
                    {nightTimes.map((dt) => (
                      <Fragment key={`sum-n-${dt.id}`}>
                        <td style={styles.tdSum}>
                          {(totals.peopleTotals?.[dt.id] ?? 0) > 0 ? <b>{totals.peopleTotals[dt.id]}</b> : ''}
                        </td>
                        <td style={styles.tdSum}>
                          {(totals.carTotals?.[dt.id] ?? 0) > 0 ? <b>{`${totals.carTotals[dt.id]} คัน`}</b> : ''}
                        </td>
                      </Fragment>
                    ))}
                    {/* Night shift vertical sum total at right */}
                    <td style={styles.tdSum}>{(nightTimes.reduce((acc, dt) => acc + (totals.carTotals?.[dt.id] || 0), 0)) > 0 ? <b>{`${nightTimes.reduce((acc, dt) => acc + (totals.carTotals?.[dt.id] || 0), 0)} คัน`}</b> : ''}</td>
                    <td style={styles.tdSumPay}>{(totals.payTotals?.pay_flat ?? 0) > 0 ? <b>{totals.payTotals.pay_flat}</b> : ''}</td>
                    <td style={styles.tdSumPay}>{(totals.payTotals?.pay_wait ?? 0) > 0 ? <b>{totals.payTotals.pay_wait}</b> : ''}</td>
                    <td style={styles.tdSumPay}>{(totals.payTotals?.pay_ot_normal ?? 0) > 0 ? <b>{totals.payTotals.pay_ot_normal}</b> : ''}</td>
                    <td style={styles.tdSumPay}>{(totals.payTotals?.pay_trip ?? 0) > 0 ? <b>{totals.payTotals.pay_trip}</b> : ''}</td>
                    <td style={styles.tdSumPay}>{(totals.payTotals?.pay_ot_holiday ?? 0) > 0 ? <b>{totals.payTotals.pay_ot_holiday}</b> : ''}</td>
                    <td style={styles.tdSumPay}>{(totals.payTotals?.pay_trip_night ?? 0) > 0 ? <b>{totals.payTotals.pay_trip_night}</b> : ''}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {isAdminga && (
              <div style={{ display:'flex', justifyContent:'flex-end', gap:12, padding:'12px 16px' }}>
                <button style={styles.approveBtn} onClick={()=>toggleLock(true)}>บันทึกข้อมูล</button>
                <button style={styles.cancelGrayBtn} onClick={()=>toggleLock(false)}>ยกเลิก</button>
              </div>
            )}
          </div>
        </div>
        {editModal.open && (
          <>
            <div style={styles.overlay} onClick={closeEdit} />
            <div style={styles.modal} onClick={(e)=>e.stopPropagation()}>
              <h2 style={styles.modalTitle}>แก้ไขจำนวนการจ่าย</h2>
              <div style={{ marginBottom:10, color:'#2c3e50' }}>
                สายรถ: <strong>{editModal.route?.name}</strong>
              </div>
              <div style={styles.modalFormGroup}>
                <label style={styles.modalLabel}>จำนวน:</label>
                <input type="number" min={0} value={editModal.value}
                  onChange={(e)=> setEditModal(m=>({ ...m, value: e.target.value }))}
                  onKeyDown={(e)=>{ if (e.key==='Enter') saveEdit(); }}
                  style={styles.modalInput} autoFocus />
              </div>
              <div style={styles.modalButtonGroup}>
                <button style={styles.confirmButton} onClick={saveEdit}>บันทึก</button>
                <button style={styles.cancelButton} onClick={closeEdit}>ยกเลิก</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", background: "#f0f2f5", padding: 20 },
  // stack and panel layout
  stack: { display:'flex', flexDirection:'column', gap:16, width:'100%', maxWidth:1340, margin:'0 auto' },
  panelCard: { background: "#fff", borderRadius: 24, width: "100%", padding: 24, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" },
  panelCardTight: { background: "#fff", borderRadius: 24, width: "100%", padding: 0, boxShadow: "0 8px 30px rgba(0,0,0,0.12)", overflow: 'hidden' },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 900, margin: 0, color: "#2f3e4f" },
  controls: { display: "flex", alignItems: "center", gap: 16, background: "#f7f9fb", borderRadius: 14, padding: 12, marginBottom: 14, flexWrap: "wrap" },
  label: { fontWeight: 700, color: "#2f3e4f" },
  input: { padding: "10px 12px", borderRadius: 10, border: "1px solid #bdc3c7", background: "#fff", fontSize: 16, minWidth: 120 },
  primaryBtn: { padding: "10px 14px", borderRadius: 10, background: "#1f8ef1", color: "#fff", border: "none", fontWeight: 800, cursor: "pointer", marginLeft: "auto" },
  logoutBtn: { padding: "8px 12px", borderRadius: 10, background: "#e74c3c", color: "#fff", border: "none", fontWeight: 800, cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" },
  thMain: { background: "#102a3b", color: "#fff", padding: 8, textAlign: "center", fontWeight: 900, whiteSpace: "nowrap", fontSize: 12, border: "1px solid #e6edf3" },
  thShift: { color: "#0f2a40", padding: 8, textAlign: "center", fontWeight: 900, fontSize: 14, border: "1px solid #e6edf3", whiteSpace: 'nowrap' },
  thTime: { color: "#0f2a40", padding: 8, textAlign: "center", fontWeight: 900, fontSize: 14, border: "1px solid #e6edf3", whiteSpace: 'nowrap' },
  timeWrap: { display:'flex', flexDirection:'column', alignItems:'center', gap:4, lineHeight:1.1 },
  timePill: { fontSize:10, padding:'2px 6px', borderRadius:999, fontWeight:800, color:'#0f2a40', background:'#eef5ff', border:'1px solid #cfe0f7' },
  timePillEntry: { background:'#e9f9ed', border:'1px solid #bfe8cb', color:'#1b7b3a' },
  timePillExit: { background:'#fff2e9', border:'1px solid #ffd3b5', color:'#b04e06' },
  thPayHead: { background: "#102a3b", color: "#fff", padding: 8, textAlign: "center", fontWeight: 900, fontSize: 12, border: "1px solid #e6edf3", whiteSpace: 'normal', lineHeight: 1.25, minWidth: 120 },
  thSub: { background: "#17344f", color: "#fff", padding: 8, textAlign: "center", fontWeight: 800, fontSize: 12, border: "1px solid #e6edf3", whiteSpace: 'nowrap' },
  tdRoute: { border: "1px solid #dfe6ee", padding: 8, fontWeight: 800, color: "#2f3e4f", width: 240, background: "#ffffff", fontSize: 13, whiteSpace: "nowrap" },
  routeIndex: { display: "inline-block", width: 24, textAlign: "right", marginRight: 6 },
  tdCell: { border: "1px solid #e6edf3", padding: 6, minWidth: 60, height: 36, background: "#ffffff", textAlign: "center", fontSize: 12 },
  tdPay: { border: "1px solid #e6edf3", padding: 6, minWidth: 130, height: 36, background: "#ffffff", textAlign: "center", fontSize: 12 },
  tdTotalRoute: { border: "1px solid #e6edf3", padding: 8, background: "#eef3f8", fontWeight: 900, color: "#2f3e4f", textAlign:'center' },
  tdSum: { border: "1px solid #e6edf3", padding: 6, background: "#f8fbff", textAlign: "center", fontSize: 12, fontWeight: 800 },
  tdSumPay: { border: "1px solid #e6edf3", padding: 6, background: "#f4f9f2", textAlign: "center", fontSize: 12, fontWeight: 800 },
  approveBtn: { padding:'10px 14px', borderRadius:10, background:'#2ecc71', color:'#fff', border:'none', fontWeight:800, cursor:'pointer' },
  cancelGrayBtn: { padding:'10px 14px', borderRadius:10, background:'#ffffff', color:'#7f8c8d', border:'1px solid #bdc3c7', fontWeight:800, cursor:'pointer' },
  lockedWrap: { opacity:0.5, pointerEvents:'none', filter:'grayscale(0.6)' },
  overlay: { position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000 },
  modal: { background:'#fff', padding:30, borderRadius:12, boxShadow:'0 10px 30px rgba(0,0,0,0.2)', width:'90%', maxWidth:420, zIndex:1001, position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)' },
  modalTitle: { fontSize:22, fontWeight:600, color:'#2c3e50', marginBottom:20, textAlign:'center' },
  modalFormGroup: { marginBottom:15 },
  modalLabel: { display:'block', marginBottom:5, fontWeight:500, color:'#34495e' },
  modalInput: { width:'100%', padding:10, borderRadius:8, border:'1px solid #bdc3c7', boxSizing:'border-box' },
  modalButtonGroup: { display:'flex', justifyContent:'flex-end', gap:10, marginTop:20 },
  confirmButton: { padding:'12px 20px', border:'none', borderRadius:8, backgroundColor:'#2ecc71', color:'#fff', fontWeight:600, cursor:'pointer' },
  cancelButton: { padding:'12px 20px', border:'1px solid #bdc3c7', borderRadius:8, backgroundColor:'transparent', color:'#7f8c8d', fontWeight:600, cursor:'pointer' },
};
