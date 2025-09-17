(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/formatters.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Shared UI formatters
// Format welcome text consistently across pages
// Returns a string like: "ยินดีต้อนรับ, {displayName} {Dept1, Dept2} ({Plant1, Plant2})"
// Inputs:
// - user: { display_name, username, department, plant_id, department_id, department_ids }
// - departments: [{ id, code, name, plant_id, plant_code }]
// - plants: [{ id, code, name }]
__turbopack_context__.s([
    "formatWelcome",
    ()=>formatWelcome
]);
function formatWelcome(user) {
    let departments = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [], plants = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    if (!user) return "";
    const displayName = user.display_name || user.username || "";
    // Special display for adminga: show all plant codes to reflect global scope
    try {
        const isAdminga = String(user.username || '').toLowerCase() === 'adminga';
        if (isAdminga) {
            const allPlantCodes = (plants || []).map((p)=>p === null || p === void 0 ? void 0 : p.code).filter(Boolean);
            if (allPlantCodes.length) {
                return "".concat(displayName, " ").concat(allPlantCodes.join(' '));
            }
        // Fallback to default formatting below if no plants are loaded yet
        }
    } catch (e) {}
    // Collect department ids (multi first, then single, else none)
    const deptIds = Array.isArray(user.department_ids) && user.department_ids.length ? user.department_ids : user.department_id ? [
        user.department_id
    ] : [];
    // Build department label list
    const deptLabels = [];
    const plantCodesFromDepts = new Set();
    if (deptIds.length) {
        for (const id of deptIds){
            const d = (departments || []).find((x)=>x.id === id);
            if (d) {
                const label = d.code || d.name || "";
                if (label) deptLabels.push(label);
                if (d.plant_code) plantCodesFromDepts.add(d.plant_code);
                else if (d.plant_id) {
                    const p = (plants || []).find((pp)=>pp.id === d.plant_id);
                    if (p === null || p === void 0 ? void 0 : p.code) plantCodesFromDepts.add(p.code);
                }
            }
        }
    }
    // Fallback dept label when master data is missing
    if (!deptLabels.length && user.department) {
        deptLabels.push(user.department);
    }
    // Build plant code list
    const plantLabels = new Set(plantCodesFromDepts);
    if (!plantLabels.size && user.plant_id) {
        const p = (plants || []).find((pp)=>pp.id === user.plant_id);
        if (p === null || p === void 0 ? void 0 : p.code) plantLabels.add(p.code);
    }
    const deptStr = deptLabels.join(", ");
    const plantStr = Array.from(plantLabels).join(", ");
    const tail = plantStr ? " (".concat(plantStr, ")") : user.department && !deptStr ? " (".concat(user.department, ")") : "";
    return "".concat(displayName).concat(deptStr ? " ".concat(deptStr) : "").concat(tail);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/transport-register/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TransportRegister
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/formatters.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function TransportRegister() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [list, setList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [q, setQ] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [sortKey, setSortKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('department');
    const [showModal, setShowModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        employee_code: '',
        full_name: '',
        employee_type: '',
        plant_id: '',
        department_id: '',
        department_text: '',
        route_id: '',
        pickup_point: ''
    });
    const [plants, setPlants] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [departments, setDepartments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [routes, setRoutes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isEdit, setIsEdit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [empTypes, setEmpTypes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [pickupPoints, setPickupPoints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [adding, setAdding] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        type: null,
        value: '',
        route_id: '',
        point_no: ''
    }); // route_id used when adding pickup, point_no for numbering
    const [managing, setManaging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        empType: false,
        pickup: false
    });
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        kind: null,
        id: null,
        value: '',
        extra: null
    }); // extra for route_id on pickup
    const [successOpen, setSuccessOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // show success popup for non-admin save
    // precomputed burst particles for the success animation
    const bursts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TransportRegister.useMemo[bursts]": ()=>{
            const n = 10;
            const r = 64;
            const colors = [
                '#2ecc71',
                '#00c2c7',
                '#ffd166',
                '#f78fb3',
                '#a29bfe'
            ];
            return Array.from({
                length: n
            }, {
                "TransportRegister.useMemo[bursts]": (_, i)=>{
                    const ang = 2 * Math.PI * i / n;
                    const tx = Math.round(Math.cos(ang) * r) + 'px';
                    const ty = Math.round(Math.sin(ang) * r) + 'px';
                    const color = colors[i % colors.length];
                    return {
                        tx,
                        ty,
                        color
                    };
                }
            }["TransportRegister.useMemo[bursts]"]);
        }
    }["TransportRegister.useMemo[bursts]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TransportRegister.useEffect": ()=>{
            try {
                const u = JSON.parse(localStorage.getItem('user') || 'null');
                setUser(u);
            } catch (e) {}
        }
    }["TransportRegister.useEffect"], []);
    const isAdminga = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TransportRegister.useMemo[isAdminga]": ()=>String((user === null || user === void 0 ? void 0 : user.username) || '').toLowerCase() === 'adminga' || (user === null || user === void 0 ? void 0 : user.is_super_admin)
    }["TransportRegister.useMemo[isAdminga]"], [
        user
    ]);
    // Non-admin should not be redirected; instead, auto-open the registration modal and hide the list
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TransportRegister.useEffect": ()=>{
            if (user && !isAdminga) setShowModal(true);
        }
    }["TransportRegister.useEffect"], [
        user,
        isAdminga
    ]);
    // Load master data to provide dropdowns
    const fetchMasters = async ()=>{
        const token = localStorage.getItem('token');
        const headers = token ? {
            Authorization: "Bearer ".concat(token)
        } : {};
        const [p, d, r, et, pp] = await Promise.all([
            fetch('/api/ot/plants', {
                headers
            }),
            fetch('/api/ot/departments', {
                headers
            }),
            fetch('/api/ot/routes', {
                headers
            }),
            fetch('/api/transport/masters/employee-types', {
                headers
            }),
            fetch('/api/transport/masters/pickup-points', {
                headers
            })
        ]);
        const parseMaybeJson = async (res)=>{
            const ct = res.headers.get('content-type') || '';
            if (ct.includes('application/json')) {
                try {
                    return await res.json();
                } catch (e) {
                    return null;
                }
            }
            return null;
        };
        const [pRows, dRows, rRows, etRows, ppRows] = await Promise.all([
            parseMaybeJson(p),
            parseMaybeJson(d),
            parseMaybeJson(r),
            parseMaybeJson(et),
            parseMaybeJson(pp)
        ]);
        setPlants(Array.isArray(pRows) ? pRows : []);
        setDepartments(Array.isArray(dRows) ? dRows : []);
        setRoutes(Array.isArray(rRows) ? rRows : []);
        setEmpTypes(Array.isArray(etRows) ? etRows : []);
        setPickupPoints(Array.isArray(ppRows) ? ppRows : []);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TransportRegister.useEffect": ()=>{
            fetchMasters();
        }
    }["TransportRegister.useEffect"], []);
    const fetchList = async ()=>{
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = "/api/transport/registrations".concat(q ? "?q=".concat(encodeURIComponent(q)) : '');
            const res = await fetch(url, {
                headers: {
                    Authorization: "Bearer ".concat(token)
                },
                cache: 'no-store'
            });
            const ct = res.headers.get('content-type') || '';
            let data = null;
            if (ct.includes('application/json')) {
                try {
                    data = await res.json();
                } catch (e) {
                    data = null;
                }
            }
            setList(Array.isArray(data) ? data : []);
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TransportRegister.useEffect": ()=>{
            if (isAdminga) fetchList();
        }
    }["TransportRegister.useEffect"], [
        q,
        isAdminga
    ]);
    const handleLogout = ()=>{
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (e) {}
        router.push('/');
    };
    const downloadCsv = async ()=>{
        const token = localStorage.getItem('token');
        const res = await fetch("/api/transport/registrations?format=csv".concat(q ? "&q=".concat(encodeURIComponent(q)) : ''), {
            headers: {
                Authorization: "Bearer ".concat(token)
            }
        });
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transport-registrations.csv';
        a.click();
        URL.revokeObjectURL(url);
    };
    const submitForm = async (e)=>{
        var _form_employee_type, _form_pickup_point;
        e === null || e === void 0 ? void 0 : e.preventDefault();
        // Basic validation
        if (!form.employee_code.trim() || !form.full_name.trim()) {
            alert('กรุณากรอกรหัสพนักงานและชื่อ-นามสกุล');
            return;
        }
        // Map free-text department to an ID from masters (by code or name)
        let derivedDeptId = form.department_id ? Number(form.department_id) : null;
        const depText = (form.department_text || '').trim();
        if (!derivedDeptId && depText) {
            const pool = departments.filter((d)=>!form.plant_id || d.plant_id === Number(form.plant_id));
            const lower = depText.toLowerCase();
            // exact code match first, then name contains
            const exact = pool.find((d)=>String(d.code || '').toLowerCase() === lower) || pool.find((d)=>String(d.name || '').toLowerCase() === lower);
            const partial = exact || pool.find((d)=>String(d.code || '').toLowerCase().includes(lower) || String(d.name || '').toLowerCase().includes(lower));
            if (partial) derivedDeptId = partial.id;
        }
        const payload = {
            employee_code: form.employee_code.trim(),
            full_name: form.full_name.trim(),
            employee_type: ((_form_employee_type = form.employee_type) === null || _form_employee_type === void 0 ? void 0 : _form_employee_type.trim()) || null,
            plant_id: form.plant_id ? Number(form.plant_id) : null,
            department_id: derivedDeptId || null,
            department_text: depText || null,
            route_id: form.route_id ? Number(form.route_id) : null,
            pickup_point: ((_form_pickup_point = form.pickup_point) === null || _form_pickup_point === void 0 ? void 0 : _form_pickup_point.trim()) || null
        };
        const token = localStorage.getItem('token');
        const url = '/api/transport/registrations';
        const method = isEdit && form.id ? 'PUT' : 'POST';
        const body = method === 'PUT' ? JSON.stringify({
            id: form.id,
            ...payload
        }) : JSON.stringify(payload);
        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer ".concat(token)
            },
            body
        });
        let data = null;
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
            try {
                data = await res.json();
            } catch (e) {
                data = null;
            }
        }
        if (!res.ok) {
            alert(data && data.error || 'บันทึกล้มเหลว');
            return;
        }
        setShowModal(false);
        setIsEdit(false);
        setForm({
            employee_code: '',
            full_name: '',
            employee_type: '',
            plant_id: '',
            department_id: '',
            department_text: '',
            route_id: '',
            pickup_point: ''
        });
        if (!isAdminga) setSuccessOpen(true);
        fetchList();
    };
    // Auto close success popup after a short delay for non-admin
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TransportRegister.useEffect": ()=>{
            if (successOpen && !isAdminga) {
                const t = setTimeout({
                    "TransportRegister.useEffect.t": ()=>setSuccessOpen(false)
                }["TransportRegister.useEffect.t"], 5000);
                return ({
                    "TransportRegister.useEffect": ()=>clearTimeout(t)
                })["TransportRegister.useEffect"];
            }
        }
    }["TransportRegister.useEffect"], [
        successOpen,
        isAdminga
    ]);
    const openAddModal = ()=>{
        setIsEdit(false);
        setForm({
            employee_code: '',
            full_name: '',
            employee_type: '',
            plant_id: '',
            department_id: '',
            department_text: '',
            route_id: '',
            pickup_point: ''
        });
        setShowModal(true);
    };
    const openEditModal = (row)=>{
        var _departments_find;
        setIsEdit(true);
        setForm({
            id: row.id,
            employee_code: row.employee_code || '',
            full_name: row.full_name || '',
            employee_type: row.employee_type || '',
            plant_id: row.plant_id || '',
            department_id: row.department_id || '',
            department_text: row.department_text || ((_departments_find = departments.find((d)=>d.id === row.department_id)) === null || _departments_find === void 0 ? void 0 : _departments_find.code) || '',
            route_id: row.route_id || '',
            pickup_point: row.pickup_point || ''
        });
        setShowModal(true);
    };
    // Add inline new option handlers
    const addNewOption = async (kind)=>{
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            Authorization: "Bearer ".concat(token)
        };
        const name = (adding.value || '').trim();
        if (!name) return;
        try {
            if (kind === 'empType') {
                const res = await fetch('/api/transport/masters/employee-types', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        name
                    })
                });
                if (!res.ok) throw new Error('เพิ่มประเภทพนักงานล้มเหลว');
                setAdding({
                    type: null,
                    value: ''
                });
                await fetchMasters();
                setForm((prev)=>({
                        ...prev,
                        employee_type: name
                    }));
            } else if (kind === 'pickup') {
                const routeId = adding.route_id ? Number(adding.route_id) : null;
                if (!routeId) {
                    alert('กรุณาเลือกสายรถสำหรับจุดขึ้นรถใหม่');
                    return;
                }
                const pointNo = (adding.point_no || '').toString().trim();
                const finalName = pointNo ? "".concat(name, " จุดที่ ").concat(pointNo) : name;
                const body = {
                    name: finalName,
                    route_id: routeId
                };
                const res = await fetch('/api/transport/masters/pickup-points', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(body)
                });
                if (!res.ok) throw new Error('เพิ่มจุดขึ้นรถล้มเหลว');
                setAdding({
                    type: null,
                    value: '',
                    route_id: '',
                    point_no: ''
                });
                await fetchMasters();
                setForm((prev)=>({
                        ...prev,
                        pickup_point: finalName
                    }));
            }
        } catch (e) {
            alert(e.message);
        }
    };
    // Save edits for inline editing
    const saveEditEmpType = async ()=>{
        if (!(editing.kind === 'empType' && editing.id)) return;
        const name = (editing.value || '').trim();
        if (!name) return;
        const token = localStorage.getItem('token');
        const res = await fetch('/api/transport/masters/employee-types', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer ".concat(token)
            },
            body: JSON.stringify({
                id: editing.id,
                name
            })
        });
        let data = null;
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
            try {
                data = await res.json();
            } catch (e) {
                data = null;
            }
        }
        if (!res.ok) {
            alert(data && data.error || 'แก้ไขข้อมูลล้มเหลว');
            return;
        }
        await fetchMasters();
        setEditing({
            kind: null,
            id: null,
            value: '',
            extra: null
        });
    };
    const saveEditPickup = async ()=>{
        var _editing_extra;
        if (!(editing.kind === 'pickup' && editing.id)) return;
        const name = (editing.value || '').trim();
        if (!name) return;
        const token = localStorage.getItem('token');
        const body = {
            id: editing.id,
            name,
            route_id: ((_editing_extra = editing.extra) === null || _editing_extra === void 0 ? void 0 : _editing_extra.route_id) || null
        };
        const res = await fetch('/api/transport/masters/pickup-points', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer ".concat(token)
            },
            body: JSON.stringify(body)
        });
        let data = null;
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
            try {
                data = await res.json();
            } catch (e) {
                data = null;
            }
        }
        if (!res.ok) {
            alert(data && data.error || 'แก้ไขข้อมูลล้มเหลว');
            return;
        }
        await fetchMasters();
        setEditing({
            kind: null,
            id: null,
            value: '',
            extra: null
        });
    };
    // Delete options
    const deleteEmpType = async (id)=>{
        var _empTypes_find;
        if (!confirm('ต้องการลบประเภทพนักงานนี้หรือไม่?')) return;
        const token = localStorage.getItem('token');
        const res = await fetch("/api/transport/masters/employee-types?id=".concat(id), {
            method: 'DELETE',
            headers: {
                Authorization: "Bearer ".concat(token)
            }
        });
        let data = null;
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
            try {
                data = await res.json();
            } catch (e) {
                data = null;
            }
        }
        if (!res.ok) {
            alert(data && data.error || 'ลบข้อมูลล้มเหลว');
            return;
        }
        await fetchMasters();
        // Clear form selection if it pointed to deleted value
        if (!((_empTypes_find = empTypes.find((t)=>t.id === id)) === null || _empTypes_find === void 0 ? void 0 : _empTypes_find.name) === form.employee_type) {
            setForm((prev)=>({
                    ...prev,
                    employee_type: ''
                }));
        }
    };
    const deletePickupPoint = async (id)=>{
        if (!confirm('ต้องการลบจุดขึ้นรถนี้หรือไม่?')) return;
        const token = localStorage.getItem('token');
        const res = await fetch("/api/transport/masters/pickup-points?id=".concat(id), {
            method: 'DELETE',
            headers: {
                Authorization: "Bearer ".concat(token)
            }
        });
        let data = null;
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
            try {
                data = await res.json();
            } catch (e) {
                data = null;
            }
        }
        if (!res.ok) {
            alert(data && data.error || 'ลบข้อมูลล้มเหลว');
            return;
        }
        await fetchMasters();
        // Clear selection if deleted
        const deleted = pickupPoints.find((pp)=>pp.id === id);
        if (deleted && deleted.name === form.pickup_point) {
            setForm((prev)=>({
                    ...prev,
                    pickup_point: ''
                }));
        }
    };
    const handleDelete = async (id)=>{
        if (!confirm('ต้องการลบข้อมูลนี้หรือไม่?')) return;
        const token = localStorage.getItem('token');
        const res = await fetch("/api/transport/registrations?id=".concat(id), {
            method: 'DELETE',
            headers: {
                Authorization: "Bearer ".concat(token)
            }
        });
        let data = null;
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
            try {
                data = await res.json();
            } catch (e) {
                data = null;
            }
        }
        if (!res.ok) {
            alert(data && data.error || 'ลบข้อมูลล้มเหลว');
            return;
        }
        fetchList();
    };
    const th = {
        background: '#113046',
        color: '#fff',
        padding: '10px 12px',
        fontWeight: 900,
        border: '1px solid #27475c'
    };
    const td = {
        padding: '10px 12px',
        border: '1px solid #dbe4ea',
        fontWeight: 800,
        color: '#2f3e4f'
    };
    const welcomeText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TransportRegister.useMemo[welcomeText]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatWelcome"])(user, departments, plants)
    }["TransportRegister.useMemo[welcomeText]"], [
        user,
        departments,
        plants
    ]);
    // Display helper: move trailing "จุดที่ N" to the front
    const formatPickupDisplay = (name)=>{
        const s = String(name || '').trim();
        if (!s) return '';
        if (/^จุดที่\s*\d+/u.test(s)) return s; // already leading
        const m = s.match(/^(.+?)\s*จุดที่\s*(\d+)\s*$/u);
        if (m) {
            const base = m[1].trim();
            const no = m[2];
            return "จุดที่ ".concat(no, " - ").concat(base);
        }
        const any = s.match(/จุดที่\s*(\d+)/u);
        if (any) {
            const no = any[1];
            const base = s.replace(/\s*จุดที่\s*\d+\s*/u, ' ').trim();
            return "จุดที่ ".concat(no, " - ").concat(base);
        }
        return s;
    };
    // Sort support for all columns
    const sortedList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TransportRegister.useMemo[sortedList]": ()=>{
            const arr = Array.isArray(list) ? [
                ...list
            ] : [];
            const keyGetters = {
                employee_code: {
                    "TransportRegister.useMemo[sortedList]": (r)=>r.employee_code || ''
                }["TransportRegister.useMemo[sortedList]"],
                full_name: {
                    "TransportRegister.useMemo[sortedList]": (r)=>r.full_name || ''
                }["TransportRegister.useMemo[sortedList]"],
                employee_type: {
                    "TransportRegister.useMemo[sortedList]": (r)=>r.employee_type || ''
                }["TransportRegister.useMemo[sortedList]"],
                plant: {
                    "TransportRegister.useMemo[sortedList]": (r)=>r.plant_code || ''
                }["TransportRegister.useMemo[sortedList]"],
                department: {
                    "TransportRegister.useMemo[sortedList]": (r)=>r.department_text || r.dept_code || ''
                }["TransportRegister.useMemo[sortedList]"],
                route: {
                    "TransportRegister.useMemo[sortedList]": (r)=>r.route_name || ''
                }["TransportRegister.useMemo[sortedList]"],
                pickup: {
                    "TransportRegister.useMemo[sortedList]": (r)=>r.pickup_point || ''
                }["TransportRegister.useMemo[sortedList]"]
            };
            const getKey = keyGetters[sortKey] || keyGetters.department;
            arr.sort({
                "TransportRegister.useMemo[sortedList]": (a, b)=>String(getKey(a)).localeCompare(String(getKey(b)), 'th')
            }["TransportRegister.useMemo[sortedList]"]);
            return arr;
        }
    }["TransportRegister.useMemo[sortedList]"], [
        list,
        sortKey
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: 20
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                        fileName: "[project]/src/app/transport-register/page.jsx",
                        lineNumber: 317,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 10
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push('/'),
                                style: {
                                    padding: '10px 16px',
                                    background: '#34495e',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 10,
                                    fontWeight: 800
                                },
                                children: "กลับเมนูหลัก"
                            }, void 0, false, {
                                fileName: "[project]/src/app/transport-register/page.jsx",
                                lineNumber: 319,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleLogout,
                                style: {
                                    padding: '10px 16px',
                                    background: '#e74c3c',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 10,
                                    fontWeight: 800
                                },
                                children: "ออกจากระบบ"
                            }, void 0, false, {
                                fileName: "[project]/src/app/transport-register/page.jsx",
                                lineNumber: 320,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/transport-register/page.jsx",
                        lineNumber: 318,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/transport-register/page.jsx",
                lineNumber: 316,
                columnNumber: 9
            }, this),
            isAdminga && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 24,
                            fontWeight: 900,
                            color: '#2f3e4f',
                            marginTop: 4,
                            marginBottom: 8
                        },
                        children: "แก้ไขข้อมูลขึ้นทะเบียนรถรับส่ง"
                    }, void 0, false, {
                        fileName: "[project]/src/app/transport-register/page.jsx",
                        lineNumber: 326,
                        columnNumber: 3
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            margin: '14px 0'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: openAddModal,
                                style: {
                                    padding: '10px 16px',
                                    background: '#2ecc71',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 12,
                                    fontWeight: 900
                                },
                                children: "+ เพิ่มข้อมูล"
                            }, void 0, false, {
                                fileName: "[project]/src/app/transport-register/page.jsx",
                                lineNumber: 328,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: "จัดเรียง:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/transport-register/page.jsx",
                                lineNumber: 329,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: sortKey,
                                onChange: (e)=>setSortKey(e.target.value),
                                style: {
                                    padding: 10,
                                    borderRadius: 12,
                                    border: '1px solid #bdc3c7'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "employee_code",
                                        children: "รหัสพนักงาน"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 331,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "full_name",
                                        children: "ชื่อ-นามสกุล"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 332,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "employee_type",
                                        children: "ประเภทพนักงาน"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 333,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "plant",
                                        children: "โรงงาน"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 334,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "department",
                                        children: "ฝ่าย"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 335,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "route",
                                        children: "สายรถ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 336,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "pickup",
                                        children: "จุดขึ้นรถ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 337,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/transport-register/page.jsx",
                                lineNumber: 330,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: "ค้นหา:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/transport-register/page.jsx",
                                lineNumber: 339,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: q,
                                onChange: (e)=>setQ(e.target.value),
                                style: {
                                    padding: 10,
                                    minWidth: 280,
                                    border: '1px solid #bdc3c7',
                                    borderRadius: 12
                                },
                                placeholder: "รหัสพนักงาน / ชื่อ / จุดขึ้นรถ"
                            }, void 0, false, {
                                fileName: "[project]/src/app/transport-register/page.jsx",
                                lineNumber: 340,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    const table = document.getElementById('transport-register-table');
                                    if (!table) return;
                                    const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>'.concat(table.outerHTML, "</body></html>");
                                    const blob = new Blob([
                                        html
                                    ], {
                                        type: 'application/vnd.ms-excel;charset=utf-8;'
                                    });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.download = "transport-register.xlsx.xls";
                                    a.href = url;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                },
                                style: {
                                    padding: '10px 16px',
                                    background: '#2e7d32',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 12,
                                    fontWeight: 900
                                },
                                children: "ดาวน์โหลด Excel"
                            }, void 0, false, {
                                fileName: "[project]/src/app/transport-register/page.jsx",
                                lineNumber: 341,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/transport-register/page.jsx",
                        lineNumber: 327,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true),
            successOpen && !isAdminga && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-2991fc4b4f4a9638" + " " + "tr-success-overlay",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-2991fc4b4f4a9638" + " " + "tr-success-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-2991fc4b4f4a9638" + " " + "tr-icon-wrap",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        viewBox: "0 0 72 72",
                                        className: "jsx-2991fc4b4f4a9638" + " " + "tr-check",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "36",
                                                cy: "36",
                                                r: "34",
                                                fill: "none",
                                                stroke: "#2ecc71",
                                                strokeWidth: "4",
                                                className: "jsx-2991fc4b4f4a9638" + " " + "tr-circle"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                lineNumber: 358,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                fill: "none",
                                                stroke: "#2ecc71",
                                                strokeWidth: "5",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                d: "M20 37 L31 47 L52 26",
                                                className: "jsx-2991fc4b4f4a9638" + " " + "tr-tick"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                lineNumber: 359,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 357,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-2991fc4b4f4a9638" + " " + "tr-burst",
                                        children: bursts.map((b, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    '--tx': b.tx,
                                                    '--ty': b.ty,
                                                    background: b.color
                                                },
                                                className: "jsx-2991fc4b4f4a9638"
                                            }, i, false, {
                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                lineNumber: 363,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 361,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/transport-register/page.jsx",
                                lineNumber: 356,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-2991fc4b4f4a9638" + " " + "tr-title",
                                children: "Success"
                            }, void 0, false, {
                                fileName: "[project]/src/app/transport-register/page.jsx",
                                lineNumber: 367,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-2991fc4b4f4a9638" + " " + "tr-desc"
                            }, void 0, false, {
                                fileName: "[project]/src/app/transport-register/page.jsx",
                                lineNumber: 368,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSuccessOpen(false),
                                className: "jsx-2991fc4b4f4a9638" + " " + "tr-btn",
                                children: "ตกลง"
                            }, void 0, false, {
                                fileName: "[project]/src/app/transport-register/page.jsx",
                                lineNumber: 369,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/transport-register/page.jsx",
                        lineNumber: 355,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        id: "2991fc4b4f4a9638",
                        children: ".tr-success-overlay.jsx-2991fc4b4f4a9638{z-index:2000;background:rgba(0,0,0,.45);justify-content:center;align-items:center;animation:.2s ease-out tr-fade-in;display:flex;position:fixed;top:0;bottom:0;left:0;right:0}.tr-success-card.jsx-2991fc4b4f4a9638{text-align:center;background:#fff;border-radius:16px;width:min(90vw,440px);padding:24px;animation:.28s cubic-bezier(.18,.89,.32,1.28) tr-pop;box-shadow:0 20px 60px rgba(0,0,0,.2)}.tr-icon-wrap.jsx-2991fc4b4f4a9638{background:radial-gradient(#eafff4 0%,#e8f8ff 80%);border-radius:50%;place-items:center;width:96px;height:96px;margin:0 auto;display:grid;position:relative;box-shadow:inset 0 6px 14px rgba(46,204,113,.25)}.tr-check.jsx-2991fc4b4f4a9638{width:72px;height:72px}.tr-circle.jsx-2991fc4b4f4a9638{stroke-dasharray:226;stroke-dashoffset:226px;animation:.8s ease-out forwards tr-draw}.tr-tick.jsx-2991fc4b4f4a9638{stroke-dasharray:70;stroke-dashoffset:70px;animation:.62s ease-out .28s forwards tr-draw}.tr-title.jsx-2991fc4b4f4a9638{color:#22313f;margin-top:14px;font-size:28px;font-weight:900}.tr-desc.jsx-2991fc4b4f4a9638{color:#607d8b;margin-top:6px;font-weight:700}.tr-btn.jsx-2991fc4b4f4a9638{color:#fff;cursor:pointer;background:#00c2c7;border:none;border-radius:12px;margin-top:16px;padding:12px 18px;font-weight:900}.tr-burst.jsx-2991fc4b4f4a9638{pointer-events:none;position:absolute;top:-8px;bottom:-8px;left:-8px;right:-8px}.tr-burst.jsx-2991fc4b4f4a9638 span.jsx-2991fc4b4f4a9638{opacity:0;border-radius:50%;width:8px;height:8px;animation:.72s ease-out .28s forwards tr-burst;position:absolute}@keyframes tr-pop{0%{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}@keyframes tr-fade-in{0%{opacity:0}to{opacity:1}}@keyframes tr-draw{to{stroke-dashoffset:0}}@keyframes tr-burst{0%{opacity:0;transform:translate(0)scale(.6)}40%{opacity:1}to{transform:translate(var(--tx),var(--ty))scale(0);opacity:0}}"
                    }, void 0, false, void 0, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/transport-register/page.jsx",
                lineNumber: 354,
                columnNumber: 9
            }, this),
            isAdminga && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    overflowX: 'auto',
                    background: '#fff',
                    borderRadius: 12,
                    padding: 0,
                    border: '1px solid #dbe4ea'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    id: "transport-register-table",
                    style: {
                        width: '100%',
                        borderCollapse: 'collapse'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: th,
                                        children: "รหัสพนักงาน:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 396,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: th,
                                        children: "ชื่อ-นามสกุล:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 397,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: th,
                                        children: "ประเภทพนักงาน"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 398,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: th,
                                        children: "โรงงาน:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 399,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: th,
                                        children: "ฝ่าย:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 400,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: th,
                                        children: "สายรถ:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 401,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: th,
                                        children: "จุดขึ้นรถ:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 402,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: th,
                                        children: "Action"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 403,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/transport-register/page.jsx",
                                lineNumber: 395,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/transport-register/page.jsx",
                            lineNumber: 394,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: [
                                sortedList.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                style: td,
                                                children: r.employee_code
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                lineNumber: 409,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                style: td,
                                                children: r.full_name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                lineNumber: 410,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                style: td,
                                                children: r.employee_type || ''
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                lineNumber: 411,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                style: td,
                                                children: r.plant_code || ''
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                lineNumber: 412,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                style: td,
                                                children: r.department_text || r.dept_code || ''
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                lineNumber: 413,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                style: td,
                                                children: r.route_name || ''
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                lineNumber: 414,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                style: td,
                                                children: formatPickupDisplay(r.pickup_point) || ''
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                lineNumber: 415,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                style: td,
                                                children: isAdminga && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>openEditModal(r),
                                                            style: {
                                                                padding: '8px 12px',
                                                                background: '#42a5f5',
                                                                color: '#fff',
                                                                border: 'none',
                                                                borderRadius: 10,
                                                                fontWeight: 800,
                                                                marginRight: 8
                                                            },
                                                            children: "แก้ไข"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                            lineNumber: 419,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleDelete(r.id),
                                                            style: {
                                                                padding: '8px 12px',
                                                                background: '#e74c3c',
                                                                color: '#fff',
                                                                border: 'none',
                                                                borderRadius: 10,
                                                                fontWeight: 800
                                                            },
                                                            children: "ลบ"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                            lineNumber: 420,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                lineNumber: 416,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, r.id, true, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 408,
                                        columnNumber: 15
                                    }, this)),
                                !list.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        colSpan: 8,
                                        style: {
                                            ...td,
                                            textAlign: 'center',
                                            fontWeight: 700
                                        },
                                        children: loading ? 'กำลังโหลด..' : 'ไม่พบข้อมูล'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 427,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 427,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/transport-register/page.jsx",
                            lineNumber: 406,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/transport-register/page.jsx",
                    lineNumber: 393,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/transport-register/page.jsx",
                lineNumber: 392,
                columnNumber: 7
            }, this),
            !isAdminga && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 16
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: '#fff',
                        padding: 20,
                        borderRadius: 16,
                        width: 'min(92vw, 680px)',
                        minWidth: 320,
                        boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: 12
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        color: '#2f3e4f',
                                        fontWeight: 600,
                                        marginBottom: 6
                                    },
                                    children: [
                                        "ยินดีต้อนรับ, ",
                                        welcomeText
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 439,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaBus"], {
                                            size: 28,
                                            color: "#2f3e4f"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 441,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 24,
                                                fontWeight: 900
                                            },
                                            children: "ขึ้นทะเบียนรถรับส่ง"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 442,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 440,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/transport-register/page.jsx",
                            lineNumber: 438,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: submitForm,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 900,
                                                color: '#2f3e4f',
                                                marginBottom: 6
                                            },
                                            children: "รหัสพนักงาน:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 448,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: form.employee_code,
                                            onChange: (e)=>setForm((prev)=>({
                                                        ...prev,
                                                        employee_code: e.target.value
                                                    })),
                                            style: {
                                                width: '100%',
                                                padding: '12px 14px',
                                                border: '1px solid #bdc3c7',
                                                borderRadius: 14
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 449,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 447,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 900,
                                                color: '#2f3e4f',
                                                marginBottom: 6
                                            },
                                            children: "ชื่อ-นามสกุล:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 453,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: form.full_name,
                                            onChange: (e)=>setForm((prev)=>({
                                                        ...prev,
                                                        full_name: e.target.value
                                                    })),
                                            style: {
                                                width: '100%',
                                                padding: '12px 14px',
                                                border: '1px solid #bdc3c7',
                                                borderRadius: 14
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 454,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 452,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 900,
                                                color: '#2f3e4f',
                                                marginBottom: 6
                                            },
                                            children: "ประเภทพนักงาน:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 458,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: 8,
                                                alignItems: 'center'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: form.employee_type,
                                                    onChange: (e)=>setForm((prev)=>({
                                                                ...prev,
                                                                employee_type: e.target.value
                                                            })),
                                                    style: {
                                                        flex: 1,
                                                        padding: '12px 14px',
                                                        border: '1px solid #bdc3c7',
                                                        borderRadius: 14
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "- เลือกประเภทพนักงาน -"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                            lineNumber: 461,
                                                            columnNumber: 21
                                                        }, this),
                                                        empTypes.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: t.name,
                                                                children: t.name
                                                            }, t.id, false, {
                                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                                lineNumber: 462,
                                                                columnNumber: 40
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 460,
                                                    columnNumber: 19
                                                }, this),
                                                isAdminga && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setAdding({
                                                                    type: 'empType',
                                                                    value: ''
                                                                }),
                                                            style: {
                                                                padding: '12px 14px',
                                                                border: '1px solid #bdc3c7',
                                                                borderRadius: 14,
                                                                background: '#f5f7f9',
                                                                fontWeight: 800
                                                            },
                                                            children: "+ เพิ่ม"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                            lineNumber: 466,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setManaging((prev)=>({
                                                                        ...prev,
                                                                        empType: !prev.empType
                                                                    })),
                                                            style: {
                                                                padding: '12px 14px',
                                                                border: '1px solid #bdc3c7',
                                                                borderRadius: 14,
                                                                background: '#f5f7f9',
                                                                fontWeight: 800
                                                            },
                                                            children: "จัดการ"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                            lineNumber: 467,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 459,
                                            columnNumber: 17
                                        }, this),
                                        isAdminga && adding.type === 'empType' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: 8,
                                                marginTop: 8
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    placeholder: "ชื่อประเภทพนักงานใหม่",
                                                    value: adding.value,
                                                    onChange: (e)=>setAdding((prev)=>({
                                                                ...prev,
                                                                value: e.target.value
                                                            })),
                                                    style: {
                                                        flex: 1,
                                                        padding: '12px 14px',
                                                        border: '1px solid #bdc3c7',
                                                        borderRadius: 14
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 473,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>addNewOption('empType'),
                                                    style: {
                                                        padding: '12px 14px',
                                                        border: 'none',
                                                        borderRadius: 14,
                                                        background: '#2ecc71',
                                                        color: '#fff',
                                                        fontWeight: 900
                                                    },
                                                    children: "บันทึก"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 474,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setAdding({
                                                            type: null,
                                                            value: ''
                                                        }),
                                                    style: {
                                                        padding: '12px 14px',
                                                        border: 'none',
                                                        borderRadius: 14,
                                                        background: '#90a4ae',
                                                        color: '#2c3e50',
                                                        fontWeight: 900
                                                    },
                                                    children: "ยกเลิก"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 475,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 472,
                                            columnNumber: 19
                                        }, this),
                                        isAdminga && managing.empType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: 8,
                                                background: '#f9fbfd',
                                                border: '1px solid #dbe4ea',
                                                borderRadius: 12,
                                                padding: 8
                                            },
                                            children: [
                                                empTypes.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        color: '#7f8c8d'
                                                    },
                                                    children: "ยังไม่มีข้อมูล"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 480,
                                                    columnNumber: 47
                                                }, this),
                                                empTypes.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            padding: '6px 8px'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: t.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                                lineNumber: 483,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>deleteEmpType(t.id),
                                                                style: {
                                                                    padding: '6px 10px',
                                                                    background: '#e74c3c',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    borderRadius: 8,
                                                                    fontWeight: 800
                                                                },
                                                                children: "ลบ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                                lineNumber: 484,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, t.id, true, {
                                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                                        lineNumber: 482,
                                                        columnNumber: 23
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 479,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 457,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 900,
                                                color: '#2f3e4f',
                                                marginBottom: 6
                                            },
                                            children: "โรงงาน:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 492,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: form.plant_id,
                                            onChange: (e)=>setForm((prev)=>({
                                                        ...prev,
                                                        plant_id: e.target.value,
                                                        department_id: '',
                                                        department_text: ''
                                                    })),
                                            style: {
                                                width: '100%',
                                                padding: '12px 14px',
                                                border: '1px solid #bdc3c7',
                                                borderRadius: 14
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "- เลือกโรงงาน -"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 494,
                                                    columnNumber: 19
                                                }, this),
                                                plants.map((p)=>{
                                                    const label = p.code && p.name && p.name !== p.code ? "".concat(p.code, " - ").concat(p.name) : p.code || p.name || '';
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: p.id,
                                                        children: label
                                                    }, p.id, false, {
                                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                                        lineNumber: 499,
                                                        columnNumber: 28
                                                    }, this);
                                                })
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 493,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 491,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 900,
                                                color: '#2f3e4f',
                                                marginBottom: 6
                                            },
                                            children: "ฝ่าย:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 505,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: 'relative'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    placeholder: "พิมพ์ชื่อ/รหัสฝ่าย",
                                                    value: form.department_text,
                                                    onChange: (e)=>setForm((prev)=>({
                                                                ...prev,
                                                                department_text: e.target.value,
                                                                department_id: ''
                                                            })),
                                                    style: {
                                                        width: '100%',
                                                        padding: '12px 14px',
                                                        border: '1px solid #bdc3c7',
                                                        borderRadius: 14
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 507,
                                                    columnNumber: 19
                                                }, this),
                                                (()=>{
                                                    const t = (form.department_text || '').trim().toLowerCase();
                                                    if (!t) return null;
                                                    const pool = departments.filter((d)=>!form.plant_id || d.plant_id === Number(form.plant_id));
                                                    const sugg = pool.filter((d)=>String(d.code || '').toLowerCase().includes(t) || String(d.name || '').toLowerCase().includes(t)).slice(0, 6);
                                                    if (!sugg.length) return null;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            position: 'absolute',
                                                            zIndex: 5,
                                                            left: 0,
                                                            right: 0,
                                                            background: '#fff',
                                                            border: '1px solid #dbe4ea',
                                                            borderRadius: 10,
                                                            marginTop: 6,
                                                            boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
                                                        },
                                                        children: sugg.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                onClick: ()=>setForm((prev)=>({
                                                                            ...prev,
                                                                            department_text: d.code || d.name || '',
                                                                            department_id: d.id
                                                                        })),
                                                                style: {
                                                                    padding: '8px 12px',
                                                                    cursor: 'pointer'
                                                                },
                                                                children: d.code || d.name
                                                            }, d.id, false, {
                                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                                lineNumber: 522,
                                                                columnNumber: 27
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                                        lineNumber: 520,
                                                        columnNumber: 23
                                                    }, this);
                                                })()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 506,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 504,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 900,
                                                color: '#2f3e4f',
                                                marginBottom: 6
                                            },
                                            children: "สายรถ:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 533,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: form.route_id,
                                            onChange: (e)=>{
                                                const v = e.target.value;
                                                setForm((prev)=>({
                                                        ...prev,
                                                        route_id: v
                                                    }));
                                            },
                                            style: {
                                                width: '100%',
                                                padding: '12px 14px',
                                                border: '1px solid #bdc3c7',
                                                borderRadius: 14
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "- เลือกสายรถ -"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 535,
                                                    columnNumber: 19
                                                }, this),
                                                routes.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: r.id,
                                                        children: r.name
                                                    }, r.id, false, {
                                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                                        lineNumber: 537,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 534,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 532,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 900,
                                                color: '#2f3e4f',
                                                marginBottom: 6
                                            },
                                            children: "จุดขึ้นรถ:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 543,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: 8,
                                                alignItems: 'center'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: form.pickup_point,
                                                    disabled: !form.route_id,
                                                    onChange: (e)=>setForm((prev)=>({
                                                                ...prev,
                                                                pickup_point: e.target.value
                                                            })),
                                                    style: {
                                                        flex: 1,
                                                        padding: '12px 14px',
                                                        border: '1px solid #bdc3c7',
                                                        borderRadius: 14,
                                                        opacity: !form.route_id ? 0.6 : 1
                                                    },
                                                    children: !form.route_id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "- เลือกสายรถก่อน -"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                                        lineNumber: 547,
                                                        columnNumber: 23
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "- เลือกจุดขึ้นรถ -"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                                lineNumber: 550,
                                                                columnNumber: 25
                                                            }, this),
                                                            pickupPoints.filter((pp)=>pp.route_id === Number(form.route_id)).map((pp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: pp.name,
                                                                    children: formatPickupDisplay(pp.name)
                                                                }, pp.id, false, {
                                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                                    lineNumber: 553,
                                                                    columnNumber: 38
                                                                }, this))
                                                        ]
                                                    }, void 0, true)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 545,
                                                    columnNumber: 19
                                                }, this),
                                                isAdminga && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setAdding({
                                                                    type: 'pickup',
                                                                    value: '',
                                                                    route_id: form.route_id ? Number(form.route_id) : '',
                                                                    point_no: ''
                                                                }),
                                                            style: {
                                                                padding: '12px 14px',
                                                                border: '1px solid #bdc3c7',
                                                                borderRadius: 14,
                                                                background: '#f5f7f9',
                                                                fontWeight: 800
                                                            },
                                                            children: "+ เพิ่ม"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                            lineNumber: 559,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            disabled: !form.route_id,
                                                            onClick: ()=>setManaging((prev)=>({
                                                                        ...prev,
                                                                        pickup: !prev.pickup
                                                                    })),
                                                            style: {
                                                                padding: '12px 14px',
                                                                border: '1px solid #bdc3c7',
                                                                borderRadius: 14,
                                                                background: '#f5f7f9',
                                                                fontWeight: 800,
                                                                opacity: !form.route_id ? 0.5 : 1
                                                            },
                                                            children: "จัดการ"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                            lineNumber: 560,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 544,
                                            columnNumber: 17
                                        }, this),
                                        isAdminga && adding.type === 'pickup' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: 8,
                                                marginTop: 8,
                                                flexWrap: 'wrap'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: adding.route_id,
                                                    onChange: (e)=>setAdding((prev)=>({
                                                                ...prev,
                                                                route_id: e.target.value
                                                            })),
                                                    style: {
                                                        padding: '12px 14px',
                                                        border: '1px solid #bdc3c7',
                                                        borderRadius: 14,
                                                        flex: '0 0 200px'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "- เลือกสายรถ -"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                            lineNumber: 567,
                                                            columnNumber: 23
                                                        }, this),
                                                        routes.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: r.id,
                                                                children: r.name
                                                            }, r.id, false, {
                                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                                lineNumber: 568,
                                                                columnNumber: 40
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 566,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    placeholder: "เลขจุด",
                                                    value: adding.point_no,
                                                    onChange: (e)=>setAdding((prev)=>({
                                                                ...prev,
                                                                point_no: e.target.value
                                                            })),
                                                    style: {
                                                        width: 110,
                                                        padding: '12px 14px',
                                                        border: '1px solid #bdc3c7',
                                                        borderRadius: 14,
                                                        flex: '0 0 110px'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 570,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    placeholder: "ชื่อจุดขึ้นรถใหม่",
                                                    value: adding.value,
                                                    onChange: (e)=>setAdding((prev)=>({
                                                                ...prev,
                                                                value: e.target.value
                                                            })),
                                                    style: {
                                                        flex: '1 1 220px',
                                                        minWidth: 220,
                                                        padding: '12px 14px',
                                                        border: '1px solid #bdc3c7',
                                                        borderRadius: 14
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 571,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>addNewOption('pickup'),
                                                    style: {
                                                        padding: '12px 14px',
                                                        border: 'none',
                                                        borderRadius: 14,
                                                        background: '#2ecc71',
                                                        color: '#fff',
                                                        fontWeight: 900,
                                                        flex: '0 0 auto'
                                                    },
                                                    children: "บันทึก"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 572,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setAdding({
                                                            type: null,
                                                            value: '',
                                                            route_id: '',
                                                            point_no: ''
                                                        }),
                                                    style: {
                                                        padding: '12px 14px',
                                                        border: 'none',
                                                        borderRadius: 14,
                                                        background: '#90a4ae',
                                                        color: '#2c3e50',
                                                        fontWeight: 900,
                                                        flex: '0 0 auto'
                                                    },
                                                    children: "ยกเลิก"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 573,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 565,
                                            columnNumber: 19
                                        }, this),
                                        isAdminga && managing.pickup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: 8,
                                                background: '#f9fbfd',
                                                border: '1px solid #dbe4ea',
                                                borderRadius: 12,
                                                padding: 8
                                            },
                                            children: !form.route_id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    color: '#7f8c8d'
                                                },
                                                children: "กรุณาเลือกสายรถก่อนเพื่อจัดการจุดขึ้นรถ"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                lineNumber: 579,
                                                columnNumber: 23
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    pickupPoints.filter((pp)=>pp.route_id === Number(form.route_id)).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            color: '#7f8c8d'
                                                        },
                                                        children: "ยังไม่มีข้อมูล"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                                        lineNumber: 582,
                                                        columnNumber: 107
                                                    }, this),
                                                    pickupPoints.filter((pp)=>pp.route_id === Number(form.route_id)).map((pp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                padding: '6px 8px'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: formatPickupDisplay(pp.name)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                                    lineNumber: 587,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>deletePickupPoint(pp.id),
                                                                    style: {
                                                                        padding: '6px 10px',
                                                                        background: '#e74c3c',
                                                                        color: '#fff',
                                                                        border: 'none',
                                                                        borderRadius: 8,
                                                                        fontWeight: 800
                                                                    },
                                                                    children: "ลบ"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                                    lineNumber: 588,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, pp.id, true, {
                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                            lineNumber: 586,
                                                            columnNumber: 29
                                                        }, this))
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 577,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 542,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        gap: 10,
                                        justifyContent: 'center',
                                        marginTop: 14
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        style: {
                                            padding: '12px 16px',
                                            background: '#17344f',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 12,
                                            fontWeight: 900
                                        },
                                        children: "บันทึกข้อมูล"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                        lineNumber: 597,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 596,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/transport-register/page.jsx",
                            lineNumber: 445,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/transport-register/page.jsx",
                    lineNumber: 437,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/transport-register/page.jsx",
                lineNumber: 436,
                columnNumber: 9
            }, this),
            isAdminga && showModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: '#fff',
                        padding: 20,
                        borderRadius: 16,
                        width: 520,
                        maxHeight: '85vh',
                        overflowY: 'auto'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: 12
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        color: '#2f3e4f',
                                        fontWeight: 600,
                                        marginBottom: 6
                                    },
                                    children: [
                                        "ยินดีต้อนรับ, ",
                                        welcomeText
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 609,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaBus"], {
                                            size: 28,
                                            color: "#2f3e4f"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 611,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 24,
                                                fontWeight: 900
                                            },
                                            children: "ขึ้นทะเบียนรถรับส่ง"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 612,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 610,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/transport-register/page.jsx",
                            lineNumber: 608,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: submitForm,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 900,
                                                color: '#2f3e4f',
                                                marginBottom: 6
                                            },
                                            children: "รหัสพนักงาน:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 618,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: form.employee_code,
                                            onChange: (e)=>setForm((prev)=>({
                                                        ...prev,
                                                        employee_code: e.target.value
                                                    })),
                                            style: {
                                                width: '100%',
                                                padding: '12px 14px',
                                                border: '1px solid #bdc3c7',
                                                borderRadius: 14
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 619,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 617,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 900,
                                                color: '#2f3e4f',
                                                marginBottom: 6
                                            },
                                            children: "ชื่อ-นามสกุล:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 623,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: form.full_name,
                                            onChange: (e)=>setForm((prev)=>({
                                                        ...prev,
                                                        full_name: e.target.value
                                                    })),
                                            style: {
                                                width: '100%',
                                                padding: '12px 14px',
                                                border: '1px solid #bdc3c7',
                                                borderRadius: 14
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 624,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 622,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 900,
                                                color: '#2f3e4f',
                                                marginBottom: 6
                                            },
                                            children: "ประเภทพนักงาน:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 628,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: 8,
                                                alignItems: 'center'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: form.employee_type,
                                                    onChange: (e)=>setForm((prev)=>({
                                                                ...prev,
                                                                employee_type: e.target.value
                                                            })),
                                                    style: {
                                                        flex: 1,
                                                        padding: '12px 14px',
                                                        border: '1px solid #bdc3c7',
                                                        borderRadius: 14
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "- เลือกประเภทพนักงาน -"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                            lineNumber: 631,
                                                            columnNumber: 21
                                                        }, this),
                                                        empTypes.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: t.name,
                                                                children: t.name
                                                            }, t.id, false, {
                                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                                lineNumber: 632,
                                                                columnNumber: 40
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 630,
                                                    columnNumber: 19
                                                }, this),
                                                isAdminga && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setAdding({
                                                                    type: 'empType',
                                                                    value: ''
                                                                }),
                                                            style: {
                                                                padding: '12px 14px',
                                                                border: '1px solid #bdc3c7',
                                                                borderRadius: 14,
                                                                background: '#f5f7f9',
                                                                fontWeight: 800
                                                            },
                                                            children: "+ เพิ่ม"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                            lineNumber: 636,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setManaging((prev)=>({
                                                                        ...prev,
                                                                        empType: !prev.empType
                                                                    })),
                                                            style: {
                                                                padding: '12px 14px',
                                                                border: '1px solid #bdc3c7',
                                                                borderRadius: 14,
                                                                background: '#f5f7f9',
                                                                fontWeight: 800
                                                            },
                                                            children: "จัดการ"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                            lineNumber: 637,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 629,
                                            columnNumber: 17
                                        }, this),
                                        isAdminga && adding.type === 'empType' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: 8,
                                                marginTop: 8
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    placeholder: "ชื่อประเภทพนักงานใหม่",
                                                    value: adding.value,
                                                    onChange: (e)=>setAdding((prev)=>({
                                                                ...prev,
                                                                value: e.target.value
                                                            })),
                                                    style: {
                                                        flex: 1,
                                                        padding: '12px 14px',
                                                        border: '1px solid #bdc3c7',
                                                        borderRadius: 14
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 643,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>addNewOption('empType'),
                                                    style: {
                                                        padding: '12px 14px',
                                                        border: 'none',
                                                        borderRadius: 14,
                                                        background: '#2ecc71',
                                                        color: '#fff',
                                                        fontWeight: 900
                                                    },
                                                    children: "บันทึก"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 644,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setAdding({
                                                            type: null,
                                                            value: ''
                                                        }),
                                                    style: {
                                                        padding: '12px 14px',
                                                        border: 'none',
                                                        borderRadius: 14,
                                                        background: '#90a4ae',
                                                        color: '#2c3e50',
                                                        fontWeight: 900
                                                    },
                                                    children: "ยกเลิก"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 645,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 642,
                                            columnNumber: 19
                                        }, this),
                                        isAdminga && managing.empType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: 8,
                                                background: '#f9fbfd',
                                                border: '1px solid #dbe4ea',
                                                borderRadius: 12,
                                                padding: 8,
                                                maxHeight: 220,
                                                overflowY: 'auto'
                                            },
                                            children: [
                                                empTypes.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        color: '#7f8c8d'
                                                    },
                                                    children: "ยังไม่มีข้อมูล"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 650,
                                                    columnNumber: 47
                                                }, this),
                                                empTypes.map((t)=>{
                                                    const isEditing = editing.kind === 'empType' && editing.id === t.id;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            padding: '6px 8px',
                                                            gap: 8
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    flex: 1
                                                                },
                                                                children: isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    value: editing.value,
                                                                    onChange: (e)=>setEditing((prev)=>({
                                                                                ...prev,
                                                                                value: e.target.value
                                                                            })),
                                                                    style: {
                                                                        width: '100%',
                                                                        padding: '8px 10px',
                                                                        border: '1px solid #bdc3c7',
                                                                        borderRadius: 8
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                                    lineNumber: 657,
                                                                    columnNumber: 31
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: t.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                                    lineNumber: 659,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                                lineNumber: 655,
                                                                columnNumber: 27
                                                            }, this),
                                                            isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: saveEditEmpType,
                                                                        style: {
                                                                            padding: '6px 10px',
                                                                            background: '#2ecc71',
                                                                            color: '#fff',
                                                                            border: 'none',
                                                                            borderRadius: 8,
                                                                            fontWeight: 800
                                                                        },
                                                                        children: "บันทึก"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                                                        lineNumber: 664,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>setEditing({
                                                                                kind: null,
                                                                                id: null,
                                                                                value: '',
                                                                                extra: null
                                                                            }),
                                                                        style: {
                                                                            padding: '6px 10px',
                                                                            background: '#90a4ae',
                                                                            color: '#2c3e50',
                                                                            border: 'none',
                                                                            borderRadius: 8,
                                                                            fontWeight: 800
                                                                        },
                                                                        children: "ยกเลิก"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                                                        lineNumber: 665,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>setEditing({
                                                                                kind: 'empType',
                                                                                id: t.id,
                                                                                value: t.name,
                                                                                extra: null
                                                                            }),
                                                                        style: {
                                                                            padding: '6px 10px',
                                                                            background: '#3498db',
                                                                            color: '#fff',
                                                                            border: 'none',
                                                                            borderRadius: 8,
                                                                            fontWeight: 800
                                                                        },
                                                                        children: "แก้ไข"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                                                        lineNumber: 669,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>deleteEmpType(t.id),
                                                                        style: {
                                                                            padding: '6px 10px',
                                                                            background: '#e74c3c',
                                                                            color: '#fff',
                                                                            border: 'none',
                                                                            borderRadius: 8,
                                                                            fontWeight: 800
                                                                        },
                                                                        children: "ลบ"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                                                        lineNumber: 670,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true)
                                                        ]
                                                    }, t.id, true, {
                                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                                        lineNumber: 654,
                                                        columnNumber: 25
                                                    }, this);
                                                })
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 649,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 627,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 900,
                                                color: '#2f3e4f',
                                                marginBottom: 6
                                            },
                                            children: "โรงงาน:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 681,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: form.plant_id,
                                            onChange: (e)=>setForm((prev)=>({
                                                        ...prev,
                                                        plant_id: e.target.value,
                                                        department_id: '',
                                                        department_text: ''
                                                    })),
                                            style: {
                                                width: '100%',
                                                padding: '12px 14px',
                                                border: '1px solid #bdc3c7',
                                                borderRadius: 14
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "- เลือกโรงงาน -"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 683,
                                                    columnNumber: 19
                                                }, this),
                                                plants.map((p)=>{
                                                    const label = p.code && p.name && p.name !== p.code ? "".concat(p.code, " - ").concat(p.name) : p.code || p.name || '';
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: p.id,
                                                        children: label
                                                    }, p.id, false, {
                                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                                        lineNumber: 688,
                                                        columnNumber: 28
                                                    }, this);
                                                })
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 682,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 680,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 900,
                                                color: '#2f3e4f',
                                                marginBottom: 6
                                            },
                                            children: "ฝ่าย:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 694,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: 'relative'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    placeholder: "พิมพ์ชื่อ/รหัสฝ่าย",
                                                    value: form.department_text,
                                                    onChange: (e)=>setForm((prev)=>({
                                                                ...prev,
                                                                department_text: e.target.value,
                                                                department_id: ''
                                                            })),
                                                    style: {
                                                        width: '100%',
                                                        padding: '12px 14px',
                                                        border: '1px solid #bdc3c7',
                                                        borderRadius: 14
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 696,
                                                    columnNumber: 19
                                                }, this),
                                                (()=>{
                                                    const t = (form.department_text || '').trim().toLowerCase();
                                                    if (!t) return null;
                                                    const pool = departments.filter((d)=>!form.plant_id || d.plant_id === Number(form.plant_id));
                                                    const sugg = pool.filter((d)=>String(d.code || '').toLowerCase().includes(t) || String(d.name || '').toLowerCase().includes(t)).slice(0, 6);
                                                    if (!sugg.length) return null;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            position: 'absolute',
                                                            zIndex: 5,
                                                            left: 0,
                                                            right: 0,
                                                            background: '#fff',
                                                            border: '1px solid #dbe4ea',
                                                            borderRadius: 10,
                                                            marginTop: 6,
                                                            boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
                                                        },
                                                        children: sugg.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                onClick: ()=>setForm((prev)=>({
                                                                            ...prev,
                                                                            department_text: d.code || d.name || '',
                                                                            department_id: d.id
                                                                        })),
                                                                style: {
                                                                    padding: '8px 12px',
                                                                    cursor: 'pointer'
                                                                },
                                                                children: d.code || d.name
                                                            }, d.id, false, {
                                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                                lineNumber: 711,
                                                                columnNumber: 27
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                                        lineNumber: 709,
                                                        columnNumber: 23
                                                    }, this);
                                                })()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 695,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 693,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 900,
                                                color: '#2f3e4f',
                                                marginBottom: 6
                                            },
                                            children: "สายรถ:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 722,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: form.route_id,
                                            onChange: (e)=>{
                                                const v = e.target.value;
                                                setForm((prev)=>({
                                                        ...prev,
                                                        route_id: v
                                                    }));
                                            },
                                            style: {
                                                width: '100%',
                                                padding: '12px 14px',
                                                border: '1px solid #bdc3c7',
                                                borderRadius: 14
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "- เลือกสายรถ -"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 724,
                                                    columnNumber: 19
                                                }, this),
                                                routes.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: r.id,
                                                        children: r.name
                                                    }, r.id, false, {
                                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                                        lineNumber: 726,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 723,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 721,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 900,
                                                color: '#2f3e4f',
                                                marginBottom: 6
                                            },
                                            children: "จุดขึ้นรถ:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 732,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: 8,
                                                alignItems: 'center'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: form.pickup_point,
                                                    disabled: !form.route_id,
                                                    onChange: (e)=>setForm((prev)=>({
                                                                ...prev,
                                                                pickup_point: e.target.value
                                                            })),
                                                    style: {
                                                        flex: 1,
                                                        padding: '12px 14px',
                                                        border: '1px solid #bdc3c7',
                                                        borderRadius: 14,
                                                        opacity: !form.route_id ? 0.6 : 1
                                                    },
                                                    children: !form.route_id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "- เลือกสายรถก่อน -"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                                        lineNumber: 736,
                                                        columnNumber: 23
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "- เลือกจุดขึ้นรถ -"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                                lineNumber: 739,
                                                                columnNumber: 25
                                                            }, this),
                                                            pickupPoints.filter((pp)=>pp.route_id === Number(form.route_id)).map((pp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: pp.name,
                                                                    children: formatPickupDisplay(pp.name)
                                                                }, pp.id, false, {
                                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                                    lineNumber: 742,
                                                                    columnNumber: 38
                                                                }, this))
                                                        ]
                                                    }, void 0, true)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 734,
                                                    columnNumber: 19
                                                }, this),
                                                isAdminga && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setAdding({
                                                                    type: 'pickup',
                                                                    value: '',
                                                                    route_id: form.route_id ? Number(form.route_id) : '',
                                                                    point_no: ''
                                                                }),
                                                            style: {
                                                                padding: '12px 14px',
                                                                border: '1px solid #bdc3c7',
                                                                borderRadius: 14,
                                                                background: '#f5f7f9',
                                                                fontWeight: 800
                                                            },
                                                            children: "+ เพิ่ม"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                            lineNumber: 748,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            disabled: !form.route_id,
                                                            onClick: ()=>setManaging((prev)=>({
                                                                        ...prev,
                                                                        pickup: !prev.pickup
                                                                    })),
                                                            style: {
                                                                padding: '12px 14px',
                                                                border: '1px solid #bdc3c7',
                                                                borderRadius: 14,
                                                                background: '#f5f7f9',
                                                                fontWeight: 800,
                                                                opacity: !form.route_id ? 0.5 : 1
                                                            },
                                                            children: "จัดการ"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                            lineNumber: 749,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 733,
                                            columnNumber: 17
                                        }, this),
                                        isAdminga && adding.type === 'pickup' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: 8,
                                                marginTop: 8,
                                                flexWrap: 'wrap'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: adding.route_id,
                                                    onChange: (e)=>setAdding((prev)=>({
                                                                ...prev,
                                                                route_id: e.target.value
                                                            })),
                                                    style: {
                                                        padding: '12px 14px',
                                                        border: '1px solid #bdc3c7',
                                                        borderRadius: 14,
                                                        flex: '0 0 200px'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "- เลือกสายรถ -"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                            lineNumber: 756,
                                                            columnNumber: 23
                                                        }, this),
                                                        routes.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: r.id,
                                                                children: r.name
                                                            }, r.id, false, {
                                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                                lineNumber: 757,
                                                                columnNumber: 40
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 755,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    placeholder: "เลขจุด",
                                                    value: adding.point_no,
                                                    onChange: (e)=>setAdding((prev)=>({
                                                                ...prev,
                                                                point_no: e.target.value
                                                            })),
                                                    style: {
                                                        width: 110,
                                                        padding: '12px 14px',
                                                        border: '1px solid #bdc3c7',
                                                        borderRadius: 14,
                                                        flex: '0 0 110px'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 759,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    placeholder: "ชื่อจุดขึ้นรถใหม่",
                                                    value: adding.value,
                                                    onChange: (e)=>setAdding((prev)=>({
                                                                ...prev,
                                                                value: e.target.value
                                                            })),
                                                    style: {
                                                        flex: '1 1 220px',
                                                        minWidth: 220,
                                                        padding: '12px 14px',
                                                        border: '1px solid #bdc3c7',
                                                        borderRadius: 14
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 760,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>addNewOption('pickup'),
                                                    style: {
                                                        padding: '12px 14px',
                                                        border: 'none',
                                                        borderRadius: 14,
                                                        background: '#2ecc71',
                                                        color: '#fff',
                                                        fontWeight: 900,
                                                        flex: '0 0 auto'
                                                    },
                                                    children: "บันทึก"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 761,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setAdding({
                                                            type: null,
                                                            value: '',
                                                            route_id: '',
                                                            point_no: ''
                                                        }),
                                                    style: {
                                                        padding: '12px 14px',
                                                        border: 'none',
                                                        borderRadius: 14,
                                                        background: '#90a4ae',
                                                        color: '#2c3e50',
                                                        fontWeight: 900,
                                                        flex: '0 0 auto'
                                                    },
                                                    children: "ยกเลิก"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                    lineNumber: 762,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 754,
                                            columnNumber: 19
                                        }, this),
                                        isAdminga && managing.pickup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: 8,
                                                background: '#f9fbfd',
                                                border: '1px solid #dbe4ea',
                                                borderRadius: 12,
                                                padding: 8,
                                                maxHeight: 220,
                                                overflowY: 'auto'
                                            },
                                            children: !form.route_id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    color: '#7f8c8d'
                                                },
                                                children: "กรุณาเลือกสายรถก่อนเพื่อจัดการจุดขึ้นรถ"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/transport-register/page.jsx",
                                                lineNumber: 768,
                                                columnNumber: 23
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    pickupPoints.filter((pp)=>pp.route_id === Number(form.route_id)).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            color: '#7f8c8d'
                                                        },
                                                        children: "ยังไม่มีข้อมูล"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                                        lineNumber: 771,
                                                        columnNumber: 107
                                                    }, this),
                                                    pickupPoints.filter((pp)=>pp.route_id === Number(form.route_id)).map((pp)=>{
                                                        const isEditing = editing.kind === 'pickup' && editing.id === pp.id;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                padding: '6px 8px',
                                                                gap: 8
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        flex: 1
                                                                    },
                                                                    children: isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        value: editing.value,
                                                                        onChange: (e)=>setEditing((prev)=>({
                                                                                    ...prev,
                                                                                    value: e.target.value
                                                                                })),
                                                                        style: {
                                                                            width: '100%',
                                                                            padding: '8px 10px',
                                                                            border: '1px solid #bdc3c7',
                                                                            borderRadius: 8
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                                                        lineNumber: 780,
                                                                        columnNumber: 33
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: formatPickupDisplay(pp.name)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/transport-register/page.jsx",
                                                                        lineNumber: 782,
                                                                        columnNumber: 37
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                                                    lineNumber: 778,
                                                                    columnNumber: 29
                                                                }, this),
                                                                isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: saveEditPickup,
                                                                            style: {
                                                                                padding: '6px 10px',
                                                                                background: '#2ecc71',
                                                                                color: '#fff',
                                                                                border: 'none',
                                                                                borderRadius: 8,
                                                                                fontWeight: 800
                                                                            },
                                                                            children: "บันทึก"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                                            lineNumber: 787,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>setEditing({
                                                                                    kind: null,
                                                                                    id: null,
                                                                                    value: '',
                                                                                    extra: null
                                                                                }),
                                                                            style: {
                                                                                padding: '6px 10px',
                                                                                background: '#90a4ae',
                                                                                color: '#2c3e50',
                                                                                border: 'none',
                                                                                borderRadius: 8,
                                                                                fontWeight: 800
                                                                            },
                                                                            children: "ยกเลิก"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                                            lineNumber: 788,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>setEditing({
                                                                                    kind: 'pickup',
                                                                                    id: pp.id,
                                                                                    value: pp.name,
                                                                                    extra: {
                                                                                        route_id: pp.route_id || null
                                                                                    }
                                                                                }),
                                                                            style: {
                                                                                padding: '6px 10px',
                                                                                background: '#3498db',
                                                                                color: '#fff',
                                                                                border: 'none',
                                                                                borderRadius: 8,
                                                                                fontWeight: 800
                                                                            },
                                                                            children: "แก้ไข"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                                            lineNumber: 792,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>deletePickupPoint(pp.id),
                                                                            style: {
                                                                                padding: '6px 10px',
                                                                                background: '#e74c3c',
                                                                                color: '#fff',
                                                                                border: 'none',
                                                                                borderRadius: 8,
                                                                                fontWeight: 800
                                                                            },
                                                                            children: "ลบ"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                                            lineNumber: 793,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true)
                                                            ]
                                                        }, pp.id, true, {
                                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                                            lineNumber: 777,
                                                            columnNumber: 27
                                                        }, this);
                                                    })
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 766,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 731,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        gap: 10,
                                        justifyContent: 'center',
                                        marginTop: 14
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            style: {
                                                padding: '12px 16px',
                                                background: '#17344f',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: 12,
                                                fontWeight: 900
                                            },
                                            children: "บันทึกข้อมูล"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 805,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setShowModal(false),
                                            style: {
                                                padding: '12px 16px',
                                                background: '#90a4ae',
                                                color: '#2c3e50',
                                                border: 'none',
                                                borderRadius: 12,
                                                fontWeight: 900
                                            },
                                            children: "ยกเลิก"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transport-register/page.jsx",
                                            lineNumber: 806,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transport-register/page.jsx",
                                    lineNumber: 804,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/transport-register/page.jsx",
                            lineNumber: 615,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/transport-register/page.jsx",
                    lineNumber: 607,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/transport-register/page.jsx",
                lineNumber: 606,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/transport-register/page.jsx",
        lineNumber: 315,
        columnNumber: 5
    }, this);
}
_s(TransportRegister, "HJ7ShXwAaMPE8hzPDQ0dM05Ol8E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = TransportRegister;
var _c;
__turbopack_context__.k.register(_c, "TransportRegister");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_35e8b759._.js.map