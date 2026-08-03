const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col pb-24 lg:pb-0">/g;
code = code.replace(regex, '<div className="h-[100dvh] bg-slate-50 font-sans text-slate-900 flex flex-col pb-[calc(env(safe-area-inset-bottom)+70px)] lg:pb-0 overflow-hidden">');

fs.writeFileSync('src/App.tsx', code);
