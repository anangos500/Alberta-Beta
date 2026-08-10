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
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'features' | 'program' | 'tentor' | 'gallery' | 'faq'>('hero');
  const [uploadingSlide, setUploadingSlide] = useState<number | null>(null);
  const [uploadingProgram, setUploadingProgram] = useState<number | null>(null);
  const [uploadingGallery, setUploadingGallery] = useState<number | null>(null);
  const [uploadingFeatureImage, setUploadingFeatureImage] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<Record<string, { file: File, objectUrl: string }>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSlideImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const newSlides = [...content.hero_slides];
    newSlides[idx].image = objectUrl;
    setContent({ ...content, hero_slides: newSlides });
    setPendingUploads(prev => ({ ...prev, [`slide_${idx}`]: { file, objectUrl } }));
    if (e.target) e.target.value = '';
  };

  const handleProgramImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const newProgs = [...content.programs];
    newProgs[idx].image = objectUrl;
    setContent({ ...content, programs: newProgs });
    setPendingUploads(prev => ({ ...prev, [`program_${idx}`]: { file, objectUrl } }));
    if (e.target) e.target.value = '';
  };

  const handleGalleryImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const newGallery = [...(content.gallery_items || [])];
    newGallery[idx].image = objectUrl;
    setContent({ ...content, gallery_items: newGallery });
    setPendingUploads(prev => ({ ...prev, [`gallery_${idx}`]: { file, objectUrl } }));
    if (e.target) e.target.value = '';
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
    const objectUrl = URL.createObjectURL(file);
    const newImages = [...(content.features_images || [])];
    newImages[idx] = objectUrl;
    setContent({ ...content, features_images: newImages });
    setPendingUploads(prev => ({ ...prev, [`feature_${idx}`]: { file, objectUrl } }));
    if (e.target) e.target.value = '';
  };

  const handleSave = async () => {
    setIsSaving(true);
    const updatedContent = JSON.parse(JSON.stringify(content));
    const keys = Object.keys(pendingUploads);
    for (const key of keys) {
      const { file, objectUrl } = pendingUploads[key];
      const url = await uploadImageToSupabase(file, 'images');
      if (url) {
        if (key.startsWith('slide_')) {
          const idx = parseInt(key.split('_')[1]);
          updatedContent.hero_slides[idx].image = url;
        } else if (key.startsWith('program_')) {
          const idx = parseInt(key.split('_')[1]);
          updatedContent.programs[idx].image = url;
        } else if (key.startsWith('gallery_')) {
          const idx = parseInt(key.split('_')[1]);
          updatedContent.gallery_items[idx].image = url;
        } else if (key.startsWith('feature_')) {
          const idx = parseInt(key.split('_')[1]);
          updatedContent.features_images[idx] = url;
        }
        URL.revokeObjectURL(objectUrl);
      } else {
        alert("Gagal mengunggah salah satu gambar.");
      }
    }
    await updatePublicContent(updatedContent);
    setContent(updatedContent);
    setPendingUploads({});
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          {showSuccess && (
            <span className="text-sm font-semibold text-green-600 flex items-center gap-1.5 animate-in fade-in slide-in-from-right-4 duration-300">
              <Check className="w-4 h-4" /> Berhasil disimpan
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shrink-0 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
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
          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-xs sm:text-sm whitespace-nowrap cursor-pointer ${
              activeTab === 'about' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Tentang Kami
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-xs sm:text-sm whitespace-nowrap cursor-pointer ${
              activeTab === 'faq' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            <Layout className="w-4 h-4" />
            FAQ
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
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 mb-1">Teks Utama Keunggulan</h4>
                  <p className="text-xs text-slate-500 mb-3">Atur judul dan deskripsi pada bagian keunggulan.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Judul (Baris 1)</label>
                    <input
                      type="text"
                      value={content.features_title_1 || ''}
                      onChange={(e) => setContent({ ...content, features_title_1: e.target.value })}
                      placeholder="Keunggulan Dari"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Judul (Sorotan)</label>
                    <input
                      type="text"
                      value={content.features_title_2 || ''}
                      onChange={(e) => setContent({ ...content, features_title_2: e.target.value })}
                      placeholder="Bimbel Alberta"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Deskripsi</label>
                  <textarea
                    value={content.features_desc || ''}
                    onChange={(e) => setContent({ ...content, features_desc: e.target.value })}
                    placeholder="Tumbuh menjadi pembelajar mandiri..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[80px]"
                  />
                </div>
              </div>

              <div className="space-y-4">
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

            <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">Daftar Keunggulan</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mb-4">Ubah 4 poin keunggulan yang ditampilkan pada area Keunggulan.</p>
                </div>
                
                <div className="space-y-4">
                  {[0, 1, 2, 3].map((idx) => {
                    const defaultTitles = ["Laporan Perkembangan Bulanan", "Tentor Ramah & Berpengalaman", "Kelompok Belajar Eksklusif", "Fasilitas Nyaman di Pusat Kota"];
                    const defaultDescs = [
                      "7 Poin penilaian mendalam dapat diakses kapan saja oleh Orang Tua via Portal Albertian.",
                      "Pengajar sabar, menguasai metode pembelajaran ramah anak SD dan komunikatif untuk remaja SMP.",
                      "Maksimal 5-6 Siswa agar tentor dapat memberikan perhatian personal dan mendampingi PR secara optimal.",
                      "Ruang kelas ber-AC, papan tulis interaktif, meja belajar ergonomic, serta lingkungan aman."
                    ];
                    
                    const currentTitle = content.features_list && content.features_list[idx] ? content.features_list[idx].title : defaultTitles[idx];
                    const currentDesc = content.features_list && content.features_list[idx] ? content.features_list[idx].desc : defaultDescs[idx];
                    
                    return (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
                          <h4 className="text-sm font-extrabold text-slate-900">Keunggulan {idx + 1}</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-1">
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Judul</label>
                            <input
                              type="text"
                              value={currentTitle}
                              onChange={(e) => {
                                const newList = content.features_list ? [...content.features_list] : defaultTitles.map((t, i) => ({ title: t, desc: defaultDescs[i] }));
                                if (!newList[idx]) newList[idx] = { title: '', desc: '' };
                                newList[idx].title = e.target.value;
                                setContent({ ...content, features_list: newList });
                              }}
                              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Deskripsi</label>
                            <input
                              type="text"
                              value={currentDesc}
                              onChange={(e) => {
                                const newList = content.features_list ? [...content.features_list] : defaultTitles.map((t, i) => ({ title: t, desc: defaultDescs[i] }));
                                if (!newList[idx]) newList[idx] = { title: '', desc: '' };
                                newList[idx].desc = e.target.value;
                                setContent({ ...content, features_list: newList });
                              }}
                              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">Atur judul, deskripsi, dan foto-foto dokumentasi kegiatan yang akan ditampilkan pada slider galeri.</p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Judul Galeri (Baris 1)</label>
                  <input
                    type="text"
                    value={content.gallery_title_1 || 'Keseruan Belajar Bersama'}
                    onChange={(e) => setContent({ ...content, gallery_title_1: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Judul Galeri (Baris 2 / Highlight)</label>
                  <input
                    type="text"
                    value={content.gallery_title_2 || 'Bimbel Alberta'}
                    onChange={(e) => setContent({ ...content, gallery_title_2: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Deskripsi Galeri</label>
                  <textarea
                    value={content.gallery_desc || 'Kami percaya bahwa lingkungan belajar yang menyenangkan adalah kunci utama untuk menyerap ilmu dengan baik. Di Bimbel Alberta, setiap sesi dirancang interaktif agar siswa tidak hanya menghafal, tetapi benar-benar memahami konsep.'}
                    onChange={(e) => setContent({ ...content, gallery_desc: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all resize-none"
                  />
                </div>
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

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">Daftar Sorotan Kegiatan</h4>
                  <p className="text-xs text-slate-500 mb-4">Ubah 3 poin deskriptif di samping foto galeri.</p>
                </div>
                
                <div className="space-y-4">
                  {[0, 1, 2].map((idx) => {
                    const defaultTitles = ["Fasilitas Modern & Nyaman", "Pendampingan Intensif", "Metode Interaktif"];
                    const defaultDescs = [
                      "Ruang ber-AC yang kondusif mendukung fokus siswa.",
                      "Tentor selalu siap membantu siswa yang kesulitan.",
                      "Belajar tidak lagi membosankan dengan diskusi dua arah."
                    ];
                    
                    const currentTitle = content.gallery_points && content.gallery_points[idx] ? content.gallery_points[idx].title : defaultTitles[idx];
                    const currentDesc = content.gallery_points && content.gallery_points[idx] ? content.gallery_points[idx].desc : defaultDescs[idx];
                    
                    return (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <div className="md:col-span-1">
                          <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Judul {idx + 1}</label>
                          <input
                            type="text"
                            value={currentTitle}
                            onChange={(e) => {
                              const newList = content.gallery_points ? [...content.gallery_points] : defaultTitles.map((t, i) => ({ title: t, desc: defaultDescs[i] }));
                              if (!newList[idx]) newList[idx] = { title: '', desc: '' };
                              newList[idx].title = e.target.value;
                              setContent({ ...content, gallery_points: newList });
                            }}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Deskripsi {idx + 1}</label>
                          <input
                            type="text"
                            value={currentDesc}
                            onChange={(e) => {
                              const newList = content.gallery_points ? [...content.gallery_points] : defaultTitles.map((t, i) => ({ title: t, desc: defaultDescs[i] }));
                              if (!newList[idx]) newList[idx] = { title: '', desc: '' };
                              newList[idx].desc = e.target.value;
                              setContent({ ...content, gallery_points: newList });
                            }}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">Tautan Media Sosial</h4>
                  <p className="text-xs text-slate-500 mb-4">Atur tautan untuk tombol Instagram dan TikTok di bagian galeri.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Instagram URL</label>
                    <input
                      type="url"
                      value={content.social_links?.instagram || ''}
                      onChange={(e) => setContent({ ...content, social_links: { ...(content.social_links || {}), instagram: e.target.value } })}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">TikTok URL</label>
                    <input
                      type="url"
                      value={content.social_links?.tiktok || ''}
                      onChange={(e) => setContent({ ...content, social_links: { ...(content.social_links || {}), tiktok: e.target.value } })}
                      placeholder="https://tiktok.com/..."
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">Pengaturan Tentang Kami</h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">Atur judul dan deskripsi pada bagian Tentang Kami.</p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Judul (Baris 1)</label>
                  <input
                    type="text"
                    value={content.about_title_1 || 'Belajar, Berkembang, Bertumbuh Bersama'}
                    onChange={(e) => setContent({ ...content, about_title_1: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Judul (Baris 2 / Highlight)</label>
                  <input
                    type="text"
                    value={content.about_title_2 || 'Alberta'}
                    onChange={(e) => setContent({ ...content, about_title_2: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Deskripsi Paragraf 1</label>
                  <textarea
                    value={content.about_desc_1 || 'Bimbel Alberta Bondowoso merupakan lembaga bimbingan belajar yang berlokasi di pusat Kota Bondowoso. Berdiri sejak Juli 2025, Alberta hadir sebagai tempat belajar yang mendampingi peserta didik mulai dari jenjang TK, SD, hingga SMP.'}
                    onChange={(e) => setContent({ ...content, about_desc_1: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Deskripsi Paragraf 2</label>
                  <textarea
                    value={content.about_desc_2 || 'Alberta berkomitmen menciptakan lingkungan belajar yang nyaman, menyenangkan, dan mendukung setiap anak untuk memahami materi pelajaran, mengembangkan potensi, serta membangun kepercayaan diri dalam belajar.'}
                    onChange={(e) => setContent({ ...content, about_desc_2: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all resize-none"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">Visi & Misi</h4>
                  <p className="text-xs text-slate-500 mb-4">Atur visi dan 5 poin misi bimbingan belajar.</p>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Visi Kami</label>
                  <textarea
                    value={content.visi_text || 'Menjadi lembaga bimbingan belajar yang terpercaya dalam mendampingi peserta didik meraih prestasi akademik sekaligus mengembangkan karakter yang positif.'}
                    onChange={(e) => setContent({ ...content, visi_text: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all resize-none"
                  />
                </div>
                
                <div className="space-y-3 pt-3">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Misi Kami (5 Poin)</label>
                  {[0, 1, 2, 3, 4].map((idx) => {
                    const defaultMisi = [
                      "Menyediakan pembelajaran yang efektif, menyenangkan, dan mudah dipahami.",
                      "Membimbing peserta didik sesuai dengan kebutuhan dan kemampuan masing-masing.",
                      "Menumbuhkan semangat belajar, rasa percaya diri, dan kemandirian.",
                      "Membangun komunikasi yang baik antara tutor, peserta didik, dan orang tua.",
                      "Menciptakan lingkungan belajar yang aman, nyaman, dan inspiratif."
                    ];
                    return (
                      <div key={idx} className="flex gap-3 items-start">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0 mt-1">{idx + 1}</span>
                        <input
                          type="text"
                          value={content.misi_list && content.misi_list[idx] ? content.misi_list[idx] : defaultMisi[idx]}
                          onChange={(e) => {
                            const newList = content.misi_list ? [...content.misi_list] : [...defaultMisi];
                            newList[idx] = e.target.value;
                            setContent({ ...content, misi_list: newList });
                          }}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">Pengaturan FAQ</h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">Atur teks utama pada bagian Pertanyaan yang Sering Diajukan.</p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Judul FAQ</label>
                  <input
                    type="text"
                    value={content.faq_title || 'Pertanyaan yang Sering Diajukan'}
                    onChange={(e) => setContent({ ...content, faq_title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Deskripsi Singkat FAQ</label>
                  <textarea
                    value={content.faq_desc || 'Temukan jawaban lengkap mengenai pendaftaran, program TK, SD & SMP, serta sistem laporan kami.'}
                    onChange={(e) => setContent({ ...content, faq_desc: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all resize-none"
                  />
                </div>
              </div>

              <div className="space-y-6">
                {(content.faqs || [
                  { id: 'faq-1', category: 'Umum', question: 'Di mana lokasi Bimbel Alberta?', answer: 'Bimbel Alberta berlokasi di Jl. PB Sudirman No. 45, Blindungan, Bondowoso. Lokasinya sangat strategis dan mudah diakses dari pusat kota.' },
                  { id: 'faq-2', category: 'Pendaftaran', question: 'Bagaimana cara mendaftar di Bimbel Alberta?', answer: 'Pendaftaran dapat dilakukan dengan mengisi form pendaftaran di website ini yang akan terhubung ke WhatsApp Admin kami, atau datang langsung ke kantor kami.' },
                  { id: 'faq-3', category: 'Program SD', question: 'Mata pelajaran apa saja yang diajarkan untuk tingkat SD?', answer: 'Fokus utama kami adalah Matematika, Ilmu Pengetahuan Alam (IPA), dan Bahasa Inggris untuk jenjang SD. Kami juga ada persiapan khusus OSN.' },
                  { id: 'faq-4', category: 'Laporan Belajar', question: 'Bagaimana orang tua bisa memantau perkembangan anak?', answer: 'Setiap orang tua akan diberikan akses ke Portal Albertian. Di sana, orang tua dapat melihat laporan bulanan dari tentor yang berisi nilai, tingkat pemahaman, serta catatan khusus.' }
                ]).map((item: any, idx: number) => (
                  <div key={item.id} className="bg-slate-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 space-y-4 relative">
                    <button 
                      onClick={() => {
                        const newFaqs = content.faqs ? [...content.faqs] : [];
                        newFaqs.splice(idx, 1);
                        setContent({ ...content, faqs: newFaqs });
                      }}
                      className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                      title="Hapus Item"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">{idx + 1}</span>
                      <h4 className="font-bold text-slate-900">FAQ {idx + 1}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Pertanyaan</label>
                        <input
                          type="text"
                          value={item.question || ''}
                          onChange={(e) => {
                            const newFaqs = content.faqs ? [...content.faqs] : [];
                            if (newFaqs[idx]) {
                                newFaqs[idx].question = e.target.value;
                                setContent({ ...content, faqs: newFaqs });
                            }
                          }}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Kategori</label>
                        <input
                          type="text"
                          value={item.category || ''}
                          onChange={(e) => {
                            const newFaqs = content.faqs ? [...content.faqs] : [];
                            if (newFaqs[idx]) {
                                newFaqs[idx].category = e.target.value;
                                setContent({ ...content, faqs: newFaqs });
                            }
                          }}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Jawaban</label>
                      <textarea
                        value={item.answer || ''}
                        onChange={(e) => {
                          const newFaqs = content.faqs ? [...content.faqs] : [];
                          if (newFaqs[idx]) {
                              newFaqs[idx].answer = e.target.value;
                              setContent({ ...content, faqs: newFaqs });
                          }
                        }}
                        rows={3}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl text-sm transition-all resize-none"
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    const defaultFaqs = [
                      { id: 'faq-1', category: 'Umum', question: 'Di mana lokasi Bimbel Alberta?', answer: 'Bimbel Alberta berlokasi di Jl. PB Sudirman No. 45, Blindungan, Bondowoso. Lokasinya sangat strategis dan mudah diakses dari pusat kota.' },
                      { id: 'faq-2', category: 'Pendaftaran', question: 'Bagaimana cara mendaftar di Bimbel Alberta?', answer: 'Pendaftaran dapat dilakukan dengan mengisi form pendaftaran di website ini yang akan terhubung ke WhatsApp Admin kami, atau datang langsung ke kantor kami.' },
                      { id: 'faq-3', category: 'Program SD', question: 'Mata pelajaran apa saja yang diajarkan untuk tingkat SD?', answer: 'Fokus utama kami adalah Matematika, Ilmu Pengetahuan Alam (IPA), dan Bahasa Inggris untuk jenjang SD. Kami juga ada persiapan khusus OSN.' },
                      { id: 'faq-4', category: 'Laporan Belajar', question: 'Bagaimana orang tua bisa memantau perkembangan anak?', answer: 'Setiap orang tua akan diberikan akses ke Portal Albertian. Di sana, orang tua dapat melihat laporan bulanan dari tentor yang berisi nilai, tingkat pemahaman, serta catatan khusus.' }
                    ];
                    const currentFaqs = content.faqs || defaultFaqs;
                    const newFaqs = [...currentFaqs, {
                      id: `faq-${Date.now()}`,
                      category: 'Umum',
                      question: 'Pertanyaan Baru?',
                      answer: 'Jawaban untuk pertanyaan baru.'
                    }];
                    setContent({ ...content, faqs: newFaqs });
                  }}
                  className="w-full py-3 sm:py-4 border-2 border-dashed border-slate-200 text-slate-500 hover:text-purple-600 hover:bg-purple-50 hover:border-purple-300 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  Tambah FAQ
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
