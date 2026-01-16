'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/store/cartStore';
import Button from '../Button';
import { Shield } from '../icons/Shield';
import { MastercardIcon } from '../icons/MastercardIcon';
import { PayPallIcon } from '../icons/PayPalIcon';
import { ApplePayIcon } from '../icons/ApplePayIcon';
import { GPayIcon } from '../icons/GPayIcon';
import { VisaIcon } from '../icons/Visa';

type Address = {
  id: number;
  street: string;
  city: string;
  zip: string;
};

export default function CheckoutClient() {
  const items = useCart((s) => s.items);
  const selectedIds = useCart((s) => s.selectedIds);

  // 🔥 TYLKO ZAZNACZONE PRODUKTY
  const selectedItems = items.filter((i) => selectedIds.includes(i.id));

  // 🔒 jeśli ktoś wejdzie bez selekcji
  useEffect(() => {
    if (selectedIds.length === 0) {
      window.location.href = '/cart';
    }
  }, [selectedIds]);

  const [protection, setProtection] = useState<Record<number, boolean>>({});
  const [addressMode, setAddressMode] = useState<'existing' | 'new'>(
    'existing'
  );
  const [existingAddress, setExistingAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    zip: '',
  });
  const [saveAddress, setSaveAddress] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState('visa');
  const [open, setOpen] = useState(false);

  const paymentOptions = [
    { value: 'visa', label: 'Visa', icon: <VisaIcon /> },
    { value: 'mastercard', label: 'Mastercard', icon: <MastercardIcon /> },
    { value: 'paypal', label: 'PayPal', icon: <PayPallIcon /> },
    { value: 'applepay', label: 'Apple Pay', icon: <ApplePayIcon /> },
    { value: 'gpay', label: 'Google Pay', icon: <GPayIcon /> },
  ];
  const selected =
    paymentOptions.find((p) => p.value === paymentMethod) ?? paymentOptions[0];

  const streetRegex = /^(?=.*[A-Za-z]{3,})(?=.*\d).+$/;
  const cityRegex = /^[A-Za-z\s]{2,}$/;
  const zipRegex = /^\d{5,6}$/;

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const res = await fetch('/api/addresses');
        if (!res.ok) return;
        const data = await res.json();
        setAddresses(data.addresses || []);
        const main = (data.addresses || [])[0] ?? null;
        setExistingAddress(main);
        setSelectedAddress(main ? main.id : null);
      } catch (e) {
        console.error('Fetch addresses error', e);
      } finally {
        setLoadingAddresses(false);
      }
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

  const productsTotal = selectedItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const protectionTotal = selectedItems.reduce(
    (sum, i) => sum + (protection[i.id] ? i.quantity : 0),
    0
  );

  const shipping = 5;
  const transactionFee = 2;

  const total = Number(
    (productsTotal + protectionTotal + shipping + transactionFee).toFixed(2)
  );

  const handlePayNow = async () => {
    if (addressMode === 'new' && !validateAddress()) return;

    try {
      const payload: any = {
        items: selectedItems.map((i) => ({
          id: i.id,
          quantity: i.quantity,
          hasProtection: !!protection[i.id],
        })),
        paymentMethod,
      };

      if (addressMode === 'existing') {
        if (!selectedAddress) return;
        payload.addressId = selectedAddress;
      } else {
        if (saveAddress) {
          const resAddr = await fetch('/api/addresses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAddress),
          });
          const addr = await resAddr.json();
          if (!resAddr.ok) return;
          payload.addressId = addr.id;
        } else {
          payload.street = newAddress.street;
          payload.city = newAddress.city;
          payload.zip = newAddress.zip;
        }
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) return;

      window.location.href = '/ordersuccess';
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex gap-6 p-6">
      {/* LEFT */}
      <div className="flex-1 flex flex-col gap-6">
        {/* PRODUCTS */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Your order</h2>

          <div className="rounded-[6] bg-customGray p-5">
            {selectedItems.map((item) => (
              <div key={item.id} className="border-b pb-4 mb-4">
                <div className="flex justify-between items-center">
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
                className={`p-4 rounded transition-all duration-200 ${
                  addressMode === 'existing'
                    ? 'bg-gray-700 ring-2 ring-offset-1 ring-customOrange'
                    : 'bg-customGray'
                }`}
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
                      <div className="mt-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            name="addressSelect"
                            checked={selectedAddress === existingAddress.id}
                            onChange={() =>
                              setSelectedAddress(existingAddress.id)
                            }
                          />
                          Use this address
                        </label>
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
                className={`p-4 rounded transition-all duration-200 ${
                  addressMode === 'new'
                    ? 'bg-gray-700 ring-2 ring-offset-1 ring-customOrange'
                    : 'bg-customGray'
                }`}
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
                  className={`mt-3 overflow-hidden transition-[max-height,opacity] duration-300 ${
                    addressMode === 'new'
                      ? 'max-h-[400px] opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <input
                      placeholder="Street"
                      className={`border rounded-lg px-3 py-2  text-white ${
                        errors.street ? 'border-red-500' : ''
                      }`}
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
                      className={`border rounded-lg px-3 py-2 bg-gray-700 text-white ${
                        errors.city ? 'border-red-500' : ''
                      }`}
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
                      className={`border rounded-lg px-3 py-2 bg-gray-700 text-white ${
                        errors.zip ? 'border-red-500' : ''
                      }`}
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
                      value={newAddress.country}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          country: e.target.value,
                        })
                      }
                      className="border rounded-lg px-3 py-2 w-full bg-gray-600 text-white"
                    />

                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                      />
                      Save this address
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

          <div className="rounded-[6] bg-customGray p-5 flex gap-4 items-end">
            <Shield />
            <div className=" w-full flex justify-between m-0">
              <p>NexusHub Courier</p>
              <p>5$</p>
            </div>
          </div>
        </section>

        {/* PAYMENT */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Payment Method</h2>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="w-full bg-customGray p-5 rounded-[6] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {selected.icon}
                <span>{selected.label}</span>
              </div>
              <span>⌄</span>
            </button>

            {open && (
              <div className="absolute mt-2 w-full bg-customGray rounded shadow">
                {paymentOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setPaymentMethod(opt.value);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-4 hover:bg-gray-700"
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* RIGHT SUMMARY */}
      <aside className="w-[320px] p-4 rounded h-fit bg-customGray">
        <h2 className="text-xl font-bold mb-4">Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Products</span>
          <span>${productsTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Product protection</span>
          <span>${protectionTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Transaction fee</span>
          <span>${transactionFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Button onClick={handlePayNow}>Pay now</Button>
      </aside>
    </div>
  );
}

// //{showNote && (
//             <div className="mt-2">
//               <textarea
//                 className="w-full border rounded-md p-2"
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//                 maxLength={100}
//                 placeholder="Write a note (max 100 chars)"
//               />
//               <div className="text-xs mt-1">{note.length}/100</div>
//             </div>
//           )}
