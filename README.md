🛍️ Elif'in Mağazası – E-Ticaret Platformu
Modern, mobil uyumlu ve yönetilebilir bir e-ticaret uygulamasıdır. Hem müşteri hem de admin paneli içerir. Ürün inceleme, filtreleme, sepet, kullanıcı hesabı, öneri sistemi gibi birçok özellikle donatılmıştır.

📦 Özellikler (Case Bazlı Takip)
Özellik	Açıklama
✅ App Router & Next.js 14	App Router yapısı ile kurulmuştur.
✅ TypeScript & Tailwind CSS	Tamamen TypeScript ile yazıldı, stiller Tailwind ile sağlandı.
✅ Zustand ile State Yönetimi	auth, cart gibi slice'larda Zustand kullanıldı.
✅ Formlar RHF & Zod	Kayıt, giriş, ürün, kategori ekleme gibi tüm formlar React Hook Form + Zod.
✅ JWT ile Kimlik Doğrulama	Kullanıcı ve admin oturumları JWT ile yönetilir.
✅ Ürün İnceleme Sistemi	Yorum, puanlama ve admin onay sistemi mevcut.
✅ Sepet ve Sipariş Sistemi	Ürün ekleme, sepet yönetimi, sipariş takibi gibi adımlar içerir.
✅ Öneri Sistemi (Simple Algorithm)	ViewedTogether mantığı, popüler ürünler, benzer ürünler vs.
✅ Son Görüntülenenler	LocalStorage tabanlı öneri sistemi ana sayfada yer alır.
✅ SEO - metadata API	app/page.tsx içinde export const metadata kullanıldı.
✅ Admin Panel	Sipariş, kullanıcı, ürün, kategori yönetimi içerir.
✅ Rate Limiting	login ve register alanları için içerir.
✅ File Upload - Multer	Ürün ve kategori görsel yüklemeleri yapılabilir.
✅ Responsive Design	Tüm sayfalar mobil uyumlu olarak tasarlanmıştır.

⚙️ Teknoloji ve Araçlar
Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, RHF + Zod

Backend: Node.js 18, Express.js, MongoDB, Mongoose, JWT, Multer, bcrypt, Nodemailer

Veritabanı: MongoDB (Docker ile containerized ortamda)

Deployment: (Opsiyonel - Vercel ya da Heroku üzerinden yapılabilir)

🔧 Kurulum ve Çalıştırma
Gerekli Araçlar:
Node.js >=18

Docker (MongoDB için önerilir)

npm veya yarn

1. Projeyi Klonlayın
bash
Kopyala
Düzenle
git clone https://github.com/ElifYagmurAlim/CaseStudy.git
cd CaseStudy
2. Ortam Değişkenleri (.env)
Örnek:

env
Kopyala
Düzenle
# .env.example (backend için)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/efikstore
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
3. Veritabanı (Opsiyonel Seed)
bash
Kopyala
Düzenle
cd backend
npm install
npm run seed  # Seed scripti varsa, değilse elle eklenmeli
4. Backend'i Başlat
bash
Kopyala
Düzenle
cd backend
npm install
npm run dev
5. Frontend'i Başlat
bash
Kopyala
Düzenle
cd frontend
npm install
npm run dev
👤 Demo Giriş Bilgileri
Admin
Email: admin@example.com

Şifre: Admin123

Kullanıcı
Email: user@example.com

Şifre: User123

(Bu hesapları .env seed ile eşleştirerek oluşturun)

📘 API Endpoint Örnekleri
Yöntem	Endpoint	Açıklama
GET	/api/products	Tüm ürünleri getir
GET	/api/products/:id	Ürün detayları
POST	/api/products/:id/review	Ürüne yorum yap
POST	/api/orders	Sipariş oluştur
POST	/api/users/register	Kayıt ol
POST	/api/users/login	Giriş yap
POST	/api/products/update-viewed-together	ViewedTogether güncelle

📈 Bonus Özellikler
📊 Admin Dashboard'da temel istatistik görselleri

🔍 Gelişmiş ürün filtreleme (stok, varyant, fiyat, kategori vs.)

📬 E-posta servisi entegrasyonu (Nodemailer)

⚠️ HTTPS, XSS koruması, input validation

📁 Klasör Yapısı
bash
Kopyala
Düzenle
├── frontend/
│   ├── app/
│   ├── components/
│   ├── store/
│   └── lib/
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── utils/
