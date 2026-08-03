const fs = require('fs');
let file = fs.readFileSync('src/components/public/AboutSection.tsx', 'utf8');

if (!file.includes('import { useApp }')) {
  file = file.replace(
    'import { BookOpen, CheckCircle2, HeartHandshake, ShieldAlert, Sparkles, Building2, MapPin, Award } from \'lucide-react\';',
    'import { BookOpen, CheckCircle2, HeartHandshake, ShieldAlert, Sparkles, Building2, MapPin, Award } from \'lucide-react\';\nimport { useApp } from \'../../context/AppContext\';'
  );
}

file = file.replace(
  '<div className="w-full h-48 bg-purple-100 rounded-[2rem] rounded-tl-[4rem] border-4 border-white shadow-md flex items-center justify-center"><BookOpen className="w-8 h-8 text-purple-200" /></div>',
  `{featuresImages[0] ? (
                  <img src={featuresImages[0]} alt="Siswa Belajar" className="w-full h-48 object-cover rounded-[2rem] rounded-tl-[4rem] border-4 border-white shadow-md bg-slate-100" />
                ) : (
                  <div className="w-full h-48 bg-purple-100 rounded-[2rem] rounded-tl-[4rem] border-4 border-white shadow-md flex items-center justify-center"><BookOpen className="w-8 h-8 text-purple-200" /></div>
                )}`
);

file = file.replace(
  '<div className="w-full h-56 bg-pink-100 rounded-[2rem] rounded-bl-[4rem] border-4 border-white shadow-md flex items-center justify-center"><BookOpen className="w-8 h-8 text-pink-200" /></div>',
  `{featuresImages[1] ? (
                  <img src={featuresImages[1]} alt="Siswa Belajar" className="w-full h-56 object-cover rounded-[2rem] rounded-bl-[4rem] border-4 border-white shadow-md bg-slate-100" />
                ) : (
                  <div className="w-full h-56 bg-pink-100 rounded-[2rem] rounded-bl-[4rem] border-4 border-white shadow-md flex items-center justify-center"><BookOpen className="w-8 h-8 text-pink-200" /></div>
                )}`
);

file = file.replace(
  '<div className="w-full h-56 bg-blue-100 rounded-[2rem] rounded-tr-[4rem] border-4 border-white shadow-md flex items-center justify-center"><BookOpen className="w-8 h-8 text-blue-200" /></div>',
  `{featuresImages[2] ? (
                  <img src={featuresImages[2]} alt="Siswa Belajar" className="w-full h-56 object-cover rounded-[2rem] rounded-tr-[4rem] border-4 border-white shadow-md bg-slate-100" />
                ) : (
                  <div className="w-full h-56 bg-blue-100 rounded-[2rem] rounded-tr-[4rem] border-4 border-white shadow-md flex items-center justify-center"><BookOpen className="w-8 h-8 text-blue-200" /></div>
                )}`
);

file = file.replace(
  '<div className="w-full h-48 bg-emerald-100 rounded-[2rem] rounded-br-[4rem] border-4 border-white shadow-md flex items-center justify-center"><BookOpen className="w-8 h-8 text-emerald-200" /></div>',
  `{featuresImages[3] ? (
                  <img src={featuresImages[3]} alt="Siswa Belajar" className="w-full h-48 object-cover rounded-[2rem] rounded-br-[4rem] border-4 border-white shadow-md bg-slate-100" />
                ) : (
                  <div className="w-full h-48 bg-emerald-100 rounded-[2rem] rounded-br-[4rem] border-4 border-white shadow-md flex items-center justify-center"><BookOpen className="w-8 h-8 text-emerald-200" /></div>
                )}`
);

fs.writeFileSync('src/components/public/AboutSection.tsx', file);
console.log("Fixed AboutSection conditional rendering");
