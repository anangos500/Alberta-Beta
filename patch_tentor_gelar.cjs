const fs = require('fs');
let code = fs.readFileSync('src/components/portal/AdminDashboard.tsx', 'utf8');

code = code.replace(
  /<p className="text-\[10px\] sm:text-\[11px\] text-purple-600 font-bold bg-purple-50 inline-block px-2 py-0\.5 rounded-md mt-1">\{t\.gelar\}<\/p>/g,
  '<p className="hidden md:inline-block text-[10px] sm:text-[11px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-md mt-1">{t.gelar}</p>'
);

fs.writeFileSync('src/components/portal/AdminDashboard.tsx', code);
