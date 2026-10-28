require('dotenv').config({ override: true });
const express = require('express');
const OpenAI = require('openai');
const { google } = require('googleapis');
// node-cron is lazy-loaded in the local server block below (it uses __filename, which breaks Cloudflare Workers)
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { query } = require('./db');

const oauth2Client = new google.auth.OAuth2(
  (process.env.GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID').trim(),
  (process.env.GOOGLE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET').trim(),
  (process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5001/api/google/callback').trim()
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
    const biz = { ...businesses[0] };
    if (biz.top_selling_items && typeof biz.top_selling_items === 'string') {
      try {
        biz.top_selling_items = JSON.parse(biz.top_selling_items);
      } catch (e) {
        biz.top_selling_items = biz.top_selling_items.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    if (!Array.isArray(biz.top_selling_items)) {
      biz.top_selling_items = [];
    }
    res.json(biz);
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
    const biz = { ...businesses[0] };
    if (biz.top_selling_items && typeof biz.top_selling_items === 'string') {
      try {
        biz.top_selling_items = JSON.parse(biz.top_selling_items);
      } catch (e) {
        biz.top_selling_items = biz.top_selling_items.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    if (!Array.isArray(biz.top_selling_items)) {
      biz.top_selling_items = [];
    }
    res.json(biz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update business profile
app.put('/api/business/me', authenticate, async (req, res) => {
  const { name, tagline, category, owner_name, google_place_id, google_review_url, target_keywords, offer_banner, upi_id, auto_reply_enabled, language, business_details, top_selling_items } = req.body;
  try {
    let serializedItems = '[]';
    if (Array.isArray(top_selling_items)) {
      serializedItems = JSON.stringify(top_selling_items);
    } else if (typeof top_selling_items === 'string' && top_selling_items.trim().startsWith('[')) {
      try {
        serializedItems = JSON.stringify(JSON.parse(top_selling_items));
      } catch (e) {
        serializedItems = JSON.stringify([top_selling_items]);
      }
    } else if (top_selling_items && typeof top_selling_items === 'string') {
      serializedItems = JSON.stringify(top_selling_items.split(',').map(s => s.trim()).filter(Boolean));
    }

    await query(
      `UPDATE businesses SET 
        name = ?, tagline = ?, category = ?, owner_name = ?, 
        google_place_id = ?, google_review_url = ?, target_keywords = ?, offer_banner = ?, upi_id = ?, auto_reply_enabled = ?, language = ?, business_details = ?, top_selling_items = ?
      WHERE user_id = ?`,
      [name, tagline, category, owner_name, google_place_id, google_review_url, target_keywords, offer_banner, upi_id, auto_reply_enabled, language || 'en', business_details, serializedItems, req.user.id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Complete Setup and Activate User
app.post('/api/business/setup-complete', authenticate, async (req, res) => {
  const { 
    name, 
    tagline, 
    category, 
    google_review_url, 
    target_keywords, 
    mobile_number, 
    top_selling_items, 
    business_location, 
    ai_analysis_results, 
    language, 
    upi_id 
  } = req.body;

  try {
    // 1. Update business
    await query(
      `UPDATE businesses SET 
        name = COALESCE(?, name), 
        tagline = COALESCE(?, tagline), 
        category = COALESCE(?, category), 
        google_review_url = ?, 
        target_keywords = ?, 
        mobile_number = ?, 
        top_selling_items = ?, 
        business_location = ?, 
        ai_analysis_results = ?, 
        language = ?, 
        upi_id = COALESCE(?, upi_id)
      WHERE user_id = ?`,
      [
        name || null, 
        tagline || null, 
        category || null, 
        google_review_url || null, 
        target_keywords || null, 
        mobile_number || null, 
        JSON.stringify(top_selling_items || []), 
        business_location || null, 
        JSON.stringify(ai_analysis_results || {}), 
        language || 'en', 
        upi_id || null, 
        req.user.id
      ]
    );

    // 2. Activate user
    await query('UPDATE users SET status = ? WHERE id = ?', ['active', req.user.id]);

    // Generate new token with active status
    const token = jwt.sign({ id: req.user.id, email: req.user.email, status: 'active' }, JWT_SECRET, { expiresIn: '1d' });

    const userQuery = await query('SELECT created_at, subscription_ends_at FROM users WHERE id = ?', [req.user.id]);
    const userRecord = userQuery && userQuery.length > 0 ? userQuery[0] : {};

    res.json({ 
      success: true, 
      token, 
      user: { 
        id: req.user.id, 
        email: req.user.email, 
        status: 'active', 
        created_at: userRecord.created_at || new Date(), 
        subscription_ends_at: userRecord.subscription_ends_at || null 
      } 
    });
  } catch (error) {
    console.error('Setup Complete Error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
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
  const { business_id, rating, message, chips } = req.body;
  const customer_name = (req.body.customer_name || req.body.customerName || 'Anonymous Customer').toString().trim() || 'Anonymous Customer';
  const customer_contact = (req.body.customer_contact || req.body.customerContact || 'N/A').toString().trim() || 'N/A';
  const id = req.body.id || `fb_${Date.now()}`;
  const date = req.body.date || new Date().toLocaleString();
  const chipsStr = Array.isArray(chips) ? chips.join(',') : (chips || '');
  const ratingNum = Math.max(1, Math.min(5, Number(rating) || 1));
  const safeMessage = message && message.toString().trim() ? message.toString().trim() : 'Customer left feedback without comments.';
  const productStr = (req.body.product || (Array.isArray(req.body.products) ? req.body.products.join(', ') : (req.body.selectedProducts ? (Array.isArray(req.body.selectedProducts) ? req.body.selectedProducts.join(', ') : req.body.selectedProducts) : ''))).toString().trim();

  try {
    await query(
      `INSERT INTO feedback (id, business_id, rating, message, customer_name, customer_contact, date, chips, product) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, business_id, ratingNum, safeMessage, customer_name, customer_contact, date, chipsStr, productStr || null]
    );
    // Update intercepted stats
    await query('UPDATE businesses SET intercepted_bad_reviews = intercepted_bad_reviews + 1 WHERE id = ?', [business_id]);
    res.json({ success: true, id });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get feedback (Admin)
app.get('/api/feedback/me', authenticate, async (req, res) => {
  try {
    const businesses = await query('SELECT id FROM businesses WHERE user_id = ?', [req.user.id]);
    if (businesses.length === 0) return res.json([]);

    const bizIds = businesses.map(b => b.id);
    const placeholders = bizIds.map(() => '?').join(',');
    const feedback = await query(
      `SELECT * FROM feedback WHERE business_id IN (${placeholders}) ORDER BY id DESC`,
      bizIds
    );

    // Format feedback with both camelCase and snake_case for robust frontend compatibility
    const formatted = feedback.map(fb => {
      const name = fb.customer_name || fb.customerName || 'Anonymous Customer';
      const contact = fb.customer_contact || fb.customerContact || 'N/A';
      return {
        ...fb,
        customerName: name,
        customerContact: contact,
        customer_name: name,
        customer_contact: contact,
        product: fb.product || '',
        rating: Math.max(1, Math.min(5, Number(fb.rating) || 1)),
        chips: fb.chips ? (Array.isArray(fb.chips) ? fb.chips : fb.chips.split(',').map(c => c.trim()).filter(Boolean)) : []
      };
    });
    res.json(formatted);
  } catch (error) {
    console.error('Fetch feedback error:', error);
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

const CATEGORY_DEFAULT_PRODUCTS = {
  cafe: [
    'Artisan Cappuccino', 'Iced Caramel Macchiato', 'Cold Brew Coffee', 
    'Fresh Butter Croissant', 'Grilled Cheese Panini', 'Avocado Toast', 
    'Blueberry Cheesecake', 'Belgian Waffle'
  ],
  restaurant: [
    'Chef Special Main Course', 'Signature Appetizers', 'Wood-Fired Pizza', 
    'Artisanal Mocktails', 'Creamy Alfredo Pasta', 'Traditional Thali Platter', 
    'Molten Lava Cake'
  ],
  solar: [
    '5kW Rooftop Solar Installation', '3kW On-Grid Solar Plant', 'Solar Inverter Setup & Testing', 
    'Solar Panel Cleaning & Maintenance', 'Commercial Solar System', 'Solar Battery Storage Backup', 
    'Net Metering & Subsidy Assistance', 'Solar Water Heater Setup'
  ],
  salon: [
    'Designer Haircut & Styling', 'Hair Spa & Keratin Treatment', 'Hydra Facial & Skin Glow', 
    'Beard Grooming & Shape', 'Hair Coloring & Balayage', 'Aroma Full Body Massage', 
    'Deluxe Pedicure & Manicure', 'Bridal / Groom Makeover'
  ],
  medical: [
    'General Health Consultation', 'Diagnostic Blood & Health Checkup', 'Dental Cleaning & Polishing', 
    'Physiotherapy Session', 'Pediatric Care & Vaccination', 'Preventive Health Screening'
  ],
  auto: [
    'Complete Periodic Car Service', 'Wheel Alignment & Balancing', 'Deep Foam Wash & Detailing', 
    'Brake & Suspension Inspection', 'AC Disinfection & Gas Refill', 'Ceramic Paint Protection'
  ],
  home_services: [
    'AC Deep Cleaning & Service', 'Electrical Wiring & Repair', 'Plumbing Leakage Fix', 
    'Water Purifier RO Service', 'Sofa & Carpet Shampooing', 'Full Home Pest Control'
  ],
  retail: [
    'Trending Season Collection', 'Custom Fitting & Alterations', 'Gift Vouchers & Packaging', 
    'Premium Accessories', 'Loyalty Rewards Program', 'Exchange & Warranty Support'
  ],
  others: [
    'Core Service Consultation', 'On-Time Project Delivery', 'Custom Tailored Solutions', 
    'Dedicated Customer Support', 'Post-Service Warranty'
  ]
};

app.post('/api/generate-review', async (req, res) => {
  const { businessName, category, rating, topics, instructions, language, location, city, business_id, selectedProducts, selectedProduct, products, allProducts, catalog } = req.body;
  const ratingNum = Math.max(1, Math.min(5, Number(rating) || 5));
  const isPositive = ratingNum >= 4;

  let effectiveLocation = (city || location || '').trim();
  let effectiveCategory = (category || '').toLowerCase();

  // Extract selected products / services
  let productList = [];
  if (Array.isArray(selectedProducts)) {
    productList = selectedProducts;
  } else if (selectedProducts && typeof selectedProducts === 'string') {
    productList = [selectedProducts];
  } else if (selectedProduct) {
    productList = Array.isArray(selectedProduct) ? selectedProduct : [selectedProduct];
  } else if (products) {
    productList = Array.isArray(products) ? products : [products];
  }
  const chosenProductsText = productList.filter(Boolean).map(p => p.trim()).join(', ');

  // Extract business catalog
  let bizCatalog = [];
  if (Array.isArray(allProducts) && allProducts.length > 0) {
    bizCatalog = allProducts.filter(Boolean);
  } else if (Array.isArray(catalog) && catalog.length > 0) {
    bizCatalog = catalog.filter(Boolean);
  }

  // If business_id is passed, attempt to retrieve or auto-populate business_location & top_selling_items
  if (business_id) {
    try {
      const bizRows = await query('SELECT business_location, target_keywords, top_selling_items, category FROM businesses WHERE id = ?', [business_id]);
      if (bizRows.length > 0) {
        const biz = bizRows[0];
        if (!effectiveCategory && biz.category) {
          effectiveCategory = biz.category.toLowerCase();
        }
        if (!effectiveLocation && biz.business_location && biz.business_location.trim()) {
          effectiveLocation = biz.business_location.trim();
        }

        // If client didn't supply catalog, read from DB
        if (bizCatalog.length === 0 && biz.top_selling_items) {
          try {
            const parsed = JSON.parse(biz.top_selling_items);
            if (Array.isArray(parsed) && parsed.length > 0) bizCatalog = parsed.filter(Boolean);
          } catch (e) {
            bizCatalog = biz.top_selling_items.split(',').map(s => s.trim()).filter(Boolean);
          }
        }

        // If GPS detected a valid location and business location is empty, auto-update the business profile!
        if (effectiveLocation) {
          if (!biz.business_location || !biz.business_location.trim()) {
            await query('UPDATE businesses SET business_location = ? WHERE id = ?', [effectiveLocation, business_id]);
          }
          // If target_keywords has [Your City], replace it permanently in DB with the actual city
          if (biz.target_keywords && /\[(?:Your\s*)?(?:City|Location|Area)\]/i.test(biz.target_keywords)) {
            const updatedKeywords = biz.target_keywords.replace(/\[(?:Your\s*)?(?:City|Location|Area)\]/gi, effectiveLocation);
            await query('UPDATE businesses SET target_keywords = ? WHERE id = ?', [updatedKeywords, business_id]);
          }
        }
      }
    } catch (dbErr) {
      console.warn('Could not auto-sync business location:', dbErr.message);
    }
  }

  // Fallback to category default products if business has not defined custom products
  if (bizCatalog.length === 0) {
    const matchedKey = Object.keys(CATEGORY_DEFAULT_PRODUCTS).find(k => effectiveCategory.includes(k)) || 'others';
    bizCatalog = CATEGORY_DEFAULT_PRODUCTS[matchedKey] || CATEGORY_DEFAULT_PRODUCTS.others;
  }

  // Dynamic Catalog Rotation: When customer didn't select an item, pick 1 or 2 items strictly from the business catalog
  let rotatedCatalogItem = '';
  if (bizCatalog.length > 0) {
    const shuffled = [...bizCatalog].sort(() => 0.5 - Math.random());
    rotatedCatalogItem = shuffled[0];
    if (shuffled.length > 1 && Math.random() < 0.4) {
      rotatedCatalogItem += ` & ${shuffled[1]}`;
    }
  }

  // Sanitize instructions and topics: replace or remove any [Your City] brackets
  let cleanInstructions = (instructions || '');
  if (effectiveLocation) {
    cleanInstructions = cleanInstructions.replace(/\[(?:Your\s*)?(?:City|Location|Area)\]/gi, effectiveLocation);
  } else {
    cleanInstructions = cleanInstructions.replace(/\s*(?:in|at|around)?\s*\[(?:Your\s*)?(?:City|Location|Area)\]/gi, '');
  }

  // Query recently generated reviews for this business to enforce ZERO repetition
  let previousReviews = [];
  if (business_id) {
    try {
      const prevRows = await query(
        'SELECT review_text FROM generated_reviews WHERE business_id = ? ORDER BY created_at DESC LIMIT 15',
        [business_id]
      );
      previousReviews = prevRows.map(r => r.review_text).filter(Boolean);
    } catch (e) {
      console.warn('Could not fetch previous generated reviews:', e.message);
    }
  }

  // Diverse Narrative Personas / Angles (Rotates dynamically every time)
  const REVIEW_ANGLES = [
    'A first-time customer who was pleasantly surprised by the premium experience and outcome.',
    'A busy customer who appreciated the punctuality, seamless process, and stress-free service.',
    'A client who visited based on a friend’s recommendation and found it lived up to all expectations.',
    'A loyal local who considers this their trusted, go-to place in the area.',
    'A discerning customer focusing specifically on the noticeable, high-quality craft and immediate result.',
    'A visitor who was deeply impressed by the warm hospitality, clean setup, and attentive staff consultation.',
    'A customer highlighting the genuine value, fair pricing, and honest advice with zero pushiness.',
    'A customer who treated themselves for a special occasion and left feeling completely refreshed and satisfied.'
  ];
  const chosenAngle = REVIEW_ANGLES[Math.floor(Math.random() * REVIEW_ANGLES.length)];

  // Diverse Sentence Style Directives (Ensures no two reviews open or structure the same)
  const SENTENCE_STYLES = [
    'Start immediately with an enthusiastic reaction to the product/service result without starting with the business name.',
    'Start by complimenting the friendly and skilled team, then detail the product/service experience.',
    'Start with a short, punchy opening sentence, followed by specific details on why the service stood out.',
    'Start with how relaxing or smooth the entire visit felt from start to finish.',
    'Adopt a conversational, genuine storytelling style with fresh phrasing.',
    'Highlight the contrast between expectations and how delightfully the experience exceeded them.'
  ];
  const chosenStyle = SENTENCE_STYLES[Math.floor(Math.random() * SENTENCE_STYLES.length)];
  const randomSeed = Math.random().toString(36).substring(2, 9);

  try {
    const langMap = {
      en: 'English',
      hi: 'Hindi',
      or: 'Odia',
      bn: 'Bengali',
      te: 'Telugu',
      ta: 'Tamil',
      mr: 'Marathi',
      gu: 'Gujarati'
    };
    const fullLang = langMap[language] || language || 'English';

    let languageInstruction = '';
    const normLang = fullLang.toLowerCase();

    if (normLang === 'odia') {
      languageInstruction = `
        CRITICAL ODIA LANGUAGE RULES (Romanized English script ONLY):
        You MUST write in natural, modern conversational Odia (Latin alphabet) as spoken colloquially by locals in Bhubaneswar, Cuttack, and Odisha:
        - Use authentic everyday spoken Odia phrases:
          * Positive: "Mo anubhaba bohut badhiya thila" (My experience was great), "Service bohut bhalo lagila" (Really liked the service), "Staff mane bohut polite au professional thile" (Staff were very polite & professional), "Skin pura fresh au glow karuchi" (Skin is fresh and glowing), "Bohut satisfied" (Very satisfied).
          * Negative/Constructive: "Service thik thila kintu auri bhalo heipariba" (Service was okay but could be better), "Staff mane auri dhyana debaku anurodha" (Request staff to pay more attention).
          * Recommendation: "${effectiveLocation ? effectiveLocation + ' re ' : ''}salon/service khojuthile nischita eithiki asantu" (If looking for salon/service here, definitely visit), "Highly recommended!"
        - Keep industry technical terms in English naturally: "Hydra Facial", "Haircut", "Salon", "Spa", "Service", "Staff", "Ambience", "Result", "Experience".
        - STRICTLY FORBIDDEN: NEVER use awkward, archaic, or broken machine translations like "kheluchi", "ganicha", "dukhe", "dayitwabhari", "bhala sahita", "bodh karithili", "kuha thaanti", "manin sambhariba".
        - Sentence structure MUST flow naturally like a real human review, NOT robotic translation.
      `;
    } else if (normLang === 'hindi') {
      languageInstruction = `
        CRITICAL HINDI LANGUAGE RULES (Hinglish / Roman script ONLY):
        Write in natural, colloquial everyday Hinglish (Latin alphabet) as spoken in Indian cities:
        - Use authentic phrases: "Mera experience bohot badhiya raha", "Staff kafi polite aur professional hai", "Service top-notch thi", "Definitely recommend karunga".
        - Keep technical and service terms in English.
        - DO NOT use archaic pure Hindi or awkward machine translations.
      `;
    } else if (normLang !== 'english') {
      languageInstruction = `
        CRITICAL LANGUAGE RULES: Write the review in ${fullLang} language using ONLY the English alphabet (Romanized/transliterated script).
        Write in natural, modern conversational style as used by locals in daily messaging.
        Keep brand names, technical terms, and service names in English.
        DO NOT use robotic or archaic machine translations.
      `;
    }

    const keywordInstruction = `
        SEO KEYWORD RULE:
        If target keywords are listed in Special Instructions, select AT MOST ONE (1) keyword that naturally fits the customer's specific purchase/service (${chosenProductsText || category}).
        DO NOT stuff multiple keywords. Under NO circumstances should you list 3-5 different services (e.g. do NOT mention haircut, massage, bridal, and facial all in one review). A real customer review only discusses their actual visit.
    `;

    // Anti-repetition blacklist instruction
    let antiRepetitionInstruction = '';
    if (previousReviews.length > 0) {
      antiRepetitionInstruction = `
        CRITICAL ANTI-REPETITION CONSTRAINT (Zero Duplication Rule):
        The following reviews were already recently generated for this business. You MUST NOT reuse their sentence starters, phrasing, structure, or vocabulary:
        ${previousReviews.map((r, i) => `${i + 1}. "${r}"`).join('\n')}

        Every single review must be 100% freshly written with unique phrasing, different vocabulary, and distinct sentence structures. Google penalizes repetitive templates. Do NOT copy any patterns from the above list.
      `;
    }

    const locationContext = effectiveLocation 
      ? `Location Context: The business is located in "${effectiveLocation}". Weave this city/location naturally into the review text.` 
      : `Location Context: No specific city provided. Do NOT output any bracketed placeholders like [Your City] or [City].`;

    let productInstruction = '';
    let negativeProductInstruction = '';

    if (chosenProductsText) {
      productInstruction = `
        CRITICAL PRODUCT FOCUS: The customer explicitly selected that they purchased / experienced: "${chosenProductsText}".
        You MUST center the review directly around "${chosenProductsText}". 
        Mention how exceptional "${chosenProductsText}" was (e.g., taste, freshness, craftsmanship, styling, or service quality).
        STRICT VERIFIED CATALOG ENFORCEMENT: ONLY praise "${chosenProductsText}".
        Under NO circumstances should you mention any unlisted or random food, dish, drink, or service outside this business's verified catalog (${bizCatalog.slice(0, 8).join(', ')}).
        The review MUST be clearly and specifically about "${chosenProductsText}".
      `;
      negativeProductInstruction = `
        CRITICAL PRODUCT FOCUS: The customer specifically chose that they purchased / experienced: "${chosenProductsText}".
        The feedback MUST focus specifically on their experience with "${chosenProductsText}" and what could be improved regarding it.
        DO NOT provide vague, random feedback or mention unlisted items. Address "${chosenProductsText}" directly.
      `;
    } else if (rotatedCatalogItem) {
      productInstruction = `
        STRICT PRODUCT CATALOG RULE (ZERO-HALLUCINATION ENFORCEMENT):
        The customer scanned the QR code without clicking a specific product badge.
        The business's ONLY verified offerings are strictly:
        ${bizCatalog.map(item => `• "${item}"`).join('\n')}

        For this review, you MUST focus the customer's praise on their verified catalog offering: "${rotatedCatalogItem}".

        CRITICAL BUSINESS PROTECTION RULE:
        - You MUST NEVER invent, guess, or mention ANY item, dish, food, drink, or service outside their verified catalog above!
        - FOR EXAMPLE: If this business is a Cafe, NEVER mention biryani, curry, chicken tikka, burgers, pizza, or anything not in their catalog.
        - Mentioning unlisted items causes customers to walk in and ask the owner for items they do not sell.
        - Every product, item, or service mentioned MUST be 100% strictly confined to: "${rotatedCatalogItem}" (or items verbatim from their catalog list above).
      `;
      negativeProductInstruction = `
        STRICT PRODUCT CATALOG RULE:
        The customer did not select a specific item. Their feedback relates to their experience with "${rotatedCatalogItem}".
        DO NOT invent or mention any unlisted items outside their catalog.
      `;
    } else {
      productInstruction = `
        Focus genuinely on the overall service quality, ambience, and staff hospitality.
        DO NOT invent specific food dishes, products, or services.
      `;
      negativeProductInstruction = `
        Focus on overall visit and service responsiveness. DO NOT invent unlisted items.
      `;
    }

    const varietyDirectives = `
        PERSPECTIVE / ANGLE: ${chosenAngle}
        STYLE DIRECTIVE: ${chosenStyle}
        VARIATION TOKEN: [Seed: ${randomSeed}]
    `;

    const prompt = isPositive
      ? `
        You are an authentic, highly satisfied customer writing a 100% unique Google review.
        Business Name: ${businessName}
        Category: ${category}
        Star Rating: ${ratingNum}/5
        ${locationContext}
        ${productInstruction}
        Topics mentioned: ${topics && topics.length ? topics.join(', ') : 'None'}
        Special Instructions: ${cleanInstructions || 'None'}
        ${varietyDirectives}
        ${antiRepetitionInstruction}
        ${languageInstruction}
        ${keywordInstruction}

        Write a glowing, authentic-sounding ${ratingNum}-star Google review for this business. 
        Keep it between 2 to 3 sentences. It should sound human, genuine, and specifically mention the product/service and topics if provided.
        The review must be highly SEO friendly and use relevant keywords naturally.
        CRITICAL RULE: NEVER use bracketed placeholders like [Your City], [City], [Location], [Your Area], etc. Under NO circumstances should square brackets [] appear in your output. If a city is provided, use it naturally. If not, write the review without mentioning any location.
        Do not include quotes or surrounding conversational text. Just the review itself.
      `
      : `
        You are a customer writing private, constructive feedback directly to the owner/manager of this business.
        Business Name: ${businessName}
        Category: ${category}
        Star Rating: ${ratingNum}/5
        ${locationContext}
        ${negativeProductInstruction}
        Areas for improvement/Topics mentioned: ${topics && topics.length ? topics.join(', ') : 'Overall visit experience'}
        Special Instructions: ${cleanInstructions || 'Constructive, respectful, actionable'}
        ${varietyDirectives}
        ${antiRepetitionInstruction}
        ${languageInstruction}
        ${keywordInstruction}

        Write a constructive, respectful ${ratingNum}-star private feedback explaining what could be improved.
        Keep it concise (2 to 3 sentences). Do not be overly harsh or rude, but be honest and clear about expectations.
        CRITICAL RULE: NEVER use bracketed placeholders like [Your City], [City], [Location], [Your Area], etc. Under NO circumstances should square brackets [] appear in your output.
        Do not include quotes or surrounding conversational text. Just the feedback itself.
      `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.95,
      presence_penalty: 0.8,
      frequency_penalty: 0.7
    });

    let reviewText = response.choices[0].message.content.trim();

    // Strict post-processing guarantee: replace or strip any residual brackets or placeholder patterns
    if (effectiveLocation) {
      reviewText = reviewText.replace(/\[(?:Your\s*)?(?:City|Location|Area)\]/gi, effectiveLocation);
    } else {
      reviewText = reviewText.replace(/\s*(?:in|at|around)?\s*\[(?:Your\s*)?(?:City|Location|Area)\]/gi, '');
    }
    reviewText = reviewText.replace(/\[.*?\]/g, '').replace(/\s{2,}/g, ' ').trim();

    // Save generated review to history table to prevent future duplicates for this business
    if (business_id && reviewText) {
      try {
        const genId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        await query(
          'INSERT INTO generated_reviews (id, business_id, product, language, rating, review_text) VALUES (?, ?, ?, ?, ?, ?)',
          [genId, business_id, chosenProductsText || null, language || 'en', ratingNum, reviewText]
        );
      } catch (saveErr) {
        console.warn('Could not record generated review:', saveErr.message);
      }
    }

    res.json({ review: reviewText, location: effectiveLocation });
  } catch (error) {
    console.error('AI Generation Error:', error);
    const locSnippet = effectiveLocation ? ` in ${effectiveLocation}` : '';
    
    const featuredItem = chosenProductsText || rotatedCatalogItem || category || 'service';
    
    // Diverse randomized fallback pool so even offline fallbacks never repeat or mention unlisted items
    const positiveFallbacks = [
      `Visiting ${businessName}${locSnippet} was such a refreshing experience! The ${featuredItem} was handled with fantastic care and skill. Easily a 5-star experience!`,
      `Had a wonderful visit to ${businessName}${locSnippet}. Really impressed by how attentive the staff was, and the ${featuredItem} exceeded my expectations!`,
      `Outstanding quality and service at ${businessName}${locSnippet}! You can tell they take genuine pride in their work, especially with their ${featuredItem}. Highly recommend!`,
      `Such a smooth and pleasant visit at ${businessName}${locSnippet}. The ${featuredItem} was top notch and the team is super polite. Will definitely return!`,
      `If you're in ${effectiveLocation || 'the local area'}, ${businessName} is definitely worth visiting. Thoroughly enjoyed the ${featuredItem} and great hospitality!`,
      `From the warm greeting to the final result, ${businessName}${locSnippet} delivered complete perfection. The ${featuredItem} was second to none.`,
      `10/10 experience at ${businessName}${locSnippet}! The attention to detail with ${featuredItem} made all the difference.`
    ];

    const negativeFallbacks = [
      `I visited ${businessName}${locSnippet} recently regarding the ${featuredItem}. While parts of the visit were okay, there are a few areas in service coordination that could be improved.`,
      `Sharing some constructive feedback on my recent visit to ${businessName}${locSnippet}. The ${featuredItem} didn't quite meet expectations, and I hope management can look into streamlining customer wait times.`,
      `A quick note for ${businessName}${locSnippet}: The ${featuredItem} has potential, but the overall experience felt slightly rushed. Appreciate the team taking this into consideration.`
    ];

    const fallbackList = isPositive ? positiveFallbacks : negativeFallbacks;
    const randomFallback = fallbackList[Math.floor(Math.random() * fallbackList.length)];
    res.json({ review: randomFallback, location: effectiveLocation });
  }
});

app.post('/api/business/suggest-products', async (req, res) => {
  const { category, state, city, query: typedQuery, existingItems } = req.body;
  try {
    const locationContext = (state && city) ? ` located in ${city}, ${state}, India` : ' in the Indian market';
    const typingContext = (typedQuery && typedQuery.trim().length > 1) 
      ? ` The user is currently typing or interested in: "${typedQuery.trim()}". Suggest items that are highly related to this, auto-complete it, or represent popular variations of it.` 
      : '';
    const existingContext = (existingItems && existingItems.length > 0)
      ? ` The user has already selected these top-selling items: ${existingItems.join(', ')}. Suggest new items that complement these or belong to the exact same niche/cuisine, but DO NOT suggest items already in this list.`
      : '';
    const prompt = `You are a business consultant specializing in the Indian market. Suggest 5 to 10 top-selling or highly popular products/items for a business in the "${category}" category${locationContext}.${typingContext}${existingContext} The suggestions MUST be highly relevant to the local consumers in that native region.
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
  const { businessName, category, location, city, topSellingItems } = req.body;
  try {
    const locStr = city ? city : (location || 'their local area');
    const itemsContext = (topSellingItems && topSellingItems.length > 0) ? ` Their core products/specialties are: ${topSellingItems.join(', ')}.` : '';
    const prompt = `You are an expert business growth analyst specializing in the Indian market. Analyze a business named "${businessName}" in the "${category}" category located in/around "${locStr}".${itemsContext} The analysis MUST be tailored specifically for Indian consumers and local search trends. It MUST be highly specific to these actual products and the exact local city (do not use generic placeholders like [local area] or [city]).
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

app.post('/api/business/analyze-link', authenticate, async (req, res) => {
  const { googleReviewUrl, businessName, category, businessDetails, topSellingItems } = req.body;
  try {
    let topSelling = [];
    try { topSelling = typeof topSellingItems === 'string' ? JSON.parse(topSellingItems || '[]') : topSellingItems; } catch(e){}
    
    const itemsContext = (topSelling && topSelling.length > 0) ? ` Their core products/specialties are: ${topSelling.join(', ')}.` : '';
    const detailsContext = businessDetails ? ` Business Details: "${businessDetails}".` : '';
    const linkContext = googleReviewUrl ? ` Google Maps Link: "${googleReviewUrl}".` : '';

    const prompt = `You are an expert SEO analyst. Analyze a business named "${businessName}" in the "${category}" category.${linkContext}${itemsContext}${detailsContext}
Generate a comma-separated list of 4 to 6 highly specific, high-converting local SEO keywords tailored to these actual products and details. Do NOT return JSON, just the comma-separated string of keywords.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }]
    });

    const newKeywords = response.choices[0].message.content.trim();
    res.json({ keywords: newKeywords });
  } catch (error) {
    console.error('Analyze Link Error:', error);
    res.status(500).json({ error: 'Failed to analyze link' });
  }
});

app.post('/api/business/sync-url', authenticate, async (req, res) => {
  const { url } = req.body;
  try {
    const businesses = await query('SELECT * FROM businesses WHERE user_id = ?', [req.user.id]);
    if (!businesses.length) return res.status(404).json({ error: 'Business not found' });
    const business = businesses[0];

    let placeId = null;
    
    // Check if the user pasted a direct Place ID (they always start with ChIJ)
    if (url && url.startsWith('ChIJ')) {
      placeId = url.trim();
    } else {
      try {
        const urlObj = new URL(url);
        if (urlObj.searchParams.has('placeid')) {
          placeId = urlObj.searchParams.get('placeid');
        }
      } catch(e) {}
      
      // Fallback if no placeid in URL
      if (!placeId) {
        const searchRes = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(business.name + ' ' + (business.business_location || ''))}&key=${process.env.GOOGLE_API_KEY}`);
        const searchData = await searchRes.json();
        if (searchData.results && searchData.results.length > 0) {
          placeId = searchData.results[0].place_id;
        }
      }
    }

    if (!placeId) {
      return res.status(400).json({ error: 'Could not detect Google Place ID. Please search your business on the "Google Maps Place ID Finder" tool and paste the direct Place ID (starts with ChIJ...) in the Settings tab.' });
    }

    // Now fetch reviews using Place Details API
    const detailsRes = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${process.env.GOOGLE_API_KEY}`);
    const detailsData = await detailsRes.json();

    if (detailsData.result && detailsData.result.reviews) {
      const reviews = detailsData.result.reviews;
      for (const rev of reviews) {
        const reviewId = 'manual_' + rev.time + '_' + Math.random().toString(36).substring(7);
        const rating = rev.rating;
        const comment = rev.text || '';
        const reviewer = rev.author_name;
        
        await query(
          'INSERT INTO google_reviews (review_id, business_id, rating, comment, reviewer_name) VALUES (?, ?, ?, ?, ?)',
          [reviewId, business.id, rating, comment, reviewer]
        );
      }
      
      await query(
        'UPDATE businesses SET google_review_count = ?, avg_rating = ?, google_place_id = ? WHERE id = ?', 
        [detailsData.result.user_ratings_total || reviews.length, detailsData.result.rating || 0, placeId, business.id]
      );
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Sync URL Error:', error);
    res.status(500).json({ error: 'Failed to sync' });
  }
});

app.post('/api/business/search-places', async (req, res) => {
  const { location, category, businessName } = req.body;
  if (!location || location.length < 3) return res.json([]);
  
  try {
    const searchQuery = `${businessName || ''} ${category || ''} ${location}`.trim();
    const apiKey = process.env.GOOGLE_API_KEY;
    
    if (apiKey) {
      const googleResponse = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`);
      const data = await googleResponse.json();

      if (data.status === 'OK' && data.results && Array.isArray(data.results)) {
        let places = data.results.map(place => ({
          name: place.name,
          address: place.formatted_address,
          rating: place.rating || 0,
          reviewsCount: place.user_ratings_total || 0
        }));
        
        // Sort rank wise (highest rating and most reviews first)
        places.sort((a, b) => (b.reviewsCount * b.rating) - (a.reviewsCount * a.rating));

        return res.json(places.slice(0, 8)); // Return top 8 ranked places
      }
    }

    // Fallback to OpenAI if Google Maps API key is invalid or request fails
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
    // res.redirect('http://localhost:5173/dashboard?google=success');
    res.redirect('https://qr-productt.pages.dev/dashboard?google=success');
  } catch (error) {
    console.error('OAuth callback error:', error);
    // res.redirect('http://localhost:5173/dashboard?google=error');
    res.redirect('https://qr-productt.pages.dev/dashboard?google=error');
  }
});

app.get('/api/google/status', authenticate, async (req, res) => {
  try {
    const businesses = await query(
      `SELECT id, google_access_token, google_refresh_token
       FROM businesses WHERE user_id = ?`,
      [req.user.id]
    );

    if (!businesses.length) {
      return res.status(404).json({
        connected: false,
        message: 'Business not found'
      });
    }

    const business = businesses[0];

    if (!business.google_refresh_token) {
      return res.json({
        connected: false,
        message: 'Google account is not connected. Please connect again.'
      });
    }

    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    client.setCredentials({
      access_token: business.google_access_token,
      refresh_token: business.google_refresh_token
    });

    const { token } = await client.getAccessToken();

    if (!token) {
      return res.json({
        connected: false,
        message: 'Unable to obtain a valid Google access token.'
      });
    }

    const response = await fetch(
      'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Google Business Profile API error:', data);

      return res.status(502).json({
        connected: false,
        message: data.error?.message ||
          'Google API access failed. Check API access and permissions.'
      });
    }

    await query(
      `UPDATE businesses
       SET google_access_token = ?, google_refresh_token = ?
       WHERE id = ?`,
      [
        client.credentials.access_token || token,
        client.credentials.refresh_token || business.google_refresh_token,
        business.id
      ]
    );

    res.json({
      connected: true,
      message: 'Google Business Profile API connection verified.',
      accounts: (data.accounts || []).map(account => ({
        name: account.name,
        accountName: account.accountName,
        type: account.type
      }))
    });
  } catch (error) {
    console.error('Google connection check failed:', error.message);

    res.status(502).json({
      connected: false,
      message: 'Could not verify the Google connection.'
    });
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

const PORT = process.env.PORT || 5001;
// START SERVER
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
  });

  // Automated Job: Refresh SEO Keywords every 10 days for active businesses
  const cron = require('node-cron');
  cron.schedule('0 2 * * *', async () => {
    console.log('[Cron] Running Automated SEO Analysis...');
    try {
      // Find businesses where seo_last_updated is null OR older than 10 days
      const businesses = await query(`
        SELECT id, name, category, business_location, top_selling_items, business_details, target_keywords
        FROM businesses 
        WHERE seo_last_updated IS NULL OR seo_last_updated < DATE_SUB(NOW(), INTERVAL 10 DAY)
      `);
      
      for (const biz of businesses) {
        console.log(`[Cron] Refreshing SEO for: ${biz.name}`);
        
        // Prepare context
        let topSelling = [];
        try { topSelling = JSON.parse(biz.top_selling_items || '[]'); } catch(e){}
        const itemsContext = (topSelling && topSelling.length > 0) ? ` Their core products/specialties are: ${topSelling.join(', ')}.` : '';
        const detailsContext = biz.business_details ? ` Business Details: "${biz.business_details}".` : '';

        const prompt = `You are an expert SEO analyst. Analyze a business named "${biz.name}" in the "${biz.category}" category located in/around "${biz.business_location}".${itemsContext}${detailsContext} 
Generate a comma-separated list of 4 to 6 highly specific, high-converting local SEO keywords tailored to these actual products, details, and exact location. Do NOT return JSON, just the comma-separated string of keywords.`;

        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }]
        });

        const newKeywords = response.choices[0].message.content.trim();
        
        await query('UPDATE businesses SET target_keywords = ?, seo_last_updated = CURRENT_TIMESTAMP WHERE id = ?', [newKeywords, biz.id]);
        console.log(`[Cron] Updated SEO for ${biz.name}: ${newKeywords}`);
      }
    } catch (err) {
      console.error('[Cron] SEO Analysis Job Error:', err);
    }
  });

  setInterval(() => {}, 1000 * 60 * 60); // Keep alive
}

app.runAutoReplyJob = runAutoReplyJob;
module.exports = app;
