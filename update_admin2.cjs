const fs = require('fs');
let file = fs.readFileSync('src/components/portal/PublicSettingsAdmin.tsx', 'utf8');

const oldUseEffect = `useEffect(() => {
    if (publicContent) {
      setContent(publicContent);
    }
  }, [publicContent]);`;
  
const newUseEffect = `useEffect(() => {
    if (publicContent) {
      setContent({
        ...publicContent,
        features_images: publicContent.features_images || [
          "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
          "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80"
        ]
      });
    }
  }, [publicContent]);`;

file = file.replace(oldUseEffect, newUseEffect);

// add handleFeatureImageUpload
const beforeSave = `  const handleSave = async () => {`;
const afterSave = `  const handleFeatureImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingFeatureImage(idx);
    try {
      const url = await uploadImageToSupabase(file, 'images');
      if (url) {
        const newImages = [...(content.features_images || [])];
        newImages[idx] = url;
        setContent({ ...content, features_images: newImages });
      } else {
        alert("Gagal mengunggah gambar. Pastikan bucket 'images' telah diatur menjadi public.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengunggah gambar.");
    } finally {
      setUploadingFeatureImage(null);
    }
  };

  const handleSave = async () => {`;
file = file.replace(beforeSave, afterSave);

// Add the UI
const beforeGallery = `          {activeTab === 'program' && (`;
const featuresUI = `          {activeTab === 'features' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Kolase Gambar Keunggulan</h3>
                  <p className="text-sm text-slate-500">Ubah 4 gambar yang tampil di bagian kiri pada area Keunggulan.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-4 relative">
                    <div className="relative w-full aspect-square bg-slate-200 rounded-xl overflow-hidden group">
                      {(content.features_images && content.features_images[idx]) ? (
                        <img 
                          src={content.features_images[idx]} 
                          alt={\`Feature \${idx + 1}\`} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-slate-400">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      
                      {uploadingFeatureImage === idx && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all">
                          <Upload className="w-4 h-4" />
                          Ganti Gambar
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleFeatureImageUpload(idx, e)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
`;
file = file.replace(beforeGallery, featuresUI + beforeGallery);

fs.writeFileSync('src/components/portal/PublicSettingsAdmin.tsx', file);
console.log("Updated admin 2");
