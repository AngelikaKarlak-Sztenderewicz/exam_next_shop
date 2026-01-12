import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

 
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
    include: { addresses: true } 
  });

  if (!user) {
    return NextResponse.json({ addresses: [] });
  }

  return NextResponse.json({ addresses: user.addresses || [] });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { street, city, zip, country, isMain } = body;

  if (!street || !city || !zip) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

  if (isMain) {
    await prisma.address.updateMany({
      where: { userId: user.id, isMain: true },
      data: { isMain: false },
    });
  }

  const newAddress = await prisma.address.create({
    data: {
      userId: user.id,
      street,
      city,
      zip,
      country: country || 'Poland',
      isMain: !!isMain,
    },
  });

  return NextResponse.json({ address: newAddress });
}
