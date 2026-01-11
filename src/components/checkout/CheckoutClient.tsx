'use client';

import { useState } from 'react';
import { useCart } from '@/store/cartStore';
import Button from '../Button';

export default function CheckoutClient() {
  const items = useCart((s) => s.items);

  const [protection, setProtection] = useState<Record<number, boolean>>({});
  const [addressMode, setAddressMode] = useState<'existing' | 'new'>(
    'existing'
  );
  const [paymentMethod, setPaymentMethod] = useState('card');
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

  const validateAddress = () => {
    const newErrors: Record<string, string> = {};
    if (!streetRegex.test(newAddress.street))
      newErrors.street = 'Invalid street';
    if (!cityRegex.test(newAddress.city)) newErrors.city = 'Invalid city';
    if (!zipRegex.test(newAddress.zip)) newErrors.zip = 'Invalid ZIP';
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

  const total = productsTotal + shipping + transactionFee;

  const handlePayNow = async () => {
    if (addressMode === 'new' && !validateAddress()) return;

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        totalAmount: total,
        address: addressMode === 'new' ? newAddress : null,
        paymentMethod,
      }),
    });

    if (!res.ok) return;
    const data = await res.json();
    window.location.href = `/order-success/${data.orderId}`;
  };

  return (
    <div className="flex gap-6 p-6 max-w-[1400px] mx-auto">
      {/* LEFT */}
      <div className="flex-1 flex flex-col gap-6">
        {/* PRODUCTS */}
        <section className="rounded-xl border p-5">
          <h2 className="text-lg font-semibold mb-4">Your Order</h2>

          {items.map((item) => (
            <div
              key={item.id}
              className="border-b last:border-b-0 pb-4 mb-4 last:mb-0"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.name}</span>
                <span className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
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

              <p className="text-sm opacity-70 mt-1">
                Covers accidental damage during shipping.
              </p>
            </div>
          ))}
        </section>

        {/* ADDRESS */}
        <section className="rounded-xl border p-5">
          <h2 className="text-lg font-semibold mb-4">Address</h2>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={addressMode === 'existing'}
              onChange={() => setAddressMode('existing')}
            />
            Existing address
          </label>

          <label className="flex items-center gap-2 mt-2">
            <input
              type="radio"
              checked={addressMode === 'new'}
              onChange={() => setAddressMode('new')}
            />
            New address
          </label>

          {addressMode === 'new' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <input
                placeholder="Street"
                value={newAddress.street}
                onChange={(e) => {
                  setErrors((prev) => ({ ...prev, street: '' }));
                  setNewAddress({ ...newAddress, street: e.target.value });
                }}
              />

              {errors.street && <p className="text-sm mt-1">{errors.street}</p>}

              <input
                className="border rounded-lg px-3 py-2"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => {
                  setErrors((prev) => ({ ...prev, city: '' }));
                  setNewAddress({ ...newAddress, city: e.target.value });
                }}
              />

              {errors.city && <p className="text-sm mt-1">{errors.city}</p>}
              <input
                className="border rounded-lg px-3 py-2"
                placeholder="ZIP"
                value={newAddress.zip}
                onChange={(e) => {
                  setErrors((prev) => ({ ...prev, zip: '' }));
                  setNewAddress({ ...newAddress, zip: e.target.value });
                }}
              />

              {errors.zip && <p className="text-sm mt-1">{errors.zip}</p>}
              <input
                disabled
                className="border rounded-lg px-3 py-2 w-full opacity-60 cursor-not-allowed"
                value="Poland"
              />
            </div>
          )}
        </section>

        {/* SHIPPING */}
        <section className="rounded-xl border p-5">
          <h2 className="text-lg font-semibold">Shipping</h2>
          <p className="text-sm opacity-70 mt-1">NexusHub Courier</p>
        </section>

        {/* PAYMENT */}
        <section className="rounded-xl border p-5">
          <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="card">Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </section>
      </div>

      {/* RIGHT */}
      <aside className="w-[360px] shrink-0 rounded-xl border p-5 h-fit">
        <h2 className="text-lg font-semibold mb-4">Summary</h2>

        <div className="flex justify-between text-sm mb-2">
          <span>Products</span>
          <span>${productsTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-4">
          <span>Transaction</span>
          <span>${transactionFee.toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-semibold text-lg mb-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <Button onClick={handlePayNow} className="w-full">
          Pay Now
        </Button>
      </aside>
    </div>
  );
}
