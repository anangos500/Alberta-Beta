import React, { useState, useEffect } from 'react';
import { Camera, Instagram, Video, ExternalLink, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GallerySection: React.FC = () => {
  const { publicContent } = useApp();
  
  const defaultGalleryItems = [
    {
      title: 'Suasana Belajar Kelompok',
      caption: 'Pendampingan matematika interaktif di kelas AC Bimbel Alberta.',
      image: '',
      tag: 'Kegiatan SD'
    },
    {
      title: 'Eksperimen Sains Seru',
      caption: 'Siswa mempelajari konsep sains secara visual dan praktikal.',
      image: '',
      tag: 'Kegiatan SMP'
    },
    {
      title: 'Diskusi Pemecahan Soal',
      caption: 'Tentor membimbing penyelesaian soal dengan pendekatan menyenangkan.',
      image: '',
      tag: 'Diskusi Interaktif'
    },
    {
      title: 'Fasilitas Nyaman',
      caption: 'Ruang belajar ber-AC dengan penerangan optimal untuk fokus maksimal.',
      image: '',
      tag: 'Fasilitas'
    }
  ];

  const galleryItems = publicContent?.gallery_items && publicContent.gallery_items.length > 0 
    ? publicContent.gallery_items 
    : defaultGalleryItems;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [galleryItems.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  return (
    <section id="galeri" className="py-12 lg:py-16 bg-white overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 rounded-l-[100px] -z-10"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 lg:items-center">

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
          </div>
          
          {/* Left: Image Slider */}
          <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-2xl bg-slate-100 group w-full">
            {galleryItems.map((item, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <img 
                  src={item.image || undefined} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-3 py-1 bg-purple-600/90 backdrop-blur-sm text-xs font-bold rounded-lg mb-3">
                    {item.tag}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/80 text-sm line-clamp-2">{item.caption}</p>
                </div>
              </div>
            ))}

            {/* Slider Controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20">
              <button 
                onClick={prevSlide}
                className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20">
              <button 
                onClick={nextSlide}
                className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Pagination Indicators */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              {galleryItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right: Static Description */}
          <div className="space-y-6 w-full">
            <div className="hidden lg:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
              <Camera className="w-4 h-4" />
              <span>Dokumentasi Kegiatan</span>
            </div>
            
            <h2 className="hidden lg:block text-4xl font-extrabold text-slate-900 leading-tight">
              Keseruan Belajar Bersama <br/>
              <span className="text-purple-600">Bimbel Alberta</span>
            </h2>
            
            <p className="text-slate-600 text-base lg:text-lg leading-relaxed text-justify hyphens-auto">
              Kami percaya bahwa lingkungan belajar yang menyenangkan adalah kunci utama untuk menyerap ilmu dengan baik. Di Bimbel Alberta, setiap sesi dirancang interaktif agar siswa tidak hanya menghafal, tetapi benar-benar memahami konsep.
            </p>

            <ul className="space-y-4 mt-6">
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-green-100 text-green-600 p-1.5 rounded-full shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Fasilitas Modern & Nyaman</h4>
                  <p className="text-slate-500 text-sm mt-0.5">Ruang ber-AC yang kondusif mendukung fokus siswa.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-green-100 text-green-600 p-1.5 rounded-full shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Pendampingan Intensif</h4>
                  <p className="text-slate-500 text-sm mt-0.5">Tentor selalu siap membantu siswa yang kesulitan.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-green-100 text-green-600 p-1.5 rounded-full shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Metode Interaktif</h4>
                  <p className="text-slate-500 text-sm mt-0.5">Belajar tidak lagi membosankan dengan diskusi dua arah.</p>
                </div>
              </li>
            </ul>

            <div className="pt-6 flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 font-bold text-sm transition-colors border border-pink-200">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors">
                <Video className="w-4 h-4" /> TikTok
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

