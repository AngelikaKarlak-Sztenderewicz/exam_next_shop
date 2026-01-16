'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { TransactionCartIcon } from './icons/TransactionCartIcon';

type Order = {
  id: number;
  invoiceNumber: string;
  createdAt: string;
  totalAmount: number;
  items: { productName: string }[];
};
export default function AccountPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch('/api/user/orders')
      .then((res) => res.json())
      .then((data) => {
        console.log('API orders:', data);
        setOrders(Array.isArray(data) ? data : (data.orders ?? []));
      });
  }, []);

  const user = session?.user;

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="text-gray-400 text-sm">
        <Link href="/" className="hover:underline">
          Home
        </Link>{' '}
        &gt; <span>Profile</span>
      </div>

      <div className="flex gap-6">
        <div className="w-72">
          <div className="p-4 bg-customGray rounded-md flex flex-col items-center gap-2 ">
            <div className="w-[72px] h-[72px] rounded-full overflow-hidden relative">
              <Image
                src="https://i.ibb.co/YF1VhVMn/avatar.png"
                alt="User Avatar"
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-center">{user?.name}</h2>
            <p>{user?.email}</p>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="mt-2 bg-customOrange p-2 rounded w-full"
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
            <ul className="flex flex-col gap-4">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-start gap-4 p-4 rounded-md"
                >
                  <TransactionCartIcon />

                  <div className="flex flex-col gap-1">
                    <span className="text-sm opacity-70">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>

                    <span className="font-medium">
                      Your order nr {order.invoiceNumber}
                    </span>

                    <span className="text-sm opacity-80 flex flex-col">
                      {order.items.map((i, index) => (
                        <span key={index}>• {i.productName} </span>
                      ))}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
