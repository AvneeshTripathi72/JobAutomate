/**
 * Entry point for Hostinger shared hosting (Phusion Passenger).
 * Passenger loads this file to start the Node.js application.
 *
 * This file:
 * 1. Loads environment variables from .env (Passenger doesn't do this)
 * 2. Starts the compiled server bundle from dist/index.js
 *
 * Make sure to run `npm run build` locally before deploying!
 */

const fs = require('fs');
const nodePath = require('path');

// Load .env file if it exists (Hostinger Passenger doesn't auto-load .env)
const envPath = nodePath.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const eqIndex = line.indexOf('=');
      if (eqIndex > 0) {
        const key = line.substring(0, eqIndex).trim();
        const value = line.substring(eqIndex + 1).trim();
        // Don't overwrite existing env vars (hosting panel takes priority)
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  });
}

// Start the server
require('./dist/index.js');
