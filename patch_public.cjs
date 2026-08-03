const fs = require('fs');

// Patch LoginModal
let loginCode = fs.readFileSync('src/components/public/LoginModal.tsx', 'utf8');
loginCode = loginCode.replace(
  /<div className="fixed inset-0 z-50 bg-slate-900\/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">/,
  `<div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsLoginModalOpen(false)}>`
);
loginCode = loginCode.replace(
  /<div className="bg-white rounded-\[2rem\] max-w-md w-full p-6 sm:p-10 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 my-8 overflow-hidden">/,
  `<div className="bg-white rounded-[2rem] max-w-md w-full p-6 sm:p-10 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 my-8 overflow-hidden" onClick={(e) => e.stopPropagation()}>`
);
fs.writeFileSync('src/components/public/LoginModal.tsx', loginCode);

// Patch RegisterModal
let registerCode = fs.readFileSync('src/components/public/RegisterModal.tsx', 'utf8');
registerCode = registerCode.replace(
  /<div className="fixed inset-0 z-50 bg-slate-900\/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">/,
  `<div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsRegisterModalOpen(false)}>`
);
registerCode = registerCode.replace(
  /<div className="bg-white rounded-\[2rem\] max-w-lg w-full p-6 sm:p-10 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 my-8 overflow-hidden">/,
  `<div className="bg-white rounded-[2rem] max-w-lg w-full p-6 sm:p-10 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 my-8 overflow-hidden" onClick={(e) => e.stopPropagation()}>`
);
fs.writeFileSync('src/components/public/RegisterModal.tsx', registerCode);

