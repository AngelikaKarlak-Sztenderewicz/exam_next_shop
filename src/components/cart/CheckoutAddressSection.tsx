'use client';

import { Dispatch, SetStateAction } from 'react';

type Address = {
  id: number;
  street: string;
  city: string;
  zip: string;
  country: string;
};

type NewAddress = {
  street: string;
  city: string;
  zip: string;
  country: string;
};

type AddressErrors = {
  street?: string;
  city?: string;
  zip?: string;
};

type Props = {
  addressMode: 'existing' | 'new';
  setAddressMode: Dispatch<SetStateAction<'existing' | 'new'>>;
  existingAddress: Address | null;
  selectedAddress: number | null;
  setSelectedAddress: Dispatch<SetStateAction<number | null>>;
  userCountry: string;
  countryLabel: string;
  newAddress: NewAddress;
  setNewAddress: Dispatch<SetStateAction<NewAddress>>;
  saveAddress: boolean;
  setSaveAddress: Dispatch<SetStateAction<boolean>>;
  errors: AddressErrors;
  setErrors: Dispatch<SetStateAction<AddressErrors>>;
};

export function CheckoutAddressSection({
  addressMode,
  setAddressMode,
  existingAddress,
  selectedAddress,
  setSelectedAddress,
  userCountry,
  countryLabel,
  newAddress,
  setNewAddress,
  saveAddress,
  setSaveAddress,
  errors,
  setErrors,
}: Props) {
  return (
    <section className="w-full">
      <h2 className="text-lg font-semibold mb-4">Address</h2>

      <div className="rounded-[6] bg-customGray p-5 w-full">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setAddressMode('existing')}
            className={`flex justify-center items-center font-medium text-xl transition-all
          ${
            addressMode === 'existing'
              ? 'text-customOrange border-b-2 border-customOrange p-2 mb-2'
              : 'text-white'
          }`}
          >
            Existing address
          </button>
          <button
            type="button"
            onClick={() => setAddressMode('new')}
            className={`flex justify-center items-center font-medium text-xl transition-all
          ${
            addressMode === 'new'
              ? 'text-customOrange border-b-2 border-customOrange p-2 mb-2'
              : 'text-white'
          }`}
          >
            New address
          </button>
        </div>
        <div className="w-full flex flex-col gap-4">
          {addressMode === 'existing' && (
            <div>
              {existingAddress ? (
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-3">
                    <div className="text-sm inline-flex self-start rounded-md bg-customOrange py-2 px-3">
                      Main Address
                    </div>
                    <div>
                      {existingAddress.street}, {existingAddress.city},{' '}
                      {existingAddress.zip}, {userCountry}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-400">Country</span>
                      <span>{userCountry}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-sm">Street</span>
                      <span className="break-all">
                        {existingAddress.street}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-s">City</span>
                      <span className="break-all">{existingAddress.city}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-sm">ZIP</span>
                      <span className="break-all">{existingAddress.zip}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>You have no saved address</div>
              )}
            </div>
          )}

          {addressMode === 'new' && (
            <div className="flex flex-col gap-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <input
                    value={countryLabel}
                    readOnly
                    disabled
                    className="border rounded-lg px-3 py-2 w-full cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col">
                  <input
                    placeholder="Street"
                    className={`border rounded-lg px-3 py-2 w-full ${
                      errors.street ? 'border-red-500' : ''
                    }`}
                    value={newAddress.street}
                    onChange={(e) => {
                      setErrors((p) => ({ ...p, street: undefined }));
                      setNewAddress((p) => ({ ...p, street: e.target.value }));
                    }}
                  />
                  {errors.street && (
                    <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <input
                    placeholder="City"
                    className={`border rounded-lg px-3 py-2 w-full ${
                      errors.city ? 'border-red-500' : ''
                    }`}
                    value={newAddress.city}
                    onChange={(e) => {
                      setErrors((p) => ({ ...p, city: undefined }));
                      setNewAddress((p) => ({ ...p, city: e.target.value }));
                    }}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <input
                    placeholder="ZIP"
                    className={`border rounded-lg px-3 py-2 w-full ${
                      errors.zip ? 'border-red-500' : ''
                    }`}
                    value={newAddress.zip}
                    onChange={(e) => {
                      setErrors((p) => ({ ...p, zip: undefined }));
                      setNewAddress((p) => ({ ...p, zip: e.target.value }));
                    }}
                  />
                  {errors.zip && (
                    <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
                  )}
                </div>
              </div>
              <textarea
                placeholder="Complete address details (optional)"
                className="border rounded-lg px-3 py-2 w-full resize-none"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                  className="w-4 h-4 accent-customOrange"
                />
                Make it the main address
              </label>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
