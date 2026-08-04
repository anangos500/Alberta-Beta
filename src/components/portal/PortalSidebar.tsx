import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  PlusCircle, 
  TrendingUp, 
  Calendar, 
  UserCheck, 
  Bell,
  GraduationCap,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmModal } from './ConfirmModal';
import { useState } from 'react';

export const PortalSidebar: React.FC = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { currentUser, portalTab, setPortalTab, logout } = useApp();

  if (!currentUser) return null;

  const renderNavItems = () => {
    switch (currentUser.role) {
      case 'admin':
        return (
          <>
            <button
              onClick={() => setPortalTab('dashboard')}
              className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                portalTab === 'dashboard'
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="leading-tight">Beranda</span>
            </button>

            <button
              onClick={() => setPortalTab('siswa')}
              className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                portalTab === 'siswa'
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="leading-tight">Master Siswa (TK, SD SD & SMP SMP)</span>
            </button>

            <button
              onClick={() => setPortalTab('public_settings')}
              className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                portalTab === 'public_settings'
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="leading-tight">Pengaturan Publik</span>
            </button>

            <button
              onClick={() => setPortalTab('tentor_master')}
              className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                portalTab === 'tentor_master'
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span className="leading-tight">Data Tentor & Pengajar</span>
            </button>

            <button
              onClick={() => setPortalTab('jadwal')}
              className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                portalTab === 'jadwal'
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="leading-tight">Jadwal Belajar</span>
            </button>

            <button
              onClick={() => setPortalTab('pemberitahuan')}
              className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                portalTab === 'pemberitahuan'
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span className="leading-tight">Kirim Pemberitahuan</span>
            </button>

            <button
              onClick={() => setPortalTab('rekap_laporan')}
              className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                portalTab === 'rekap_laporan'
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="leading-tight">Semua Laporan Mingguan</span>
            </button>
          </>
        );

      case 'tentor':
        return (
          <>
            <button
              onClick={() => setPortalTab('dashboard')}
              className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                portalTab === 'dashboard'
                  ? 'bg-pink-100 text-pink-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="leading-tight">Beranda</span>
            </button>

            <button
              onClick={() => setPortalTab('jadwal_mengajar')}
              className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                portalTab === 'jadwal_mengajar'
                  ? 'bg-pink-100 text-pink-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="leading-tight">Jadwal Mengajar</span>
            </button>

            <button
              onClick={() => setPortalTab('buat_laporan')}
              className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                portalTab === 'buat_laporan'
                  ? 'bg-pink-100 text-pink-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span className="leading-tight">Isi Laporan Minggu Ini</span>
            </button>

            <button
              onClick={() => setPortalTab('history_tentor')}
              className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                portalTab === 'history_tentor'
                  ? 'bg-pink-100 text-pink-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="leading-tight">Arsip Laporan Saya</span>
            </button>
          </>
        );

      case 'orang_tua':
        return (
          <>
            <button
              onClick={() => setPortalTab('dashboard')}
              className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                portalTab === 'dashboard'
                  ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="leading-tight">Beranda</span>
            </button>

            <button
              onClick={() => setPortalTab('laporan')}
              className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                portalTab === 'laporan'
                  ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="leading-tight">Laporan Mingguan</span>
            </button>

            <button
              onClick={() => setPortalTab('evaluasi')}
              className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                portalTab === 'evaluasi'
                  ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span className="leading-tight">Grafik & Ringkasan</span>
            </button>
          </>
        );
    }
  };

  return (
    <>
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-100 shrink-0 p-4 h-screen sticky top-0 flex-col overflow-hidden">
        
        {/* Logo & Back to Public */}
        <div className="flex flex-col gap-3 mb-6">
          <Link
            to="/"
            state={{ fromPortal: true }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-purple-600 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Website Publik</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-md shrink-0 overflow-hidden bg-white">
              <img src="https://exyrlwugzdvqfiafvfcv.supabase.co/storage/v1/object/public/images/Icon%20193X193.png" alt="Logo Alberta" className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 truncate">
              Portal Albertian.
            </span>
          </div>
        </div>

        {/* Role Banner Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 mb-4">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
            Akses Saat Ini
          </span>
          <div className="font-extrabold text-slate-900 text-sm leading-tight truncate">
            {currentUser.nama}
          </div>
          <div className="text-purple-600 font-bold uppercase text-[10px] tracking-wider pt-0.5">
            Akses {currentUser.role.replace('_', ' ')}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {renderNavItems()}
        </nav>

        {/* Footer Area with Logout */}
        <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Keluar Portal</span>
          </button>
          <div className="text-[10px] text-slate-400 space-y-1 text-center">
            <p className="font-bold text-slate-900">Bimbel Alberta Bondowoso</p>
            <p className="leading-relaxed">Aplikasi Laporan Belajar TK, SD SD & SMP SMP.</p>
          </div>
        </div>
      </aside>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          logout();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari akun ini?"
        confirmText="Keluar"
        cancelText="Batal"
      />
    </>
  );
};
