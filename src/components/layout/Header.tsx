'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCart } from '@/store/cartStore';
import { usePathname } from 'next/navigation';
import { CartIcon, UserIcon } from '../icons';
import { Button } from '../ui';

export function Header() {
  const { data: session, status } = useSession();

  const pathname = usePathname();
  const itemsCount = useCart((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  return (
    <header className="p-4 items-center">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tight flex justify-center">
          <span className="text-orange-500">Nexus</span>
          <span>Hub</span>
        </h1>

        <div className="flex gap-4 items-center">
          {status === 'authenticated' ? (
            <>
              <Link
                href="/cart"
                className={`relative hover:underline ${
                  pathname === '/cart' ? 'text-customOrange' : 'text-white'
                }`}
              >
                <CartIcon />
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {itemsCount}
                  </span>
                )}
              </Link>

              <Link
                href="/account"
                className={`hover:underline ${
                  pathname === '/account' ? 'text-customOrange' : 'text-white'
                }`}
              >
                <UserIcon />
              </Link>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>

      <nav className="flex gap-4 py-5">
        <Link
          href="/"
          className={`hover:underline ${
            pathname === '/' ? 'text-customOrange' : 'text-white'
          }`}
        >
          Home
        </Link>

        <Link
          href="/products"
          className={`hover:underline ${
            pathname.startsWith('/products')
              ? 'text-customOrange'
              : 'text-white'
          }`}
        >
          Products
        </Link>
      </nav>

      <div className="my-3 w-full h-px bg-gray-700"></div>
    </header>
  );
}
