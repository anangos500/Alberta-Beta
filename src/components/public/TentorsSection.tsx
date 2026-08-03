import React, { useState } from 'react';
import { UserCheck, GraduationCap, BookOpen, CheckCircle, Plus, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLocation, Link } from 'react-router-dom';

export const TentorsSection: React.FC = () => {
  const { tentors, publicContent } = useApp();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [activeIndex, setActiveIndex] = useState(0);
  
  const fallbackTentors = [
    {
      id: 'mock-1',
      nama: 'Kak Sarah',
      foto: '',
      lulusan: 'Universitas Jember',
      gelar: 'S.Pd.',
      spesialisasi: 'Matematika & IPA (TK, SD & SMP)',
    },
    {
      id: 'mock-2',
      nama: 'Kak Bima',
      foto: '',
      lulusan: 'Universitas Brawijaya',
      gelar: 'S.T.',
      spesialisasi: 'Fisika & Matematika Lanjut (SMP)',
    },
    {
      id: 'mock-3',
      nama: 'Kak Nisa',
      foto: '',
      lulusan: 'Universitas Negeri Malang',
      gelar: 'S.Pd.',
      spesialisasi: 'Calistung TK, Tematik SD & Bahasa Inggris',
    },
  ];

  let displayTentors = tentors;

  if (isHomePage) {
    if (publicContent?.featured_tentors && publicContent.featured_tentors.length > 0) {
      displayTentors = tentors.filter((t: any) => publicContent.featured_tentors.includes(t.id));
    } else if (tentors.length > 3) {
      displayTentors = tentors.slice(0, 3);
    }
  }

  if (displayTentors.length === 0) {
    displayTentors = fallbackTentors;
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % displayTentors.length);
  };

  return (
    <section id="tentor" className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {isHomePage ? (
          <div className="flex flex-col gap-12 lg:gap-16">
            {/* Top side: Text */}
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 relative">
              <div className="text-center md:text-left max-w-3xl space-y-4">
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Pengajar <span className="text-purple-600 md:block mt-2">Sabar & Spesialis</span>
                </h2>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto md:mx-0 text-justify md:text-left">
                  Seluruh tentor Bimbel Alberta merupakan lulusan terbaik yang memiliki minat tinggi dalam membimbing anak-anak untuk mencapai prestasi maksimal.
                </p>
              </div>
              <div className="hidden md:block shrink-0 pt-4 md:pt-0">
                <Link
                  to="/tentor"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all shadow-xl shadow-purple-500/30 group"
                >
                  Lihat Semua Tentor
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Bottom side: 3 Cards Display */}
            <div className="relative w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative">
                {[0, 1, 2].map((offset) => {
                  const tentorIndex = (activeIndex + offset) % displayTentors.length;
                  const tentor = displayTentors[tentorIndex];
                  
                  if (!tentor) return null;

                  return (
                    <div
                      key={`${tentor.id}-${offset}`}
                      className={`bg-white rounded-[2rem] border border-slate-100 p-4 shadow-xl hover:-translate-y-2 transition-all space-y-4 flex flex-col justify-between ${offset === 1 ? 'hidden sm:flex' : 'flex'} ${offset === 2 ? 'hidden lg:flex' : ''}`}
                    >
                      <div className="space-y-4">
                        {/* Photo & Badge */}
                        <div className="relative">
                          <img
                            src={tentor.foto || undefined}
                            alt={tentor.nama}
                            className="w-full h-56 object-cover object-top rounded-[1.5rem]"
                          />
                          <div className="absolute bottom-3 left-3 bg-white/95 text-purple-700 text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1 shadow-sm">
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>{tentor.lulusan}</span>
                          </div>
                        </div>

                        {/* Name & Title */}
                        <div className="px-2">
                          <h3 className="text-xl font-extrabold text-slate-900 line-clamp-1">
                            {tentor.nama}
                          </h3>
                          <p className="text-sm font-bold text-pink-500 mt-1 line-clamp-1">
                            {tentor.gelar}
                          </p>
                        </div>

                        {/* Specialization */}
                        <div className="mx-2 bg-purple-50 p-3 rounded-xl border border-purple-100 text-xs text-slate-700 space-y-1">
                          <div className="font-bold text-purple-900 flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-purple-500" />
                            Bidang:
                          </div>
                          <p className="font-semibold text-slate-800 line-clamp-2">{tentor.spesialisasi}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button 
                  onClick={handleNext}
                  className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-2xl shadow-purple-900/20 rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-colors z-10 border border-slate-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Mobile button below cards */}
            <div className="flex justify-center md:hidden -mt-4">
              <Link
                to="/tentor"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all shadow-xl shadow-purple-500/30 group"
              >
                Lihat Semua Tentor
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Header for /tentor */}
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                Pengajar <span className="text-purple-600">Sabar & Spesialis</span>
              </h2>
              <p className="text-slate-600 text-base sm:text-lg">
                Seluruh tentor Bimbel Alberta merupakan lulusan terbaik yang memiliki minat tinggi dalam membimbing anak-anak.
              </p>
            </div>

            {/* Tentors Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayTentors.map((tentor: any) => (
                <div
                  key={tentor.id}
                  className="bg-white rounded-[2rem] border border-slate-100 p-4 shadow-xl hover:-translate-y-2 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Photo & Badge */}
                    <div className="relative">
                      <img
                        src={tentor.foto || undefined}
                        alt={tentor.nama}
                        className="w-full h-64 object-cover object-top rounded-[1.5rem]"
                      />
                      <div className="absolute bottom-3 left-3 bg-white/90 text-purple-700 text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1 shadow-sm">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>{tentor.lulusan}</span>
                      </div>
                    </div>

                    {/* Name & Title */}
                    <div className="px-2">
                      <h3 className="text-xl font-extrabold text-slate-900">
                        {tentor.nama}
                      </h3>
                      <p className="text-xs font-bold text-pink-500 mt-1">
                        {tentor.gelar}
                      </p>
                    </div>

                    {/* Specialization */}
                    <div className="mx-2 bg-purple-50 p-3 rounded-xl border border-purple-100 text-xs text-slate-700 space-y-1">
                      <div className="font-bold text-purple-900 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-purple-500" />
                        Bidang Mengajar:
                      </div>
                      <p className="font-semibold text-slate-800">{tentor.spesialisasi}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Etech style "Become Instructor" Banner */}
        {publicContent?.show_become_tentor !== false && (
          <div className="mt-16 lg:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-purple-50 rounded-[3rem] p-6 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl -z-10" />
            
            {/* Left Text */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                Punya Passion Mengajar? <br/>
                <span className="text-purple-600">Jadilah Tentor Kami</span>
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Buka peluang untuk menginspirasi dan mendidik generasi muda dengan bergabung bersama tim pengajar kami. Tingkatkan karirmu dan buat dampak positif.
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900">Nikmati Banyak Keuntungan</h4>
                <div className="grid grid-cols-2 gap-3 text-sm text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-500" />
                    Dampak Positif
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-500" />
                    Kebebasan Berkreasi
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-500" />
                    Jadwal Fleksibel
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-500" />
                    Relasi Profesional
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30 transition-all cursor-pointer">
                  Daftar Jadi Tentor
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="absolute inset-0 border-2 border-dashed border-purple-300 rounded-[2rem] -rotate-3 scale-105 -z-10" />
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
                alt="Instruktur"
                className="w-full h-[400px] object-cover rounded-[2rem] shadow-xl"
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

