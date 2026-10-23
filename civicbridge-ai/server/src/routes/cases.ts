import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../services/storage.js';
import { analyzeCaseInput, buildCaseFromAnalysis } from '../services/gemini.js';
import { verificationEngine } from '../services/verificationEngine.js';
import { TaskStatus } from '../types/index.js';

export const casesRouter = Router();

const CreateCaseSchema = z.object({
  userReport: z.string().min(5, 'User report must be at least 5 characters'),
  locationHint: z.string().optional(),
  incidentDate: z.string().optional(),
  attachments: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(['IMAGE', 'DOCUMENT', 'AUDIO']),
        url: z.string(),
        size: z.number(),
        summary: z.string().optional(),
      })
    )
    .optional(),
});

// GET /api/cases - List all cases
casesRouter.get('/', (req, res) => {
  try {
    let cases = storage.getAllCases();
    const { category, status, search } = req.query;

    if (category && category !== 'ALL') {
      cases = cases.filter((c) => c.category === category);
    }
    if (status && status !== 'ALL') {
      cases = cases.filter((c) => c.overallStatus === status);
    }
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase();
      cases = cases.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.caseNumber.toLowerCase().includes(q) ||
          c.userReport.toLowerCase().includes(q) ||
          c.location.rawInput.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: cases.length, cases });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/cases/:id - Retrieve case detail
casesRouter.get('/:id', (req, res) => {
  try {
    const found = storage.getCaseById(req.params.id);
    if (!found) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }
    res.json({ success: true, case: found });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/cases - Process unstructured input through Proof-to-Action Engine
casesRouter.post('/', async (req, res) => {
  try {
    const validated = CreateCaseSchema.parse(req.body);

    const attachments = (validated.attachments || []).map((a) => ({
      ...a,
      uploadedAt: new Date().toISOString(),
    }));

    // Step 1 & 2: Understand and Structure via Gemini
    const analysisResult = await analyzeCaseInput(
      validated.userReport,
      attachments,
      validated.locationHint
    );

    // Step 3 & 4: Build case, verify claims, recommend actions
    const newCase = buildCaseFromAnalysis(validated.userReport, attachments, analysisResult);

    // Save to persistence
    storage.createCase(newCase);

    res.status(201).json({
      success: true,
      case: newCase,
      message: 'Case analyzed and structured through Proof-to-Action Engine.',
    });
  } catch (err: any) {
    console.error('Case creation error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// PATCH /api/cases/:id/tasks/:taskId - Update action status
casesRouter.patch('/:id/tasks/:taskId', (req, res) => {
  try {
    const { id, taskId } = req.params;
    const { status, proofText, proofFileUrl } = req.body;

    const targetCase = storage.getCaseById(id);
    if (!targetCase) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    const taskIndex = targetCase.actions.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const validStatuses: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid task status' });
    }

    targetCase.actions[taskIndex].status = status;

    if (proofText || proofFileUrl) {
      targetCase.actions[taskIndex].outcomeProof = {
        text: proofText || targetCase.actions[taskIndex].outcomeProof?.text,
        fileUrl: proofFileUrl || targetCase.actions[taskIndex].outcomeProof?.fileUrl,
        submittedAt: new Date().toISOString(),
        verifiedOutcome: 'Logged and verified by user submission',
      };
    }

    // If task is completed, record an outcome
    if (status === 'COMPLETED') {
      const task = targetCase.actions[taskIndex];
      const outcomeExists = targetCase.recordedOutcomes.some((o) => o.id === `out-act-${task.id}`);
      if (!outcomeExists) {
        targetCase.recordedOutcomes.push({
          id: `out-act-${task.id}`,
          timestamp: new Date().toISOString(),
          title: `Action Completed: ${task.title}`,
          description: proofText || `Task marked completed for responsible entity: ${task.responsibleEntity}`,
          recordedBy: 'Case Coordinator / Citizen Action',
          isVerified: true,
          verificationProofUrl: proofFileUrl,
        });
      }
      targetCase.currentStage = 5; // Outcome tracked
      targetCase.overallStatus = 'ACTION_IN_PROGRESS';
    }

    // Check if all tasks are complete
    const allCompleted = targetCase.actions.length > 0 && targetCase.actions.every((t) => t.status === 'COMPLETED');
    if (allCompleted) {
      targetCase.overallStatus = 'RESOLVED';
    }

    storage.updateCase(id, targetCase);

    res.json({
      success: true,
      case: targetCase,
      updatedTask: targetCase.actions[taskIndex],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/cases/:id/verify-claim/:claimId - Recheck claim verification
casesRouter.post('/:id/verify-claim/:claimId', (req, res) => {
  try {
    const { id, claimId } = req.params;
    const targetCase = storage.getCaseById(id);
    if (!targetCase) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    const claimIndex = targetCase.claims.findIndex((c) => c.id === claimId);
    if (claimIndex === -1) {
      return res.status(404).json({ success: false, error: 'Claim not found' });
    }

    const claim = targetCase.claims[claimIndex];
    const rechecked = verificationEngine.verifyClaim(claim.claimText, claimIndex + 1);
    targetCase.claims[claimIndex] = rechecked;

    storage.updateCase(id, targetCase);

    res.json({
      success: true,
      case: targetCase,
      updatedClaim: rechecked,
      message: 'Claim re-verified against live authoritative civic feeds.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/cases/:id/outcomes - Record new verified outcome
casesRouter.post('/:id/outcomes', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, recordedBy, proofUrl } = req.body;

    const targetCase = storage.getCaseById(id);
    if (!targetCase) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    const newOutcome = {
      id: `out-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: title || 'Civic Action Result Recorded',
      description: description || 'Outcome reported by community member or agency liaison.',
      recordedBy: recordedBy || 'Community Member',
      isVerified: true,
      verificationProofUrl: proofUrl,
    };

    targetCase.recordedOutcomes.push(newOutcome);
    targetCase.currentStage = 5;

    storage.updateCase(id, targetCase);

    res.status(201).json({ success: true, case: targetCase, outcome: newOutcome });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/cases/reset-demo - Reset demo dataset
casesRouter.post('/reset-demo', (req, res) => {
  try {
    storage.resetDemoData();
    res.json({
      success: true,
      message: 'Demo dataset restored to initial presentation state.',
      cases: storage.getAllCases(),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
