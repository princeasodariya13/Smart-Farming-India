const fs = require('fs');
const path = require('path');

const dirs = [
  'analytics', 'community', 'consult', 'dashboard', 'disease-detection',
  'gps-area-calculator', 'market', 'profile', 'schemes', 'settings',
  'support', 'weather'
];

dirs.forEach(dir => {
  const filePath = path.join(__dirname, 'src', 'app', '(dashboard)', dir, 'page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove getInitials
    content = content.replace(/const getInitials = \([\s\S]*?};\n?/g, '');
    
    // Remove mobileMenuOpen
    content = content.replace(/const \[mobileMenuOpen, setMobileMenuOpen\] = useState\(false\);\n?/g, '');

    // Replace outer shell
    const mainMatch = content.match(/<main[^>]*>/);
    if (mainMatch) {
      const returnIndex = content.lastIndexOf('return (', mainMatch.index);
      if (returnIndex !== -1) {
        const replacement = 'return (\n    <>\n';
        content = content.substring(0, returnIndex) + replacement + content.substring(mainMatch.index);
      }
    }

    // Replace footer and closing tags
    // Usually it ends with </main> ... </div> ... {/* Live Market Ticker */} ... </div> ); }
    // Let's just find </main> and anything after it up to the end of the file.
    const endMainIndex = content.lastIndexOf('</main>');
    if (endMainIndex !== -1) {
      const remainingContent = content.substring(endMainIndex);
      // Keep ticker if exists
      const tickerMatch = remainingContent.match(/\{\/\* Live Market Ticker \*\/\}[\s\S]*?<\/div>\s*<\/div>/);
      let newTail = '</main>\n';
      if (tickerMatch) {
        newTail += tickerMatch[0] + '\n';
      }
      newTail += '    </>\n  );\n}\n';
      content = content.substring(0, endMainIndex) + newTail;
    }

    // Replace export default function X() { return <SessionProvider> ... </SessionProvider> }
    content = content.replace(/export default function \w+\(\) {\s*return \(\s*<SessionProvider>[\s\S]*?<\/SessionProvider>\s*\);\s*}\s*$/g, '');
    
    // Rename XContent to export default function Page
    content = content.replace(/function \w+Content\(/g, 'export default function Page(');

    fs.writeFileSync(filePath, content);
    console.log('Processed', filePath);
  }
});
