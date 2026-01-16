import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ addresses: [] });

    const userId = Number(session.user.id);
    const addrs = await prisma.savedAddress.findMany({
      where: { userId },
    });
    return NextResponse.json({ addresses: addrs });
  } catch (err) {
    console.error('GET /api/addresses error', err);
    return NextResponse.json({ addresses: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = Number(session.user.id);
    const body = await req.json();

    if (!body.street || !body.city || !body.zip || !body.country) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
    }

    const addr = await prisma.savedAddress.upsert({
      where: { userId },
      update: {
        street: body.street,
        city: body.city,
        zip: body.zip,
        country: body.country,
        createdAt: new Date(),
      },
      create: {
        userId,
        street: body.street,
        city: body.city,
        zip: body.zip,
        country: body.country,
      },
    });

    return NextResponse.json(addr);
  } catch (err: unknown) {
    console.error('Address create/update error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
