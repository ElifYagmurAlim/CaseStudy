🛍️ Elif'in Mağazası – E-Ticaret Platformu
Modern, mobil uyumlu ve yönetilebilir bir e-ticaret uygulamasıdır. Hem müşteri hem de admin paneli içerir. Ürün inceleme, filtreleme, sepet, kullanıcı hesabı, öneri sistemi gibi birçok özellikle donatılmıştır.

📦 Özellikler (Case Bazlı Takip)
Özellik | Açıklama
---|---
✅ App Router & Next.js 14 | App Router yapısı ile kurulmuştur.
✅ TypeScript & Tailwind CSS | Tamamen TypeScript ile yazıldı, stiller Tailwind ile sağlandı.
✅ Zustand ile State Yönetimi | auth, cart gibi slice'larda Zustand kullanıldı.
✅ Formlar RHF & Zod | Kayıt, giriş, ürün, kategori ekleme gibi tüm formlar React Hook Form + Zod.
✅ JWT ile Kimlik Doğrulama | Kullanıcı ve admin oturumları JWT ile yönetilir.
✅ Ürün İnceleme Sistemi | Yorum, puanlama ve admin onay sistemi mevcut.
✅ Sepet ve Sipariş Sistemi | Ürün ekleme, sepet yönetimi, sipariş takibi gibi adımlar içerir.
✅ Öneri Sistemi (Simple Algorithm) | ViewedTogether mantığı, popüler ürünler, benzer ürünler vs.
✅ Son Görüntülenenler | LocalStorage tabanlı öneri sistemi ana sayfada yer alır.
✅ SEO - metadata API | app/page.tsx içinde export const metadata kullanıldı.
✅ Admin Panel | Sipariş, kullanıcı, ürün, kategori yönetimi içerir.
✅ Rate Limiting | login ve register istekleri için var.
✅ File Upload - Multer | Ürün ve kategori görsel yüklemeleri yapılabilir.
✅ Responsive Design | Tüm sayfalar mobil uyumlu olarak tasarlanmıştır.

⚙️ Teknoloji ve Araçlar  
**Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, RHF + Zod  
**Backend:** Node.js 18, Express.js, MongoDB, Mongoose, JWT, Multer, bcrypt, Nodemailer  
**Veritabanı:** MongoDB (Docker ile containerized ortamda)  
**Deployment:** (Opsiyonel - Vercel ya da Heroku üzerinden yapılabilir)  

🔧 Kurulum ve Çalıştırma  
**Gerekli Araçlar:**  
- Node.js >=18  
- Docker (MongoDB için önerilir)  
- npm veya yarn  

**1. Projeyi Klonlayın**  
```bash
git clone https://github.com/ElifYagmurAlim/CaseStudy.git
cd CaseStudy
```

**2. Ortam Değişkenleri (.env)**  
Örnek:  
```env
# .env.example (backend için)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/store
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

**3. Veritabanı (Opsiyonel Seed)**  
```bash
cd backend
npm install
npm run seed
```

**4. Backend'i Başlat**  
```bash
cd backend
npm install
npm run dev
```

**5. Frontend'i Başlat**  
```bash
cd frontend
npm install
npm run dev
```

👤 **Demo Giriş Bilgileri**  
**Admin**  
- Email: elifalim1506@gmail.com  
- Şifre: asd123  

**Kullanıcı**  
- Email: elifyagmuralim@gmail.com  
- Şifre: asd123  

📘 **Yorum Yapma ve Üye Olurken Email Gönderme**  

Register ekranından kayıt sonlanınca kullanıcının kayıt olduğu maile bu şekilde mail iletilmektedir.

Yorum yapmak için kullanıcının siparişinin durumunun teslim edildi olması gerekmektedir. Siparişi teslim edilen kullanıcı ürün detay sayfasında yorumlar alanında yorum yap paneline erişim sağlayıp değerlendirme yapabilecektir.

Hesabınızı doğrulamak için linke tıklayın: http://localhost:3000/verify/[token]

📈 **Bonus Özellikler**
- 📊 Admin Dashboard'da temel istatistik görselleri
- 🔍 Gelişmiş ürün filtreleme (stok, varyant, fiyat, kategori vs.)
- 📬 E-posta servisi entegrasyonu (Nodemailer)
- ⚠️ HTTPS, XSS koruması, input validation

📁 **Klasör Yapısı**
```
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
```

📡 **API Endpoint Listesi**  

🔐 **Auth (Kimlik Doğrulama)**  
- POST /api/auth/register – Kullanıcı kaydı  
- POST /api/auth/login – Giriş yap  
- POST /api/auth/logout – Oturumu sonlandır  
- POST /api/auth/forgot-password – Şifre sıfırlama bağlantısı gönder  
- POST /api/auth/reset-password/:token – Yeni şifre belirleme  

👤 **User (Kullanıcı İşlemleri)**  
- GET /api/users/:id – Kullanıcı bilgilerini getir  
- PUT /api/users/:id – Kullanıcı bilgilerini güncelle  
- POST /api/users/:id/wishlist/:productId – Favorilere ürün ekle/çıkar  
- GET /api/users/:id/orders – Kullanıcının sipariş geçmişi  
- GET /api/users – Tüm kullanıcıları getir (admin)  

📦 **Product (Ürünler)**  
- GET /api/products – Tüm ürünleri getir  
- GET /api/products/:id – Ürün detayları  
- POST /api/products – Yeni ürün oluştur (admin)  
- PUT /api/products/:id – Ürün güncelle (admin)  
- DELETE /api/products/:id – Ürün sil (admin)  
- GET /api/products/:id/related – Benzer ürünler getir  
- GET /api/products/:id/viewed-together – Birlikte görüntülenen ürünler  
- POST /api/products/:id/viewed – Ürünü görüntülendi olarak işaretle  
- POST /api/products/update-viewed-together – ViewedTogether güncelle  

🛒 **Cart (Sepet)**  
- GET /api/cart  
- POST /api/cart  
- PUT /api/cart/:productId  
- DELETE /api/cart/:productId  

📦 **Orders (Siparişler)**  
- POST /api/orders  
- GET /api/orders (admin)  
- GET /api/orders/:id  
- PUT /api/orders/:id/status (admin)  

📝 **Reviews (Yorumlar)**  
- POST /api/reviews/:productId  
- GET /api/reviews/product/:productId  
- GET /api/reviews/can-review/:productId  

🗂️ **Categories (Kategoriler)**  
- GET /api/categories  
- POST /api/categories (admin)  
- PUT /api/categories/:id (admin)  
- DELETE /api/categories/:id (admin)  

📊 **Admin Panel**  
- GET /api/admin/stats  
- GET /api/admin/sales-data  

🤖 **Recommendations (Basit Öneri Sistemi)**  
- GET /api/recommendations/popular  
- GET /api/recommendations/recent  
- POST /api/products/update-viewed-together  

🚀 **Kullanılan Teknolojiler**  

🔧 **Backend:**  
- Node.js (v18+)  
- Express.js  
- MongoDB + Mongoose  
- JWT ile kimlik doğrulama  
- bcrypt ile şifre güvenliği  
- CORS yapılandırması  
- Multer ile dosya yükleme  
- express-validator  
- Opsiyonel: Zod, rate limiter  

🎯 **Frontend:**  
- Next.js 14 (App Router)  
- React 18 + TypeScript  
- Tailwind CSS  
- Zustand (auth & cart)  
- RHF + Zod  
- Lucide Icons / React Icons  
- Metadata API (SEO)
