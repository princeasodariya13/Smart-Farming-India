const fs = require('fs');
const path = require('path');

const dirs = ['schemes', 'community', 'blog', 'compliance'];
const baseDir = path.join(process.cwd(), 'src', 'app');

const template = (title) => `import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function ${title.replace(/ /g, '')}Page() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <h1 className="mb-8 text-4xl font-extrabold text-slate-900">${title}</h1>
        <p className="text-lg text-slate-600">This page is currently under construction. Check back soon for detailed ${title.toLowerCase()} updates!</p>
      </main>
      <Footer />
    </div>
  );
}
`;

dirs.forEach(dir => {
  const dirPath = path.join(baseDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const title = dir.charAt(0).toUpperCase() + dir.slice(1);
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), template(title));
});
