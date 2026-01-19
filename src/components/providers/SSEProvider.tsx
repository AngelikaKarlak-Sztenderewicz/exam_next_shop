'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { SSEEvent } from '@/types/sse';

interface SSEContextValue {
  event: SSEEvent | null;
}

const SSEContext = createContext<SSEContextValue | undefined>(undefined);

export function SSEProvider({ children }: { children: React.ReactNode }) {
  const [event, setEvent] = useState<SSEEvent | null>(null);

  useEffect(() => {
    const es = new EventSource('/api/events');

    es.onmessage = (e) => {
      try {
        const data: SSEEvent = JSON.parse(e.data);
        setEvent(data);
      } catch (err) {}
    };

    return () => es.close();
  }, []);

  return (
    <SSEContext.Provider value={{ event }}>{children}</SSEContext.Provider>
  );
}

export function useSSE() {
  const ctx = useContext(SSEContext);
  if (!ctx) throw new Error('useSSE must be used inside SSEProvider');
  return ctx;
}
