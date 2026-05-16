const fs = require('fs');
let lines = fs.readFileSync('pages/SimulationLab.tsx', 'utf8').split('\n');

// Line 319 (index 318) - fix )}" to ))}
lines[318] = '                        ))}';

// Line 321 (index 320) - fix )} to ))}  
lines[320] = '                    ))}';

// Line 323 (index 322) - fix )} to ))}
lines[322] = '                ))}';

console.log('318:', JSON.stringify(lines[317]));
console.log('319:', JSON.stringify(lines[318]));
console.log('320:', JSON.stringify(lines[319]));
console.log('321:', JSON.stringify(lines[320]));
console.log('322:', JSON.stringify(lines[321]));
console.log('323:', JSON.stringify(lines[322]));

fs.writeFileSync('pages/SimulationLab.tsx', lines.join('\n'));
console.log('✅ Fixed!');
