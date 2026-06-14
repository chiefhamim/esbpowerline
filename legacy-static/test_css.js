const fs = require('fs');
const css = fs.readFileSync('/workspaces/esbpowerline/css/style.css', 'utf8');

// Basic bracket counting
let openBrackets = 0;
let lineNum = 1;
for (let i=0; i<css.length; i++) {
    if (css[i] === '\n') lineNum++;
    if (css[i] === '{') openBrackets++;
    if (css[i] === '}') openBrackets--;
    if (openBrackets < 0) {
        console.error('Too many closing brackets at line ' + lineNum);
        process.exit(1);
    }
}
if (openBrackets > 0) {
    console.error('Missing closing brackets: ' + openBrackets);
    process.exit(1);
}
console.log('Brackets are balanced.');
