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
"[project]/src/app/vendor-plan/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VendorPlanPage
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
function VendorPlanPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [date, setDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>new Date().toISOString().slice(0, 10));
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [routes, setRoutes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]); // [{id, name}]
    const [plants, setPlants] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [departments, setDepartments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [shifts, setShifts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]); // [{id, name_th, name_en}]
    const [departTimesByShift, setDepartTimesByShift] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({}); // { shiftId: [{id, time}] }
    const [countsByDepartTime, setCountsByDepartTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({}); // { dtId: { routeId: people } }
    const [carPlanByDepartTime, setCarPlanByDepartTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({}); // { dtId: { routeId: car_count } }
    const captureRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [payments, setPayments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({}); // { routeId: { pay_flat, pay_wait, pay_ot_normal, pay_trip, pay_ot_holiday, pay_trip_night } }
    const [editModal, setEditModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        open: false,
        route: null,
        key: null,
        value: ''
    });
    const [lockInfo, setLockInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        the_date: null,
        is_locked: 0
    });
    const isAdminga = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>String(user?.username || '').toLowerCase() === 'adminga', [
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const u = JSON.parse(localStorage.getItem("user") || "null");
            setUser(u);
        } catch  {}
    }, []);
    // Helper: pick day/night shift ids by name
    const dayNightShiftIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!Array.isArray(shifts) || shifts.length === 0) return {
            day: null,
            night: null
        };
        let day = null;
        let night = null;
        for (const s of shifts){
            const th = (s.name_th || "").toLowerCase();
            const en = (s.name_en || "").toLowerCase();
            if (!day && (th.includes("กลางวัน") || en.includes("day"))) day = s.id;
            if (!night && (th.includes("กลางคืน") || en.includes("night"))) night = s.id;
        }
        // fallback: first=day second=night
        if (!day) day = shifts[0]?.id ?? null;
        if (!night) night = shifts.find((x)=>x.id !== day)?.id ?? null;
        return {
            day,
            night
        };
    }, [
        shifts
    ]);
    // Load master data
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadMasters = async ()=>{
            try {
                const token = localStorage.getItem("token");
                const [r, s, p, d] = await Promise.all([
                    fetch("/api/ot/routes"),
                    fetch("/api/ot/shifts", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }),
                    fetch("/api/ot/plants", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }),
                    fetch("/api/ot/departments", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                ]);
                const [routesRows, shiftsRows, plantRows, deptRows] = await Promise.all([
                    r.json().catch(()=>[]),
                    s.json().catch(()=>[]),
                    p.json().catch(()=>[]),
                    d.json().catch(()=>[])
                ]);
                setRoutes(Array.isArray(routesRows) ? routesRows : []);
                const sh = Array.isArray(shiftsRows) ? shiftsRows : [];
                setShifts(sh);
                setPlants(Array.isArray(plantRows) ? plantRows : []);
                setDepartments(Array.isArray(deptRows) ? deptRows : []);
            } catch (e) {
                setRoutes([]);
                setShifts([]);
                setPlants([]);
                setDepartments([]);
            }
        };
        loadMasters();
    }, []);
    // Load depart times for both day and night
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadDepartTimes = async ()=>{
            if (!dayNightShiftIds.day && !dayNightShiftIds.night) return setDepartTimesByShift({});
            const token = localStorage.getItem("token");
            const acc = {};
            for (const sid of [
                dayNightShiftIds.day,
                dayNightShiftIds.night
            ].filter(Boolean)){
                try {
                    const res = await fetch(`/api/ot/depart-times?shiftId=${sid}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const rows = await res.json().catch(()=>[]);
                    // Ensure entry times appear on the left of the shift group: sort by is_entry DESC, then time ASC
                    acc[sid] = (Array.isArray(rows) ? rows : []).sort((a, b)=>{
                        const ie = Number(b?.is_entry || 0) - Number(a?.is_entry || 0);
                        if (ie !== 0) return ie; // entries (1) first
                        return String(a.time).localeCompare(String(b.time));
                    });
                } catch  {
                    acc[sid] = [];
                }
            }
            setDepartTimesByShift(acc);
        };
        loadDepartTimes();
    }, [
        dayNightShiftIds.day,
        dayNightShiftIds.night
    ]);
    // Load aggregate counts per depart time (sum across plants/departments)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadCounts = async ()=>{
            const token = localStorage.getItem("token");
            const acc = {};
            const allDts = [
                ...departTimesByShift[dayNightShiftIds.day] || [],
                ...departTimesByShift[dayNightShiftIds.night] || []
            ];
            for (const dt of allDts){
                try {
                    const res = await fetch(`/api/ot/counts?date=${date}&shiftId=${dt.shift_id || dayNightShiftIds.day}&departTimeId=${dt.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const rows = await res.json().catch(()=>[]);
                    const map = {}; // { routeId: totalPeople }
                    for (const row of Array.isArray(rows) ? rows : []){
                        const rId = row.route_id;
                        const c = Number(row.count) || 0;
                        map[rId] = (map[rId] || 0) + c; // sum across departments
                    }
                    acc[dt.id] = map;
                } catch  {
                    acc[dt.id] = {};
                }
            }
            setCountsByDepartTime(acc);
        };
        loadCounts();
    }, [
        date,
        departTimesByShift,
        dayNightShiftIds.day,
        dayNightShiftIds.night
    ]);
    // Load car overrides per depart time (manual overrides from ot_car_plan)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadCars = async ()=>{
            const acc = {};
            const allDts = [
                ...departTimesByShift[dayNightShiftIds.day] || [],
                ...departTimesByShift[dayNightShiftIds.night] || []
            ];
            for (const dt of allDts){
                try {
                    const res = await fetch(`/api/ot/cars?date=${date}&shiftId=${dt.shift_id || dayNightShiftIds.day}&departTimeId=${dt.id}`);
                    const rows = await res.json().catch(()=>[]);
                    const map = {};
                    for (const row of Array.isArray(rows) ? rows : []){
                        const rId = row.route_id;
                        const c = Number(row.car_count) || 0;
                        map[rId] = c;
                    }
                    acc[dt.id] = map;
                } catch  {
                    acc[dt.id] = {};
                }
            }
            setCarPlanByDepartTime(acc);
        };
        loadCars();
    }, [
        date,
        departTimesByShift,
        dayNightShiftIds.day,
        dayNightShiftIds.night
    ]);
    // Load vendor payments for the date
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadPayments = async ()=>{
            try {
                const res = await fetch(`/api/vendor/payments?date=${date}`);
                const rows = await res.json().catch(()=>[]);
                const map = {};
                for (const r of Array.isArray(rows) ? rows : []){
                    map[r.route_id] = {
                        pay_flat: Number(r.pay_flat) || 0,
                        pay_wait: Number(r.pay_wait) || 0,
                        pay_ot_normal: Number(r.pay_ot_normal) || 0,
                        pay_trip: Number(r.pay_trip) || 0,
                        pay_ot_holiday: Number(r.pay_ot_holiday) || 0,
                        pay_trip_night: Number(r.pay_trip_night) || 0
                    };
                }
                setPayments(map);
            } catch  {
                setPayments({});
            }
        };
        loadPayments();
    }, [
        date
    ]);
    // Load lock for the selected date (shared with other pages)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        (async ()=>{
            try {
                const res = await fetch(`/api/ot/locks?date=${date}`);
                const data = await res.json();
                setLockInfo(data || {
                    the_date: date,
                    is_locked: 0
                });
            } catch  {
                setLockInfo({
                    the_date: date,
                    is_locked: 0
                });
            }
        })();
    }, [
        date
    ]);
    // Lock/unlock similar to other pages
    const toggleLock = async (force)=>{
        const next = typeof force === 'boolean' ? force ? 1 : 0 : lockInfo?.is_locked ? 0 : 1;
        setLockInfo((prev)=>({
                ...prev || {},
                the_date: date,
                is_locked: next
            }));
        if (next) {
            setEditModal({
                open: false,
                route: null,
                key: null,
                value: ''
            });
        }
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/ot/locks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...token ? {
                        Authorization: `Bearer ${token}`
                    } : {}
                },
                body: JSON.stringify({
                    the_date: date,
                    is_locked: next
                })
            });
            if (!res.ok) throw new Error('lock save failed');
        } catch  {
            // revert on failure
            setLockInfo((prev)=>({
                    ...prev || {},
                    is_locked: next ? 0 : 1
                }));
        }
    };
    const openEdit = (route, key)=>{
        const current = payments?.[route.id]?.[key] ?? 0;
        setEditModal({
            open: true,
            route,
            key,
            value: String(current)
        });
    };
    const closeEdit = ()=>setEditModal({
            open: false,
            route: null,
            key: null,
            value: ''
        });
    const saveEdit = async ()=>{
        if (!editModal.open || !editModal.route || !editModal.key) return;
        try {
            const token = localStorage.getItem('token');
            const body = {
                the_date: date,
                route_id: editModal.route.id,
                key: editModal.key,
                value: Math.max(0, Number(editModal.value) || 0)
            };
            const res = await fetch('/api/vendor/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'บันทึกไม่สำเร็จ');
            setPayments((prev)=>({
                    ...prev,
                    [editModal.route.id]: {
                        ...prev[editModal.route.id] || {},
                        [editModal.key]: body.value
                    }
                }));
            closeEdit();
        } catch (e) {
            alert(String(e.message || e));
        }
    };
    const calcVehicles = (people)=>{
        const n = Number(people) || 0;
        if (n <= 6) return 0; // ตามตรรกะเดียวกับตารางจัดรถ
        return Math.ceil(n / 50);
    };
    const handleSaveAsImage = async ()=>{
        if (!captureRef.current) return;
        const canvas = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html2canvas$2f$dist$2f$html2canvas$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(captureRef.current);
        const link = document.createElement("a");
        link.download = `vendor-plan-${date}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    };
    const handleLogout = ()=>{
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        } catch  {}
        router.push("/");
    };
    const dayTimes = departTimesByShift[dayNightShiftIds.day] || [];
    const nightTimes = departTimesByShift[dayNightShiftIds.night] || [];
    const allTimes = [
        ...dayTimes,
        ...nightTimes
    ];
    // Totals across all routes per depart time and payment categories
    const totals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const peopleTotals = {};
        const carTotals = {};
        for (const dt of allTimes){
            let pSum = 0;
            let cSum = 0;
            for (const r of routes){
                const ppl = Number(countsByDepartTime?.[dt.id]?.[r.id] || 0);
                pSum += ppl;
                const override = carPlanByDepartTime?.[dt.id]?.[r.id];
                cSum += override != null ? Number(override) || 0 : calcVehicles(ppl);
            }
            peopleTotals[dt.id] = pSum;
            carTotals[dt.id] = cSum;
        }
        const payKeys = [
            'pay_flat',
            'pay_wait',
            'pay_ot_normal',
            'pay_trip',
            'pay_ot_holiday',
            'pay_trip_night'
        ];
        const payTotals = {};
        for (const k of payKeys){
            let s = 0;
            for (const r of routes)s += Number(payments?.[r.id]?.[k] || 0);
            payTotals[k] = s;
        }
        return {
            peopleTotals,
            carTotals,
            payTotals
        };
    }, [
        allTimes,
        routes,
        countsByDepartTime,
        payments,
        carPlanByDepartTime
    ]);
    const welcomeText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatters$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatWelcome"])(user, departments, plants), [
        user,
        departments,
        plants
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: styles.wrapper,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: styles.stack,
            ref: captureRef,
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
                                        children: "แผนจัดรถ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                        lineNumber: 280,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: "#2f3e4f",
                                            fontWeight: 600
                                        },
                                        children: [
                                            "ยินดีต้อนรับ, ",
                                            welcomeText
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                        lineNumber: 281,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                lineNumber: 279,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 18,
                                            color: "#2f3e4f"
                                        },
                                        children: new Date().toLocaleDateString("th-TH", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                        lineNumber: 284,
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
                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                        lineNumber: 287,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleLogout,
                                        style: styles.logoutBtn,
                                        children: "ออกจากระบบ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                        lineNumber: 288,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                lineNumber: 283,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                        lineNumber: 278,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                    lineNumber: 277,
                    columnNumber: 9
                }, this),
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
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: styles.label,
                                        children: "เลือกวันที่:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                        lineNumber: 296,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        value: date,
                                        onChange: (e)=>setDate(e.target.value),
                                        style: styles.input
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                        lineNumber: 297,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                lineNumber: 295,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                style: styles.primaryBtn,
                                onClick: handleSaveAsImage,
                                children: "บันทึกรูปภาพ"
                            }, void 0, false, {
                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                lineNumber: 299,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                        lineNumber: 294,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                    lineNumber: 293,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        ...styles.panelCardTight
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: "100%",
                                overflowX: "auto",
                                ...lockInfo?.is_locked ? styles.lockedWrap : {}
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
                                                            width: 240
                                                        },
                                                        rowSpan: 3,
                                                        children: "สายรถ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 308,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            ...styles.thShift,
                                                            background: "#FFEB3B"
                                                        },
                                                        colSpan: dayTimes.length * 2 + 1,
                                                        children: [
                                                            "กะกลางวัน ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Day Shift"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 309,
                                                                columnNumber: 120
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 309,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            ...styles.thShift,
                                                            background: "#F8BBD0"
                                                        },
                                                        colSpan: nightTimes.length * 2 + 1,
                                                        children: [
                                                            "กะกลางคืน ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Night Shift"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 310,
                                                                columnNumber: 122
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 310,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            ...styles.thMain
                                                        },
                                                        colSpan: 6,
                                                        children: "จำนวนการจ่าย Bus cost type"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 311,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                lineNumber: 307,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    dayTimes.map((dt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                ...styles.thTime,
                                                                background: "#FFFB0D"
                                                            },
                                                            colSpan: 2,
                                                            title: dt.is_entry ? 'เวลาเข้า' : 'เวลาออก',
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: styles.timeWrap,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: String(dt.time).slice(0, 5)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 317,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            ...styles.timePill,
                                                                            ...dt.is_entry ? styles.timePillEntry : styles.timePillExit
                                                                        },
                                                                        children: dt.is_entry ? 'เข้า' : 'ออก'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 318,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 316,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, `d-${dt.id}`, false, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 315,
                                                            columnNumber: 19
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            ...styles.thTime,
                                                            background: "#FFFB0D"
                                                        },
                                                        colSpan: 1,
                                                        title: "รวมรถ",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: styles.timeWrap,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: "รวมรถ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 327,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 326,
                                                            columnNumber: 19
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 325,
                                                        columnNumber: 17
                                                    }, this),
                                                    nightTimes.map((dt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                ...styles.thTime,
                                                                background: "#F5D0D7"
                                                            },
                                                            colSpan: 2,
                                                            title: dt.is_entry ? 'เวลาเข้า' : 'เวลาออก',
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: styles.timeWrap,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: String(dt.time).slice(0, 5)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 333,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            ...styles.timePill,
                                                                            ...dt.is_entry ? styles.timePillEntry : styles.timePillExit
                                                                        },
                                                                        children: dt.is_entry ? 'เข้า' : 'ออก'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 334,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 332,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, `n-${dt.id}`, false, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 331,
                                                            columnNumber: 19
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            ...styles.thTime,
                                                            background: "#F5D0D7"
                                                        },
                                                        colSpan: 1,
                                                        title: "รวมรถ",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: styles.timeWrap,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: "รวมรถ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 343,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 342,
                                                            columnNumber: 19
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 341,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: styles.thPayHead,
                                                        rowSpan: 2,
                                                        children: "รายเดือน"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 346,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: styles.thPayHead,
                                                        rowSpan: 2,
                                                        children: "จอดรอ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 347,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: styles.thPayHead,
                                                        rowSpan: 2,
                                                        children: "OT เหมาวันปกติ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 348,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: styles.thPayHead,
                                                        rowSpan: 2,
                                                        children: "เหมาเที่ยว"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 349,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: styles.thPayHead,
                                                        rowSpan: 2,
                                                        children: "OT เหมาวันหยุด"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 350,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: styles.thPayHead,
                                                        rowSpan: 2,
                                                        children: "เหมาเที่ยวกะดึก"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 351,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                lineNumber: 313,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    dayTimes.map((dt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    style: styles.thSub,
                                                                    children: "คน"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 356,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    style: styles.thSub,
                                                                    children: "รถ"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 357,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, `sub-d-${dt.id}`, true, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 355,
                                                            columnNumber: 19
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: styles.thSub,
                                                        children: "รถ"
                                                    }, `sub-day-sum`, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 361,
                                                        columnNumber: 17
                                                    }, this),
                                                    nightTimes.map((dt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    style: styles.thSub,
                                                                    children: "คน"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 364,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    style: styles.thSub,
                                                                    children: "รถ"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 365,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, `sub-n-${dt.id}`, true, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 363,
                                                            columnNumber: 19
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: styles.thSub,
                                                        children: "รถ"
                                                    }, `sub-night-sum`, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 369,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                lineNumber: 353,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                        lineNumber: 306,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: [
                                            routes.map((r, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.tdRoute,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: styles.routeIndex,
                                                                    children: [
                                                                        idx + 1,
                                                                        "."
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 375,
                                                                    columnNumber: 46
                                                                }, this),
                                                                " ",
                                                                r.name
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 375,
                                                            columnNumber: 19
                                                        }, this),
                                                        dayTimes.map((dt)=>{
                                                            const people = Number(countsByDepartTime?.[dt.id]?.[r.id] || 0);
                                                            const override = carPlanByDepartTime?.[dt.id]?.[r.id];
                                                            const cars = override != null ? Number(override) || 0 : calcVehicles(people);
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: styles.tdCell,
                                                                        children: people > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: people
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                            lineNumber: 383,
                                                                            columnNumber: 65
                                                                        }, this) : ""
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 383,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: styles.tdCell,
                                                                        children: cars > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                            children: [
                                                                                cars,
                                                                                " คัน"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                            lineNumber: 384,
                                                                            columnNumber: 63
                                                                        }, this) : ""
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 384,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, `cell-d-${dt.id}-${r.id}`, true, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 382,
                                                                columnNumber: 23
                                                            }, this);
                                                        }),
                                                        (()=>{
                                                            const dayCars = dayTimes.reduce((acc, dt)=>{
                                                                const people = Number(countsByDepartTime?.[dt.id]?.[r.id] || 0);
                                                                const override = carPlanByDepartTime?.[dt.id]?.[r.id];
                                                                const cars = override != null ? Number(override) || 0 : calcVehicles(people);
                                                                return acc + cars;
                                                            }, 0);
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: styles.tdCell,
                                                                children: dayCars > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                    children: [
                                                                        dayCars,
                                                                        " คัน"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 397,
                                                                    columnNumber: 93
                                                                }, this) : ''
                                                            }, `cell-day-sum-${r.id}`, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 397,
                                                                columnNumber: 23
                                                            }, this);
                                                        })(),
                                                        nightTimes.map((dt)=>{
                                                            const people = Number(countsByDepartTime?.[dt.id]?.[r.id] || 0);
                                                            const override = carPlanByDepartTime?.[dt.id]?.[r.id];
                                                            const cars = override != null ? Number(override) || 0 : calcVehicles(people);
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: styles.tdCell,
                                                                        children: people > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: people
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                            lineNumber: 407,
                                                                            columnNumber: 65
                                                                        }, this) : ""
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 407,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: styles.tdCell,
                                                                        children: cars > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                            children: [
                                                                                cars,
                                                                                " คัน"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                            lineNumber: 408,
                                                                            columnNumber: 63
                                                                        }, this) : ""
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 408,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, `cell-n-${dt.id}-${r.id}`, true, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 406,
                                                                columnNumber: 23
                                                            }, this);
                                                        }),
                                                        (()=>{
                                                            const nightCars = nightTimes.reduce((acc, dt)=>{
                                                                const people = Number(countsByDepartTime?.[dt.id]?.[r.id] || 0);
                                                                const override = carPlanByDepartTime?.[dt.id]?.[r.id];
                                                                const cars = override != null ? Number(override) || 0 : calcVehicles(people);
                                                                return acc + cars;
                                                            }, 0);
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: styles.tdCell,
                                                                children: nightCars > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                    children: [
                                                                        nightCars,
                                                                        " คัน"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 421,
                                                                    columnNumber: 97
                                                                }, this) : ''
                                                            }, `cell-night-sum-${r.id}`, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 421,
                                                                columnNumber: 23
                                                            }, this);
                                                        })(),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.tdPay,
                                                            onClick: ()=>!lockInfo?.is_locked && openEdit(r, 'pay_flat'),
                                                            children: payments?.[r.id]?.pay_flat || 0 || ''
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 424,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.tdPay,
                                                            onClick: ()=>!lockInfo?.is_locked && openEdit(r, 'pay_wait'),
                                                            children: payments?.[r.id]?.pay_wait || 0 || ''
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 425,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.tdPay,
                                                            onClick: ()=>!lockInfo?.is_locked && openEdit(r, 'pay_ot_normal'),
                                                            children: payments?.[r.id]?.pay_ot_normal || 0 || ''
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 426,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.tdPay,
                                                            onClick: ()=>!lockInfo?.is_locked && openEdit(r, 'pay_trip'),
                                                            children: payments?.[r.id]?.pay_trip || 0 || ''
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 427,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.tdPay,
                                                            onClick: ()=>!lockInfo?.is_locked && openEdit(r, 'pay_ot_holiday'),
                                                            children: payments?.[r.id]?.pay_ot_holiday || 0 || ''
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 428,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.tdPay,
                                                            onClick: ()=>!lockInfo?.is_locked && openEdit(r, 'pay_trip_night'),
                                                            children: payments?.[r.id]?.pay_trip_night || 0 || ''
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 429,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, r.id, true, {
                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                    lineNumber: 374,
                                                    columnNumber: 17
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: styles.tdTotalRoute,
                                                        children: "รวม"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 434,
                                                        columnNumber: 17
                                                    }, this),
                                                    dayTimes.map((dt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: styles.tdSum,
                                                                    children: (totals.peopleTotals?.[dt.id] ?? 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                        children: totals.peopleTotals[dt.id]
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 438,
                                                                        columnNumber: 66
                                                                    }, this) : ''
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 437,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: styles.tdSum,
                                                                    children: (totals.carTotals?.[dt.id] ?? 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                        children: `${totals.carTotals[dt.id]} คัน`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 441,
                                                                        columnNumber: 63
                                                                    }, this) : ''
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 440,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, `sum-d-${dt.id}`, true, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 436,
                                                            columnNumber: 19
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: styles.tdSum,
                                                        children: dayTimes.reduce((acc, dt)=>acc + (totals.carTotals?.[dt.id] || 0), 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: `${dayTimes.reduce((acc, dt)=>acc + (totals.carTotals?.[dt.id] || 0), 0)} คัน`
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 446,
                                                            columnNumber: 123
                                                        }, this) : ''
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 446,
                                                        columnNumber: 17
                                                    }, this),
                                                    nightTimes.map((dt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: styles.tdSum,
                                                                    children: (totals.peopleTotals?.[dt.id] ?? 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                        children: totals.peopleTotals[dt.id]
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 450,
                                                                        columnNumber: 66
                                                                    }, this) : ''
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 449,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: styles.tdSum,
                                                                    children: (totals.carTotals?.[dt.id] ?? 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                        children: `${totals.carTotals[dt.id]} คัน`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 453,
                                                                        columnNumber: 63
                                                                    }, this) : ''
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 452,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, `sum-n-${dt.id}`, true, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 448,
                                                            columnNumber: 19
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: styles.tdSum,
                                                        children: nightTimes.reduce((acc, dt)=>acc + (totals.carTotals?.[dt.id] || 0), 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: `${nightTimes.reduce((acc, dt)=>acc + (totals.carTotals?.[dt.id] || 0), 0)} คัน`
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 458,
                                                            columnNumber: 125
                                                        }, this) : ''
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 458,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: styles.tdSumPay,
                                                        children: (totals.payTotals?.pay_flat ?? 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: totals.payTotals.pay_flat
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 459,
                                                            columnNumber: 86
                                                        }, this) : ''
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 459,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: styles.tdSumPay,
                                                        children: (totals.payTotals?.pay_wait ?? 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: totals.payTotals.pay_wait
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 460,
                                                            columnNumber: 86
                                                        }, this) : ''
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 460,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: styles.tdSumPay,
                                                        children: (totals.payTotals?.pay_ot_normal ?? 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: totals.payTotals.pay_ot_normal
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 461,
                                                            columnNumber: 91
                                                        }, this) : ''
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 461,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: styles.tdSumPay,
                                                        children: (totals.payTotals?.pay_trip ?? 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: totals.payTotals.pay_trip
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 462,
                                                            columnNumber: 86
                                                        }, this) : ''
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 462,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: styles.tdSumPay,
                                                        children: (totals.payTotals?.pay_ot_holiday ?? 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: totals.payTotals.pay_ot_holiday
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 463,
                                                            columnNumber: 92
                                                        }, this) : ''
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 463,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: styles.tdSumPay,
                                                        children: (totals.payTotals?.pay_trip_night ?? 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: totals.payTotals.pay_trip_night
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 464,
                                                            columnNumber: 92
                                                        }, this) : ''
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 464,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                lineNumber: 433,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                        lineNumber: 372,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                lineNumber: 305,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                            lineNumber: 304,
                            columnNumber: 11
                        }, this),
                        isAdminga && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 12,
                                padding: '12px 16px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    style: styles.approveBtn,
                                    onClick: ()=>toggleLock(true),
                                    children: "บันทึกข้อมูล"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                    lineNumber: 471,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    style: styles.cancelGrayBtn,
                                    onClick: ()=>toggleLock(false),
                                    children: "ยกเลิก"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                    lineNumber: 472,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                            lineNumber: 470,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                    lineNumber: 303,
                    columnNumber: 9
                }, this),
                editModal.open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.overlay,
                            onClick: closeEdit
                        }, void 0, false, {
                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                            lineNumber: 478,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.modal,
                            onClick: (e)=>e.stopPropagation(),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: styles.modalTitle,
                                    children: "แก้ไขจำนวนการจ่าย"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                    lineNumber: 480,
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
                                            children: editModal.route?.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                            lineNumber: 482,
                                            columnNumber: 24
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                    lineNumber: 481,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.modalFormGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: styles.modalLabel,
                                            children: "จำนวน:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                            lineNumber: 485,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            min: 0,
                                            value: editModal.value,
                                            onChange: (e)=>setEditModal((m)=>({
                                                        ...m,
                                                        value: e.target.value
                                                    })),
                                            onKeyDown: (e)=>{
                                                if (e.key === 'Enter') saveEdit();
                                            },
                                            style: styles.modalInput,
                                            autoFocus: true
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                            lineNumber: 486,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                    lineNumber: 484,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.modalButtonGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            style: styles.confirmButton,
                                            onClick: saveEdit,
                                            children: "บันทึก"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                            lineNumber: 492,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            style: styles.cancelButton,
                                            onClick: closeEdit,
                                            children: "ยกเลิก"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                            lineNumber: 493,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                    lineNumber: 491,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                            lineNumber: 479,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/vendor-plan/page.jsx",
            lineNumber: 275,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/vendor-plan/page.jsx",
        lineNumber: 274,
        columnNumber: 5
    }, this);
}
const styles = {
    wrapper: {
        minHeight: "100vh",
        background: "#f0f2f5",
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
        background: "#fff",
        borderRadius: 24,
        width: "100%",
        padding: 24,
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)"
    },
    panelCardTight: {
        background: "#fff",
        borderRadius: 24,
        width: "100%",
        padding: 0,
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        overflow: 'hidden'
    },
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
    },
    title: {
        fontSize: 28,
        fontWeight: 900,
        margin: 0,
        color: "#2f3e4f"
    },
    controls: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: "#f7f9fb",
        borderRadius: 14,
        padding: 12,
        marginBottom: 14,
        flexWrap: "wrap"
    },
    label: {
        fontWeight: 700,
        color: "#2f3e4f"
    },
    input: {
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid #bdc3c7",
        background: "#fff",
        fontSize: 16,
        minWidth: 120
    },
    primaryBtn: {
        padding: "10px 14px",
        borderRadius: 10,
        background: "#1f8ef1",
        color: "#fff",
        border: "none",
        fontWeight: 800,
        cursor: "pointer",
        marginLeft: "auto"
    },
    logoutBtn: {
        padding: "8px 12px",
        borderRadius: 10,
        background: "#e74c3c",
        color: "#fff",
        border: "none",
        fontWeight: 800,
        cursor: "pointer"
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "fixed"
    },
    thMain: {
        background: "#102a3b",
        color: "#fff",
        padding: 8,
        textAlign: "center",
        fontWeight: 900,
        whiteSpace: "nowrap",
        fontSize: 12,
        border: "1px solid #e6edf3"
    },
    thShift: {
        color: "#0f2a40",
        padding: 8,
        textAlign: "center",
        fontWeight: 900,
        fontSize: 14,
        border: "1px solid #e6edf3",
        whiteSpace: 'nowrap'
    },
    thTime: {
        color: "#0f2a40",
        padding: 8,
        textAlign: "center",
        fontWeight: 900,
        fontSize: 14,
        border: "1px solid #e6edf3",
        whiteSpace: 'nowrap'
    },
    timeWrap: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        lineHeight: 1.1
    },
    timePill: {
        fontSize: 10,
        padding: '2px 6px',
        borderRadius: 999,
        fontWeight: 800,
        color: '#0f2a40',
        background: '#eef5ff',
        border: '1px solid #cfe0f7'
    },
    timePillEntry: {
        background: '#e9f9ed',
        border: '1px solid #bfe8cb',
        color: '#1b7b3a'
    },
    timePillExit: {
        background: '#fff2e9',
        border: '1px solid #ffd3b5',
        color: '#b04e06'
    },
    thPayHead: {
        background: "#102a3b",
        color: "#fff",
        padding: 8,
        textAlign: "center",
        fontWeight: 900,
        fontSize: 12,
        border: "1px solid #e6edf3",
        whiteSpace: 'normal',
        lineHeight: 1.25,
        minWidth: 120
    },
    thSub: {
        background: "#17344f",
        color: "#fff",
        padding: 8,
        textAlign: "center",
        fontWeight: 800,
        fontSize: 12,
        border: "1px solid #e6edf3",
        whiteSpace: 'nowrap'
    },
    tdRoute: {
        border: "1px solid #dfe6ee",
        padding: 8,
        fontWeight: 800,
        color: "#2f3e4f",
        width: 240,
        background: "#ffffff",
        fontSize: 13,
        whiteSpace: "nowrap"
    },
    routeIndex: {
        display: "inline-block",
        width: 24,
        textAlign: "right",
        marginRight: 6
    },
    tdCell: {
        border: "1px solid #e6edf3",
        padding: 6,
        minWidth: 60,
        height: 36,
        background: "#ffffff",
        textAlign: "center",
        fontSize: 12
    },
    tdPay: {
        border: "1px solid #e6edf3",
        padding: 6,
        minWidth: 130,
        height: 36,
        background: "#ffffff",
        textAlign: "center",
        fontSize: 12
    },
    tdTotalRoute: {
        border: "1px solid #e6edf3",
        padding: 8,
        background: "#eef3f8",
        fontWeight: 900,
        color: "#2f3e4f",
        textAlign: 'center'
    },
    tdSum: {
        border: "1px solid #e6edf3",
        padding: 6,
        background: "#f8fbff",
        textAlign: "center",
        fontSize: 12,
        fontWeight: 800
    },
    tdSumPay: {
        border: "1px solid #e6edf3",
        padding: 6,
        background: "#f4f9f2",
        textAlign: "center",
        fontSize: 12,
        fontWeight: 800
    },
    approveBtn: {
        padding: '10px 14px',
        borderRadius: 10,
        background: '#2ecc71',
        color: '#fff',
        border: 'none',
        fontWeight: 800,
        cursor: 'pointer'
    },
    cancelGrayBtn: {
        padding: '10px 14px',
        borderRadius: 10,
        background: '#ffffff',
        color: '#7f8c8d',
        border: '1px solid #bdc3c7',
        fontWeight: 800,
        cursor: 'pointer'
    },
    lockedWrap: {
        opacity: 0.5,
        pointerEvents: 'none',
        filter: 'grayscale(0.6)'
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
        maxWidth: 420,
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
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__45a10c6f._.js.map