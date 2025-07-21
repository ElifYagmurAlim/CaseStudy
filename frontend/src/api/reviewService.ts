import api from '@/lib/axios';

export const canReviewProduct = async (productId: string): Promise<boolean> => {
  const res = await api.get(`/reviews/can-review/${productId}`);
  return res.data.canReview;
};

export const submitReview = async (
  productId: string,
  data: { comment: string; rating: number }
): Promise<void> => {
  await api.post(`/reviews/${productId}`, data);
};
