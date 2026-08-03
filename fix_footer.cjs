const fs = require('fs');
let file = fs.readFileSync('src/components/public/Footer.tsx', 'utf8');

// Remove (Demo) text
file = file.replace(
  '<span>Masuk Portal Albertian (Demo)</span>',
  '<span>Masuk Portal Albertian</span>'
);

// Remove reset button
file = file.replace(
  /\s*<button\s*onClick=\{\(\) => \{\s*if \(window\.confirm\('Apakah Anda yakin ingin mengembalikan seluruh data siswa dan laporan ke kondisi awal\?'\)\) \{\s*resetData\(\);\s*alert\('Data demonstrasi telah direset!'\);\s*\}\s*\}\}\s*className="w-full py-3 px-4 rounded-xl text-\[11px\] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all flex items-center justify-center gap-1\.5 cursor-pointer"\s*>\s*<RefreshCw className="w-3\.5 h-3\.5" \/>\s*<span>Reset Data Demonstrasi<\/span>\s*<\/button>/g,
  ''
);

file = file.replace("import { GraduationCap, MapPin, Phone, RefreshCw, Heart, LogIn } from 'lucide-react';", "import { GraduationCap, MapPin, Phone, Heart, LogIn } from 'lucide-react';")

fs.writeFileSync('src/components/public/Footer.tsx', file);
console.log("Fixed Footer");
