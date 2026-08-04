import React, { useState, useEffect } from 'react';
import { X, Save, UserPlus, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student, Jenjang } from '../../types';
import { ConfirmModal } from './ConfirmModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingStudent?: Student | null;
}

export const StudentManagementModal: React.FC<Props> = ({
  isOpen,
  onClose,
  editingStudent
}) => {
  const { tentors, parents, addStudent, updateStudent } = useApp();

  const [nama, setNama] = useState('');
  const [jenjang, setJenjang] = useState<Jenjang>('SD');
  const [kelas, setKelas] = useState<number>(5);
  const [sekolah, setSekolah] = useState('');
  
  // Parent state
  const [parentMode, setParentMode] = useState<'new' | 'existing'>('new');
  const [selectedParentId, setSelectedParentId] = useState('');
  const [namaOrangTua, setNamaOrangTua] = useState('');
  const [noHpOrangTua, setNoHpOrangTua] = useState('');
  const generatedParentEmail = namaOrangTua ? `${namaOrangTua.split(' ')[0].toLowerCase()}@alberta.id` : '';
  const [parentPassword, setParentPassword] = useState('');
  
  const [tentorId, setTentorId] = useState('');
  const [status, setStatus] = useState<'aktif' | 'cuti'>('aktif');
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  useEffect(() => {
    if (editingStudent) {
      setNama(editingStudent.nama);
      setJenjang(editingStudent.jenjang);
      setKelas(editingStudent.kelas);
      setSekolah(editingStudent.sekolah);
      setNamaOrangTua(editingStudent.namaOrangTua);
      setNoHpOrangTua(editingStudent.noHpOrangTua);
      setTentorId(editingStudent.tentorId);
      setStatus(editingStudent.status);
    } else {
      setNama('');
      setJenjang('SD');
      setKelas(5);
      setSekolah('');
      setNamaOrangTua('');
      setNoHpOrangTua('');
      setTentorId(tentors[0]?.id || '');
      setStatus('aktif');
    }
  }, [editingStudent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTentor = tentors.find((t) => t.id === tentorId);

    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        nama,
        jenjang,
        kelas: Number(kelas),
        sekolah,
        namaOrangTua,
        noHpOrangTua,
        tentorId: tentorId || null,
        tentorNama: selectedTentor?.nama || null,
        status
      });
    } else {
      addStudent({
        nama,
        jenjang,
        kelas: Number(kelas),
        sekolah: sekolah || (jenjang === 'SD' ? 'SDN Dabasah 1 Bondowoso' : 'SMPN 1 Bondowoso'),
        namaOrangTua,
        noHpOrangTua,
        parentId: selectedParentId,
        tentorId: tentorId || null,
        tentorNama: selectedTentor?.nama || null,
        status: 'aktif',
        foto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cbd5e1"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
        
        // Pass these down so AppContext can handle Auth creation
        parentMode,
        parentEmail: generatedParentEmail,
        parentPassword
      } as any);
    }
    onClose();
  };

  const handleClose = () => {
    let isDirty = false;
    if (editingStudent) {
      if (
        nama !== editingStudent.nama ||
        jenjang !== editingStudent.jenjang ||
        kelas !== editingStudent.kelas ||
        sekolah !== editingStudent.sekolah ||
        namaOrangTua !== editingStudent.namaOrangTua ||
        noHpOrangTua !== editingStudent.noHpOrangTua ||
        tentorId !== editingStudent.tentorId ||
        status !== editingStudent.status
      ) {
        isDirty = true;
      }
    } else {
      if (
        nama !== '' ||
        jenjang !== 'SD' ||
        kelas !== 5 ||
        sekolah !== '' ||
        namaOrangTua !== '' ||
        noHpOrangTua !== '' ||
        parentPassword !== '' ||
        tentorId !== ''
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
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 sm:top-8 right-6 sm:right-8 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 p-6 sm:p-8 border-b border-stone-100 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase border border-teal-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Data Siswa</span>
        </div>
          <h3 className="text-2xl font-bold text-stone-800 font-serif pr-8">
            {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru Bimbel'}
          </h3>
          <p className="text-xs text-stone-500">
            Khusus jenjang SD (Kelas 1-6) dan SMP (Kelas 7-9) di Bimbel Alberta.
          </p>
        </div>

        {/* Form */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-4">
        <form onSubmit={handleSubmit} id="student-form" className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Nama Lengkap Siswa *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Ananda Kevin Bondan"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
            />
        </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Jenjang Sekolah *
              </label>
              <select
                value={jenjang}
                onChange={(e) => {
                  const newJ = e.target.value as Jenjang;
                  setJenjang(newJ);
                  if (newJ === 'SD' && kelas > 6) setKelas(5);
                  if (newJ === 'SMP' && kelas < 7) setKelas(8);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
              >
                <option value="SD">Jenjang SD</option>
                <option value="SMP">Jenjang SMP</option>
              </select>
          </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Kelas *
              </label>
              <select
                value={kelas}
                onChange={(e) => setKelas(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
              >
                {jenjang === 'SD' ? (
                  <>
                    <option value={1}>Kelas 1 SD</option>
                    <option value={2}>Kelas 2 SD</option>
                    <option value={3}>Kelas 3 SD</option>
                    <option value={4}>Kelas 4 SD</option>
                    <option value={5}>Kelas 5 SD</option>
                    <option value={6}>Kelas 6 SD</option>
                  </>
                ) : (
                  <>
                    <option value={7}>Kelas 7 SMP</option>
                    <option value={8}>Kelas 8 SMP</option>
                    <option value={9}>Kelas 9 SMP</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Asal Sekolah di Bondowoso
            </label>
            <input
              type="text"
              placeholder="Contoh: SDN Dabasah 1 Bondowoso / SMPN 1 Bondowoso"
              value={sekolah}
              onChange={(e) => setSekolah(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
            />
        </div>

          {!editingStudent && (
            <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 space-y-3">
              <div className="flex items-center justify-between border-b border-teal-200 pb-3 mb-2">
                <span className="text-sm font-bold text-teal-900">Informasi Akun Orang Tua</span>
                <div className="flex bg-white rounded-lg p-0.5 border border-teal-200">
                  <button
                    type="button"
                    onClick={() => setParentMode('new')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${parentMode === 'new' ? 'bg-teal-500 text-white shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                  >
                    Buat Baru
                  </button>
                  <button
                    type="button"
                    onClick={() => setParentMode('existing')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${parentMode === 'existing' ? 'bg-teal-500 text-white shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                  >
                    Pilih Tersedia
                  </button>
              </div>
            </div>

              {parentMode === 'existing' ? (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Pilih Akun Orang Tua *
                  </label>
                  <select
                    required
                    value={selectedParentId}
                    onChange={(e) => {
                      setSelectedParentId(e.target.value);
                      const parent = parents.find(p => p.id === e.target.value);
                      if (parent) {
                        setNamaOrangTua(parent.nama);
                        setNoHpOrangTua(parent.noHp);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                  >
                    <option value="" disabled>-- Pilih Orang Tua --</option>
                    {parents.map(p => (
                      <option key={p.id} value={p.id}>{p.nama} ({p.noHp})</option>
                    ))}
                  </select>
              </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Nama Orang Tua *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Ibu Ratna Dewi"
                        value={namaOrangTua}
                        onChange={(e) => setNamaOrangTua(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                      />
                  </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        No HP / WhatsApp Ortu *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Contoh: 081987654321"
                        value={noHpOrangTua}
                        onChange={(e) => setNoHpOrangTua(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                      />
                  </div>
                </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Email Login Ortu *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="otomatis dari nama"
                        value={generatedParentEmail}
                        readOnly
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-stone-100 text-stone-500 cursor-not-allowed"
                      />
                  </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Password Login Ortu *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="Minimal 6 karakter"
                        value={parentPassword}
                        onChange={(e) => setParentPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                      />
                  </div>
                </div>
              </div>
              )}
            </div>
          )}

          {editingStudent && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nama Orang Tua *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ibu Ratna Dewi"
                  value={namaOrangTua}
                  onChange={(e) => setNamaOrangTua(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                />
            </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  No HP / WhatsApp Ortu *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081987654321"
                  value={noHpOrangTua}
                  onChange={(e) => setNoHpOrangTua(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                />
            </div>
          </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Tentor Pendamping *
            </label>
            <select
              value={tentorId}
              onChange={(e) => setTentorId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
            >
              {tentors.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nama} — ({t.spesialisasi})
                </option>
              ))}
            </select>
        </div>

          {editingStudent && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Status Keaktifan (Soft Delete)
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'aktif' | 'cuti')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white font-bold"
              >
                <option value="aktif">Aktif (Siswa Aktif Bimbel)</option>
                <option value="cuti">Nonaktif / Alumni (Soft Delete - Riwayat Tetap Tersimpan)</option>
              </select>
              <p className="text-[11px] text-stone-500 mt-1 italic">
                Fitur Soft Delete: Siswa nonaktif tidak terhapus permanen agar riwayat belajar tetap tersimpan rapi.
              </p>
          </div>
          )}

  
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
              form="student-form"
              className="px-5 py-2.5 rounded-xl font-bold text-teal-900 bg-teal-200 hover:bg-teal-300 shadow-sm transition-all text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Data Siswa</span>
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
