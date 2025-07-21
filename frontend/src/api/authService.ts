// frontend/src/api/authService.ts
import axios from '../lib/axios';

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterPayload) => {
  const response = await axios.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data: LoginPayload) => {
  const response = await axios.post('/auth/login', data);
  return response.data;
};

export const verifyEmail = async (token: string): Promise<string> => {
  const res = await axios.get(`/auth/verify/${token}`);
  return res.data.message;
};


export const resendVerification = async (email: string) => {
  const response = await axios.post('/auth/resend-verification', { email });
  return response.data;
};

export const resendVerificationEmail = async (email: string): Promise<string> => {
  const res = await axios.post('/auth/verify/resend', { email });
  return res.data.message;
};