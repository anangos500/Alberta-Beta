const fs = require('fs');
let code = fs.readFileSync('src/components/portal/JadwalManagementModal.tsx', 'utf8');
code = code.replace(/        <\/div>\n        <div className="p-6 sm:px-8 sm:py-6 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0 bg-slate-50 rounded-b-3xl mt-auto">/, '        </form>\n        </div>\n        <div className="p-6 sm:px-8 sm:py-6 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0 bg-slate-50 rounded-b-3xl mt-auto">');
fs.writeFileSync('src/components/portal/JadwalManagementModal.tsx', code);
