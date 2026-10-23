import { Router } from 'express';
import { storage } from '../services/storage.js';

export const impactRouter = Router();

// GET /api/impact - Get impact metrics
impactRouter.get('/', (req, res) => {
  try {
    const metrics = storage.getImpactMetrics();
    res.json({ success: true, metrics });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
