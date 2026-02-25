const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// Add base tag if not present
if (!html.includes('<base href=')) {
  html = html.replace(
    '<head>',
    '<head><base href="/construction-field-app/">'
  );
}

// Also fix script src to be relative
html = html.replace(/src="\/_expo/g, 'src="/_expo');

fs.writeFileSync(indexPath, html);
console.log('✓ Fixed index.html for GitHub Pages');
