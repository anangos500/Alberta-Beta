import React, { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RegisterModal: React.FC = () => {
  const { isRegisterModalOpen, setIsRegisterModalOpen } = useApp();

  React.useEffect(() => {
    if (isRegisterModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isRegisterModalOpen]);

  const [form, setForm] = useState({
    namaOrtu: '',
    namaAnak: '',
    jenjang: 'SD' as 'TK' | 'SD' | 'SMP',
    kelas: '5',
    sekolah: '',
    noHp: ''
  });

  if (!isRegisterModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Halo Admin Bimbel Alberta Bondowoso,%0A%0ASaya ${encodeURIComponent(form.namaOrtu)} ingin mendaftarkan putra/putri saya:%0ANama Anak: ${encodeURIComponent(form.namaAnak)}%0AJenjang: ${form.jenjang} Kelas ${form.kelas}%0ASekolah: ${encodeURIComponent(form.sekolah || '-')}%0ANo HP Ortu: ${encodeURIComponent(form.noHp)}%0A%0AMohon informasi kelengkapan pendaftaran dan jadwal les di Bimbel Alberta. Terima kasih!`;
    const waUrl = `https://wa.me/6281234567890?text=${text}`;
    
    window.open(waUrl, '_blank');
    setIsRegisterModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto" onClick={() => setIsRegisterModalOpen(false)}>
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] max-w-lg w-full p-5 sm:p-10 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 mt-4 mb-4 sm:my-auto overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3" />

        {/* Close Button */}
        <button
          onClick={() => setIsRegisterModalOpen(false)}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-3 relative z-10 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 text-[10px] font-extrabold border border-purple-100 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pendaftaran Bimbel Alberta</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Daftar <span className="text-pink-600">Bimbel</span>
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Isi formulir ini untuk langsung terhubung dengan WhatsApp Admin kami dengan pesan yang sudah diformat rapi.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5 relative z-10">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Nama Orang Tua / Wali
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Ibu Ratna"
              value={form.namaOrtu}
              onChange={(e) => setForm({ ...form, namaOrtu: e.target.value })}
              className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 border-slate-100 text-sm focus:outline-none focus:border-purple-300 focus:bg-purple-50/30 transition-colors bg-slate-50 placeholder:text-slate-400 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Nama Lengkap Anak
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Prasetyo"
              value={form.namaAnak}
              onChange={(e) => setForm({ ...form, namaAnak: e.target.value })}
              className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 border-slate-100 text-sm focus:outline-none focus:border-purple-300 focus:bg-purple-50/30 transition-colors bg-slate-50 placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Jenjang
              </label>
              <select
                value={form.jenjang}
                onChange={(e) => {
                  const newJenjang = e.target.value as 'TK' | 'SD' | 'SMP';
                  let newKelas = '1';
                  if (newJenjang === 'TK') newKelas = '0';
                  else if (newJenjang === 'SMP') newKelas = '7';
                  setForm({ ...form, jenjang: newJenjang, kelas: newKelas });
                }}
                className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 border-slate-100 text-sm focus:outline-none focus:border-purple-300 focus:bg-purple-50/30 transition-colors bg-slate-50 cursor-pointer font-medium"
              >
                <option value="TK">Jenjang TK</option>
                <option value="SD">Jenjang SD</option>
                <option value="SMP">Jenjang SMP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Kelas
              </label>
              <select
                value={form.kelas}
                onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 border-slate-100 text-sm focus:outline-none focus:border-purple-300 focus:bg-purple-50/30 transition-colors bg-slate-50 cursor-pointer font-medium"
              >
                {form.jenjang === 'TK' ? (
                  <>
                    <option value="0">TK A / TK B</option>
                  </>
                ) : form.jenjang === 'SD' ? (
                  <>
                    <option value="1">Kelas 1 SD</option>
                    <option value="2">Kelas 2 SD</option>
                    <option value="3">Kelas 3 SD</option>
                    <option value="4">Kelas 4 SD</option>
                    <option value="5">Kelas 5 SD</option>
                    <option value="6">Kelas 6 SD</option>
                  </>
                ) : (
                  <>
                    <option value="7">Kelas 7 SMP</option>
                    <option value="8">Kelas 8 SMP</option>
                    <option value="9">Kelas 9 SMP</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Asal Sekolah (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: SDN Dabasah 1"
              value={form.sekolah}
              onChange={(e) => setForm({ ...form, sekolah: e.target.value })}
              className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 border-slate-100 text-sm focus:outline-none focus:border-purple-300 focus:bg-purple-50/30 transition-colors bg-slate-50 placeholder:text-slate-400 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              No WhatsApp
            </label>
            <input
              type="tel"
              required
              placeholder="Contoh: 081987654321"
              value={form.noHp}
              onChange={(e) => setForm({ ...form, noHp: e.target.value })}
              className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 border-slate-100 text-sm focus:outline-none focus:border-purple-300 focus:bg-purple-50/30 transition-colors bg-slate-50 placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="pt-2 sm:pt-4">
            <button
              type="submit"
              className="w-full py-3.5 sm:py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-5 h-5" />
              <span>Kirim via WhatsApp</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
