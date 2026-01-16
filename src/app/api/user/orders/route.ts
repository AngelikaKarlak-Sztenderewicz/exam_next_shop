import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: Number(session.user.id) },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      invoiceNumber: true,   
      createdAt: true,
      totalAmount: true,
      items: {
        select: {
          productName: true, 
        },
      },
    },
  });
  return NextResponse.json(orders);
}
