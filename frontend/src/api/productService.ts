import api from '@/lib/axios';
import { Product } from '@/types/product';

export interface CreateProductPayload extends Omit<Product, '_id'> {}
export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

export const getProducts = async (categoryId?: string): Promise<Product[]> => {
  const url = categoryId ? `/products?category=${categoryId}` : '/products';
  const res = await api.get(url);
  return res.data;
};


export const getProductById = async (id: string): Promise<Product> => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (formData: FormData): Promise<void> => {
  await api.post('/products', formData);
};

export const updateProduct = async (
  id: string,
  data: UpdateProductPayload
): Promise<Product> => {
  const res = await api.patch(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};

export const bulkUpdateProductStatus = async (
  ids: string[],
  status: boolean
): Promise<void> => {
  await api.patch('/products/bulk-status', { ids, status });
};

export const getRelatedProducts = async (id: string): Promise<Product[]> => {
  const res = await api.get(`/products/${id}/related`);
  return res.data;
};

export const getViewedTogether = async (id: string): Promise<Product[]> => {
  const res = await api.get(`/products/${id}/viewed-together`);
  return res.data;
};

export const markProductAsViewed = async (id: string) => {
  return await api.post(`/products/${id}/viewed`);
};

export const updateViewedTogether = async (current: string, recent: string[]) => {
  return await api.post(`/products/update-viewed-together`, {
    current,
    recent,
  });
};