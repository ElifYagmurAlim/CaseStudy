// middlewares/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 30, // Bu sürede max 5 istek
  message: {
    message: 'Çok fazla giriş denemesi yapıldı. Lütfen 15 dakika sonra tekrar deneyin.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
// Kayıt işlemi için
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // Saatte 10 kayıt
  max: 10,
  message: {
    message: 'Çok fazla kayıt denemesi. Lütfen daha sonra tekrar deneyin.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

