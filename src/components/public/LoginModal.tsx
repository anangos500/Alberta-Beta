import React, { useState } from 'react';
import { X, GraduationCap, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, setCurrentUser, setCurrentView, setPortalTab } = useApp();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoginModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLoginModalOpen]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        throw new Error('Supabase belum dikonfigurasi. Silakan lengkapi .env terlebih dahulu.');
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Fetch user profile to get the role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      let studentIds: string[] = [];
      if (profile.role === "orang_tua") {
        const { data: studentsData } = await supabase.from("students").select("id").eq("parent_id", profile.id);
        if (studentsData) studentIds = studentsData.map(s => s.id);
      }

      setCurrentUser({
        id: profile.id,
        username: email,
        nama: profile.nama,
        role: profile.role,
        foto: profile.foto,
        studentIds
      });

      setIsLoginModalOpen(false);
      setCurrentView('portal');
      setPortalTab('dashboard');
      navigate('/portal');
      navigate('/portal');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsLoginModalOpen(false)}>
      <div className="bg-white rounded-[2rem] max-w-md w-full p-6 sm:p-10 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 my-8 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-100/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100/50 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3" />

        {/* Close Button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-4 relative z-10 mb-8">
          <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Portal <span className="text-purple-600">Albertian</span>
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[280px] mx-auto">
              Masuk dengan akun yang telah didaftarkan
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-colors bg-white placeholder:text-slate-400 font-medium"
              />
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-colors bg-white placeholder:text-slate-400 font-medium"
              />
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Memeriksa kredensial...' : 'Masuk Portal'}
          </button>
        </form>

      </div>
    </div>
  );
};
