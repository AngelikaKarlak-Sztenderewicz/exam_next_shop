import { ThankYouIcon } from '@/components/icons/ThankYouIcon';

export default function SuccessPage() {
  return (
    <div className="flex flex-col justify-center w-full text-center p-20">
      <div className="flex justify-center py-10">
        <ThankYouIcon className="w-16 h-16" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Thank you!</h1>
      <p className="text-2xl">You have successfully registered.</p>
      <p className="mt-4">
        Please check your e-mail for further information. Let’s explore our
        products and enjoy many gifts.
      </p>
      <p className="mt-6 text-sm text-gray-400">
        Having problem?
        <p className="text-customOrange">Contact us</p>
      </p>
    </div>
  );
}
