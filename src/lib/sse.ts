let clients: WritableStreamDefaultWriter[] = [];

export function registerClient(writer: WritableStreamDefaultWriter) {
  clients.push(writer);
}

export function unregisterClient(writer: WritableStreamDefaultWriter) {
  clients = clients.filter(w => w !== writer);
}

export function notify(event: SSEEvent) {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  const encoder = new TextEncoder();
  clients.forEach((w) => {
    try {
      w.write(encoder.encode(payload));
    } catch {
    }
  });
}

export type SSEEvent = {
  type: 'cart:add' | 'cart:remove' | 'error';
  message: string;
};
