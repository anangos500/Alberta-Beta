import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Check, Calendar, Clock, DollarSign, Send, Sparkles, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProgramInfo } from '../../types';

const PROGRAMS: ProgramInfo[] = [
  {
    id: 'prog-tk',
    nama: 'Bimbel Reguler TK',
    jenjang: 'TK',
    deskripsi: 'Program belajar membaca, menulis, dan berhitung dasar dengan metode menyenangkan.',
    mapel: ['Calistung (Membaca, Menulis, Berhitung)'],
    fasilitas: ['Maksimal 6 anak per kelas', 'Ruangan Ber-AC & Nyaman', 'Modul Belajar Menarik', 'Laporan Mingguan via Portal'],
    hargaEstimate: 'Rp 200.000 / bln',
    jadwal: 'Senin - Kamis (14:00 - 15:30)',
    badge: 'Baru'
  },
  {
    id: 'prog-sd',
    nama: 'Bimbel Reguler SD (Kelas 1-6)',
    jenjang: 'SD',
    deskripsi: 'Program bimbingan belajar komprehensif untuk siswa SD yang berfokus pada pemahaman konsep dasar.',
    mapel: ['Matematika', 'Ilmu Pengetahuan Alam (IPA)', 'Bahasa Inggris', 'Persiapan Ujian Sekolah'],
    fasilitas: ['Maksimal 6 anak per kelas', 'Ruangan Ber-AC & Nyaman', 'Modul Belajar Eksklusif', 'Laporan Mingguan via Portal'],
    hargaEstimate: 'Rp 250.000 / bln',
    jadwal: 'Senin - Kamis (15:00 - 16:30)',
    badge: 'Terpopuler'
  },
  {
    id: 'prog-smp',
    nama: 'Bimbel Reguler SMP (Kelas 7-9)',
    jenjang: 'SMP',
    deskripsi: 'Program bimbingan belajar intensif untuk persiapan Ujian Nasional dan pemantapan konsep menengah.',
    mapel: ['Matematika', 'Fisika', 'Biologi', 'Bahasa Inggris'],
    fasilitas: ['Maksimal 6 anak per kelas', 'Ruangan Ber-AC & Nyaman', 'Bank Soal & Try Out', 'Laporan Mingguan via Portal'],
    hargaEstimate: 'Rp 300.000 / bln',
    jadwal: 'Selasa - Jumat (16:30 - 18:00)',
    badge: 'Intensif'
  }
];

export const ProgramsSection: React.FC = () => {
  const { setIsRegisterModalOpen, publicContent } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const intervalId = setInterval(() => {
      // Only auto-scroll on mobile
      if (window.innerWidth >= 768) return;
      
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 20) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: window.innerWidth * 0.85, behavior: 'smooth' });
      }
    }, 3500);

    return () => clearInterval(intervalId);
  }, []);
  const [selectedProgram, setSelectedProgram] = useState<ProgramInfo | null>(null);

  const getProgramImage = (jenjang: string) => {
    switch (jenjang) {
      case 'TK':
        return "";
      case 'SD':
        return "";
      case 'SMP':
        return "";
      default:
        return "";
    }
  };

  const programSettings = publicContent?.programs || [];
  
  const displayPrograms = PROGRAMS.map(prog => {
    const setting = programSettings.find((s: any) => s.jenjang === prog.jenjang);
    return {
      ...prog,
      deskripsi: setting?.deskripsi || prog.deskripsi,
      image: setting?.image || ""
    };
  });

  return (
    <section id="program" className="py-16 lg:py-24 bg-white relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Program Alberta
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Temukan program bimbingan belajar yang paling diminati, dirancang khusus untuk kesuksesan siswa TK, SD, & SMP di Bondowoso.
          </p>
        </div>

        {/* Programs Grid */}
        <div 
          ref={scrollRef}
          className="mt-10 lg:mt-16 flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 snap-x snap-mandatory hide-scrollbar justify-start md:justify-center scroll-smooth"
        >
          {displayPrograms.map((prog) => (
            <div
              key={prog.id}
              className="w-[80vw] sm:w-[320px] md:w-auto md:min-w-0 bg-white rounded-[2rem] p-4 flex flex-col shadow-xl md:shadow-2xl hover:-translate-y-2 transition-transform duration-300 snap-center shrink-0"
            >
              {/* Card Image Thumbnail */}
              <div className="relative h-40 sm:h-48 w-full rounded-[1.5rem] overflow-hidden mb-4 bg-slate-100 shrink-0">
                {prog.image ? (
                  <img src={prog.image || undefined} alt={prog.nama} className="w-full h-full object-cover bg-slate-100" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <BookOpen className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg font-bold text-purple-600 text-xs shadow-sm">
                  {prog.jenjang}
                </div>
              </div>

              <div className="px-2 space-y-3 flex-1 flex flex-col">
                {/* Title */}
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight line-clamp-2">
                  {prog.nama}
                </h3>
                
                {/* Deskripsi Singkat */}
                <p className="text-sm text-slate-600 flex-1">
                  {prog.deskripsi}
                </p>
                
                {/* Button Lihat Selengkapnya */}
                <button
                  onClick={() => setSelectedProgram(prog)}
                  className="w-full mt-4 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold py-2.5 rounded-xl transition-colors text-sm"
                >
                  Lihat Selengkapnya
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProgram(null)}
          />
          <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold mb-3">
                    Program {selectedProgram.jenjang}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {selectedProgram.nama}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedProgram(null)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                  {selectedProgram.deskripsi}
                </p>
                
                <div>
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-500" />
                    Mata Pelajaran
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProgram.mapel.map((m, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-600 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Fasilitas & Keunggulan
                  </h4>
                  <ul className="space-y-2">
                    {selectedProgram.fasilitas.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-600 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-1">
                      <Clock className="w-4 h-4" />
                      JADWAL
                    </div>
                    <div className="font-semibold text-slate-900 text-sm">
                      {selectedProgram.jadwal}
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                    <div className="flex items-center gap-2 text-purple-500 text-xs font-bold mb-1">
                      <DollarSign className="w-4 h-4" />
                      BIAYA
                    </div>
                    <div className="font-bold text-purple-700 text-base sm:text-lg">
                      {selectedProgram.hargaEstimate}
                    </div>
                  </div>
                </div>

              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedProgram(null);
                    setIsRegisterModalOpen(true);
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Daftar Program Ini
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
