import { create } from 'zustand';

type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

type CartState = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

//zustand chart management (state store) - upgrades chart from anywhere on app.
export const useCart = create<CartState>((set) => ({
  items: [],
  addToCart: (item) => //add item
    set((state) => {
      const existing = state.items.find(i => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map(i =>
            i.productId === item.productId ? { ...i, qty: i.qty + item.qty } : i
          )
        };
      }
      return { items: [...state.items, item] };
    }),
  removeFromCart: (productId) => //remove item
    set((state) => ({
      items: state.items.filter(i => i.productId !== productId)
    })),
  clearCart: () => set({ items: [] }) //remove all items
}));
