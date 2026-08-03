const fs = require('fs');
let code = fs.readFileSync('src/components/portal/ReportDetailModal.tsx', 'utf8');
code = code.replace(/<div className="fixed inset-0 z-50 bg-stone-950\/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-hidden">/, `<div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-hidden" onClick={onClose}>`);
code = code.replace(/<div className="bg-white rounded-3xl max-w-2xl w-full shadow-sm border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-full">/, `<div className="bg-white rounded-3xl max-w-2xl w-full shadow-sm border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-full" onClick={(e) => e.stopPropagation()}>`);
fs.writeFileSync('src/components/portal/ReportDetailModal.tsx', code);
