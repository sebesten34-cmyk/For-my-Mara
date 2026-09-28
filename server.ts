import express from 'express';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import type { GameHighScores, ScoreRecord, ScoreState, GameType, PlayerName } from './src/types/games.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const DATA_DIR = path.resolve(__dirname, 'data');
const SCORES_FILE = path.join(DATA_DIR, 'scores.json');
const PHOTOS_FILE = path.join(DATA_DIR, 'photos.json');
const UPLOADS_DIR = path.resolve(__dirname, 'public', 'uploads');

// Ensure data and uploads folders exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initial state
const defaultState: ScoreState = {
  highScores: {
    'flappy-pigeon': { dominik: 0, mara: 0 },
    'love-catcher': { dominik: 0, mara: 0 },
  },
  recentActivity: [],
};

let state: ScoreState = defaultState;

// Load persistent scores from file
try {
  if (fs.existsSync(SCORES_FILE)) {
    const raw = fs.readFileSync(SCORES_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    state = {
      highScores: {
        'flappy-pigeon': {
          dominik: Number(parsed.highScores?.['flappy-pigeon']?.dominik || 0),
          mara: Number(parsed.highScores?.['flappy-pigeon']?.mara || 0),
        },
        'love-catcher': {
          dominik: Number(parsed.highScores?.['love-catcher']?.dominik || 0),
          mara: Number(parsed.highScores?.['love-catcher']?.mara || 0),
        },
      },
      recentActivity: Array.isArray(parsed.recentActivity) ? parsed.recentActivity.slice(0, 30) : [],
    };
  }
} catch (err) {
  console.warn('Could not load existing scores.json, using default state:', err);
}

function saveScoresToDisk() {
  try {
    fs.writeFileSync(SCORES_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save scores to disk:', err);
  }
}

// Persistent Photo Overrides for Cross-Device Synchronization
type PhotosMap = Record<string, { monthId: number; photoId: string; url: string; updatedAt: string }>;
let photosState: PhotosMap = {};

try {
  if (fs.existsSync(PHOTOS_FILE)) {
    const raw = fs.readFileSync(PHOTOS_FILE, 'utf-8');
    photosState = JSON.parse(raw) || {};
  }
} catch (err) {
  console.warn('Could not load existing photos.json, using empty map:', err);
}

function savePhotosToDisk() {
  try {
    fs.writeFileSync(PHOTOS_FILE, JSON.stringify(photosState, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save photos to disk:', err);
  }
}

const app = express();
// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Support high resolution photo uploads across devices
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Set up HTTP Server
const server = http.createServer(app);

// WebSocket Server for live cross-device sync
const wss = new WebSocketServer({ server, path: '/ws' });

const connectedClients = new Set<WebSocket>();
const sseClients = new Set<express.Response>();

function broadcast(event: { type: string; payload: any }) {
  const data = JSON.stringify(event);

  // Broadcast to WebSockets
  for (const client of connectedClients) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(data);
      } catch (err) {
        console.warn('WS send error:', err);
      }
    }
  }

  // Broadcast to Server-Sent Events
  for (const res of sseClients) {
    try {
      res.write(`data: ${data}\n\n`);
    } catch {
      sseClients.delete(res);
    }
  }
}

wss.on('connection', (ws) => {
  connectedClients.add(ws);

  // Send current state and photos immediately on connect
  ws.send(JSON.stringify({ type: 'init', payload: state }));
  ws.send(JSON.stringify({ type: 'init_photos', payload: photosState }));

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      if (msg.type === 'submit_score') {
        handleScoreSubmission(msg.payload);
      } else if (msg.type === 'cheer') {
        broadcast({ type: 'live_cheer', payload: msg.payload });
      } else if (msg.type === 'update_photo') {
        handlePhotoUpdate(msg.payload);
      }
    } catch (e) {
      console.warn('Invalid WS message received:', e);
    }
  });

  ws.on('close', () => {
    connectedClients.delete(ws);
  });

  ws.on('error', () => {
    connectedClients.delete(ws);
  });
});

