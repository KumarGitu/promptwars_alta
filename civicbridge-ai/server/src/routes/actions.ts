import { Router } from 'express';
import { storage } from '../services/storage.js';

export const actionsRouter = Router();

// GET /api/actions - Get all tasks across cases
actionsRouter.get('/', (req, res) => {
  try {
    const { priority, status, search } = req.query;
    const cases = storage.getAllCases();

    let allActions: Array<any> = [];
    for (const c of cases) {
      for (const act of c.actions) {
        allActions.push({
          ...act,
          caseId: c.id,
          caseNumber: c.caseNumber,
          caseTitle: c.title,
          category: c.category,
        });
      }
    }

    if (priority && priority !== 'ALL') {
      allActions = allActions.filter((a) => a.priority === priority);
    }
    if (status && status !== 'ALL') {
      allActions = allActions.filter((a) => a.status === status);
    }
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase();
      allActions = allActions.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.responsibleEntity.toLowerCase().includes(q) ||
          a.caseTitle.toLowerCase().includes(q)
      );
    }

    const counts = {
      total: allActions.length,
      pending: allActions.filter((a) => a.status === 'PENDING').length,
      inProgress: allActions.filter((a) => a.status === 'IN_PROGRESS').length,
      completed: allActions.filter((a) => a.status === 'COMPLETED').length,
      blocked: allActions.filter((a) => a.status === 'BLOCKED').length,
    };

    res.json({ success: true, counts, actions: allActions });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
