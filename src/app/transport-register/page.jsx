"use client";
import { useEffect, useMemo, useState } from 'react';
import { FaBus } from 'react-icons/fa';
import { formatWelcome } from '@/lib/formatters';
import { useRouter } from 'next/navigation';

export default function TransportRegister() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState('department');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employee_code:'', full_name:'', employee_type:'', plant_id:'', department_id:'', route_id:'', pickup_point:'' });
  const [plants, setPlants] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [empTypes, setEmpTypes] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [adding, setAdding] = useState({ type: null, value: '', route_id: '', point_no: '' }); // route_id used when adding pickup, point_no for numbering
  const [managing, setManaging] = useState({ empType: false, pickup: false });
  const [editing, setEditing] = useState({ kind: null, id: null, value: '', extra: null }); // extra for route_id on pickup

  useEffect(() => { try { const u = JSON.parse(localStorage.getItem('user')||'null'); setUser(u); } catch {} }, []);
  const isAdminga = useMemo(() => String(user?.username||'').toLowerCase()==='adminga' || user?.is_super_admin, [user]);

  // Non-admin should not be redirected; instead, auto-open the registration modal and hide the list
  useEffect(() => { if (user && !isAdminga) setShowModal(true); }, [user, isAdminga]);

  // Load master data to provide dropdowns
  const fetchMasters = async () => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization:`Bearer ${token}` } : {};
    const [p, d, r, et, pp] = await Promise.all([
      fetch('/api/ot/plants', { headers }),
      fetch('/api/ot/departments', { headers }),
      fetch('/api/ot/routes', { headers }),
      fetch('/api/transport/masters/employee-types', { headers }),
      fetch('/api/transport/masters/pickup-points', { headers })
    ]);
    const parseMaybeJson = async (res) => {
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) { try { return await res.json(); } catch { return null; } }
      return null;
    };
    const [pRows, dRows, rRows, etRows, ppRows] = await Promise.all([parseMaybeJson(p), parseMaybeJson(d), parseMaybeJson(r), parseMaybeJson(et), parseMaybeJson(pp)]);
    setPlants(Array.isArray(pRows) ? pRows : []);
    setDepartments(Array.isArray(dRows) ? dRows : []);
    setRoutes(Array.isArray(rRows) ? rRows : []);
    setEmpTypes(Array.isArray(etRows) ? etRows : []);
    setPickupPoints(Array.isArray(ppRows) ? ppRows : []);
  };
  useEffect(() => { fetchMasters(); }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = `/api/transport/registrations${q?`?q=${encodeURIComponent(q)}`:''}`;
      const res = await fetch(url, { headers:{ Authorization:`Bearer ${token}` }, cache:'no-store' });
      const ct = res.headers.get('content-type') || '';
      let data = null;
      if (ct.includes('application/json')) { try { data = await res.json(); } catch { data = null; } }
      setList(Array.isArray(data) ? data : []);
    } finally { setLoading(false); }
  };
  useEffect(() => { if (isAdminga) fetchList(); }, [q, isAdminga]);

  const handleLogout = () => { try{ localStorage.removeItem('token'); localStorage.removeItem('user'); } catch{} router.push('/'); };

  const downloadCsv = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/transport/registrations?format=csv${q?`&q=${encodeURIComponent(q)}`:''}`, { headers:{ Authorization:`Bearer ${token}` } });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'transport-registrations.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const submitForm = async (e) => {
    e?.preventDefault();
    // Basic validation
    if (!form.employee_code.trim() || !form.full_name.trim()) {
      alert('กรุณากรอกรหัสพนักงานและชื่อ-นามสกุล');
      return;
    }
    const payload = {
      employee_code: form.employee_code.trim(),
      full_name: form.full_name.trim(),
      employee_type: form.employee_type?.trim() || null,
      plant_id: form.plant_id ? Number(form.plant_id) : null,
      department_id: form.department_id ? Number(form.department_id) : null,
      route_id: form.route_id ? Number(form.route_id) : null,
      pickup_point: form.pickup_point?.trim() || null,
    };
  const token = localStorage.getItem('token');
  const url = '/api/transport/registrations';
  const method = isEdit && form.id ? 'PUT' : 'POST';
  const body = method === 'PUT' ? JSON.stringify({ id: form.id, ...payload }) : JSON.stringify(payload);
  const res = await fetch(url, { method, headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body });
    let data = null;
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) { try { data = await res.json(); } catch { data = null; } }
    if (!res.ok) { alert((data && data.error) || 'บันทึกล้มเหลว'); return; }
    setShowModal(false); setIsEdit(false); setForm({ employee_code:'', full_name:'', employee_type:'', plant_id:'', department_id:'', route_id:'', pickup_point:'' });
    fetchList();
  };

  const openAddModal = () => {
    setIsEdit(false);
    setForm({ employee_code:'', full_name:'', employee_type:'', plant_id:'', department_id:'', route_id:'', pickup_point:'' });
    setShowModal(true);
  };

  const openEditModal = (row) => {
    setIsEdit(true);
    setForm({
      id: row.id,
      employee_code: row.employee_code || '',
      full_name: row.full_name || '',
      employee_type: row.employee_type || '',
      plant_id: row.plant_id || '',
      department_id: row.department_id || '',
      route_id: row.route_id || '',
      pickup_point: row.pickup_point || ''
    });
    setShowModal(true);
  };

  // Add inline new option handlers
  const addNewOption = async (kind) => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type':'application/json', Authorization:`Bearer ${token}` };
    const name = (adding.value || '').trim();
    if (!name) return;
    try {
      if (kind === 'empType') {
        const res = await fetch('/api/transport/masters/employee-types', { method:'POST', headers, body: JSON.stringify({ name }) });
        if (!res.ok) throw new Error('เพิ่มประเภทพนักงานล้มเหลว');
        setAdding({ type:null, value:'' });
        await fetchMasters();
        setForm(prev => ({ ...prev, employee_type: name }));
      } else if (kind === 'pickup') {
        const routeId = adding.route_id ? Number(adding.route_id) : null;
        if (!routeId) { alert('กรุณาเลือกสายรถสำหรับจุดขึ้นรถใหม่'); return; }
        const pointNo = (adding.point_no || '').toString().trim();
        const finalName = pointNo ? `${name} จุดที่ ${pointNo}` : name;
        const body = { name: finalName, route_id: routeId };
        const res = await fetch('/api/transport/masters/pickup-points', { method:'POST', headers, body: JSON.stringify(body) });
        if (!res.ok) throw new Error('เพิ่มจุดขึ้นรถล้มเหลว');
        setAdding({ type:null, value:'', route_id:'', point_no:'' });
        await fetchMasters();
        setForm(prev => ({ ...prev, pickup_point: finalName }));
      }
    } catch (e) { alert(e.message); }
  };

  // Save edits for inline editing
  const saveEditEmpType = async () => {
    if (!(editing.kind === 'empType' && editing.id)) return;
    const name = (editing.value || '').trim();
    if (!name) return;
    const token = localStorage.getItem('token');
    const res = await fetch('/api/transport/masters/employee-types', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: editing.id, name })
    });
    let data = null; const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) { try { data = await res.json(); } catch { data = null; } }
    if (!res.ok) { alert((data && data.error) || 'แก้ไขข้อมูลล้มเหลว'); return; }
    await fetchMasters();
    setEditing({ kind: null, id: null, value: '', extra: null });
  };

  const saveEditPickup = async () => {
    if (!(editing.kind === 'pickup' && editing.id)) return;
    const name = (editing.value || '').trim();
    if (!name) return;
    const token = localStorage.getItem('token');
    const body = { id: editing.id, name, route_id: editing.extra?.route_id || null };
    const res = await fetch('/api/transport/masters/pickup-points', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    let data = null; const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) { try { data = await res.json(); } catch { data = null; } }
    if (!res.ok) { alert((data && data.error) || 'แก้ไขข้อมูลล้มเหลว'); return; }
    await fetchMasters();
    setEditing({ kind: null, id: null, value: '', extra: null });
  };

  // Delete options
  const deleteEmpType = async (id) => {
    if (!confirm('ต้องการลบประเภทพนักงานนี้หรือไม่?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/transport/masters/employee-types?id=${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } });
    let data = null; const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) { try { data = await res.json(); } catch { data = null; } }
    if (!res.ok) { alert((data && data.error) || 'ลบข้อมูลล้มเหลว'); return; }
    await fetchMasters();
    // Clear form selection if it pointed to deleted value
    if (!empTypes.find(t => t.id === id)?.name === form.employee_type) {
      setForm(prev => ({ ...prev, employee_type: '' }));
    }
  };
  const deletePickupPoint = async (id) => {
    if (!confirm('ต้องการลบจุดขึ้นรถนี้หรือไม่?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/transport/masters/pickup-points?id=${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } });
    let data = null; const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) { try { data = await res.json(); } catch { data = null; } }
    if (!res.ok) { alert((data && data.error) || 'ลบข้อมูลล้มเหลว'); return; }
    await fetchMasters();
    // Clear selection if deleted
    const deleted = pickupPoints.find(pp => pp.id === id);
    if (deleted && deleted.name === form.pickup_point) {
      setForm(prev => ({ ...prev, pickup_point: '' }));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('ต้องการลบข้อมูลนี้หรือไม่?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/transport/registrations?id=${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } });
    let data = null; const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) { try { data = await res.json(); } catch { data = null; } }
    if (!res.ok) { alert((data && data.error) || 'ลบข้อมูลล้มเหลว'); return; }
    fetchList();
  };

  const th = { background:'#113046', color:'#fff', padding:'10px 12px', fontWeight:900, border:'1px solid #27475c' };
  const td = { padding:'10px 12px', border:'1px solid #dbe4ea', fontWeight:800, color:'#2f3e4f' };

  const welcomeText = useMemo(() => formatWelcome(user, departments, plants), [user, departments, plants]);

  // Sort support for all columns
  const sortedList = useMemo(() => {
    const arr = Array.isArray(list) ? [...list] : [];
    const keyGetters = {
      employee_code: (r) => r.employee_code || '',
      full_name: (r) => r.full_name || '',
      employee_type: (r) => r.employee_type || '',
      plant: (r) => r.plant_code || '',
      department: (r) => r.dept_code || '',
      route: (r) => r.route_name || '',
      pickup: (r) => r.pickup_point || '',
    };
    const getKey = keyGetters[sortKey] || keyGetters.department;
    arr.sort((a, b) => String(getKey(a)).localeCompare(String(getKey(b)), 'th'));
    return arr;
  }, [list, sortKey]);

  return (
    <div style={{ padding:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div />
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={()=>router.push('/')} style={{ padding:'10px 16px', background:'#34495e', color:'#fff', border:'none', borderRadius:10, fontWeight:800 }}>กลับเมนูหลัก</button>
            <button onClick={handleLogout} style={{ padding:'10px 16px', background:'#e74c3c', color:'#fff', border:'none', borderRadius:10, fontWeight:800 }}>ออกจากระบบ</button>
        </div>
      </div>

      {isAdminga && (
        <>
  <div style={{ fontSize:24, fontWeight:900, color:'#2f3e4f', marginTop:4, marginBottom:8 }}>แก้ไขข้อมูลขึ้นทะเบียนรถรับส่ง</div>
        <div style={{ display:'flex', alignItems:'center', gap:16, margin:'14px 0' }}>
          <button onClick={openAddModal} style={{ padding:'10px 16px', background:'#2ecc71', color:'#fff', border:'none', borderRadius:12, fontWeight:900 }}>+ เพิ่มข้อมูล</button>
          <div>จัดเรียง:</div>
          <select value={sortKey} onChange={e=> setSortKey(e.target.value)} style={{ padding:10, borderRadius:12, border:'1px solid #bdc3c7' }}>
            <option value="employee_code">รหัสพนักงาน</option>
            <option value="full_name">ชื่อ-นามสกุล</option>
            <option value="employee_type">ประเภทพนักงาน</option>
            <option value="plant">โรงงาน</option>
            <option value="department">ฝ่าย</option>
            <option value="route">สายรถ</option>
            <option value="pickup">จุดขึ้นรถ</option>
          </select>
          <div>ค้นหา:</div>
          <input value={q} onChange={e=> setQ(e.target.value)} style={{ padding:10, minWidth:280, border:'1px solid #bdc3c7', borderRadius:12 }} placeholder="รหัสพนักงาน / ชื่อ / จุดขึ้นรถ" />
          <button type="button" onClick={()=>{
            const table = document.getElementById('transport-register-table');
            if(!table) return; const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${table.outerHTML}</body></html>`;
            const blob = new Blob([html], { type:'application/vnd.ms-excel;charset=utf-8;' });
            const url = URL.createObjectURL(blob); const a = document.createElement('a');
            a.download = `transport-register.xlsx.xls`; a.href = url; a.click(); URL.revokeObjectURL(url);
          }} style={{ padding:'10px 16px', background:'#2e7d32', color:'#fff', border:'none', borderRadius:12, fontWeight:900 }}>ดาวน์โหลด Excel</button>
        </div>
        </>
      )}

      {isAdminga && (
      <div style={{ overflowX:'auto', background:'#fff', borderRadius:12, padding:0, border:'1px solid #dbe4ea' }}>
        <table id="transport-register-table" style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              <th style={th}>รหัสพนักงาน:</th>
              <th style={th}>ชื่อ-นามสกุล:</th>
              <th style={th}>ประเภทพนักงาน</th>
              <th style={th}>โรงงาน:</th>
              <th style={th}>ฝ่าย:</th>
              <th style={th}>สายรถ:</th>
              <th style={th}>จุดขึ้นรถ:</th>
              <th style={th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedList.map((r) => (
              <tr key={r.id}>
                <td style={td}>{r.employee_code}</td>
                <td style={td}>{r.full_name}</td>
                <td style={td}>{r.employee_type||''}</td>
                <td style={td}>{r.plant_code||''}</td>
                <td style={td}>{r.dept_code||''}</td>
                <td style={td}>{r.route_name||''}</td>
                <td style={td}>{r.pickup_point||''}</td>
                <td style={td}>
                  {isAdminga && (
                    <>
                      <button onClick={()=> openEditModal(r)} style={{ padding:'8px 12px', background:'#42a5f5', color:'#fff', border:'none', borderRadius:10, fontWeight:800, marginRight:8 }}>แก้ไข</button>
                      <button onClick={()=> handleDelete(r.id)} style={{ padding:'8px 12px', background:'#e74c3c', color:'#fff', border:'none', borderRadius:10, fontWeight:800 }}>ลบ</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr><td colSpan={8} style={{ ...td, textAlign:'center', fontWeight:700 }}>{loading? 'กำลังโหลด..':'ไม่พบข้อมูล'}</td></tr>
            )}
          </tbody>
        </table>
  </div>
  )}

  {/* Non-admin: show inline form (no overlay) */}
  {!isAdminga && (
        <div style={{ display:'flex', justifyContent:'center', marginTop:16 }}>
          <div style={{ background:'#fff', padding:20, borderRadius:16, width:'min(92vw, 680px)', minWidth:320, boxShadow:'0 4px 18px rgba(0,0,0,0.08)' }}>
            <div style={{ marginBottom:12 }}>
              <div style={{ color:'#2f3e4f', fontWeight:600, marginBottom:6 }}>ยินดีต้อนรับ, {welcomeText}</div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <FaBus size={28} color="#2f3e4f" />
                <div style={{ fontSize:24, fontWeight:900 }}>ขึ้นทะเบียนรถรับส่ง</div>
              </div>
            </div>
            <form onSubmit={submitForm}>
              {/* รหัสพนักงาน */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontWeight:900, color:'#2f3e4f', marginBottom:6 }}>รหัสพนักงาน:</div>
                <input value={form.employee_code} onChange={e=> setForm(prev=>({ ...prev, employee_code: e.target.value }))} style={{ width:'100%', padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14 }} />
              </div>
              {/* ชื่อ-นามสกุล */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontWeight:900, color:'#2f3e4f', marginBottom:6 }}>ชื่อ-นามสกุล:</div>
                <input value={form.full_name} onChange={e=> setForm(prev=>({ ...prev, full_name: e.target.value }))} style={{ width:'100%', padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14 }} />
              </div>
              {/* ประเภทพนักงาน */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontWeight:900, color:'#2f3e4f', marginBottom:6 }}>ประเภทพนักงาน:</div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <select value={form.employee_type} onChange={e=> setForm(prev=>({ ...prev, employee_type: e.target.value }))} style={{ flex:1, padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14 }}>
                    <option value="">- เลือกประเภทพนักงาน -</option>
                    {empTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                  </select>
                  {isAdminga && (
                    <>
                      <button type="button" onClick={()=> setAdding({ type:'empType', value:'' })} style={{ padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14, background:'#f5f7f9', fontWeight:800 }}>+ เพิ่ม</button>
                      <button type="button" onClick={()=> setManaging(prev=>({ ...prev, empType: !prev.empType }))} style={{ padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14, background:'#f5f7f9', fontWeight:800 }}>จัดการ</button>
                    </>
                  )}
                </div>
                {isAdminga && adding.type==='empType' && (
                  <div style={{ display:'flex', gap:8, marginTop:8 }}>
                    <input placeholder="ชื่อประเภทพนักงานใหม่" value={adding.value} onChange={e=> setAdding(prev=>({ ...prev, value: e.target.value }))} style={{ flex:1, padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14 }} />
                    <button type="button" onClick={()=> addNewOption('empType')} style={{ padding:'12px 14px', border:'none', borderRadius:14, background:'#2ecc71', color:'#fff', fontWeight:900 }}>บันทึก</button>
                    <button type="button" onClick={()=> setAdding({ type:null, value:'' })} style={{ padding:'12px 14px', border:'none', borderRadius:14, background:'#90a4ae', color:'#2c3e50', fontWeight:900 }}>ยกเลิก</button>
                  </div>
                )}
                {isAdminga && managing.empType && (
                  <div style={{ marginTop:8, background:'#f9fbfd', border:'1px solid #dbe4ea', borderRadius:12, padding:8 }}>
                    {empTypes.length === 0 && <div style={{ color:'#7f8c8d' }}>ยังไม่มีข้อมูล</div>}
                    {empTypes.map(t => (
                      <div key={t.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 8px' }}>
                        <div>{t.name}</div>
                        <button type="button" onClick={()=> deleteEmpType(t.id)} style={{ padding:'6px 10px', background:'#e74c3c', color:'#fff', border:'none', borderRadius:8, fontWeight:800 }}>ลบ</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* โรงงาน */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontWeight:900, color:'#2f3e4f', marginBottom:6 }}>โรงงาน:</div>
                <select value={form.plant_id} onChange={e=> setForm(prev=>({ ...prev, plant_id: e.target.value, department_id: '' }))} style={{ width:'100%', padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14 }}>
                  <option value="">- เลือกโรงงาน -</option>
                  {plants.map(p => {
                    const label = (p.code && p.name && p.name !== p.code)
                      ? `${p.code} - ${p.name}`
                      : (p.code || p.name || '');
                    return <option key={p.id} value={p.id}>{label}</option>;
                  })}
                </select>
              </div>
              {/* ฝ่าย (filter by plant) */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontWeight:900, color:'#2f3e4f', marginBottom:6 }}>ฝ่าย:</div>
                <select value={form.department_id} onChange={e=> setForm(prev=>({ ...prev, department_id: e.target.value }))} style={{ width:'100%', padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14 }}>
                  <option value="">- เลือกฝ่าย -</option>
                  {departments.filter(d => !form.plant_id || d.plant_id === Number(form.plant_id)).map(d => (
                    <option key={d.id} value={d.id}>{d.code || d.name}</option>
                  ))}
                </select>
              </div>
              {/* สายรถ */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontWeight:900, color:'#2f3e4f', marginBottom:6 }}>สายรถ:</div>
                <select value={form.route_id} onChange={e=> { const v = e.target.value; setForm(prev=>({ ...prev, route_id: v })); }} style={{ width:'100%', padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14 }}>
                  <option value="">- เลือกสายรถ -</option>
                  {routes.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              {/* จุดขึ้นรถ */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontWeight:900, color:'#2f3e4f', marginBottom:6 }}>จุดขึ้นรถ:</div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <select value={form.pickup_point} disabled={!form.route_id} onChange={e=> setForm(prev=>({ ...prev, pickup_point: e.target.value }))} style={{ flex:1, padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14, opacity: !form.route_id ? 0.6 : 1 }}>
                    {!form.route_id ? (
                      <option value="">- เลือกสายรถก่อน -</option>
                    ) : (
                      <>
                        <option value="">- เลือกจุดขึ้นรถ -</option>
                        {pickupPoints
                          .filter(pp => pp.route_id === Number(form.route_id))
                          .map(pp => <option key={pp.id} value={pp.name}>{pp.name}</option>)}
                      </>
                    )}
                  </select>
                  {isAdminga && (
                    <>
                      <button type="button" onClick={()=> setAdding({ type:'pickup', value:'', route_id: form.route_id ? Number(form.route_id) : '', point_no:'' })} style={{ padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14, background:'#f5f7f9', fontWeight:800 }}>+ เพิ่ม</button>
                      <button type="button" disabled={!form.route_id} onClick={()=> setManaging(prev=>({ ...prev, pickup: !prev.pickup }))} style={{ padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14, background:'#f5f7f9', fontWeight:800, opacity: !form.route_id ? 0.5 : 1 }}>จัดการ</button>
                    </>
                  )}
                </div>
                {isAdminga && adding.type==='pickup' && (
                  <div style={{ display:'flex', gap:8, marginTop:8, flexWrap:'wrap' }}>
                    <select value={adding.route_id} onChange={e=> setAdding(prev=>({ ...prev, route_id: e.target.value }))} style={{ padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14, flex:'0 0 200px' }}>
                      <option value="">- เลือกสายรถ -</option>
                      {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                    <input placeholder="เลขจุด" value={adding.point_no} onChange={e=> setAdding(prev=>({ ...prev, point_no: e.target.value }))} style={{ width:110, padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14, flex:'0 0 110px' }} />
                    <input placeholder="ชื่อจุดขึ้นรถใหม่" value={adding.value} onChange={e=> setAdding(prev=>({ ...prev, value: e.target.value }))} style={{ flex:'1 1 220px', minWidth:220, padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14 }} />
                    <button type="button" onClick={()=> addNewOption('pickup')} style={{ padding:'12px 14px', border:'none', borderRadius:14, background:'#2ecc71', color:'#fff', fontWeight:900, flex:'0 0 auto' }}>บันทึก</button>
                    <button type="button" onClick={()=> setAdding({ type:null, value:'', route_id:'', point_no:'' })} style={{ padding:'12px 14px', border:'none', borderRadius:14, background:'#90a4ae', color:'#2c3e50', fontWeight:900, flex:'0 0 auto' }}>ยกเลิก</button>
                  </div>
                )}
                {isAdminga && managing.pickup && (
                  <div style={{ marginTop:8, background:'#f9fbfd', border:'1px solid #dbe4ea', borderRadius:12, padding:8 }}>
                    {!form.route_id ? (
                      <div style={{ color:'#7f8c8d' }}>กรุณาเลือกสายรถก่อนเพื่อจัดการจุดขึ้นรถ</div>
                    ) : (
                      <>
                        {pickupPoints.filter(pp => pp.route_id === Number(form.route_id)).length === 0 && <div style={{ color:'#7f8c8d' }}>ยังไม่มีข้อมูล</div>}
                        {pickupPoints
                          .filter(pp => pp.route_id === Number(form.route_id))
                          .map(pp => (
                            <div key={pp.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 8px' }}>
                              <div>{pp.name}</div>
                              <button type="button" onClick={()=> deletePickupPoint(pp.id)} style={{ padding:'6px 10px', background:'#e74c3c', color:'#fff', border:'none', borderRadius:8, fontWeight:800 }}>ลบ</button>
                            </div>
                          ))}
                      </>
                    )}
                  </div>
                )}
              </div>
              <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:14 }}>
                <button type="submit" style={{ padding:'12px 16px', background:'#17344f', color:'#fff', border:'none', borderRadius:12, fontWeight:900 }}>บันทึกข้อมูล</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin: keep modal overlay for add/edit */}
      {isAdminga && showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'#fff', padding:20, borderRadius:16, width:520, maxHeight:'85vh', overflowY:'auto' }}>
            <div style={{ marginBottom:12 }}>
              <div style={{ color:'#2f3e4f', fontWeight:600, marginBottom:6 }}>ยินดีต้อนรับ, {welcomeText}</div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <FaBus size={28} color="#2f3e4f" />
                <div style={{ fontSize:24, fontWeight:900 }}>ขึ้นทะเบียนรถรับส่ง</div>
              </div>
            </div>
            <form onSubmit={submitForm}>
              {/* รหัสพนักงาน */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontWeight:900, color:'#2f3e4f', marginBottom:6 }}>รหัสพนักงาน:</div>
                <input value={form.employee_code} onChange={e=> setForm(prev=>({ ...prev, employee_code: e.target.value }))} style={{ width:'100%', padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14 }} />
              </div>
              {/* ชื่อ-นามสกุล */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontWeight:900, color:'#2f3e4f', marginBottom:6 }}>ชื่อ-นามสกุล:</div>
                <input value={form.full_name} onChange={e=> setForm(prev=>({ ...prev, full_name: e.target.value }))} style={{ width:'100%', padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14 }} />
              </div>
              {/* ประเภทพนักงาน */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontWeight:900, color:'#2f3e4f', marginBottom:6 }}>ประเภทพนักงาน:</div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <select value={form.employee_type} onChange={e=> setForm(prev=>({ ...prev, employee_type: e.target.value }))} style={{ flex:1, padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14 }}>
                    <option value="">- เลือกประเภทพนักงาน -</option>
                    {empTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                  </select>
                  {isAdminga && (
                    <>
                      <button type="button" onClick={()=> setAdding({ type:'empType', value:'' })} style={{ padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14, background:'#f5f7f9', fontWeight:800 }}>+ เพิ่ม</button>
                      <button type="button" onClick={()=> setManaging(prev=>({ ...prev, empType: !prev.empType }))} style={{ padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14, background:'#f5f7f9', fontWeight:800 }}>จัดการ</button>
                    </>
                  )}
                </div>
                {isAdminga && adding.type==='empType' && (
                  <div style={{ display:'flex', gap:8, marginTop:8 }}>
                    <input placeholder="ชื่อประเภทพนักงานใหม่" value={adding.value} onChange={e=> setAdding(prev=>({ ...prev, value: e.target.value }))} style={{ flex:1, padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14 }} />
                    <button type="button" onClick={()=> addNewOption('empType')} style={{ padding:'12px 14px', border:'none', borderRadius:14, background:'#2ecc71', color:'#fff', fontWeight:900 }}>บันทึก</button>
                    <button type="button" onClick={()=> setAdding({ type:null, value:'' })} style={{ padding:'12px 14px', border:'none', borderRadius:14, background:'#90a4ae', color:'#2c3e50', fontWeight:900 }}>ยกเลิก</button>
                  </div>
                )}
                {isAdminga && managing.empType && (
                  <div style={{ marginTop:8, background:'#f9fbfd', border:'1px solid #dbe4ea', borderRadius:12, padding:8, maxHeight:220, overflowY:'auto' }}>
                    {empTypes.length === 0 && <div style={{ color:'#7f8c8d' }}>ยังไม่มีข้อมูล</div>}
                    {empTypes.map(t => {
                      const isEditing = editing.kind==='empType' && editing.id===t.id;
                      return (
                        <div key={t.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 8px', gap:8 }}>
                          <div style={{ flex:1 }}>
                            {isEditing ? (
                              <input value={editing.value} onChange={e=> setEditing(prev=>({ ...prev, value: e.target.value }))} style={{ width:'100%', padding:'8px 10px', border:'1px solid #bdc3c7', borderRadius:8 }} />
                            ) : (
                              <span>{t.name}</span>
                            )}
                          </div>
                          {isEditing ? (
                            <>
                              <button type="button" onClick={saveEditEmpType} style={{ padding:'6px 10px', background:'#2ecc71', color:'#fff', border:'none', borderRadius:8, fontWeight:800 }}>บันทึก</button>
                              <button type="button" onClick={()=> setEditing({ kind:null, id:null, value:'', extra:null })} style={{ padding:'6px 10px', background:'#90a4ae', color:'#2c3e50', border:'none', borderRadius:8, fontWeight:800 }}>ยกเลิก</button>
                            </>
                          ) : (
                            <>
                              <button type="button" onClick={()=> setEditing({ kind:'empType', id:t.id, value:t.name, extra:null })} style={{ padding:'6px 10px', background:'#3498db', color:'#fff', border:'none', borderRadius:8, fontWeight:800 }}>แก้ไข</button>
                              <button type="button" onClick={()=> deleteEmpType(t.id)} style={{ padding:'6px 10px', background:'#e74c3c', color:'#fff', border:'none', borderRadius:8, fontWeight:800 }}>ลบ</button>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {/* โรงงาน */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontWeight:900, color:'#2f3e4f', marginBottom:6 }}>โรงงาน:</div>
                <select value={form.plant_id} onChange={e=> setForm(prev=>({ ...prev, plant_id: e.target.value, department_id: '' }))} style={{ width:'100%', padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14 }}>
                  <option value="">- เลือกโรงงาน -</option>
                  {plants.map(p => {
                    const label = (p.code && p.name && p.name !== p.code)
                      ? `${p.code} - ${p.name}`
                      : (p.code || p.name || '');
                    return <option key={p.id} value={p.id}>{label}</option>;
                  })}
                </select>
              </div>
              {/* ฝ่าย */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontWeight:900, color:'#2f3e4f', marginBottom:6 }}>ฝ่าย:</div>
                <select value={form.department_id} onChange={e=> setForm(prev=>({ ...prev, department_id: e.target.value }))} style={{ width:'100%', padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14 }}>
                  <option value="">- เลือกฝ่าย -</option>
                  {departments.filter(d => !form.plant_id || d.plant_id === Number(form.plant_id)).map(d => (
                    <option key={d.id} value={d.id}>{d.code || d.name}</option>
                  ))}
                </select>
              </div>
              {/* สายรถ */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontWeight:900, color:'#2f3e4f', marginBottom:6 }}>สายรถ:</div>
                <select value={form.route_id} onChange={e=> { const v = e.target.value; setForm(prev=>({ ...prev, route_id: v })); }} style={{ width:'100%', padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14 }}>
                  <option value="">- เลือกสายรถ -</option>
                  {routes.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              {/* จุดขึ้นรถ */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontWeight:900, color:'#2f3e4f', marginBottom:6 }}>จุดขึ้นรถ:</div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <select value={form.pickup_point} disabled={!form.route_id} onChange={e=> setForm(prev=>({ ...prev, pickup_point: e.target.value }))} style={{ flex:1, padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14, opacity: !form.route_id ? 0.6 : 1 }}>
                    {!form.route_id ? (
                      <option value="">- เลือกสายรถก่อน -</option>
                    ) : (
                      <>
                        <option value="">- เลือกจุดขึ้นรถ -</option>
                        {pickupPoints
                          .filter(pp => pp.route_id === Number(form.route_id))
                          .map(pp => <option key={pp.id} value={pp.name}>{pp.name}</option>)}
                      </>
                    )}
                  </select>
                  {isAdminga && (
                    <>
                      <button type="button" onClick={()=> setAdding({ type:'pickup', value:'', route_id: form.route_id ? Number(form.route_id) : '', point_no:'' })} style={{ padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14, background:'#f5f7f9', fontWeight:800 }}>+ เพิ่ม</button>
                      <button type="button" disabled={!form.route_id} onClick={()=> setManaging(prev=>({ ...prev, pickup: !prev.pickup }))} style={{ padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14, background:'#f5f7f9', fontWeight:800, opacity: !form.route_id ? 0.5 : 1 }}>จัดการ</button>
                    </>
                  )}
                </div>
                {isAdminga && adding.type==='pickup' && (
                  <div style={{ display:'flex', gap:8, marginTop:8, flexWrap:'wrap' }}>
                    <select value={adding.route_id} onChange={e=> setAdding(prev=>({ ...prev, route_id: e.target.value }))} style={{ padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14, flex:'0 0 200px' }}>
                      <option value="">- เลือกสายรถ -</option>
                      {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                    <input placeholder="เลขจุด" value={adding.point_no} onChange={e=> setAdding(prev=>({ ...prev, point_no: e.target.value }))} style={{ width:110, padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14, flex:'0 0 110px' }} />
                    <input placeholder="ชื่อจุดขึ้นรถใหม่" value={adding.value} onChange={e=> setAdding(prev=>({ ...prev, value: e.target.value }))} style={{ flex:'1 1 220px', minWidth:220, padding:'12px 14px', border:'1px solid #bdc3c7', borderRadius:14 }} />
                    <button type="button" onClick={()=> addNewOption('pickup')} style={{ padding:'12px 14px', border:'none', borderRadius:14, background:'#2ecc71', color:'#fff', fontWeight:900, flex:'0 0 auto' }}>บันทึก</button>
                    <button type="button" onClick={()=> setAdding({ type:null, value:'', route_id:'', point_no:'' })} style={{ padding:'12px 14px', border:'none', borderRadius:14, background:'#90a4ae', color:'#2c3e50', fontWeight:900, flex:'0 0 auto' }}>ยกเลิก</button>
                  </div>
                )}
                {isAdminga && managing.pickup && (
                  <div style={{ marginTop:8, background:'#f9fbfd', border:'1px solid #dbe4ea', borderRadius:12, padding:8, maxHeight:220, overflowY:'auto' }}>
                    {!form.route_id ? (
                      <div style={{ color:'#7f8c8d' }}>กรุณาเลือกสายรถก่อนเพื่อจัดการจุดขึ้นรถ</div>
                    ) : (
                      <>
                        {pickupPoints.filter(pp => pp.route_id === Number(form.route_id)).length === 0 && <div style={{ color:'#7f8c8d' }}>ยังไม่มีข้อมูล</div>}
                        {pickupPoints
                          .filter(pp => pp.route_id === Number(form.route_id))
                          .map(pp => {
                        const isEditing = editing.kind==='pickup' && editing.id===pp.id;
                        return (
                          <div key={pp.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 8px', gap:8 }}>
                            <div style={{ flex:1 }}>
                              {isEditing ? (
                                <input value={editing.value} onChange={e=> setEditing(prev=>({ ...prev, value: e.target.value }))} style={{ width:'100%', padding:'8px 10px', border:'1px solid #bdc3c7', borderRadius:8 }} />
                              ) : (
                                    <span>{pp.name}</span>
                              )}
                            </div>
                            {isEditing ? (
                              <>
                                <button type="button" onClick={saveEditPickup} style={{ padding:'6px 10px', background:'#2ecc71', color:'#fff', border:'none', borderRadius:8, fontWeight:800 }}>บันทึก</button>
                                <button type="button" onClick={()=> setEditing({ kind:null, id:null, value:'', extra:null })} style={{ padding:'6px 10px', background:'#90a4ae', color:'#2c3e50', border:'none', borderRadius:8, fontWeight:800 }}>ยกเลิก</button>
                              </>
                            ) : (
                              <>
                                <button type="button" onClick={()=> setEditing({ kind:'pickup', id:pp.id, value:pp.name, extra:{ route_id: pp.route_id||null } })} style={{ padding:'6px 10px', background:'#3498db', color:'#fff', border:'none', borderRadius:8, fontWeight:800 }}>แก้ไข</button>
                                <button type="button" onClick={()=> deletePickupPoint(pp.id)} style={{ padding:'6px 10px', background:'#e74c3c', color:'#fff', border:'none', borderRadius:8, fontWeight:800 }}>ลบ</button>
                              </>
                            )}
                          </div>
                        );
                          })}
                      </>
                    )}
                  </div>
                )}
              </div>
              <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:14 }}>
                <button type="submit" style={{ padding:'12px 16px', background:'#17344f', color:'#fff', border:'none', borderRadius:12, fontWeight:900 }}>บันทึกข้อมูล</button>
                <button type="button" onClick={()=> setShowModal(false)} style={{ padding:'12px 16px', background:'#90a4ae', color:'#2c3e50', border:'none', borderRadius:12, fontWeight:900 }}>ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
