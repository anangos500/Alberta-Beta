import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmModal } from './ConfirmModal';
import { useState } from 'react';

export const PortalMobileHeader: React.FC = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { currentUser, logout } = useApp();

  if (!currentUser) return null;

  return (
    <>
    <header className="lg:hidden bg-white text-slate-900 border-b border-slate-100 sticky top-0 z-30 shadow-sm w-full">
      <div className="w-full px-4 h-16 flex items-center justify-between">
        <Link to="/" state={{ fromPortal: true }} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-md overflow-hidden bg-white">
            <img src="https://exyrlwugzdvqfiafvfcv.supabase.co/storage/v1/object/public/images/Icon%20193X193.png" alt="Logo Alberta" className="w-full h-full object-cover" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900">
            Portal Albertian.
          </span>
        </Link>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
          title="Keluar"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
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
