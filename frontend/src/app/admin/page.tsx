import { redirect } from 'next/navigation';

export default function AdminRootPage() {
  // /admin geldiğinde otomatik olarak dashboard'a yönlendir
  redirect('/admin/dashboard');
}