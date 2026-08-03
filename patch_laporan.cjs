const fs = require('fs');
let code = fs.readFileSync('src/components/portal/AdminDashboard.tsx', 'utf8');

// Sudah Memberikan Laporan
code = code.replace(
  /<div className="bg-white rounded-\[1\.5rem\] border border-slate-100 shadow-sm p-6">\s*<div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">\s*<div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">\s*<CheckCircle2 className="w-5 h-5" \/>\s*<\/div>\s*<div>\s*<h3 className="font-extrabold text-slate-900 text-base">Sudah Memberikan Laporan<\/h3>/g,
  `<div className="bg-white rounded-[1.25rem] sm:rounded-[1.5rem] border border-slate-100 shadow-sm p-4 sm:p-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 sm:pb-4 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">Sudah Memberikan Laporan</h3>`
);

// Belum Memberikan Laporan
code = code.replace(
  /<div className="bg-white rounded-\[1\.5rem\] border border-slate-100 shadow-sm p-6">\s*<div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">\s*<div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">\s*<XCircle className="w-5 h-5" \/>\s*<\/div>\s*<div>\s*<h3 className="font-extrabold text-slate-900 text-base">Belum Memberikan Laporan<\/h3>/g,
  `<div className="bg-white rounded-[1.25rem] sm:rounded-[1.5rem] border border-slate-100 shadow-sm p-4 sm:p-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 sm:pb-4 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">Belum Memberikan Laporan</h3>`
);

fs.writeFileSync('src/components/portal/AdminDashboard.tsx', code);
