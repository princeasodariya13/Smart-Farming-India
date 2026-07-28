const fs = require('fs');

const pages = [
  'src/app/dashboard/page.tsx',
  'src/app/gps-area-calculator/page.tsx',
  'src/app/weather/page.tsx',
  'src/app/disease-detection/page.tsx',
  'src/app/schemes/page.tsx',
  'src/app/community/page.tsx',
  'src/app/profile/page.tsx',
  'src/app/settings/page.tsx',
  'src/app/support/page.tsx',
  'src/app/consult/page.tsx',
  'src/app/docs/page.tsx'
];

pages.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace sidebar link
    const searchStr = `<span className="material-symbols-outlined text-[18px]">insights</span>
            <span className="text-[12px] font-medium">Analytics</span>`;
    
    if (content.includes(searchStr)) {
      // Find the Link wrapper. Usually: <Link className="..." href="#">
      content = content.replace(/href="#"(\s*>\s*<span className="material-symbols-outlined text-\[18px\]">insights<\/span>)/g, 'href="/analytics"$1');
    }

    // Specifically for dashboard view history
    if (file.includes('dashboard/page.tsx')) {
      content = content.replace(/<Link className="text-primary text-\[12px\] font-bold hover:underline" href="#">View History<\/Link>/g, '<Link className="text-primary text-[12px] font-bold hover:underline" href="/analytics">View History</Link>');
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed links in:', file);
  }
});
