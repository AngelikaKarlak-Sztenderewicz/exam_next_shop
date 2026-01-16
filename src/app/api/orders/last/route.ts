import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await prisma.order.findFirst({
      where: {
        userId: Number(session.user.id),
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        invoiceNumber: true,
        createdAt: true,
        totalAmount: true,
        status: true,
        street: true,
        city: true,
        zip: true,
        country: true,
        items: {
          select: {
            id: true,
            productName: true,
            productImageUrl: true,
            quantity: true,
            priceAtPurchase: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ order: null });
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error('GET /api/order/last error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

