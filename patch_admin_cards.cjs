const fs = require('fs');
let code = fs.readFileSync('src/components/portal/AdminDashboard.tsx', 'utf8');

const regex = /<div className="bg-white p-5 sm:p-6 rounded-\[1\.5rem\] border border-slate-100 shadow-sm space-y-2">/g;

code = code.replace(regex, '<div className="bg-white p-5 sm:p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col h-full gap-2">');

fs.writeFileSync('src/components/portal/AdminDashboard.tsx', code);
