import React, { useRef, useEffect } from 'react';
import { Star } from 'lucide-react';

export const TestimonialSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const intervalId = setInterval(() => {
      // Only auto-scroll on mobile
      if (window.innerWidth >= 640) return;
      
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 20) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: window.innerWidth * 0.85, behavior: 'smooth' });
      }
    }, 3500);

    return () => clearInterval(intervalId);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: 'Ibu Ratna Dewi',
      role: 'Orang Tua Kevin (Kelas 5 SD)',
      text: 'Mendaftarkan Kevin di Bimbel Alberta adalah keputusan terbaik. Perkembangannya sangat pesat dan laporan mingguan di portal sangat membantu memantau hasil belajar.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    },
    {
      id: 2,
      name: 'Ananda Clarissa',
      role: 'Siswa Kelas 8 SMP',
      text: 'Kak Rizky mengajar Fisika dengan sangat asyik! Aku yang awalnya benci hitungan sekarang jadi paham dan berani maju ke depan kelas.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    },
    {
      id: 3,
      name: 'Bapak Hendra',
      role: 'Orang Tua Daffa (Kelas 4 SD)',
      text: 'Fasilitas di sini sangat nyaman dan bersih. Maksimal 6 anak per kelas membuat Daffa lebih fokus dan tidak malu bertanya ke tentor.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Testimoni Siswa & Orang Tua
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Dengarkan apa kata mereka tentang pengalaman belajar dan berkembang bersama Bimbel Alberta.
          </p>
        </div>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 gap-6 snap-x snap-mandatory hide-scrollbar scroll-smooth"
        >
          {testimonials.map((t) => (
            <div key={t.id} className="w-[80vw] sm:w-[320px] sm:min-w-0 bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 snap-center shrink-0">
              <div className="space-y-6">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 italic">"{t.text}"</p>
              </div>
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-100">
                <img src={t.avatar || undefined} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-purple-100" />
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-xs text-purple-600 font-semibold">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
