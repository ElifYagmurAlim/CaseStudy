// src/api/dashboard.ts
import api from '@/lib/axios';
import { DashboardData } from '@/types/dashboard';

export const fetchDashboardData = async (range: string): Promise<DashboardData> => {
  const res = await api.get(`/admin/dashboard?range=${range}`);
  return res.data;
};
