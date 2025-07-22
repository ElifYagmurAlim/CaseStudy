import axios from '@/lib/axios';

export const subscribeToNewsletter = async (email: string) => {
  const res = await axios.post('/newsletter', { email });
  return res.data;
};
