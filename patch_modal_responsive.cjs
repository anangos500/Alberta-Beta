const fs = require('fs');
let code = fs.readFileSync('src/components/portal/ReportDetailModal.tsx', 'utf8');

code = code.replace(
  /<div className="p-2\.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">/g,
  '<div className="p-2.5 sm:p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 items-start">'
);

code = code.replace(
  /span className=\{\`px-2\.5 py-1 rounded-md font-extrabold border/g,
  'span className={`px-3 py-1.5 rounded-md font-extrabold border text-[11px] sm:text-xs inline-block w-fit text-center'
);

fs.writeFileSync('src/components/portal/ReportDetailModal.tsx', code);
