import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Image, Sparkles, CheckCircle, AlertCircle, Loader2, Plus } from 'lucide-react';
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
  const { students, currentUser, addWeeklyReport, updateWeeklyReport, reports, jadwalList } = useApp();

  // Get student IDs assigned to this tentor via Jadwal
  const myJadwal = jadwalList.filter(j => j.tentorId === currentUser?.id);
  const myJadwalStudentIds = new Set(myJadwal.flatMap(j => j.studentIds || []));

  // Active student list for selection (only active students assigned to this tentor)
  const activeStudents = students.filter((s) => s.status === 'aktif' && myJadwalStudentIds.has(s.id));

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [mingguKe, setMingguKe] = useState<number>(preselectedWeek || Math.ceil(new Date().getDate() / 7));

  const filteredStudents = activeStudents.filter((s) => {
    if (editingReport && editingReport.studentId === s.id) return true;
    return !reports.some(
      (r) => r.studentId === s.id && r.mingguKe === mingguKe && r.tentorId === currentUser?.id
    );
  });

  const [bulan, setBulan] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [hari, setHari] = useState<string>('Selasa');
  const [mataPelajaran, setMataPelajaran] = useState<string>('Matematika & IPA');
  const [materi, setMateri] = useState<string>('');

  // Ratings State
  const [ratings, setRatings] = useState<WeeklyRatings>({
    subjects: [
      {
        mataPelajaran: '',
        pemahamanMateri: 'Sangat Baik',
        kemampuanSoal: 'Tepat dan Cepat',
        keaktifan: 'Sangat Aktif',
        kemandirian: 'Sangat Mandiri',
        interaksi: 'Sangat Baik',
        sikap: 'Sangat Disiplin',
        keterampilanCatat: 'Cepat, Rapi, dan Lengkap',
      }
    ]
  });

  const [targetBerikutnya, setTargetBerikutnya] = useState<string>('');
  const [saranTentor, setSaranTentor] = useState<string>('');

  const [photos, setPhotos] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  // Templates
  const [targetTemplates, setTargetTemplates] = useState<string[]>([]);
  const [saranTemplates, setSaranTemplates] = useState<string[]>([]);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      try {
        const storedTarget = localStorage.getItem(`targetTemplates_${currentUser.id}`);
        if (storedTarget) setTargetTemplates(JSON.parse(storedTarget));
        const storedSaran = localStorage.getItem(`saranTemplates_${currentUser.id}`);
        if (storedSaran) setSaranTemplates(JSON.parse(storedSaran));
      } catch (e) {
        console.error('Failed to parse templates', e);
      }
    }
  }, [currentUser]);

  const handleSaveTemplate = (type: 'target' | 'saran', text: string) => {
    if (!text.trim() || !currentUser) return;
    if (type === 'target') {
      const newTemplates = [text, ...targetTemplates.filter(t => t !== text)].slice(0, 3);
      setTargetTemplates(newTemplates);
      localStorage.setItem(`targetTemplates_${currentUser.id}`, JSON.stringify(newTemplates));
    } else {
      const newTemplates = [text, ...saranTemplates.filter(t => t !== text)].slice(0, 3);
      setSaranTemplates(newTemplates);
      localStorage.setItem(`saranTemplates_${currentUser.id}`, JSON.stringify(newTemplates));
    }
  };

  const handleRemoveTemplate = (type: 'target' | 'saran', index: number) => {
    if (!currentUser) return;
    if (type === 'target') {
      const newTemplates = [...targetTemplates];
      newTemplates.splice(index, 1);
      setTargetTemplates(newTemplates);
      localStorage.setItem(`targetTemplates_${currentUser.id}`, JSON.stringify(newTemplates));
    } else {
      const newTemplates = [...saranTemplates];
      newTemplates.splice(index, 1);
      setSaranTemplates(newTemplates);
      localStorage.setItem(`saranTemplates_${currentUser.id}`, JSON.stringify(newTemplates));
    }
  };

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
      if (editingReport.tanggalPembelajaran && editingReport.tanggalPembelajaran.length >= 7) {
        setBulan(editingReport.tanggalPembelajaran.substring(0, 7));
      }
      setTanggal(editingReport.tanggalPembelajaran);
      setHari(editingReport.hari);
      setMataPelajaran(editingReport.mataPelajaran);
      setMateri(editingReport.materi);
      const loadedRatings = editingReport.ratings;
      if (!loadedRatings.subjects || loadedRatings.subjects.length === 0) {
        // Fallback for legacy reports
        setRatings({
          ...loadedRatings,
          subjects: [
            {
              mataPelajaran: editingReport.mataPelajaran || '',
              pemahamanMateri: loadedRatings.pemahamanMateri || 'Sangat Baik',
              kemampuanSoal: loadedRatings.kemampuanSoal || 'Tepat dan Cepat',
              keaktifan: loadedRatings.keaktifan || 'Sangat Aktif',
              kemandirian: loadedRatings.kemandirian || 'Sangat Mandiri',
              interaksi: loadedRatings.interaksi || 'Sangat Baik',
              sikap: loadedRatings.sikap || 'Sangat Disiplin',
              keterampilanCatat: loadedRatings.keterampilanCatat || 'Cepat, Rapi, dan Lengkap',
            }
          ]
        });
      } else {
        setRatings(loadedRatings);
      }
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
    
    // Reset pending files
    setPendingFiles({});
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

  const handleAddSubject = () => {
    const subjects = ratings.subjects || [];
    setRatings({
      ...ratings,
      subjects: [
        ...subjects,
        {
          mataPelajaran: '',
          pemahamanMateri: 'Sangat Baik',
          kemampuanSoal: 'Tepat dan Cepat',
          keaktifan: 'Sangat Aktif',
          kemandirian: 'Sangat Mandiri',
          interaksi: 'Sangat Baik',
          sikap: 'Sangat Disiplin',
          keterampilanCatat: 'Cepat, Rapi, dan Lengkap',
        }
      ]
    });
  };

  const handleRemoveSubject = (index: number) => {
    const subjects = ratings.subjects || [];
    if (subjects.length <= 1) return; // minimal 1
    const newSubjects = [...subjects];
    newSubjects.splice(index, 1);
    setRatings({ ...ratings, subjects: newSubjects });
  };

  const handleSubjectChange = (index: number, field: string, value: string) => {
    const subjects = ratings.subjects || [];
    const newSubjects = [...subjects];
    newSubjects[index] = {
      ...newSubjects[index],
      [field]: value
    };
    setRatings({ ...ratings, subjects: newSubjects });
  };

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
    
    // Upload files in parallel
    const uploadPromises = finalPhotos.map(async (p, i) => {
      if (pendingFiles[p]) {
        try {
          const publicUrl = await uploadImageToSupabase(pendingFiles[p]);
          if (publicUrl) {
            finalPhotos[i] = publicUrl;
            URL.revokeObjectURL(p);
            return true;
          } else {
            return false;
          }
        } catch (e) {
          console.error(e);
          return false;
        }
      }
      return true; // No upload needed
    });

    const results = await Promise.all(uploadPromises);
    
    if (results.some(r => !r)) {
      alert('Gagal mengunggah beberapa foto ke Supabase.');
      setIsUploading(false);
      return;
    }

    const reportData = {
      studentId: currentStudent.id,
      studentNama: currentStudent.nama,
      studentJenjang: currentStudent.jenjang,
      studentKelas: currentStudent.kelas,
      tentorId: currentUser?.id || '',
      tentorNama: currentUser?.nama || 'Kak Alberta Fitriani, S.Pd.',
      mingguKe: Number(mingguKe),
      tanggalPembelajaran: bulan,
      hari: hari,
      mataPelajaran: ratings.subjects ? ratings.subjects.map(s => s.mataPelajaran).filter(m => m.trim() !== '').join(', ') : (mataPelajaran || '-'),
      materi: '-',
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
      <div className={`bg-white rounded-3xl w-full shadow-sm border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-full ${
        (ratings.subjects || []).length > 3 ? 'max-w-7xl 2xl:max-w-[95vw]' : 'max-w-4xl'
      }`} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 p-6 sm:p-8 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase mb-1 border border-teal-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Formulir Tentor Alberta</span>
            </div>
            <h3 className="text-xl font-bold text-stone-800 font-serif">
              {editingReport ? 'Edit Laporan Belajar Bulanan' : 'Input Laporan Perkembangan Belajar Bulanan'}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <option value="" disabled>Semua siswa sudah dinilai bulan ini</option>
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
                  Bulan *
                </label>
                <input
                  type="month"
                  required
                  value={bulan}
                  onChange={(e) => setBulan(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION B: Penilaian Perkembangan Belajar */}
          <div className="space-y-6">
            <h4 className="font-bold text-stone-800 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-stone-200 pb-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs border border-teal-200">B</span>
              Penilaian Perkembangan Belajar
            </h4>

            {/* Subject Specific Ratings */}
            <div className="space-y-4">
              <h5 className="font-bold text-stone-700 text-sm border-b border-stone-200 pb-2 flex items-center justify-between">
                <div className="flex flex-col">
                  <span>Penilaian Per Mata Pelajaran</span>
                  <span className="text-[10px] font-normal text-stone-500 mt-1">
                    Keterangan: <strong className="font-bold text-stone-700">SB</strong> (Sangat Baik), <strong className="font-bold text-stone-700">B</strong> (Baik), <strong className="font-bold text-stone-700">C</strong> (Cukup), <strong className="font-bold text-stone-700">PB</strong> (Perlu Bimbingan)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="text-xs text-teal-600 font-bold hover:text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 shrink-0 ml-2"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Mapel
                </button>
              </h5>
              
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
                {(ratings.subjects || []).map((subject, index) => (
                  <div key={index} className={`flex-none w-[85vw] md:w-[calc(33.333%-0.66rem)] ${ratings.subjects!.length > 3 ? 'lg:w-[calc(20%-0.8rem)]' : ''} p-3 bg-blue-50/50 border border-stone-200 rounded-xl relative space-y-3 snap-start`}>
                    {ratings.subjects!.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(index)}
                        className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 bg-white shadow-sm p-1 rounded-full transition-colors z-10"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    
                    <div className="mb-2 bg-blue-100/50 -mt-3 -mx-3 p-3 rounded-t-xl border-b border-blue-100">
                      <input
                        type="text"
                        required
                        placeholder="Mata Pelajaran..."
                        value={subject.mataPelajaran}
                        onChange={(e) => handleSubjectChange(index, 'mataPelajaran', e.target.value)}
                        className="w-full font-bold text-center bg-transparent border-none focus:ring-0 p-0 text-sm placeholder:font-normal placeholder:text-stone-400"
                      />
                    </div>

                    {[
                      { 
                        key: 'pemahamanMateri', 
                        label: 'Pemahaman Materi', 
                        options: ['Sangat Baik', 'Baik', 'Cukup', 'Perlu Bimbingan'] 
                      },
                      { 
                        key: 'kemampuanSoal', 
                        label: 'Kemampuan Soal', 
                        options: ['Tepat dan Cepat', 'Tepat namun Masih Membutuhkan Waktu', 'Cukup Tepat', 'Masih Perlu Latihan'] 
                      },
                      { 
                        key: 'keaktifan', 
                        label: 'Keaktifan', 
                        options: ['Sangat Aktif', 'Aktif', 'Cukup Aktif', 'Kurang Aktif'] 
                      },
                      { 
                        key: 'kemandirian', 
                        label: 'Kemandirian', 
                        options: ['Sangat Mandiri', 'Mandiri', 'Kadang Masih Dibantu', 'Masih Memerlukan Pendampingan'] 
                      },
                      { 
                        key: 'interaksi', 
                        label: 'Interaksi', 
                        options: ['Sangat Baik', 'Baik', 'Cukup', 'Perlu Pendampingan'] 
                      },
                      { 
                        key: 'sikap', 
                        label: 'Sikap', 
                        options: ['Sangat Disiplin', 'Disiplin', 'Cukup Disiplin', 'Perlu Diingatkan'] 
                      },
                      { 
                        key: 'keterampilanCatat', 
                        label: 'Mencatat', 
                        options: ['Cepat, Rapi, dan Lengkap', 'Rapi dan Lengkap', 'Cukup Lengkap, Masih Perlu Meningkatkan Kecepatan', 'Masih Memerlukan Pendampingan dalam Mencatat'] 
                      },
                    ].map((field) => (
                      <div key={field.key} className="space-y-1.5 bg-white p-2 rounded-lg border border-stone-100">
                        <label className="block text-[10px] font-bold text-stone-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span> {field.label}
                        </label>
                        <div className="grid grid-cols-4 gap-1">
                          {(['SB', 'B', 'C', 'PB']).map((abbr, i) => {
                            const opt = field.options[i];
                            const isSelected = subject[field.key as keyof typeof subject] === opt;
                            return (
                              <button
                                type="button"
                                key={abbr}
                                onClick={() => handleSubjectChange(index, field.key, opt)}
                                className={`py-1 rounded text-[10px] font-bold transition-all border text-center cursor-pointer ${
                                  isSelected
                                    ? 'bg-yellow-400 text-yellow-900 border-yellow-500 shadow-sm'
                                    : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
                                }`}
                                title={opt}
                              >
                                {abbr}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION C: Target Belajar Bulan Berikutnya */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-800 text-sm uppercase tracking-wider flex items-center justify-between border-b border-stone-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs border border-teal-200">C</span>
                Target Belajar Bulan Berikutnya
              </div>
              <button
                type="button"
                onClick={() => handleSaveTemplate('target', targetBerikutnya)}
                disabled={!targetBerikutnya.trim()}
                className="text-[10px] sm:text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Jadikan Template
              </button>
            </h4>
            
            {targetTemplates.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-1">
                {targetTemplates.map((template, idx) => (
                  <div key={idx} className="flex items-center bg-stone-100 border border-stone-200 rounded-lg group">
                    <button
                      type="button"
                      onClick={() => setTargetBerikutnya(template)}
                      className="px-3 py-1.5 text-xs text-stone-700 hover:text-stone-900 text-left truncate max-w-[200px] sm:max-w-[300px]"
                      title={template}
                    >
                      {template}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveTemplate('target', idx)}
                      className="p-1.5 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-r-lg border-l border-stone-200 transition-colors"
                      title="Hapus template"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <textarea
              rows={3}
              value={targetBerikutnya}
              onChange={(e) => setTargetBerikutnya(e.target.value)}
              placeholder="Contoh: Siswa diharapkan mampu menyelesaikan soal pecahan campuran secara mandiri."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 placeholder:text-stone-400"
            />
            <p className="text-[11px] text-stone-500 italic">
              Hint: Tuliskan capaian materi/keterampilan spesifik yang akan dilatih di bulan depan.
            </p>
          </div>

          {/* SECTION D: Saran Tentor */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-800 text-sm uppercase tracking-wider flex items-center justify-between border-b border-stone-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs border border-teal-200">D</span>
                Saran Tentor untuk Orang Tua
              </div>
              <button
                type="button"
                onClick={() => handleSaveTemplate('saran', saranTentor)}
                disabled={!saranTentor.trim()}
                className="text-[10px] sm:text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Jadikan Template
              </button>
            </h4>
            
            {saranTemplates.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-1">
                {saranTemplates.map((template, idx) => (
                  <div key={idx} className="flex items-center bg-stone-100 border border-stone-200 rounded-lg group">
                    <button
                      type="button"
                      onClick={() => setSaranTentor(template)}
                      className="px-3 py-1.5 text-xs text-stone-700 hover:text-stone-900 text-left truncate max-w-[200px] sm:max-w-[300px]"
                      title={template}
                    >
                      {template}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveTemplate('saran', idx)}
                      className="p-1.5 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-r-lg border-l border-stone-200 transition-colors"
                      title="Hapus template"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

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
                  Foto dokumentasi yang telah Anda unggah di bulan ini:
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
