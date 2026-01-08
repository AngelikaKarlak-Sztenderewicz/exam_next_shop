"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserIcon } from "@/components/icons/UserIcon";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session) {
    return (
      <Link href="/login">
        <UserIcon />
      </Link>
    );
  }

  return (
    <Link href="/account">
      <UserIcon />
    </Link>
  );
}
