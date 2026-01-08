"use client";

import Link from "next/link";
import { CartIcon } from "./icons/CartIcon";
import { UserIcon } from "./icons/UserIcon";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="p-4 items-center">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">DevstockHub</h1>

        <div className="flex gap-4 items-center">
          <Link href="/cart">
            <CartIcon />
          </Link>

          {status === "authenticated" ? (
            <Link href="/account">
              <UserIcon />
            </Link>
          ) : (
            <Link href="/login">
              <UserIcon />
            </Link>
          )}
        </div>
      </div>

      <nav className="flex gap-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/products" className="hover:underline">
          Products
        </Link>
      </nav>
    </header>
  );
}
