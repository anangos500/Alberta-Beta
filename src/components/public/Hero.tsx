import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const slides = [
  {
    image: "",
    title: "Raih Prestasi Gemilang Bersama Bimbel Alberta",
    description:
      "Program bimbingan belajar intensif untuk TK, SD, dan SMP di Bondowoso. Dilengkapi dengan laporan mingguan ke orang tua, pengajar profesional, dan kelas interaktif maksimal 6 siswa per sesi.",
    buttonText: "Daftar Sekarang",
    primary: true,
  },
  {
    image: "",
    title: "Fasilitas Belajar Modern dan Nyaman",
    description:
      "Nikmati suasana belajar yang kondusif dengan fasilitas lengkap, ruang kelas ber-AC, dan media pembelajaran interaktif untuk mendukung pemahaman materi.",
    buttonText: "Lihat Fasilitas",
    primary: false,
  },
  {
    image: "",
    title: "Tutor Berpengalaman dan Profesional",
    description:
      "Dibimbing langsung oleh pengajar yang ahli di bidangnya, sabar, dan menggunakan metode pendekatan personal agar setiap siswa dapat berkembang maksimal.",
    buttonText: "Kenali Tutor Kami",
    primary: false,
  },
];

export const Hero: React.FC = () => {
  const { setIsRegisterModalOpen, publicContent } = useApp();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const displaySlides =
    publicContent?.hero_slides && publicContent.hero_slides.length > 0
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
      navigate("/program");
    }
  };

  const activeSlide =
    displaySlides[currentSlide] || displaySlides[0];

  return (
    <section
      id="home"
      className="relative h-[85vh] sm:h-[85vh] min-h-[550px] sm:min-h-[600px] flex items-center overflow-hidden bg-black"
    >
      {/* Background */}
      {displaySlides.map((slide: any, index: number) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide
              ? "opacity-100 z-10"
              : "opacity-0 z-0"
          }`}
        >
          {slide.image ? (
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 to-purple-900" />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Tinggi area konten */}
        <div className="max-w-2xl h-[430px] sm:h-[460px] flex flex-col justify-between">

          {/* ================= TEXT ================= */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              {activeSlide?.title
                ?.split("Alberta")
                .map((part: string, i: number, arr: string[]) => (
                  <React.Fragment key={i}>
                    {part}
                    {i !== arr.length - 1 && (
                      <span className="text-white">Alberta</span>
                    )}
                  </React.Fragment>
                ))}
            </h1>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl">
              {activeSlide?.description}
            </p>
          </div>

          {/* ================= BUTTON ================= */}
          <div>

            {/* Desktop */}
            <button
              onClick={() => handleCtaClick(activeSlide?.primary)}
              className="hidden sm:inline-flex items-center justify-center bg-white text-black px-8 py-3.5 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              {activeSlide?.buttonText || "Daftar Sekarang"}
            </button>

            {/* Mobile */}
            <div className="sm:hidden flex gap-3">
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="flex-1 bg-white text-black py-3 rounded-full font-semibold"
              >
                Daftar Sekarang
              </button>

              <button
                onClick={() => navigate("/login")}
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white py-3 rounded-full font-semibold"
              >
                Masuk
              </button>
            </div>

            {/* Indicator */}
            <div className="mt-8 flex gap-2">
              {displaySlides.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`relative h-1 overflow-hidden rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-12 bg-white/30"
                      : "w-8 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {index === currentSlide && (
                    <div className="absolute inset-y-0 left-0 bg-white animate-progress" />
                  )}
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
