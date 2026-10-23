import { Router } from 'express';
import { storage } from '../services/storage.js';

export const resourcesRouter = Router();

// GET /api/resources - Get community resources
resourcesRouter.get('/', (req, res) => {
  try {
    const { category, search } = req.query;
    const resources = storage.getResources(
      typeof category === 'string' ? category : undefined,
      typeof search === 'string' ? search : undefined
    );
    res.json({ success: true, count: resources.length, resources });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
