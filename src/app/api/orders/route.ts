import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

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
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const items: { id: number; quantity: number; hasProtection?: boolean }[] = body.items;
    const addressId: number | undefined = body.addressId;
    const street: string | undefined = body.street;
    const city: string | undefined = body.city;
    const zip: string | undefined = body.zip;
    const country: string | undefined = body.country;
    const paymentMethod: string = body.paymentMethod ?? 'card';

    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'No items provided' }, { status: 400 });

    const userId = Number(session.user.id);

    const createdOrder = await prisma.$transaction(async (tx) => {

      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found');

     
      const productsMap = new Map<number, { price: number; name: string; imageUrl: string | null;
         stock: number; categoryName: string}>();
      for (const it of items) {
        const p = await tx.product.findUnique({ where: { id: it.id }, select: 
          { price: true, name: true, imageUrl: true, stock: true, category: {
      select: {
        name: true,
      },
    }, } });
        if (!p) throw new Error(`Product not found: ${it.id}`);
        if (p.stock < it.quantity) throw new Error(`Not enough stock for ${p.name}`);
        productsMap.set(it.id, { price: p.price, name: p.name, imageUrl: p.imageUrl ?? null,
           stock: p.stock, categoryName: p.category.name});
      }

      const totalAmount = items.reduce((sum, it) => {
        const p = productsMap.get(it.id)!;
        return sum + p.price * it.quantity;
      }, 0);

      const orderData: any = {
        invoiceNumber: generateInvoiceNumber(),
        userId,
        status: 'PAID',
        totalAmount,
        paymentMethod,
      };

      if (addressId !== undefined && addressId !== null) {
        const addr = await tx.savedAddress.findUnique({ where: { id: addressId } });
        if (!addr) throw new Error('Selected address not found');
        orderData.street = addr.street;
        orderData.city = addr.city;
        orderData.zip = addr.zip;
        orderData.country = addr.country;
      } else {
        if (!street || !city || !zip || !country) throw new Error('Address fields missing for one-time address');
        orderData.street = street;
        orderData.city = city;
        orderData.zip = zip;
        orderData.country = country;
      }

      const order = await tx.order.create({ data: orderData });

      for (const it of items) {
        const p = productsMap.get(it.id)!;
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: it.id,
            quantity: it.quantity,
            priceAtPurchase: p.price * it.quantity,
            hasProtection: it.hasProtection ?? false,
            productName: p.name,
            productImageUrl: p.imageUrl ?? '',
            productCategoryName: p.categoryName,
          },
        });

        await tx.product.update({
          where: { id: it.id },
          data: { stock: { decrement: it.quantity } },
        });
      }

      return order;
    });

    return NextResponse.json({ orderId: createdOrder.id, invoiceNumber: createdOrder.invoiceNumber });
  } catch (err: any) {
    console.error('POST /api/orders error:', err);
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}
