import { NextRequest, NextResponse } from 'next/server';

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SB_SECRET = process.env.SUPABASE_SECRET_KEY!;

const h = () => ({
  'apikey': SB_SECRET,
  'Authorization': `Bearer ${SB_SECRET}`,
  'Content-Type': 'application/json',
});

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!key) return NextResponse.json(null);
  const res = await fetch(
    `${SB_URL}/rest/v1/site_data?select=value&key=eq.${encodeURIComponent(key)}`,
    { headers: h() }
  );
  const rows = await res.json();
  return NextResponse.json(rows.length > 0 ? rows[0].value : null);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${SB_URL}/rest/v1/site_data`, {
    method: 'POST',
    headers: { ...h(), 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify({ key: body.key, value: body.value, updated_at: new Date().toISOString() }),
  });
  return NextResponse.json({ ok: res.ok, status: res.status });
}
