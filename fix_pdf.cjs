const fs = require('fs');
let code = fs.readFileSync('src/components/portal/PdfReportView.tsx', 'utf8');
code = code.replace(/<div className="fixed inset-0 z-50 bg-stone-900\/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">/, `<div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>`);
code = code.replace(/<div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-sm relative my-8 max-h-\[90vh\] overflow-y-auto print:max-h-none print:shadow-none print:p-0">/, `<div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-sm relative my-8 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:p-0" onClick={(e) => e.stopPropagation()}>`);
fs.writeFileSync('src/components/portal/PdfReportView.tsx', code);
