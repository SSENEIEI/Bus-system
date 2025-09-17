module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/formatters.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
function formatWelcome(user, departments = [], plants = []) {
    if (!user) return "";
    const displayName = user.display_name || user.username || "";
    // Special display for adminga: show all plant codes to reflect global scope
    try {
        const isAdminga = String(user.username || '').toLowerCase() === 'adminga';
        if (isAdminga) {
            const allPlantCodes = (plants || []).map((p)=>p?.code).filter(Boolean);
            if (allPlantCodes.length) {
                return `${displayName} ${allPlantCodes.join(' ')}`;
            }
        // Fallback to default formatting below if no plants are loaded yet
        }
    } catch  {}
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
                    if (p?.code) plantCodesFromDepts.add(p.code);
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
        if (p?.code) plantLabels.add(p.code);
    }
    const deptStr = deptLabels.join(", ");
    const plantStr = Array.from(plantLabels).join(", ");
    const tail = plantStr ? ` (${plantStr})` : user.department && !deptStr ? ` (${user.department})` : "";
    return `${displayName}${deptStr ? ` ${deptStr}` : ""}${tail}`;
}
}),
"[project]/src/app/truck-table/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TruckTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html2canvas$2f$dist$2f$html2canvas$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/html2canvas/dist/html2canvas.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatters$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/formatters.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function TruckTable() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [date, setDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>new Date().toISOString().slice(0, 10));
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [plants, setPlants] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]); // AC/RF/SSC
    const [departments, setDepartments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [routes, setRoutes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [shifts, setShifts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [shiftId, setShiftId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [departTimes, setDepartTimes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]); // by shift
    const [countsBy, setCountsBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({}); // { dtId: { routeId: { plantId: totalCount } , ttl: { routeId: total } } }
    const [carPlan, setCarPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({}); // { dtId: { routeId: car_count } }
    const [carModal, setCarModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        open: false,
        dt: null,
        route: null,
        value: 0
    });
    const captureRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const u = JSON.parse(localStorage.getItem('user') || 'null');
            setUser(u);
        } catch  {}
    }, []);
    const plantOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            'AC',
            'RF',
            'SSC'
        ], []);
    const plantsSorted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return [
            ...plants
        ].sort((a, b)=>{
            const ia = plantOrder.indexOf(a.code);
            const ib = plantOrder.indexOf(b.code);
            const sa = ia === -1 ? 999 : ia;
            const sb = ib === -1 ? 999 : ib;
            if (sa !== sb) return sa - sb;
            return String(a.code || '').localeCompare(String(b.code || ''));
        });
    }, [
        plants,
        plantOrder
    ]);
    const loadMasters = async ()=>{
        const token = localStorage.getItem('token');
        const [p, r, s, d] = await Promise.all([
            fetch('/api/ot/plants', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }),
            fetch('/api/ot/routes'),
            fetch('/api/ot/shifts', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }),
            fetch('/api/ot/departments', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        ]);
        const parseMaybeJson = async (res)=>{
            const ct = res.headers.get('content-type') || '';
            if (ct.includes('application/json')) {
                try {
                    return await res.json();
                } catch  {
                    return null;
                }
            }
            return null;
        };
        const [plantRowsRaw, routeRowsRaw, shiftRowsRaw, deptRowsRaw] = await Promise.all([
            parseMaybeJson(p),
            parseMaybeJson(r),
            parseMaybeJson(s),
            parseMaybeJson(d)
        ]);
        setPlants(Array.isArray(plantRowsRaw) ? plantRowsRaw : []);
        setRoutes(Array.isArray(routeRowsRaw) ? routeRowsRaw : []);
        const sh = Array.isArray(shiftRowsRaw) ? shiftRowsRaw : [];
        setShifts(sh);
        setDepartments(Array.isArray(deptRowsRaw) ? deptRowsRaw : []);
        if (!shiftId && sh.length) setShiftId(sh[0].id);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadMasters();
    }, []);
    const loadDepartTimes = async (sid)=>{
        if (!sid) return setDepartTimes([]);
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/ot/depart-times?shiftId=${sid}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        });
        const ct = res.headers.get('content-type') || '';
        let data = null;
        if (ct.includes('application/json')) {
            try {
                data = await res.json();
            } catch  {
                data = null;
            }
        }
        setDepartTimes(Array.isArray(data) ? data : []);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadDepartTimes(shiftId);
    }, [
        shiftId
    ]);
    // Aggregate per depart time -> per route -> per plant (sum across departments)
    const loadCounts = async ()=>{
        if (!date || !shiftId || departTimes.length === 0) {
            setCountsBy({});
            return;
        }
        const token = localStorage.getItem('token');
        const acc = {};
        for (const dt of departTimes){
            try {
                const res = await fetch(`/api/ot/counts?date=${date}&shiftId=${shiftId}&departTimeId=${dt.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const ct = res.headers.get('content-type') || '';
                let rows = [];
                if (ct.includes('application/json')) {
                    try {
                        rows = await res.json();
                    } catch  {
                        rows = [];
                    }
                }
                const map = {};
                for (const row of Array.isArray(rows) ? rows : []){
                    const rId = row.route_id;
                    const pId = row.plant_id;
                    const c = Number(row.count) || 0;
                    if (!map[rId]) map[rId] = {};
                    map[rId][pId] = (map[rId][pId] || 0) + c; // sum across departments
                }
                // compute ttl per route
                const ttl = {};
                Object.keys(map).forEach((rId)=>{
                    ttl[rId] = Object.values(map[rId]).reduce((s, v)=>s + (Number(v) || 0), 0);
                });
                acc[dt.id] = {
                    map,
                    ttl
                };
            } catch  {
                acc[dt.id] = {
                    map: {},
                    ttl: {}
                };
            }
        }
        setCountsBy(acc);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadCounts();
    }, [
        date,
        shiftId,
        departTimes
    ]);
    // Load car plan overrides per depart time
    const loadCarPlan = async ()=>{
        if (!date || !shiftId || departTimes.length === 0) {
            setCarPlan({});
            return;
        }
        const token = localStorage.getItem('token');
        const acc = {};
        for (const dt of departTimes){
            try {
                const res = await fetch(`/api/ot/cars?date=${date}&shiftId=${shiftId}&departTimeId=${dt.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const ct = res.headers.get('content-type') || '';
                let rows = [];
                if (ct.includes('application/json')) {
                    try {
                        rows = await res.json();
                    } catch  {
                        rows = [];
                    }
                }
                const m = {};
                for (const r of Array.isArray(rows) ? rows : [])m[r.route_id] = Number(r.car_count) || 0;
                acc[dt.id] = m;
            } catch  {
                acc[dt.id] = {};
            }
        }
        setCarPlan(acc);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadCarPlan();
    }, [
        date,
        shiftId,
        departTimes
    ]);
    const findPlantIdByCode = (code)=>plants.find((p)=>p.code === code)?.id;
    const calcVehicles = (people)=>{
        const n = Number(people) || 0;
        if (n <= 6) return 0;
        return Math.ceil(n / 50);
    };
    const handleSaveAsImage = async ()=>{
        if (!captureRef.current) return;
        const canvas = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html2canvas$2f$dist$2f$html2canvas$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(captureRef.current, {
            backgroundColor: isNightShift ? '#000000' : '#ffffff'
        });
        const link = document.createElement('a');
        link.download = `truck-table-${date}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
    const handleLogout = ()=>{
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch  {}
        router.push('/');
    };
    const isAdminga = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>String(user?.username || '').toLowerCase() === 'adminga', [
        user
    ]);
    // Night shift detection (กะกลางคืน)
    // แก้หน้างาน ให้กะกลางคืน (19:50) พื้นหลังดำ และเลื่อน 19:50 ไปซ้ายสุด และ เปลี่ยนจากเวลาออกเป็นเวลาเข้า
    //
    //
    //
    //
    //
    const isNightShift = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        try {
            const s = shifts.find((x)=>x.id === shiftId);
            const name = String(s?.name_th || s?.name_en || '');
            return /กลางคืน/i.test(name) || /night/i.test(name);
        } catch  {
            return false;
        }
    }, [
        shifts,
        shiftId
    ]);
    // For display: always show entry times (is_entry=1) on the left, followed by exit times
    const displayDepartTimes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const list = Array.isArray(departTimes) ? [
            ...departTimes
        ] : [];
        return list.sort((a, b)=>{
            const ae = Number(a?.is_entry) || 0;
            const be = Number(b?.is_entry) || 0; // entry=1 should come first
            if (ae !== be) return be - ae; // 1 before 0
            const ta = String(a?.time || '');
            const tb = String(b?.time || '');
            return ta.localeCompare(tb);
        });
    }, [
        departTimes
    ]);
    //
    //
    //
    //
    //
    //
    const openCarEdit = (dt, route, ttl)=>{
        if (!isAdminga) return; // only adminga can edit
        const curr = Number(carPlan?.[dt.id]?.[route.id] ?? calcVehicles(ttl));
        setCarModal({
            open: true,
            dt,
            route,
            value: curr
        });
    };
    const saveCarPlan = async ()=>{
        if (!carModal.open || !carModal.dt || !carModal.route) return;
        try {
            const token = localStorage.getItem('token');
            const body = {
                the_date: date,
                shift_id: shiftId,
                depart_time_id: carModal.dt.id,
                route_id: carModal.route.id,
                car_count: Math.max(0, Number(carModal.value) || 0)
            };
            const res = await fetch('/api/ot/cars', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'บันทึกล้มเหลว');
            setCarModal({
                open: false,
                dt: null,
                route: null,
                value: 0
            });
            await loadCarPlan();
        } catch (e) {
            alert(String(e.message || e));
        }
    };
    const closeCarModal = ()=>setCarModal({
            open: false,
            dt: null,
            route: null,
            value: 0
        });
    // Greeting labels
    const welcomeText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatters$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatWelcome"])(user, departments, plants), [
        user,
        departments,
        plants
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            ...styles.wrapper,
            ...isNightShift ? {
                background: '#000000'
            } : {}
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: styles.stack,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        ...styles.panelCard,
                        paddingBottom: 16
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.headerRow,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        style: styles.title,
                                        children: "ตารางจัดรถขากลับ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                        lineNumber: 213,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: '#2f3e4f',
                                            fontWeight: 600
                                        },
                                        children: [
                                            "ยินดีต้อนรับ, ",
                                            welcomeText
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                        lineNumber: 214,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/truck-table/page.jsx",
                                lineNumber: 212,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 18,
                                            color: '#2f3e4f'
                                        },
                                        children: new Date().toLocaleDateString('th-TH', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                        lineNumber: 219,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>router.push('/'),
                                        style: {
                                            ...styles.logoutBtn,
                                            background: '#34495e'
                                        },
                                        children: "กลับเมนูหลัก"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                        lineNumber: 220,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleLogout,
                                        style: styles.logoutBtn,
                                        children: "ออกจากระบบ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                        lineNumber: 221,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/truck-table/page.jsx",
                                lineNumber: 218,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/truck-table/page.jsx",
                        lineNumber: 211,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/truck-table/page.jsx",
                    lineNumber: 210,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: captureRef,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                ...styles.panelCard,
                                paddingTop: 16
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.controls,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: styles.label,
                                                children: "เลือกวันที่:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                lineNumber: 231,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: date,
                                                onChange: (e)=>setDate(e.target.value),
                                                style: styles.input
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                lineNumber: 232,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                        lineNumber: 230,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: styles.label,
                                                children: "กะ:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                lineNumber: 235,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: shiftId || '',
                                                onChange: (e)=>setShiftId(Number(e.target.value) || null),
                                                style: styles.input,
                                                children: shifts.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: s.id,
                                                        children: s.name_th || s.name_en
                                                    }, s.id, false, {
                                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                                        lineNumber: 237,
                                                        columnNumber: 34
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                lineNumber: 236,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                        lineNumber: 234,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        style: styles.primaryBtn,
                                        onClick: handleSaveAsImage,
                                        children: "บันทึกรูปภาพ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                        lineNumber: 240,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/truck-table/page.jsx",
                                lineNumber: 229,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/truck-table/page.jsx",
                            lineNumber: 228,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                ...styles.panelCardTight
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '100%',
                                    overflowX: 'auto'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    style: styles.table,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                ...styles.thMain,
                                                                width: 280,
                                                                textAlign: 'center'
                                                            },
                                                            rowSpan: 2,
                                                            children: "สายรถ"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                                            lineNumber: 249,
                                                            columnNumber: 17
                                                        }, this),
                                                        displayDepartTimes.map((dt, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                colSpan: (plantsSorted?.length || 0) + 2,
                                                                style: {
                                                                    ...styles.thTime,
                                                                    background: getTimeColor(idx)
                                                                },
                                                                children: (()=>{
                                                                    const t = String(dt.time).slice(0, 5);
                                                                    const prefix = Number(dt.is_entry) ? 'เวลาเข้า' : 'เวลาออก';
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            prefix,
                                                                            " ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: t
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                                                lineNumber: 256,
                                                                                columnNumber: 148
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true);
                                                                })()
                                                            }, dt.id, false, {
                                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                                lineNumber: 251,
                                                                columnNumber: 19
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                                    lineNumber: 248,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: displayDepartTimes.map((dt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                plantsSorted.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        style: styles.thMain,
                                                                        children: p.code
                                                                    }, `p-${dt.id}-${p.id}`, false, {
                                                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                                                        lineNumber: 263,
                                                                        columnNumber: 44
                                                                    }, this)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    style: styles.thMain,
                                                                    children: "TTL"
                                                                }, `ttl-${dt.id}`, false, {
                                                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                                                    lineNumber: 264,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    style: {
                                                                        ...styles.thMain,
                                                                        whiteSpace: 'normal',
                                                                        lineHeight: 1.2,
                                                                        paddingTop: 6,
                                                                        paddingBottom: 6
                                                                    },
                                                                    children: [
                                                                        "จำนวน",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("wbr", {}, void 0, false, {
                                                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                                                            lineNumber: 269,
                                                                            columnNumber: 28
                                                                        }, this),
                                                                        "รถ"
                                                                    ]
                                                                }, `car-${dt.id}`, true, {
                                                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                                                    lineNumber: 265,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, `hdr-${dt.id}`, true, {
                                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                                            lineNumber: 262,
                                                            columnNumber: 19
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                                    lineNumber: 260,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                            lineNumber: 247,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: [
                                                routes.map((r, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: styles.tdRoute,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: styles.routeIndex,
                                                                        children: [
                                                                            index + 1,
                                                                            "."
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                                                        lineNumber: 278,
                                                                        columnNumber: 46
                                                                    }, this),
                                                                    " ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: r.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                                                        lineNumber: 278,
                                                                        columnNumber: 96
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                                lineNumber: 278,
                                                                columnNumber: 19
                                                            }, this),
                                                            displayDepartTimes.map((dt, dtIdx)=>{
                                                                const rec = countsBy[dt.id] || {
                                                                    map: {},
                                                                    ttl: {}
                                                                };
                                                                const ttl = Number(rec.ttl?.[r.id] || 0);
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                    children: [
                                                                        plantsSorted.map((p)=>{
                                                                            const pid = p.id;
                                                                            const val = Number(rec.map?.[r.id]?.[pid] || 0);
                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    ...styles.tdCell,
                                                                                    background: getTimeBodyBg(dtIdx)
                                                                                },
                                                                                children: val > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    style: {
                                                                                        fontWeight: 700
                                                                                    },
                                                                                    children: [
                                                                                        val,
                                                                                        " "
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                                                                    lineNumber: 288,
                                                                                    columnNumber: 40
                                                                                }, this) : ''
                                                                            }, `cell-${dt.id}-${r.id}-${pid}`, false, {
                                                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                                                lineNumber: 287,
                                                                                columnNumber: 29
                                                                            }, this);
                                                                        }),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            style: {
                                                                                ...styles.tdCell,
                                                                                background: getTimeTotalBg(dtIdx)
                                                                            },
                                                                            children: ttl > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontWeight: 800
                                                                                },
                                                                                children: [
                                                                                    ttl,
                                                                                    " "
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                                                lineNumber: 292,
                                                                                columnNumber: 128
                                                                            }, this) : ''
                                                                        }, `ttl-${dt.id}-${r.id}`, false, {
                                                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                                                            lineNumber: 292,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            style: {
                                                                                ...styles.tdCell,
                                                                                cursor: isAdminga ? 'pointer' : 'default',
                                                                                background: getTimeCarBg(dtIdx)
                                                                            },
                                                                            onClick: ()=>openCarEdit(dt, r, ttl),
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontWeight: 900
                                                                                },
                                                                                children: (()=>{
                                                                                    const c = Number(carPlan?.[dt.id]?.[r.id] ?? calcVehicles(ttl)) || 0;
                                                                                    return `${c} คัน`;
                                                                                })()
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                                                lineNumber: 302,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        }, `car-${dt.id}-${r.id}`, false, {
                                                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                                                            lineNumber: 293,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, `row-${r.id}-${dt.id}`, true, {
                                                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                                                    lineNumber: 283,
                                                                    columnNumber: 23
                                                                }, this);
                                                            })
                                                        ]
                                                    }, r.id, true, {
                                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                                        lineNumber: 277,
                                                        columnNumber: 17
                                                    }, this)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.tdRouteTotal,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "รวม"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                                lineNumber: 314,
                                                                columnNumber: 49
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                                            lineNumber: 314,
                                                            columnNumber: 17
                                                        }, this),
                                                        displayDepartTimes.map((dt, dtIdx)=>{
                                                            const rec = countsBy[dt.id] || {
                                                                map: {},
                                                                ttl: {}
                                                            };
                                                            // Sum per plant across all routes
                                                            const plantTotals = plantsSorted.map((p)=>{
                                                                let sum = 0;
                                                                for (const r of routes){
                                                                    sum += Number(rec.map?.[r.id]?.[p.id] || 0);
                                                                }
                                                                return sum;
                                                            });
                                                            // Sum TTL across routes
                                                            let ttlTotal = 0;
                                                            for (const r of routes)ttlTotal += Number(rec.ttl?.[r.id] || 0);
                                                            // Sum vehicles (use override if exists, else derived from ttl)
                                                            let totalVehicles = 0;
                                                            for (const r of routes){
                                                                const rTtl = Number(rec.ttl?.[r.id] || 0);
                                                                const cars = Number(carPlan?.[dt.id]?.[r.id] ?? calcVehicles(rTtl)) || 0;
                                                                totalVehicles += cars;
                                                            }
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    plantTotals.map((val, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            style: {
                                                                                ...styles.tdTotal,
                                                                                background: getTimeBodyBg(dtIdx)
                                                                            },
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: val > 0 ? val : ''
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                                                lineNumber: 338,
                                                                                columnNumber: 121
                                                                            }, this)
                                                                        }, `tot-${dt.id}-p-${i}`, false, {
                                                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                                                            lineNumber: 338,
                                                                            columnNumber: 25
                                                                        }, this)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: {
                                                                            ...styles.tdTotal,
                                                                            background: getTimeTotalBg(dtIdx)
                                                                        },
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: ttlTotal > 0 ? ttlTotal : ''
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                                                            lineNumber: 340,
                                                                            columnNumber: 117
                                                                        }, this)
                                                                    }, `tot-${dt.id}-ttl`, false, {
                                                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                                                        lineNumber: 340,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: {
                                                                            ...styles.tdTotal,
                                                                            background: getTimeCarBg(dtIdx)
                                                                        },
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: `${totalVehicles} คัน`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                                                            lineNumber: 341,
                                                                            columnNumber: 116
                                                                        }, this)
                                                                    }, `tot-${dt.id}-cars`, false, {
                                                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                                                        lineNumber: 341,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, `totals-${dt.id}`, true, {
                                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                                lineNumber: 336,
                                                                columnNumber: 21
                                                            }, this);
                                                        })
                                                    ]
                                                }, "totals-row", true, {
                                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                                    lineNumber: 313,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                            lineNumber: 275,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                    lineNumber: 246,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/truck-table/page.jsx",
                                lineNumber: 245,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/truck-table/page.jsx",
                            lineNumber: 244,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/truck-table/page.jsx",
                    lineNumber: 226,
                    columnNumber: 9
                }, this),
                carModal.open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.overlay,
                            onClick: closeCarModal
                        }, void 0, false, {
                            fileName: "[project]/src/app/truck-table/page.jsx",
                            lineNumber: 354,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.modal,
                            onClick: (e)=>e.stopPropagation(),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: styles.modalTitle,
                                    children: "แก้ไขจำนวนรถ"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                    lineNumber: 357,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: 10,
                                        color: '#2c3e50'
                                    },
                                    children: [
                                        "สายรถ: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: carModal.route?.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                            lineNumber: 359,
                                            columnNumber: 24
                                        }, this),
                                        " | ",
                                        Number(carModal.dt?.is_entry) ? 'เวลาเข้า' : 'เวลาออก',
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: String(carModal.dt?.time).slice(0, 5)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                            lineNumber: 359,
                                            columnNumber: 122
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                    lineNumber: 358,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.modalFormGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: styles.modalLabel,
                                            children: "จำนวนรถ:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                            lineNumber: 362,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            min: 0,
                                            value: carModal.value,
                                            onChange: (e)=>setCarModal((m)=>({
                                                        ...m,
                                                        value: Math.max(0, Number(e.target.value) || 0)
                                                    })),
                                            onKeyDown: (e)=>{
                                                if (e.key === 'Enter') saveCarPlan();
                                            },
                                            style: styles.modalInput,
                                            autoFocus: true
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                            lineNumber: 363,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                    lineNumber: 361,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.modalButtonGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            style: styles.confirmButton,
                                            onClick: saveCarPlan,
                                            children: "บันทึก"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                            lineNumber: 371,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            style: styles.cancelButton,
                                            onClick: closeCarModal,
                                            children: "ยกเลิก"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                            lineNumber: 372,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                    lineNumber: 370,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/truck-table/page.jsx",
                            lineNumber: 355,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/truck-table/page.jsx",
            lineNumber: 208,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/truck-table/page.jsx",
        lineNumber: 204,
        columnNumber: 5
    }, this);
}
const styles = {
    wrapper: {
        minHeight: '100vh',
        background: '#f0f2f5',
        padding: 20
    },
    // stack and panel layout
    stack: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: '100%',
        maxWidth: 1340,
        margin: '0 auto'
    },
    panelCard: {
        background: '#fff',
        borderRadius: 24,
        width: '100%',
        padding: 24,
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
    },
    panelCardTight: {
        background: '#fff',
        borderRadius: 24,
        width: '100%',
        padding: 0,
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        overflow: 'hidden'
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    title: {
        fontSize: 28,
        fontWeight: 900,
        margin: 0,
        color: '#2f3e4f'
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: '#f7f9fb',
        borderRadius: 14,
        padding: 12,
        marginBottom: 14,
        flexWrap: 'wrap'
    },
    label: {
        fontWeight: 700,
        color: '#2f3e4f'
    },
    input: {
        padding: '10px 12px',
        borderRadius: 10,
        border: '1px solid #bdc3c7',
        background: '#fff',
        fontSize: 16,
        minWidth: 120
    },
    primaryBtn: {
        padding: '10px 14px',
        borderRadius: 10,
        background: '#1f8ef1',
        color: '#fff',
        border: 'none',
        fontWeight: 800,
        cursor: 'pointer',
        marginLeft: 'auto'
    },
    logoutBtn: {
        padding: '8px 12px',
        borderRadius: 10,
        background: '#e74c3c',
        color: '#fff',
        border: 'none',
        fontWeight: 800,
        cursor: 'pointer'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed'
    },
    thMain: {
        background: '#102a3b',
        color: '#fff',
        padding: 8,
        textAlign: 'center',
        fontWeight: 900,
        whiteSpace: 'nowrap',
        fontSize: 12,
        border: '1px solid #e6edf3'
    },
    thTime: {
        color: '#0f2a40',
        padding: 8,
        textAlign: 'center',
        fontWeight: 900,
        fontSize: 14,
        border: '1px solid #e6edf3'
    },
    tdRoute: {
        border: '1px solid #dfe6ee',
        padding: 8,
        fontWeight: 800,
        color: '#2f3e4f',
        width: 280,
        background: '#ffffff',
        fontSize: 13,
        whiteSpace: 'nowrap'
    },
    routeIndex: {
        display: 'inline-block',
        width: 24,
        textAlign: 'right',
        marginRight: 6
    },
    tdCell: {
        border: '1px solid #e6edf3',
        padding: 6,
        minWidth: 60,
        height: 36,
        background: '#ffffff',
        textAlign: 'center',
        fontSize: 12
    },
    tdTotal: {
        border: '1px solid #e6edf3',
        padding: 6,
        minWidth: 60,
        height: 36,
        background: '#f6fbff',
        textAlign: 'center',
        fontSize: 12
    },
    tdRouteTotal: {
        border: '1px solid #dfe6ee',
        padding: 8,
        fontWeight: 900,
        color: '#2f3e4f',
        width: 280,
        background: '#eef6ff',
        fontSize: 13,
        whiteSpace: 'nowrap',
        textAlign: 'center'
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modal: {
        background: '#fff',
        padding: 30,
        borderRadius: 12,
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        width: '90%',
        maxWidth: 500,
        zIndex: 1001,
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 600,
        color: '#2c3e50',
        marginBottom: 20,
        textAlign: 'center'
    },
    modalFormGroup: {
        marginBottom: 15
    },
    modalLabel: {
        display: 'block',
        marginBottom: 5,
        fontWeight: 500,
        color: '#34495e'
    },
    modalInput: {
        width: '100%',
        padding: 10,
        borderRadius: 8,
        border: '1px solid #bdc3c7',
        boxSizing: 'border-box'
    },
    modalButtonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 20
    },
    confirmButton: {
        padding: '12px 20px',
        border: 'none',
        borderRadius: 8,
        backgroundColor: '#2ecc71',
        color: '#fff',
        fontWeight: 600,
        cursor: 'pointer'
    },
    cancelButton: {
        padding: '12px 20px',
        border: '1px solid #bdc3c7',
        borderRadius: 8,
        backgroundColor: 'transparent',
        color: '#7f8c8d',
        fontWeight: 600,
        cursor: 'pointer'
    }
};
function getTimeColor(idx) {
    const palette = [
        '#FFFB0D',
        '#F562D6',
        '#02AE4E',
        '#00B0EF',
        '#F07D2E',
        '#7230A0'
    ];
    return palette[idx % palette.length];
}
// Color utils: blend a base color with white to get softer shades for cell backgrounds
function hexToRgb(hex) {
    let c = (hex || '').replace('#', '');
    if (c.length === 3) c = c.split('').map((ch)=>ch + ch).join('');
    const num = parseInt(c, 16);
    return {
        r: num >> 16 & 255,
        g: num >> 8 & 255,
        b: num & 255
    };
}
function rgbToHex(r, g, b) {
    const toHex = (n)=>n.toString(16).padStart(2, '0');
    return `#${toHex(Math.min(255, Math.max(0, r)))}${toHex(Math.min(255, Math.max(0, g)))}${toHex(Math.min(255, Math.max(0, b)))}`;
}
// alpha: 0..1, contribution of base color vs white
function blendWithWhite(hex, alpha) {
    const { r, g, b } = hexToRgb(hex);
    const nr = Math.round(r * alpha + 255 * (1 - alpha));
    const ng = Math.round(g * alpha + 255 * (1 - alpha));
    const nb = Math.round(b * alpha + 255 * (1 - alpha));
    return rgbToHex(nr, ng, nb);
}
// Derive per-time body and car cell backgrounds
function getTimeBodyBg(idx) {
    const base = getTimeColor(idx);
    return blendWithWhite(base, 0.18); // very light shade
}
function getTimeTotalBg(idx) {
    const base = getTimeColor(idx);
    return blendWithWhite(base, 0.14); // even lighter for totals
}
function getTimeCarBg(idx) {
    const base = getTimeColor(idx);
    return blendWithWhite(base, 0.32); // slightly stronger shade
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b492ac11._.js.map