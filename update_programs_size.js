const fs = require('fs');
let file = fs.readFileSync('src/components/public/ProgramsSection.tsx', 'utf8');

file = file.replace(
  'className="min-w-[85vw] md:min-w-0 bg-white rounded-[2rem] p-4 flex flex-col shadow-2xl hover:-translate-y-2 transition-transform duration-300 snap-center shrink-0"',
  'className="w-[75vw] sm:w-[320px] md:w-auto bg-white rounded-[2rem] p-4 flex flex-col shadow-xl md:shadow-2xl hover:-translate-y-2 transition-transform duration-300 snap-center shrink-0"'
);

file = file.replace(
  'className="relative h-48 w-full rounded-[1.5rem] overflow-hidden mb-4 bg-slate-100 shrink-0"',
  'className="relative h-40 sm:h-48 w-full rounded-[1.5rem] overflow-hidden mb-4 bg-slate-100 shrink-0"'
);

fs.writeFileSync('src/components/public/ProgramsSection.tsx', file);
console.log("Updated programs card sizing");
