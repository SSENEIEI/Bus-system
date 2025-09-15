"use client";

// Weekly dashboard (จันทร์-เสาร์) แสดง 3 ช่วงเวลา: เช้า / บ่าย / เย็น
// ดึงข้อมูล products + bookings จาก API เดิม /api/products และ /api/bookings?date=YYYY-MM-DD ต่อวัน
// NOTE: ใช้โค้ดบางส่วนจากหน้า main page.js แต่สรุปให้ง่ายและอ่านง่ายขึ้น

import { useEffect, useState, useCallback } from "react";
import html2canvas from "html2canvas";

// Toggle meta UI (title, debug, note)
const SHOW_META = false;

// Mapping helpers
const PERIODS = [
	{ key: "morning", label: "08:00 - 12:00", th: "เช้า" },
	{ key: "afternoon", label: "13:00 - 17:00", th: "บ่าย" },
	{ key: "evening", label: "18:00 - 20:00", th: "เย็น" },
];

// Truck -> period mapping (เพราะตาราง bookings ยังไม่มีคอลัมน์ period)
const TRUCK_PERIOD = {
	1: "morning",
	2: "morning",
	3: "afternoon",
	4: "afternoon",
	5: "evening",
	6: "evening",
};

// Utility: format date to yyyy-mm-dd (LOCAL time, ไม่ใช้ toISOString ป้องกัน timezone ลบวัน)
function fmt(date) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
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
	return Array.from({ length: 6 }, (_, i) => {
		const d = new Date(start);
		d.setDate(start.getDate() + i);
		return d;
	});
}

