import { Router } from 'express';
import { storage } from '../services/storage.js';
import { verificationEngine } from '../services/verificationEngine.js';

export const claimsRouter = Router();

// GET /api/claims - Get all claims across cases
claimsRouter.get('/', (req, res) => {
  try {
    const { status, search } = req.query;
    const cases = storage.getAllCases();

    let allClaims: Array<any> = [];
    for (const c of cases) {
      for (const cl of c.claims) {
        allClaims.push({
          ...cl,
          caseId: c.id,
          caseNumber: c.caseNumber,
          caseTitle: c.title,
          category: c.category,
        });
      }
    }

    if (status && status !== 'ALL') {
      allClaims = allClaims.filter((cl) => cl.status === status);
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase();
      allClaims = allClaims.filter(
        (cl) =>
          cl.claimText.toLowerCase().includes(q) ||
          (cl.sourceTitle && cl.sourceTitle.toLowerCase().includes(q)) ||
          cl.caseTitle.toLowerCase().includes(q)
      );
    }

    const counts = {
      total: allClaims.length,
      verified: allClaims.filter((c) => c.status === 'VERIFIED').length,
      partiallySupported: allClaims.filter((c) => c.status === 'PARTIALLY_SUPPORTED').length,
      unverified: allClaims.filter((c) => c.status === 'UNVERIFIED').length,
      conflicting: allClaims.filter((c) => c.status === 'CONFLICTING').length,
      unableToVerify: allClaims.filter((c) => c.status === 'UNABLE_TO_VERIFY').length,
    };

    res.json({ success: true, counts, claims: allClaims });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
