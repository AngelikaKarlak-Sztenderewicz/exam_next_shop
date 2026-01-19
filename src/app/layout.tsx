import { Providers } from '@/components/providers/Providers';
import './globals.css';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Toast } from '@/components/ui/Toast';

export const metadata = {
  title: 'DevstockHub',
  description: 'Sklep internetowy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen ">
        <Providers>
          <div className="w-full max-w-[1536] px-4 flex flex-col min-h-screen ">
            <Header />
            <Toast />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
