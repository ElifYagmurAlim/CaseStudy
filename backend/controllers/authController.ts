import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import { generateToken } from '../utils/generateToken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail';

export const registerUser = async (req: Request, res: Response) => {
try {
    const { email, password, firstName, lastName } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Bu e-posta zaten kayıtlı.' });

    const hashed = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(32).toString('hex');
    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    const user = await User.create({
      email,
      password: hashed,
      firstName,
      lastName,
      emailVerificationToken: token,
      emailVerified: false,
    });

    await sendEmail(
      email,
      'E-posta Doğrulama',
      `Merhaba ${firstName || ''},\n\nLütfen e-posta adresinizi doğrulamak için aşağıdaki bağlantıya tıklayın:\n\n${verifyLink}\n\nTeşekkürler.`,
    );

    res.status(201).json({ message: 'Kayıt başarılı. Lütfen e-postanızı doğrulayın.' });
  } catch (err) {
    console.error('Kayıt hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');;
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });
    
    if (!user.isVerified && user.role === 'customer') {
      return res.status(403).json({ message: 'E-posta adresiniz henüz doğrulanmamış. Lütfen e-postanızı kontrol edin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      addresses: user.addresses,
      token: generateToken(user._id.toString()),
    });
  } catch (err) {
    console.error('LOGIN error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id).select('+password');
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mevcut şifre yanlış' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Şifre başarıyla güncellendi' });
  } catch (err) {
    console.error('Şifre güncelleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ message: 'Geçersiz bağlantı.' });
    }

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Doğrulama başarısız veya token süresi dolmuş olabilir.' });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'E-posta başarıyla doğrulandı.' });
  } catch (err) {
    console.error('Doğrulama hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    if (user.isVerified) return res.status(400).json({ message: 'Hesap zaten doğrulanmış' });

    const verificationToken = user.verificationToken;

    const url = `http://localhost:3000/verify/${verificationToken}`;

    await sendEmail(user.email, 'E-posta Doğrulama', `Hesabınızı doğrulamak için linke tıklayın: ${url}`);
    return res.json({ message: 'Doğrulama e-postası yeniden gönderildi' });

  } catch (err) {
    return res.status(500).json({ message: 'Hata oluştu', error: err });
  }
};