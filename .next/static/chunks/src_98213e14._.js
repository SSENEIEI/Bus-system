(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/http.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Lightweight client-side fetch utilities with timeout, retries, and safe JSON parsing
// Usage: import { fetchJSON, postJSON } from '@/lib/http'
__turbopack_context__.s([
    "deleteJSON",
    ()=>deleteJSON,
    "fetchJSON",
    ()=>fetchJSON,
    "postJSON",
    ()=>postJSON,
    "putJSON",
    ()=>putJSON
]);
const sleep = (ms)=>new Promise((res)=>setTimeout(res, ms));
function getAuthHeader() {
    try {
        const token = localStorage.getItem('token');
        return token ? {
            Authorization: "Bearer ".concat(token)
        } : {};
    } catch (e) {
        return {};
    }
}
async function parseResponse(res) {
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
        try {
            return await res.json();
        } catch (e) {
            return null;
        }
    }
    if (res.status === 204) return null;
    try {
        return await res.text();
    } catch (e) {
        return null;
    }
}
async function fetchJSON(url) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, extra = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const { retries = 2, timeout = 10000, signal: externalSignal, retryOn = (res)=>!res.ok, cache = 'no-store' } = extra;
    // Merge headers with auth if not present
    const baseHeaders = {
        ...options.headers || {},
        ...getAuthHeader()
    };
    let attempt = 0;
    let lastError = null;
    let controller;
    while(attempt <= retries){
        attempt += 1;
        controller = new AbortController();
        const tid = setTimeout(()=>controller.abort(), timeout);
        try {
            const res = await fetch(url, {
                ...options,
                headers: baseHeaders,
                signal: externalSignal || controller.signal,
                cache
            });
            clearTimeout(tid);
            if (retryOn && retryOn(res) && attempt <= retries && (options.method || 'GET').toUpperCase() === 'GET') {
                // backoff: 200ms * 2^(attempt-1)
                await sleep(200 * Math.pow(2, attempt - 1));
                continue;
            }
            const data = await parseResponse(res);
            if (!res.ok) {
                const err = new Error(data && (data.error || data.message) || "HTTP ".concat(res.status));
                err.status = res.status;
                throw err;
            }
            return data;
        } catch (err) {
            clearTimeout(tid);
            lastError = err;
            // Only retry GETs and only on network/timeouts or 5xx
            const method = (options.method || 'GET').toUpperCase();
            const status = (err === null || err === void 0 ? void 0 : err.status) || 0;
            const isRetryableStatus = status >= 500 || status === 0; // network/timeout
            if (method !== 'GET' || attempt > retries || !isRetryableStatus) break;
            await sleep(200 * Math.pow(2, attempt - 1));
        }
    }
    // Return null to let callers decide fallbacks without breaking UI
    return null;
}
async function postJSON(url, body) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, extra = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const { timeout = 10000, signal: externalSignal } = extra;
    const controller = new AbortController();
    const tid = setTimeout(()=>controller.abort(), timeout);
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers || {},
                ...getAuthHeader()
            },
            body: JSON.stringify(body || {}),
            signal: externalSignal || controller.signal
        });
        clearTimeout(tid);
        const data = await parseResponse(res);
        if (!res.ok) {
            const err = new Error(data && (data.error || data.message) || "HTTP ".concat(res.status));
            err.status = res.status;
            throw err;
        }
        return data;
    } catch (err) {
        clearTimeout(tid);
        throw err;
    }
}
async function putJSON(url, body) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, extra = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const { timeout = 10000, signal: externalSignal } = extra;
    const controller = new AbortController();
    const tid = setTimeout(()=>controller.abort(), timeout);
    try {
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers || {},
                ...getAuthHeader()
            },
            body: JSON.stringify(body || {}),
            signal: externalSignal || controller.signal
        });
        clearTimeout(tid);
        const data = await parseResponse(res);
        if (!res.ok) {
            const err = new Error(data && (data.error || data.message) || "HTTP ".concat(res.status));
            err.status = res.status;
            throw err;
        }
        return data;
    } catch (err) {
        clearTimeout(tid);
        throw err;
    }
}
async function deleteJSON(url) {
    let body = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : undefined, options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, extra = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const { timeout = 10000, signal: externalSignal } = extra;
    const controller = new AbortController();
    const tid = setTimeout(()=>controller.abort(), timeout);
    try {
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers || {},
                ...getAuthHeader()
            },
            body: body === undefined ? undefined : JSON.stringify(body),
            signal: externalSignal || controller.signal
        });
        clearTimeout(tid);
        const data = await parseResponse(res);
        if (!res.ok) {
            const err = new Error(data && (data.error || data.message) || "HTTP ".concat(res.status));
            err.status = res.status;
            throw err;
        }
        return data;
    } catch (err) {
        clearTimeout(tid);
        throw err;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/src/app/vendor-plan/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VendorPlanPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html2canvas$2f$dist$2f$html2canvas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/html2canvas/dist/html2canvas.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/http.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/formatters.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function VendorPlanPage() {
    var _totals_payTotals, _totals_payTotals1, _totals_payTotals2, _totals_payTotals3, _totals_payTotals4, _totals_payTotals5, _totals_payTotals6, _editModal_route;
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [date, setDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "VendorPlanPage.useState": ()=>new Date().toISOString().slice(0, 10)
    }["VendorPlanPage.useState"]);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [routes, setRoutes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // [{id, name}]
    const [plants, setPlants] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [departments, setDepartments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [shifts, setShifts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // [{id, name_th, name_en}]
    const [departTimesByShift, setDepartTimesByShift] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({}); // { shiftId: [{id, time}] }
    const [countsByDepartTime, setCountsByDepartTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({}); // { dtId: { routeId: people } }
    const [carPlanByDepartTime, setCarPlanByDepartTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({}); // { dtId: { routeId: car_count } }
    const captureRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [payments, setPayments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({}); // { routeId: { pay_flat, pay_wait, pay_total_cars, pay_ot_normal, pay_trip, pay_ot_holiday, pay_trip_night } }
    const [editModal, setEditModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        open: false,
        route: null,
        key: null,
        value: ''
    });
    const [lockInfo, setLockInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        the_date: null,
        is_locked: 0
    });
    const isAdminga = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorPlanPage.useMemo[isAdminga]": ()=>String((user === null || user === void 0 ? void 0 : user.username) || '').toLowerCase() === 'adminga'
    }["VendorPlanPage.useMemo[isAdminga]"], [
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VendorPlanPage.useEffect": ()=>{
            try {
                const u = JSON.parse(localStorage.getItem("user") || "null");
                setUser(u);
            } catch (e) {}
        }
    }["VendorPlanPage.useEffect"], []);
    // Helper: pick day/night shift ids by name
    const dayNightShiftIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorPlanPage.useMemo[dayNightShiftIds]": ()=>{
            var _shifts_, _shifts_find;
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
            var _shifts__id;
            // fallback: first=day second=night
            if (!day) day = (_shifts__id = (_shifts_ = shifts[0]) === null || _shifts_ === void 0 ? void 0 : _shifts_.id) !== null && _shifts__id !== void 0 ? _shifts__id : null;
            var _shifts_find_id;
            if (!night) night = (_shifts_find_id = (_shifts_find = shifts.find({
                "VendorPlanPage.useMemo[dayNightShiftIds]": (x)=>x.id !== day
            }["VendorPlanPage.useMemo[dayNightShiftIds]"])) === null || _shifts_find === void 0 ? void 0 : _shifts_find.id) !== null && _shifts_find_id !== void 0 ? _shifts_find_id : null;
            return {
                day,
                night
            };
        }
    }["VendorPlanPage.useMemo[dayNightShiftIds]"], [
        shifts
    ]);
    // Load master data
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VendorPlanPage.useEffect": ()=>{
            let cancelled = false;
            const loadMasters = {
                "VendorPlanPage.useEffect.loadMasters": async ()=>{
                    try {
                        const [routesRows, shiftsRows, plantRows, deptRows] = await Promise.all([
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])('/api/ot/routes'),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])('/api/ot/shifts'),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])('/api/ot/plants'),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])('/api/ot/departments')
                        ]);
                        if (cancelled) return;
                        setRoutes(Array.isArray(routesRows) ? routesRows : []);
                        const sh = Array.isArray(shiftsRows) ? shiftsRows : [];
                        setShifts(sh);
                        setPlants(Array.isArray(plantRows) ? plantRows : []);
                        setDepartments(Array.isArray(deptRows) ? deptRows : []);
                    } catch (e) {
                        if (cancelled) return;
                        setRoutes([]);
                        setShifts([]);
                        setPlants([]);
                        setDepartments([]);
                    }
                }
            }["VendorPlanPage.useEffect.loadMasters"];
            loadMasters();
            return ({
                "VendorPlanPage.useEffect": ()=>{
                    cancelled = true;
                }
            })["VendorPlanPage.useEffect"];
        }
    }["VendorPlanPage.useEffect"], []);
    // Load depart times for both day and night
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VendorPlanPage.useEffect": ()=>{
            let cancelled = false;
            const loadDepartTimes = {
                "VendorPlanPage.useEffect.loadDepartTimes": async ()=>{
                    if (!dayNightShiftIds.day && !dayNightShiftIds.night) return setDepartTimesByShift({});
                    const acc = {};
                    for (const sid of [
                        dayNightShiftIds.day,
                        dayNightShiftIds.night
                    ].filter(Boolean)){
                        const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])("/api/ot/depart-times?shiftId=".concat(sid)) || [];
                        acc[sid] = (Array.isArray(rows) ? rows : []).sort({
                            "VendorPlanPage.useEffect.loadDepartTimes": (a, b)=>{
                                const ie = Number((b === null || b === void 0 ? void 0 : b.is_entry) || 0) - Number((a === null || a === void 0 ? void 0 : a.is_entry) || 0);
                                if (ie !== 0) return ie; // entries (1) first
                                return String(a.time).localeCompare(String(b.time));
                            }
                        }["VendorPlanPage.useEffect.loadDepartTimes"]);
                    }
                    if (!cancelled) setDepartTimesByShift(acc);
                }
            }["VendorPlanPage.useEffect.loadDepartTimes"];
            loadDepartTimes();
            return ({
                "VendorPlanPage.useEffect": ()=>{
                    cancelled = true;
                }
            })["VendorPlanPage.useEffect"];
        }
    }["VendorPlanPage.useEffect"], [
        dayNightShiftIds.day,
        dayNightShiftIds.night
    ]);
    // Load aggregate counts per depart time (sum across plants/departments)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VendorPlanPage.useEffect": ()=>{
            let cancelled = false;
            const loadCounts = {
                "VendorPlanPage.useEffect.loadCounts": async ()=>{
                    const acc = {};
                    const allDts = [
                        ...departTimesByShift[dayNightShiftIds.day] || [],
                        ...departTimesByShift[dayNightShiftIds.night] || []
                    ];
                    for (const dt of allDts){
                        const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])("/api/ot/counts?date=".concat(date, "&shiftId=").concat(dt.shift_id || dayNightShiftIds.day, "&departTimeId=").concat(dt.id)) || [];
                        const map = {}; // { routeId: totalPeople }
                        for (const row of Array.isArray(rows) ? rows : []){
                            const rId = row.route_id;
                            const c = Number(row.count) || 0;
                            map[rId] = (map[rId] || 0) + c; // sum across departments
                        }
                        acc[dt.id] = map;
                    }
                    if (!cancelled) setCountsByDepartTime(acc);
                }
            }["VendorPlanPage.useEffect.loadCounts"];
            loadCounts();
            return ({
                "VendorPlanPage.useEffect": ()=>{
                    cancelled = true;
                }
            })["VendorPlanPage.useEffect"];
        }
    }["VendorPlanPage.useEffect"], [
        date,
        departTimesByShift,
        dayNightShiftIds.day,
        dayNightShiftIds.night
    ]);
    // Load car overrides per depart time (manual overrides from ot_car_plan)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VendorPlanPage.useEffect": ()=>{
            let cancelled = false;
            const loadCars = {
                "VendorPlanPage.useEffect.loadCars": async ()=>{
                    const acc = {};
                    const allDts = [
                        ...departTimesByShift[dayNightShiftIds.day] || [],
                        ...departTimesByShift[dayNightShiftIds.night] || []
                    ];
                    for (const dt of allDts){
                        const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])("/api/ot/cars?date=".concat(date, "&shiftId=").concat(dt.shift_id || dayNightShiftIds.day, "&departTimeId=").concat(dt.id)) || [];
                        const map = {};
                        for (const row of Array.isArray(rows) ? rows : []){
                            const rId = row.route_id;
                            const c = Number(row.car_count) || 0;
                            map[rId] = c;
                        }
                        acc[dt.id] = map;
                    }
                    if (!cancelled) setCarPlanByDepartTime(acc);
                }
            }["VendorPlanPage.useEffect.loadCars"];
            loadCars();
            return ({
                "VendorPlanPage.useEffect": ()=>{
                    cancelled = true;
                }
            })["VendorPlanPage.useEffect"];
        }
    }["VendorPlanPage.useEffect"], [
        date,
        departTimesByShift,
        dayNightShiftIds.day,
        dayNightShiftIds.night
    ]);
    // Load vendor payments for the date
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VendorPlanPage.useEffect": ()=>{
            let cancelled = false;
            const loadPayments = {
                "VendorPlanPage.useEffect.loadPayments": async ()=>{
                    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])("/api/vendor/payments?date=".concat(date)) || [];
                    const map = {};
                    for (const r of Array.isArray(rows) ? rows : []){
                        map[r.route_id] = {
                            pay_flat: Number(r.pay_flat) || 0,
                            pay_wait: Number(r.pay_wait) || 0,
                            pay_total_cars: Number(r.pay_total_cars) || 0,
                            pay_ot_normal: Number(r.pay_ot_normal) || 0,
                            pay_trip: Number(r.pay_trip) || 0,
                            pay_ot_holiday: Number(r.pay_ot_holiday) || 0,
                            pay_trip_night: Number(r.pay_trip_night) || 0
                        };
                    }
                    if (!cancelled) setPayments(map);
                }
            }["VendorPlanPage.useEffect.loadPayments"];
            loadPayments();
            return ({
                "VendorPlanPage.useEffect": ()=>{
                    cancelled = true;
                }
            })["VendorPlanPage.useEffect"];
        }
    }["VendorPlanPage.useEffect"], [
        date
    ]);
    // Load lock for the selected date (shared with other pages)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VendorPlanPage.useEffect": ()=>{
            let cancelled = false;
            ({
                "VendorPlanPage.useEffect": async ()=>{
                    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])("/api/ot/locks?date=".concat(date));
                    if (!cancelled) setLockInfo(data || {
                        the_date: date,
                        is_locked: 0
                    });
                }
            })["VendorPlanPage.useEffect"]();
            return ({
                "VendorPlanPage.useEffect": ()=>{
                    cancelled = true;
                }
            })["VendorPlanPage.useEffect"];
        }
    }["VendorPlanPage.useEffect"], [
        date
    ]);
    // Lock/unlock similar to other pages
    const toggleLock = async (force)=>{
        const next = typeof force === 'boolean' ? force ? 1 : 0 : (lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) ? 0 : 1;
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
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postJSON"])('/api/ot/locks', {
                the_date: date,
                is_locked: next
            });
        } catch (e) {
            // revert on failure
            setLockInfo((prev)=>({
                    ...prev || {},
                    is_locked: next ? 0 : 1
                }));
        }
    };
    const openEdit = (route, key)=>{
        var _payments_route_id;
        var _payments_route_id_key;
        const current = (_payments_route_id_key = payments === null || payments === void 0 ? void 0 : (_payments_route_id = payments[route.id]) === null || _payments_route_id === void 0 ? void 0 : _payments_route_id[key]) !== null && _payments_route_id_key !== void 0 ? _payments_route_id_key : 0;
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
            const body = {
                the_date: date,
                route_id: editModal.route.id,
                key: editModal.key,
                value: Math.max(0, Number(editModal.value) || 0)
            };
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postJSON"])('/api/vendor/payments', body);
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
        const canvas = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html2canvas$2f$dist$2f$html2canvas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(captureRef.current);
        const link = document.createElement("a");
        link.download = "vendor-plan-".concat(date, ".png");
        link.href = canvas.toDataURL("image/png");
        link.click();
    };
    const handleLogout = ()=>{
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        } catch (e) {}
        router.push("/");
    };
    const dayTimes = departTimesByShift[dayNightShiftIds.day] || [];
    const nightTimes = departTimesByShift[dayNightShiftIds.night] || [];
    const allTimes = [
        ...dayTimes,
        ...nightTimes
    ];
    // Totals across all routes per depart time and payment categories
    const totals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorPlanPage.useMemo[totals]": ()=>{
            const peopleTotals = {};
            const carTotals = {};
            for (const dt of allTimes){
                let pSum = 0;
                let cSum = 0;
                for (const r of routes){
                    var _countsByDepartTime_dt_id, _carPlanByDepartTime_dt_id;
                    const ppl = Number((countsByDepartTime === null || countsByDepartTime === void 0 ? void 0 : (_countsByDepartTime_dt_id = countsByDepartTime[dt.id]) === null || _countsByDepartTime_dt_id === void 0 ? void 0 : _countsByDepartTime_dt_id[r.id]) || 0);
                    pSum += ppl;
                    const override = carPlanByDepartTime === null || carPlanByDepartTime === void 0 ? void 0 : (_carPlanByDepartTime_dt_id = carPlanByDepartTime[dt.id]) === null || _carPlanByDepartTime_dt_id === void 0 ? void 0 : _carPlanByDepartTime_dt_id[r.id];
                    cSum += override != null ? Number(override) || 0 : calcVehicles(ppl);
                }
                peopleTotals[dt.id] = pSum;
                carTotals[dt.id] = cSum;
            }
            const payKeys = [
                'pay_flat',
                'pay_wait',
                'pay_total_cars',
                'pay_ot_normal',
                'pay_trip',
                'pay_ot_holiday',
                'pay_trip_night'
            ];
            const payTotals = {};
            for (const k of payKeys){
                var _payments_r_id;
                let s = 0;
                for (const r of routes)s += Number((payments === null || payments === void 0 ? void 0 : (_payments_r_id = payments[r.id]) === null || _payments_r_id === void 0 ? void 0 : _payments_r_id[k]) || 0);
                payTotals[k] = s;
            }
            return {
                peopleTotals,
                carTotals,
                payTotals
            };
        }
    }["VendorPlanPage.useMemo[totals]"], [
        allTimes,
        routes,
        countsByDepartTime,
        payments,
        carPlanByDepartTime
    ]);
    const welcomeText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorPlanPage.useMemo[welcomeText]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatWelcome"])(user, departments, plants)
    }["VendorPlanPage.useMemo[welcomeText]"], [
        user,
        departments,
        plants
    ]);
    var _totals_payTotals_pay_flat, _totals_payTotals_pay_wait, _totals_payTotals_pay_total_cars, _totals_payTotals_pay_ot_normal, _totals_payTotals_pay_trip, _totals_payTotals_pay_ot_holiday, _totals_payTotals_pay_trip_night;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: styles.wrapper,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: styles.stack,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        ...styles.panelCard,
                        paddingBottom: 16
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.headerRow,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        style: styles.title,
                                        children: "แผนจัดรถ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                        lineNumber: 268,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: '#2f3e4f',
                                            fontWeight: 600
                                        },
                                        children: [
                                            "ยินดีต้อนรับ, ",
                                            welcomeText
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                        lineNumber: 269,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                lineNumber: 267,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                        lineNumber: 272,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>router.push('/'),
                                        style: {
                                            ...styles.logoutBtn,
                                            background: '#34495e'
                                        },
                                        children: "กลับเมนูหลัก"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                        lineNumber: 275,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleLogout,
                                        style: styles.logoutBtn,
                                        children: "ออกจากระบบ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                        lineNumber: 276,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                lineNumber: 271,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                        lineNumber: 266,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                    lineNumber: 265,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: captureRef,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                ...styles.panelCard,
                                paddingTop: 16
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.controls,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: styles.label,
                                                children: "เลือกวันที่:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                lineNumber: 286,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: date,
                                                onChange: (e)=>setDate(e.target.value),
                                                style: styles.input
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                lineNumber: 287,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                        lineNumber: 285,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        style: styles.primaryBtn,
                                        onClick: handleSaveAsImage,
                                        children: "บันทึกรูปภาพ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                        lineNumber: 289,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                lineNumber: 284,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                            lineNumber: 283,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                ...styles.panelCardTight
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: '100%',
                                        overflowX: 'auto',
                                        ...(lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) ? styles.lockedWrap : {}
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        style: styles.table,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    ...styles.thMain,
                                                                    width: 240
                                                                },
                                                                rowSpan: 3,
                                                                children: "สายรถ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 298,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    ...styles.thShift,
                                                                    background: '#FFEB3B'
                                                                },
                                                                colSpan: dayTimes.length * 2 + 1,
                                                                children: [
                                                                    "กะกลางวัน ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Day Shift"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 299,
                                                                        columnNumber: 123
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 299,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    ...styles.thShift,
                                                                    background: '#F8BBD0'
                                                                },
                                                                colSpan: nightTimes.length * 2 + 1,
                                                                children: [
                                                                    "กะกลางคืน ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Night Shift"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 300,
                                                                        columnNumber: 125
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 300,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    ...styles.thMain
                                                                },
                                                                colSpan: 7,
                                                                children: "จำนวนการจ่าย Bus cost type"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 301,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 297,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        children: [
                                                            dayTimes.map((dt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    style: {
                                                                        ...styles.thTime,
                                                                        background: '#FFFB0D'
                                                                    },
                                                                    colSpan: 2,
                                                                    title: dt.is_entry ? 'เวลาเข้า' : 'เวลาออก',
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: styles.timeWrap,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: String(dt.time).slice(0, 5)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                                lineNumber: 307,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                style: {
                                                                                    ...styles.timePill,
                                                                                    ...dt.is_entry ? styles.timePillEntry : styles.timePillExit
                                                                                },
                                                                                children: dt.is_entry ? 'เข้า' : 'ออก'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                                lineNumber: 308,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 306,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, "d-".concat(dt.id), false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 305,
                                                                    columnNumber: 23
                                                                }, this)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    ...styles.thTime,
                                                                    background: '#FFFB0D'
                                                                },
                                                                colSpan: 1,
                                                                title: "รวมรถ",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: styles.timeWrap,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: "รวมรถ"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 317,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 316,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 315,
                                                                columnNumber: 21
                                                            }, this),
                                                            nightTimes.map((dt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    style: {
                                                                        ...styles.thTime,
                                                                        background: '#F5D0D7'
                                                                    },
                                                                    colSpan: 2,
                                                                    title: dt.is_entry ? 'เวลาเข้า' : 'เวลาออก',
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: styles.timeWrap,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: String(dt.time).slice(0, 5)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                                lineNumber: 323,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                style: {
                                                                                    ...styles.timePill,
                                                                                    ...dt.is_entry ? styles.timePillEntry : styles.timePillExit
                                                                                },
                                                                                children: dt.is_entry ? 'เข้า' : 'ออก'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                                lineNumber: 324,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 322,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, "n-".concat(dt.id), false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 321,
                                                                    columnNumber: 23
                                                                }, this)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    ...styles.thTime,
                                                                    background: '#F5D0D7'
                                                                },
                                                                colSpan: 1,
                                                                title: "รวมรถ",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: styles.timeWrap,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: "รวมรถ"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 333,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 332,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 331,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: styles.thPayHead,
                                                                rowSpan: 2,
                                                                children: "รายเดือน"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 336,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: styles.thPayHead,
                                                                rowSpan: 2,
                                                                children: "จอดรอ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 337,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: styles.thPayHead,
                                                                rowSpan: 2,
                                                                children: "รวมรถ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 338,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: styles.thPayHead,
                                                                rowSpan: 2,
                                                                children: "OT เหมาวันปกติ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 339,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: styles.thPayHead,
                                                                rowSpan: 2,
                                                                children: "เหมาเที่ยว"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 340,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: styles.thPayHead,
                                                                rowSpan: 2,
                                                                children: "OT เหมาวันหยุด"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 341,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: styles.thPayHead,
                                                                rowSpan: 2,
                                                                children: "เหมาเที่ยวกะดึก"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 342,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 303,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        children: [
                                                            dayTimes.map((dt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: styles.thSub,
                                                                            children: "คน"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                            lineNumber: 347,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: styles.thSub,
                                                                            children: "รถ"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                            lineNumber: 348,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, "sub-d-".concat(dt.id), true, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 346,
                                                                    columnNumber: 23
                                                                }, this)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: styles.thSub,
                                                                children: "รถ"
                                                            }, "sub-day-sum", false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 352,
                                                                columnNumber: 21
                                                            }, this),
                                                            nightTimes.map((dt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: styles.thSub,
                                                                            children: "คน"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                            lineNumber: 355,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: styles.thSub,
                                                                            children: "รถ"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                            lineNumber: 356,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, "sub-n-".concat(dt.id), true, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 354,
                                                                    columnNumber: 23
                                                                }, this)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: styles.thSub,
                                                                children: "รถ"
                                                            }, "sub-night-sum", false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 360,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 344,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                lineNumber: 296,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                children: [
                                                    routes.map((r, idx)=>{
                                                        var _payments_r_id, _payments_r_id1, _payments_r_id2, _payments_r_id3, _payments_r_id4, _payments_r_id5, _payments_r_id6;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: styles.tdRoute,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            style: styles.routeIndex,
                                                                            children: [
                                                                                idx + 1,
                                                                                "."
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                            lineNumber: 366,
                                                                            columnNumber: 50
                                                                        }, this),
                                                                        " ",
                                                                        r.name
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 366,
                                                                    columnNumber: 23
                                                                }, this),
                                                                dayTimes.map((dt)=>{
                                                                    var _countsByDepartTime_dt_id, _carPlanByDepartTime_dt_id;
                                                                    const people = Number((countsByDepartTime === null || countsByDepartTime === void 0 ? void 0 : (_countsByDepartTime_dt_id = countsByDepartTime[dt.id]) === null || _countsByDepartTime_dt_id === void 0 ? void 0 : _countsByDepartTime_dt_id[r.id]) || 0);
                                                                    const override = carPlanByDepartTime === null || carPlanByDepartTime === void 0 ? void 0 : (_carPlanByDepartTime_dt_id = carPlanByDepartTime[dt.id]) === null || _carPlanByDepartTime_dt_id === void 0 ? void 0 : _carPlanByDepartTime_dt_id[r.id];
                                                                    const cars = override != null ? Number(override) || 0 : calcVehicles(people);
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: styles.tdCell,
                                                                                children: people > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    children: people
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                                    lineNumber: 374,
                                                                                    columnNumber: 69
                                                                                }, this) : ''
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                                lineNumber: 374,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: styles.tdCell,
                                                                                children: cars > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                                    children: [
                                                                                        cars,
                                                                                        " คัน"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                                    lineNumber: 375,
                                                                                    columnNumber: 67
                                                                                }, this) : ''
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                                lineNumber: 375,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, "cell-d-".concat(dt.id, "-").concat(r.id), true, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 373,
                                                                        columnNumber: 27
                                                                    }, this);
                                                                }),
                                                                (()=>{
                                                                    const dayCars = dayTimes.reduce((acc, dt)=>{
                                                                        var _countsByDepartTime_dt_id, _carPlanByDepartTime_dt_id;
                                                                        const people = Number((countsByDepartTime === null || countsByDepartTime === void 0 ? void 0 : (_countsByDepartTime_dt_id = countsByDepartTime[dt.id]) === null || _countsByDepartTime_dt_id === void 0 ? void 0 : _countsByDepartTime_dt_id[r.id]) || 0);
                                                                        const override = carPlanByDepartTime === null || carPlanByDepartTime === void 0 ? void 0 : (_carPlanByDepartTime_dt_id = carPlanByDepartTime[dt.id]) === null || _carPlanByDepartTime_dt_id === void 0 ? void 0 : _carPlanByDepartTime_dt_id[r.id];
                                                                        const cars = override != null ? Number(override) || 0 : calcVehicles(people);
                                                                        return acc + cars;
                                                                    }, 0);
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: styles.tdCell,
                                                                        children: dayCars > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                            children: [
                                                                                dayCars,
                                                                                " คัน"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                            lineNumber: 388,
                                                                            columnNumber: 97
                                                                        }, this) : ''
                                                                    }, "cell-day-sum-".concat(r.id), false, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 388,
                                                                        columnNumber: 27
                                                                    }, this);
                                                                })(),
                                                                nightTimes.map((dt)=>{
                                                                    var _countsByDepartTime_dt_id, _carPlanByDepartTime_dt_id;
                                                                    const people = Number((countsByDepartTime === null || countsByDepartTime === void 0 ? void 0 : (_countsByDepartTime_dt_id = countsByDepartTime[dt.id]) === null || _countsByDepartTime_dt_id === void 0 ? void 0 : _countsByDepartTime_dt_id[r.id]) || 0);
                                                                    const override = carPlanByDepartTime === null || carPlanByDepartTime === void 0 ? void 0 : (_carPlanByDepartTime_dt_id = carPlanByDepartTime[dt.id]) === null || _carPlanByDepartTime_dt_id === void 0 ? void 0 : _carPlanByDepartTime_dt_id[r.id];
                                                                    const cars = override != null ? Number(override) || 0 : calcVehicles(people);
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: styles.tdCell,
                                                                                children: people > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    children: people
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                                    lineNumber: 398,
                                                                                    columnNumber: 69
                                                                                }, this) : ''
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                                lineNumber: 398,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: styles.tdCell,
                                                                                children: cars > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                                    children: [
                                                                                        cars,
                                                                                        " คัน"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                                    lineNumber: 399,
                                                                                    columnNumber: 67
                                                                                }, this) : ''
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                                lineNumber: 399,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, "cell-n-".concat(dt.id, "-").concat(r.id), true, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 397,
                                                                        columnNumber: 27
                                                                    }, this);
                                                                }),
                                                                (()=>{
                                                                    const nightCars = nightTimes.reduce((acc, dt)=>{
                                                                        var _countsByDepartTime_dt_id, _carPlanByDepartTime_dt_id;
                                                                        const people = Number((countsByDepartTime === null || countsByDepartTime === void 0 ? void 0 : (_countsByDepartTime_dt_id = countsByDepartTime[dt.id]) === null || _countsByDepartTime_dt_id === void 0 ? void 0 : _countsByDepartTime_dt_id[r.id]) || 0);
                                                                        const override = carPlanByDepartTime === null || carPlanByDepartTime === void 0 ? void 0 : (_carPlanByDepartTime_dt_id = carPlanByDepartTime[dt.id]) === null || _carPlanByDepartTime_dt_id === void 0 ? void 0 : _carPlanByDepartTime_dt_id[r.id];
                                                                        const cars = override != null ? Number(override) || 0 : calcVehicles(people);
                                                                        return acc + cars;
                                                                    }, 0);
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: styles.tdCell,
                                                                        children: nightCars > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                            children: [
                                                                                nightCars,
                                                                                " คัน"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                            lineNumber: 412,
                                                                            columnNumber: 101
                                                                        }, this) : ''
                                                                    }, "cell-night-sum-".concat(r.id), false, {
                                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                        lineNumber: 412,
                                                                        columnNumber: 27
                                                                    }, this);
                                                                })(),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        ...styles.tdPay,
                                                                        ...styles.tdPayMonthly
                                                                    },
                                                                    onClick: ()=>!(lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) && openEdit(r, 'pay_flat'),
                                                                    children: (payments === null || payments === void 0 ? void 0 : (_payments_r_id = payments[r.id]) === null || _payments_r_id === void 0 ? void 0 : _payments_r_id.pay_flat) || 0 || ''
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 416,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: styles.tdPay,
                                                                    onClick: ()=>!(lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) && openEdit(r, 'pay_wait'),
                                                                    children: (payments === null || payments === void 0 ? void 0 : (_payments_r_id1 = payments[r.id]) === null || _payments_r_id1 === void 0 ? void 0 : _payments_r_id1.pay_wait) || 0 || ''
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 417,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: styles.tdPay,
                                                                    onClick: ()=>!(lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) && openEdit(r, 'pay_total_cars'),
                                                                    children: (payments === null || payments === void 0 ? void 0 : (_payments_r_id2 = payments[r.id]) === null || _payments_r_id2 === void 0 ? void 0 : _payments_r_id2.pay_total_cars) || 0 || ''
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 418,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: styles.tdPay,
                                                                    onClick: ()=>!(lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) && openEdit(r, 'pay_ot_normal'),
                                                                    children: (payments === null || payments === void 0 ? void 0 : (_payments_r_id3 = payments[r.id]) === null || _payments_r_id3 === void 0 ? void 0 : _payments_r_id3.pay_ot_normal) || 0 || ''
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 419,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: styles.tdPay,
                                                                    onClick: ()=>!(lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) && openEdit(r, 'pay_trip'),
                                                                    children: (payments === null || payments === void 0 ? void 0 : (_payments_r_id4 = payments[r.id]) === null || _payments_r_id4 === void 0 ? void 0 : _payments_r_id4.pay_trip) || 0 || ''
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 420,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: styles.tdPay,
                                                                    onClick: ()=>!(lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) && openEdit(r, 'pay_ot_holiday'),
                                                                    children: (payments === null || payments === void 0 ? void 0 : (_payments_r_id5 = payments[r.id]) === null || _payments_r_id5 === void 0 ? void 0 : _payments_r_id5.pay_ot_holiday) || 0 || ''
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 421,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: styles.tdPay,
                                                                    onClick: ()=>!(lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) && openEdit(r, 'pay_trip_night'),
                                                                    children: (payments === null || payments === void 0 ? void 0 : (_payments_r_id6 = payments[r.id]) === null || _payments_r_id6 === void 0 ? void 0 : _payments_r_id6.pay_trip_night) || 0 || ''
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 422,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, r.id, true, {
                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                            lineNumber: 365,
                                                            columnNumber: 21
                                                        }, this);
                                                    }),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: styles.tdTotalRoute,
                                                                children: "รวม"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 427,
                                                                columnNumber: 21
                                                            }, this),
                                                            dayTimes.map((dt)=>{
                                                                var _totals_peopleTotals, _totals_carTotals;
                                                                var _totals_peopleTotals_dt_id, _totals_carTotals_dt_id;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            style: styles.tdSum,
                                                                            children: ((_totals_peopleTotals_dt_id = (_totals_peopleTotals = totals.peopleTotals) === null || _totals_peopleTotals === void 0 ? void 0 : _totals_peopleTotals[dt.id]) !== null && _totals_peopleTotals_dt_id !== void 0 ? _totals_peopleTotals_dt_id : 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                                children: totals.peopleTotals[dt.id]
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                                lineNumber: 431,
                                                                                columnNumber: 70
                                                                            }, this) : ''
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                            lineNumber: 430,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            style: styles.tdSum,
                                                                            children: ((_totals_carTotals_dt_id = (_totals_carTotals = totals.carTotals) === null || _totals_carTotals === void 0 ? void 0 : _totals_carTotals[dt.id]) !== null && _totals_carTotals_dt_id !== void 0 ? _totals_carTotals_dt_id : 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                                children: "".concat(totals.carTotals[dt.id], " คัน")
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                                lineNumber: 434,
                                                                                columnNumber: 67
                                                                            }, this) : ''
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                            lineNumber: 433,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, "sum-d-".concat(dt.id), true, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 429,
                                                                    columnNumber: 23
                                                                }, this);
                                                            }),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: styles.tdSum,
                                                                children: dayTimes.reduce((acc, dt)=>{
                                                                    var _totals_carTotals;
                                                                    return acc + (((_totals_carTotals = totals.carTotals) === null || _totals_carTotals === void 0 ? void 0 : _totals_carTotals[dt.id]) || 0);
                                                                }, 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                    children: "".concat(dayTimes.reduce((acc, dt)=>{
                                                                        var _totals_carTotals;
                                                                        return acc + (((_totals_carTotals = totals.carTotals) === null || _totals_carTotals === void 0 ? void 0 : _totals_carTotals[dt.id]) || 0);
                                                                    }, 0), " คัน")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 439,
                                                                    columnNumber: 127
                                                                }, this) : ''
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 439,
                                                                columnNumber: 21
                                                            }, this),
                                                            nightTimes.map((dt)=>{
                                                                var _totals_peopleTotals, _totals_carTotals;
                                                                var _totals_peopleTotals_dt_id, _totals_carTotals_dt_id;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            style: styles.tdSum,
                                                                            children: ((_totals_peopleTotals_dt_id = (_totals_peopleTotals = totals.peopleTotals) === null || _totals_peopleTotals === void 0 ? void 0 : _totals_peopleTotals[dt.id]) !== null && _totals_peopleTotals_dt_id !== void 0 ? _totals_peopleTotals_dt_id : 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                                children: totals.peopleTotals[dt.id]
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                                lineNumber: 443,
                                                                                columnNumber: 70
                                                                            }, this) : ''
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                            lineNumber: 442,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            style: styles.tdSum,
                                                                            children: ((_totals_carTotals_dt_id = (_totals_carTotals = totals.carTotals) === null || _totals_carTotals === void 0 ? void 0 : _totals_carTotals[dt.id]) !== null && _totals_carTotals_dt_id !== void 0 ? _totals_carTotals_dt_id : 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                                children: "".concat(totals.carTotals[dt.id], " คัน")
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                                lineNumber: 446,
                                                                                columnNumber: 67
                                                                            }, this) : ''
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                            lineNumber: 445,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, "sum-n-".concat(dt.id), true, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 441,
                                                                    columnNumber: 23
                                                                }, this);
                                                            }),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: styles.tdSum,
                                                                children: nightTimes.reduce((acc, dt)=>{
                                                                    var _totals_carTotals;
                                                                    return acc + (((_totals_carTotals = totals.carTotals) === null || _totals_carTotals === void 0 ? void 0 : _totals_carTotals[dt.id]) || 0);
                                                                }, 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                    children: "".concat(nightTimes.reduce((acc, dt)=>{
                                                                        var _totals_carTotals;
                                                                        return acc + (((_totals_carTotals = totals.carTotals) === null || _totals_carTotals === void 0 ? void 0 : _totals_carTotals[dt.id]) || 0);
                                                                    }, 0), " คัน")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 451,
                                                                    columnNumber: 129
                                                                }, this) : ''
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 451,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    ...styles.tdSumPay,
                                                                    ...styles.tdSumPayMonthly
                                                                },
                                                                children: ((_totals_payTotals_pay_flat = (_totals_payTotals = totals.payTotals) === null || _totals_payTotals === void 0 ? void 0 : _totals_payTotals.pay_flat) !== null && _totals_payTotals_pay_flat !== void 0 ? _totals_payTotals_pay_flat : 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                    children: totals.payTotals.pay_flat
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 453,
                                                                    columnNumber: 124
                                                                }, this) : ''
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 453,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: styles.tdSumPay,
                                                                children: ((_totals_payTotals_pay_wait = (_totals_payTotals1 = totals.payTotals) === null || _totals_payTotals1 === void 0 ? void 0 : _totals_payTotals1.pay_wait) !== null && _totals_payTotals_pay_wait !== void 0 ? _totals_payTotals_pay_wait : 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                    children: totals.payTotals.pay_wait
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 454,
                                                                    columnNumber: 90
                                                                }, this) : ''
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 454,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: styles.tdSumPay,
                                                                children: ((_totals_payTotals_pay_total_cars = (_totals_payTotals2 = totals.payTotals) === null || _totals_payTotals2 === void 0 ? void 0 : _totals_payTotals2.pay_total_cars) !== null && _totals_payTotals_pay_total_cars !== void 0 ? _totals_payTotals_pay_total_cars : 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                    children: totals.payTotals.pay_total_cars
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 455,
                                                                    columnNumber: 96
                                                                }, this) : ''
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 455,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: styles.tdSumPay,
                                                                children: ((_totals_payTotals_pay_ot_normal = (_totals_payTotals3 = totals.payTotals) === null || _totals_payTotals3 === void 0 ? void 0 : _totals_payTotals3.pay_ot_normal) !== null && _totals_payTotals_pay_ot_normal !== void 0 ? _totals_payTotals_pay_ot_normal : 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                    children: totals.payTotals.pay_ot_normal
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 456,
                                                                    columnNumber: 95
                                                                }, this) : ''
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 456,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: styles.tdSumPay,
                                                                children: ((_totals_payTotals_pay_trip = (_totals_payTotals4 = totals.payTotals) === null || _totals_payTotals4 === void 0 ? void 0 : _totals_payTotals4.pay_trip) !== null && _totals_payTotals_pay_trip !== void 0 ? _totals_payTotals_pay_trip : 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                    children: totals.payTotals.pay_trip
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 457,
                                                                    columnNumber: 90
                                                                }, this) : ''
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 457,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: styles.tdSumPay,
                                                                children: ((_totals_payTotals_pay_ot_holiday = (_totals_payTotals5 = totals.payTotals) === null || _totals_payTotals5 === void 0 ? void 0 : _totals_payTotals5.pay_ot_holiday) !== null && _totals_payTotals_pay_ot_holiday !== void 0 ? _totals_payTotals_pay_ot_holiday : 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                    children: totals.payTotals.pay_ot_holiday
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 458,
                                                                    columnNumber: 96
                                                                }, this) : ''
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 458,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: styles.tdSumPay,
                                                                children: ((_totals_payTotals_pay_trip_night = (_totals_payTotals6 = totals.payTotals) === null || _totals_payTotals6 === void 0 ? void 0 : _totals_payTotals6.pay_trip_night) !== null && _totals_payTotals_pay_trip_night !== void 0 ? _totals_payTotals_pay_trip_night : 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                    children: totals.payTotals.pay_trip_night
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                    lineNumber: 459,
                                                                    columnNumber: 96
                                                                }, this) : ''
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                                lineNumber: 459,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                        lineNumber: 426,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/vendor-plan/page.jsx",
                                                lineNumber: 363,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/vendor-plan/page.jsx",
                                        lineNumber: 295,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                    lineNumber: 294,
                                    columnNumber: 13
                                }, this),
                                isAdminga && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: 12,
                                        padding: '12px 16px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            style: styles.approveBtn,
                                            onClick: ()=>toggleLock(true),
                                            children: "บันทึกข้อมูล"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                            lineNumber: 466,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            style: styles.cancelGrayBtn,
                                            onClick: ()=>toggleLock(false),
                                            children: "ยกเลิก"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                            lineNumber: 467,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                    lineNumber: 465,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                            lineNumber: 293,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                    lineNumber: 281,
                    columnNumber: 9
                }, this),
                editModal.open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.overlay,
                            onClick: closeEdit
                        }, void 0, false, {
                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                            lineNumber: 474,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.modal,
                            onClick: (e)=>e.stopPropagation(),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: styles.modalTitle,
                                    children: "แก้ไขจำนวนการจ่าย"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                    lineNumber: 476,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: 10,
                                        color: '#2c3e50'
                                    },
                                    children: [
                                        "สายรถ: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: (_editModal_route = editModal.route) === null || _editModal_route === void 0 ? void 0 : _editModal_route.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                            lineNumber: 478,
                                            columnNumber: 24
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                    lineNumber: 477,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.modalFormGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: styles.modalLabel,
                                            children: "จำนวน:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                            lineNumber: 481,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                            lineNumber: 482,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                    lineNumber: 480,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.modalButtonGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            style: styles.confirmButton,
                                            onClick: saveEdit,
                                            children: "บันทึก"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                            lineNumber: 488,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            style: styles.cancelButton,
                                            onClick: closeEdit,
                                            children: "ยกเลิก"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                                            lineNumber: 489,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/vendor-plan/page.jsx",
                                    lineNumber: 487,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vendor-plan/page.jsx",
                            lineNumber: 475,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/vendor-plan/page.jsx",
            lineNumber: 263,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/vendor-plan/page.jsx",
        lineNumber: 262,
        columnNumber: 5
    }, this);
}
_s(VendorPlanPage, "mN3Spv5Uq80v9VbGAkgYErkn+AY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = VendorPlanPage;
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
    tdPayMonthly: {
        background: '#fff9d6'
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
    tdSumPayMonthly: {
        background: '#fff2b3'
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
var _c;
__turbopack_context__.k.register(_c, "VendorPlanPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_98213e14._.js.map