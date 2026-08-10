import React from 'react';
import { useApp } from '../../context/AppContext';
import { Target, Compass, BookOpen, TrendingUp, Rocket, Sparkles, GraduationCap } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { publicContent } = useApp();
  const featuresImages = publicContent?.features_images || ["", "", "", ""];

  return (
    <section id="tentang" className="pt-12 pb-24 sm:pt-16 sm:pb-32 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        
        {/* Section 1: Siapa Kami */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h4 className="text-purple-600 font-semibold tracking-wider uppercase text-sm mb-3">Tentang Kami</h4>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                {publicContent?.about_title_1 || 'Belajar, Berkembang, Bertumbuh Bersama'} <span className="text-purple-600">{publicContent?.about_title_2 || 'Alberta'}</span>
              </h2>
            </div>
            <div className="prose prose-lg text-slate-600 leading-relaxed">
              <p className="mb-4">
                {publicContent?.about_desc_1 || (
                  <><strong className="text-slate-900 font-bold">Bimbel Alberta Bondowoso</strong> merupakan lembaga bimbingan belajar yang berlokasi di pusat Kota Bondowoso. Berdiri sejak Juli 2025, Alberta hadir sebagai tempat belajar yang mendampingi peserta didik mulai dari jenjang TK, SD, hingga SMP.</>
                )}
              </p>
              <p>
                {publicContent?.about_desc_2 || 'Alberta berkomitmen menciptakan lingkungan belajar yang nyaman, menyenangkan, dan mendukung setiap anak untuk memahami materi pelajaran, mengembangkan potensi, serta membangun kepercayaan diri dalam belajar.'}
              </p>
            </div>
          </div>
          
          <div className="relative">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                   {featuresImages[0] ? (
                     <img src={featuresImages[0] || undefined} alt="Siswa 1" className="w-full h-64 object-cover rounded-[2rem] shadow-sm bg-slate-50" />
                   ) : (
                     <div className="w-full h-64 bg-slate-100 rounded-[2rem] animate-pulse"></div>
                   )}
                   {featuresImages[1] ? (
                     <img src={featuresImages[1] || undefined} alt="Siswa 2" className="w-full h-48 object-cover rounded-[2rem] shadow-sm bg-slate-50" />
                   ) : (
                     <div className="w-full h-48 bg-slate-100 rounded-[2rem] animate-pulse"></div>
                   )}
                </div>
                <div className="space-y-4">
                   {featuresImages[2] ? (
                     <img src={featuresImages[2] || undefined} alt="Siswa 3" className="w-full h-48 object-cover rounded-[2rem] shadow-sm bg-slate-50" />
                   ) : (
                     <div className="w-full h-48 bg-slate-100 rounded-[2rem] animate-pulse"></div>
                   )}
                   {featuresImages[3] ? (
                     <img src={featuresImages[3] || undefined} alt="Siswa 4" className="w-full h-64 object-cover rounded-[2rem] shadow-sm bg-slate-50" />
                   ) : (
                     <div className="w-full h-64 bg-slate-100 rounded-[2rem] animate-pulse"></div>
                   )}
                </div>
             </div>
          </div>
        </div>

        {/* Section 2: Visi & Misi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visi */}
          <div className="bg-slate-50 p-10 sm:p-14 rounded-[2.5rem] relative overflow-hidden">
             <Target className="w-10 h-10 text-purple-600 mb-8" />
             <h3 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">Visi Kami</h3>
             <p className="text-xl text-slate-700 leading-relaxed font-medium">
               {publicContent?.visi_text || 'Menjadi lembaga bimbingan belajar yang terpercaya dalam mendampingi peserta didik meraih prestasi akademik sekaligus mengembangkan karakter yang positif.'}
             </p>
          </div>
          
          {/* Misi */}
          <div className="bg-slate-900 p-10 sm:p-14 rounded-[2.5rem] text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-900/40 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
             <Compass className="w-10 h-10 text-purple-400 mb-8" />
             <h3 className="text-3xl font-extrabold mb-8 tracking-tight">Misi Kami</h3>
             <ul className="space-y-5 text-slate-300">
               {(publicContent?.misi_list?.length > 0 ? publicContent.misi_list : [
                 "Menyediakan pembelajaran yang efektif, menyenangkan, dan mudah dipahami.",
                 "Membimbing peserta didik sesuai dengan kebutuhan dan kemampuan masing-masing.",
                 "Menumbuhkan semangat belajar, rasa percaya diri, dan kemandirian.",
                 "Membangun komunikasi yang baik antara tutor, peserta didik, dan orang tua.",
                 "Menciptakan lingkungan belajar yang aman, nyaman, dan inspiratif."
               ]).map((item: string, i: number) => (
                 <li key={i} className="flex gap-4">
                   <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                     <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                   </div>
                   <span className="leading-relaxed text-base">{item}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* Section 3: Nilai Albertian */}
        <div>
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Nilai Albertian</h2>
            <p className="text-lg text-slate-600 mt-4 max-w-2xl leading-relaxed">
              Pondasi kami dalam mendampingi setiap langkah peserta didik menuju keberhasilan.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 p-10 rounded-[2rem] hover:border-purple-600 transition-colors shadow-sm hover:shadow-md">
              <BookOpen className="w-8 h-8 text-purple-600 mb-6" />
              <h4 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Belajar</h4>
              <p className="text-slate-600 leading-relaxed">
                Menjadikan proses belajar sebagai pengalaman yang menyenangkan dan bermakna bagi setiap anak.
              </p>
            </div>
            <div className="bg-white border border-slate-200 p-10 rounded-[2rem] hover:border-purple-600 transition-colors shadow-sm hover:shadow-md">
              <TrendingUp className="w-8 h-8 text-purple-600 mb-6" />
              <h4 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Berkembang</h4>
              <p className="text-slate-600 leading-relaxed">
                Mendorong setiap peserta didik untuk terus meningkatkan kemampuan akademik maupun keterampilan diri.
              </p>
            </div>
            <div className="bg-white border border-slate-200 p-10 rounded-[2rem] hover:border-purple-600 transition-colors shadow-sm hover:shadow-md">
              <Rocket className="w-8 h-8 text-purple-600 mb-6" />
              <h4 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Bertumbuh</h4>
              <p className="text-slate-600 leading-relaxed">
                Membentuk karakter yang disiplin, percaya diri, bertanggung jawab, dan siap menghadapi tantangan.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Program & Motto */}
        <div className="border-t border-slate-200 pt-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
           <div>
             <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-8">
               <GraduationCap className="w-7 h-7 text-purple-600" />
             </div>
             <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">Program Pendidikan</h2>
             <p className="text-lg text-slate-600 leading-relaxed">
               Alberta menyediakan layanan bimbingan belajar untuk berbagai jenjang pendidikan: 
               <strong className="text-slate-900 font-bold"> TK, SD, dan SMP</strong>. 
               <br/><br/>
               Setiap program dirancang dengan materi yang sesuai kurikulum, latihan yang terarah, serta pendampingan yang disesuaikan dengan kebutuhan peserta didik.
             </p>
           </div>
           <div className="bg-purple-50 p-10 sm:p-14 rounded-[2.5rem]">
             <p className="text-purple-600 font-bold tracking-widest uppercase text-sm mb-6">Motto Kami</p>
             <h3 className="text-2xl sm:text-3xl lg:text-3xl font-black text-purple-900 leading-tight">
               "Belajar, Berkembang, Bertumbuh Bersama Alberta"
             </h3>
           </div>
        </div>

      </div>
    </section>
  );
};
