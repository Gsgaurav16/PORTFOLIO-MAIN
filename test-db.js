
import pg from 'pg';
const { Pool } = pg;

const password = encodeURIComponent("Gsg@ur@v1600");
const project = "hzbmweyhzfdsmojfcxol";
const region0 = "aws-0-ap-south-1.pooler.supabase.com";
const region1 = "aws-1-ap-south-1.pooler.supabase.com";

const configs = [
    {
        name: "DIRECT-DB (Reference)",
        url: `postgresql://postgres:${password}@db.${project}.supabase.co:5432/postgres`
    },
    {
        name: "POOLER-0 (6543)",
        url: `postgresql://postgres.${project}:${password}@${region0}:6543/postgres`
    },
    {
        name: "POOLER-1 (6543)",
        url: `postgresql://postgres.${project}:${password}@${region1}:6543/postgres`
    },
    {
        name: "POOLER-0-NO-REF (6543)",
        url: `postgresql://postgres:${password}@${region0}:6543/postgres`
    },
    {
        name: "POOLER-1-NO-REF (6543)",
        url: `postgresql://postgres:${password}@${region1}:6543/postgres`
    }
];

async function test(config) {
    console.log(`Testing ${config.name}...`);
    console.log(`URL: ${config.url.replace(password, '****')}`);
    const pool = new Pool({
        connectionString: config.url,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
    });

    try {
        const client = await pool.connect();
        console.log(`✅ ${config.name} SUCCESS`);
        client.release();
    } catch (err) {
        console.log(`❌ ${config.name} FAILED: ${err.message}`);
    } finally {
        await pool.end();
    }
}

async function run() {
    for (const config of configs) {
        await test(config);
    }
}

run();