export default function DashboardWeek() {
	const [anchorDate, setAnchorDate] = useState(new Date()); // any date inside desired week
	const [weekDays, setWeekDays] = useState(buildWeekDays(new Date()));
	const [products, setProducts] = useState([]);
	const [loadingProducts, setLoadingProducts] = useState(false);
	const PRODUCTS_POLL_MS = 5000; // poll every 5s
	const BOOKINGS_POLL_MS = 10000; // poll bookings every 10s
	const [bookingsByDate, setBookingsByDate] = useState({}); // { 'yyyy-mm-dd': [booking,...] }
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState(null);
// public view: ไม่ต้อง login เพื่อดูยอดรวม

	// Load user/token from localStorage
	useEffect(() => {
		if (typeof window === "undefined") return;
		const u = localStorage.getItem("user");
		if (u) setUser(JSON.parse(u));
	}, []);

	// Rebuild week when anchor changes
	useEffect(() => {
		setWeekDays(buildWeekDays(anchorDate));
	}, [anchorDate]);

	// Load products (public GET doesn't need token) + polling
	useEffect(() => {
		let abort = false;
		async function loadProducts(){
			setLoadingProducts(true);
			try {
				const res = await fetch('/api/products', { cache: 'no-store' });
				const data = await res.json();
				if(!abort) setProducts(Array.isArray(data) ? data : []);
			} catch(e){ if(!abort) setProducts([]); }
			finally { if(!abort) setLoadingProducts(false); }
		}
		loadProducts();
		const id = setInterval(loadProducts, PRODUCTS_POLL_MS);
		return ()=>{ abort = true; clearInterval(id); };
	}, []);

	// Load bookings for each day in week
	const loadBookingsWeek = useCallback(async () => {
		const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null; // optional
		setLoading(true);
		const acc = {};
		await Promise.all(weekDays.map(async (d) => {
			const dateStr = fmt(d);
			try {
				const res = await fetch(`/api/bookings?date=${dateStr}`, {
					headers: { Authorization: `Bearer ${token}` },
					cache: 'no-store'
				});
				if(res.status === 401){
					console.warn('ไม่ได้รับอนุญาต bookings (token)?');
					acc[dateStr] = [];
					return;
				}
				const data = await res.json();
				acc[dateStr] = Array.isArray(data) ? data : [];
			} catch (e) {
				console.error('โหลด bookings ล้มเหลว', dateStr, e);
				acc[dateStr] = [];
			}
		}));
		setBookingsByDate(acc);
		setLoading(false);
	}, [weekDays]);

	useEffect(() => {
		loadBookingsWeek();
		const id = setInterval(() => loadBookingsWeek(), BOOKINGS_POLL_MS);
		return () => clearInterval(id);
	}, [loadBookingsWeek]);

	// reload เมื่อ user เปลี่ยน (optional)
	useEffect(() => { loadBookingsWeek(); }, [user, loadBookingsWeek]);

	// Helper: count distinct trucks for a product within a period on a date
	function countProductPeriod(productId, dateStr, periodKey){
		const list = (bookingsByDate[dateStr] || []).filter(b => b.product_id === productId && TRUCK_PERIOD[b.truck_number] === periodKey);
		return new Set(list.map(b=> b.truck_number)).size; // distinct truck count
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

	const handleSaveAsImage = () => {
		const element = document.getElementById("dashboard-week-content");
		html2canvas(element).then((canvas) => {
		  const image = canvas.toDataURL("image/png");
		  const link = document.createElement("a");
		  link.href = image;
		  link.download = "dashboard-week.png";
		  link.click();
		});
	  };

	return (
		<div style={{ padding: 20 }} id="dashboard-week-content">
            {/* เปิดใช้งาน debug UI ได้ที่ ตัวแปร SHOW_META ด้านบนเปลี่ยน false เป็น true */}
			{SHOW_META && (
				<>
					<h1 style={{ marginBottom: 10 }}>Weekly Dashboard (ทดลอง)</h1>
					{/* Debug status */}
					<div style={{fontSize:12, marginBottom:8, color:'#444'}}>
						<span>โหลดแล้ว: {Object.keys(bookingsByDate).length} วัน</span>{' | '}
						<span>ตัวอย่าง วันพุธ 27/08/2025 bookings: {(bookingsByDate['2025-08-27']||[]).length}</span>
					</div>
				</>
			)}
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
				<div style={{ display: "flex", gap: 10, fontWeight: '600' }}>
					<button onClick={prevWeek}>◀ สัปดาห์ก่อน</button>
					<div>
						สัปดาห์ของวันที่ {fmt(getWeekStart(anchorDate))} - {fmt(weekDays[weekDays.length - 1])}
					</div>
					<button onClick={nextWeek}>สัปดาห์ถัดไป ▶</button>
					{SHOW_META && (
						<button onClick={loadBookingsWeek} disabled={loading}>
						{loading ? "กำลังโหลด..." : "รีเฟรช"}
						</button>
					)}
				</div>
				<button
					onClick={handleSaveAsImage}
					style={{
						padding: "8px 12px",
						border: "none",
						borderRadius: "8px",
						backgroundColor: "#2ecc71",
						color: "white",
						fontWeight: "600",
						cursor: "pointer",
					}}
				>
					บันทึกเป็นรูปภาพ
				</button>
			</div>

			<div style={{ overflowX: "auto" }}>
				<table style={{ borderCollapse: "collapse", width: "100%", minWidth: 900 }}>
					<thead>
						<tr>
							<th style={thStyle} rowSpan={2}>ช่องที่</th>
							<th style={thStyle} rowSpan={2}>ประเภท</th>
							<th style={thStyle} rowSpan={2}>Vendor</th>
							{weekDays.map((d,i) => (
								<th key={fmt(d)} style={{ ...thStyle, background: dayColor(i), color: i===0 ? '#000' : '#fff' }} colSpan={PERIODS.length}>
									{d.toLocaleDateString('th-TH', { weekday:'long', day:'2-digit', month:'2-digit', year:'numeric'})}
								</th>
							))}
						</tr>
						<tr>
							{weekDays.map((d,i) => (
								PERIODS.map(p => (
									<th key={fmt(d)+p.key} style={{ ...thStyle, background: dayColor(i), color: i===0 ? '#000' : '#fff' }}>{p.th}</th>
								))
							))}
						</tr>
					</thead>
					<tbody>
						{products.map((prod, idx) => (
							<tr key={prod.id}>
								<td style={tdIndex}>{idx + 1}</td>{/* sequential numbering as requested */}
								<td style={tdMain}>{prod.name}</td>
								<td style={tdMain}>{prod.vendor}</td>
								{weekDays.flatMap((d) => (
									PERIODS.map((p) => {
										const dateStr = fmt(d);
										const cnt = countProductPeriod(prod.id, dateStr, p.key);
										return (
											<td key={prod.id+dateStr+p.key} style={tdCell}>
												{cnt > 0 ? `${cnt} คัน` : '-'}
											</td>
										);
									})
								))}
							</tr>
						))}
						{products.length === 0 && (
							<tr>
								<td style={tdEmpty} colSpan={3 + weekDays.length * PERIODS.length}>{loadingProducts ? 'กำลังโหลดสินค้า...' : 'ไม่มีสินค้า'}</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			{SHOW_META && (
				<p style={{ marginTop: 20, fontSize: 12, color: '#555' }}>
					ดึงข้อมูลจริงแล้ว (poll ทุก {BOOKINGS_POLL_MS/1000}s) และแยกช่วงเวลาแบบอนุมานจากหมายเลขรถ (1-2=เช้า,3-4=บ่าย,5-6=เย็น). หากจะให้แม่นยำควรเพิ่มคอลัมน์ period ในตาราง bookings.
				</p>
			)}
		</div>
	);
}

// ---- styles helpers ----
const thStyle = {
	padding: 8,
	background: '#083fc0ff',
	color: 'white',
	border: '1px solid #334155',
	fontSize: 12,
};
const tdMain = {
	padding: 6,
	border: '1px solid #000',
	background: '#fafafa',
	fontSize: 12,
	whiteSpace: 'nowrap',
	fontWeight: '600'
};
const tdIndex = { ...tdMain, textAlign: 'center', width: 40 };
const tdCell = {
	padding: 4,
	border: '1px solid #000',
	textAlign: 'center',
	fontSize: 12,
	minWidth: 55,
	fontWeight: '600',
};
const tdEmpty = { padding: 20, textAlign: 'center', border: '1px solid #e5e7eb' };

function periodColor(key){
	switch(key){
		case 'morning': return '#1d4ed8';
		case 'afternoon': return '#10b981';
		case 'evening': return '#dc2626';
		default: return '#475569';
	}
}

// สีรายวันสำหรับ header + sub headers ให้สีเดียวกันทั้งวัน
function dayColor(index){
	const palette = [
		'#FFFB0D', // Monday
		'#F562D6', // Tuesday
		'#02AE4E', // Wednesday
		'#F07D2E', // Thursday
		'#00B0EF', // Friday
		'#7230A0', // Saturday
	];
	return palette[index % palette.length];
}
