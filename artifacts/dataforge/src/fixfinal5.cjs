const fs = require('fs');
let lines = fs.readFileSync('pages/SimulationLab.tsx', 'utf8').split('\n');

// Remove extra line 321 (index 320)
lines.splice(320, 1);

fs.writeFileSync('pages/SimulationLab.tsx', lines.join('\n'));

for(let i=315; i<=323; i++) console.log((i+1)+':', lines[i]);
console.log('Done!');
