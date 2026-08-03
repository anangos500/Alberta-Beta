const fs = require('fs');
let file = fs.readFileSync('src/components/portal/PublicSettingsAdmin.tsx', 'utf8');

const originalGalleryButton = `          <button
            onClick={() => setActiveTab('gallery')}
            className={\`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm whitespace-nowrap cursor-pointer \${
              activeTab === 'gallery' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }\`}
          >
            <ImageIcon className="w-4 h-4" />
            Galeri Kegiatan
          </button>`;

const galleryButtonWithFeatures = `          <button
            onClick={() => setActiveTab('features')}
            className={\`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm whitespace-nowrap cursor-pointer \${
              activeTab === 'features' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }\`}
          >
            <Layout className="w-4 h-4" />
            Keunggulan
          </button>` + "\n" + originalGalleryButton;

file = file.replace(originalGalleryButton, galleryButtonWithFeatures);

fs.writeFileSync('src/components/portal/PublicSettingsAdmin.tsx', file);
console.log("Updated tab buttons");
