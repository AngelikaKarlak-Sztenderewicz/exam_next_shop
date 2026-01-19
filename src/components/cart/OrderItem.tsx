import Image from 'next/image';

export type OrderItemView = {
  id: number;
  productName: string;
  productImageUrl: string;
  productCategoryName: string;
  priceAtPurchase: number;
  quantity: number;
  hasProtection?: boolean;
};

type Props = {
  item: OrderItemView;
};

export function OrderItemDisplay({ item }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 w-full">
      <div className="w-full sm:w-[170px] h-[200px] sm:h-[130px] overflow-hidden flex-shrink-0 rounded-md bg-white relative">
        <Image
          src={item.productImageUrl}
          alt={item.productName}
          fill
          className="object-contain"
        />
      </div>
      <div className="flex flex-col gap-1 p-4 w-full">
        <span className="font-medium text-lg">{item.productName}</span>

        <span className="font-medium inline-flex w-fit rounded-md bg-customOrange py-2 px-3">
          {item.productCategoryName}
        </span>

        <div className="flex items-center justify-between mt-2 gap-4">
          <div className="text-2xl">${item.priceAtPurchase.toFixed(2)}</div>
          <div className="text-xl">x{item.quantity}</div>
        </div>
      </div>
    </div>
  );
}
