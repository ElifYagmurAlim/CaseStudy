
export interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
    phone?: string;
  addresses?: any[];
}