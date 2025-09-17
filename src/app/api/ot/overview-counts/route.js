import { NextResponse } from 'next/server';
import { query, initDatabase } from '@/lib/db';
import { getUserFromRequest, isDateLocked, isDepartmentLocked } from '@/lib/auth';

async function withInitRetry(action) {
	try { return await action(); } catch (err) {
		const msg = String(err?.message || '');
		const isNoTable = err?.code === 'ER_NO_SUCH_TABLE' || msg.includes("doesn't exist") || err?.sqlState === '42S02';
		if (!isNoTable) throw err;
		await initDatabase();
		return action();
	}
}

// GET /api/ot/overview-counts?date=YYYY-MM-DD
// Returns rows: [{ department_id, shift_id, count }]
export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const the_date = searchParams.get('date');
	if (!the_date) return NextResponse.json({ error: 'missing date' }, { status: 400 });
	const rows = await withInitRetry(() => query(
		`SELECT department_id, shift_id, count FROM ot_overview_counts WHERE the_date = ?`,
		[the_date]
	));
	return NextResponse.json(rows);
}

// POST /api/ot/overview-counts
// Body: { the_date, items: [{ department_id, shift_id, count }] } OR single upsert
export async function POST(request) {
	const user = await getUserFromRequest(request);
	if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const body = await request.json();
	const { the_date } = body || {};
	if (!the_date) return NextResponse.json({ error: 'missing date' }, { status: 400 });

	// Normalize to items array
	const items = Array.isArray(body?.items) ? body.items : [{ department_id: body?.department_id, shift_id: body?.shift_id, count: body?.count }];
	// Validate
	for (const it of items) {
		if (!it || !it.department_id || !it.shift_id) {
			return NextResponse.json({ error: 'invalid items' }, { status: 400 });
		}
	}

	// Permission: super admin and adminga can write anywhere; others limited to own plant and departments
	const isAdminga = String(user?.username || '').toLowerCase() === 'adminga';
	const isSuper = !!(user.is_super_admin || isAdminga);
	const myDeptIds = (Array.isArray(user?.department_ids) && user.department_ids.length)
		? user.department_ids
		: (user?.department_id ? [user.department_id] : []);

	// Upsert with lock checks
	await withInitRetry(async () => {
		for (const it of items) {
			const deptId = Number(it.department_id);
			const shiftId = Number(it.shift_id);
			const value = Math.max(0, Number(it.count) || 0);

			// Lock checks (department-level priority)
			const locked = await isDepartmentLocked(the_date, deptId);
			if (locked && !isSuper) {
				throw Object.assign(new Error('locked'), { status: 423 });
			}

			// Scope check for non-super
			if (!isSuper) {
				if (!myDeptIds.includes(deptId)) {
					throw Object.assign(new Error('forbidden'), { status: 403 });
				}
			}

			await query(
				`INSERT INTO ot_overview_counts (the_date, department_id, shift_id, count, updated_by)
				 VALUES (?,?,?,?,?)
				 ON DUPLICATE KEY UPDATE count = VALUES(count), updated_by = VALUES(updated_by)`,
				[the_date, deptId, shiftId, value, user.id || null]
			);
		}
	});

	return NextResponse.json({ ok: true });
}

