/**
 * This file is an entry point for hosting providers like Hostinger 
 * that default to looking for an `app.js` or `server.js` in the root
 * directory, and load it via CommonJS require() rather than running it
 * directly with `node app.js`.
 * 
 * This file is intentionally plain CommonJS (no `import`/top-level
 * `await`) because require()-based loaders cannot load an ES module
 * that uses top-level await (Node throws ERR_REQUIRE_ASYNC_MODULE).
 * 
 * It simply imports the compiled backend server from the dist folder.
 * Make sure to run `npm run build` before deploying!
 */

// Load environment variables from a .env file sitting next to this file,
// regardless of the working directory the host process starts us from.
// Some hosting providers (e.g. Hostinger's manual-upload Node.js apps) do
// not reliably inject panel-configured environment variables into the
// running process, so we load them from disk ourselves as a fallback.
try {
  process.loadEnvFile(require('path').join(__dirname, '.env'));
} catch (err) {
  // No .env file present — assume the platform already injected the
  // required environment variables directly.
}

require('./dist/index.js');
