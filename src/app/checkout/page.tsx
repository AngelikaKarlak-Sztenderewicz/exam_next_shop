import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import CheckoutClient from '@/components/checkout/CheckoutClient';
import { redirect } from 'next/navigation';

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    if (!session) redirect('/login');
  }

  return <CheckoutClient />;
}
