"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function AccountPage() {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="text-gray-400 text-sm">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        &gt; <span>Profile</span>
      </div>

      <div className="flex gap-6">
        <div className="flex-none w-72 flex flex-col items-center gap-4">
          <div className="w-72 p-4 bg-customGray rounded-md flex flex-col items-center gap-2">
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

        <div className="flex-1 flex flex-col gap-4">
          <div className="p-4 bg-customGray rounded-md flex flex-col gap-2">
            <h3 className="text-lg font-bold text-white">Transactions</h3>
            <p className="text-gray-400 text-sm">
              You have no transactions yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
