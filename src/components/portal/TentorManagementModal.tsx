import React, { useState, useEffect } from 'react';
import { X, Save, UserCheck, Sparkles, Loader2 } from 'lucide-react';
import { Tentor } from '../../types';
import { uploadImageToSupabase } from '../../lib/imageUpload';
import { ConfirmModal } from './ConfirmModal';

interface Props {
  onClose: () => void;
  onSubmit: (tentorData: Partial<Tentor> & { email?: string; password?: string }) => void;
  editingTentor: Tentor | null;
}

export const TentorManagementModal: React.FC<Props> = ({ onClose, onSubmit, editingTentor }) => {
  const [nama, setNama] = useState('');
  const [gelar, setGelar] = useState('');
  const [spesialisasi, setSpesialisasi] = useState('');
  const [lulusan, setLulusan] = useState('');
  const [noHp, setNoHp] = useState('');
  const [bio, setBio] = useState('');
  const [foto, setFoto] = useState('');
  const generatedEmail = nama ? `${nama.split(' ')[0].toLowerCase()}@alberta.id` : '';
  const [password, setPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  useEffect(() => {
    if (editingTentor) {
      setNama(editingTentor.nama);
      setGelar(editingTentor.gelar);
      setSpesialisasi(editingTentor.spesialisasi);
      setLulusan(editingTentor.lulusan);
      setNoHp(editingTentor.noHp);
      setBio(editingTentor.bio);
      setFoto(editingTentor.foto);
    } else {
      setFoto(`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cbd5e1"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`); // default foto placeholder
    }
  }, [editingTentor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<Tentor> & { email?: string; password?: string } = {
      nama,
      gelar,
      spesialisasi,
      lulusan,
      noHp,
      bio,
      foto
    };
    if (!editingTentor) {
      data.email = generatedEmail;
      data.password = password;
    }
    onSubmit(data);
  };

  const handleClose = () => {
    let isDirty = false;
    if (editingTentor) {
      if (
        nama !== editingTentor.nama ||
        gelar !== editingTentor.gelar ||
        spesialisasi !== editingTentor.spesialisasi ||
        lulusan !== editingTentor.lulusan ||
        noHp !== editingTentor.noHp ||
        bio !== editingTentor.bio ||
        foto !== editingTentor.foto
      ) {
        isDirty = true;
      }
    } else {
      if (
        nama !== '' ||
        gelar !== '' ||
        spesialisasi !== '' ||
        lulusan !== '' ||
        noHp !== '' ||
        bio !== '' ||
        password !== '' ||
        foto !== `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cbd5e1"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`
      ) {
        isDirty = true;
      }
    }

    if (isDirty) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-hidden" onClick={handleClose}>
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-sm border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-full" onClick={(e) => e.stopPropagation()}>
        
        <button
          onClick={handleClose}
          className="absolute top-6 sm:top-8 right-6 sm:right-8 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 p-6 sm:p-8 border-b border-stone-100 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase border border-purple-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Data Tentor</span>
          </div>
          <h3 className="text-2xl font-bold text-stone-800 font-serif pr-8">
            {editingTentor ? 'Edit Data Tentor' : 'Tambah Tentor Baru'}
          </h3>
          <p className="text-xs text-stone-500">
            Daftarkan tenaga pengajar baru di Bimbel Alberta.
          </p>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-4">
        <form onSubmit={handleSubmit} id="tentor-form" className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Foto Profil
            </label>
            <div className="flex items-center gap-4">
              <img src={foto || undefined} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-stone-200 shrink-0" />
              <input
                type="file"
                accept="image/*"
                disabled={isUploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setIsUploading(true);
                    
                    const previewUrl = URL.createObjectURL(file);
                    setFoto(previewUrl);

                    const publicUrl = await uploadImageToSupabase(file);
                    if (publicUrl) {
                      setFoto(publicUrl);
                      URL.revokeObjectURL(previewUrl);
                    } else {
                      setFoto(editingTentor?.foto || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cbd5e1"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`);
                      alert('Gagal mengunggah gambar ke Supabase. Pastikan bucket "images" sudah dibuat dan public.');
                    }
                    setIsUploading(false);
                  }
                }}
                className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer disabled:opacity-50"
              />
              {isUploading && <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Nama Lengkap Tentor *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Alberta Fitriani"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Gelar *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: S.Pd."
                value={gelar}
                onChange={(e) => setGelar(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Lulusan *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Universitas Jember"
                value={lulusan}
                onChange={(e) => setLulusan(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
              />
            </div>
          </div>
          
          {!editingTentor && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
              <div className="col-span-2">
                <p className="text-xs font-bold text-purple-800 mb-2 border-b border-purple-200 pb-2">Informasi Akun Login Tentor</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Login *
                </label>
                <input
                  type="email"
                  required
                  placeholder="otomatis dari nama"
                  value={generatedEmail}
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-stone-100 text-stone-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Password Login *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Spesialisasi *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Matematika & IPA (SD & SMP)"
              value={spesialisasi}
              onChange={(e) => setSpesialisasi(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              No HP / WhatsApp *
            </label>
            <input
              type="tel"
              required
              placeholder="Contoh: 081987654321"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Bio Singkat
            </label>
            <textarea
              placeholder="Ceritakan sedikit tentang pengalaman mengajar..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
            />
          </div>
  
        </form>
        </div>
        <div className="p-6 sm:px-8 sm:py-6 border-t border-stone-200 flex items-center justify-end gap-3 shrink-0 bg-stone-50 rounded-b-3xl mt-auto">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              form="tentor-form"
              disabled={isUploading}
              className="px-5 py-2.5 rounded-xl font-bold text-purple-900 bg-purple-200 hover:bg-purple-300 shadow-sm transition-all text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Data Tentor</span>
            </button>
          </div>


            </div>
      <ConfirmModal 
        isOpen={showConfirmClose} 
        onConfirm={onClose} 
        onCancel={() => setShowConfirmClose(false)} 
      />
    </div>
  );
};
