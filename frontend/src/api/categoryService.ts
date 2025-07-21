import api from '@/lib/axios';
import { Category } from '@/types/category';

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories');
  return response.data;
};