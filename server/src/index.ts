import express from 'express';
import cron from 'node-cron';
import pg from 'pg';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const app = express();
const port = process.env.PORT || 4000;

// Database Connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// SECURITY MIDDLEWARE
app.use(helmet()); // Adds security headers like X-Frame-Options, CSP, etc.
app.use(cors());
app.use(express.json());

// ==========================================
// 🛡️ RATE LIMITING
// ==========================================
const trackAddLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // limit each IP to 15 requests per windowMs
  message: { error: 'Too many tracks added. Please wait a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==========================================
// 🛠️ DATA RETENTION LOGIC (The "Janitor")
// ==========================================
cron.schedule('0 * * * *', async () => {
  console.log('--- Running Data Retention Cleanup ---');
  try {
    const query = `
      DELETE FROM playlists
      WHERE user_id IS NULL
      AND last_accessed_at < NOW() - INTERVAL '48 hours';
    `;
    const result = await pool.query(query);
    console.log(`Successfully cleaned up ${result.rowCount} expired guest playlists.`);
  } catch (err) {
    console.error('Cleanup Error:', err);
  }
});

// ==========================================
// � AUTHENTICATION MIDDLEWARE
// ==========================================
const verifyAuth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  try {
    // Extract user ID from token (you can validate the token with Supabase admin SDK here)
    const token = authHeader.substring(7);
    req.user = { token }; // In production, validate token with Supabase
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const checkTermsAccepted = async (req: any, res: any, next: any) => {
  // Extract user ID from token in Supabase session
  // For now, we check the terms_accepted flag that frontend should provide
  if (!req.body.terms_accepted) {
    return res.status(403).json({ error: 'You must accept Terms and Conditions to continue' });
  }
  next();
};

// ==========================================
// 🛣️ API ROUTES
// ==========================================

// Initialize user profile and accept terms
app.post('/api/auth/accept-terms', verifyAuth, async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    // Create or update user profile with terms acceptance
    const result = await pool.query(
      `INSERT INTO user_profiles (user_id, terms_accepted_at)
       VALUES ($1, NOW())
       ON CONFLICT (user_id) DO UPDATE 
       SET terms_accepted_at = NOW()
       RETURNING *`,
      [user_id]
    );

    res.json({ 
      success: true, 
      message: 'Terms accepted',
      data: result.rows[0] 
    });
  } catch (err: any) {
    console.error('Terms acceptance error:', err);
    res.status(500).json({ error: 'Failed to accept terms' });
  }
});

// Check if user has accepted terms
app.get('/api/auth/check-terms/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await pool.query(
      'SELECT terms_accepted_at FROM user_profiles WHERE user_id = $1',
      [user_id]
    );

    const hasAccepted = result.rows.length > 0 && result.rows[0].terms_accepted_at !== null;

    res.json({ 
      accepted: hasAccepted,
      acceptedAt: result.rows[0]?.terms_accepted_at || null
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check terms status' });
  }
});

// GET Playlist by Slug
app.get('/api/playlist/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const playlistRes = await pool.query('SELECT * FROM playlists WHERE slug = $1', [slug]);
    const playlist = playlistRes.rows[0];

    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

    if (!playlist.user_id) {
      await pool.query('UPDATE playlists SET last_accessed_at = NOW() WHERE id = $1', [playlist.id]);
    }

    const tracksRes = await pool.query('SELECT * FROM tracks WHERE playlist_id = $1 ORDER BY position ASC', [playlist.id]);
    res.json({ playlist, tracks: tracksRes.rows });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST Add Track (with Rate Limiting)
app.post('/api/tracks', trackAddLimit, async (req, res) => {
  const { playlist_id, url, platform, position, user_id } = req.body;

  if (!playlist_id || !url) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if user has accepted terms
  if (user_id) {
    try {
      const termsCheck = await pool.query(
        'SELECT terms_accepted_at FROM user_profiles WHERE user_id = $1 AND terms_accepted_at IS NOT NULL',
        [user_id]
      );

      if (termsCheck.rows.length === 0) {
        return res.status(403).json({ error: 'You must accept Terms and Conditions before adding tracks' });
      }
    } catch (err) {
      console.error('Terms check error:', err);
      return res.status(500).json({ error: 'Failed to verify terms acceptance' });
    }
  }

  try {
    const result = await pool.query(
      'INSERT INTO tracks (playlist_id, url, platform, position) VALUES ($1, $2, $3, $4) RETURNING *',
      [playlist_id, url, platform, position]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Custom Backend running on port ${port}`);
});
