import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const slides = [
  {
    image: "",
    title: "Raih Prestasi Gemilang Bersama Bimbel Alberta",
    description: "Program bimbingan belajar intensif untuk TK, SD, dan SMP di Bondowoso. Dilengkapi dengan laporan mingguan ke orang tua, pengajar profesional, dan kelas interaktif maksimal 6 siswa per sesi.",
    buttonText: "Daftar Sekarang",
    primary: true
  },
  {
    image: "",
    title: "Fasilitas Belajar Modern dan Nyaman",
    description: "Nikmati suasana belajar yang kondusif dengan fasilitas lengkap, ruang kelas ber-AC, dan media pembelajaran interaktif untuk mendukung pemahaman materi.",
    buttonText: "Lihat Fasilitas",
    primary: false
  },
  {
    image: "",
    title: "Tutor Berpengalaman dan Profesional",
    description: "Dibimbing langsung oleh pengajar yang ahli di bidangnya, sabar, dan menggunakan metode pendekatan personal agar setiap siswa dapat berkembang maksimal.",
    buttonText: "Kenali Tutor Kami",
    primary: false
  }
];

export const Hero: React.FC = () => {
  const { setIsRegisterModalOpen, publicContent } = useApp();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const displaySlides = publicContent?.hero_slides && publicContent.hero_slides.length > 0 
    ? publicContent.hero_slides 
    : slides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displaySlides.length]);

  const handleCtaClick = (isPrimary: boolean) => {
    if (isPrimary) {
      setIsRegisterModalOpen(true);
    } else {
      navigate('/program');
    }
  };

  // Safe fallback if currentSlide goes out of bounds when displaySlides updates
  const activeSlide = displaySlides[currentSlide] || displaySlides[0];

  return (
    <section id="home" className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden bg-black">
      {/* Background Slides */}
      {displaySlides.map((slide: any, index: number) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {slide.image ? (
            <img src={slide.image || undefined} alt={slide.title} className="w-full h-full object-cover object-center" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 to-purple-900"></div>
          )}
          {/* Dark Gradient Overlay for readability, matching the moody vibe */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
        </div>
      ))}

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 transition-all duration-700 transform translate-y-0 opacity-100">
            {activeSlide?.title?.split('Alberta').map((part: string, i: number, arr: string[]) => (
              <React.Fragment key={i}>
                {part}
                {i !== arr.length - 1 && <span className="text-white">Alberta</span>}
              </React.Fragment>
            ))}
          </h1>
          
          <p className="text-base sm:text-lg text-gray-300 mb-10 transition-all duration-700 delay-100 transform translate-y-0 opacity-100 leading-relaxed font-light">
            {activeSlide?.description}
          </p>
          <div className="mt-6 sm:mt-10">
            {/* Desktop Button */}
            <button
              onClick={() => handleCtaClick(activeSlide?.primary)}
              className="hidden sm:inline-block bg-white text-black px-8 py-3.5 rounded-full font-semibold text-base hover:bg-gray-100 transition-colors shadow-lg cursor-pointer"
            >
              {activeSlide?.buttonText || 'Daftar Sekarang'}
            </button>
            {/* Mobile Button */}
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="sm:hidden inline-block bg-white text-black px-6 py-3 rounded-full font-semibold text-base hover:bg-gray-100 transition-colors shadow-lg cursor-pointer"
            >
              Daftar Sekarang
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="mt-16 sm:mt-24 flex gap-2">
          {displaySlides.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative h-1 transition-all duration-300 cursor-pointer overflow-hidden rounded-full ${
                index === currentSlide ? 'w-12 bg-white/30' : 'w-8 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentSlide && (
                <div className="absolute top-0 left-0 h-full bg-white animate-progress" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
