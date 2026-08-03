const fs = require('fs');
let file = fs.readFileSync('src/components/public/AboutSection.tsx', 'utf8');

file = file.replace(
  'import { Target, Users, Sparkles, CheckCircle2 } from \'lucide-react\';',
  'import { Target, Users, Sparkles, CheckCircle2, Image as ImageIcon } from \'lucide-react\';\nimport { useApp } from \'../../context/AppContext\';'
);

file = file.replace(
  'export const AboutSection: React.FC = () => {',
  'export const AboutSection: React.FC = () => {\n  const { publicContent } = useApp();\n  const featuresImages = publicContent?.features_images || ["", "", "", ""];'
);

file = file.replace(
  /<img\s*src="https:\/\/images\.unsplash\.com\/photo-1577896851231-70ef18881754\?auto=format&fit=crop&q=80&w=400"\s*alt="Siswa Belajar"\s*className="w-full h-48 object-cover rounded-\[2rem\] rounded-tl-\[4rem\] border-4 border-white shadow-md"\s*\/>/g,
  `{featuresImages[0] ? (
                  <img src={featuresImages[0]} alt="Siswa Belajar" className="w-full h-48 object-cover rounded-[2rem] rounded-tl-[4rem] border-4 border-white shadow-md bg-slate-100" />
                ) : (
                  <div className="w-full h-48 rounded-[2rem] rounded-tl-[4rem] border-4 border-white shadow-md bg-slate-100 flex items-center justify-center text-slate-300">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}`
);

file = file.replace(
  /<img\s*src="https:\/\/images\.unsplash\.com\/photo-1427504494785-3a9ca7044f45\?auto=format&fit=crop&q=80&w=400"\s*alt="Siswa Belajar"\s*className="w-full h-56 object-cover rounded-\[2rem\] rounded-bl-\[4rem\] border-4 border-white shadow-md"\s*\/>/g,
  `{featuresImages[1] ? (
                  <img src={featuresImages[1]} alt="Siswa Belajar" className="w-full h-56 object-cover rounded-[2rem] rounded-bl-[4rem] border-4 border-white shadow-md bg-slate-100" />
                ) : (
                  <div className="w-full h-56 rounded-[2rem] rounded-bl-[4rem] border-4 border-white shadow-md bg-slate-100 flex items-center justify-center text-slate-300">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}`
);

file = file.replace(
  /<img\s*src="https:\/\/images\.unsplash\.com\/photo-1522202176988-66273c2fd55f\?auto=format&fit=crop&q=80&w=400"\s*alt="Siswa Belajar"\s*className="w-full h-56 object-cover rounded-\[2rem\] rounded-tr-\[4rem\] border-4 border-white shadow-md"\s*\/>/g,
  `{featuresImages[2] ? (
                  <img src={featuresImages[2]} alt="Siswa Belajar" className="w-full h-56 object-cover rounded-[2rem] rounded-tr-[4rem] border-4 border-white shadow-md bg-slate-100" />
                ) : (
                  <div className="w-full h-56 rounded-[2rem] rounded-tr-[4rem] border-4 border-white shadow-md bg-slate-100 flex items-center justify-center text-slate-300">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}`
);

file = file.replace(
  /<img\s*src="https:\/\/images\.unsplash\.com\/photo-1509062522246-3755977927d7\?auto=format&fit=crop&q=80&w=400"\s*alt="Siswa Belajar"\s*className="w-full h-48 object-cover rounded-\[2rem\] rounded-br-\[4rem\] border-4 border-white shadow-md"\s*\/>/g,
  `{featuresImages[3] ? (
                  <img src={featuresImages[3]} alt="Siswa Belajar" className="w-full h-48 object-cover rounded-[2rem] rounded-br-[4rem] border-4 border-white shadow-md bg-slate-100" />
                ) : (
                  <div className="w-full h-48 rounded-[2rem] rounded-br-[4rem] border-4 border-white shadow-md bg-slate-100 flex items-center justify-center text-slate-300">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}`
);

fs.writeFileSync('src/components/public/AboutSection.tsx', file);
