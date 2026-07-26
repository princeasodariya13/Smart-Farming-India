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

  // Regex to match the sidebar Link blocks for /schemes and /community
  // It looks for <Link ... href="/schemes"> ... </Link>
  // and <Link ... href="/community"> ... </Link>
  // where the content inside contains material-symbols-outlined
  const regexSchemes = /<Link[^>]*href="\/schemes"[^>]*>[\s\S]*?<span[^>]*material-symbols-outlined[\s\S]*?<\/Link>/g;
  const regexCommunity = /<Link[^>]*href="\/community"[^>]*>[\s\S]*?<span[^>]*material-symbols-outlined[\s\S]*?<\/Link>/g;

  content = content.replace(regexSchemes, '');
  content = content.replace(regexCommunity, '');

  // clean up potential empty lines left behind (optional, just cosmetic)
  content = content.replace(/^[ \t]*\n/gm, '\n');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Modified ${file}`);
    modifiedCount++;
  }
}

console.log(`Finished modifying ${modifiedCount} files.`);
