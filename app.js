/**
 * This file is an entry point for hosting providers like Hostinger 
 * that default to looking for an `app.js` or `server.js` in the root directory.
 * 
 * It simply imports the compiled backend server from the dist folder.
 * Make sure to run `npm run build` before deploying!
 */

import './dist/index.js';
