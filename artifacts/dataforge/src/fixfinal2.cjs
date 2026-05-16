const fs = require('fs');
let lines = fs.readFileSync('pages/SimulationLab.tsx', 'utf8').split('\n');

lines[318] = '                        ))}';
lines[320] = '                    )}';
lines[322] = '                ))}';

fs.writeFileSync('pages/SimulationLab.tsx', lines.join('\n'));

for(let i=316; i<=325; i++) console.log((i+1)+':', JSON.stringify(lines[i]));
console.log('Done!');
