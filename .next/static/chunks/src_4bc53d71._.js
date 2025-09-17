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
"[project]/src/app/truck-table/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TruckTable
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
function TruckTable() {
    var _carModal_route, _carModal_dt, _carModal_dt1;
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [date, setDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "TruckTable.useState": ()=>new Date().toISOString().slice(0, 10)
    }["TruckTable.useState"]);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [plants, setPlants] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // AC/RF/SSC
    const [departments, setDepartments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [routes, setRoutes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [shifts, setShifts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [shiftId, setShiftId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [departTimes, setDepartTimes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // by shift
    const [countsBy, setCountsBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({}); // { dtId: { routeId: { plantId: totalCount } , ttl: { routeId: total } } }
    const [carPlan, setCarPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({}); // { dtId: { routeId: car_count } }
    const [carModal, setCarModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        open: false,
        dt: null,
        route: null,
        value: 0
    });
    const [hiddenDepartTimeIds, setHiddenDepartTimeIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // hides loaded from server for current date+shift
    const [autoHideEnabled, setAutoHideEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // global toggle: auto hide empty times for all dates
    const captureRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TruckTable.useEffect": ()=>{
            try {
                const u = JSON.parse(localStorage.getItem('user') || 'null');
                setUser(u);
            } catch (e) {}
        }
    }["TruckTable.useEffect"], []);
    // Determine admin privilege early so effects below can depend on it safely
    const isAdminga = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TruckTable.useMemo[isAdminga]": ()=>String((user === null || user === void 0 ? void 0 : user.username) || '').toLowerCase() === 'adminga'
    }["TruckTable.useMemo[isAdminga]"], [
        user
    ]);
    const plantOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TruckTable.useMemo[plantOrder]": ()=>[
                'AC',
                'RF',
                'SSC'
            ]
    }["TruckTable.useMemo[plantOrder]"], []);
    const plantsSorted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TruckTable.useMemo[plantsSorted]": ()=>{
            return [
                ...plants
            ].sort({
                "TruckTable.useMemo[plantsSorted]": (a, b)=>{
                    const ia = plantOrder.indexOf(a.code);
                    const ib = plantOrder.indexOf(b.code);
                    const sa = ia === -1 ? 999 : ia;
                    const sb = ib === -1 ? 999 : ib;
                    if (sa !== sb) return sa - sb;
                    return String(a.code || '').localeCompare(String(b.code || ''));
                }
            }["TruckTable.useMemo[plantsSorted]"]);
        }
    }["TruckTable.useMemo[plantsSorted]"], [
        plants,
        plantOrder
    ]);
    const loadMasters = async ()=>{
        const [plantRowsRaw, routeRowsRaw, shiftRowsRaw, deptRowsRaw] = await Promise.all([
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])('/api/ot/plants'),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])('/api/ot/routes'),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])('/api/ot/shifts'),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])('/api/ot/departments')
        ]);
        setPlants(Array.isArray(plantRowsRaw) ? plantRowsRaw : []);
        setRoutes(Array.isArray(routeRowsRaw) ? routeRowsRaw : []);
        const sh = Array.isArray(shiftRowsRaw) ? shiftRowsRaw : [];
        setShifts(sh);
        setDepartments(Array.isArray(deptRowsRaw) ? deptRowsRaw : []);
        if (!shiftId && sh.length) setShiftId(sh[0].id);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TruckTable.useEffect": ()=>{
            loadMasters();
        }
    }["TruckTable.useEffect"], []);
    // Load global setting for auto hide
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TruckTable.useEffect": ()=>{
            ({
                "TruckTable.useEffect": async ()=>{
                    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])('/api/ot/settings?name=auto_hide_empty_times');
                    const enabled = String((res === null || res === void 0 ? void 0 : res.value) || '').toLowerCase() === 'true';
                    setAutoHideEnabled(enabled);
                }
            })["TruckTable.useEffect"]();
        }
    }["TruckTable.useEffect"], []);
    const loadDepartTimes = async (sid)=>{
        if (!sid) return setDepartTimes([]);
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])("/api/ot/depart-times?shiftId=".concat(sid), {}, {
            cache: 'no-store'
        });
        setDepartTimes(Array.isArray(data) ? data : []);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TruckTable.useEffect": ()=>{
            loadDepartTimes(shiftId);
        }
    }["TruckTable.useEffect"], [
        shiftId
    ]);
    // Load hidden depart times for current date+shift (applies to all users)
    const loadHiddenTimes = async (sid)=>{
        if (!sid) return setHiddenDepartTimeIds([]);
        const ids = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])("/api/ot/time-hides?date=".concat(date, "&shiftId=").concat(sid), {}, {
            cache: 'no-store'
        });
        setHiddenDepartTimeIds(Array.isArray(ids) ? ids : []);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TruckTable.useEffect": ()=>{
            loadHiddenTimes(shiftId);
        }
    }["TruckTable.useEffect"], [
        date,
        shiftId
    ]);
    // If global auto hide is enabled, ensure today's date has hides computed proactively
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TruckTable.useEffect": ()=>{
            ({
                "TruckTable.useEffect": async ()=>{
                    // Only admin (adminga) should persist hides to the server
                    if (!autoHideEnabled || !isAdminga || !Array.isArray(shifts) || !shifts.length) return;
                    try {
                        const tasks = [];
                        for (const s of shifts){
                            // eslint-disable-next-line no-await-in-loop
                            const empties = await computeEmptyTimesForShift(s.id);
                            tasks.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postJSON"])('/api/ot/time-hides', {
                                the_date: date,
                                shift_id: s.id,
                                depart_time_ids: empties
                            }));
                        }
                        await Promise.all(tasks);
                        await loadHiddenTimes(shiftId);
                    } catch (e) {}
                }
            })["TruckTable.useEffect"]();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["TruckTable.useEffect"], [
        autoHideEnabled,
        isAdminga,
        date,
        JSON.stringify(shifts)
    ]);
    // Aggregate per depart time -> per route -> per plant (sum across departments)
    const loadCounts = async ()=>{
        if (!date || !shiftId || departTimes.length === 0) {
            setCountsBy({});
            return;
        }
        const acc = {};
        for (const dt of departTimes){
            const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])("/api/ot/counts?date=".concat(date, "&shiftId=").concat(shiftId, "&departTimeId=").concat(dt.id)) || [];
            const map = {};
            for (const row of Array.isArray(rows) ? rows : []){
                const rId = row.route_id;
                const pId = row.plant_id;
                const c = Number(row.count) || 0;
                if (!map[rId]) map[rId] = {};
                map[rId][pId] = (map[rId][pId] || 0) + c; // sum across departments
            }
            const ttl = {};
            Object.keys(map).forEach((rId)=>{
                ttl[rId] = Object.values(map[rId]).reduce((s, v)=>s + (Number(v) || 0), 0);
            });
            acc[dt.id] = {
                map,
                ttl
            };
        }
        setCountsBy(acc);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TruckTable.useEffect": ()=>{
            loadCounts();
        }
    }["TruckTable.useEffect"], [
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
        const acc = {};
        for (const dt of departTimes){
            const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])("/api/ot/cars?date=".concat(date, "&shiftId=").concat(shiftId, "&departTimeId=").concat(dt.id)) || [];
            const m = {};
            for (const r of Array.isArray(rows) ? rows : [])m[r.route_id] = Number(r.car_count) || 0;
            acc[dt.id] = m;
        }
        setCarPlan(acc);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TruckTable.useEffect": ()=>{
            loadCarPlan();
        }
    }["TruckTable.useEffect"], [
        date,
        shiftId,
        departTimes
    ]);
    const findPlantIdByCode = (code)=>{
        var _plants_find;
        return (_plants_find = plants.find((p)=>p.code === code)) === null || _plants_find === void 0 ? void 0 : _plants_find.id;
    };
    const calcVehicles = (people)=>{
        const n = Number(people) || 0;
        if (n <= 6) return 0;
        return Math.ceil(n / 50);
    };
    const handleSaveAsImage = async ()=>{
        if (!captureRef.current) return;
        const canvas = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html2canvas$2f$dist$2f$html2canvas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(captureRef.current, {
            backgroundColor: isNightShift ? '#000000' : '#ffffff'
        });
        const link = document.createElement('a');
        link.download = "truck-table-".concat(date, ".png");
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
    const handleLogout = ()=>{
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (e) {}
        router.push('/');
    };
    // Night shift detection (กะกลางคืน)
    // แก้หน้างาน ให้กะกลางคืน (19:50) พื้นหลังดำ และเลื่อน 19:50 ไปซ้ายสุด และ เปลี่ยนจากเวลาออกเป็นเวลาเข้า
    //
    //
    //
    //
    //
    const isNightShift = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TruckTable.useMemo[isNightShift]": ()=>{
            try {
                const s = shifts.find({
                    "TruckTable.useMemo[isNightShift].s": (x)=>x.id === shiftId
                }["TruckTable.useMemo[isNightShift].s"]);
                const name = String((s === null || s === void 0 ? void 0 : s.name_th) || (s === null || s === void 0 ? void 0 : s.name_en) || '');
                return /กลางคืน/i.test(name) || /night/i.test(name);
            } catch (e) {
                return false;
            }
        }
    }["TruckTable.useMemo[isNightShift]"], [
        shifts,
        shiftId
    ]);
    // For display: always show entry times (is_entry=1) on the left, followed by exit times
    const displayDepartTimes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TruckTable.useMemo[displayDepartTimes]": ()=>{
            let list = Array.isArray(departTimes) ? [
                ...departTimes
            ] : [];
            // Apply server-side hides for current date+shift (hidden for everyone)
            if (Array.isArray(hiddenDepartTimeIds) && hiddenDepartTimeIds.length) {
                const setIds = new Set(hiddenDepartTimeIds);
                list = list.filter({
                    "TruckTable.useMemo[displayDepartTimes]": (dt)=>!setIds.has(dt.id)
                }["TruckTable.useMemo[displayDepartTimes]"]);
            }
            // Auto-hide empties dynamically for this date when enabled
            if (autoHideEnabled && countsBy && Object.keys(countsBy).length) {
                list = list.filter({
                    "TruckTable.useMemo[displayDepartTimes]": (dt)=>{
                        const rec = countsBy[dt.id] || {
                            ttl: {}
                        };
                        let ttlTotal = 0;
                        for (const v of Object.values(rec.ttl || {}))ttlTotal += Number(v) || 0;
                        return ttlTotal > 0; // keep only columns that have numbers
                    }
                }["TruckTable.useMemo[displayDepartTimes]"]);
            }
            return list.sort({
                "TruckTable.useMemo[displayDepartTimes]": (a, b)=>{
                    const ae = Number(a === null || a === void 0 ? void 0 : a.is_entry) || 0;
                    const be = Number(b === null || b === void 0 ? void 0 : b.is_entry) || 0; // entry=1 should come first
                    if (ae !== be) return be - ae; // 1 before 0
                    const ta = String((a === null || a === void 0 ? void 0 : a.time) || '');
                    const tb = String((b === null || b === void 0 ? void 0 : b.time) || '');
                    return ta.localeCompare(tb);
                }
            }["TruckTable.useMemo[displayDepartTimes]"]);
        }
    }["TruckTable.useMemo[displayDepartTimes]"], [
        departTimes,
        hiddenDepartTimeIds,
        autoHideEnabled,
        countsBy
    ]);
    //
    //
    //
    //
    //
    //
    const openCarEdit = (dt, route, ttl)=>{
        var _carPlan_dt_id;
        if (!isAdminga) return; // only adminga can edit
        var _carPlan_dt_id_route_id;
        const curr = Number((_carPlan_dt_id_route_id = carPlan === null || carPlan === void 0 ? void 0 : (_carPlan_dt_id = carPlan[dt.id]) === null || _carPlan_dt_id === void 0 ? void 0 : _carPlan_dt_id[route.id]) !== null && _carPlan_dt_id_route_id !== void 0 ? _carPlan_dt_id_route_id : calcVehicles(ttl));
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
            const body = {
                the_date: date,
                shift_id: shiftId,
                depart_time_id: carModal.dt.id,
                route_id: carModal.route.id,
                car_count: Math.max(0, Number(carModal.value) || 0)
            };
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postJSON"])('/api/ot/cars', body);
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
    // Compute empty depart-time ids for a shift (no numbers at all)
    async function computeEmptyTimesForShift(targetShiftId) {
        const times = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])("/api/ot/depart-times?shiftId=".concat(targetShiftId), {}, {
            cache: 'no-store'
        }) || [];
        const emptyIds = [];
        for (const t of Array.isArray(times) ? times : []){
            const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])("/api/ot/counts?date=".concat(date, "&shiftId=").concat(targetShiftId, "&departTimeId=").concat(t.id)) || [];
            let total = 0;
            for (const r of Array.isArray(rows) ? rows : [])total += Number(r.count) || 0;
            if (total === 0) emptyIds.push(t.id);
        }
        return emptyIds;
    }
    // Toggle: if currently hidden -> clear for both shifts; else compute empties and hide for both shifts
    const toggleHideEmptyTimes = async ()=>{
        if (!isAdminga) return;
        try {
            const newEnabled = !autoHideEnabled;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postJSON"])('/api/ot/settings', {
                name: 'auto_hide_empty_times',
                value: String(newEnabled)
            });
            setAutoHideEnabled(newEnabled);
            // When turning off, clear hides for current date; when turning on, effect will compute & post
            if (!newEnabled) {
                // Clear hides for current date when turning off
                await Promise.all((Array.isArray(shifts) ? shifts : []).map((s)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postJSON"])('/api/ot/time-hides', {
                        the_date: date,
                        shift_id: s.id,
                        depart_time_ids: []
                    })));
            }
            await loadHiddenTimes(shiftId);
        } catch (e) {
            alert(String((e === null || e === void 0 ? void 0 : e.message) || e));
        }
    };
    // Greeting labels
    const welcomeText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TruckTable.useMemo[welcomeText]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatWelcome"])(user, departments, plants)
    }["TruckTable.useMemo[welcomeText]"], [
        user,
        departments,
        plants
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            ...styles.wrapper,
            ...isNightShift ? {
                background: '#000000'
            } : {}
        },
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
                                        children: "ตารางจัดรถขากลับ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                        lineNumber: 266,
                                        columnNumber: 13
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
                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                        lineNumber: 267,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/truck-table/page.jsx",
                                lineNumber: 265,
                                columnNumber: 11
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
                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                        lineNumber: 272,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>router.push('/'),
                                        style: {
                                            ...styles.logoutBtn,
                                            background: '#34495e'
                                        },
                                        children: "กลับเมนูหลัก"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                        lineNumber: 273,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleLogout,
                                        style: styles.logoutBtn,
                                        children: "ออกจากระบบ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                        lineNumber: 274,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/truck-table/page.jsx",
                                lineNumber: 271,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/truck-table/page.jsx",
                        lineNumber: 264,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/truck-table/page.jsx",
                    lineNumber: 263,
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
                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                lineNumber: 284,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: date,
                                                onChange: (e)=>setDate(e.target.value),
                                                style: styles.input
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                lineNumber: 285,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                        lineNumber: 283,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: styles.label,
                                                children: "กะ:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                lineNumber: 288,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: shiftId || '',
                                                onChange: (e)=>setShiftId(Number(e.target.value) || null),
                                                style: styles.input,
                                                children: shifts.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: s.id,
                                                        children: s.name_th || s.name_en
                                                    }, s.id, false, {
                                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                                        lineNumber: 290,
                                                        columnNumber: 34
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                lineNumber: 289,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                        lineNumber: 287,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginLeft: 'auto',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                style: {
                                                    ...styles.primaryBtn,
                                                    marginLeft: 0
                                                },
                                                onClick: handleSaveAsImage,
                                                children: "บันทึกรูปภาพ"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                lineNumber: 294,
                                                columnNumber: 15
                                            }, this),
                                            isAdminga && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: toggleHideEmptyTimes,
                                                style: {
                                                    ...styles.primaryBtn,
                                                    marginLeft: 0,
                                                    background: '#8e44ad'
                                                },
                                                children: autoHideEnabled ? 'ปิดซ่อนอัตโนมัติ' : 'ซ่อนอัตโนมัติ'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                lineNumber: 296,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                        lineNumber: 293,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/truck-table/page.jsx",
                                lineNumber: 282,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/truck-table/page.jsx",
                            lineNumber: 281,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                ...styles.panelCardTight
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '100%',
                                    overflowX: 'auto'
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
                                                                width: 280,
                                                                textAlign: 'center'
                                                            },
                                                            rowSpan: 2,
                                                            children: "สายรถ"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                                            lineNumber: 309,
                                                            columnNumber: 17
                                                        }, this),
                                                        displayDepartTimes.map((dt, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                colSpan: ((plantsSorted === null || plantsSorted === void 0 ? void 0 : plantsSorted.length) || 0) + 2,
                                                                style: {
                                                                    ...styles.thTime,
                                                                    background: getTimeColor(idx)
                                                                },
                                                                children: (()=>{
                                                                    const t = String(dt.time).slice(0, 5);
                                                                    const prefix = Number(dt.is_entry) ? 'เวลาเข้า' : 'เวลาออก';
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            prefix,
                                                                            " ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: t
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                                                lineNumber: 316,
                                                                                columnNumber: 148
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true);
                                                                })()
                                                            }, dt.id, false, {
                                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                                lineNumber: 311,
                                                                columnNumber: 19
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                                    lineNumber: 308,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: displayDepartTimes.map((dt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                plantsSorted.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        style: styles.thMain,
                                                                        children: p.code
                                                                    }, "p-".concat(dt.id, "-").concat(p.id), false, {
                                                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                                                        lineNumber: 323,
                                                                        columnNumber: 44
                                                                    }, this)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    style: styles.thMain,
                                                                    children: "TTL"
                                                                }, "ttl-".concat(dt.id), false, {
                                                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                                                    lineNumber: 324,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    style: {
                                                                        ...styles.thMain,
                                                                        whiteSpace: 'normal',
                                                                        lineHeight: 1.2,
                                                                        paddingTop: 6,
                                                                        paddingBottom: 6
                                                                    },
                                                                    children: [
                                                                        "จำนวน",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("wbr", {}, void 0, false, {
                                                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                                                            lineNumber: 329,
                                                                            columnNumber: 28
                                                                        }, this),
                                                                        "รถ"
                                                                    ]
                                                                }, "car-".concat(dt.id), true, {
                                                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                                                    lineNumber: 325,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, "hdr-".concat(dt.id), true, {
                                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                                            lineNumber: 322,
                                                            columnNumber: 19
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                                    lineNumber: 320,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                            lineNumber: 307,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: [
                                                routes.map((r, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: styles.tdRoute,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: styles.routeIndex,
                                                                        children: [
                                                                            index + 1,
                                                                            "."
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                                                        lineNumber: 338,
                                                                        columnNumber: 46
                                                                    }, this),
                                                                    " ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: r.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                                                        lineNumber: 338,
                                                                        columnNumber: 96
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                                lineNumber: 338,
                                                                columnNumber: 19
                                                            }, this),
                                                            displayDepartTimes.map((dt, dtIdx)=>{
                                                                var _rec_ttl;
                                                                const rec = countsBy[dt.id] || {
                                                                    map: {},
                                                                    ttl: {}
                                                                };
                                                                const ttl = Number(((_rec_ttl = rec.ttl) === null || _rec_ttl === void 0 ? void 0 : _rec_ttl[r.id]) || 0);
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                    children: [
                                                                        plantsSorted.map((p)=>{
                                                                            var _rec_map_r_id, _rec_map;
                                                                            const pid = p.id;
                                                                            const val = Number(((_rec_map = rec.map) === null || _rec_map === void 0 ? void 0 : (_rec_map_r_id = _rec_map[r.id]) === null || _rec_map_r_id === void 0 ? void 0 : _rec_map_r_id[pid]) || 0);
                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    ...styles.tdCell,
                                                                                    background: getTimeBodyBg(dtIdx)
                                                                                },
                                                                                children: val > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    style: {
                                                                                        fontWeight: 700
                                                                                    },
                                                                                    children: [
                                                                                        val,
                                                                                        " "
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                                                                    lineNumber: 348,
                                                                                    columnNumber: 40
                                                                                }, this) : ''
                                                                            }, "cell-".concat(dt.id, "-").concat(r.id, "-").concat(pid), false, {
                                                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                                                lineNumber: 347,
                                                                                columnNumber: 29
                                                                            }, this);
                                                                        }),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            style: {
                                                                                ...styles.tdCell,
                                                                                background: getTimeTotalBg(dtIdx)
                                                                            },
                                                                            children: ttl > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontWeight: 800
                                                                                },
                                                                                children: [
                                                                                    ttl,
                                                                                    " "
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                                                lineNumber: 352,
                                                                                columnNumber: 128
                                                                            }, this) : ''
                                                                        }, "ttl-".concat(dt.id, "-").concat(r.id), false, {
                                                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                                                            lineNumber: 352,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            style: {
                                                                                ...styles.tdCell,
                                                                                cursor: isAdminga ? 'pointer' : 'default',
                                                                                background: getTimeCarBg(dtIdx)
                                                                            },
                                                                            onClick: ()=>openCarEdit(dt, r, ttl),
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontWeight: 900
                                                                                },
                                                                                children: (()=>{
                                                                                    var _carPlan_dt_id;
                                                                                    var _carPlan_dt_id_r_id;
                                                                                    const c = Number((_carPlan_dt_id_r_id = carPlan === null || carPlan === void 0 ? void 0 : (_carPlan_dt_id = carPlan[dt.id]) === null || _carPlan_dt_id === void 0 ? void 0 : _carPlan_dt_id[r.id]) !== null && _carPlan_dt_id_r_id !== void 0 ? _carPlan_dt_id_r_id : calcVehicles(ttl)) || 0;
                                                                                    return "".concat(c, " คัน");
                                                                                })()
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                                                lineNumber: 362,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        }, "car-".concat(dt.id, "-").concat(r.id), false, {
                                                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                                                            lineNumber: 353,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, "row-".concat(r.id, "-").concat(dt.id), true, {
                                                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                                                    lineNumber: 343,
                                                                    columnNumber: 23
                                                                }, this);
                                                            })
                                                        ]
                                                    }, r.id, true, {
                                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                                        lineNumber: 337,
                                                        columnNumber: 17
                                                    }, this)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.tdRouteTotal,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "รวม"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                                lineNumber: 374,
                                                                columnNumber: 49
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                                            lineNumber: 374,
                                                            columnNumber: 17
                                                        }, this),
                                                        displayDepartTimes.map((dt, dtIdx)=>{
                                                            var _rec_ttl;
                                                            const rec = countsBy[dt.id] || {
                                                                map: {},
                                                                ttl: {}
                                                            };
                                                            // Sum per plant across all routes
                                                            const plantTotals = plantsSorted.map((p)=>{
                                                                let sum = 0;
                                                                for (const r of routes){
                                                                    var _rec_map_r_id, _rec_map;
                                                                    sum += Number(((_rec_map = rec.map) === null || _rec_map === void 0 ? void 0 : (_rec_map_r_id = _rec_map[r.id]) === null || _rec_map_r_id === void 0 ? void 0 : _rec_map_r_id[p.id]) || 0);
                                                                }
                                                                return sum;
                                                            });
                                                            // Sum TTL across routes
                                                            let ttlTotal = 0;
                                                            for (const r of routes)ttlTotal += Number(((_rec_ttl = rec.ttl) === null || _rec_ttl === void 0 ? void 0 : _rec_ttl[r.id]) || 0);
                                                            // Sum vehicles (use override if exists, else derived from ttl)
                                                            let totalVehicles = 0;
                                                            for (const r of routes){
                                                                var _rec_ttl1, _carPlan_dt_id;
                                                                const rTtl = Number(((_rec_ttl1 = rec.ttl) === null || _rec_ttl1 === void 0 ? void 0 : _rec_ttl1[r.id]) || 0);
                                                                var _carPlan_dt_id_r_id;
                                                                const cars = Number((_carPlan_dt_id_r_id = carPlan === null || carPlan === void 0 ? void 0 : (_carPlan_dt_id = carPlan[dt.id]) === null || _carPlan_dt_id === void 0 ? void 0 : _carPlan_dt_id[r.id]) !== null && _carPlan_dt_id_r_id !== void 0 ? _carPlan_dt_id_r_id : calcVehicles(rTtl)) || 0;
                                                                totalVehicles += cars;
                                                            }
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    plantTotals.map((val, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            style: {
                                                                                ...styles.tdTotal,
                                                                                background: getTimeBodyBg(dtIdx)
                                                                            },
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: val > 0 ? val : ''
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                                                lineNumber: 398,
                                                                                columnNumber: 121
                                                                            }, this)
                                                                        }, "tot-".concat(dt.id, "-p-").concat(i), false, {
                                                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                                                            lineNumber: 398,
                                                                            columnNumber: 25
                                                                        }, this)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: {
                                                                            ...styles.tdTotal,
                                                                            background: getTimeTotalBg(dtIdx)
                                                                        },
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: ttlTotal > 0 ? ttlTotal : ''
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                                                            lineNumber: 400,
                                                                            columnNumber: 117
                                                                        }, this)
                                                                    }, "tot-".concat(dt.id, "-ttl"), false, {
                                                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                                                        lineNumber: 400,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: {
                                                                            ...styles.tdTotal,
                                                                            background: getTimeCarBg(dtIdx)
                                                                        },
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "".concat(totalVehicles, " คัน")
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                                                            lineNumber: 401,
                                                                            columnNumber: 116
                                                                        }, this)
                                                                    }, "tot-".concat(dt.id, "-cars"), false, {
                                                                        fileName: "[project]/src/app/truck-table/page.jsx",
                                                                        lineNumber: 401,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, "totals-".concat(dt.id), true, {
                                                                fileName: "[project]/src/app/truck-table/page.jsx",
                                                                lineNumber: 396,
                                                                columnNumber: 21
                                                            }, this);
                                                        })
                                                    ]
                                                }, "totals-row", true, {
                                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                                    lineNumber: 373,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                            lineNumber: 335,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                    lineNumber: 306,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/truck-table/page.jsx",
                                lineNumber: 305,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/truck-table/page.jsx",
                            lineNumber: 304,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/truck-table/page.jsx",
                    lineNumber: 279,
                    columnNumber: 9
                }, this),
                carModal.open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.overlay,
                            onClick: closeCarModal
                        }, void 0, false, {
                            fileName: "[project]/src/app/truck-table/page.jsx",
                            lineNumber: 414,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.modal,
                            onClick: (e)=>e.stopPropagation(),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: styles.modalTitle,
                                    children: "แก้ไขจำนวนรถ"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                    lineNumber: 417,
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
                                            children: (_carModal_route = carModal.route) === null || _carModal_route === void 0 ? void 0 : _carModal_route.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                            lineNumber: 419,
                                            columnNumber: 24
                                        }, this),
                                        " | ",
                                        Number((_carModal_dt = carModal.dt) === null || _carModal_dt === void 0 ? void 0 : _carModal_dt.is_entry) ? 'เวลาเข้า' : 'เวลาออก',
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: String((_carModal_dt1 = carModal.dt) === null || _carModal_dt1 === void 0 ? void 0 : _carModal_dt1.time).slice(0, 5)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                            lineNumber: 419,
                                            columnNumber: 122
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                    lineNumber: 418,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.modalFormGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: styles.modalLabel,
                                            children: "จำนวนรถ:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                            lineNumber: 422,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                            lineNumber: 423,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                    lineNumber: 421,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.modalButtonGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            style: styles.confirmButton,
                                            onClick: saveCarPlan,
                                            children: "บันทึก"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                            lineNumber: 431,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            style: styles.cancelButton,
                                            onClick: closeCarModal,
                                            children: "ยกเลิก"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/truck-table/page.jsx",
                                            lineNumber: 432,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/truck-table/page.jsx",
                                    lineNumber: 430,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/truck-table/page.jsx",
                            lineNumber: 415,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/truck-table/page.jsx",
            lineNumber: 261,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/truck-table/page.jsx",
        lineNumber: 257,
        columnNumber: 5
    }, this);
}
_s(TruckTable, "4G1tFHAsTAKr/FQgLPCRY1PPCU4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = TruckTable;
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
    return "#".concat(toHex(Math.min(255, Math.max(0, r)))).concat(toHex(Math.min(255, Math.max(0, g)))).concat(toHex(Math.min(255, Math.max(0, b))));
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
var _c;
__turbopack_context__.k.register(_c, "TruckTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_4bc53d71._.js.map