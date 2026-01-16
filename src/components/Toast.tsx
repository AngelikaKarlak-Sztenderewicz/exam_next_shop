'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';
import { ThankYouIcon } from './icons/ThankYouIcon';
import { ErrorIcon } from './icons/ErrorIcon';

export default function Toast() {
  const { toast, hideToast } = useUIStore();

  useEffect(() => {
    if (toast.open) {
      const timer = setTimeout(() => hideToast(), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.open, hideToast]);

  if (!toast.open) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="w-full flex justify-start mt-4 p-4">
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-md shadow-lg
        ${isSuccess ? 'bg-green-600' : 'bg-red-600'} w-full`}
      >
        {isSuccess ? (
          <ThankYouIcon className="h-5 w-5" />
        ) : (
          <ErrorIcon className="h-5 w-5" />
        )}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
}
