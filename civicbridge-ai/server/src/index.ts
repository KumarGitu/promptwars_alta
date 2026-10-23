import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import dotenv from 'dotenv';
import { casesRouter } from './routes/cases.js';
import { claimsRouter } from './routes/claims.js';
import { actionsRouter } from './routes/actions.js';
import { resourcesRouter } from './routes/resources.js';
import { impactRouter } from './routes/impact.js';
import { settingsRouter } from './routes/settings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Ensure upload directory exists
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (_req, file, cb) => {
    const allowedMime = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/m4a',
      'audio/webm',
    ];
    if (allowedMime.includes(file.mimetype) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Please upload photos, audio, or PDF documents.'));
    }
  },
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file received.' });
    }

    let fileType: 'IMAGE' | 'DOCUMENT' | 'AUDIO' = 'DOCUMENT';
    if (req.file.mimetype.startsWith('image/')) {
      fileType = 'IMAGE';
    } else if (req.file.mimetype.startsWith('audio/')) {
      fileType = 'AUDIO';
    } else if (req.file.mimetype.includes('pdf')) {
      fileType = 'DOCUMENT';
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      file: {
        id: `att-${Date.now()}`,
        name: req.file.originalname,
        type: fileType,
        url: fileUrl,
        size: req.file.size,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    product: 'CivicBridge AI',
    tagline: 'From Real-World Chaos to Verified Action',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/cases', casesRouter);
app.use('/api/claims', claimsRouter);
app.use('/api/actions', actionsRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/impact', impactRouter);
app.use('/api/settings', settingsRouter);

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: err?.message || 'Internal server error occurred.',
  });
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`CivicBridge AI Server running on port ${PORT}`);
  console.log(`Proof-to-Action Engine Active`);
  console.log(`Local API URL: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});
