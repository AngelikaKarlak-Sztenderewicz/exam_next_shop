'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/store/cartStore';
import Button from '../Button';
import { Shield } from '../icons/Shield';

type Address = {
  id: number;
  street: string;
  city: string;
  zip: string;
  country: string;
  isMain: boolean;
};

export default function CheckoutClient() {
  const items = useCart((s) => s.items);

  const [protection, setProtection] = useState<Record<number, boolean>>({});
  const [addressMode, setAddressMode] = useState<'existing' | 'new'>(
    'existing'
  );
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [existingAddress, setExistingAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    zip: '',
    country: 'Poland',
    isMain: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const streetRegex = /^(?=.*[A-Za-z]{3,})(?=.*\d).+$/;
  const cityRegex = /^[A-Za-z\s]{2,}$/;
  const zipRegex = /^\d{5,6}$/;

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoadingAddresses(true);
      const res = await fetch('/api/addresses');
      if (!res.ok) {
        setLoadingAddresses(false);
        return;
      }
      const data = await res.json();
      setAddresses(data.addresses || []);
      const main =
        (data.addresses || []).find((a: Address) => a.isMain) ||
        (data.addresses || [])[0] ||
        null;
      setExistingAddress(main);
      setSelectedAddress(main ? main.id : null);
      setLoadingAddresses(false);
    };
    fetchAddresses();
  }, []);

  const validateAddress = () => {
    const newErrors: Record<string, string> = {};
    if (!streetRegex.test(newAddress.street))
      newErrors.street = 'Street must contain at least 3 letters and 1 number';
    if (!cityRegex.test(newAddress.city))
      newErrors.city = 'City must contain only letters';
    if (!zipRegex.test(newAddress.zip))
      newErrors.zip = 'ZIP code must be 5 or 6 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const shipping = 5;
  const transactionFee = 2;

  const productsTotal = items.reduce(
    (sum, i) =>
      sum + i.price * i.quantity + (protection[i.id] ? i.quantity : 0),
    0
  );

  const total = Number((productsTotal + shipping + transactionFee).toFixed(2));

  const handlePayNow = async () => {
    if (addressMode === 'new' && !validateAddress()) return;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          addressId: selectedAddress,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Order API error:', data);
        alert('Order failed: ' + (data?.error ?? res.statusText));
        return;
      }

      window.location.href = `/orderSuccess`;
    } catch (err) {
      console.error('Network / unexpected error:', err);
      alert('Network error — spróbuj ponownie.');
    }
  };

  return (
    <div className="flex gap-6 p-6">
      {/* LEFT (produkty + reszta) */}
      <div className="flex-1 flex flex-col gap-6">
        {/* PRODUCTS */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Your order</h2>

          <div className="rounded-[6] bg-customGray p-5">
            {items.map((item) => (
              <div key={item.id} className="border-b pb-4 mb-4">
                <div className="flex justify-between  items-center">
                  <span className="font-medium">{item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>

                <label className="flex items-center gap-2 mt-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!protection[item.id]}
                    onChange={(e) =>
                      setProtection({
                        ...protection,
                        [item.id]: e.target.checked,
                      })
                    }
                  />
                  Product protection +$1
                </label>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Address</h2>

          <div className="rounded-[6] bg-customGray p-5">
            <div className="flex-1">
              <div
                className={`p-4 rounded transition-all duration-200 ${addressMode === 'existing' ? 'bg-gray-700 ring-2 ring-offset-1 ring-submitButtonColor' : 'bg-customGray'}`}
                onClick={() => setAddressMode('existing')}
                role="button"
              >
                <div className="flex items-center justify-between">
                  <div className=" font-medium">Existing address</div>
                  <div className="text-sm ">
                    {loadingAddresses
                      ? 'Loading...'
                      : existingAddress
                        ? 'Selected'
                        : 'None'}
                  </div>
                </div>

                <div className="mt-3 text-white">
                  {existingAddress ? (
                    <>
                      <div>{existingAddress.street}</div>
                      <div>
                        {existingAddress.city} {existingAddress.zip}
                      </div>
                      <div className="opacity-70">
                        {existingAddress.country}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400">
                      You have no saved address
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: new address form */}
            <div className="flex-1">
              <div
                className={`p-4 rounded transition-all duration-200 ${addressMode === 'new' ? 'bg-gray-700 ring-2 ring-offset-1 ring-submitButtonColor' : 'bg-customGray'}`}
                onClick={() => setAddressMode('new')}
                role="button"
              >
                <div className="flex items-center justify-between">
                  <div className=" font-medium">New address</div>
                  <div className="text-sm ">
                    {addressMode === 'new' ? 'Editing' : 'Tap to add'}
                  </div>
                </div>

                <div
                  className={`mt-3 overflow-hidden transition-[max-height,opacity] duration-300 ${addressMode === 'new' ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="flex flex-col gap-2">
                    <input
                      placeholder="Street"
                      className={`border rounded-lg px-3 py-2  text-white ${errors.street ? 'border-red-500' : ''}`}
                      value={newAddress.street}
                      onChange={(e) => {
                        setErrors((prev) => ({ ...prev, street: '' }));
                        setNewAddress({
                          ...newAddress,
                          street: e.target.value,
                        });
                      }}
                    />
                    {errors.street && (
                      <p className="text-red-500 text-sm">{errors.street}</p>
                    )}

                    <input
                      placeholder="City"
                      className={`border rounded-lg px-3 py-2 bg-gray-700 text-white ${errors.city ? 'border-red-500' : ''}`}
                      value={newAddress.city}
                      onChange={(e) => {
                        setErrors((prev) => ({ ...prev, city: '' }));
                        setNewAddress({ ...newAddress, city: e.target.value });
                      }}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm">{errors.city}</p>
                    )}

                    <input
                      placeholder="ZIP"
                      className={`border rounded-lg px-3 py-2 bg-gray-700 text-white ${errors.zip ? 'border-red-500' : ''}`}
                      value={newAddress.zip}
                      onChange={(e) => {
                        setErrors((prev) => ({ ...prev, zip: '' }));
                        setNewAddress({ ...newAddress, zip: e.target.value });
                      }}
                    />
                    {errors.zip && (
                      <p className="text-red-500 text-sm">{errors.zip}</p>
                    )}

                    <input
                      disabled
                      value="Poland"
                      className="border rounded-lg px-3 py-2 w-full opacity-60 cursor-not-allowed bg-gray-600 text-gray-300"
                    />
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={newAddress.isMain}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            isMain: e.target.checked,
                          })
                        }
                      />
                      Save as main address
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SHIPPING */}
        <section>
          <h2 className="text-lg font-semibold">Shipping</h2>

          <div className="rounded-[6] bg-customGray p-5 flex gap-4">
            <Shield />
            <p className="m-0 opacity-70 mt-1">NexusHub Courier</p>
          </div>
        </section>

        {/* PAYMENT */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Payment Method</h2>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className=" w-full rounded-[6] bg-customGray p-5"
          >
            <option value="card">Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </section>
      </div>

      {/* RIGHT SUMMARY */}
      <aside className="w-[320px] p-4 rounded h-fit">
        <h2 className="text-xl font-bold mb-4">Summary</h2>
        <div className="flex justify-between  mb-2">
          <span>Products</span>
          <span>${productsTotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between  mt-1">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between  mt-1">
          <span>Transaction fee</span>
          <span>${transactionFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-white text-lg mt-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Button onClick={handlePayNow}>Pay now</Button>
      </aside>
    </div>
  );
}
