import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ThankYouIcon } from '@/components/icons';
import { OrderItemDisplay } from '@/components/cart';
import { Button } from '@/components/ui';

type OrderItemView = {
  id: number;
  productName: string;
  productImageUrl: string;
  productCategoryName: string;
  priceAtPurchase: number;
  quantity: number;
};

async function getLastOrder(userId: number) {
  return prisma.order.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
    },
  });
}

export default async function OrderSuccessPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/login');

  const order = await getLastOrder(session.user.id);

  if (!order) redirect('/');

  const productsTotal = order.items.reduce(
    (sum, item) => sum + item.priceAtPurchase,
    0
  );

  const productProtection = order.items.reduce(
    (sum, item) => sum + (item.hasProtection ? item.quantity : 0),
    0
  );

  const shipping = 5;
  const transactionFee = 2;
  const grandTotal =
    productsTotal + shipping + productProtection + transactionFee;

  return (
    <div className="mx-auto my-6 p-6 flex flex-col gap-6 rounded bg-customGray w-full min-w-[312px] max-w-[640px]">
      <div className="flex flex-col items-center gap-2">
        <ThankYouIcon className="w-16 h-16" />
        <h1 className="text-2xl font-semibold">Thanks for Your Order!</h1>
        <p className="text-sm">{order.invoiceNumber}</p>
      </div>

      <div className="flex flex-col gap-4 text-sm">
        <div>
          <p className="font-medium">Transaction Date</p>
          <p>{new Date(order.createdAt).toDateString()}</p>
        </div>
        <div>
          <p className="font-medium">Payment Method</p>
          <p className="capitalize">{order.paymentMethod}</p>
        </div>
        <div>
          <p className="font-medium">Shipping Method</p>
          <p>NexusHub Courier</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-semibold">Your Order</h2>
        {order.items.map((item: OrderItemView) => (
          <OrderItemDisplay key={item.id} item={item} />
        ))}
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span>Total Product Price</span>
          <span>${productsTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Product Protection</span>
          <span>${productProtection.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping Price</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Transaction Fee</span>
          <span>${transactionFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg mt-2">
          <span>Grand total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">Status</span>
        <span className="px-3 py-1 inline-flex w-fit rounded bg-successGreen">
          Success
        </span>
      </div>

      <Link href="/products">
        <Button className="w-full font-semibold text-customGray">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
}
