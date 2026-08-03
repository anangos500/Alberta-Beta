const fs = require('fs');
let code = fs.readFileSync('src/components/portal/AdminDashboard.tsx', 'utf8');

// Replace the badge class to add mt-auto so it pushes to the bottom
code = code.replace(
  /<p className="text-\[11px\] text-purple-600 font-bold bg-purple-50 inline-block px-2 py-0\.5 rounded-md border border-purple-100">SD & SMP<\/p>/g,
  '<p className="text-[11px] text-purple-600 font-bold bg-purple-50 inline-block px-2 py-0.5 rounded-md border border-purple-100 mt-auto self-start">SD & SMP</p>'
);
code = code.replace(
  /<p className="text-\[11px\] text-purple-600 font-bold bg-purple-50 inline-block px-2 py-0\.5 rounded-md border border-purple-100">Aktif Mengajar<\/p>/g,
  '<p className="text-[11px] text-purple-600 font-bold bg-purple-50 inline-block px-2 py-0.5 rounded-md border border-purple-100 mt-auto self-start">Aktif Mengajar</p>'
);
code = code.replace(
  /<p className="text-\[11px\] text-emerald-700 font-bold bg-emerald-50 inline-block px-2 py-0\.5 rounded-md border border-emerald-200">Sudah Submit<\/p>/g,
  '<p className="text-[11px] text-emerald-700 font-bold bg-emerald-50 inline-block px-2 py-0.5 rounded-md border border-emerald-200 mt-auto self-start">Sudah Submit</p>'
);
code = code.replace(
  /<p className="text-\[11px\] text-rose-700 font-bold bg-rose-50 inline-block px-2 py-0\.5 rounded-md border border-rose-200">Menunggu Submit<\/p>/g,
  '<p className="text-[11px] text-rose-700 font-bold bg-rose-50 inline-block px-2 py-0.5 rounded-md border border-rose-200 mt-auto self-start">Menunggu Submit</p>'
);

fs.writeFileSync('src/components/portal/AdminDashboard.tsx', code);