function handlePhotoUpdate(payload: { monthId: number; photoId: string; url: string }) {
  const { monthId, photoId, url } = payload;
  if (!monthId || !photoId || !url) return null;

  let finalUrl = String(url);

  // If the photo was sent as a base64 Data URL, write it to public/uploads disk as an actual image file
  if (finalUrl.startsWith('data:image/')) {
    try {
      const match = finalUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (match) {
        let ext = match[1].toLowerCase();
        if (ext === 'jpeg') ext = 'jpg';
        if (ext.includes('svg')) ext = 'svg';
        const base64Data = match[2];
        const filename = `photo_m${monthId}_${photoId}_${Date.now()}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, filename);
        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
        finalUrl = `/uploads/${filename}`;
        console.log(`Saved uploaded photo to disk: ${finalUrl}`);
      }
    } catch (err) {
      console.warn('Could not save base64 photo to uploads dir, retaining dataUrl:', err);
    }
  }

  const key = `${monthId}_${photoId}`;
  photosState[key] = {
    monthId: Number(monthId),
    photoId: String(photoId),
    url: finalUrl,
    updatedAt: new Date().toISOString(),
  };

  savePhotosToDisk();

  broadcast({
    type: 'photo_updated',
    payload: photosState[key],
  });

  return photosState[key];
}

function handleScoreSubmission(payload: { game: GameType; player: PlayerName; score: number }) {
  const { game, player, score } = payload;
  if (!game || !player || typeof score !== 'number' || score < 0) return null;

  const playerKey = player.toLowerCase() as 'dominik' | 'mara';
  const currentBest = state.highScores[game]?.[playerKey] ?? 0;
  const isNewHighScore = score > currentBest;

  if (isNewHighScore) {
    state.highScores[game][playerKey] = score;
  }

  const newRecord: ScoreRecord = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    game,
    player,
    score,
    createdAt: new Date().toISOString(),
  };

  state.recentActivity.unshift(newRecord);
  if (state.recentActivity.length > 40) {
    state.recentActivity = state.recentActivity.slice(0, 40);
  }

  saveScoresToDisk();

  const broadcastPayload = {
    record: newRecord,
    isNewHighScore,
    highScores: state.highScores,
    recentActivity: state.recentActivity,
  };

  broadcast({ type: 'new_score', payload: broadcastPayload });
  return broadcastPayload;
}

// REST API Endpoints for Photos (Cross-Device Sync)
app.get('/api/photos', (_req, res) => {
  res.json(photosState);
});

app.post('/api/photos', (req, res) => {
  const result = handlePhotoUpdate(req.body);
  if (!result) {
    res.status(400).json({ error: 'Missing monthId, photoId, or url' });
    return;
  }
  res.json({ success: true, photo: result });
});

// Batch sync for syncing local IndexedDB photos to server
app.post('/api/photos/batch', (req, res) => {
  const { photos } = req.body;
  if (!Array.isArray(photos)) {
    res.status(400).json({ error: 'Expected array of photos' });
    return;
  }

  let updatedCount = 0;
  for (const item of photos) {
    if (item.monthId && item.photoId && item.url) {
      const key = `${item.monthId}_${item.photoId}`;
      if (!photosState[key]) {
        handlePhotoUpdate(item);
        updatedCount++;
      }
    }
  }

  res.json({ success: true, count: updatedCount, photos: photosState });
});

// REST API Endpoints for Scores
app.get('/api/scores', (_req, res) => {
  res.json(state);
});

app.post('/api/scores', (req, res) => {
  const result = handleScoreSubmission(req.body);
  if (!result) {
    res.status(400).json({ error: 'Invalid score payload' });
    return;
  }
  res.json({ success: true, ...result });
});

app.post('/api/cheer', (req, res) => {
  const { from } = req.body;
  const payload = {
    from: from === 'Mara' ? 'Mara' : 'Dominik',
    timestamp: Date.now(),
  };
  broadcast({ type: 'live_cheer', payload });
  res.json({ success: true, payload });
});

// SSE Endpoint for environments where WebSockets might be proxy-limited
app.get('/api/scores/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial state & photos
  res.write(`data: ${JSON.stringify({ type: 'init', payload: state })}\n\n`);
  res.write(`data: ${JSON.stringify({ type: 'init_photos', payload: photosState })}\n\n`);

  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

async function setupApp() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Mounted Vite dev middleware on Express');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('Serving production static files from dist');
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
    console.log(`Realtime WebSockets available at ws://0.0.0.0:${PORT}/ws`);
    console.log(`Realtime SSE available at http://0.0.0.0:${PORT}/api/scores/stream`);
  });
}

setupApp().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
