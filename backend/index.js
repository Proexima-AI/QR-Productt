require('dotenv').config({ override: true });
const express = require('express');
const OpenAI = require('openai');
const { google } = require('googleapis');
// const cron = require('node-cron');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Razorpay = require('razorpay');
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

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

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
    res.json({ token, user: { id: userId, email, status: 'pending_setup', created_at: new Date() } });
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
    res.json({ token, user: { id: user.id, email: user.email, status: user.status, created_at: user.created_at, subscription_ends_at: user.subscription_ends_at } });
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
  const { name, tagline, category, google_review_url, target_keywords, mobile_number, top_selling_items, business_location, ai_analysis_results } = req.body;
  try {
    // 1. Update business
    await query(
      `UPDATE businesses SET 
        name = ?, tagline = ?, category = ?, google_review_url = ?, target_keywords = ?, mobile_number = ?, top_selling_items = ?, business_location = ?, ai_analysis_results = ?
      WHERE user_id = ?`,
      [name, tagline, category, google_review_url, target_keywords, mobile_number, JSON.stringify(top_selling_items || []), business_location, JSON.stringify(ai_analysis_results || {}), req.user.id]
    );

    // 2. Activate user
    await query('UPDATE users SET status = ? WHERE id = ?', ['active', req.user.id]);

    // Generate new token with active status
    const token = jwt.sign({ id: req.user.id, email: req.user.email, status: 'active' }, JWT_SECRET, { expiresIn: '1d' });

    const userQuery = await query('SELECT created_at, subscription_ends_at FROM users WHERE id = ?', [req.user.id]);

    res.json({ success: true, token, user: { id: req.user.id, email: req.user.email, status: 'active', created_at: userQuery[0].created_at, subscription_ends_at: userQuery[0].subscription_ends_at } });
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
// PAYMENT ROUTES
// ========================

// app.post('/api/payment/create-order', authenticate, async (req, res) => {
//   const { amount, plan } = req.body;
//   try {
//     const options = {
//       amount: Math.round(amount * 100), // amount in the smallest currency unit
//       currency: "INR",
//       receipt: `receipt_${req.user.id}_${Date.now()}`
//     };
//     const order = await razorpay.orders.create(options);
//     res.json(order);
//   } catch (error) {
//     console.error('Razorpay Create Order Error:', error);
//     res.status(500).json({ error: 'Could not create order' });
//   }
// });

app.post('/api/payment/create-order', authenticate, async (req, res) => {
  const { amount, plan } = req.body;

  try {
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${req.user.id}_${Date.now()}`
    };

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(
          `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
        )}`
      },
      body: JSON.stringify(options)
    });

    const order = await response.json();

    if (!response.ok) {
      console.error('Razorpay Create Order Error:', order);
      return res.status(response.status).json({
        error: 'Could not create order'
      });
    }

    res.json(order);

  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({ error: 'Could not create order' });
  }
});

app.post('/api/payment/verify', authenticate, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan_duration_days, amount } = req.body;
  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment is verified
      // Calculate new subscription ends at
      const daysToAdd = plan_duration_days || 30; // default 30 if not specified

      const userResult = await query('SELECT subscription_ends_at FROM users WHERE id = ?', [req.user.id]);
      let currentEndsAt = new Date();
      if (userResult.length > 0 && userResult[0].subscription_ends_at) {
        const existingEnd = new Date(userResult[0].subscription_ends_at);
        if (existingEnd > currentEndsAt) {
          currentEndsAt = existingEnd; // Extend from current end date
        }
      }

      const newEndsAt = new Date(currentEndsAt.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

      let formattedDate;
      // Depending on mysql or sqlite, format it to YYYY-MM-DD HH:MM:SS
      formattedDate = newEndsAt.toISOString().slice(0, 19).replace('T', ' ');

      await query('UPDATE users SET subscription_ends_at = ? WHERE id = ?', [formattedDate, req.user.id]);

      await query(
        'INSERT INTO payments (user_id, razorpay_order_id, razorpay_payment_id, amount, plan_duration_days) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, razorpay_order_id, razorpay_payment_id, amount || 0, plan_duration_days]
      );

      res.json({ success: true, subscription_ends_at: formattedDate });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
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
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }]
    });

    res.json({ review: response.choices[0].message.content });
  } catch (error) {
    console.error('AI Generation Error:', error);
    // Fallback if AI fails (e.g. rate limit)
    res.json({ review: `I had a fantastic experience at ${businessName}! Highly recommended for anyone looking for a great ${category}.` });
  }
});

app.post('/api/business/suggest-products', async (req, res) => {
  const { category } = req.body;
  try {
    const prompt = `You are a business consultant specializing in the Indian market. Suggest 5 to 10 top-selling or highly popular products/items for a business in the "${category}" category. The suggestions MUST be highly relevant to the Indian business market and local consumers.
Return ONLY a valid JSON array of strings (e.g. ["Item 1", "Item 2"]). No markdown, no conversational text.`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }]
    });
    
    let text = response.choices[0].message.content.trim();
    if (text.startsWith('```json')) text = text.replace('```json', '');
    if (text.startsWith('```')) text = text.replace('```', '');
    if (text.endsWith('```')) text = text.slice(0, -3);
    
    res.json({ suggestions: JSON.parse(text) });
  } catch (error) {
    console.error('Suggest Products Error:', error);
    res.json({ suggestions: [] });
  }
});

