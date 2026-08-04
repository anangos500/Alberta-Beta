import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, LogIn, Send, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const { setIsLoginModalOpen, setIsRegisterModalOpen, currentUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Beranda', path: '/' },
    { label: 'Tentang Alberta', path: '/tentang' },
    { label: 'Program TK, SD & SMP', path: '/program' },
    { label: 'Tentor', path: '/tentor' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Kontak', path: '/kontak' },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Alberta */}
          <Link 
            to="/"
            state={{ fromPortal: true }}
            onClick={handleNavClick}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shrink-0">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-1.5">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 leading-tight">
                  Alberta.
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full border border-purple-200 whitespace-nowrap hidden min-[360px]:block">
                  TK, SD & SMP
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                state={{ fromPortal: true }}
                className="px-2 xl:px-3 py-2 text-[13px] xl:text-[14px] font-semibold text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all cursor-pointer"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {currentUser ? (
                <button
                  onClick={() => navigate('/portal')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 xl:px-4 xl:py-2.5 rounded-full text-xs xl:text-sm font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200 transition-all cursor-pointer border border-purple-200"
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="whitespace-nowrap">Portal ({currentUser.nama.split(' ')[0]})</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 xl:px-5 xl:py-2.5 rounded-full text-xs xl:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border-2 border-slate-200 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Masuk</span>
                </button>
              )}
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 xl:px-5 xl:py-2.5 rounded-full text-xs xl:text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer shadow-md shadow-purple-500/25 whitespace-nowrap"
              >
                <span>Daftar Sekarang</span>
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="lg:hidden flex items-center gap-2">
              {currentUser ? (
                <button
                  onClick={() => navigate('/portal')}
                  className="md:hidden px-3 py-1.5 text-[10px] font-bold text-purple-700 bg-purple-100 border border-purple-200 rounded-full whitespace-nowrap flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Portal
                </button>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="md:hidden px-3 py-1.5 text-[10px] font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-full whitespace-nowrap flex items-center gap-1"
                >
                  <LogIn className="w-3 h-3" />
                  Masuk
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 sm:p-2.5 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-1 pb-4 space-y-2">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                state={{ fromPortal: true }}
                onClick={handleNavClick}
                className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg block"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsRegisterModalOpen(true);
              }}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 text-center flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Daftar Sekarang
            </button>

            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/portal');
                }}
                className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-purple-900 bg-purple-100 text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Masuk Portal Albertian
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 text-center flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Portal Albertian (Login)
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
