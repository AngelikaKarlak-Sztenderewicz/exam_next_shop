import Button from '@/components/Button';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function OrderSuccessPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const order = await prisma.order.findUnique({
    where: { id: Number(params.id) },
    include: {
      items: true,
    },
  });

  if (!order) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-white">
        Order #{order.id} confirmed
      </h1>

      <p className="text-gray-400">{order.createdAt.toDateString()}</p>

      <div className="flex flex-col gap-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-4 bg-customGray p-4 rounded">
            <Image
              src={item.productImageUrl}
              alt={item.productName}
              width={80}
              height={80}
            />

            <div className="flex flex-col text-white gap-1">
              <span className="font-semibold">{item.productName}</span>
              <span>Price: ${item.priceAtPurchase.toFixed(2)}</span>
              <span>Quantity: {item.quantity}</span>
              <span className="font-bold">
                Total: ${(item.priceAtPurchase * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Link href="/products">
          <Button className="max-w-xs">Continue shopping</Button>
        </Link>
      </div>
    </div>
  );
}
