import { NextRequest } from 'next/server';
import { registerClient, unregisterClient } from '@/lib/sse';

export async function GET(req: NextRequest) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  registerClient(writer);
  writer.write(encoder.encode('retry: 1000\n\n'));

  req.signal.addEventListener('abort', () => {
    unregisterClient(writer);
    writer.close();
  });

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
