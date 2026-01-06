import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "DevstockHub",
  description: "Sklep internetowy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen ">
        <header className=" p-4 items-center">
          <div className="flex justify-between">
            <h1>DevstockHub</h1>
            <div>
              <Link href="/cart" className="hover:underline">
                Koszyk
              </Link>
              i takie tam
            </div>
          </div>
          <nav className="flex gap-4">
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

        <footer
          className="bg-gray-900 
         p-4 mt-auto text-center"
        >
          Contact: email@example.com | Tel: 123-456-789
        </footer>
      </body>
    </html>
  );
}
