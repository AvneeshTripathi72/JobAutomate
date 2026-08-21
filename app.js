/**
 * This file is an entry point for hosting providers like Hostinger 
 * that default to looking for an `app.js` or `server.js` in the root directory.
 * 
 * It simply imports the compiled backend server from the dist folder.
 * Make sure to run `npm run build` before deploying!
 */

import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Load environment variables from a .env file sitting next to this file,
// regardless of the working directory the host process starts us from.
// Some hosting providers (e.g. Hostinger's manual-upload Node.js apps) do
// not reliably inject panel-configured environment variables into the
// running process, so we load them from disk ourselves as a fallback.
//
// IMPORTANT: this must use a dynamic import() below (not a static import
// statement) for './dist/index.js' — static imports are hoisted and
// evaluated before any top-level code in this file runs, which would load
// dist/index.js (and read process.env) before loadEnvFile ever executes.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
try {
  process.loadEnvFile(path.join(__dirname, '.env'));
} catch (err) {
  // No .env file present — assume the platform already injected the
  // required environment variables directly.
}

await import('./dist/index.js');
