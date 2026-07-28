const fs = require('fs');
const pages = [
  'src/app/schemes/page.tsx',
  'src/app/dashboard/page.tsx',
  'src/app/gps-area-calculator/page.tsx',
  'src/app/weather/page.tsx',
  'src/app/disease-detection/page.tsx',
  'src/app/support/page.tsx',
  'src/app/settings/page.tsx',
  'src/app/profile/page.tsx',
  'src/app/docs/page.tsx'
];
pages.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const loadingIdx = content.indexOf('if (status === "loading")');
    if (loadingIdx !== -1) {
      const rest = content.slice(loadingIdx);
      if (rest.includes('useState(') || rest.includes('useEffect(')) {
        console.log('VIOLATION IN:', file);
      }
    }
  }
});
