import api from '@/lib/axios';
import { Category } from '@/types/category';

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories');
  return response.data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const res = await api.get(`/categories/${id}`);
  return res.data;
};

// src/api/categories.ts
export const createCategory = async (formData: FormData): Promise<void> => {
  await api.post('/categories', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateCategory = async (id: string, formData: FormData): Promise<void> => {
  await api.patch(`/categories/${id}`, formData);
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};