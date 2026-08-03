const fs = require('fs');
let file = fs.readFileSync('src/components/public/TentorsSection.tsx', 'utf8');

file = file.replace(
  'foto: \'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&q=80&w=600\',',
  'foto: \'\','
);
file = file.replace(
  'foto: \'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=600\',',
  'foto: \'\','
);
file = file.replace(
  'foto: \'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=600\',',
  'foto: \'\','
);

file = file.replace(
  /<img\s*src=\{tentor\.foto\}\s*alt=\{tentor\.nama\}\s*className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"\s*\/>/g,
  `{tentor.foto ? (
                  <img src={tentor.foto} alt={tentor.nama} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 bg-slate-100" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <UserCheck className="w-12 h-12" />
                  </div>
                )}`
);

fs.writeFileSync('src/components/public/TentorsSection.tsx', file);
