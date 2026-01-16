export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  description?: string;
  category: { id: number; name: string };
  brand: { id: number; name: string };
};