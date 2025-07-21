export interface OrderItem {
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  shippingAddress: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}