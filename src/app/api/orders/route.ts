import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

function generateInvoiceNumber() {
  const now = new Date();
  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');

  const random = Math.floor(100000000 + Math.random() * 900000000);
  return `INV/${date}/${random}`;
}

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
    const invoiceNumber = generateInvoiceNumber();
    const order = await prisma.order.create({
      
      data: {
          invoiceNumber,
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

    return NextResponse.json({
      invoiceNumber: order.invoiceNumber,
    });
  } catch (error) {
    console.error('ORDER ERROR:', error);
    return NextResponse.json(
      { error: 'Order failed' },
      { status: 500 }
    );
  }
}