app.post('/api/business/analyze', async (req, res) => {
  const { businessName, category, location } = req.body;
  try {
    const prompt = `You are an expert business growth analyst specializing in the Indian market. Analyze a business named "${businessName}" in the "${category}" category located in/around "${location || 'their local area'}". The analysis MUST be tailored specifically for Indian consumers and local search trends.
Provide a JSON object with the following keys:
- "topSearchItems": An array of 3-5 things people in India are likely searching for when they need this business.
- "trendingKeywords": An array of 3-5 trending SEO keywords in India for this business.
- "dos": An array of 3 things they SHOULD do to grow their online presence locally.
- "donts": An array of 3 things they SHOULD NOT do.
- "currentProfileAnalysis": A 1-2 sentence genuine-sounding analysis of their current digital visibility.
- "improvementStrategy": A 1-2 sentence explanation of how deploying our smart QR code review system will drastically improve their local SEO.
- "seoFeedbackStrategy": A 1-2 sentence explanation of how our system guides customers to include specific SEO keywords in their Google reviews.
- "scores": An object containing the following keys (all integer values between 1 and 100):
  - "currentSeoScore": Realistic low score (e.g., 30-50).
  - "projectedSeoScore": High score after our system (e.g., 85-98).
  - "localVisibility": Realistic low/mid score (e.g., 40-60).
  - "reputationTrust": Realistic score based on average reviews (e.g., 45-65).

Return ONLY valid JSON. No markdown formatting or extra text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }]
    });

    let text = response.choices[0].message.content.trim();
    if (text.startsWith('```json')) text = text.replace('```json', '');
    if (text.startsWith('```')) text = text.replace('```', '');
    if (text.endsWith('```')) text = text.slice(0, -3);

    res.json({ analysis: JSON.parse(text) });
  } catch (error) {
    console.error('Analyze Business Error:', error);
    res.status(500).json({ error: 'Failed to analyze business' });
  }
});

app.post('/api/business/search-places', async (req, res) => {
  const { location, category, businessName } = req.body;
  if (!location || location.length < 3) return res.json([]);
  
  try {
    const prompt = `You are a local search engine. The user is searching for a business named "${businessName || 'Business'}" in the category "${category || 'Store'}" near "${location}".
Return a JSON array of 3 to 4 realistic (but fictional or real) business locations in that specific area that match the query. Each object should have:
- "name": The name of the business (use the provided name if possible, or similar competitors)
- "address": A realistic street address in or around ${location}
- "rating": A random decimal rating between 3.5 and 5.0
- "reviewsCount": A random integer between 10 and 500

Return ONLY the JSON array. No markdown, no extra text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }]
    });

    let text = response.choices[0].message.content.trim();
    if (text.startsWith('```json')) text = text.replace('```json', '');
    if (text.startsWith('```')) text = text.replace('```', '');
    if (text.endsWith('```')) text = text.slice(0, -3);

    res.json(JSON.parse(text));
  } catch (error) {
    console.error('Search Places Error:', error);
    res.json([]);
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
// cron.schedule('* * * * *', async () => {
async function runAutoReplyJob() {
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

          const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }]
          });

          const replyText = response.choices[0].message.content;

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
};

