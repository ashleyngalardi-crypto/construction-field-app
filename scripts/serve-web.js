#!/usr/bin/env node
/**
 * Simple HTTP server to serve the built web app locally
 * Usage: node scripts/serve-web.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '../dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'application/font-woff',
  '.woff2': 'application/font-woff2',
  '.ttf': 'application/font-ttf',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(DIST_DIR, decodeURIComponent(url.parse(req.url).pathname));

  // Default to index.html for root
  if (filePath === DIST_DIR || filePath === path.join(DIST_DIR, '/')) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  // For SPA routing, serve index.html for any HTML request that doesn't exist
  if (!fs.existsSync(filePath) && req.url.endsWith('.html')) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File Not Found</h1>', 'utf-8');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║     Construction Field App - Web Server Running          ║
╚════════════════════════════════════════════════════════════╝

✅ Server is running at: http://localhost:${PORT}
📱 Open your browser and navigate to http://localhost:${PORT}

🔍 To stop the server, press Ctrl+C

💡 Tips:
   - The app will run in offline mode (using browser storage)
   - Photo upload uses file input (no camera access on web)
   - All navigation works as expected
   - Open DevTools (F12) to see console logs

🚀 For production deployment, see DESKTOP_SETUP.md
`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Error: Port ${PORT} is already in use`);
    console.error(`   Try: PORT=3001 node scripts/serve-web.js`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
