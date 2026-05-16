const fs = require('fs');
let content = fs.readFileSync('pages/SimulationLab.tsx', 'utf8');

content = content.replace(/c\.dataset\.file/g, 'c.dataset?.file');
content = content.replace(/c\.dataset\.rows/g, 'c.dataset?.rows');
content = content.replace(/c\.dataset\.features/g, 'c.dataset?.features');

fs.writeFileSync('pages/SimulationLab.tsx', content);
console.log('✅ dataset fixed!');