// Temporary Route for Testing: Admin bypass to activate a user account
app.get('/api/admin/activate/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Set 1-year subscription for testing
    const newEndsAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    const formattedDate = newEndsAt.toISOString().slice(0, 19).replace('T', ' ');

    await query('UPDATE users SET subscription_ends_at = ? WHERE email = ?', [formattedDate, email]);
    res.json({ message: 'User activated for 1 year' });
  } catch (error) {
    res.status(500).json({ error: 'Activation failed' });
  }
});

// --- ADMIN ROUTES ---

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const userResult = await query('SELECT role FROM users WHERE id = ?', [req.user.id]);
    if (userResult.length === 0 || userResult[0].role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify admin status' });
  }
};

app.get('/api/admin/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const usersResult = await query('SELECT COUNT(*) as count FROM users');
    const totalUsers = usersResult[0].count;

    const paymentsResult = await query('SELECT SUM(amount) as total_amount FROM payments WHERE status = "success"');
    const totalRevenue = paymentsResult[0].total_amount || 0;

    // Linear graph data: users created per day (last 7 days)
    const graphData = await query(`
      SELECT DATE(created_at) as date, COUNT(*) as users 
      FROM users 
      GROUP BY DATE(created_at) 
      ORDER BY date DESC 
      LIMIT 7
    `);

    res.json({ totalUsers, totalRevenue, graphData: graphData.reverse() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

app.get('/api/admin/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await query(`
      SELECT u.id, u.email, u.status, u.role, u.created_at, u.subscription_ends_at, b.name as business_name
      FROM users u
      LEFT JOIN businesses b ON u.id = b.user_id
      ORDER BY u.created_at DESC
    `);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.put('/api/admin/users/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { role, subscription_ends_at } = req.body;
    await query('UPDATE users SET role = ?, subscription_ends_at = ? WHERE id = ?', [role, subscription_ends_at, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.get('/api/admin/tickets', authenticate, requireAdmin, async (req, res) => {
  try {
    const tickets = await query('SELECT t.*, u.email FROM support_tickets t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

app.post('/api/admin/tickets/:id/reply', authenticate, requireAdmin, async (req, res) => {
  try {
    const { reply } = req.body;
    await query('UPDATE support_tickets SET reply = ?, status = "closed" WHERE id = ?', [reply, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reply to ticket' });
  }
});

// ========================
// CHATBOT ROUTES
// ========================


app.post('/api/chat', async (req, res) => {
  const { sessionId, message, history } = req.body;
  try {
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Save user message to DB
    await query('INSERT INTO chat_logs (session_id, message, role) VALUES (?, ?, ?)', [sessionId, message, 'user']);

    const systemInstruction = "You are an intelligent, customer-centric sales assistant for 'Proexima QR Review SaaS'. Your primary goal is to answer questions, dynamically relate everything back to our QR code review platform, and persuade the user to sign up or buy. ONCE you have sufficiently answered their questions, seamlessly transition to collecting their contact info as a lead. Ask for their Name, Mobile Number (must be digits only), Business Name, and Location. When all 4 pieces of information are gathered, you MUST call the `save_crm_lead` tool. Do not ask for all 4 at once; make it a natural conversation.\n\nCRITICAL KNOWLEDGE - PRICING PLANS:\nNever hallucinate 'Basic/Pro/Enterprise' plans. Our ONLY plans are:\n- **6 Months Plan**: ₹249/month (Billed as ₹1,494 + ₹1,499 one-time cost + 18% GST). Features: Custom QR code design, Google Review collection, Customer review link, Review request tools, Basic business dashboard, Priority support, Extra 15 days Free.\n- **1 Year Plan (POPULAR)**: ₹199/month (Billed as ₹2,388 + ₹1,499 one-time cost + 18% GST). Features: Everything in 6 Months, plus Full-year access, Advanced review tracking, Review performance insights, Customer activity tracking, Extra 45 days Free.\n\nCRITICAL UI INSTRUCTION:\n1. If recommending a feature, append a rich card: [CARD: {\"title\": \"Title\", \"image\": \"https://images.unsplash.com/photo-[id]?w=500&auto=format&fit=crop\", \"subtitle\": \"Subtitle\", \"action\": \"Know More\"}]\n2. ALWAYS append 2-3 highly persuasive, customer-centric quick-reply chips at the very end of your message to guide the user to the next step. Format: [CHIPS: Yes, let's start!|Tell me about pricing|Show me how it works]. If you ask for their name, provide chips like 'Why do you need my name?|Tell me more first'.";

    let messages = [
      { role: "system", content: systemInstruction }
    ];

    if (history && history.length > 0) {
      const formattedHistory = history.map(h => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.message
      }));
      messages = messages.concat(formattedHistory);
    }
    messages.push({ role: 'user', content: message });

    const tools = [
      {
        type: "function",
        function: {
          name: "save_crm_lead",
          description: "Save the user's lead information into the CRM once Name, Mobile, Business, and Location have all been collected.",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string", description: "The customer's name" },
              mobile: { type: "string", description: "The customer's mobile number, strictly digits (e.g. 1234567890)" },
              business_name: { type: "string", description: "The name of their business" },
              location: { type: "string", description: "The location of their business" }
            },
            required: ["name", "mobile", "business_name", "location"]
          }
        }
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      tools: tools,
      tool_choice: "auto",
      temperature: 0.7
    });

    const choice = completion.choices[0];
    let botReply = choice.message.content || "";

    if (choice.finish_reason === "tool_calls" || (choice.message.tool_calls && choice.message.tool_calls.length > 0)) {
      const toolCall = choice.message.tool_calls[0];
      if (toolCall.function.name === "save_crm_lead") {
        const args = JSON.parse(toolCall.function.arguments);

        // Validate mobile number to ensure it has no characters
        const mobileRegex = /^[0-9]+$/;
        if (!mobileRegex.test(args.mobile)) {
          botReply = "Please provide a valid mobile number with only digits.";
        } else {
          await query('INSERT INTO crm_leads (session_id, name, mobile, business_name, location) VALUES (?, ?, ?, ?, ?)', [sessionId, args.name, args.mobile, args.business_name, args.location]);
          botReply = "Thank you! I've saved your information, and our team will be in touch with you shortly. Is there anything else you need help with?";
        }
      }
    }

    // Save bot message to DB
    await query('INSERT INTO chat_logs (session_id, message, role) VALUES (?, ?, ?)', [sessionId, botReply, 'model']);

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: 'Failed to process chat' });
  }
});

app.get('/api/admin/leads', authenticate, requireAdmin, async (req, res) => {
  try {
    const leads = await query('SELECT * FROM crm_leads ORDER BY created_at DESC');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch CRM leads' });
  }
});

app.get('/api/admin/chats', authenticate, requireAdmin, async (req, res) => {
  try {
    const logs = await query('SELECT * FROM chat_logs ORDER BY created_at ASC');
    // Group by session
    const sessions = logs.reduce((acc, log) => {
      if (!acc[log.session_id]) acc[log.session_id] = [];
      acc[log.session_id].push(log);
      return acc;
    }, {});

    // Convert to array and sort by latest activity
    const sessionsArray = Object.keys(sessions).map(id => ({
      sessionId: id,
      messages: sessions[id],
      lastActivity: sessions[id][sessions[id].length - 1].created_at
    })).sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));

    res.json(sessionsArray);
  } catch (error) {
    console.error("Fetch chats error:", error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// const PORT = process.env.PORT || 5001;
// // START SERVER
// app.listen(PORT, () => {
//   console.log(`🚀 Backend running on http://localhost:${PORT}`);
// });

app.runAutoReplyJob = runAutoReplyJob;
module.exports = app;
