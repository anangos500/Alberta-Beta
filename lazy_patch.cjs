const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const componentsToLazyLoad = [
  'Hero',
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

componentsToLazyLoad.forEach(comp => {
  // Remove original import
  const regex = new RegExp(`import \\{ ${comp} \\} from '\\.\\/components\\/(public|portal)\\/${comp}';\\n?`);
  const match = code.match(regex);
  if (match) {
    code = code.replace(regex, '');
    // Add lazy import below React import or near the top
    code = code.replace(
      /import React from 'react';/,
      `import React, { Suspense } from 'react';\nconst ${comp} = React.lazy(() => import('./components/${match[1]}/${comp}').then(m => ({ default: m.${comp} })));`
    );
  }
});

// Wrap routes in Suspense if not already
if (!code.includes('<Suspense')) {
  // Find <Routes> and wrap its children inside <Suspense> inside PublicLayout maybe?
  // Actually, wait, the <Suspense> can just wrap <Routes> inside MainAppContent
  code = code.replace(
    /<Routes>/,
    `<Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>}>\n      <Routes>`
  );
  code = code.replace(
    /<\/Routes>/,
    `</Routes>\n      </Suspense>`
  );
  
  // also handle the Suspense inside the Portal layout specifically? 
  // Wait, if it wraps <Routes>, it will show the loading spinner for the whole page when switching routes.
  // Alternatively, we can put it around {children} in PublicLayout and around the dashboard components in PortalLayout.
}

fs.writeFileSync('src/App.tsx', code);
