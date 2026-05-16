const fs = require('fs');
let lines = fs.readFileSync('pages/SimulationLab.tsx', 'utf8').split('\n');

// Line 319 has `))}` - needs to be `})`  
lines[318] = lines[318].replace('))}"', '        )}');
lines[318] = lines[318].replace('))}', '        )}');

// Show result
console.log('319:', JSON.stringify(lines[318]));
console.log('321:', JSON.stringify(lines[320]));
console.log('323:', JSON.stringify(lines[322]));

fs.writeFileSync('pages/SimulationLab.tsx', lines.join('\n'));
console.log('✅ Fixed!');
