const fs = require('fs');

let file = fs.readFileSync('src/components/public/FeaturesSection.tsx', 'utf8');

const originalBlock = `<div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex flex-col lg:flex-row gap-3 lg:gap-6 group items-start text-left bg-slate-50 lg:bg-transparent p-4 lg:p-0 rounded-2xl lg:rounded-none border border-slate-100 lg:border-none">
                  <div className="shrink-0">
                    <div className={\`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center \${feature.bg} transition-transform group-hover:scale-110\`}>
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base lg:text-xl font-bold text-slate-900 mb-1.5 lg:mb-2 leading-tight">{feature.title}</h3>
                    <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed text-justify">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>`;

const newBlock = `<div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex flex-col lg:flex-row gap-2.5 sm:gap-3 lg:gap-6 group items-start text-left bg-slate-50 lg:bg-transparent p-3.5 sm:p-4 lg:p-0 rounded-2xl lg:rounded-none border border-slate-100 lg:border-none h-full">
                  <div className="shrink-0">
                    <div className={\`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center \${feature.bg} transition-transform group-hover:scale-110\`}>
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex flex-col justify-start">
                    <h3 className="text-xs sm:text-sm lg:text-xl font-bold text-slate-900 mb-1 lg:mb-2 leading-snug">{feature.title}</h3>
                    <p className="text-[11px] sm:text-xs lg:text-base text-slate-600 leading-relaxed text-left lg:text-justify">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>`;

if (file.includes('className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-8"')) {
  file = file.replace(originalBlock, newBlock);
  fs.writeFileSync('src/components/public/FeaturesSection.tsx', file);
  console.log("FeaturesSection updated successfully.");
} else {
  console.log("Could not find the target block.");
}
