import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, MapPin, BookOpen } from 'lucide-react';
import { Jadwal, Tentor, Student } from '../../types';
import { useApp } from '../../context/AppContext';
import { ConfirmModal } from './ConfirmModal';

interface Props {
  onClose: () => void;
  editingJadwal: Jadwal | null;
}

export const JadwalManagementModal: React.FC<Props> = ({ onClose, editingJadwal }) => {
  const { tentors, students, addJadwal, updateJadwal } = useApp();

  const [tentorId, setTentorId] = useState('');
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [hari, setHari] = useState('Senin');
  const [jamMulai, setJamMulai] = useState('15:00');
  const [jamSelesai, setJamSelesai] = useState('16:30');
  const [mataPelajaran, setMataPelajaran] = useState('');
  const [ruangan, setRuangan] = useState('');
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  useEffect(() => {
    if (editingJadwal) {
      setTentorId(editingJadwal.tentorId);
      setStudentIds(editingJadwal.studentIds || []);
      setHari(editingJadwal.hari);
      setJamMulai(editingJadwal.jamMulai);
      setJamSelesai(editingJadwal.jamSelesai);
      setMataPelajaran(editingJadwal.mataPelajaran);
      setRuangan(editingJadwal.ruangan || '');
    } else {
      if (tentors.length > 0) setTentorId(tentors[0].id);
      if (students.length > 0) setStudentIds([students[0].id]);
    }
  }, [editingJadwal, tentors, students]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentIds.length === 0) {
      alert("Pilih minimal satu siswa.");
      return;
    }
    const jadwalData = {
      tentorId,
      studentIds,
      hari,
      jamMulai,
      jamSelesai,
      mataPelajaran,
      ruangan
    };

    if (editingJadwal) {
      updateJadwal({ ...jadwalData, id: editingJadwal.id });
    } else {
      addJadwal(jadwalData);
    }
    onClose();
  };

  const handleClose = () => {
    let isDirty = false;
    if (editingJadwal) {
      if (
        tentorId !== editingJadwal.tentorId ||
        JSON.stringify(studentIds) !== JSON.stringify(editingJadwal.studentIds || []) ||
        hari !== editingJadwal.hari ||
        jamMulai !== editingJadwal.jamMulai ||
        jamSelesai !== editingJadwal.jamSelesai ||
        mataPelajaran !== editingJadwal.mataPelajaran ||
        ruangan !== (editingJadwal.ruangan || '')
      ) {
        isDirty = true;
      }
    } else {
      const defaultTentorId = tentors.length > 0 ? tentors[0].id : '';
      const defaultStudentIds = students.length > 0 ? [students[0].id] : [];
      if (
        tentorId !== defaultTentorId ||
        JSON.stringify(studentIds) !== JSON.stringify(defaultStudentIds) ||
        hari !== 'Senin' ||
        jamMulai !== '15:00' ||
        jamSelesai !== '16:30' ||
        mataPelajaran !== '' ||
        ruangan !== ''
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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-hidden" onClick={handleClose}>
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-sm border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-full" onClick={(e) => e.stopPropagation()}>
        
        <button
          onClick={handleClose}
          className="absolute top-6 sm:top-8 right-6 sm:right-8 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 p-6 sm:p-8 border-b border-slate-100 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase border border-purple-200">
            <Calendar className="w-3.5 h-3.5" />
            <span>Manajemen Jadwal</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 font-serif pr-8">
            {editingJadwal ? 'Edit Jadwal Belajar' : 'Tambah Jadwal Baru'}
          </h3>
          <p className="text-xs text-slate-500">
            Atur jadwal bimbingan belajar untuk tentor dan siswa.
          </p>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-4">
        <form onSubmit={handleSubmit} id="jadwal-form" className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tentor / Pengajar *
            </label>
            <select
              required
              value={tentorId}
              onChange={(e) => setTentorId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
            >
              {tentors.map((t) => (
                <option key={t.id} value={t.id}>{t.nama}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Siswa (Pilih satu atau lebih) *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 rounded-xl border border-slate-200 bg-slate-50">
              {students.filter(s => s.status === 'aktif').map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white p-2 rounded-lg border border-transparent hover:border-slate-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={studentIds.includes(s.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setStudentIds([...studentIds, s.id]);
                      } else {
                        setStudentIds(studentIds.filter(id => id !== s.id));
                      }
                    }}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-slate-700 font-medium text-xs">{s.nama} <span className="text-slate-400">({s.kelas} {s.jenjang})</span></span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hari *</label>
              <select
                required
                value={hari}
                onChange={(e) => setHari(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
              >
                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jam Mulai *</label>
              <input
                type="time"
                required
                value={jamMulai}
                onChange={(e) => setJamMulai(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jam Selesai *</label>
              <input
                type="time"
                required
                value={jamSelesai}
                onChange={(e) => setJamSelesai(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mata Pelajaran *
            </label>
            <div className="relative">
              <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="Contoh: Matematika Kelas 5"
                value={mataPelajaran}
                onChange={(e) => setMataPelajaran(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ruangan (Opsional)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Contoh: Ruang A"
                value={ruangan}
                onChange={(e) => setRuangan(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
              />
            </div>
          </div>

  
        </form>
        </div>
        <div className="p-6 sm:px-8 sm:py-6 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0 bg-slate-50 rounded-b-3xl mt-auto">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              form="jadwal-form"
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Jadwal</span>
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
