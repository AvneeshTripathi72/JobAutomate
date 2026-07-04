/**
 * scripts/migrate-multitenant.ts
 *
 * Applies the multi-tenant schema migration directly via SQL.
 * Safe to run multiple times (uses IF NOT EXISTS / IF EXISTS).
 *
 * Usage:
 *   npx tsx --env-file=.env scripts/migrate-multitenant.ts
 */

import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    console.log("🔄  Applying multi-tenant migration…\n");

    await client.query("BEGIN");

    // 1. Create companies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id         VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name       TEXT    NOT NULL,
        domain     TEXT,
        plan       TEXT    NOT NULL DEFAULT 'starter',
        is_active  BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    console.log("  ✅  companies table ready");

    // 2. Add new columns to users (all idempotent)
    const userCols = [
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS role       TEXT    NOT NULL DEFAULT 'recruiter'`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS company_id VARCHAR`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS email      TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name  TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active  BOOLEAN NOT NULL DEFAULT true`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT now()`,
    ];
    for (const sql of userCols) {
      await client.query(sql);
    }
    console.log("  ✅  users table extended");

    // 3. Migrate the existing admin user → super_admin
    await client.query(`
      UPDATE users SET role = 'super_admin'
      WHERE role = 'recruiter' AND company_id IS NULL
    `);
    console.log("  ✅  Existing users migrated to super_admin");

    await client.query("COMMIT");
    console.log("\n✅  Migration complete!\n");
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("\n❌  Migration failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
