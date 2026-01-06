import { prisma } from "@/lib/prisma";
const HARD_CODED_USER_ID = 1;

export async function getCart() {
  const cartOrder = await prisma.order.findFirst({
    where: { userId: HARD_CODED_USER_ID, status: "CART" },
    include: { items: { include: { product: true } } },
  });

  if (!cartOrder) return { items: [], totalAmount: 0 };

  const itemsWithTotal = cartOrder.items.map((item) => ({
    ...item,
    totalPrice: item.quantity * item.product.price,
  }));

  const totalAmount = itemsWithTotal.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  return { items: itemsWithTotal, totalAmount };
}
