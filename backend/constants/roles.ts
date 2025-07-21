export const Roles = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
} as const;

export type RoleType = typeof Roles[keyof typeof Roles];
