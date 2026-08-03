const fs = require('fs');
let file = fs.readFileSync('src/components/public/ProgramsSection.tsx', 'utf8');

file = file.replace(
  '      image: setting?.image || getProgramImage(prog.jenjang)',
  '      image: setting?.image || ""'
);

file = file.replace(
  /<img\s*src=\{prog\.image\}\s*alt=\{prog\.nama\}\s*className="w-full h-full object-cover"\s*\/>/g,
  `{prog.image ? (
                  <img src={prog.image} alt={prog.nama} className="w-full h-full object-cover bg-slate-100" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <BookOpen className="w-12 h-12" />
                  </div>
                )}`
);

fs.writeFileSync('src/components/public/ProgramsSection.tsx', file);
