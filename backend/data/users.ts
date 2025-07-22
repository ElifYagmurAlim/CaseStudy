import { Types } from 'mongoose';

export const userSeeds = [
  {
    _id: new Types.ObjectId('687f5490f4bcbe4058fe62b4'),
    email: 'admin@admin.com',
    password: '$2b$10$u9zMqSDe/X3FoNWqlLxgfe07WjqviL9AsT2UTuESCnEvI4WVPIVo2', // hashlenmiş şifre
    role: 'admin',
    firstName: 'Admin',
    lastName: 'Alim',
    addresses: [],
    wishlist: [],
    favorites: [],
    isVerified: true,
    recentViews: [],
    emailVerified: false,
    __v: 0,
    cart: []
  },
  {
    _id: new Types.ObjectId('687f5490f4bcbe4058fe62b6'),
    email: 'customer@gmail.com',
    password: '$2b$10$TAV0h.ne2aINkXp0xir3luZL.CEeBOxwRaIP/3ONuW./BWtIMxp0G', // hashlenmiş şifre (asd123 gibi olabilir)
    role: 'customer',
    firstName: 'customer',
    lastName: 'customer',
    phone: '5308449744',
    addresses: [
      {
        street: 'sisli',
        city: 'istanbul',
        postalCode: '43454',
        _id: new Types.ObjectId('687f5490f4bcbe4058fe62b7'),
      },
      {
        street: 'a',
        city: 'a',
        postalCode: '43123',
        _id: new Types.ObjectId('687f7ed0ed3f1f95d8e537b8'),
      }
    ],
    wishlist: [new Types.ObjectId('687f5490f4bcbe4058fe62bb')], // Pasta ürünü
    favorites: [],
    isVerified: true,
    recentViews: [],
    emailVerified: false,
    cart: [],
    __v: 1
  }
];
