import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MapPin, Phone, Heart, LogIn } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setIsLoginModalOpen, resetData } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-black text-xl shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  Alberta.
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed max-w-sm text-slate-400">
              Bimbingan Belajar Modern Jenjang TK, SD & SMP berlokasi di pusat Kota Bondowoso. Komitmen transparansi belajar dengan cara yang unik dan menyenangkan.
            </p>

            <div className="text-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                </div>
                <span>Pusat Kota Bondowoso</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-pink-400 shrink-0" />
                </div>
                <span>WhatsApp: 0812-3456-7890</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Navigasi Halaman
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" state={{ fromPortal: true }} className="hover:text-purple-400 transition-colors cursor-pointer">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/tentang" state={{ fromPortal: true }} className="hover:text-purple-400 transition-colors cursor-pointer">
                  Tentang Alberta
                </Link>
              </li>
              <li>
                <Link to="/program" state={{ fromPortal: true }} className="hover:text-purple-400 transition-colors cursor-pointer">
                  Program TK, SD & SMP
                </Link>
              </li>
              <li>
                <Link to="/tentor" state={{ fromPortal: true }} className="hover:text-purple-400 transition-colors cursor-pointer">
                  Profil Tentor
                </Link>
              </li>
              <li>
                <Link to="/faq" state={{ fromPortal: true }} className="hover:text-purple-400 transition-colors cursor-pointer">
                  FAQ & Pertanyaan
                </Link>
              </li>
              <li>
                <Link to="/kontak" state={{ fromPortal: true }} className="hover:text-purple-400 transition-colors cursor-pointer">
                  Kontak & Lokasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Portal & Demo Tools */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Portal Albertian
            </h4>
            <p className="text-sm">
              Akses cepat laporan perkembangan belajar mingguan untuk Admin, Tentor, dan Orang Tua.
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/20"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Portal Albertian</span>
              </button>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2025 - 2026 Bimbel Alberta Bondowoso. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>untuk Pendidikan Bondowoso</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
