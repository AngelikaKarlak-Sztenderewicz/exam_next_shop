import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "DevstockHub",
  description: "Sklep na zaliczenie",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <div className="font-bold text-xl">DevstockHub</div>
          <nav className="space-x-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/products" className="hover:underline">
              Products
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </nav>
        </header>

        <main className="flex-1 p-4">{children}</main>

        <footer className="bg-gray-800 text-white p-4 mt-auto text-center">
          Contact: email@example.com | Tel: 123-456-789
        </footer>
      </body>
    </html>
  );
}
