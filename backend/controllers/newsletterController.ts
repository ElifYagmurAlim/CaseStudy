import { Request, Response } from 'express';
import Subscriber from '../models/subscriber';

export const subscribeNewsletter = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Geçerli bir e-posta giriniz.' });
  }

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Zaten abone oldunuz.' });
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();

    res.status(201).json({ message: 'Başarıyla abone olundu!' });
  } catch (err) {
    console.error('Abonelik hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
