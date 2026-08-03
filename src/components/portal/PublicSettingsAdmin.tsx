import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Save, Plus, Trash2, Image as ImageIcon, Layout, BookOpen, Users, Upload, Loader2, Check } from 'lucide-react';
import { uploadImageToSupabase } from '../../lib/imageUpload';

export const PublicSettingsAdmin: React.FC = () => {
  const { publicContent, updatePublicContent, tentors } = useApp();
  const [content, setContent] = useState<any>({
    hero_slides: [],
    programs: [],
    featured_tentors: [],
    show_become_tentor: true,
    features_images: ["", "", "", ""],
    gallery_items: []
  });
  const [activeTab, setActiveTab] = useState<'hero' | 'features' | 'program' | 'tentor' | 'gallery'>('hero');
  const [uploadingSlide, setUploadingSlide] = useState<number | null>(null);
  const [uploadingProgram, setUploadingProgram] = useState<number | null>(null);
  const [uploadingGallery, setUploadingGallery] = useState<number | null>(null);
  const [uploadingFeatureImage, setUploadingFeatureImage] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSlideImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingSlide(idx);
    try {
      const url = await uploadImageToSupabase(file, 'images');
      if (url) {
        const newSlides = [...content.hero_slides];
        newSlides[idx].image = url;
        setContent({ ...content, hero_slides: newSlides });
      } else {
        alert("Gagal mengunggah gambar. Pastikan bucket 'images' telah diatur menjadi public.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengunggah gambar.");
    } finally {
      setUploadingSlide(null);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleProgramImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingProgram(idx);
    try {
      const url = await uploadImageToSupabase(file, 'images');
      if (url) {
        const newProgs = [...content.programs];
        newProgs[idx].image = url;
        setContent({ ...content, programs: newProgs });
      } else {
        alert("Gagal mengunggah gambar. Pastikan bucket 'images' telah diatur menjadi public.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengunggah gambar.");
    } finally {
      setUploadingProgram(null);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleGalleryImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingGallery(idx);
    try {
      const url = await uploadImageToSupabase(file, 'images');
      if (url) {
        const newGallery = [...(content.gallery_items || [])];
        newGallery[idx].image = url;
        setContent({ ...content, gallery_items: newGallery });
      } else {
        alert("Gagal mengunggah gambar. Pastikan bucket 'images' telah diatur menjadi public.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengunggah gambar.");
    } finally {
      setUploadingGallery(null);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  useEffect(() => {
    if (publicContent) {
      setContent({
        ...publicContent,
        features_images: publicContent.features_images || ["", "", "", ""]
      });
    }
  }, [publicContent]);

  const handleFeatureImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSave = async () => {
    setIsSaving(true);
    await updatePublicContent(content);
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (!publicContent) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p className="mb-4">Data pengaturan publik belum tersedia di database.</p>
        <p>Pastikan Anda telah menjalankan script SQL untuk membuat tabel <b>public_settings</b> di Supabase.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Pengaturan Publik</h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1">Kelola konten yang ditampilkan di halaman depan website.</p>
        </div>
        <div className="flex items-center gap-3">
          {showSuccess && (
            <span className="text-sm font-semibold text-green-600 flex items-center gap-1.5 animate-in fade-in slide-in-from-right-4 duration-300">
              <Check className="w-4 h-4" /> Berhasil disimpan
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm sm:text-base transition-all shadow-md shrink-0 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs Sidebar */}
        <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-xs sm:text-sm whitespace-nowrap cursor-pointer ${
              activeTab === 'hero' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            <Layout className="w-4 h-4" />
            Hero Banner
          </button>
          <button
            onClick={() => setActiveTab('program')}
            className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-xs sm:text-sm whitespace-nowrap cursor-pointer ${
              activeTab === 'program' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Program Belajar
          </button>
          <button
            onClick={() => setActiveTab('tentor')}
            className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-xs sm:text-sm whitespace-nowrap cursor-pointer ${
              activeTab === 'tentor' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Tentor Pilihan
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-xs sm:text-sm whitespace-nowrap cursor-pointer ${
              activeTab === 'features' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            <Layout className="w-4 h-4" />
            Keunggulan
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-xs sm:text-sm whitespace-nowrap cursor-pointer ${
              activeTab === 'gallery' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Galeri Kegiatan
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-slate-100 min-h-[500px]">
          
          {activeTab === 'hero' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">Pengaturan Hero Banner</h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">Atur gambar, judul, dan deskripsi pada slider utama beranda.</p>
              </div>
              <div className="space-y-6">
                {content.hero_slides?.map((slide: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 space-y-4 relative">
                    <button 
                      onClick={() => {
                        const newSlides = [...content.hero_slides];
                        newSlides.splice(idx, 1);
                        setContent({ ...content, hero_slides: newSlides });
                      }}
                      className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                      title="Hapus Slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center">{idx + 1}</span>
                      Slide
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Judul</label>
                        <input 
                          type="text" 
                          value={slide.title}
                          onChange={(e) => {
                            const newSlides = [...content.hero_slides];
                            newSlides[idx].title = e.target.value;
                            setContent({ ...content, hero_slides: newSlides });
                          }}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Gambar (URL / Unggah)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={slide.image}
                            onChange={(e) => {
                              const newSlides = [...content.hero_slides];
                              newSlides[idx].image = e.target.value;
                              setContent({ ...content, hero_slides: newSlides });
                            }}
                            className="flex-1 w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all"
                          />
                          <label className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl cursor-pointer transition-colors border border-slate-200 shrink-0">
                            {uploadingSlide === idx ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Upload className="w-5 h-5" />
                            )}
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleSlideImageUpload(idx, e)}
                              disabled={uploadingSlide === idx}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Deskripsi</label>
                      <textarea 
                        value={slide.description}
                        onChange={(e) => {
                          const newSlides = [...content.hero_slides];
                          newSlides[idx].description = e.target.value;
                          setContent({ ...content, hero_slides: newSlides });
                        }}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all resize-y"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newSlides = [...(content.hero_slides || []), {
                      title: 'Slide Baru',
                      image: '',
                      description: '',
                      buttonText: 'Daftar Sekarang',
                      primary: false
                    }];
                    setContent({ ...content, hero_slides: newSlides });
                  }}
                  className="w-full py-3 sm:py-4 border-2 border-dashed border-slate-200 text-slate-500 hover:text-purple-600 hover:bg-purple-50 hover:border-purple-300 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Slide Baru
                </button>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">Kolase Gambar Keunggulan</h3>
                  <p className="text-xs sm:text-sm text-slate-500">Ubah 4 gambar yang tampil di bagian kiri pada area Keunggulan.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-4 relative">
                    <div className="relative w-full aspect-square bg-slate-200 rounded-xl overflow-hidden group">
                      {(content.features_images && content.features_images[idx]) ? (
                        <img 
                          src={content.features_images[idx] || undefined} 
                          alt={`Feature ${idx + 1}`} 
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
          {activeTab === 'program' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">Pengaturan Program Belajar</h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">Sesuaikan deskripsi singkat dan gambar banner untuk masing-masing jenjang.</p>
              </div>
              <div className="space-y-5">
                {content.programs?.map((prog: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg">Program {prog.jenjang}</span>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Gambar Banner (URL / Unggah)</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={prog.image || ''}
                          onChange={(e) => {
                            const newProgs = [...content.programs];
                            newProgs[idx].image = e.target.value;
                            setContent({ ...content, programs: newProgs });
                          }}
                          className="flex-1 w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all"
                          placeholder="https://..."
                        />
                        <label className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl cursor-pointer transition-colors border border-slate-200 shrink-0">
                          {uploadingProgram === idx ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Upload className="w-5 h-5" />
                          )}
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleProgramImageUpload(idx, e)}
                            disabled={uploadingProgram === idx}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Deskripsi Singkat</label>
                      <textarea 
                        value={prog.deskripsi || ''}
                        onChange={(e) => {
                          const newProgs = [...content.programs];
                          newProgs[idx].deskripsi = e.target.value;
                          setContent({ ...content, programs: newProgs });
                        }}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tentor' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 mb-1">Banner "Jadilah Tentor Kami"</h4>
                  <p className="text-xs text-slate-500 mb-3">Tampilkan tawaran menjadi tentor di halaman publik.</p>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={content.show_become_tentor !== false}
                      onChange={(e) => setContent({ ...content, show_become_tentor: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Tampilkan Banner</span>
                </label>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">Pengaturan Tentor Pilihan</h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">Pilih tentor mana saja yang ingin ditampilkan secara spesifik di halaman depan. Jika kosong, sistem akan menampilkan 3 tentor pertama.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tentors.map((t) => (
                  <label key={t.id} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-purple-50 transition-colors">
                    <input 
                      type="checkbox"
                      className="w-5 h-5 text-purple-600 rounded-md border-slate-300 focus:ring-purple-500 cursor-pointer"
                      checked={(content.featured_tentors || []).includes(t.id)}
                      onChange={(e) => {
                        const current = content.featured_tentors || [];
                        const newFeatured = e.target.checked 
                          ? [...current, t.id]
                          : current.filter((id: string) => id !== t.id);
                        setContent({ ...content, featured_tentors: newFeatured });
                      }}
                    />
                    <div className="flex items-center gap-3">
                      <img src={t.foto || undefined} className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200" alt={t.nama} />
                      <div>
                        <div className="text-sm font-bold text-slate-900">{t.nama}</div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-1">{t.spesialisasi}</div>
                      </div>
                    </div>
                  </label>
                ))}
                {tentors.length === 0 && (
                  <div className="col-span-full p-4 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    Belum ada data tentor di sistem.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">Pengaturan Galeri Kegiatan</h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">Atur foto-foto dokumentasi kegiatan yang akan ditampilkan pada slider galeri.</p>
              </div>
              <div className="space-y-6">
                {(content.gallery_items || []).map((item: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 space-y-4 relative">
                    <button 
                      onClick={() => {
                        const newGallery = [...content.gallery_items];
                        newGallery.splice(idx, 1);
                        setContent({ ...content, gallery_items: newGallery });
                      }}
                      className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                      title="Hapus Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center">{idx + 1}</span>
                      Foto Kegiatan
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Judul</label>
                        <input 
                          type="text" 
                          value={item.title || ''}
                          onChange={(e) => {
                            const newGallery = [...content.gallery_items];
                            newGallery[idx].title = e.target.value;
                            setContent({ ...content, gallery_items: newGallery });
                          }}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Gambar (URL / Unggah)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={item.image || ''}
                            onChange={(e) => {
                              const newGallery = [...content.gallery_items];
                              newGallery[idx].image = e.target.value;
                              setContent({ ...content, gallery_items: newGallery });
                            }}
                            className="flex-1 w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all"
                          />
                          <label className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl cursor-pointer transition-colors border border-slate-200 shrink-0">
                            {uploadingGallery === idx ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Upload className="w-5 h-5" />
                            )}
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleGalleryImageUpload(idx, e)}
                              disabled={uploadingGallery === idx}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Label (Tag)</label>
                        <input 
                          type="text" 
                          value={item.tag || ''}
                          onChange={(e) => {
                            const newGallery = [...content.gallery_items];
                            newGallery[idx].tag = e.target.value;
                            setContent({ ...content, gallery_items: newGallery });
                          }}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all"
                          placeholder="Misal: Kegiatan SD"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Deskripsi Singkat</label>
                        <textarea 
                          value={item.caption || ''}
                          onChange={(e) => {
                            const newGallery = [...content.gallery_items];
                            newGallery[idx].caption = e.target.value;
                            setContent({ ...content, gallery_items: newGallery });
                          }}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all resize-y"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newGallery = [...(content.gallery_items || []), {
                      title: 'Kegiatan Baru',
                      caption: 'Deskripsi kegiatan baru',
                      image: '',
                      tag: 'Umum'
                    }];
                    setContent({ ...content, gallery_items: newGallery });
                  }}
                  className="w-full py-3 sm:py-4 border-2 border-dashed border-slate-200 text-slate-500 hover:text-purple-600 hover:bg-purple-50 hover:border-purple-300 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Foto Kegiatan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
