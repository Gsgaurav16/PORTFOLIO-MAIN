/**
 * Retro Portfolio API Server
 * ==========================
 * Main entry point with security middleware
 * OWASP Best Practices Applied
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import projectsRoutes from './routes/projects.js';
import skillsRoutes from './routes/skills.js';
import experiencesRoutes from './routes/experiences.js';
import socialsRoutes from './routes/socials.js';
import profileRoutes from './routes/profile.js';
import messagesRoutes from './routes/messages.js';
import reviewsRoutes from './routes/reviews.js';

// Import middleware
import { globalLimiter } from './middleware/rateLimiter.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ==============================================
// SECURITY MIDDLEWARE (OWASP)
// ==============================================

/**
 * Helmet - Sets various HTTP headers for security
 * - X-Content-Type-Options: nosniff
 * - X-Frame-Options: DENY
 * - X-XSS-Protection: 1; mode=block
 * - Strict-Transport-Security
 */
app.use(helmet());

/**
 * CORS - Only allow specified origins
 * OWASP: Restrict cross-origin requests
 */
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('CORS not allowed'), false);
    },
    credentials: true, // Allow cookies
}));

/**
 * Body parsers with size limits
 * OWASP: Prevent large payload attacks
 */
app.use(express.json({ limit: '10kb' })); // Limit JSON body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/**
 * Cookie parser for httpOnly cookies
 */
app.use(cookieParser());

/**
 * Global rate limiter
 * OWASP: Prevent DoS attacks
 */
app.use(globalLimiter);

// ==============================================
// ROUTES
// ==============================================

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/experiences', experiencesRoutes);
app.use('/api/socials', socialsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/reviews', reviewsRoutes);

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
    });
});

/**
 * 404 handler
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not found',
        message: `Route ${req.method} ${req.path} not found`,
    });
});

/**
 * Global error handler
 * OWASP: Don't expose stack traces in production
 */
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('❌ Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
    });
});

// ==============================================
// START SERVER
// ==============================================

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`
    🎮 ========================================
       RETRO PORTFOLIO API SERVER
       Running on port ${PORT}
       Environment: ${process.env.NODE_ENV || 'development'}
    🎮 ========================================
        `);
    });
}

export default app;
// Force restart for env update
