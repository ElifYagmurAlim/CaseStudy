import api from '@/lib/axios';
import { User } from '@/types/user';
import { Product } from '@/types/product';

export const fetchUsers = async (): Promise<User[]> => {
  const res = await api.get('/users');
  return res.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const updateUserProfile = async (userId: string, data: any) => {
  const res = await api.patch(`/users/${userId}`, data);
  return res.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const toggleWishlist = async (userId: string, productId: string) => {
  const res = await api.post(`/users/${userId}/wishlist/${productId}`);
  return res.data;
};

export const getWishlist = async (userId: string): Promise<Product[]> => {
  const res = await api.get(`/users/${userId}/wishlist`);
  return res.data;
};

export const removeFromWishlist = async (productId: string) => {
  await api.delete(`/users/wishlist/${productId}`);
};