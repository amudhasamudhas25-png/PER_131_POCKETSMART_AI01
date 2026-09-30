import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  generateHomePlanWithGemini,
  generatePartyPlanWithGemini,
  generateJewelryPlanWithGemini,
  generateAlternativeForItem,
} from './backend/services/geminiService.ts';
import { StorageService } from './backend/services/storageService.ts';
import { getExternalPlatformsStatus } from './backend/services/externalPlatforms.ts';
import {
  validateHomeInput,
  validatePartyInput,
  validateJewelryInput,
} from './src/utils/validation.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Allow up to 15MB JSON payloads for uploaded outfit images
  app.use(express.json({ limit: '15mb' }));

  // --- API ROUTES ---

  // 1. Home Planner Generation
  app.post('/api/generate-home', async (req, res) => {
    try {
      const validation = validateHomeInput(req.body);
      if (!validation.valid) {
        return res.status(400).json({
          error: Object.values(validation.errors)[0] || 'Invalid form data provided.',
          fieldErrors: validation.errors,
        });
      }

      const plan = await generateHomePlanWithGemini(req.body);
      StorageService.addHistory(plan);
      return res.json(plan);
    } catch (error) {
      console.error('Error in /api/generate-home:', error);
      return res.status(500).json({
        error: 'Something went wrong while generating your home recommendations. Please try again.',
      });
    }
  });

  // 2. Party Planner Generation
  app.post('/api/generate-party', async (req, res) => {
    try {
      const validation = validatePartyInput(req.body);
      if (!validation.valid) {
        return res.status(400).json({
          error: Object.values(validation.errors)[0] || 'Invalid event form data provided.',
          fieldErrors: validation.errors,
        });
      }

      const plan = await generatePartyPlanWithGemini(req.body);
      StorageService.addHistory(plan);
      return res.json(plan);
    } catch (error) {
      console.error('Error in /api/generate-party:', error);
      return res.status(500).json({
        error: 'Something went wrong while generating your party plan. Please try again.',
      });
    }
  });

  // 3. Jewelry Planner Generation (Multimodal)
  app.post('/api/generate-jewelry', async (req, res) => {
    try {
      const validation = validateJewelryInput(req.body);
      if (!validation.valid) {
        return res.status(400).json({
          error: Object.values(validation.errors)[0] || 'Invalid jewelry form data provided.',
          fieldErrors: validation.errors,
        });
      }

      const plan = await generateJewelryPlanWithGemini(req.body);
      StorageService.addHistory(plan);
      return res.json(plan);
    } catch (error) {
      console.error('Error in /api/generate-jewelry:', error);
      return res.status(500).json({
        error: 'Something went wrong while generating your jewelry recommendations. Please try again.',
      });
    }
  });

  // 4. Generate Alternative for a Single Item
  app.post('/api/generate-alternative', async (req, res) => {
    try {
      const { item, maxBudgetForItem, plannerType } = req.body;
      if (!item || !item.name) {
        return res.status(400).json({ error: 'Recommendation item is required.' });
      }
      const updatedItem = await generateAlternativeForItem(
        item,
        Number(maxBudgetForItem) || item.estimatedTotalPrice,
        plannerType || 'home'
      );
      return res.json(updatedItem);
    } catch (error) {
      console.error('Error in /api/generate-alternative:', error);
      return res.status(500).json({
        error: 'Unable to generate an alternative option right now.',
      });
    }
  });

  // 5. Recommendation History Routes
  app.get('/api/history', (_req, res) => {
    return res.json(StorageService.getHistory());
  });

  app.post('/api/history', (req, res) => {
    try {
      const plan = req.body;
      if (!plan || !plan.id) {
        return res.status(400).json({ error: 'Valid plan object is required.' });
      }
      const savedPlan = StorageService.addHistory(plan);
      return res.json(savedPlan);
    } catch {
      return res.status(500).json({ error: 'Could not save plan to history.' });
    }
  });

  app.delete('/api/history/:id', (req, res) => {
    const deleted = StorageService.deleteHistory(req.params.id);
    return res.json({ success: deleted });
  });

  // 6. Saved Recommendations Routes
  app.get('/api/saved', (_req, res) => {
    return res.json(StorageService.getSaved());
  });

  app.post('/api/saved', (req, res) => {
    try {
      const item = req.body;
      if (!item || !item.name) {
        return res.status(400).json({ error: 'Valid recommendation item is required.' });
      }
      const saved = StorageService.addSaved({
        ...item,
        id: item.id || `saved-${Date.now()}`,
        dateSaved: item.dateSaved || new Date().toISOString(),
      });
      return res.json(saved);
    } catch {
      return res.status(500).json({ error: 'Could not save recommendation.' });
    }
  });

  app.delete('/api/saved/:id', (req, res) => {
    const deleted = StorageService.deleteSaved(req.params.id);
    return res.json({ success: deleted });
  });

  // 7. Authentication & Profile Routes
  app.post('/api/auth/register', (req, res) => {
    try {
      const { fullName, email, password } = req.body;
      if (!fullName || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
      if (String(password).length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      }
      const user = StorageService.registerUser(fullName, email, password);
      return res.json({ user, token: `ps-session-${user.id}` });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Registration failed.' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }
      const user = StorageService.loginUser(email, password);
      return res.json({ user, token: `ps-session-${user.id}` });
    } catch (err: any) {
      return res.status(401).json({ error: err.message || 'Invalid credentials.' });
    }
  });

  app.get('/api/profile', (_req, res) => {
    return res.json(StorageService.getDefaultProfile());
  });

  app.put('/api/profile', (req, res) => {
    const updated = StorageService.updateProfile(req.body);
    return res.json(updated);
  });

  app.get('/api/platforms/status', (_req, res) => {
    return res.json(getExternalPlatformsStatus());
  });

  // --- VITE / STATIC FRONTEND SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PocketSmart AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
