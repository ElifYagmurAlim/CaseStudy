
export interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
    phone?: string;
  addresses?: Address[];
    wishlist?: string[];

}

interface Address {
  street: string;
  city: string;
  postalCode: string;
}