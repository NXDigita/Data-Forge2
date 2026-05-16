const fs = require('fs');
let lines = fs.readFileSync('pages/SimulationLab.tsx', 'utf8').split('\n');

// Fix line 321 - remove extra ))
lines[320] = lines[320].replace(')))}', ')}');

// Fix line 323 - remove extra ))
lines[322] = lines[322].replace(')))}', ')}');

fs.writeFileSync('pages/SimulationLab.tsx', lines.join('\n'));
console.log('✅ SimulationLab.tsx fixed!');
