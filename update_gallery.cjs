const fs = require('fs');

let file = fs.readFileSync('src/components/public/GallerySection.tsx', 'utf8');

const originalGrid = `<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">`;
const newGrid = `<div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 lg:items-center">

          {/* Mobile Header */}
          <div className="space-y-4 lg:hidden w-full">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
              <Camera className="w-4 h-4" />
              <span>Dokumentasi Kegiatan</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Keseruan Belajar Bersama <br/>
              <span className="text-purple-600">Bimbel Alberta</span>
            </h2>
          </div>`;

file = file.replace(originalGrid, newGrid);

file = file.replace(
  `{/* Left: Image Slider */}\n          <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-2xl bg-slate-100 group order-2 lg:order-1">`,
  `{/* Left: Image Slider */}\n          <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-2xl bg-slate-100 group w-full">`
);

file = file.replace(
  `{/* Right: Static Description */}\n          <div className="space-y-6 order-1 lg:order-2">`,
  `{/* Right: Static Description */}\n          <div className="space-y-6 w-full">`
);

const oldTitleBlock = `<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
              <Camera className="w-4 h-4" />
              <span>Dokumentasi Kegiatan</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              Keseruan Belajar Bersama <br/>
              <span className="text-purple-600">Bimbel Alberta</span>
            </h2>`;
            
const newTitleBlock = `<div className="hidden lg:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
              <Camera className="w-4 h-4" />
              <span>Dokumentasi Kegiatan</span>
            </div>
            
            <h2 className="hidden lg:block text-4xl font-extrabold text-slate-900 leading-tight">
              Keseruan Belajar Bersama <br/>
              <span className="text-purple-600">Bimbel Alberta</span>
            </h2>`;

file = file.replace(oldTitleBlock, newTitleBlock);

fs.writeFileSync('src/components/public/GallerySection.tsx', file);
console.log("Updated GallerySection");
