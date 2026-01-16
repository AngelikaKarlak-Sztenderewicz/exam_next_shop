import { create } from 'zustand';

type ToastType = 'success' | 'error';

type ToastState = {
  open: boolean;
  message: string;
  type: ToastType;
};

type UIState = {
  toast: ToastState;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  toast: {
    open: false,
    message: '',
    type: 'success',
  },

  showToast: (message, type = 'success') => {
    set({
      toast: {
        open: true,
        message,
        type,
      },
    });

    setTimeout(() => {
      set({
        toast: {
          open: false,
          message: '',
          type,
        },
      });
    }, 3000);
  },

  hideToast: () =>
    set({
      toast: {
        open: false,
        message: '',
        type: 'success',
      },
    }),
}));
