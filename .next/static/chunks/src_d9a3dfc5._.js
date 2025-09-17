(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/http.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Lightweight client-side fetch utilities with timeout, retries, and safe JSON parsing
// Usage: import { fetchJSON, postJSON } from '@/lib/http'
__turbopack_context__.s([
    "fetchJSON",
    ()=>fetchJSON,
    "postJSON",
    ()=>postJSON
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/dashboard/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardWeek
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// Weekly dashboard (จันทร์-เสาร์) แสดง 3 ช่วงเวลา: เช้า / บ่าย / เย็น
// ดึงข้อมูล products + bookings จาก API เดิม /api/products และ /api/bookings?date=YYYY-MM-DD ต่อวัน
// NOTE: ใช้โค้ดบางส่วนจากหน้า main page.js แต่สรุปให้ง่ายและอ่านง่ายขึ้น
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html2canvas$2f$dist$2f$html2canvas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/html2canvas/dist/html2canvas.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/http.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// Toggle meta UI (title, debug, note)
const SHOW_META = false;
// Mapping helpers
const PERIODS = [
    {
        key: "morning",
        label: "08:00 - 12:00",
        th: "เช้า"
    },
    {
        key: "afternoon",
        label: "13:00 - 17:00",
        th: "บ่าย"
    },
    {
        key: "evening",
        label: "18:00 - 20:00",
        th: "เย็น"
    }
];
// Truck -> period mapping (เพราะตาราง bookings ยังไม่มีคอลัมน์ period)
const TRUCK_PERIOD = {
    1: "morning",
    2: "morning",
    3: "afternoon",
    4: "afternoon",
    5: "evening",
    6: "evening"
};
// Utility: format date to yyyy-mm-dd (LOCAL time, ไม่ใช้ toISOString ป้องกัน timezone ลบวัน)
function fmt(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return "".concat(y, "-").concat(m, "-").concat(d);
}
// Find monday of the week for provided date (treat Sun as next day, week starts Mon)
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay(); // 0=Sun 1=Mon ... 6=Sat
    // If Sunday (0) -> go back 6 days; else go back (day-1)
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d; // Monday
}
// Produce array Monday..Saturday (6 days)
function buildWeekDays(anchor) {
    const start = getWeekStart(anchor);
    return Array.from({
        length: 6
    }, (_, i)=>{
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
    });
}
function DashboardWeek() {
    _s();
    const [anchorDate, setAnchorDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Date()); // any date inside desired week
    const [weekDays, setWeekDays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(buildWeekDays(new Date()));
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingProducts, setLoadingProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const PRODUCTS_POLL_MS = 5000; // poll every 5s
    const BOOKINGS_POLL_MS = 10000; // poll bookings every 10s
    const [bookingsByDate, setBookingsByDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({}); // { 'yyyy-mm-dd': [booking,...] }
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // public view: ไม่ต้อง login เพื่อดูยอดรวม
    // Load user/token from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardWeek.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const u = localStorage.getItem("user");
            if (u) setUser(JSON.parse(u));
        }
    }["DashboardWeek.useEffect"], []);
    // Rebuild week when anchor changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardWeek.useEffect": ()=>{
            setWeekDays(buildWeekDays(anchorDate));
        }
    }["DashboardWeek.useEffect"], [
        anchorDate
    ]);
    // Load products (public GET doesn't need token) + polling
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardWeek.useEffect": ()=>{
            let abort = false;
            async function loadProducts() {
                setLoadingProducts(true);
                try {
                    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])('/api/products', {}, {
                        cache: 'no-store'
                    });
                    if (!abort) setProducts(Array.isArray(data) ? data : []);
                } catch (e) {
                    if (!abort) setProducts([]);
                } finally{
                    if (!abort) setLoadingProducts(false);
                }
            }
            loadProducts();
            const id = setInterval(loadProducts, PRODUCTS_POLL_MS);
            return ({
                "DashboardWeek.useEffect": ()=>{
                    abort = true;
                    clearInterval(id);
                }
            })["DashboardWeek.useEffect"];
        }
    }["DashboardWeek.useEffect"], []);
    // Load bookings for each day in week
    const loadBookingsWeek = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DashboardWeek.useCallback[loadBookingsWeek]": async ()=>{
            const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("token") : "TURBOPACK unreachable"; // optional
            setLoading(true);
            const acc = {};
            await Promise.all(weekDays.map({
                "DashboardWeek.useCallback[loadBookingsWeek]": async (d)=>{
                    const dateStr = fmt(d);
                    try {
                        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJSON"])("/api/bookings?date=".concat(dateStr), {}, {
                            cache: 'no-store'
                        });
                        acc[dateStr] = Array.isArray(data) ? data : [];
                    } catch (e) {
                        console.error('โหลด bookings ล้มเหลว', dateStr, e);
                        acc[dateStr] = [];
                    }
                }
            }["DashboardWeek.useCallback[loadBookingsWeek]"]));
            setBookingsByDate(acc);
            setLoading(false);
        }
    }["DashboardWeek.useCallback[loadBookingsWeek]"], [
        weekDays
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardWeek.useEffect": ()=>{
            loadBookingsWeek();
            const id = setInterval({
                "DashboardWeek.useEffect.id": ()=>loadBookingsWeek()
            }["DashboardWeek.useEffect.id"], BOOKINGS_POLL_MS);
            return ({
                "DashboardWeek.useEffect": ()=>clearInterval(id)
            })["DashboardWeek.useEffect"];
        }
    }["DashboardWeek.useEffect"], [
        loadBookingsWeek
    ]);
    // reload เมื่อ user เปลี่ยน (optional)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardWeek.useEffect": ()=>{
            loadBookingsWeek();
        }
    }["DashboardWeek.useEffect"], [
        user,
        loadBookingsWeek
    ]);
    // Helper: count distinct trucks for a product within a period on a date
    function countProductPeriod(productId, dateStr, periodKey) {
        const list = (bookingsByDate[dateStr] || []).filter((b)=>b.product_id === productId && TRUCK_PERIOD[b.truck_number] === periodKey);
        return new Set(list.map((b)=>b.truck_number)).size; // distinct truck count
    }
    function nextWeek() {
        const d = new Date(anchorDate);
        d.setDate(d.getDate() + 7);
        setAnchorDate(d);
    }
    function prevWeek() {
        const d = new Date(anchorDate);
        d.setDate(d.getDate() - 7);
        setAnchorDate(d);
    }
    const handleSaveAsImage = ()=>{
        const element = document.getElementById("dashboard-week-content");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html2canvas$2f$dist$2f$html2canvas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(element).then((canvas)=>{
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = "dashboard-week.png";
            link.click();
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: 20
        },
        id: "dashboard-week-content",
        children: [
            SHOW_META && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        style: {
                            marginBottom: 10
                        },
                        children: "Weekly Dashboard (ทดลอง)"
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.jsx",
                        lineNumber: 160,
                        columnNumber: 6
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            marginBottom: 8,
                            color: '#444'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "โหลดแล้ว: ",
                                    Object.keys(bookingsByDate).length,
                                    " วัน"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.jsx",
                                lineNumber: 163,
                                columnNumber: 7
                            }, this),
                            ' | ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "ตัวอย่าง วันพุธ 27/08/2025 bookings: ",
                                    (bookingsByDate['2025-08-27'] || []).length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.jsx",
                                lineNumber: 164,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.jsx",
                        lineNumber: 162,
                        columnNumber: 6
                    }, this)
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: 10,
                            fontWeight: '600'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: prevWeek,
                                children: "◀ สัปดาห์ก่อน"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.jsx",
                                lineNumber: 170,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    "สัปดาห์ของวันที่ ",
                                    fmt(getWeekStart(anchorDate)),
                                    " - ",
                                    fmt(weekDays[weekDays.length - 1])
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.jsx",
                                lineNumber: 171,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: nextWeek,
                                children: "สัปดาห์ถัดไป ▶"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.jsx",
                                lineNumber: 174,
                                columnNumber: 6
                            }, this),
                            SHOW_META && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: loadBookingsWeek,
                                disabled: loading,
                                children: loading ? "กำลังโหลด..." : "รีเฟรช"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.jsx",
                                lineNumber: 176,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.jsx",
                        lineNumber: 169,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSaveAsImage,
                        style: {
                            padding: "8px 12px",
                            border: "none",
                            borderRadius: "8px",
                            backgroundColor: "#2ecc71",
                            color: "white",
                            fontWeight: "600",
                            cursor: "pointer"
                        },
                        children: "บันทึกเป็นรูปภาพ"
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.jsx",
                        lineNumber: 181,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/page.jsx",
                lineNumber: 168,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    overflowX: "auto"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    style: {
                        borderCollapse: "collapse",
                        width: "100%",
                        minWidth: 900
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            style: thStyle,
                                            rowSpan: 2,
                                            children: "ช่องที่"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.jsx",
                                            lineNumber: 201,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            style: thStyle,
                                            rowSpan: 2,
                                            children: "ประเภท"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.jsx",
                                            lineNumber: 202,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            style: thStyle,
                                            rowSpan: 2,
                                            children: "Vendor"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.jsx",
                                            lineNumber: 203,
                                            columnNumber: 8
                                        }, this),
                                        weekDays.map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    ...thStyle,
                                                    background: dayColor(i),
                                                    color: i === 0 ? '#000' : '#fff'
                                                },
                                                colSpan: PERIODS.length,
                                                children: d.toLocaleDateString('th-TH', {
                                                    weekday: 'long',
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })
                                            }, fmt(d), false, {
                                                fileName: "[project]/src/app/dashboard/page.jsx",
                                                lineNumber: 205,
                                                columnNumber: 9
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/page.jsx",
                                    lineNumber: 200,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: weekDays.map((d, i)=>PERIODS.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                style: {
                                                    ...thStyle,
                                                    background: dayColor(i),
                                                    color: i === 0 ? '#000' : '#fff'
                                                },
                                                children: p.th
                                            }, fmt(d) + p.key, false, {
                                                fileName: "[project]/src/app/dashboard/page.jsx",
                                                lineNumber: 213,
                                                columnNumber: 10
                                            }, this)))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.jsx",
                                    lineNumber: 210,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/page.jsx",
                            lineNumber: 199,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: [
                                products.map((prod, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                style: tdIndex,
                                                children: idx + 1
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.jsx",
                                                lineNumber: 221,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                style: tdMain,
                                                children: prod.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.jsx",
                                                lineNumber: 222,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                style: tdMain,
                                                children: prod.vendor
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.jsx",
                                                lineNumber: 223,
                                                columnNumber: 9
                                            }, this),
                                            weekDays.flatMap((d)=>PERIODS.map((p)=>{
                                                    const dateStr = fmt(d);
                                                    const cnt = countProductPeriod(prod.id, dateStr, p.key);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: tdCell,
                                                        children: cnt > 0 ? "".concat(cnt, " คัน") : '-'
                                                    }, prod.id + dateStr + p.key, false, {
                                                        fileName: "[project]/src/app/dashboard/page.jsx",
                                                        lineNumber: 229,
                                                        columnNumber: 12
                                                    }, this);
                                                }))
                                        ]
                                    }, prod.id, true, {
                                        fileName: "[project]/src/app/dashboard/page.jsx",
                                        lineNumber: 220,
                                        columnNumber: 8
                                    }, this)),
                                products.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        style: tdEmpty,
                                        colSpan: 3 + weekDays.length * PERIODS.length,
                                        children: loadingProducts ? 'กำลังโหลดสินค้า...' : 'ไม่มีสินค้า'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.jsx",
                                        lineNumber: 239,
                                        columnNumber: 9
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.jsx",
                                    lineNumber: 238,
                                    columnNumber: 8
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/page.jsx",
                            lineNumber: 218,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/dashboard/page.jsx",
                    lineNumber: 198,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.jsx",
                lineNumber: 197,
                columnNumber: 4
            }, this),
            SHOW_META && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    marginTop: 20,
                    fontSize: 12,
                    color: '#555'
                },
                children: [
                    "ดึงข้อมูลจริงแล้ว (poll ทุก ",
                    BOOKINGS_POLL_MS / 1000,
                    "s) และแยกช่วงเวลาแบบอนุมานจากหมายเลขรถ (1-2=เช้า,3-4=บ่าย,5-6=เย็น). หากจะให้แม่นยำควรเพิ่มคอลัมน์ period ในตาราง bookings."
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/page.jsx",
                lineNumber: 246,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/dashboard/page.jsx",
        lineNumber: 156,
        columnNumber: 3
    }, this);
}
_s(DashboardWeek, "l5DO7MMYndiBWhCZzYXZxHaSyy4=");
_c = DashboardWeek;
// ---- styles helpers ----
const thStyle = {
    padding: 8,
    background: '#083fc0ff',
    color: 'white',
    border: '1px solid #334155',
    fontSize: 12
};
const tdMain = {
    padding: 6,
    border: '1px solid #000',
    background: '#fafafa',
    fontSize: 12,
    whiteSpace: 'nowrap',
    fontWeight: '600'
};
const tdIndex = {
    ...tdMain,
    textAlign: 'center',
    width: 40
};
const tdCell = {
    padding: 4,
    border: '1px solid #000',
    textAlign: 'center',
    fontSize: 12,
    minWidth: 55,
    fontWeight: '600'
};
const tdEmpty = {
    padding: 20,
    textAlign: 'center',
    border: '1px solid #e5e7eb'
};
function periodColor(key) {
    switch(key){
        case 'morning':
            return '#1d4ed8';
        case 'afternoon':
            return '#10b981';
        case 'evening':
            return '#dc2626';
        default:
            return '#475569';
    }
}
// สีรายวันสำหรับ header + sub headers ให้สีเดียวกันทั้งวัน
function dayColor(index) {
    const palette = [
        '#FFFB0D',
        '#F562D6',
        '#02AE4E',
        '#F07D2E',
        '#00B0EF',
        '#7230A0'
    ];
    return palette[index % palette.length];
}
var _c;
__turbopack_context__.k.register(_c, "DashboardWeek");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_d9a3dfc5._.js.map