const fs = require('fs');

const pages = [
  'src/app/gps-area-calculator/page.tsx',
  'src/app/weather/page.tsx',
  'src/app/disease-detection/page.tsx',
  'src/app/settings/page.tsx',
  'src/app/profile/page.tsx'
];

const blockToRemove = `
  if (status === "loading") {
    return <PageLoader />;
  }
`;

const blockToAdd = `
  if (status === "loading") {
    return <PageLoader />;
  }
`;

pages.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // First remove it exactly
    if (content.includes('if (status === "loading") {\n    return <PageLoader />;\n  }')) {
      content = content.replace('if (status === "loading") {\n    return <PageLoader />;\n  }\n', '');
      content = content.replace('if (status === "loading") {\n    return <PageLoader />;\n  }', ''); // fallback
      
      // Then inject it before `return (`
      const returnIndex = content.lastIndexOf('return (');
      if (returnIndex !== -1) {
        content = content.slice(0, returnIndex) + blockToAdd + '\n  ' + content.slice(returnIndex);
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed', file);
      }
    }
  }
});
