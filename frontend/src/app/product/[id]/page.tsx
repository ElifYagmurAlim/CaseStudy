'use client';

import api from '@/lib/axios';
import { useCart } from '@/store/cart';

type Params = {
  params: {
    id: string;
  };
};

export default async function ProductDetail({ params }: Params) {
  const { data: product } = await api.get(`/products/${params.id}`);
  const addToCart = useCart(state => state.addToCart); //zustand store relation

  //add item to chart
  const handleAdd = () => {  
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      qty: 1
    });
    alert('Ürün sepete eklendi!');
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-lg text-gray-600 mb-4">{product.price}₺</p>
      <p>{product.description}</p>
      <button
        onClick={handleAdd}
        className="mt-6 px-4 py-2 bg-black text-white rounded"
      >
        Sepete Ekle
      </button>
    </main>
  );
}
