// src/api/orders.ts
import api from '@/lib/axios';
import { Order, CreateOrderPayload } from '@/types/order'

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  const res = await api.get(`/orders/user/${userId}`);
  return res.data;
};

export const getUserOrders = async (): Promise<Order[]> => {
  const res = await api.get('/orders/user');
  return res.data;
};

export const fetchOrders = async (): Promise<Order[]> => {
  const res = await api.get('/orders');
  return res.data;
};

export const createOrder = async (payload: CreateOrderPayload): Promise<void> => {
  await api.post('/orders', payload);
};

export const getOrderById = async (id: string): Promise<Order> => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

export const updateOrderStatus = async (
  id: string,
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
): Promise<Order> => {
  const res = await api.patch(`/orders/${id}/status`, { status });
  return res.data.order;
};

