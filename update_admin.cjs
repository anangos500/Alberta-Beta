const fs = require('fs');
let file = fs.readFileSync('src/components/portal/PublicSettingsAdmin.tsx', 'utf8');

// Add features to the state
file = file.replace(
  "show_become_tentor: true,",
  `show_become_tentor: true,\n    features_images: ["", "", "", ""],`
);

// Add features to activeTab
file = file.replace(
  "const [activeTab, setActiveTab] = useState<'hero' | 'program' | 'tentor' | 'gallery'>('hero');",
  "const [activeTab, setActiveTab] = useState<'hero' | 'features' | 'program' | 'tentor' | 'gallery'>('hero');"
);

// Add uploading state for features
file = file.replace(
  "const [uploadingGallery, setUploadingGallery] = useState<number | null>(null);",
  "const [uploadingGallery, setUploadingGallery] = useState<number | null>(null);\n  const [uploadingFeatureImage, setUploadingFeatureImage] = useState<number | null>(null);"
);

// Add tab button
const tabGallery = `activeTab === 'gallery' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }\`}>
              <ImageIcon className="w-4 h-4" />
              Galeri
            </button>
          </nav>`;
const tabGalleryWithFeatures = `activeTab === 'gallery' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }\`}>
              <ImageIcon className="w-4 h-4" />
              Galeri
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={\`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap \${
                activeTab === 'features' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }\`}>
              <Layout className="w-4 h-4" />
              Keunggulan
            </button>
          </nav>`;
file = file.replace(tabGallery, tabGalleryWithFeatures);

fs.writeFileSync('src/components/portal/PublicSettingsAdmin.tsx', file);
console.log("Updated admin 1");
