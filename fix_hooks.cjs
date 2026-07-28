const fs = require('fs');

let content = fs.readFileSync('src/app/weather/page.tsx', 'utf8');

// Replace all \r\n with \n to make matching safe
content = content.replace(/\r\n/g, '\n');

const earlyReturn = '  if (status === "loading") {\n    return <PageLoader />;\n  }\n';
const targetStart = '  return (\n    <div className="flex h-screen overflow-hidden text-on-surface bg-background-sage font-sans">';

if (content.includes(earlyReturn)) {
  content = content.replace(earlyReturn, '');
  content = content.replace(targetStart, '  if (status === "loading") {\n    return <PageLoader />;\n  }\n\n' + targetStart);
  fs.writeFileSync('src/app/weather/page.tsx', content);
  console.log('Hooks fixed successfully!');
} else {
  console.log('Early return not found!');
}
