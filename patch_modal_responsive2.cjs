const fs = require('fs');
let code = fs.readFileSync('src/components/portal/ReportDetailModal.tsx', 'utf8');

code = code.replace(
  /<div className="p-2\.5 sm:p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 items-start">/g,
  '<div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-row items-center justify-between gap-3">'
);

code = code.replace(
  /<span className="font-medium text-stone-700">/g,
  '<span className="font-medium text-stone-700 text-xs sm:text-sm leading-tight">'
);

code = code.replace(
  /span className=\{\`px-3 py-1\.5 rounded-md font-extrabold border text-\[11px\] sm:text-xs inline-block w-fit text-center/g,
  'span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md font-extrabold border text-[10px] sm:text-xs inline-block text-center shrink-0 max-w-[120px] sm:max-w-none'
);

fs.writeFileSync('src/components/portal/ReportDetailModal.tsx', code);
