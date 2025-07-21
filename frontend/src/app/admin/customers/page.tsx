'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchUsers, deleteUser } from '@/api/userService';
import { User } from '@/types/user';

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const deleteUser = async (id: string) => {
    if (!confirm('Bu kullanıcı silinecek. Emin misiniz?')) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert('Kullanıcı silinemedi.');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Müşteriler</h1>

      <input
        type="text"
        placeholder="E-posta veya isim ara..."
        className="border px-3 py-2 rounded mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">İsim</th>
              <th className="p-2">Email</th>
              <th className="p-2">Rol</th>
              <th className="p-2">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user._id} className="border-t">
                <td className="p-2">{user.firstName} {user.lastName}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2 space-x-2">
                  <Link href={`/admin/customers/${user._id}`} className="text-blue-600 underline">Detay</Link>
                  <button onClick={() => deleteUser(user._id)} className="text-red-600 underline">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
