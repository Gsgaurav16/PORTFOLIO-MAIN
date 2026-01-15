/**
 * Reviews Routes
 * ==============
 */
import { Router, Request, Response } from 'express';
import { query } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody, validateParams } from '../middleware/validate.js';
import { createReviewSchema, updateReviewSchema, uuidSchema } from '../schema/validation.js';
import { adminLimiter } from '../middleware/rateLimiter.js';

const router = Router();

/**
 * GET /api/reviews
 * Fetch all reviews (Public)
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM reviews ORDER BY created_at DESC');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
    }
});

/**
 * POST /api/reviews
 * Create a new review (Admin only)
 */
router.post('/', authenticateToken, adminLimiter, validateBody(createReviewSchema), async (req: Request, res: Response) => {
    try {
        const { name, role, text, rating } = req.body;
        const result = await query(
            'INSERT INTO reviews (name, role, text, rating) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, role, text, rating]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create review' });
    }
});

/**
 * PUT /api/reviews/:id
 * Update a review (Admin only)
 */
router.put('/:id', authenticateToken, adminLimiter, validateParams(z.object({ id: uuidSchema })), validateBody(updateReviewSchema), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Dynamic update query
        const fields = Object.keys(updates);
        const values = Object.values(updates);

        if (fields.length === 0) {
            return res.status(400).json({ success: false, error: 'No updates provided' });
        }

        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

        const result = await query(
            `UPDATE reviews SET ${setClause} WHERE id = $1 RETURNING *`,
            [id, ...values]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update review' });
    }
});

/**
 * DELETE /api/reviews/:id
 * Delete a review (Admin only)
 */
router.delete('/:id', authenticateToken, adminLimiter, validateParams(z.object({ id: uuidSchema })), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM reviews WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }

        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete review' });
    }
});

import { z } from 'zod'; // Needed for inline schema
export default router;
