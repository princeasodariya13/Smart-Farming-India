import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const filesToUpdate = [];
walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx')) {
    filesToUpdate.push(filePath);
  }
});

filesToUpdate.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('<aside') && content.includes('translate-x-full') && content.includes('md:hidden text-on-surface hover:bg-surface-container-high')) {
    console.log(`Updating ${file}...`);
    
    // Find the bounds of the aside block
    const asideStart = content.indexOf('<aside');
    const asideEnd = content.indexOf('</aside>') + 8;
    
    if (asideStart === -1 || asideEnd === -1) return;
    
    // Extract everything else
    const beforeAside = content.substring(0, asideStart);
    const afterAside = content.substring(asideEnd);
    
    // Check if Sidebar is already imported
    let newContent = beforeAside + '<Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />' + afterAside;
    
    if (!newContent.includes('import { Sidebar }')) {
      // Find the last import
      const lastImportIndex = newContent.lastIndexOf('import ');
      const endOfLastImport = newContent.indexOf('\n', lastImportIndex);
      
      if (endOfLastImport !== -1) {
        newContent = newContent.substring(0, endOfLastImport) + '\nimport { Sidebar } from "@/components/layout/Sidebar";' + newContent.substring(endOfLastImport);
      }
    }
    
    fs.writeFileSync(file, newContent, 'utf8');
  }
});
