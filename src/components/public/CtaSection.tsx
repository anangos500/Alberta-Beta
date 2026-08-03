import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CtaSection: React.FC = () => {
  const { setIsRegisterModalOpen } = useApp();

  return (
    <section className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-3xl p-6 sm:p-16 text-center shadow-2xl relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white font-medium text-sm mb-8 backdrop-blur-sm border border-white/20 shadow-sm">
              <Sparkles className="w-4 h-4" />
              Mari Bergabung Bersama Kami
            </div>
            
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              Ayo Belajar di <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Alberta</span>
            </h2>
            
            <p className="text-purple-100 text-base md:text-lg mb-10 max-w-2xl mx-auto">
              Tingkatkan prestasi belajar dan capai impianmu dengan bimbingan belajar terbaik di Bondowoso. Tempat terbatas!
            </p>
            
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-purple-700 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-xl shadow-black/10 group text-lg"
            >
              Daftar Sekarang
              <ArrowRight className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
