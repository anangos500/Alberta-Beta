import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Image, Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student, WeeklyReport, WeeklyRatings } from '../../types';
import { uploadImageToSupabase } from '../../lib/imageUpload';
import { ConfirmModal } from './ConfirmModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedStudent?: Student | null;
  preselectedWeek?: number;
  editingReport?: WeeklyReport | null;
}

export const WeeklyReportFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  preselectedStudent,
  preselectedWeek,
  editingReport
}) => {
  const { students, currentUser, addWeeklyReport, updateWeeklyReport, reports } = useApp();

  // Active student list for selection (only active students)
  const activeStudents = students.filter((s) => s.status === 'aktif');

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [mingguKe, setMingguKe] = useState<number>(preselectedWeek || Math.ceil(new Date().getDate() / 7));

  const filteredStudents = activeStudents.filter((s) => {
    if (editingReport && editingReport.studentId === s.id) return true;
    return !reports.some(
      (r) => r.studentId === s.id && r.mingguKe === mingguKe && r.tentorId === currentUser?.id
    );
  });

  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [hari, setHari] = useState<string>('Selasa');
  const [mataPelajaran, setMataPelajaran] = useState<string>('Matematika & IPA');
  const [materi, setMateri] = useState<string>('');

  // 7 Ratings State
  const [ratings, setRatings] = useState<WeeklyRatings>({
    pemahamanMateri: 'Sangat Baik',
    kemampuanSoal: 'Tepat dan Cepat',
    keaktifan: 'Sangat Aktif',
    kemandirian: 'Mandiri',
    interaksi: 'Sangat Baik',
    sikap: 'Sangat Disiplin',
    keterampilanCatat: 'Rapi dan Lengkap',
  });

  const [targetBerikutnya, setTargetBerikutnya] = useState<string>('');
  const [saranTentor, setSaranTentor] = useState<string>('');

  const [photos, setPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const suggestedPhotos = React.useMemo(() => {
    if (!currentUser || currentUser.role !== 'tentor') return [];
    
    const currentTentorId = currentUser.id;
    const myReportsThisWeek = reports?.filter(r => 
      r.tentorId === currentTentorId && 
      r.mingguKe === Number(mingguKe) &&
      r.id !== editingReport?.id
    ) || [];

    const allPhotos = new Set<string>();
    myReportsThisWeek.forEach(r => {
      if (r.dokumentasiFoto) {
        r.dokumentasiFoto.forEach(photo => {
          if (photo && !photo.includes('unsplash.com')) {
            allPhotos.add(photo);
          }
        });
      }
    });
    
    return Array.from(allPhotos);
  }, [reports, currentUser, mingguKe, editingReport]);

  useEffect(() => {
    if (editingReport) {
      setSelectedStudentId(editingReport.studentId);
      setMingguKe(editingReport.mingguKe);
      setTanggal(editingReport.tanggalPembelajaran);
      setHari(editingReport.hari);
      setMataPelajaran(editingReport.mataPelajaran);
      setMateri(editingReport.materi);
      setRatings(editingReport.ratings);
      setTargetBerikutnya(editingReport.targetBerikutnya);
      setSaranTentor(editingReport.saranTentor);
      setPhotos(editingReport.dokumentasiFoto || []);
    } else if (preselectedStudent) {
      setSelectedStudentId(preselectedStudent.id);
      if (preselectedStudent.jenjang === 'SD') {
        setMataPelajaran('Matematika & Pendampingan PR SD');
      } else {
        setMataPelajaran('Fisika & Matematika SMP');
      }
    } else if (filteredStudents.length > 0) {
      setSelectedStudentId(filteredStudents[0].id);
    }
  }, [editingReport, preselectedStudent, isOpen]);

  useEffect(() => {
    // If the currently selected student is no longer in the filtered list (e.g. because mingguKe changed),
    // we should select the first available student or clear it.
    if (!editingReport) {
      const isValid = filteredStudents.some(s => s.id === selectedStudentId);
      if (!isValid && filteredStudents.length > 0) {
        setSelectedStudentId(filteredStudents[0].id);
      } else if (!isValid && filteredStudents.length === 0) {
        setSelectedStudentId('');
      }
    }
  }, [mingguKe, filteredStudents.length]);

  if (!isOpen) return null;

  const currentStudent = students.find((s) => s.id === selectedStudentId);

  const handleAddPresetPhoto = (url: string) => {
    if (photos.length >= 3) {
      alert('Maksimal 3 foto dokumentasi per laporan.');
      return;
    }
    setPhotos([...photos, url]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (photos.length >= 3) {
      alert('Maksimal 3 foto dokumentasi per laporan.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPhotos(prev => [...prev, previewUrl]);
    setPendingFiles(prev => ({ ...prev, [previewUrl]: file }));
    
    if (e.target) e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) {
      alert('Silakan pilih siswa terlebih dahulu.');
      return;
    }

    setIsUploading(true);
    let finalPhotos = [...photos];
    for (let i = 0; i < finalPhotos.length; i++) {
      const p = finalPhotos[i];
      if (pendingFiles[p]) {
        try {
          const publicUrl = await uploadImageToSupabase(pendingFiles[p]);
          if (publicUrl) {
            finalPhotos[i] = publicUrl;
            URL.revokeObjectURL(p);
          } else {
            alert('Gagal mengunggah foto ke Supabase.');
            setIsUploading(false);
            return;
          }
        } catch (e) {
             console.error(e);
             alert('Terjadi kesalahan saat mengunggah foto.');
             setIsUploading(false);
             return;
        }
      }
    }

    const reportData = {
      studentId: currentStudent.id,
      studentNama: currentStudent.nama,
      studentJenjang: currentStudent.jenjang,
      studentKelas: currentStudent.kelas,
      tentorId: currentUser?.id || 'T101',
      tentorNama: currentUser?.nama || 'Kak Alberta Fitriani, S.Pd.',
      mingguKe: Number(mingguKe),
      tanggalPembelajaran: tanggal,
      hari: hari,
      mataPelajaran: mataPelajaran,
      materi: materi || 'Pendampingan Soal & Ulangan Harian',
      ratings: ratings,
      targetBerikutnya: targetBerikutnya || 'Siswa diharapkan dapat menyelesaikan soal latihan secara mandiri.',
      saranTentor: saranTentor || 'Mohon melatih pengerjaan soal 10-15 menit setiap hari di rumah.',
      dokumentasiFoto: finalPhotos,
    };

    if (editingReport) {
      updateWeeklyReport({
        ...reportData,
        id: editingReport.id,
        createdDate: editingReport.createdDate
      });
    } else {
      addWeeklyReport(reportData);
    }

    setIsUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-sm border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-full" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 p-6 sm:p-8 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase mb-1 border border-teal-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Formulir Tentor Alberta</span>
            </div>
            <h3 className="text-xl font-bold text-stone-800 font-serif">
              {editingReport ? 'Edit Laporan Belajar Mingguan' : 'Input Laporan Perkembangan Belajar Mingguan'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
        <form id="report-form" onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION A: Informasi Pembelajaran */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
            <h4 className="font-bold text-stone-800 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-stone-200 pb-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs border border-teal-200">A</span>
              Informasi Pembelajaran
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Pilih Siswa Bimbel *
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                >
                  {filteredStudents.length === 0 && (
                    <option value="" disabled>Semua siswa sudah dinilai minggu ini</option>
                  )}
                  {filteredStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.jenjang} Kelas {s.kelas})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Minggu Ke- *
                </label>
                <select
                  value={mingguKe}
                  onChange={(e) => setMingguKe(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                >
                  <option value={1}>Minggu ke-1</option>
                  <option value={2}>Minggu ke-2</option>
                  <option value={3}>Minggu ke-3</option>
                  <option value={4}>Minggu ke-4</option>
                  <option value={5}>Minggu ke-5</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Tanggal Pembelajaran *
                </label>
                <input
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Hari *</label>
                <select
                  value={hari}
                  onChange={(e) => setHari(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                >
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Mata Pelajaran *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Matematika & Pendampingan PR"
                  value={mataPelajaran}
                  onChange={(e) => setMataPelajaran(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Materi Dipelajari *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pecahan Campuran & Perkalian"
                  value={materi}
                  onChange={(e) => setMateri(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION B: Penilaian Perkembangan Belajar (7 Aspek) */}
          <div className="space-y-6">
            <h4 className="font-bold text-stone-800 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-stone-200 pb-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs border border-teal-200">B</span>
              Penilaian Perkembangan Belajar (7 Aspek)
            </h4>

            {/* 1. Pemahaman Materi */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800">
                1. Pemahaman Materi *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Sangat Baik', 'Baik', 'Cukup', 'Perlu Bimbingan'] as const).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setRatings({ ...ratings, pemahamanMateri: opt })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                      ratings.pemahamanMateri === opt
                        ? 'bg-teal-200 text-teal-900 border-teal-300'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Kemampuan Mengerjakan Soal */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800">
                2. Kemampuan Mengerjakan Soal *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(
                  [
                    'Tepat dan Cepat',
                    'Tepat namun Masih Membutuhkan Waktu',
                    'Cukup Tepat',
                    'Masih Perlu Latihan',
                  ] as const
                ).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setRatings({ ...ratings, kemampuanSoal: opt })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-left cursor-pointer ${
                      ratings.kemampuanSoal === opt
                        ? 'bg-teal-200 text-teal-900 border-teal-300'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    • {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Keaktifan Saat Belajar */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800">
                3. Keaktifan Saat Belajar *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Sangat Aktif', 'Aktif', 'Cukup Aktif', 'Kurang Aktif'] as const).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setRatings({ ...ratings, keaktifan: opt })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                      ratings.keaktifan === opt
                        ? 'bg-teal-200 text-teal-900 border-teal-300'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Kemandirian Belajar */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800">
                4. Kemandirian Belajar *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Sangat Mandiri', 'Mandiri', 'Kadang Masih Dibantu', 'Masih Memerlukan Pendampingan'] as const).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setRatings({ ...ratings, kemandirian: opt })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                      ratings.kemandirian === opt
                        ? 'bg-teal-200 text-teal-900 border-teal-300'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Interaksi dengan Tentor dan Teman */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800">
                5. Interaksi dengan Tentor dan Teman *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Sangat Baik', 'Baik', 'Cukup', 'Perlu Pendampingan'] as const).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setRatings({ ...ratings, interaksi: opt })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                      ratings.interaksi === opt
                        ? 'bg-teal-200 text-teal-900 border-teal-300'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Sikap Selama Pembelajaran */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800">
                6. Sikap Selama Pembelajaran *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Sangat Disiplin', 'Disiplin', 'Cukup Disiplin', 'Perlu Diingatkan'] as const).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setRatings({ ...ratings, sikap: opt })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                      ratings.sikap === opt
                        ? 'bg-teal-200 text-teal-900 border-teal-300'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 7. Keterampilan Mencatat Materi */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800">
                7. Keterampilan Mencatat Materi *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(
                  [
                    'Cepat, Rapi, dan Lengkap',
                    'Rapi dan Lengkap',
                    'Cukup Lengkap, Masih Perlu Meningkatkan Kecepatan',
                    'Masih Memerlukan Pendampingan dalam Mencatat',
                  ] as const
                ).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setRatings({ ...ratings, keterampilanCatat: opt })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-left cursor-pointer ${
                      ratings.keterampilanCatat === opt
                        ? 'bg-teal-200 text-teal-900 border-teal-300'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    • {opt}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* SECTION C: Target Belajar Minggu Berikutnya */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-800 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-stone-200 pb-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs border border-teal-200">C</span>
              Target Belajar Minggu Berikutnya
            </h4>
            <textarea
              rows={3}
              value={targetBerikutnya}
              onChange={(e) => setTargetBerikutnya(e.target.value)}
              placeholder="Contoh: Siswa diharapkan mampu menyelesaikan soal pecahan campuran secara mandiri."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 placeholder:text-stone-400"
            />
            <p className="text-[11px] text-stone-500 italic">
              Hint: Tuliskan capaian materi/keterampilan spesifik yang akan dilatih di minggu depan.
            </p>
          </div>

          {/* SECTION D: Saran Tentor */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-800 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-stone-200 pb-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs border border-teal-200">D</span>
              Saran Tentor untuk Orang Tua
            </h4>
            <textarea
              rows={3}
              value={saranTentor}
              onChange={(e) => setSaranTentor(e.target.value)}
              placeholder="Contoh: Mohon melatih perkalian 1-10 selama 10-15 menit setiap hari di rumah agar ketelitian perhitungannya semakin terasah."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 placeholder:text-stone-400"
            />
            <p className="text-[11px] text-stone-500 italic">
              Hint: Berikan pesan pendampingan praktis untuk dipraktikkan Orang Tua di rumah.
            </p>
          </div>

          {/* SECTION E: Dokumentasi Pembelajaran */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-800 text-sm uppercase tracking-wider flex items-center justify-between border-b border-stone-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs border border-teal-200">E</span>
                <span>Dokumentasi Pembelajaran (Maksimal 3 Foto)</span>
              </div>
              <span className="text-xs font-normal text-stone-500">{photos.length}/3 Foto Tersimpan</span>
            </h4>

            {/* Photo List */}
            <div className="grid grid-cols-3 gap-3">
              {photos.map((p, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden border border-stone-200 h-28 group">
                  <img src={p || undefined} alt="Dokumentasi" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full text-xs shadow-sm opacity-90 hover:opacity-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Suggested Photos from Current Week */}
            {photos.length < 3 && suggestedPhotos.length > 0 && (
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 mt-2">
                <div className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-stone-500" />
                  Foto dokumentasi yang telah Anda unggah di minggu ini:
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedPhotos.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPresetPhoto(url)}
                      className="group relative w-16 h-16 rounded-xl overflow-hidden border-2 border-transparent hover:border-teal-500 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <img src={url || undefined} alt={`Suggested ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xl font-bold">+</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom File Option */}
            {photos.length < 3 && (
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={handleFileUpload}
                  className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer disabled:opacity-50"
                />
                {isUploading && <Loader2 className="w-5 h-5 text-teal-500 animate-spin shrink-0" />}
              </div>
            )}
          </div>

        </form>

        {/* Modal Footer */}
        </div>
        <div className="p-6 sm:px-8 sm:py-6 border-t border-stone-200 flex items-center justify-between shrink-0 bg-stone-50 rounded-b-3xl mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 text-xs transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            type="submit"
            form="report-form"
            disabled={isUploading || (!selectedStudentId)}
            className="px-6 py-2.5 rounded-xl font-bold text-teal-900 bg-teal-200 hover:bg-teal-300 shadow-sm transition-all text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Laporan Perkembangan</span>
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
