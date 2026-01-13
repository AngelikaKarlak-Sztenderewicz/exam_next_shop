import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

type IncomingItem = {
  id: number;        // product id
  quantity: number;
  name?: string;     
  image?: string | null;
};

function generateInvoiceNumber() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(100000000 + Math.random() * 900000000);
  return `INV/${yyyy}${mm}${dd}/${random}`;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { items, addressId, paymentMethod } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const createdOrder = await prisma.$transaction(async (tx) => {
      // 1) Sprawdź stock i pobierz produkt
      const productsMap = new Map<number, { price: number; name: string; imageUrl: string | null; stock: number }>();

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.id },
          select: { id: true, price: true, name: true, imageUrl: true, stock: true },
        });
        if (!product) throw new Error(`Product not found: ${item.id}`);
        if (product.stock < item.quantity) throw new Error(`Not enough stock for ${product.name}`);

        productsMap.set(item.id, product);
      }

      // 2) Liczymy totalAmount z product.price
      const totalAmount = items.reduce((sum, item) => {
        const product = productsMap.get(item.id)!;
        return sum + product.price * item.quantity;
      }, 0);

      // 3) Tworzymy zamówienie
      const order = await tx.order.create({
        data: {
          invoiceNumber: generateInvoiceNumber(),
          userId: Number(session.user.id),
          addressId: addressId ?? undefined,
          status: 'PAID',
          totalAmount,
        },
      });

      // 4) Tworzymy orderItems i zmniejszamy stock
      for (const item of items) {
        const product = productsMap.get(item.id)!;

        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.id,
            quantity: item.quantity,
            priceAtPurchase: product.price * item.quantity,
            productName: item.name ?? product.name,
            productImageUrl: item.image ?? product.imageUrl ?? null,
          },
        });

        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return order;
    });

    return NextResponse.json({
      orderId: createdOrder.id,
      invoiceNumber: createdOrder.invoiceNumber,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 400 });
  }
}
