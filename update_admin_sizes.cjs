const fs = require('fs');

let file = fs.readFileSync('src/components/portal/PublicSettingsAdmin.tsx', 'utf8');

// Container padding and radius
file = file.replace(
  'className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100"',
  'className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-slate-100"'
);

// Title text size
file = file.replace(
  'className="text-2xl font-extrabold text-slate-900"',
  'className="text-xl sm:text-2xl font-extrabold text-slate-900"'
);

file = file.replace(
  'className="text-slate-600 mt-1"',
  'className="text-sm sm:text-base text-slate-600 mt-1"'
);

// Save button size
file = file.replace(
  'className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-md shrink-0 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"',
  'className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm sm:text-base transition-all shadow-md shrink-0 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"'
);

// Tab buttons padding and text
file = file.replace(
  /className=\{`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm whitespace-nowrap cursor-pointer \$\{/g,
  "className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-xs sm:text-sm whitespace-nowrap cursor-pointer ${"
);

// Tab content area
file = file.replace(
  'className="flex-1 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 min-h-[500px]"',
  'className="flex-1 bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-slate-100 min-h-[500px]"'
);

// Tab headings
file = file.replace(
  /className="text-xl font-extrabold text-slate-900 mb-1"/g,
  'className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1"'
);
file = file.replace(
  /className="text-lg font-bold text-slate-900"/g,
  'className="text-base sm:text-lg font-bold text-slate-900"'
);
file = file.replace(
  /className="text-sm text-slate-500 mb-6"/g,
  'className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6"'
);
file = file.replace(
  /className="text-sm text-slate-500"/g,
  'className="text-xs sm:text-sm text-slate-500"'
);

// Content box inside tabs padding
file = file.replace(
  /className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 relative"/g,
  'className="bg-slate-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 space-y-4 relative"'
);

// Add button
file = file.replace(
  /className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-500 hover:text-purple-600 hover:bg-purple-50 hover:border-purple-300 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"/g,
  'className="w-full py-3 sm:py-4 border-2 border-dashed border-slate-200 text-slate-500 hover:text-purple-600 hover:bg-purple-50 hover:border-purple-300 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer"'
);

// Replace inputs
file = file.replace(
  /className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden transition-all"/g,
  'className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden transition-all text-sm sm:text-base"'
);
file = file.replace(
  /className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden transition-all min-h-\[100px\]"/g,
  'className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden transition-all min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"'
);

fs.writeFileSync('src/components/portal/PublicSettingsAdmin.tsx', file);
console.log("Updated PublicSettingsAdmin.tsx");
