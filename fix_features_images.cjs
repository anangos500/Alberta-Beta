const fs = require('fs');
let file = fs.readFileSync('src/components/public/FeaturesSection.tsx', 'utf8');

file = file.replace(
  /<img\s*src={featuresImages\[0\]}\s*alt="Classroom"\s*className="w-full h-32 sm:h-48 object-cover rounded-\[1\.5rem\] shadow-sm border-4 border-white"\s*\/>/g,
  `{featuresImages[0] ? (
                  <img src={featuresImages[0]} alt="Classroom" className="w-full h-32 sm:h-48 object-cover rounded-[1.5rem] shadow-sm border-4 border-white bg-slate-100" />
                ) : (
                  <div className="w-full h-32 sm:h-48 rounded-[1.5rem] shadow-sm border-4 border-white bg-slate-100 animate-pulse"></div>
                )}`
);

file = file.replace(
  /<img\s*src={featuresImages\[1\]}\s*alt="Library"\s*className="w-full h-40 sm:h-64 object-cover rounded-\[1\.5rem\] shadow-sm border-4 border-white"\s*\/>/g,
  `{featuresImages[1] ? (
                  <img src={featuresImages[1]} alt="Library" className="w-full h-40 sm:h-64 object-cover rounded-[1.5rem] shadow-sm border-4 border-white bg-slate-100" />
                ) : (
                  <div className="w-full h-40 sm:h-64 rounded-[1.5rem] shadow-sm border-4 border-white bg-slate-100 animate-pulse"></div>
                )}`
);

file = file.replace(
  /<img\s*src={featuresImages\[2\]}\s*alt="Students studying"\s*className="w-full h-36 sm:h-56 object-cover rounded-\[1\.5rem\] shadow-sm border-4 border-white"\s*\/>/g,
  `{featuresImages[2] ? (
                  <img src={featuresImages[2]} alt="Students studying" className="w-full h-36 sm:h-56 object-cover rounded-[1.5rem] shadow-sm border-4 border-white bg-slate-100" />
                ) : (
                  <div className="w-full h-36 sm:h-56 rounded-[1.5rem] shadow-sm border-4 border-white bg-slate-100 animate-pulse"></div>
                )}`
);

file = file.replace(
  /<img\s*src={featuresImages\[3\]}\s*alt="Learning"\s*className="w-full h-32 sm:h-48 object-cover rounded-\[1\.5rem\] shadow-sm border-4 border-white"\s*\/>/g,
  `{featuresImages[3] ? (
                  <img src={featuresImages[3]} alt="Learning" className="w-full h-32 sm:h-48 object-cover rounded-[1.5rem] shadow-sm border-4 border-white bg-slate-100" />
                ) : (
                  <div className="w-full h-32 sm:h-48 rounded-[1.5rem] shadow-sm border-4 border-white bg-slate-100 animate-pulse"></div>
                )}`
);

fs.writeFileSync('src/components/public/FeaturesSection.tsx', file);
