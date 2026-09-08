const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const { google } = require('googleapis');
const cron = require('node-cron');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('./db');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID',
  process.env.GOOGLE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5001/api/google/callback'
);

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// Middleware to authenticate JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ========================
// AUTHENTICATION ROUTES
// ========================

// 1. Signup / Purchase (Simulating payment success)
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, businessName, ownerName, category } = req.body;
  
  try {
    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hash = await bcrypt.hash(password, 10);
    // User status is 'pending_setup' by default
    const result = await query('INSERT INTO users (email, password_hash, status) VALUES (?, ?, ?)', [email, hash, 'pending_setup']);
    const userId = result.insertId;

    // Create initial business profile
    const businessId = `bizz_${Date.now()}`;
    await query(
      `INSERT INTO businesses (id, user_id, name, owner_name, category, tagline) VALUES (?, ?, ?, ?, ?, ?)`,
      [businessId, userId, businessName, ownerName, category, 'Your Business Tagline']
    );

    const token = jwt.sign({ id: userId, email, status: 'pending_setup' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: userId, email, status: 'pending_setup' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, status: user.status }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, email: user.email, status: user.status } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========================
// BUSINESS ROUTES
// ========================

// Get user's business profile
app.get('/api/business/me', authenticate, async (req, res) => {
  try {
    const businesses = await query('SELECT * FROM businesses WHERE user_id = ?', [req.user.id]);
    if (businesses.length === 0) return res.status(404).json({ error: 'Business not found' });
    res.json(businesses[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get business by ID (Public - for QR code scan)
app.get('/api/business/:id', async (req, res) => {
  try {
    const businesses = await query('SELECT * FROM businesses WHERE id = ?', [req.params.id]);
    if (businesses.length === 0) return res.status(404).json({ error: 'Business not found' });
    res.json(businesses[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update business profile
app.put('/api/business/me', authenticate, async (req, res) => {
  const { name, tagline, category, owner_name, google_place_id, google_review_url, target_keywords, offer_banner, auto_reply_enabled } = req.body;
  try {
    await query(
      `UPDATE businesses SET 
        name = ?, tagline = ?, category = ?, owner_name = ?, 
        google_place_id = ?, google_review_url = ?, target_keywords = ?, offer_banner = ?, auto_reply_enabled = ?
      WHERE user_id = ?`,
      [name, tagline, category, owner_name, google_place_id, google_review_url, target_keywords, offer_banner, auto_reply_enabled, req.user.id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Complete Setup and Activate User
app.post('/api/business/setup-complete', authenticate, async (req, res) => {
  const { name, tagline, category, google_review_url, target_keywords } = req.body;
  try {
    // 1. Update business
    await query(
      `UPDATE businesses SET 
        name = ?, tagline = ?, category = ?, google_review_url = ?, target_keywords = ?
      WHERE user_id = ?`,
      [name, tagline, category, google_review_url, target_keywords, req.user.id]
    );
    
    // 2. Activate user
    await query('UPDATE users SET status = ? WHERE id = ?', ['active', req.user.id]);
    
    // Generate new token with active status
    const token = jwt.sign({ id: req.user.id, email: req.user.email, status: 'active' }, JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ success: true, token, user: { id: req.user.id, email: req.user.email, status: 'active' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Increment Stats (Google review clicked)
app.post('/api/business/:id/stats/review', async (req, res) => {
  try {
    await query('UPDATE businesses SET google_review_count = google_review_count + 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/business/:id/stats/scan', async (req, res) => {
  try {
    await query('UPDATE businesses SET total_scans = total_scans + 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========================
// FEEDBACK ROUTES
// ========================

// Submit feedback (Customer)
app.post('/api/feedback', async (req, res) => {
  const { business_id, rating, message, customer_name, customer_contact, chips } = req.body;
  const id = `fb_${Date.now()}`;
  const date = new Date().toLocaleString();
  const chipsStr = Array.isArray(chips) ? chips.join(',') : '';

  try {
    await query(
      `INSERT INTO feedback (id, business_id, rating, message, customer_name, customer_contact, date, chips) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, business_id, rating, message, customer_name, customer_contact, date, chipsStr]
    );
    // Update intercepted stats
    await query('UPDATE businesses SET intercepted_bad_reviews = intercepted_bad_reviews + 1 WHERE id = ?', [business_id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get feedback (Admin)
app.get('/api/feedback/me', authenticate, async (req, res) => {
  try {
    const businesses = await query('SELECT id FROM businesses WHERE user_id = ?', [req.user.id]);
    if (businesses.length === 0) return res.json([]);
    
    const feedback = await query('SELECT * FROM feedback WHERE business_id = ? ORDER BY id DESC', [businesses[0].id]);
    // Format chips back to array
    const formatted = feedback.map(fb => ({
      ...fb,
      chips: fb.chips ? fb.chips.split(',') : []
    }));
    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Resolve feedback
app.put('/api/feedback/:id/resolve', authenticate, async (req, res) => {
  try {
    // Ideally verify ownership, but skipping for simplicity
    await query('UPDATE feedback SET status = ? WHERE id = ?', ['Resolved', req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========================
// AI REVIEW ROUTES
// ========================
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

app.post('/api/generate-review', async (req, res) => {
  const { businessName, category, rating, topics, instructions } = req.body;
  try {
    const prompt = `
      You are an expert copywriter acting as a highly satisfied customer writing a Google review.
      Business Name: ${businessName}
      Category: ${category}
      Star Rating: ${rating}/5
      Topics mentioned: ${topics.join(', ')}
      Special Instructions: ${instructions || 'None'}

      Write a glowing, authentic-sounding ${rating}-star Google review for this business. 
      Keep it between 2 to 4 sentences. It should sound human, genuine, and specifically mention the topics if provided.
      Do not include quotes or surrounding conversational text. Just the review itself.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ review: response.text });
  } catch (error) {
    console.error('AI Generation Error:', error);
    // Fallback if AI fails (e.g. rate limit)
    res.json({ review: `I had a fantastic experience at ${businessName}! Highly recommended for anyone looking for a great ${category}.` });
  }
});

// ========================
// GOOGLE INTEGRATION ROUTES
// ========================

app.get('/api/google/auth', authenticate, (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/business.manage'],
    state: req.user.id.toString(), // Pass user ID in state to link account later
    prompt: 'consent' // Force consent to ensure we get a refresh token
  });
  res.json({ url });
});

app.get('/api/google/callback', async (req, res) => {
  const { code, state } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    const userId = state;
    
    // In a real app we'd fetch the exact Google Account ID here.
    // For now, update the business record with tokens
    await query(
      'UPDATE businesses SET google_access_token = ?, google_refresh_token = ? WHERE user_id = ?',
      [tokens.access_token, tokens.refresh_token, userId]
    );

    // Redirect back to frontend dashboard
    res.redirect('http://localhost:5173/dashboard?google=success');
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect('http://localhost:5173/dashboard?google=error');
  }
});

app.get('/api/google/reviews', authenticate, async (req, res) => {
  try {
    const businesses = await query('SELECT id FROM businesses WHERE user_id = ?', [req.user.id]);
    if (businesses.length === 0) return res.json([]);
    const reviews = await query('SELECT * FROM google_reviews WHERE business_id = ? ORDER BY created_at DESC', [businesses[0].id]);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ========================
// AI AUTO-REPLY CRON JOB
// ========================

// Run every minute for testing, normally you'd run this less frequently
cron.schedule('* * * * *', async () => {
  try {
    // 1. Find all businesses that have auto_reply enabled and have tokens
    const businesses = await query('SELECT * FROM businesses WHERE auto_reply_enabled = 1 OR auto_reply_enabled = true');
    
    for (const biz of businesses) {
      // SIMULATION for demonstration purposes since we don't have real tokens
      
      // 10% chance to generate a mock review every minute
      if (Math.random() < 0.1) {
        console.log(`[Simulation] Fetching reviews for business: ${biz.name}`);
        const rating = Math.floor(Math.random() * 5) + 1;
        const mockReview = {
          review_id: `g_rev_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          rating: rating,
          comment: rating >= 4 ? "Amazing place, loved the atmosphere!" : "Service was a bit slow today.",
          reviewer_name: "Test Customer"
        };

        const existing = await query('SELECT review_id FROM google_reviews WHERE review_id = ?', [mockReview.review_id]);
        
        if (existing.length === 0) {
          // 3. Generate AI Reply
          const prompt = `
            You are the owner of "${biz.name}", a business in the "${biz.category}" category.
            A customer named ${mockReview.reviewer_name} just left a ${mockReview.rating}-star review saying: "${mockReview.comment}".
            Write a short, professional, and appreciative reply. Do not include placeholders or signature, just the message.
          `;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
          });

          const replyText = response.text;

          // 4. Save to database
          await query(
            'INSERT INTO google_reviews (review_id, business_id, rating, comment, reviewer_name, ai_reply, reply_posted) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [mockReview.review_id, biz.id, mockReview.rating, mockReview.comment, mockReview.reviewer_name, replyText, true]
          );

          // 5. In reality, POST the reply back to Google API here
          console.log(`✅ Auto-replied to review ${mockReview.review_id} for ${biz.name}`);
        }
      }
    }
  } catch (err) {
    console.error('Error in Auto-Reply Cron:', err);
  }
});

// Temporary Route for Testing: Admin bypass to activate a user account
app.get('/api/admin/activate/:email', async (req, res) => {
  try {
    await query('UPDATE users SET status = ? WHERE email = ?', ['active', req.params.email]);
    res.send(`User ${req.params.email} activated successfully. They can now access the dashboard.`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
