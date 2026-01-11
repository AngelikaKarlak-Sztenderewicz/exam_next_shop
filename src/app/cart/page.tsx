import { Breadcrumb } from "@/components/Breadcrumb";
import CartView from "./CartView";

export default function CartPage() {
  return (
    <main className="p-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <CartView />
    </main>
  );
}
