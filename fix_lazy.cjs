const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const componentsToLazyLoad = [
  'FeaturesSection',
  'AboutSection',
  'ProgramsSection',
  'TentorsSection',
  'TestimonialSection',
  'FaqSection',
  'ContactSection',
  'AdminDashboard',
  'TentorDashboard',
  'OrangTuaDashboard'
];

let imports = '';
componentsToLazyLoad.forEach(comp => {
  const isPortal = comp.includes('Dashboard');
  const pathStr = isPortal ? 'portal' : 'public';
  imports += `const ${comp} = React.lazy(() => import('./components/${pathStr}/${comp}').then(m => ({ default: m.${comp} })));\n`;
});

code = code.replace(
  /const Hero = React\.lazy\(\(\) => import\('\.\/components\/public\/Hero'\)\.then\(m => \(\{ default: m\.Hero \}\)\)\);/,
  `const Hero = React.lazy(() => import('./components/public/Hero').then(m => ({ default: m.Hero })));\n${imports}`
);

fs.writeFileSync('src/App.tsx', code);
