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
"[project]/src/app/vendor-costs/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VendorCostsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/formatters.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html2canvas$2f$dist$2f$html2canvas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/html2canvas/dist/html2canvas.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ymd(d) {
    // Build YYYY-MM-DD in local time to avoid UTC shift (which caused wrong weekend coloring)
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return "".concat(y, "-").concat(m, "-").concat(day);
}
function parseDate(s) {
    return new Date(s + "T00:00:00");
}
function addDays(d, n) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
}
function isWeekend(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    const w = d.getDay();
    return w === 0 || w === 6;
}
function fmtMoney(n) {
    const v = Number(n || 0);
    return v.toLocaleString('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
function fmtInt(n) {
    const v = Number(n || 0);
    return v.toLocaleString('en-US');
}
function VendorCostsPage() {
    var _edit_route;
    _s();
    // session
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [plants, setPlants] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [departments, setDepartments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VendorCostsPage.useEffect": ()=>{
            try {
                setToken(localStorage.getItem('token') || '');
                setUser(JSON.parse(localStorage.getItem('user') || 'null'));
            } catch (e) {}
        }
    }["VendorCostsPage.useEffect"], []);
    // Load minimal masters for greeting formatting
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VendorCostsPage.useEffect": ()=>{
            ({
                "VendorCostsPage.useEffect": async ()=>{
                    try {
                        const hdr = token ? {
                            Authorization: "Bearer ".concat(token)
                        } : {};
                        const [p, d] = await Promise.all([
                            fetch('/api/ot/plants', {
                                headers: hdr
                            }),
                            fetch('/api/ot/departments', {
                                headers: hdr
                            })
                        ]);
                        const [pr, dr] = await Promise.all([
                            p.json().catch({
                                "VendorCostsPage.useEffect": ()=>[]
                            }["VendorCostsPage.useEffect"]),
                            d.json().catch({
                                "VendorCostsPage.useEffect": ()=>[]
                            }["VendorCostsPage.useEffect"])
                        ]);
                        setPlants(Array.isArray(pr) ? pr : []);
                        setDepartments(Array.isArray(dr) ? dr : []);
                    } catch (e) {
                        setPlants([]);
                        setDepartments([]);
                    }
                }
            })["VendorCostsPage.useEffect"]();
        }
    }["VendorCostsPage.useEffect"], [
        token
    ]);
    const welcomeText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[welcomeText]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatters$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatWelcome"])(user, departments, plants)
    }["VendorCostsPage.useMemo[welcomeText]"], [
        user,
        departments,
        plants
    ]);
    const isAdminga = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[isAdminga]": ()=>{
            const name = String((user === null || user === void 0 ? void 0 : user.username) || '').toLowerCase();
            return name === 'adminga' || !!(user === null || user === void 0 ? void 0 : user.is_super_admin);
        }
    }["VendorCostsPage.useMemo[isAdminga]"], [
        user
    ]);
    // filter
    const today = new Date();
    const [startDate, setStartDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "VendorCostsPage.useState": ()=>{
            const d = new Date(today);
            d.setDate(d.getDate() - 29);
            return ymd(d);
        }
    }["VendorCostsPage.useState"]);
    const [endDate, setEndDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(ymd(today));
    const [routes, setRoutes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedRouteId, setSelectedRouteId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // data
    const [payments, setPayments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({}); // key `${date}|${route_id}` -> { pay_flat, ... }
    const [lockInfo, setLockInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        the_date: null,
        is_locked: 0
    });
    const [rates, setRates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        rate_flat: 0,
        rate_wait: 0,
        rate_ot_normal: 0,
        rate_trip: 0,
        rate_ot_holiday: 0,
        rate_trip_night: 0
    });
    // ui
    const [edit, setEdit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        open: false,
        date: null,
        route: null,
        value: ""
    });
    const [costEdit, setCostEdit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        open: false,
        key: null,
        label: '',
        value: ''
    });
    const tableRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // load routes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VendorCostsPage.useEffect": ()=>{
            ({
                "VendorCostsPage.useEffect": async ()=>{
                    const res = await fetch('/api/ot/routes');
                    const r = await res.json();
                    setRoutes(r || []);
                    if ((r === null || r === void 0 ? void 0 : r.length) && !selectedRouteId) setSelectedRouteId(r[0].id);
                }
            })["VendorCostsPage.useEffect"]();
        }
    }["VendorCostsPage.useEffect"], []);
    // build days in range
    const days = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[days]": ()=>{
            const s = parseDate(startDate), e = parseDate(endDate);
            const out = [];
            for(let d = new Date(s); d <= e; d = addDays(d, 1))out.push(ymd(d));
            return out;
        }
    }["VendorCostsPage.useMemo[days]"], [
        startDate,
        endDate
    ]);
    // load payments (call per day to avoid changing API)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VendorCostsPage.useEffect": ()=>{
            ({
                "VendorCostsPage.useEffect": async ()=>{
                    if (!startDate || !endDate || !selectedRouteId) return;
                    const dayList = days;
                    const results = await Promise.all(dayList.map({
                        "VendorCostsPage.useEffect": async (d)=>{
                            const res = await fetch("/api/vendor/payments?date=".concat(d));
                            try {
                                return await res.json();
                            } catch (e) {
                                return [];
                            }
                        }
                    }["VendorCostsPage.useEffect"]));
                    const map = {};
                    results.forEach({
                        "VendorCostsPage.useEffect": (rows, idx)=>{
                            const d = dayList[idx];
                            (rows || []).filter({
                                "VendorCostsPage.useEffect": (r)=>r.route_id === Number(selectedRouteId)
                            }["VendorCostsPage.useEffect"]).forEach({
                                "VendorCostsPage.useEffect": (row)=>{
                                    map["".concat(d, "|").concat(row.route_id)] = row;
                                }
                            }["VendorCostsPage.useEffect"]);
                        }
                    }["VendorCostsPage.useEffect"]);
                    setPayments(map);
                }
            })["VendorCostsPage.useEffect"]();
        }
    }["VendorCostsPage.useEffect"], [
        startDate,
        endDate,
        selectedRouteId,
        days.length
    ]);
    // lock load for endDate (like OT page)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VendorCostsPage.useEffect": ()=>{
            ({
                "VendorCostsPage.useEffect": async ()=>{
                    if (!endDate) return;
                    const res = await fetch("/api/ot/locks?date=".concat(endDate));
                    const data = await res.json();
                    setLockInfo(data || {
                        the_date: endDate,
                        is_locked: 0
                    });
                }
            })["VendorCostsPage.useEffect"]();
        }
    }["VendorCostsPage.useEffect"], [
        endDate
    ]);
    // load rate (Cost column) from DB via /api/vendor/rates per route (persistent across users)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VendorCostsPage.useEffect": ()=>{
            ({
                "VendorCostsPage.useEffect": async ()=>{
                    if (!selectedRouteId) return;
                    const defaults = {
                        rate_flat: 0,
                        rate_wait: 0,
                        rate_ot_normal: 0,
                        rate_trip: 0,
                        rate_ot_holiday: 0,
                        rate_trip_night: 0
                    };
                    try {
                        const res = await fetch("/api/vendor/rates?route_id=".concat(selectedRouteId));
                        const data = await res.json();
                        if (res.ok && data && typeof data === 'object') {
                            setRates({
                                rate_flat: Number(data.rate_flat || 0),
                                rate_wait: Number(data.rate_wait || 0),
                                rate_ot_normal: Number(data.rate_ot_normal || 0),
                                rate_trip: Number(data.rate_trip || 0),
                                rate_ot_holiday: Number(data.rate_ot_holiday || 0),
                                rate_trip_night: Number(data.rate_trip_night || 0)
                            });
                        } else {
                            setRates(defaults);
                        }
                    } catch (e) {
                        setRates(defaults);
                    }
                }
            })["VendorCostsPage.useEffect"]();
        }
    }["VendorCostsPage.useEffect"], [
        selectedRouteId
    ]);
    // actions
    function openCell(dateStr) {
        if ((lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) && !isAdminga) return;
        if (isWeekend(dateStr)) return;
        const route = routes.find((r)=>r.id === Number(selectedRouteId));
        const row = payments["".concat(dateStr, "|").concat(route === null || route === void 0 ? void 0 : route.id)] || {};
        var _row_pay_flat;
        setEdit({
            open: true,
            date: dateStr,
            route,
            value: String((_row_pay_flat = row.pay_flat) !== null && _row_pay_flat !== void 0 ? _row_pay_flat : 0)
        });
    }
    async function saveCell() {
        var _edit_route;
        if (!edit.open) return;
        const routeId = (_edit_route = edit.route) === null || _edit_route === void 0 ? void 0 : _edit_route.id;
        const val = Math.max(0, Number(edit.value) || 0);
        const body = {
            the_date: edit.date,
            route_id: routeId,
            key: 'pay_flat',
            value: val
        };
        const res = await fetch('/api/vendor/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...token ? {
                    Authorization: "Bearer ".concat(token)
                } : {}
            },
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            alert('บันทึกไม่สำเร็จ');
            return;
        }
        setPayments((prev)=>{
            const k = "".concat(edit.date, "|").concat(routeId);
            const row = {
                ...prev[k] || {},
                the_date: edit.date,
                route_id: routeId,
                pay_flat: val
            };
            return {
                ...prev,
                [k]: row
            };
        });
        setEdit({
            open: false,
            date: null,
            route: null,
            value: ""
        });
    }
    async function toggleLock(force) {
        const next = typeof force === 'boolean' ? force ? 1 : 0 : (lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) ? 0 : 1;
        setLockInfo((prev)=>({
                ...prev || {},
                the_date: endDate,
                is_locked: next
            }));
        const res = await fetch('/api/ot/locks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...token ? {
                    Authorization: "Bearer ".concat(token)
                } : {}
            },
            body: JSON.stringify({
                the_date: endDate,
                is_locked: next
            })
        });
        if (!res.ok) setLockInfo((prev)=>({
                ...prev || {},
                is_locked: next ? 0 : 1
            }));
    }
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }
    async function saveImage() {
        const el = document.getElementById('vendor-costs-card');
        if (!el) return;
        const canvas = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html2canvas$2f$dist$2f$html2canvas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(el);
        const a = document.createElement('a');
        a.download = "vendor-costs-".concat(endDate, ".png");
        a.href = canvas.toDataURL();
        a.click();
    }
    // Export the visible table as Excel (HTML .xls)
    function downloadExcel() {
        var _routes_find;
        const table = tableRef.current;
        if (!table) return;
        const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>'.concat(table.outerHTML, "</body></html>");
        const blob = new Blob([
            html
        ], {
            type: 'application/vnd.ms-excel;charset=utf-8;'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const routeName = (((_routes_find = routes.find((r)=>r.id === Number(selectedRouteId))) === null || _routes_find === void 0 ? void 0 : _routes_find.name) || 'all').replace(/\s+/g, '_');
        a.download = "vendor-costs-".concat(startDate, "-to-").concat(endDate, "-").concat(routeName, ".xls");
        a.href = url;
        a.click();
        URL.revokeObjectURL(url);
    }
    // edit Cost (rates)
    function openCostEdit(key, label) {
        if ((lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) && !isAdminga) return;
        const mapKeyToRate = {
            pay_flat: 'rate_flat',
            pay_wait: 'rate_wait',
            pay_ot_normal: 'rate_ot_normal',
            pay_trip: 'rate_trip',
            pay_ot_holiday: 'rate_ot_holiday',
            pay_trip_night: 'rate_trip_night'
        };
        const rateKey = mapKeyToRate[key];
        var _rates_rateKey;
        const current = (_rates_rateKey = rates[rateKey]) !== null && _rates_rateKey !== void 0 ? _rates_rateKey : 0;
        setCostEdit({
            open: true,
            key,
            label,
            value: String(current)
        });
    }
    async function saveCostEdit() {
        if (!costEdit.open || !selectedRouteId) return;
        const value = Math.max(0, Number(costEdit.value) || 0);
        const mapKeyToRate = {
            pay_flat: 'rate_flat',
            pay_wait: 'rate_wait',
            pay_ot_normal: 'rate_ot_normal',
            pay_trip: 'rate_trip',
            pay_ot_holiday: 'rate_ot_holiday',
            pay_trip_night: 'rate_trip_night'
        };
        const rateKey = mapKeyToRate[costEdit.key];
        const updated = {
            ...rates,
            [rateKey]: value
        };
        setRates(updated);
        // persist to DB via vendor/rates API (requires admin/super admin)
        try {
            const res = await fetch('/api/vendor/rates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...token ? {
                        Authorization: "Bearer ".concat(token)
                    } : {}
                },
                body: JSON.stringify({
                    route_id: Number(selectedRouteId),
                    values: updated
                })
            });
            if (!res.ok) {
                const err = await res.json().catch(()=>({}));
                alert(String((err === null || err === void 0 ? void 0 : err.error) || 'บันทึกไม่สำเร็จ'));
            }
        } catch (e) {
            alert('บันทึกไม่สำเร็จ');
        }
        setCostEdit({
            open: false,
            key: null,
            label: '',
            value: ''
        });
    }
    // derived
    const selectedRoute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[selectedRoute]": ()=>routes.find({
                "VendorCostsPage.useMemo[selectedRoute]": (r)=>r.id === Number(selectedRouteId)
            }["VendorCostsPage.useMemo[selectedRoute]"]) || null
    }["VendorCostsPage.useMemo[selectedRoute]"], [
        routes,
        selectedRouteId
    ]);
    // Sum numbers in all selected days (รวมวันหยุดด้วย)
    const sumByKey = (key)=>days.reduce((sum, d)=>{
            var _payments_k;
            const k = "".concat(d, "|").concat(selectedRouteId);
            const v = Number(((_payments_k = payments[k]) === null || _payments_k === void 0 ? void 0 : _payments_k[key]) || 0);
            return sum + (isFinite(v) ? v : 0);
        }, 0);
    // Per-type sums across the selected range
    const sumFlat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[sumFlat]": ()=>sumByKey('pay_flat')
    }["VendorCostsPage.useMemo[sumFlat]"], [
        days,
        payments,
        selectedRouteId
    ]);
    const sumWait = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[sumWait]": ()=>sumByKey('pay_wait')
    }["VendorCostsPage.useMemo[sumWait]"], [
        days,
        payments,
        selectedRouteId
    ]);
    const sumOtn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[sumOtn]": ()=>sumByKey('pay_ot_normal')
    }["VendorCostsPage.useMemo[sumOtn]"], [
        days,
        payments,
        selectedRouteId
    ]);
    const sumTrip = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[sumTrip]": ()=>sumByKey('pay_trip')
    }["VendorCostsPage.useMemo[sumTrip]"], [
        days,
        payments,
        selectedRouteId
    ]);
    const sumOth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[sumOth]": ()=>sumByKey('pay_ot_holiday')
    }["VendorCostsPage.useMemo[sumOth]"], [
        days,
        payments,
        selectedRouteId
    ]);
    const sumTripN = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[sumTripN]": ()=>sumByKey('pay_trip_night')
    }["VendorCostsPage.useMemo[sumTripN]"], [
        days,
        payments,
        selectedRouteId
    ]);
    // ค่าในวันสุดท้ายของช่วง (ใช้เป็น "ผลรวม" ของแถวรายเดือน)
    const lastValueByKey = (key)=>{
        var _payments_k;
        const k = "".concat(endDate, "|").concat(selectedRouteId);
        const v = Number(((_payments_k = payments[k]) === null || _payments_k === void 0 ? void 0 : _payments_k[key]) || 0);
        return isFinite(v) ? v : 0;
    };
    const lastFlat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[lastFlat]": ()=>lastValueByKey('pay_flat')
    }["VendorCostsPage.useMemo[lastFlat]"], [
        endDate,
        selectedRouteId,
        payments
    ]);
    const lastWait = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[lastWait]": ()=>lastValueByKey('pay_wait')
    }["VendorCostsPage.useMemo[lastWait]"], [
        endDate,
        selectedRouteId,
        payments
    ]);
    const lastOtn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[lastOtn]": ()=>lastValueByKey('pay_ot_normal')
    }["VendorCostsPage.useMemo[lastOtn]"], [
        endDate,
        selectedRouteId,
        payments
    ]);
    const lastTrip = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[lastTrip]": ()=>lastValueByKey('pay_trip')
    }["VendorCostsPage.useMemo[lastTrip]"], [
        endDate,
        selectedRouteId,
        payments
    ]);
    const lastOth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[lastOth]": ()=>lastValueByKey('pay_ot_holiday')
    }["VendorCostsPage.useMemo[lastOth]"], [
        endDate,
        selectedRouteId,
        payments
    ]);
    const lastTripN = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[lastTripN]": ()=>lastValueByKey('pay_trip_night')
    }["VendorCostsPage.useMemo[lastTripN]"], [
        endDate,
        selectedRouteId,
        payments
    ]);
    // Per-type totals = อัตรา (Cost) x "ผลรวม" ของแถว
    // - แถวรายเดือน: ผลรวม = ค่าของวันสุดท้าย (lastFlat)
    // - แถวอื่น: ผลรวม = ผลรวมทั้งช่วง (sum*)
    const totalFlatByRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[totalFlatByRange]": ()=>Number(rates.rate_flat || 0) * (lastFlat || 0)
    }["VendorCostsPage.useMemo[totalFlatByRange]"], [
        rates.rate_flat,
        lastFlat
    ]);
    const totalWaitByRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[totalWaitByRange]": ()=>Number(rates.rate_wait || 0) * (sumWait || 0)
    }["VendorCostsPage.useMemo[totalWaitByRange]"], [
        rates.rate_wait,
        sumWait
    ]);
    const totalOtnByRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[totalOtnByRange]": ()=>Number(rates.rate_ot_normal || 0) * (sumOtn || 0)
    }["VendorCostsPage.useMemo[totalOtnByRange]"], [
        rates.rate_ot_normal,
        sumOtn
    ]);
    const totalTripByRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[totalTripByRange]": ()=>Number(rates.rate_trip || 0) * (sumTrip || 0)
    }["VendorCostsPage.useMemo[totalTripByRange]"], [
        rates.rate_trip,
        sumTrip
    ]);
    const totalOthByRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[totalOthByRange]": ()=>Number(rates.rate_ot_holiday || 0) * (sumOth || 0)
    }["VendorCostsPage.useMemo[totalOthByRange]"], [
        rates.rate_ot_holiday,
        sumOth
    ]);
    const totalTripNByRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[totalTripNByRange]": ()=>Number(rates.rate_trip_night || 0) * (sumTripN || 0)
    }["VendorCostsPage.useMemo[totalTripNByRange]"], [
        rates.rate_trip_night,
        sumTripN
    ]);
    const grandTotalByRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[grandTotalByRange]": ()=>(totalFlatByRange || 0) + (totalWaitByRange || 0) + (totalOtnByRange || 0) + (totalTripByRange || 0) + (totalOthByRange || 0) + (totalTripNByRange || 0)
    }["VendorCostsPage.useMemo[grandTotalByRange]"], [
        totalFlatByRange,
        totalWaitByRange,
        totalOtnByRange,
        totalTripByRange,
        totalOthByRange,
        totalTripNByRange
    ]);
    // Bottom total for the "ผลรวม" column
    // ใช้ lastFlat สำหรับแถวรายเดือน และใช้ผลรวมช่วงสำหรับแถวอื่น
    const grandSumCounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VendorCostsPage.useMemo[grandSumCounts]": ()=>(lastFlat || 0) + (sumWait || 0) + (sumOtn || 0) + (sumTrip || 0) + (sumOth || 0) + (sumTripN || 0)
    }["VendorCostsPage.useMemo[grandSumCounts]"], [
        lastFlat,
        sumWait,
        sumOtn,
        sumTrip,
        sumOth,
        sumTripN
    ]);
    // styles
    const styles = {
        page: {
            padding: 20,
            background: '#e9f0f6',
            minHeight: '100vh'
        },
        card: {
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            padding: 16
        },
        headerRow: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        title: {
            margin: 0,
            color: '#16364e'
        },
        logout: {
            background: '#e74c3c',
            color: '#fff',
            padding: '10px 16px',
            border: 'none',
            borderRadius: 12,
            fontWeight: 800,
            cursor: 'pointer'
        },
        controls: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
            marginTop: 14
        },
        label: {
            fontWeight: 800,
            color: '#16364e'
        },
        input: {
            padding: '10px 12px',
            border: '1px solid #cfd8e3',
            borderRadius: 10
        },
        select: {
            padding: '10px 12px',
            border: '1px solid #cfd8e3',
            borderRadius: 10
        },
        action: {
            padding: '10px 12px',
            background: '#6c7a89',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontWeight: 700,
            cursor: 'pointer'
        },
        tableWrap: {
            overflowX: 'auto',
            marginTop: 14,
            border: '1px solid #d4e0ec',
            borderRadius: 12,
            ...(lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) ? {
                opacity: 0.5,
                pointerEvents: 'none',
                filter: 'grayscale(0.6)'
            } : {}
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        th: {
            background: '#17344f',
            color: '#fff',
            padding: '8px 10px',
            borderRight: '1px solid #113045',
            whiteSpace: 'nowrap'
        },
        td: {
            borderTop: '1px solid #e1e8f0',
            borderRight: '1px solid #eef2f6',
            padding: '10px',
            background: '#fff'
        },
        dayHead: {
            width: 40,
            minWidth: 40,
            textAlign: 'center',
            fontWeight: 800,
            fontSize: 12,
            padding: '4px 0'
        },
        dayCell: {
            width: 40,
            minWidth: 40,
            textAlign: 'center',
            fontWeight: 800,
            cursor: 'default',
            verticalAlign: 'middle',
            padding: '2px 3px',
            whiteSpace: 'nowrap',
            wordBreak: 'normal',
            lineHeight: 1.1
        },
        weekendHead: {
            background: '#ff4d4d'
        },
        weekdayHead: {
            background: '#34b3ff'
        },
        weekdayCell: {
            background: '#e8f6ff',
            color: '#0f2a40'
        },
        weekendCell: {
            background: '#ff4d4d',
            color: '#fff',
            cursor: 'not-allowed'
        },
        rotateNum: {
            position: 'static',
            transform: 'none',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            fontSize: 12,
            lineHeight: 1.1,
            zIndex: 1,
            pointerEvents: 'none',
            maxWidth: '100%',
            textAlign: 'center'
        },
        footer: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
            marginTop: 16
        },
        approve: {
            background: '#2ecc71',
            color: '#fff',
            border: 'none',
            padding: '12px 18px',
            borderRadius: 10,
            fontWeight: 800,
            cursor: 'pointer'
        },
        reject: {
            background: '#e67e22',
            color: '#fff',
            border: 'none',
            padding: '12px 18px',
            borderRadius: 10,
            fontWeight: 800,
            cursor: 'pointer'
        },
        overlay: {
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)'
        },
        modal: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            background: '#fff',
            padding: 30,
            borderRadius: 12,
            width: '90%',
            maxWidth: 420,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        },
        modalTitle: {
            margin: '0 0 12px 0',
            color: '#17344f',
            fontSize: 22,
            fontWeight: 600,
            textAlign: 'center'
        },
        modalInput: {
            width: '100%',
            padding: '10px',
            border: '1px solid #cfd8e3',
            borderRadius: 8
        },
        modalBtns: {
            display: 'flex',
            gap: 10,
            marginTop: 12,
            justifyContent: 'flex-end'
        },
        cancelGray: {
            background: '#ffffff',
            color: '#7f8c8d',
            border: '1px solid #bdc3c7',
            padding: '12px 18px',
            borderRadius: 10,
            fontWeight: 700,
            cursor: 'pointer'
        }
    };
    const todayStr = new Date().toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: styles.page,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "vendor-costs-card",
                style: styles.card,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.headerRow,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        style: styles.title,
                                        children: "คำนวณค่าใช้จ่าย"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                                        lineNumber: 254,
                                        columnNumber: 13
                                    }, this),
                                    user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: '#2f3e4f',
                                            fontWeight: 600
                                        },
                                        children: [
                                            "ยินดีต้อนรับ, ",
                                            welcomeText
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                                        lineNumber: 255,
                                        columnNumber: 22
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 253,
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
                                        children: todayStr
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                                        lineNumber: 258,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            window.location.href = '/';
                                        },
                                        style: {
                                            ...styles.logout,
                                            background: '#34495e'
                                        },
                                        children: "กลับเมนูหลัก"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                                        lineNumber: 259,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: logout,
                                        style: styles.logout,
                                        children: "ออกจากระบบ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                                        lineNumber: 260,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 257,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                        lineNumber: 252,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.controls,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: styles.label,
                                children: "เลือกวันที่:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 265,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "date",
                                value: startDate,
                                onChange: (e)=>setStartDate(e.target.value),
                                style: styles.input
                            }, void 0, false, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 266,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: styles.label,
                                children: "ถึงวันที่:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 267,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "date",
                                value: endDate,
                                onChange: (e)=>setEndDate(e.target.value),
                                style: styles.input
                            }, void 0, false, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 268,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: styles.label,
                                children: "สายรถ:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 269,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: selectedRouteId || '',
                                onChange: (e)=>setSelectedRouteId(Number(e.target.value) || null),
                                style: styles.select,
                                children: routes.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: r.id,
                                        children: r.name
                                    }, r.id, false, {
                                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                                        lineNumber: 271,
                                        columnNumber: 29
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 270,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: saveImage,
                                style: {
                                    ...styles.action,
                                    background: '#34495e'
                                },
                                children: "บันทึกรูปภาพ"
                            }, void 0, false, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 273,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: downloadExcel,
                                style: {
                                    ...styles.action,
                                    background: '#2e7d32'
                                },
                                children: "ดาวน์โหลด Excel"
                            }, void 0, false, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 274,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                        lineNumber: 264,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.tableWrap,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            ref: tableRef,
                            style: styles.table,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    ...styles.th,
                                                    width: 240
                                                },
                                                children: "สายรถ"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                lineNumber: 281,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    ...styles.th,
                                                    width: 120
                                                },
                                                children: "Vendor"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                lineNumber: 282,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    ...styles.th,
                                                    width: 160
                                                },
                                                children: "Bus cost type"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                lineNumber: 283,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    ...styles.th,
                                                    width: 120
                                                },
                                                children: "Cost"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                lineNumber: 284,
                                                columnNumber: 17
                                            }, this),
                                            days.map((d)=>{
                                                const num = parseDate(d).getDate();
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    style: {
                                                        ...styles.th,
                                                        ...styles.dayHead,
                                                        ...isWeekend(d) ? styles.weekendHead : styles.weekdayHead
                                                    },
                                                    children: num
                                                }, d, false, {
                                                    fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                    lineNumber: 288,
                                                    columnNumber: 21
                                                }, this);
                                            }),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    ...styles.th,
                                                    width: 120
                                                },
                                                children: "ผลรวม"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                lineNumber: 293,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    ...styles.th,
                                                    width: 140
                                                },
                                                children: "Total cost"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                lineNumber: 294,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                                        lineNumber: 280,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vendor-costs/page.jsx",
                                    lineNumber: 279,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: selectedRouteId && (()=>{
                                        const r = routes.find((x)=>x.id === Number(selectedRouteId));
                                        const vendorName = (r === null || r === void 0 ? void 0 : r.vendor) || '';
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                whiteSpace: 'nowrap'
                                                            },
                                                            children: r === null || r === void 0 ? void 0 : r.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 305,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.td,
                                                            children: vendorName
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 306,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.td,
                                                            children: "รายเดือน"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 307,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                cursor: (lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) && !isAdminga ? 'default' : 'pointer'
                                                            },
                                                            title: "คลิกเพื่อแก้ไข",
                                                            onClick: ()=>openCostEdit('pay_flat', 'รายเดือน'),
                                                            children: fmtMoney(rates.rate_flat)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 308,
                                                            columnNumber: 23
                                                        }, this),
                                                        days.map((d)=>{
                                                            var _payments_k;
                                                            const k = "".concat(d, "|").concat(selectedRouteId);
                                                            const v = ((_payments_k = payments[k]) === null || _payments_k === void 0 ? void 0 : _payments_k.pay_flat) || 0;
                                                            const cellStyle = {
                                                                ...styles.td,
                                                                ...styles.dayCell
                                                            };
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: cellStyle,
                                                                children: v ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: styles.rotateNum,
                                                                    children: fmtInt(v)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                                    lineNumber: 314,
                                                                    columnNumber: 34
                                                                }, this) : ''
                                                            }, "flat-".concat(d), false, {
                                                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                                lineNumber: 313,
                                                                columnNumber: 27
                                                            }, this);
                                                        }),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                fontWeight: 900
                                                            },
                                                            children: fmtInt(lastFlat)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 319,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                fontWeight: 900
                                                            },
                                                            children: fmtMoney(totalFlatByRange)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 320,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                    lineNumber: 304,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                whiteSpace: 'nowrap'
                                                            },
                                                            children: r === null || r === void 0 ? void 0 : r.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 325,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.td,
                                                            children: vendorName
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 326,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.td,
                                                            children: "จอดรอ"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 327,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                cursor: (lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) && !isAdminga ? 'default' : 'pointer'
                                                            },
                                                            title: "คลิกเพื่อแก้ไข",
                                                            onClick: ()=>openCostEdit('pay_wait', 'จอดรอ'),
                                                            children: fmtMoney(rates.rate_wait)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 328,
                                                            columnNumber: 23
                                                        }, this),
                                                        days.map((d)=>{
                                                            var _payments_k;
                                                            const k = "".concat(d, "|").concat(selectedRouteId);
                                                            const v = ((_payments_k = payments[k]) === null || _payments_k === void 0 ? void 0 : _payments_k.pay_wait) || 0;
                                                            const cellStyle = {
                                                                ...styles.td,
                                                                ...styles.dayCell
                                                            };
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: cellStyle,
                                                                children: v ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: styles.rotateNum,
                                                                    children: fmtInt(v)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                                    lineNumber: 333,
                                                                    columnNumber: 72
                                                                }, this) : ''
                                                            }, "wait-".concat(d), false, {
                                                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                                lineNumber: 333,
                                                                columnNumber: 27
                                                            }, this);
                                                        }),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                fontWeight: 900
                                                            },
                                                            children: fmtInt(sumWait)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 336,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                fontWeight: 900
                                                            },
                                                            children: fmtMoney(totalWaitByRange)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 337,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                    lineNumber: 324,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                whiteSpace: 'nowrap'
                                                            },
                                                            children: r === null || r === void 0 ? void 0 : r.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 341,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.td,
                                                            children: vendorName
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 342,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.td,
                                                            children: "OT เหมาวัน"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 343,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                cursor: (lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) && !isAdminga ? 'default' : 'pointer'
                                                            },
                                                            title: "คลิกเพื่อแก้ไข",
                                                            onClick: ()=>openCostEdit('pay_ot_normal', 'OT เหมาวัน'),
                                                            children: fmtMoney(rates.rate_ot_normal)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 344,
                                                            columnNumber: 23
                                                        }, this),
                                                        days.map((d)=>{
                                                            var _payments_k;
                                                            const k = "".concat(d, "|").concat(selectedRouteId);
                                                            const v = ((_payments_k = payments[k]) === null || _payments_k === void 0 ? void 0 : _payments_k.pay_ot_normal) || 0;
                                                            const cellStyle = {
                                                                ...styles.td,
                                                                ...styles.dayCell
                                                            };
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: cellStyle,
                                                                children: v ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: styles.rotateNum,
                                                                    children: fmtInt(v)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                                    lineNumber: 349,
                                                                    columnNumber: 71
                                                                }, this) : ''
                                                            }, "otn-".concat(d), false, {
                                                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                                lineNumber: 349,
                                                                columnNumber: 27
                                                            }, this);
                                                        }),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                fontWeight: 900
                                                            },
                                                            children: fmtInt(sumOtn)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 352,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                fontWeight: 900
                                                            },
                                                            children: fmtMoney(totalOtnByRange)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 353,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                    lineNumber: 340,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                whiteSpace: 'nowrap'
                                                            },
                                                            children: r === null || r === void 0 ? void 0 : r.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 357,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.td,
                                                            children: vendorName
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 358,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.td,
                                                            children: "เหมาเที่ยว"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 359,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                cursor: (lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) && !isAdminga ? 'default' : 'pointer'
                                                            },
                                                            title: "คลิกเพื่อแก้ไข",
                                                            onClick: ()=>openCostEdit('pay_trip', 'เหมาเที่ยว'),
                                                            children: fmtMoney(rates.rate_trip)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 360,
                                                            columnNumber: 23
                                                        }, this),
                                                        days.map((d)=>{
                                                            var _payments_k;
                                                            const k = "".concat(d, "|").concat(selectedRouteId);
                                                            const v = ((_payments_k = payments[k]) === null || _payments_k === void 0 ? void 0 : _payments_k.pay_trip) || 0;
                                                            const cellStyle = {
                                                                ...styles.td,
                                                                ...styles.dayCell
                                                            };
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: cellStyle,
                                                                children: v ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: styles.rotateNum,
                                                                    children: fmtInt(v)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                                    lineNumber: 365,
                                                                    columnNumber: 72
                                                                }, this) : ''
                                                            }, "trip-".concat(d), false, {
                                                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                                lineNumber: 365,
                                                                columnNumber: 27
                                                            }, this);
                                                        }),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                fontWeight: 900
                                                            },
                                                            children: fmtInt(sumTrip)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 368,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                fontWeight: 900
                                                            },
                                                            children: fmtMoney(totalTripByRange)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 369,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                    lineNumber: 356,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                whiteSpace: 'nowrap'
                                                            },
                                                            children: r === null || r === void 0 ? void 0 : r.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 373,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.td,
                                                            children: vendorName
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 374,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.td,
                                                            children: "OT เหมาวันหยุด"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 375,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                cursor: (lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) && !isAdminga ? 'default' : 'pointer'
                                                            },
                                                            title: "คลิกเพื่อแก้ไข",
                                                            onClick: ()=>openCostEdit('pay_ot_holiday', 'OT เหมาวันหยุด'),
                                                            children: fmtMoney(rates.rate_ot_holiday)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 376,
                                                            columnNumber: 23
                                                        }, this),
                                                        days.map((d)=>{
                                                            var _payments_k;
                                                            const k = "".concat(d, "|").concat(selectedRouteId);
                                                            const v = ((_payments_k = payments[k]) === null || _payments_k === void 0 ? void 0 : _payments_k.pay_ot_holiday) || 0;
                                                            const cellStyle = {
                                                                ...styles.td,
                                                                ...styles.dayCell
                                                            };
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: cellStyle,
                                                                children: v ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: styles.rotateNum,
                                                                    children: fmtInt(v)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                                    lineNumber: 381,
                                                                    columnNumber: 71
                                                                }, this) : ''
                                                            }, "oth-".concat(d), false, {
                                                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                                lineNumber: 381,
                                                                columnNumber: 27
                                                            }, this);
                                                        }),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                fontWeight: 900
                                                            },
                                                            children: fmtInt(sumOth)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 384,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                fontWeight: 900
                                                            },
                                                            children: fmtMoney(totalOthByRange)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 385,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                    lineNumber: 372,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                whiteSpace: 'nowrap'
                                                            },
                                                            children: r === null || r === void 0 ? void 0 : r.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 389,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.td,
                                                            children: vendorName
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 390,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.td,
                                                            children: "เหมาเที่ยวกะดึก"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 391,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                cursor: (lockInfo === null || lockInfo === void 0 ? void 0 : lockInfo.is_locked) && !isAdminga ? 'default' : 'pointer'
                                                            },
                                                            title: "คลิกเพื่อแก้ไข",
                                                            onClick: ()=>openCostEdit('pay_trip_night', 'เหมาเที่ยวกะดึก'),
                                                            children: fmtMoney(rates.rate_trip_night)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 392,
                                                            columnNumber: 23
                                                        }, this),
                                                        days.map((d)=>{
                                                            var _payments_k;
                                                            const k = "".concat(d, "|").concat(selectedRouteId);
                                                            const v = ((_payments_k = payments[k]) === null || _payments_k === void 0 ? void 0 : _payments_k.pay_trip_night) || 0;
                                                            const cellStyle = {
                                                                ...styles.td,
                                                                ...styles.dayCell
                                                            };
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: cellStyle,
                                                                children: v ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: styles.rotateNum,
                                                                    children: fmtInt(v)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                                    lineNumber: 397,
                                                                    columnNumber: 73
                                                                }, this) : ''
                                                            }, "tripn-".concat(d), false, {
                                                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                                lineNumber: 397,
                                                                columnNumber: 27
                                                            }, this);
                                                        }),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                fontWeight: 900
                                                            },
                                                            children: fmtInt(sumTripN)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 400,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                fontWeight: 900
                                                            },
                                                            children: fmtMoney(totalTripNByRange)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 401,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                    lineNumber: 388,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: styles.td,
                                                            colSpan: days.length + 4
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 406,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                fontWeight: 900
                                                            },
                                                            children: fmtInt(grandSumCounts)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 407,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                ...styles.td,
                                                                textAlign: 'right',
                                                                fontWeight: 900
                                                            },
                                                            children: fmtMoney(grandTotalByRange)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                            lineNumber: 408,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/vendor-costs/page.jsx",
                                                    lineNumber: 405,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true);
                                    })()
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vendor-costs/page.jsx",
                                    lineNumber: 297,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vendor-costs/page.jsx",
                            lineNumber: 278,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                        lineNumber: 277,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.footer,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>toggleLock(true),
                                style: styles.approve,
                                children: "บันทึกข้อมูล"
                            }, void 0, false, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 418,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>toggleLock(false),
                                style: styles.cancelGray,
                                children: "ยกเลิก"
                            }, void 0, false, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 419,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                        lineNumber: 417,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/vendor-costs/page.jsx",
                lineNumber: 251,
                columnNumber: 7
            }, this),
            edit.open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.overlay,
                        onClick: ()=>setEdit({
                                open: false,
                                date: null,
                                route: null,
                                value: ''
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                        lineNumber: 425,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.modal,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: styles.modalTitle,
                                children: [
                                    "แก้ไขจำนวน (รายเดือน) ",
                                    (_edit_route = edit.route) === null || _edit_route === void 0 ? void 0 : _edit_route.name,
                                    " - ",
                                    edit.date
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 427,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                min: 0,
                                value: edit.value,
                                onChange: (e)=>setEdit((prev)=>({
                                            ...prev,
                                            value: e.target.value.replace(/[^0-9]/g, '')
                                        })),
                                style: styles.modalInput,
                                onKeyDown: (e)=>{
                                    if (e.key === 'Enter') saveCell();
                                },
                                autoFocus: true
                            }, void 0, false, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 428,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.modalBtns,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: saveCell,
                                        style: {
                                            ...styles.approve,
                                            padding: '8px 14px'
                                        },
                                        children: "บันทึก"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                                        lineNumber: 430,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setEdit({
                                                open: false,
                                                date: null,
                                                route: null,
                                                value: ''
                                            }),
                                        style: {
                                            ...styles.reject,
                                            padding: '8px 14px'
                                        },
                                        children: "ยกเลิก"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                                        lineNumber: 431,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 429,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                        lineNumber: 426,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            costEdit.open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.overlay,
                        onClick: ()=>setCostEdit({
                                open: false,
                                key: null,
                                label: '',
                                value: ''
                            })
                    }, void 0, false, {
                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                        lineNumber: 439,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.modal,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: styles.modalTitle,
                                children: [
                                    "แก้ไข Cost (",
                                    costEdit.label,
                                    ") ",
                                    (selectedRoute === null || selectedRoute === void 0 ? void 0 : selectedRoute.name) ? "- ".concat(selectedRoute.name) : ''
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 441,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 6,
                                    color: '#34495e',
                                    fontWeight: 500
                                },
                                children: "จำนวน:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 442,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                step: "0.01",
                                min: 0,
                                value: costEdit.value,
                                onChange: (e)=>{
                                    const raw = e.target.value.replace(/[^0-9.]/g, '');
                                    const parts = raw.split('.');
                                    const safe = parts.length > 2 ? "".concat(parts[0], ".").concat(parts.slice(1).join('')) : raw; // keep only first dot
                                    setCostEdit((prev)=>({
                                            ...prev,
                                            value: safe
                                        }));
                                },
                                style: styles.modalInput,
                                onKeyDown: (e)=>{
                                    if (e.key === 'Enter') saveCostEdit();
                                },
                                autoFocus: true
                            }, void 0, false, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 443,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.modalBtns,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: saveCostEdit,
                                        style: {
                                            ...styles.approve,
                                            padding: '8px 14px'
                                        },
                                        children: "บันทึก"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                                        lineNumber: 455,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setCostEdit({
                                                open: false,
                                                key: null,
                                                label: '',
                                                value: ''
                                            }),
                                        style: {
                                            ...styles.cancelGray,
                                            padding: '8px 14px'
                                        },
                                        children: "ยกเลิก"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                                        lineNumber: 456,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/vendor-costs/page.jsx",
                                lineNumber: 454,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vendor-costs/page.jsx",
                        lineNumber: 440,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/vendor-costs/page.jsx",
        lineNumber: 250,
        columnNumber: 5
    }, this);
}
_s(VendorCostsPage, "F7dsWhVvjfdZsgyCNprpZiDQjmU=");
_c = VendorCostsPage;
var _c;
__turbopack_context__.k.register(_c, "VendorCostsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_9e080621._.js.map