const fs = require('fs');
let lines = fs.readFileSync('pages/SimulationLab.tsx', 'utf8').split('\n');

console.log('Line 294:', lines[293]);
console.log('Line 295:', lines[294]);
