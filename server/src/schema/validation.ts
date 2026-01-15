/**
 * Zod Validation Schemas
 * ======================
 * OWASP A03:2021 - Injection Prevention
 * - Strict schemas reject unexpected fields
 * - Length limits prevent buffer overflow attacks
 * - Type coercion prevents type confusion
 */
import { z } from 'zod';

// ==============================================
// SANITIZATION HELPERS
// ==============================================

/**
 * Strip HTML tags to prevent XSS
 * OWASP: Never trust user input
 */
const sanitizeString = (str: string) => str.replace(/<[^>]*>/g, '').trim();

/**
 * Create a sanitized string schema with max length
 */
const safeString = (maxLength: number = 255) =>
    z.string()
        .max(maxLength, `Maximum ${maxLength} characters allowed`)
        .transform(sanitizeString);

/**
 * Create an optional sanitized string schema
 */
const optionalSafeString = (maxLength: number = 255) =>
    z.string()
        .max(maxLength)
        .transform(sanitizeString)
        .optional()
        .or(z.literal(''));

// ==============================================
// AUTH SCHEMAS
// ==============================================

export const loginSchema = z.object({
    username: safeString(50),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100),
}).strict(); // Reject unexpected fields

// ==============================================
// PROJECT SCHEMAS
// ==============================================

export const createProjectSchema = z.object({
    title: safeString(100),
    subtitle: optionalSafeString(255),
    stack: z.array(safeString(50)).max(10, 'Maximum 10 stack items'),
    features: z.array(safeString(255)).max(10, 'Maximum 10 features'),
    link: z.string().url().optional().or(z.literal('')),
    image: optionalSafeString(255),
}).strict();

export const updateProjectSchema = createProjectSchema.partial().strict();

// ==============================================
// SKILL SCHEMAS
// ==============================================

export const createSkillSchema = z.object({
    title: safeString(100),
    level: optionalSafeString(50),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
    progress: z.number().int().min(0).max(100).optional(),
    totalSkills: z.number().int().min(0).max(100).optional(),
    equipment: z.array(safeString(50)).max(20, 'Maximum 20 equipment items'),
    achievements: z.array(safeString(255)).max(10, 'Maximum 10 achievements'),
}).strict();

export const updateSkillSchema = createSkillSchema.partial().strict();

// ==============================================
// EXPERIENCE SCHEMAS
// ==============================================

export const createExperienceSchema = z.object({
    company: safeString(100),
    role: safeString(100),
    period: optionalSafeString(50),
    description: optionalSafeString(1000),
    achievements: z.array(safeString(255)).max(10, 'Maximum 10 achievements'),
    stack: z.array(safeString(50)).max(10, 'Maximum 10 stack items'),
}).strict();

export const updateExperienceSchema = createExperienceSchema.partial().strict();

// ==============================================
// SOCIAL SCHEMAS
// ==============================================

const socialPlatforms = ['github', 'linkedin', 'twitter', 'email', 'discord'] as const;

export const updateSocialSchema = z.object({
    platform: safeString(50), // Relaxed from enum to string to support any platform in DB
    href: z.string().max(255).optional().or(z.literal('')), // Allow empty or flexible URL
    label: safeString(50),
}).strict();

// ==============================================
// PROFILE SCHEMAS
// ==============================================

export const updateProfileSchema = z.object({
    name: safeString(100).optional(),
    role: optionalSafeString(100),
    bio: optionalSafeString(1000),
    years: optionalSafeString(10),
    projects_count: optionalSafeString(10),
    awesomeness: optionalSafeString(10),
    expertise: z.array(safeString(50)).max(10, 'Maximum 10 expertise items').optional(),
}).strict();

export const messageSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    email: z.string().email("Invalid email address"),
    message: z.string().min(1, "Message is required")
}).strict();

// ==============================================
// ID VALIDATION
// ==============================================

export const uuidSchema = z.string().uuid('Invalid ID format');

// ==============================================
// REVIEW SCHEMAS
// ==============================================

export const createReviewSchema = z.object({
    name: safeString(100),
    role: safeString(100),
    text: safeString(500), // Longer text allowed for reviews
    rating: z.number().int().min(1).max(5),
}).strict();

export const updateReviewSchema = createReviewSchema.partial().strict();

// ==============================================
// TYPE EXPORTS
// ==============================================

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>;
export type UpdateSocialInput = z.infer<typeof updateSocialSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
