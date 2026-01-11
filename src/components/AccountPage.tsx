"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

type Order = {
  id: number;
  createdAt: string;
  totalAmount: number;
};

export default function AccountPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/user/orders")
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  const user = session?.user;

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="text-gray-400 text-sm">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        &gt; <span>Profile</span>
      </div>

      <div className="flex gap-6">
        <div className="w-72">
          <div className="p-4 bg-customGray rounded-md flex flex-col items-center gap-2">
            <Image
              src="/avatar.png"
              alt="User Avatar"
              width={72}
              height={72}
              className="rounded-full"
            />
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-gray-400">{user?.email}</p>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mt-2 bg-blue-600 p-2 rounded w-full"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex-1 bg-customGray rounded-md p-4">
          <h3 className="text-lg font-bold text-white mb-2">Orders</h3>

          {orders.length === 0 ? (
            <p className="text-gray-400">You have no orders yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {orders.map((order) => (
                <li key={order.id} className="text-white">
                  Order #{order.id} –{" "}
                  {new Date(order.createdAt).toLocaleDateString()} – $
                  {order.totalAmount.toFixed(2)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
