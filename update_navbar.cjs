const fs = require('fs');

let file = fs.readFileSync('src/components/public/Navbar.tsx', 'utf8');

const oldLogoText = `<div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900">
                  Alberta.
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold px-1.5 sm:px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full border border-purple-200 whitespace-nowrap">
                  TK, SD & SMP
                </span>
              </div>`;
              
const newLogoText = `<div className="flex flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-1.5">
                <span className="font-black text-[17px] sm:text-xl tracking-tight text-slate-900 leading-tight">
                  Alberta.
                </span>
                <span className="text-[8px] sm:text-[10px] uppercase tracking-widest font-bold px-1.5 sm:px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full border border-purple-200 whitespace-nowrap hidden min-[360px]:block">
                  TK, SD & SMP
                </span>
              </div>`;

file = file.replace(oldLogoText, newLogoText);

// Also change the padding of header slightly on mobile to give more space
file = file.replace(
  `className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12"`,
  `className="w-full mx-auto px-3 sm:px-6 lg:px-8 xl:px-12"`
);

file = file.replace(
  `className="sm:hidden px-3 py-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"`,
  `className="sm:hidden px-2.5 py-1.5 text-[10px] font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full whitespace-nowrap"`
);

fs.writeFileSync('src/components/public/Navbar.tsx', file);
console.log("Updated Navbar.tsx");
