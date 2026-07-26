const fs = require('fs');
const path = require('path');

const srcAppPath = path.join(__dirname, 'src', 'app');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file === 'page.tsx') {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk(srcAppPath);
let modifiedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Find the <aside> tag block.
  const asideStart = content.indexOf('<aside');
  const asideEnd = content.indexOf('</aside>');

  if (asideStart !== -1 && asideEnd !== -1) {
    let asideContent = content.substring(asideStart, asideEnd);

    // Now, inside asideContent, replace the Link blocks for schemes and community
    const regexSchemes = /<Link[^>]*href="\/schemes"[^>]*>[\s\S]*?<\/Link>/g;
    const regexCommunity = /<Link[^>]*href="\/community"[^>]*>[\s\S]*?<\/Link>/g;

    asideContent = asideContent.replace(regexSchemes, '');
    asideContent = asideContent.replace(regexCommunity, '');

    content = content.substring(0, asideStart) + asideContent + content.substring(asideEnd);
  }

  // clean up potential empty lines left behind
  content = content.replace(/^[ \t]*\n/gm, '\n');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Modified ${file}`);
    modifiedCount++;
  }
}

console.log(`Finished safely modifying ${modifiedCount} files.`);
