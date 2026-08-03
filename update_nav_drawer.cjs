const fs = require('fs');

let file = fs.readFileSync('src/components/public/Navbar.tsx', 'utf8');

file = file.replace(
  'className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3"',
  'className="lg:hidden bg-white border-b border-slate-200 px-4 pt-1 pb-4 space-y-2"'
);

file = file.replace(
  'className="text-left px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-100 rounded-lg block"',
  'className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg block"'
);

file = file.replace(
  'className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 text-center flex items-center justify-center gap-2"',
  'className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 text-center flex items-center justify-center gap-2"'
);

file = file.replace(
  'className="w-full py-3 px-4 rounded-xl font-semibold text-purple-900 bg-purple-100 text-center flex items-center justify-center gap-2"',
  'className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-purple-900 bg-purple-100 text-center flex items-center justify-center gap-2"'
);

file = file.replace(
  'className="w-full py-3 px-4 rounded-xl font-semibold text-slate-700 bg-white border-2 border-slate-200 text-center flex items-center justify-center gap-2"',
  'className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 text-center flex items-center justify-center gap-2"'
);

fs.writeFileSync('src/components/public/Navbar.tsx', file);
console.log("Updated Mobile Drawer in Navbar");
