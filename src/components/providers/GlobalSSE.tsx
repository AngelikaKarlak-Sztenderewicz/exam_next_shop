'use client';

import { useSSE } from '@/components/providers/SSEProvider';

export function GlobalSSE() {
  const { event } = useSSE();
  if (!event) return null;

  const bg = event.type === 'error' ? 'bg-red-600' : 'bg-green-600';

  return (
    <div
      className={`${bg} fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded shadow`}
    >
      {event.message}
    </div>
  );
}
