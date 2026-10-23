import { Router } from 'express';
import { isGeminiConfigured } from '../services/gemini.js';
import { storage } from '../services/storage.js';

export const settingsRouter = Router();

// GET /api/settings - Current system configuration status (No secrets or keys exposed)
settingsRouter.get('/', (_req, res) => {
  const metrics = storage.getImpactMetrics();
  const configured = isGeminiConfigured();

  res.json({
    success: true,
    gemini: {
      isConfigured: configured,
      model: 'gemini-3.8-flash',
      mode: configured ? 'LIVE_GEMINI_API' : 'TRANSPARENT_CIVIC_RULE_ENGINE',
      credentialSource: configured
        ? 'Configured securely via server environment variables (.env)'
        : 'None (Operating in local civic intelligence fallback engine)',
    },
    system: {
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
      totalCases: metrics.totalCases,
      storageMode: 'LOCAL_PERSISTENT_JSON',
    },
  });
});
