/**
 * Database Seed Script
 * ====================
 * Populates the database with initial data
 * Run with: npm run db:seed
 */
import { pool, query } from '../config/db.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
    console.log('🌱 Starting database seeding...\n');

    try {
        // Create admin user
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const passwordHash = await bcrypt.hash(adminPassword, 12);

        await query(`
            INSERT INTO users (username, password_hash)
            VALUES ($1, $2)
            ON CONFLICT (username) DO UPDATE SET password_hash = $2
        `, [adminUsername, passwordHash]);
        console.log(`✅ Created admin user: ${adminUsername}`);

        // Seed projects
        const projects = [
            {
                title: 'PROJECT ONE',
                subtitle: 'Epic game-inspired landing page with GSAP animations.',
                stack: ['React', 'GSAP', 'Tailwind'],
                features: ['Hero intro with timeline-based scene reveal.', 'Magnetic cursor + hover sfx synced to UI.', 'Optimized 60fps scroll-driven sections.'],
                image: 'bg-gradient-to-br from-gray-900 to-black',
            },
            {
                title: 'NEON COMMERCE',
                subtitle: 'Full-stack shop with custom cart logic and payments.',
                stack: ['Next.js', 'Stripe', 'Prisma'],
                features: ['Real-time inventory management.', 'Server-side rendering for SEO.', 'Custom checkout flow integration.'],
                image: 'bg-gradient-to-br from-purple-900 to-blue-900',
            },
            {
                title: 'AI CHAT BOT',
                subtitle: 'Context-aware customer support bot.',
                stack: ['Python', 'OpenAI', 'FastAPI'],
                features: ['Vector database memory integration.', 'Natural language processing pipeline.', 'Low-latency websocket responses.'],
                image: 'bg-gradient-to-br from-green-900 to-emerald-900',
            },
        ];

        for (const p of projects) {
            await query(`
                INSERT INTO projects (title, subtitle, stack, features, image)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT DO NOTHING
            `, [p.title, p.subtitle, p.stack, p.features, p.image]);
        }
        console.log('✅ Seeded projects');

        // Seed skills
        const skills = [
            { title: 'FOUNDATIONS', level: 'Level 1 / 4', color: '#fbbf24', progress: 90, total_skills: 6, equipment: ['HTML', 'CSS', 'JAVASCRIPT', 'TYPESCRIPT', 'A11Y', 'TESTING'], achievements: ['Semantic HTML with ARIA patterns.', 'CSS architecture with utility layering.', 'Typed pipelines with strict lint gates.'] },
            { title: 'FRONTEND', level: 'Level 2 / 4', color: '#2DD4BF', progress: 85, total_skills: 6, equipment: ['REACT', 'NEXT.JS', 'TAILWIND', 'FRAMER MOTION', 'ZUSTAND', 'TANSTACK QUERY'], achievements: ['State management architecture.', 'Performance optimization.', 'Component library design.'] },
            { title: 'MOTION & SCROLL', level: 'Level 3 / 4', color: '#F43F5E', progress: 75, total_skills: 5, equipment: ['GSAP', 'FRAMER', 'THREE.JS', 'CANVAS', 'SVG ANIMATION'], achievements: ['Scroll-triggered storytelling.', 'Micro-interactions.', '3D scene composition.'] },
            { title: 'BUILD & BACKEND', level: 'Level 4 / 4', color: '#3B82F6', progress: 80, total_skills: 6, equipment: ['NODE.JS', 'POSTGRES', 'GRAPHQL', 'DOCKER', 'AWS', 'FIREBASE'], achievements: ['API schema design.', 'Database performance tuning.', 'CI/CD pipeline automation.'] },
        ];

        for (const s of skills) {
            await query(`
                INSERT INTO skills (title, level, color, progress, total_skills, equipment, achievements)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT DO NOTHING
            `, [s.title, s.level, s.color, s.progress, s.total_skills, s.equipment, s.achievements]);
        }
        console.log('✅ Seeded skills');

        // Seed experiences
        const experiences = [
            { company: 'NEOARCADE LABS', role: 'SENIOR FRONTEND ENGINEER', period: '2023 — Present • Remote', description: 'Motion-first rebuild (GSAP/Framer) to 60fps across Flows.', achievements: ['Reduced drop-off by 18%.', 'Improved LCP 2.8s → 1.7s.'], stack: ['React', 'GSAP', 'Next.js'] },
            { company: 'CODEARRAYS', role: 'UI ENGINEER', period: '2021 — 2023 • Hybrid', description: 'Built core component library used across 5 products.', achievements: ['Migrated to React 18.', 'Mentored 3 junior devs.'], stack: ['React', 'TypeScript', 'Storybook'] },
        ];

        for (const e of experiences) {
            await query(`
                INSERT INTO experiences (company, role, period, description, achievements, stack)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT DO NOTHING
            `, [e.company, e.role, e.period, e.description, e.achievements, e.stack]);
        }
        console.log('✅ Seeded experiences');

        // Seed socials
        const socials = [
            { platform: 'github', href: '#', label: 'GitHub' },
            { platform: 'linkedin', href: '#', label: 'LinkedIn' },
            { platform: 'twitter', href: '#', label: 'Twitter' },
            { platform: 'email', href: 'mailto:contactgauravb@gmail.com', label: 'Email' },
            { platform: 'discord', href: 'https://discord.com/users/gaurav', label: 'Discord' },
        ];

        for (const s of socials) {
            await query(`
                INSERT INTO socials (platform, href, label)
                VALUES ($1, $2, $3)
                ON CONFLICT (platform) DO UPDATE SET href = $2, label = $3
            `, [s.platform, s.href, s.label]);
        }
        console.log('✅ Seeded socials');

        // Seed profile
        await query(`
            INSERT INTO profile (name, role, bio, years, projects_count, awesomeness, expertise)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT DO NOTHING
        `, ['Gaurav', 'Dev & Creator', 'Building clean UI, scalable backends, and creative tech.', '5+', '42', '100%', ['Frontend', 'Backend', 'UI/UX']]);
        console.log('✅ Seeded profile');

        // Seed reviews
        const reviews = [
            {
                name: 'Sarah Connor',
                role: 'CTO @ Skynet',
                text: 'Gaurav delivers critical updates with zero downtime. His code architecture is future-proof and incredibly robust.',
                rating: 5,
            },
            {
                name: 'John Stark',
                role: 'Product Lead @ Winterfell',
                text: 'The UI/UX design feels intuitive yet powerful. Working with Gaurav was like unlocking a cheat code for our frontend.',
                rating: 5,
            },
            {
                name: 'Ellen Ripley',
                role: 'Engineer @ Nostromo',
                text: 'Exceptional problem solver. He navigated complex backend integrations with ease. Highly recommended for any mission.',
                rating: 5,
            },
        ];

        for (const r of reviews) {
            await query(`
                INSERT INTO reviews (name, role, text, rating)
                VALUES ($1, $2, $3, $4)
            `, [r.name, r.role, r.text, r.rating]);
        }
        console.log('✅ Seeded reviews');

        console.log('\n🎉 Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

seed();
