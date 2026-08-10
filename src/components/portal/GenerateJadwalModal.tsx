import React, { useState } from 'react';
import { X, Calendar, Wand2, Save, Trash, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { defaultJadwalTemplates } from '../../data/jadwalTemplates';
import { Student, TemplateProgramTipe } from '../../types';

interface Props {
  onClose: () => void;
}

export const GenerateJadwalModal: React.FC<Props> = ({ onClose }) => {
  const { students, tentors, addJadwal, jadwalList } = useApp();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedJenjang, setSelectedJenjang] = useState<'TK' | 'SD' | 'SMP' | ''>('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [bulanProgram, setBulanProgram] = useState<number>(1);
  const [opsiHari, setOpsiHari] = useState<'Gelombang 1' | 'Gelombang 2'>('Gelombang 1'); // Only for SD
  
  const [generatedSchedules, setGeneratedSchedules] = useState<any[]>([]);
  
  const [globalJamMulai, setGlobalJamMulai] = useState('15:00');
  const [globalJamSelesai, setGlobalJamSelesai] = useState('16:30');
  const [globalRuangan, setGlobalRuangan] = useState('Ruang 1');
  const [globalTentorId, setGlobalTentorId] = useState('');
  const [showAutoSelectMenu, setShowAutoSelectMenu] = useState(false);

  const scheduledStudentIds = new Set(jadwalList?.flatMap(j => j.studentIds) || []);
  const availableStudents = students.filter(s => 
    s.status === 'aktif' && 
    s.jenjang === selectedJenjang && 
    !scheduledStudentIds.has(s.id)
  );

  const handleAutoSelect = (mode: 'smart' | 'random') => {
    setShowAutoSelectMenu(false);
    const countInput = document.getElementById('autoSelectCount') as HTMLInputElement;
    const count = parseInt(countInput.value, 10);
    
    if (!count || count <= 0) {
      alert("Masukkan jumlah maksimal siswa terlebih dahulu.");
      return;
    }

    if (mode === 'random') {
      const shuffled = [...availableStudents].sort(() => 0.5 - Math.random());
      setSelectedStudentIds(shuffled.slice(0, count).map(s => s.id));
    } else if (mode === 'smart') {
      const groups: Record<number, typeof availableStudents> = {};
      availableStudents.forEach(s => {
        if (!groups[s.kelas]) groups[s.kelas] = [];
        groups[s.kelas].push(s);
      });
      
      const sortedGroups = Object.values(groups).sort((a, b) => b.length - a.length);
      
      if (sortedGroups.length > 0) {
         setSelectedStudentIds(sortedGroups[0].slice(0, count).map(s => s.id));
      }
    }
  };

  const selectedStudents = students.filter(s => selectedStudentIds.includes(s.id));

  const determineProgramTipe = (student: Student): TemplateProgramTipe | null => {
    if (student.jenjang === 'TK') return 'TK';
    if (student.jenjang === 'SD') {
      if (student.kelas >= 1 && student.kelas <= 2) return 'SD 1-2';
      if (student.kelas >= 3 && student.kelas <= 6) return 'SD 3-6';
    }
    if (student.jenjang === 'SMP') {
      // Simplification: we don't have 7A/7B in student data directly. Let's just use 7A for now, or add a field later.
      if (student.kelas === 7) return 'SMP 7A';
      if (student.kelas === 8) return 'SMP 8';
      if (student.kelas === 9) return 'SMP 9';
    }
    return null;
  };

  const handleGenerate = () => {
    if (selectedStudentIds.length === 0) return;
    
    const programTipe = determineProgramTipe(selectedStudents[0]);
    if (!programTipe) {
      alert("Tidak dapat menentukan program template untuk siswa ini.");
      return;
    }
    
    const template = defaultJadwalTemplates.find(t => t.program === programTipe && t.bulanBerlaku.includes(bulanProgram));
    if (!template) {
      alert(`Tidak ada template yang cocok untuk program ${programTipe} pada bulan ke-${bulanProgram}`);
      return;
    }

    const isGelombang1 = opsiHari === 'Gelombang 1';
    
    let hariAvailable: string[] = [];
    if (programTipe === 'TK') {
      hariAvailable = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    } else if (programTipe.startsWith('SD')) {
      hariAvailable = isGelombang1 ? ['Senin', 'Selasa', 'Rabu'] : ['Kamis', 'Jumat', 'Sabtu'];
    } else if (programTipe.startsWith('SMP')) {
      hariAvailable = ['Senin', 'Selasa', 'Rabu']; // Simplification for SMP as per doc
    }

    const results = [];
    
    for (let m = 1; m <= 4; m++) {
      const minggu = m.toString();
      const polaMinggu = template.mingguan[minggu];
      if (!polaMinggu) continue;

      for (const h of hariAvailable) {
        let mapel = polaMinggu[h.toLowerCase() as keyof typeof polaMinggu];
        if (mapel) {
          results.push({
            mingguKe: m,
            hari: h,
            mataPelajaran: mapel,
            jamMulai: '15:00',
            jamSelesai: '16:30',
            ruangan: '',
            tentorId: ''
          });
        }
      }
    }
    
    setGeneratedSchedules(results);
    setStep(2);
  };
  
  const applyGlobalSettings = () => {
    setGeneratedSchedules(prev => prev.map(s => ({
      ...s,
      jamMulai: globalJamMulai || s.jamMulai,
      jamSelesai: globalJamSelesai || s.jamSelesai,
      ruangan: globalRuangan || s.ruangan,
      tentorId: globalTentorId || s.tentorId
    })));
  };

  const handleSave = () => {
    if (generatedSchedules.some(s => !s.tentorId)) {
      alert("Silakan lengkapi pilihan tentor untuk semua jadwal.");
      return;
    }
    
    generatedSchedules.forEach(s => {
      addJadwal({
        studentIds: selectedStudentIds,
        tentorId: s.tentorId,
        hari: s.hari,
        jamMulai: s.jamMulai,
        jamSelesai: s.jamSelesai,
        mataPelajaran: s.mataPelajaran,
        ruangan: s.ruangan
      });
    });
    
    alert("Jadwal berhasil di-generate dan disimpan!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-sm border border-stone-200 flex flex-col max-h-full" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold uppercase tracking-widest mb-1.5 border border-teal-200">
              <Wand2 className="w-3.5 h-3.5" />
              <span>Generator Jadwal</span>
            </div>
            <h3 className="text-xl font-bold text-stone-800 font-serif">
              Generate Jadwal Otomatis
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Pilih Tingkatan (Jenjang)</label>
                  <select 
                    value={selectedJenjang} 
                    onChange={e => {
                      setSelectedJenjang(e.target.value as 'TK' | 'SD' | 'SMP');
                      setSelectedStudentIds([]); // Reset selected students when jenjang changes
                    }}
                    className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 mb-4"
                  >
                    <option value="">-- Pilih Tingkatan --</option>
                    <option value="TK">TK</option>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                  </select>

                  {selectedJenjang && (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-1.5">
                        <label className="block text-sm font-bold text-stone-700">Pilih Siswa (Bisa Lebih Dari Satu)</label>
                        
                        {availableStudents.length > 0 && (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              max={availableStudents.length}
                              placeholder="Jml Max"
                              className="w-24 rounded-lg border border-stone-200 px-3 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                              id="autoSelectCount"
                            />
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setShowAutoSelectMenu(!showAutoSelectMenu)}
                                className="px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold rounded-lg border border-teal-200 transition-colors flex items-center gap-1"
                              >
                                Pilih Otomatis <ChevronDown className="w-3 h-3" />
                              </button>
                              {showAutoSelectMenu && (
                                <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-stone-200 rounded-lg shadow-lg z-10 py-1">
                                  <button
                                    type="button"
                                    onClick={() => handleAutoSelect('smart')}
                                    className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 font-bold border-b border-stone-100"
                                  >
                                    Pengelompokan Siswa (Smart Grouping)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAutoSelect('random')}
                                    className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 font-bold"
                                  >
                                    Acak Menyesuaikan Porsi Jenjang
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="border border-stone-200 rounded-xl max-h-48 overflow-y-auto p-2 bg-white">
                        {availableStudents.map(s => (
                          <label key={s.id} className="flex items-center gap-3 p-2 hover:bg-stone-50 rounded-lg cursor-pointer transition-colors">
                            <input 
                              type="checkbox" 
                              checked={selectedStudentIds.includes(s.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedStudentIds(prev => [...prev, s.id]);
                                } else {
                                  setSelectedStudentIds(prev => prev.filter(id => id !== s.id));
                                }
                              }}
                              className="w-4 h-4 text-teal-600 rounded border-stone-300 focus:ring-teal-500"
                            />
                            <span className="text-sm text-stone-700">{s.nama} <span className="text-stone-400">({s.jenjang} - Kelas {s.kelas})</span></span>
                          </label>
                        ))}
                        {availableStudents.length === 0 && (
                          <div className="p-4 text-center text-sm text-stone-500">Tidak ada siswa {selectedJenjang} yang belum terdaftar di jadwal.</div>
                        )}
                      </div>
                      {selectedStudentIds.length > 0 && (
                        <p className="text-xs text-teal-600 mt-2 font-medium">
                          {selectedStudentIds.length} siswa dipilih
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Bulan Pelaksanaan</label>
                  <select 
                    value={bulanProgram} 
                    onChange={e => setBulanProgram(Number(e.target.value))}
                    className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map(m => (
                      <option key={m} value={m}>Bulan ke-{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {selectedStudents[0]?.jenjang === 'SD' && (
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Opsi Hari (SD)</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="opsiHari" 
                        value="Gelombang 1"
                        checked={opsiHari === 'Gelombang 1'}
                        onChange={() => setOpsiHari('Gelombang 1')}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm">Gelombang 1 (Senin, Selasa, Rabu)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="opsiHari" 
                        value="Gelombang 2"
                        checked={opsiHari === 'Gelombang 2'}
                        onChange={() => setOpsiHari('Gelombang 2')}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm">Gelombang 2 (Kamis, Jumat, Sabtu)</span>
                    </label>
                  </div>
                </div>
              )}
              
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={selectedStudentIds.length === 0}
                  className="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold disabled:opacity-50 hover:bg-teal-700 transition-colors flex items-center gap-2"
                >
                  <Wand2 className="w-5 h-5" />
                  Generate 12 Pertemuan
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <h4 className="font-bold text-sm mb-3">Terapkan Pengaturan Masal</h4>
                <div className="flex flex-wrap gap-4 items-end">
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Jam Mulai</label>
                    <input type="time" value={globalJamMulai} onChange={e => setGlobalJamMulai(e.target.value)} className="rounded-lg border border-stone-200 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Jam Selesai</label>
                    <input type="time" value={globalJamSelesai} onChange={e => setGlobalJamSelesai(e.target.value)} className="rounded-lg border border-stone-200 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Ruangan</label>
                    <input type="text" placeholder="Ruang..." value={globalRuangan} onChange={e => setGlobalRuangan(e.target.value)} className="rounded-lg border border-stone-200 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Tentor Pengajar</label>
                    <select value={globalTentorId} onChange={e => setGlobalTentorId(e.target.value)} className="rounded-lg border border-stone-200 px-3 py-2 text-sm">
                      <option value="">Pilih Tentor</option>
                      {tentors.map(t => (
                        <option key={t.id} value={t.id}>{t.nama}</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={applyGlobalSettings} className="px-4 py-2 rounded-lg bg-stone-800 text-white font-bold text-sm hover:bg-stone-900 transition-colors">
                    Terapkan Semua
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-stone-200 rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-stone-500 uppercase bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="px-4 py-3">Minggu</th>
                      <th className="px-4 py-3">Hari</th>
                      <th className="px-4 py-3">Mata Pelajaran</th>
                      <th className="px-4 py-3 w-28">Waktu</th>
                      <th className="px-4 py-3">Ruangan</th>
                      <th className="px-4 py-3">Tentor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {generatedSchedules.map((sch, i) => (
                      <tr key={i} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-4 py-2 text-center font-bold">{sch.mingguKe}</td>
                        <td className="px-4 py-2 font-medium">{sch.hari}</td>
                        <td className="px-4 py-2 font-bold text-teal-700">{sch.mataPelajaran}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-1">
                            <input type="time" value={sch.jamMulai} onChange={e => {
                              const newArr = [...generatedSchedules];
                              newArr[i].jamMulai = e.target.value;
                              setGeneratedSchedules(newArr);
                            }} className="w-full border-none p-1 text-xs bg-transparent focus:ring-1 focus:ring-teal-500 rounded" />
                            <span>-</span>
                            <input type="time" value={sch.jamSelesai} onChange={e => {
                              const newArr = [...generatedSchedules];
                              newArr[i].jamSelesai = e.target.value;
                              setGeneratedSchedules(newArr);
                            }} className="w-full border-none p-1 text-xs bg-transparent focus:ring-1 focus:ring-teal-500 rounded" />
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <input type="text" value={sch.ruangan} placeholder="Ruang" onChange={e => {
                            const newArr = [...generatedSchedules];
                            newArr[i].ruangan = e.target.value;
                            setGeneratedSchedules(newArr);
                          }} className="w-full border-b border-stone-200 p-1 text-sm bg-transparent focus:border-teal-500 focus:outline-none" />
                        </td>
                        <td className="px-4 py-2">
                          <select value={sch.tentorId} onChange={e => {
                            const newArr = [...generatedSchedules];
                            newArr[i].tentorId = e.target.value;
                            setGeneratedSchedules(newArr);
                          }} className="w-full border-none p-1 text-sm bg-transparent focus:ring-1 focus:ring-teal-500 rounded">
                            <option value="">Pilih...</option>
                            {tentors.map(t => (
                              <option key={t.id} value={t.id}>{t.nama}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-stone-200">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-stone-500 hover:text-stone-700 font-bold transition-colors"
                >
                  Kembali
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Simpan Jadwal Ke Database
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
