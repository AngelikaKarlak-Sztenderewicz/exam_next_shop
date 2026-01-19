import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Breadcrumb } from '@/components/ui';
import { CheckoutClient } from '@/components/cart/CheckoutClient';

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const email = session?.user?.email;
  const user = email
    ? await prisma.user.findUnique({
        where: { email },
        select: { country: true, id: true, firstName: true },
      })
    : null;

  const userCountry = user?.country;

  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Cart', href: '/cart' },
          { label: 'Checkout' },
        ]}
      />
      <CheckoutClient userCountry={userCountry} />
    </div>
  );
}
