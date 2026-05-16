const fs = require('fs');
let lines = fs.readFileSync('pages/SimulationLab.tsx', 'utf8').split('\n');

lines[320] = lines[320].replace('))}"', ')"').replace('))}', ')}');
lines[322] = lines[322].replace('))}"', ')"').replace('))}', ')}');

// Show result
console.log('Line 321:', lines[320]);
console.log('Line 323:', lines[322]);

fs.writeFileSync('pages/SimulationLab.tsx', lines.join('\n'));
console.log('✅ Fixed!');
