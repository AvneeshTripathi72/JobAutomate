/**
 * scripts/create-admin.ts
 *
 * One-time script to create the first admin user.
 * Registration is disabled in the app, so this is the only way
 * to create an account.
 *
 * Usage:
 *   1. Make sure DATABASE_URL is set in your environment (or .env file).
 *   2. Run: npx tsx scripts/create-admin.ts
 *
 * You will be prompted for a username and password interactively.
 * Or pass them via args:
 *   USERNAME=admin PASSWORD=secret123 npx tsx scripts/create-admin.ts
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users } from "../shared/schema.js";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import * as readline from "readline";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function prompt(question: string, hidden = false): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: hidden ? undefined : process.stdout,
    terminal: hidden,
  });

  return new Promise((resolve) => {
    if (hidden) {
      process.stdout.write(question);
      process.stdin.setRawMode(true);
      let input = "";
      process.stdin.on("data", (char) => {
        char = char.toString();
        if (char === "\r" || char === "\n") {
          process.stdin.setRawMode(false);
          process.stdout.write("\n");
          rl.close();
          resolve(input);
        } else if (char === "\u0003") {
          process.exit();
        } else if (char === "\u007f") {
          input = input.slice(0, -1);
        } else {
          input += char;
        }
      });
    } else {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    }
  });
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error(
      "\n❌  DATABASE_URL is not set.\n" +
      "    Set it before running this script:\n" +
      "    DATABASE_URL=\"postgresql://...\" npx tsx scripts/create-admin.ts\n"
    );
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log("\n🔐  Tilcons — Create Admin Account\n");

  // Accept from env vars (useful for CI/automated setup) or prompt interactively
  const username =
    process.env.USERNAME ||
    (await prompt("  Admin username: "));

  const password =
    process.env.PASSWORD ||
    (await prompt("  Password (hidden): ", true));

  if (!username || !password) {
    console.error("❌  Username and password are required.");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌  Password must be at least 8 characters.");
    process.exit(1);
  }

  // Check if user already exists
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (existing.length > 0) {
    console.error(`\n❌  A user named "${username}" already exists.\n`);
    await pool.end();
    process.exit(1);
  }

  const hashed = await hashPassword(password);
  await db.insert(users).values({ username, password: hashed });

  console.log(`\n✅  Admin account created successfully!`);
  console.log(`    Username: ${username}`);
  console.log(`    Login at: /signin\n`);

  await pool.end();
}

main().catch((err) => {
  console.error("\n❌  Error:", err.message);
  process.exit(1);
});
