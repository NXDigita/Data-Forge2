const fs = require('fs');
let lines = fs.readFileSync('pages/SimulationLab.tsx', 'utf8').split('\n');

// Remove the orphaned span on line 322 (index 321)
lines.splice(321, 1);

fs.writeFileSync('pages/SimulationLab.tsx', lines.join('\n'));

// Verify
for(let i=317; i<=325; i++) console.log((i+1)+':', lines[i]);
console.log('Done!');
