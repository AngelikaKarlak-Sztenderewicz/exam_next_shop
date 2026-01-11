import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { items, totalAmount } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'No items' }, { status: 400 });
  }

  try {
    const order = await prisma.order.create({
      data: {
        totalAmount,
        status: 'PAID',
        user: {
          connect: {
            email: session.user.email, 
          },
        },
        items: {
          create: items.map((item: {
            id: number;
            quantity: number;
            price: number;
          }) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error('ORDER ERROR:', error);
    return NextResponse.json(
      { error: 'Order failed' },
      { status: 500 }
    );
  }
}
