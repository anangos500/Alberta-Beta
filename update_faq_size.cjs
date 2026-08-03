const fs = require('fs');
let file = fs.readFileSync('src/components/public/FaqSection.tsx', 'utf8');

file = file.replace(
  'className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"',
  'className="w-full p-4 sm:p-6 text-left flex items-start sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer"'
);

file = file.replace(
  'className="flex items-center gap-3 sm:gap-4"',
  'className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4"'
);

file = file.replace(
  'className="px-6 pb-6 pt-2 text-slate-600 text-sm leading-relaxed border-t border-slate-50 bg-slate-50/50"',
  'className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 sm:pt-2 text-slate-600 text-sm leading-relaxed border-t border-slate-50 bg-slate-50/50"'
);

fs.writeFileSync('src/components/public/FaqSection.tsx', file);
console.log("Updated FAQ sizing");
