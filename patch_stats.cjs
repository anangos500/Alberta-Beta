const fs = require('fs');
let code = fs.readFileSync('src/components/portal/AdminDashboard.tsx', 'utf8');

code = code.replace(
  /<div className="grid grid-cols-2 md:grid-cols-4 gap-5">/g,
  '<div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">'
);

code = code.replace(
  /<div className="bg-white p-5 sm:p-6 rounded-\[1\.5rem\] border border-slate-100 shadow-sm flex flex-col h-full gap-2">/g,
  '<div className="bg-white p-4 sm:p-5 lg:p-6 rounded-[1.25rem] sm:rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col h-full gap-1.5 sm:gap-2">'
);

fs.writeFileSync('src/components/portal/AdminDashboard.tsx', code);
