/**
 * Database Migration Script
 * =========================
 * Creates all required tables for the portfolio
 * Run with: npm run db:migrate
 */
import { pool, query } from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const migrate = async () => {
    console.log('🔧 Starting database migration...\n');

    try {
        // Users table
        await query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Created users table');

        // Projects table
        await query(`
            CREATE TABLE IF NOT EXISTS projects (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title VARCHAR(100) NOT NULL,
                subtitle VARCHAR(255),
                stack TEXT[] DEFAULT '{}',
                features TEXT[] DEFAULT '{}',
                link VARCHAR(255),
                image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Created projects table');

        // Skills table
        await query(`
            CREATE TABLE IF NOT EXISTS skills (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title VARCHAR(100) NOT NULL,
                level VARCHAR(50),
                color VARCHAR(20) DEFAULT '#000000',
                progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
                total_skills INT DEFAULT 0,
                equipment TEXT[] DEFAULT '{}',
                achievements TEXT[] DEFAULT '{}'
            )
        `);
        console.log('✅ Created skills table');

        // Experiences table
        await query(`
            CREATE TABLE IF NOT EXISTS experiences (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                company VARCHAR(100) NOT NULL,
                role VARCHAR(100) NOT NULL,
                period VARCHAR(50),
                description TEXT,
                achievements TEXT[] DEFAULT '{}',
                stack TEXT[] DEFAULT '{}',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Created experiences table');

        // Socials table
        await query(`
            CREATE TABLE IF NOT EXISTS socials (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                platform VARCHAR(50) NOT NULL UNIQUE,
                href VARCHAR(255) NOT NULL,
                label VARCHAR(50) NOT NULL
            )
        `);
        console.log('✅ Created socials table');

        // Profile table (single row)
        await query(`
            CREATE TABLE IF NOT EXISTS profile (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(100) NOT NULL,
                role VARCHAR(100),
                bio TEXT,
                years VARCHAR(10),
                projects_count VARCHAR(10),
                awesomeness VARCHAR(10),
                expertise TEXT[] DEFAULT '{}'
            )
        `);
        console.log('✅ Created profile table');

        // Reviews table
        await query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(100) NOT NULL,
                role VARCHAR(100) NOT NULL,
                text TEXT NOT NULL,
                rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Created reviews table');

        console.log('\n🎉 Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

migrate();
