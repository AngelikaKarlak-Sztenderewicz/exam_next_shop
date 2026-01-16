import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';

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
          <Header />
          <Toast />
          <main className="flex-1 p-4">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
