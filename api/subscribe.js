// File: /api/subscribe.js
import { sql } from '@vercel/postgres';

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
    const existingSubscription = await sql`
      SELECT * FROM case_subscriptions 
      WHERE case_id = ${caseId} AND email = ${email}
    `;

    if (existingSubscription.rowCount > 0) {
      // Update existing subscription
      await sql`
        UPDATE case_subscriptions 
        SET is_active = ${isActive}, 
            updated_at = NOW()
        WHERE case_id = ${caseId} AND email = ${email}
      `;
      
      return res.status(200).json({ 
        message: 'Subscription updated successfully',
        updated: true
      });
    }

    // Check if user has reached free tier limit (1 case per email)
    const userSubscriptionCount = await sql`
      SELECT COUNT(*) FROM case_subscriptions 
      WHERE email = ${email}
    `;
    
    const count = parseInt(userSubscriptionCount.rows[0].count);
    if (count >= 1) {
      return res.status(403).json({
        message: 'Free tier limit reached! Please upgrade your plan to monitor additional cases.',
        limitReached: true
      });
    }

    // Insert new subscription
    await sql`
      INSERT INTO case_subscriptions (case_id, email, subscription_date, is_active, created_at, updated_at)
      VALUES (${caseId}, ${email}, ${subscriptionDate}, ${isActive}, NOW(), NOW())
    `;

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