import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  PlusCircle, 
  TrendingUp, 
  Calendar, 
  UserCheck, Bell, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PortalBottomNav: React.FC = () => {
  const { currentUser, portalTab, setPortalTab } = useApp();

  if (!currentUser) return null;

  const getActiveColor = () => {
    switch (currentUser.role) {
      case 'admin': return 'text-purple-700 bg-purple-100';
      case 'tentor': return 'text-pink-700 bg-pink-100';
      case 'orang_tua': return 'text-emerald-700 bg-emerald-100';
      default: return 'text-blue-900 bg-blue-50';
    }
  };

  const activeColorClass = getActiveColor();
  const inactiveColorClass = 'text-slate-500 hover:text-slate-900';

  const renderNavItems = () => {
    switch (currentUser.role) {
      case 'admin':
        return (
          <>
            <button
              onClick={() => setPortalTab('dashboard')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors min-w-[60px] ${
                portalTab === 'dashboard' ? activeColorClass : inactiveColorClass
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Beranda</span>
            </button>
            <button
              onClick={() => setPortalTab('siswa')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors min-w-[60px] ${
                portalTab === 'siswa' ? activeColorClass : inactiveColorClass
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Siswa</span>
            </button>
            <button
              onClick={() => setPortalTab('tentor_master')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors min-w-[60px] ${
                portalTab === 'tentor_master' ? activeColorClass : inactiveColorClass
              }`}
            >
              <UserCheck className="w-5 h-5" />
              <span>Tentor</span>
            </button>
            <button
              onClick={() => setPortalTab('jadwal')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors min-w-[60px] ${
                portalTab === 'jadwal' ? activeColorClass : inactiveColorClass
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Jadwal</span>
            </button>
            <button
              onClick={() => setPortalTab('pemberitahuan')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors min-w-[60px] ${
                portalTab === 'pemberitahuan' ? activeColorClass : inactiveColorClass
              }`}
            >
              <Bell className="w-5 h-5" />
              <span>Notif</span>
            </button>
            <button
              onClick={() => setPortalTab('rekap_laporan')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors min-w-[64px] ${
                portalTab === 'rekap_laporan' ? activeColorClass : inactiveColorClass
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Laporan</span>
            </button>
            <button
              onClick={() => setPortalTab('public_settings')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors min-w-[64px] ${
                portalTab === 'public_settings' ? activeColorClass : inactiveColorClass
              }`}
            >
              <Globe className="w-5 h-5" />
              <span>Publik</span>
            </button>
          </>
        );

      case 'tentor':
        return (
          <>
            <button
              onClick={() => setPortalTab('dashboard')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors min-w-[60px] ${
                portalTab === 'dashboard' ? activeColorClass : inactiveColorClass
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Beranda</span>
            </button>
            <button
              onClick={() => setPortalTab('jadwal_mengajar')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors min-w-[60px] ${
                portalTab === 'jadwal_mengajar' ? activeColorClass : inactiveColorClass
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Jadwal</span>
            </button>
            <button
              onClick={() => setPortalTab('buat_laporan')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors min-w-[60px] ${
                portalTab === 'buat_laporan' ? activeColorClass : inactiveColorClass
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              <span>Isi Laporan</span>
            </button>
            <button
              onClick={() => setPortalTab('history_tentor')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors min-w-[60px] ${
                portalTab === 'history_tentor' ? activeColorClass : inactiveColorClass
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Arsip</span>
            </button>
          </>
        );

      case 'orang_tua':
        return (
          <>
            <button
              onClick={() => setPortalTab('dashboard')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors min-w-[60px] ${
                portalTab === 'dashboard' ? activeColorClass : inactiveColorClass
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Beranda</span>
            </button>
            <button
              onClick={() => setPortalTab('laporan')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors min-w-[60px] ${
                portalTab === 'laporan' ? activeColorClass : inactiveColorClass
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Laporan</span>
            </button>
            <button
              onClick={() => setPortalTab('evaluasi')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors min-w-[60px] ${
                portalTab === 'evaluasi' ? activeColorClass : inactiveColorClass
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Evaluasi</span>
            </button>
          </>
        );
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] px-2 py-2 pb-safe">
      <div className="flex items-center justify-evenly sm:justify-around gap-2 sm:gap-1 w-full overflow-x-auto hide-scrollbar pb-1">
        {renderNavItems()}
      </div>
    </div>
  );
};
