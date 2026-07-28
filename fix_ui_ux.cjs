const fs = require('fs');

function replaceInFile(filePath, search, replacement) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(search, replacement);
    fs.writeFileSync(filePath, content);
  }
}

// 1. Force Light Mode in Tailwind
let twPath = 'tailwind.config.ts';
if (fs.existsSync(twPath)) {
  let tw = fs.readFileSync(twPath, 'utf8');
  if (!tw.includes('darkMode:')) {
    tw = tw.replace('export default config;', 'config.darkMode = "class";\nexport default config;');
    fs.writeFileSync(twPath, tw);
  }
}

// 2. Notification Dropdown Overlay & Scrolling
replaceInFile('src/components/NotificationBell.tsx',
  /className="absolute right-0 mt-3.*?"/g,
  `className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-96 rounded-2xl bg-surface shadow-2xl border border-outline-variant overflow-hidden z-[100] max-h-[70vh] flex flex-col"`
);

replaceInFile('src/components/NotificationBell.tsx',
  /className="max-h-\[360px\] overflow-y-auto custom-scrollbar"/g,
  `className="flex-1 overflow-y-auto custom-scrollbar min-h-0"`
);

// 3. Ticker Collision (Dashboard & Weather)
replaceInFile('src/app/dashboard/page.tsx', 
  /className="flex-1 overflow-y-auto custom-scrollbar bg-background-sage p-4 lg:p-10"/g,
  `className="flex-1 overflow-y-auto custom-scrollbar bg-background-sage p-4 lg:p-10 pb-20"`
);

replaceInFile('src/app/weather/page.tsx', 
  /className="flex-1 overflow-y-auto custom-scrollbar bg-background-sage p-4 md:p-6 pb-24"/g,
  `className="flex-1 overflow-y-auto custom-scrollbar bg-background-sage p-4 md:p-6 pb-24 lg:pb-24"`
);

// 4. Analytics Data Table Min-Width
replaceInFile('src/app/analytics/page.tsx',
  /<table className="w-full text-left border-collapse">/g,
  `<table className="w-full text-left border-collapse min-w-[800px]">`
);

// 5. GPS Map Crushing
replaceInFile('src/components/gps-calculator/GPSLayout.tsx',
  /className="w-full h-\[280px\] lg:h-full lg:max-h-\[75vh\] max-w-5xl rounded-3xl overflow-hidden shadow-sm border border-outline-variant\/60 relative flex flex-col shrink-0"/g,
  `className="w-full h-[350px] min-h-[350px] lg:h-full lg:min-h-[500px] lg:max-h-[75vh] max-w-5xl rounded-3xl overflow-hidden shadow-sm border border-outline-variant/60 relative flex flex-col shrink-0"`
);

// 6. Weather Metric Cards Height Consistency
replaceInFile('src/components/weather/WeatherMetricCard.tsx',
  /className="flex items-center gap-4 bg-surface-container-low p-5 rounded-2xl border border-outline-variant\/40 hover:shadow-md transition-shadow"/g,
  `className="flex items-center gap-4 bg-surface-container-low p-5 rounded-2xl border border-outline-variant/40 hover:shadow-md transition-shadow h-full"`
);

// 7. Input Fields Focus Rings (Weather Search)
replaceInFile('src/app/weather/page.tsx',
  /className="flex-1 md:w-64 bg-surface text-on-surface border border-outline rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary\/50"/g,
  `className="flex-1 md:w-64 bg-surface text-on-surface border border-outline rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"`
);

console.log('UI/UX Polish Script Applied Successfully!');
