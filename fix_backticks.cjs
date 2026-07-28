const fs = require('fs');
const files = [
  'src/app/analytics/page.tsx',
  'src/app/market/page.tsx',
  'src/app/dashboard/page.tsx'
];
files.forEach(file => {
  if (fs.existsSync(file)) {
    let text = fs.readFileSync(file, 'utf8');
    text = text.replace(/className=\{\\\`/g, 'className={`');
    text = text.replace(/\\\`\}/g, '`}');
    fs.writeFileSync(file, text);
    console.log('Fixed', file);
  }
});
