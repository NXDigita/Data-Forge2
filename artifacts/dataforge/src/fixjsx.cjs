const fs = require('fs');
let content = fs.readFileSync('pages/SimulationLab.tsx', 'utf8');
const lines = content.split('\n');
console.log('Lines 318-325:');
for(let i=317; i<=325; i++) {
  console.log((i+1)+'| '+lines[i]);
}
