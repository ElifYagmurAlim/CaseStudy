'use client';

import Link from 'next/link';

type Props = {
  _id: string;
  name: string;
  price: number;
};

export default function ProductCard({ _id, name, price }: Props) {
  return (
    <Link href={`/product/${_id}`}>
      <div className="border p-4 rounded hover:shadow cursor-pointer transition">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600">{price}₺</p>
      </div>
    </Link>
  );
}
