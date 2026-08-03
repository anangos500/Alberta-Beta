import React from 'react';
import { Award, Heart, CheckCircle, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FeaturesSection: React.FC = () => {
  const { publicContent } = useApp();
  const featuresImages = publicContent?.features_images || ["", "", "", ""];
  const features = [
    {
      icon: <Award className="w-5 h-5 text-purple-600" />,
      title: "Laporan Perkembangan Mingguan",
      desc: "7 Poin penilaian mendalam dapat diakses kapan saja oleh Orang Tua via Portal Albertian.",
      bg: "bg-purple-100"
    },
    {
      icon: <Heart className="w-5 h-5 text-pink-600" />,
      title: "Tentor Ramah & Berpengalaman",
      desc: "Pengajar sabar, menguasai metode pembelajaran ramah anak SD dan komunikatif untuk remaja SMP.",
      bg: "bg-pink-100"
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-purple-600" />,
      title: "Kelompok Belajar Eksklusif",
      desc: "Maksimal 5-6 Siswa agar tentor dapat memberikan perhatian personal dan mendampingi PR secara optimal.",
      bg: "bg-purple-100"
    },
    {
      icon: <MapPin className="w-5 h-5 text-pink-600" />,
      title: "Fasilitas Nyaman di Pusat Kota",
      desc: "Ruang kelas ber-AC, papan tulis interaktif, meja belajar ergonomic, serta lingkungan aman.",
      bg: "bg-pink-100"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Column: Image Collage */}
          <div className="hidden lg:block bg-purple-50 rounded-[3rem] p-6 sm:p-10 shadow-sm border border-purple-100/50 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                {featuresImages[0] ? (
                  <img src={featuresImages[0] || undefined} alt="Classroom" className="w-full h-32 sm:h-48 object-cover rounded-[1.5rem] shadow-sm border-4 border-white bg-slate-100" />
                ) : (
                  <div className="w-full h-32 sm:h-48 rounded-[1.5rem] shadow-sm border-4 border-white bg-slate-100 animate-pulse"></div>
                )}
                {featuresImages[1] ? (
                  <img src={featuresImages[1] || undefined} alt="Library" className="w-full h-40 sm:h-64 object-cover rounded-[1.5rem] shadow-sm border-4 border-white bg-slate-100" />
                ) : (
                  <div className="w-full h-40 sm:h-64 rounded-[1.5rem] shadow-sm border-4 border-white bg-slate-100 animate-pulse"></div>
                )}
              </div>
              <div className="flex flex-col gap-4 pt-8">
                {featuresImages[2] ? (
                  <img src={featuresImages[2] || undefined} alt="Students studying" className="w-full h-36 sm:h-56 object-cover rounded-[1.5rem] shadow-sm border-4 border-white bg-slate-100" />
                ) : (
                  <div className="w-full h-36 sm:h-56 rounded-[1.5rem] shadow-sm border-4 border-white bg-slate-100 animate-pulse"></div>
                )}
                {featuresImages[3] ? (
                  <img src={featuresImages[3] || undefined} alt="Learning" className="w-full h-32 sm:h-48 object-cover rounded-[1.5rem] shadow-sm border-4 border-white bg-slate-100" />
                ) : (
                  <div className="w-full h-32 sm:h-48 rounded-[1.5rem] shadow-sm border-4 border-white bg-slate-100 animate-pulse"></div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Text & Features */}
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                Keunggulan Dari <span className="text-purple-600">Bimbel Alberta</span>
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-lg text-justify hyphens-auto">
                Tumbuh menjadi pembelajar mandiri yang memahami konsep dasar dengan percaya diri dan gembira bersama Bimbel Alberta di Bondowoso.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex flex-col lg:flex-row gap-2.5 sm:gap-3 lg:gap-6 group items-start text-left bg-slate-50 lg:bg-transparent p-3 sm:p-4 lg:p-0 rounded-2xl lg:rounded-none border border-slate-100 lg:border-none h-full">
                  <div className="shrink-0">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center ${feature.bg} transition-transform group-hover:scale-110`}>
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex flex-col justify-start">
                    <h3 className="text-[13px] sm:text-sm lg:text-xl font-bold text-slate-900 mb-1 lg:mb-2 leading-snug">{feature.title}</h3>
                    <p className="text-[11px] sm:text-xs lg:text-base text-slate-600 leading-relaxed text-left lg:text-justify hyphens-auto">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
