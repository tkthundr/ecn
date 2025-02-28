// File: /api/subscribe.js
import pkg from 'pg';
const { Pool } = pkg;

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Needed for connecting to Neon
  }
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { caseId, email, subscriptionDate, isActive } = req.body;

    // Validate required fields
    if (!caseId || !email) {
      return res.status(400).json({ message: 'Case ID and email are required' });
    }

    // Validate case ID format
    const caseIdPattern = /^\d{2}[A-Z]\d{6}-\d{3}$/;
    if (!caseIdPattern.test(caseId)) {
      return res.status(400).json({ message: 'Invalid case ID format' });
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if subscription already exists
    const existingSubscriptionResult = await pool.query(
      'SELECT * FROM case_subscriptions WHERE case_id = $1 AND email = $2',
      [caseId, email]
    );

    if (existingSubscriptionResult.rowCount > 0) {
      // Update existing subscription
      await pool.query(
        'UPDATE case_subscriptions SET is_active = $1, updated_at = NOW() WHERE case_id = $2 AND email = $3',
        [isActive, caseId, email]
      );
      
      return res.status(200).json({ 
        message: 'Subscription updated successfully',
        updated: true
      });
    }

    // Check if user has reached free tier limit (1 case per email)
    const userSubscriptionCountResult = await pool.query(
      'SELECT COUNT(*) FROM case_subscriptions WHERE email = $1',
      [email]
    );
    
    const count = parseInt(userSubscriptionCountResult.rows[0].count);
    if (count >= 1) {
      return res.status(403).json({
        message: 'Free tier limit reached! Please upgrade your plan to monitor additional cases.',
        limitReached: true
      });
    }

    // Insert new subscription
    await pool.query(
      'INSERT INTO case_subscriptions (case_id, email, subscription_date, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
      [caseId, email, subscriptionDate, isActive]
    );

    return res.status(201).json({ 
      message: 'Subscription created successfully',
      created: true
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}