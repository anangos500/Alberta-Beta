const fs = require('fs');

// Fix ProgramsSection
let programs = fs.readFileSync('src/components/public/ProgramsSection.tsx', 'utf8');
programs = programs.replace(
  /return "https:\/\/images\.unsplash\.com\/photo-[^"]+";/g,
  'return "";'
);
programs = programs.replace(
  /<img\s*src=\{prog\.image\}\s*alt=\{prog\.nama\}\s*className="w-full h-full object-cover"\s*\/>/g,
  `{prog.image ? (
                  <img src={prog.image} alt={prog.nama} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-300">
                    <BookOpen className="w-12 h-12" />
                  </div>
                )}`
);
fs.writeFileSync('src/components/public/ProgramsSection.tsx', programs);

// Fix AboutSection
let about = fs.readFileSync('src/components/public/AboutSection.tsx', 'utf8');
about = about.replace(
  /<img\s*src="https:\/\/images\.unsplash\.com\/photo-[^"]+"\s*alt="Siswa Belajar"\s*className="w-full h-48 object-cover rounded-\[2rem\] rounded-tl-\[4rem\] border-4 border-white shadow-md"\s*\/>/g,
  '<div className="w-full h-48 bg-purple-100 rounded-[2rem] rounded-tl-[4rem] border-4 border-white shadow-md flex items-center justify-center"><BookOpen className="w-8 h-8 text-purple-200" /></div>'
);
about = about.replace(
  /<img\s*src="https:\/\/images\.unsplash\.com\/photo-[^"]+"\s*alt="Siswa Belajar"\s*className="w-full h-56 object-cover rounded-\[2rem\] rounded-bl-\[4rem\] border-4 border-white shadow-md"\s*\/>/g,
  '<div className="w-full h-56 bg-pink-100 rounded-[2rem] rounded-bl-[4rem] border-4 border-white shadow-md flex items-center justify-center"><BookOpen className="w-8 h-8 text-pink-200" /></div>'
);
about = about.replace(
  /<img\s*src="https:\/\/images\.unsplash\.com\/photo-[^"]+"\s*alt="Siswa Belajar"\s*className="w-full h-56 object-cover rounded-\[2rem\] rounded-tr-\[4rem\] border-4 border-white shadow-md"\s*\/>/g,
  '<div className="w-full h-56 bg-blue-100 rounded-[2rem] rounded-tr-[4rem] border-4 border-white shadow-md flex items-center justify-center"><BookOpen className="w-8 h-8 text-blue-200" /></div>'
);
about = about.replace(
  /<img\s*src="https:\/\/images\.unsplash\.com\/photo-[^"]+"\s*alt="Siswa Belajar"\s*className="w-full h-48 object-cover rounded-\[2rem\] rounded-br-\[4rem\] border-4 border-white shadow-md"\s*\/>/g,
  '<div className="w-full h-48 bg-emerald-100 rounded-[2rem] rounded-br-[4rem] border-4 border-white shadow-md flex items-center justify-center"><BookOpen className="w-8 h-8 text-emerald-200" /></div>'
);
if (!about.includes("import { BookOpen")) {
    about = about.replace("import { CheckCircle, Users, Trophy, BookOpen as BookIcon } from 'lucide-react';", "import { CheckCircle, Users, Trophy, BookOpen } from 'lucide-react';");
    about = about.replace("<BookIcon", "<BookOpen");
}

fs.writeFileSync('src/components/public/AboutSection.tsx', about);

console.log("Fixed programs and about");
