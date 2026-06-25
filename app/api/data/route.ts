import { NextRequest, NextResponse } from 'next/server';

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL!;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;

async function redisCommand(command: unknown[]) {
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([command]),
  });
  const data = await res.json();
  return data[0];
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!key) return NextResponse.json(null);
  const data = await redisCommand(['GET', key]);
  return NextResponse.json(data.result ?? null);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = await redisCommand(['SET', body.key, body.value]);
  return NextResponse.json({ ok: data.result === 'OK' });
}

export async function DELETE() {
  const data = await redisCommand(['FLUSHDB']);
  return NextResponse.json({ ok: data.result === 'OK' });
}
