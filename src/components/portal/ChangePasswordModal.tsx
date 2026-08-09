import React, { useState } from 'react';
import { X, Save, Lock, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ConfirmModal } from './ConfirmModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch (err: any) {
      console.error('Error changing password:', err);
      setError(err.message || 'Gagal mengubah password. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (newPassword || confirmPassword) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto" onClick={handleClose}>
        <div className="bg-white rounded-[2rem] max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
          
          <button
            onClick={handleClose}
            className="absolute top-6 sm:top-8 right-6 sm:right-8 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1 p-6 sm:p-8 border-b border-stone-100">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase border border-blue-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pengaturan Keamanan</span>
            </div>
            <h3 className="text-2xl font-bold text-stone-800 font-serif pr-8">
              Ganti Password
            </h3>
            <p className="text-xs text-stone-500">
              Ubah password login portal Anda.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {success ? (
              <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm font-medium text-center">
                Password berhasil diubah! Menutup...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-sm font-medium border border-rose-100">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Password Baru *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Minimal 6 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Konfirmasi Password Baru *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Ulangi password baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  />
                </div>

                <div className="pt-4 mt-6 border-t border-stone-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Simpan Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmClose}
        onConfirm={() => {
          setShowConfirmClose(false);
          onClose();
        }}
        onCancel={() => setShowConfirmClose(false)}
        title="Batal Ubah Password"
        message="Anda memiliki perubahan yang belum disimpan. Yakin ingin membatalkan?"
        confirmText="Ya, Batalkan"
        cancelText="Kembali"
      />
    </>
  );
};
