import express from 'express';
import ViewedTogether from '../models/viewedTogether';

const router = express.Router();

router.post('/viewed-together', async (req, res) => {
  const { current, recent } = req.body;
  try {
    const doc = await ViewedTogether.findOne({ productId: current }) || new ViewedTogether({ productId: current, viewedWith: [] });

    recent.forEach((r) => {
      if (!doc.viewedWith.includes(r)) {
        doc.viewedWith.push(r);
      }
    });

    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Güncelleme başarısız' });
  }
});
