const fs = require('fs');
let lines = fs.readFileSync('pages/SimulationLab.tsx', 'utf8').split('\n');

// Line 319 - closes map((m) => ( ... )) then closes {
lines[318] = '                        ))}';

// Line 321 - closes the div wrapper  
lines[320] = '                    )}';

// Line 323 - closes second span map
lines[322] = '                ))}';

fs.writeFileSync('pages/SimulationLab.tsx', lines.join('\n'));

// Verify
for(let i=316; i<=324; i++) console.log((i+1)+':', lines[i]);
console.log('Done!');
