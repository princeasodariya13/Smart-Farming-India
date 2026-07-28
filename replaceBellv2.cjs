const fs = require('fs');

const pages = [
  'src/app/dashboard/page.tsx',
  'src/app/gps-area-calculator/page.tsx',
  'src/app/weather/page.tsx',
  'src/app/disease-detection/page.tsx',
  'src/app/schemes/page.tsx',
  'src/app/profile/page.tsx',
  'src/app/settings/page.tsx'
];

pages.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Make sure import exists
    if (!content.includes('import NotificationBell')) {
      content = content.replace(/(import .*;\n)+/, (match) => match + 'import NotificationBell from \'@/components/NotificationBell\';\n');
    }

    // Replace the button block
    const regex1 = /<button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors relative">\s*<span className="material-symbols-outlined text-\[18px\]">notifications<\/span>\s*<span className="absolute top-1\.5 right-1\.5 w-1\.5 h-1\.5 bg-error rounded-full"[^>]*>\s*<\/span>\s*<\/button>/g;
    const regex2 = /<button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors relative">\s*<span className="material-symbols-outlined text-\[18px\]">notifications<\/span>\s*<span className="absolute top-1\.5 right-1\.5 w-1\.5 h-1\.5 bg-error rounded-full" \/>\s*<\/button>/g;
    const regex3 = /<button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors relative">\s*<span className="material-symbols-outlined text-\[18px\]">notifications<\/span>\s*<\/button>/g;

    let modified = false;
    if (regex1.test(content) || regex2.test(content) || regex3.test(content)) {
      content = content.replace(regex1, '<NotificationBell />');
      content = content.replace(regex2, '<NotificationBell />');
      content = content.replace(regex3, '<NotificationBell />');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log('Replaced bell in:', file);
    } else {
      console.log('No bell found in:', file);
    }
  }
});
