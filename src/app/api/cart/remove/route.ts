import { NextResponse } from 'next/server';
import { notify } from '@/lib/sse';
import type { SSEEvent } from '@/types/sse';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = typeof body.message === 'string' ? body.message : 'Produkt usunięty z koszyka';

    const event: SSEEvent = { type: 'cart:remove', message };
    notify(event);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
