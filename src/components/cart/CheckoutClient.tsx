'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cartStore';
import { COUNTRY_LABELS } from '@/lib/countries';
import {
  ApplePayIcon,
  GPayIcon,
  MastercardIcon,
  PayPallIcon,
  ShieldIcon,
  VisaIcon,
} from '../icons';
import { CheckoutItem } from './CheckoutItem';
import { CheckoutAddressSection } from './CheckoutAddressSection';
import { Button } from '../ui';

type Address = {
  id: number;
  street: string;
  city: string;
  zip: string;
  country: string;
};

type Props = {
  userCountry?: string;
};

type OrderItemPayload = {
  id: number;
  quantity: number;
  hasProtection: boolean;
  note: string;
};

type OrderPayload = {
  items: OrderItemPayload[];
  paymentMethod: string;
  addressId?: number;
  street?: string;
  city?: string;
  zip?: string;
  country?: string;
};

export function CheckoutClient({ userCountry = '' }: Props) {
  const router = useRouter();

  const items = useCart((s) => s.items);
  const selectedIds = useCart((s) => s.selectedIds);
  const selectedItems = items.filter((i) => selectedIds.includes(i.id));
  const addToCart = useCart((s) => s.addToCart);
  const removeFromCart = useCart((s) => s.removeFromCart);
  const countryLabel = COUNTRY_LABELS[userCountry] ?? userCountry;

  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (selectedIds.length === 0 && !isSubmittingRef.current) {
      router.replace('/cart');
    }
  }, [selectedIds, router]);

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
    country: userCountry,
  });
  const [saveAddress, setSaveAddress] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [paymentMethod, setPaymentMethod] = useState('visa');
  const [open, setOpen] = useState(false);

  const [notes, setNotes] = useState<Record<number, string>>({});
  const [showNoteEditor, setShowNoteEditor] = useState<Record<number, boolean>>(
    {}
  );

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
    setNewAddress((prev) => ({ ...prev, country: userCountry }));
  }, [userCountry]);

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

  const toggleNote = (id: number) => {
    setShowNoteEditor((s) => ({ ...s, [id]: !s[id] }));
  };
  const updateNote = (id: number, value: string) => {
    if (value.length > 100) return;
    setNotes((s) => ({ ...s, [id]: value }));
  };

  const handlePayNow = async () => {
    const outOfStockItems = selectedItems.filter((i) => i.quantity > i.stock);

    if (outOfStockItems.length > 0) {
      alert('Some items are out of stock');
      return;
    }

    if (addressMode === 'new' && !validateAddress()) return;
    isSubmittingRef.current = true;

    try {
      const payload: OrderPayload = {
        items: selectedItems.map((i) => ({
          id: i.id,
          quantity: i.quantity,
          hasProtection: !!protection[i.id],
          note: notes[i.id] ?? '',
        })),
        paymentMethod,
        country: userCountry,
      };

      if (addressMode === 'existing') {
        if (!selectedAddress) {
          console.warn('No selected address');
          isSubmittingRef.current = false;
          return;
        }
        payload.addressId = selectedAddress;
      } else {
        if (saveAddress) {
          const resAddr = await fetch('/api/addresses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newAddress, country: userCountry }),
          });
          if (!resAddr.ok) {
            const txt = await resAddr.text().catch(() => 'unknown');
            console.error('Create address failed:', txt);
            isSubmittingRef.current = false;
            return;
          }
          const addrData: { id: number } = await resAddr.json();
          payload.addressId = addrData.id;
        } else {
          payload.street = newAddress.street;
          payload.city = newAddress.city;
          payload.zip = newAddress.zip;
          payload.country = userCountry;
        }
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => 'no body');
        console.error('Order creation failed:', txt);
        isSubmittingRef.current = false;
        return;
      }
      selectedItems.forEach((item) => {
        removeFromCart(item.id);
      });

      router.replace('/ordersuccess');
    } catch (err) {
      console.error('handlePayNow error', err);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full max-w-full">
      <div className="flex-1 flex flex-col gap-6 w-full">
        <section>
          <h2 className="text-xl font-bold mb-4">Your order</h2>

          <div className="flex flex-col gap-4 w-full">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col rounded-md bg-customGray p-6 gap-6 w-full"
              >
                <CheckoutItem
                  item={item}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  showNoteEditor={showNoteEditor}
                  toggleNote={toggleNote}
                  notes={notes}
                  updateNote={updateNote}
                />

                <div className="w-full h-px bg-gray-700"></div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!protection[item.id]}
                    onChange={(e) =>
                      setProtection({
                        ...protection,
                        [item.id]: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-customOrange"
                  />

                  <div className="flex justify-between w-full">
                    <div>Product protection </div>
                    <div>${item.quantity}</div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </section>
        <CheckoutAddressSection
          addressMode={addressMode}
          setAddressMode={setAddressMode}
          existingAddress={existingAddress}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          userCountry={userCountry}
          countryLabel={countryLabel}
          newAddress={newAddress}
          setNewAddress={setNewAddress}
          saveAddress={saveAddress}
          setSaveAddress={setSaveAddress}
          errors={errors}
          setErrors={setErrors}
        />
        <section>
          <h2 className="text-lg font-semibold">Shipping</h2>
          <div className="rounded-[6] bg-customGray p-5 flex gap-4 items-end w-full">
            <ShieldIcon />
            <div className="w-full flex justify-between">
              <p>NexusHub Courier</p>
              <p>5$</p>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
          <div className="relative w-full">
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
              <div className="absolute mt-2 w-full bg-customGray rounded shadow z-10">
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
      <aside className="w-full lg:w-80 p-4 rounded bg-customGray self-start">
        <h2 className="text-xl font-bold mb-4">Summary</h2>
        <div className="flex justify-between mb-2">
          <span>
            Products ({selectedItems.reduce((sum, i) => sum + i.quantity, 0)})
          </span>
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

        <div className="my-3 w-full h-px bg-gray-700"></div>
        <div className="flex justify-between mt-1">
          <span>Transaction fee</span>
          <span>${transactionFee.toFixed(2)}</span>
        </div>
        <div className="my-3 w-full h-px bg-gray-700"></div>
        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Button onClick={handlePayNow} className="my-4 w-full">
          Pay now
        </Button>
      </aside>
    </div>
  );
}
