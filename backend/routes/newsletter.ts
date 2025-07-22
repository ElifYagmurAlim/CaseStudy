import express from 'express';
import { subscribeNewsletter } from '../controllers/newsletterController';

const router = express.Router();

// POST /api/newsletter
router.post('/', subscribeNewsletter);

export default router;
