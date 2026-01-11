import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import CheckoutClient from '@/components/checkout/CheckoutClient';

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-white p-6">You must be logged in</p>;
  }

  return <CheckoutClient />;
}
