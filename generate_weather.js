const fs = require('fs');

const dashboardCode = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
const weatherPageCode = fs.readFileSync('src/components/weather/page.tsx', 'utf8');

// Extract imports from weatherPage
const weatherImportsMatch = weatherPageCode.match(/import \{\n([\s\S]*?)\} from "lucide-react";\n([\s\S]*?)export const metadata/);
const weatherImports = weatherImportsMatch[2].replace(/import WeatherLayout.*?\n/, '');

// Extract data from weatherPage
const dataMatch = weatherPageCode.match(/\/\* Placeholder data.*? \*\/\n([\s\S]*?)export default function WeatherPage/);
const weatherData = dataMatch[1];

// Extract JSX from weatherPage
const jsxMatch = weatherPageCode.match(/<WeatherLayout>\n([\s\S]*?)<\/WeatherLayout>/);
const weatherJsx = jsxMatch[1];

// Extract Lucide icons used
const lucideIcons = weatherImportsMatch[1].trim().split(',').map(s => s.trim()).filter(Boolean);

// We need to inject the weather imports and data into the dashboard code
// and replace the <main> block.

let newCode = dashboardCode;

// Rename DashboardContent to WeatherContent, and Dashboard to Weather
newCode = newCode.replace('function DashboardContent() {', 'function WeatherContent() {');
newCode = newCode.replace('export default function Dashboard() {', 'export default function Weather() {');
newCode = newCode.replace('<DashboardContent />', '<WeatherContent />');

// Update active states in Sidebar
newCode = newCode.replace(
  'className="flex items-center gap-2 px-3 py-2.5 bg-secondary-container text-on-secondary-container rounded-lg transition-all" href="/dashboard"',
  'className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/dashboard"'
);

// We will use a regex to replace the Weather link with the active state
newCode = newCode.replace(
  /className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="#"\s*>\s*<span className="material-symbols-outlined text-\[18px\]">early_on<\/span>\s*<span className="text-\[12px\] font-medium">Weather<\/span>/,
  'className="flex items-center gap-2 px-3 py-2.5 bg-secondary-container text-on-secondary-container rounded-lg transition-all" href="/weather"\n          >\n            <span className="material-symbols-outlined text-[18px]">early_on</span>\n            <span className="text-[12px] font-medium">Weather</span>'
);


// Replace main content
const mainStart = newCode.indexOf('<main data-lenis-prevent="true"');
const footerStart = newCode.indexOf('{/* Footer (Standard Shared) */}');
const mainHeaderAndContent = newCode.substring(mainStart, footerStart);

const newMainContent = `<main data-lenis-prevent="true" className="flex-1 overflow-y-auto custom-scrollbar bg-background-sage p-4 md:p-6 pb-24">
  <div className="max-w-container-max mx-auto space-y-6">
${weatherJsx}
  </div>\n\n          `;

newCode = newCode.replace(mainHeaderAndContent, newMainContent);

// Add imports
const importsToAdd = `import {\n  ${lucideIcons.join(',\n  ')}\n} from "lucide-react";\n${weatherImports}`;

newCode = newCode.replace('import { Leaf } from \'lucide-react\';', 'import { Leaf } from \'lucide-react\';\n' + importsToAdd);

// Add data inside or outside the component
newCode = newCode.replace('function WeatherContent() {', weatherData + '\n\nfunction WeatherContent() {');

fs.writeFileSync('src/app/weather/page.tsx', newCode);
console.log('Done!');
