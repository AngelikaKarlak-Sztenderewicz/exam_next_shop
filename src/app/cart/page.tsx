import { Breadcrumb } from '@/components/Breadcrumb';
import CartView from './CartView';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/login');

  return (
    <main className="p-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
      <CartView />
    </main>
  );
}
