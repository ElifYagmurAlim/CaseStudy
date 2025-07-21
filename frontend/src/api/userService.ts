import api from '@/lib/axios';

export const toggleWishlist = async (userId: string, productId: string): Promise<string[]> => {
  const res = await api.post(`/users/${userId}/wishlist/${productId}`);
  return res.data.wishlist;
};
