const fs = require('fs');
const path = require('path');
const skip = new Set(['node_modules', '.git', '.expo', 'dist', '@react-native', 'debugger-frontend', '@babel', 'metro-config', 'jest', 'typescript']);

function search(dir, depth) {
  if (depth > 6) return;
  let items;
  try { items = fs.readdirSync(dir); } catch(e) { return; }
  for (const item of items) {
    if (skip.has(item) || item.startsWith('.')) continue;
    const full = path.join(dir, item);
    try {
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        search(full, depth + 1);
      } else if (/\.(m?js|cjs)$/.test(item)) {
        const c = fs.readFileSync(full, 'utf8');
        if (c.includes('import.meta')) {
          console.log(full);
        }
      }
    } catch(e) {}
  }
}
search('node_modules', 0);
