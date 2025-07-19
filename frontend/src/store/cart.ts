// store/cart.ts
import { create } from 'zustand';
import { CartItem } from '@/types/types';
import { persist } from 'zustand/middleware';

type CartState  = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item) => {
        const existing = get().items.find(i => i.productId === item.productId);
        if (existing) {
          set({
            items: get().items.map(i =>
              i.productId === item.productId ? { ...i, qty: i.qty + item.qty } : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeFromCart: (id) =>
        set({ items: get().items.filter(i => i.productId !== id) }),
      updateQty: (productId, qty) =>
    set({
      items: get().items.map((i) =>
        i.productId === productId ? { ...i, qty } : i
      ),
    }),
  clearCart: () => set({ items: [] }),
  total: () =>
    get().items.reduce((acc, item) => acc + item.price * item.qty, 0),  
    }),
    {
      name: 'cart-storage', // 👈 localStorage key
    }
  )
);