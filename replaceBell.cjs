const fs = require('fs');
const pages = [
  'src/app/dashboard/page.tsx',
  'src/app/gps-area-calculator/page.tsx',
  'src/app/weather/page.tsx',
  'src/app/disease-detection/page.tsx',
  'src/app/schemes/page.tsx',
  'src/app/community/page.tsx',
  'src/app/settings/page.tsx',
  'src/app/profile/page.tsx',
  'src/app/docs/page.tsx'
];
pages.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add import if missing
    if (!content.includes('NotificationBell')) {
      content = content.replace(/(import .*;\n)+/, (match) => match + 'import NotificationBell from \'@/components/NotificationBell\';\n');
    }
    
    const bellStr1 = `<button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors relative">
              <span className="material-symbols-outlined text-[18px]">notifications</span>
            </button>`;
    
    const bellStr2 = `<button className="relative p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </button>`;

    content = content.replace(bellStr1, '<NotificationBell />');
    content = content.replace(bellStr2, '<NotificationBell />');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
