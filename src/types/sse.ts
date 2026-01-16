export type SSEEvent = {
  type: 'cart:add' | 'cart:remove' | 'error';
  message: string;
};