import React, { useState, useMemo } from 'react';
import { X, FileSpreadsheet, Calendar, Download, Check, FileText, Users, Clock, Filter } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Student, Tentor, WeeklyReport, Jadwal } from '../../types';

interface RekapitulasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  tentors: Tentor[];
  reports: WeeklyReport[];
  jadwals: Jadwal[];
}

export const RekapitulasiModal: React.FC<RekapitulasiModalProps> = ({
  isOpen,
  onClose,
  students,
  tentors,
  reports,
  jadwals
}) => {
  const [dateRange, setDateRange] = useState<'7days' | '1month' | 'all' | 'custom'>('7days');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  const [includeTentorSheet, setIncludeTentorSheet] = useState<boolean>(true);
  const [includeSiswaSheet, setIncludeSiswaSheet] = useState<boolean>(true);
  const [includeLaporanSheet, setIncludeLaporanSheet] = useState<boolean>(true);

  const { filteredReports, filteredTentorStats } = useMemo(() => {
    let startDate = new Date();
    let endDate = new Date();

    if (dateRange === '7days') {
      startDate.setDate(endDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    } else if (dateRange === '1month') {
      startDate.setMonth(endDate.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    } else if (dateRange === 'custom') {
      if (customStartDate) {
        startDate = new Date(customStartDate);
        startDate.setHours(0, 0, 0, 0);
      } else {
        startDate = new Date(0);
      }
      if (customEndDate) {
        endDate = new Date(customEndDate);
        endDate.setHours(23, 59, 59, 999);
      }
    } else {
      startDate = new Date(0);
    }

    const filteredReps = reports.filter(r => {
      if (dateRange === 'all') return true;
      const rd = new Date(r.tanggalPembelajaran);
      return rd >= startDate && rd <= endDate;
    });

    const tentorStats = tentors.map(tentor => {
      const tentorStudents = students.filter(s => s.tentorId === tentor.id);
      const siswaAktif = tentorStudents.filter(s => s.status === 'aktif').length;
      const siswaNonaktif = tentorStudents.filter(s => s.status === 'cuti').length;
      const totalSiswa = tentorStudents.length;

      const tentorReports = filteredReps.filter(r => r.tentorId === tentor.id);
      const jumlahLaporan = tentorReports.length;

      const tentorJadwals = jadwals.filter(j => j.tentorId === tentor.id);
      let totalMenit = 0;
      tentorJadwals.forEach(j => {
        const [startH, startM] = j.jamMulai.split(':').map(Number);
        const [endH, endM] = j.jamSelesai.split(':').map(Number);
        if (!isNaN(startH) && !isNaN(endH)) {
          const menitMulai = startH * 60 + (startM || 0);
          const menitSelesai = endH * 60 + (endM || 0);
          let multiplier = 1;
          if (dateRange === '7days') multiplier = 1;
          if (dateRange === '1month') multiplier = 4;
          if (dateRange === 'custom' || dateRange === 'all') {
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            multiplier = Math.max(1, Math.round(diffDays / 7));
          }
          
          let durasi = menitSelesai - menitMulai;
          if (durasi < 0) durasi += 24 * 60;
          totalMenit += durasi * multiplier;
        }
      });
      const jamMengajar = (totalMenit / 60).toFixed(1);

      return {
        ...tentor,
        siswaAktif,
        siswaNonaktif,
        totalSiswa,
        jumlahLaporan,
        jamMengajar
      };
    });

    return {
      filteredReports: filteredReps,
      filteredTentorStats: tentorStats
    };
  }, [dateRange, customStartDate, customEndDate, students, tentors, reports, jadwals]);

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();

    // 1. Sheet Rekapitulasi Tentor
    if (includeTentorSheet) {
      const tentorRows = filteredTentorStats.map((t, idx) => ({
        'No': idx + 1,
        'Nama Tentor': t.nama,
        'Gelar': t.gelar,
        'Spesialisasi': t.spesialisasi,
        'Lulusan': t.lulusan,
        'No. HP': t.noHp,
        'Siswa Aktif': t.siswaAktif,
        'Siswa Nonaktif': t.siswaNonaktif,
        'Total Siswa Binaan': t.totalSiswa,
        'Jumlah Laporan Submitted': t.jumlahLaporan,
        'Estimasi Jam Mengajar': `${t.jamMengajar} Jam`
      }));

      const wsTentor = XLSX.utils.json_to_sheet(tentorRows);
      wsTentor['!cols'] = [
        { wch: 5 }, { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 25 },
        { wch: 18 }, { wch: 12 }, { wch: 14 }, { wch: 18 }, { wch: 22 }, { wch: 20 }
      ];
      XLSX.utils.book_append_sheet(wb, wsTentor, 'Rekapitulasi Tentor');
    }

    // 2. Sheet Data Siswa
    if (includeSiswaSheet) {
      const studentRows = students.map((s, idx) => ({
        'No': idx + 1,
        'NIS': s.nis,
        'Nama Siswa': s.nama,
        'Jenjang': s.jenjang,
        'Kelas': `Kelas ${s.kelas}`,
        'Sekolah': s.sekolah,
        'Nama Orang Tua': s.namaOrangTua,
        'No. HP Orang Tua': s.noHpOrangTua,
        'Tentor Pendamping': s.tentorNama || '-',
        'Tanggal Daftar': s.tanggalDaftar || '-',
        'Status': s.status === 'aktif' ? 'Aktif' : 'Alumni (Nonaktif)'
      }));

      const wsSiswa = XLSX.utils.json_to_sheet(studentRows);
      wsSiswa['!cols'] = [
        { wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 10 }, { wch: 12 },
        { wch: 25 }, { wch: 22 }, { wch: 18 }, { wch: 25 }, { wch: 15 }, { wch: 15 }
      ];
      XLSX.utils.book_append_sheet(wb, wsSiswa, 'Data Siswa');
    }

    // 3. Sheet Detail Laporan
    if (includeLaporanSheet) {
      const reportRows = filteredReports.map((r, idx) => ({
        'No': idx + 1,
        'Tanggal Pembelajaran': r.tanggalPembelajaran,
        'Minggu Ke': `Minggu ${r.mingguKe}`,
        'Hari': r.hari || '-',
        'Nama Tentor': r.tentorNama,
        'Nama Siswa': r.studentNama,
        'Jenjang / Kelas': `${r.studentJenjang} Kelas ${r.studentKelas}`,
        'Mata Pelajaran': r.mataPelajaran,
        'Materi Pembelajaran': r.materi,
        'Pemahaman Materi': r.ratings?.pemahamanMateri || '-',
        'Kemampuan Soal': r.ratings?.kemampuanSoal || '-',
        'Keaktifan': r.ratings?.keaktifan || '-',
        'Kemandirian': r.ratings?.kemandirian || '-',
        'Interaksi': r.ratings?.interaksi || '-',
        'Sikap': r.ratings?.sikap || '-',
        'Catatan Siswa': r.ratings?.keterampilanCatat || '-',
        'Target Berikutnya': r.targetBerikutnya || '-',
        'Saran Tentor': r.saranTentor || '-'
      }));

      const wsLaporan = XLSX.utils.json_to_sheet(reportRows);
      wsLaporan['!cols'] = [
        { wch: 5 }, { wch: 20 }, { wch: 12 }, { wch: 10 }, { wch: 22 },
        { wch: 22 }, { wch: 18 }, { wch: 22 }, { wch: 30 }, { wch: 20 },
        { wch: 30 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 20 },
        { wch: 30 }, { wch: 30 }, { wch: 30 }
      ];
      XLSX.utils.book_append_sheet(wb, wsLaporan, 'Riwayat Laporan');
    }

    const labelDate = dateRange === '7days' ? '7_Hari' : dateRange === '1month' ? '1_Bulan' : dateRange === 'all' ? 'Semua' : 'Kustom';
    const filename = `Rekapitulasi_Belajar_Bimbel_Alberta_${labelDate}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-hidden" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90dvh] sm:max-h-[85vh] shadow-2xl overflow-hidden flex flex-col my-auto" onClick={e => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">Download Rekapitulasi Excel</h2>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate">Opsi ekspor data perkembangan belajar</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 sm:p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Download Options */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-slate-50/60 overflow-y-auto flex-1">
          
          {/* Rentang Waktu Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Pilih Rentang Waktu Laporan</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDateRange('7days')}
                className={`p-2.5 sm:p-3 rounded-xl border text-[11px] sm:text-xs font-extrabold transition-all text-left flex items-center justify-between ${
                  dateRange === '7days' 
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>7 Hari Terakhir</span>
                {dateRange === '7days' && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setDateRange('1month')}
                className={`p-2.5 sm:p-3 rounded-xl border text-[11px] sm:text-xs font-extrabold transition-all text-left flex items-center justify-between ${
                  dateRange === '1month' 
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>1 Bulan Terakhir</span>
                {dateRange === '1month' && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setDateRange('all')}
                className={`p-2.5 sm:p-3 rounded-xl border text-[11px] sm:text-xs font-extrabold transition-all text-left flex items-center justify-between ${
                  dateRange === 'all' 
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>Semua Waktu</span>
                {dateRange === 'all' && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setDateRange('custom')}
                className={`p-2.5 sm:p-3 rounded-xl border text-[11px] sm:text-xs font-extrabold transition-all text-left flex items-center justify-between ${
                  dateRange === 'custom' 
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>Rentang Kustom</span>
                {dateRange === 'custom' && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            </div>

            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-2 pt-2 animate-in fade-in duration-200">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Mulai Tanggal</label>
                  <input 
                    type="date" 
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Sampai Tanggal</label>
                  <input 
                    type="date" 
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Ringkasan Data Preview Badge */}
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">Ringkasan Data Terfilter</span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-purple-50/80 border border-purple-100">
                <span className="block text-base sm:text-lg font-black text-purple-700">{tentors.length}</span>
                <span className="text-[10px] font-bold text-purple-600">Tentor</span>
              </div>
              <div className="p-2 rounded-lg bg-blue-50/80 border border-blue-100">
                <span className="block text-base sm:text-lg font-black text-blue-700">{students.length}</span>
                <span className="text-[10px] font-bold text-blue-600">Siswa</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-100">
                <span className="block text-base sm:text-lg font-black text-emerald-700">{filteredReports.length}</span>
                <span className="text-[10px] font-bold text-emerald-600">Laporan</span>
              </div>
            </div>
          </div>

          {/* Sheets Checkboxes */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Lembar Kerja (Sheets) Dalam File Excel:
            </label>
            <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200 text-[11px] sm:text-xs font-semibold">
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 hover:text-slate-900">
                <input 
                  type="checkbox" 
                  checked={includeTentorSheet} 
                  onChange={(e) => setIncludeTentorSheet(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 shrink-0"
                />
                <span>Sheet 1: Rekapitulasi Tentor & Jam Mengajar</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 hover:text-slate-900">
                <input 
                  type="checkbox" 
                  checked={includeSiswaSheet} 
                  onChange={(e) => setIncludeSiswaSheet(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 shrink-0"
                />
                <span>Sheet 2: Master Data Siswa TK, SD SD & SMP SMP</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 hover:text-slate-900">
                <input 
                  type="checkbox" 
                  checked={includeLaporanSheet} 
                  onChange={(e) => setIncludeLaporanSheet(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 shrink-0"
                />
                <span>Sheet 3: Detail Riwayat Laporan Mingguan</span>
              </label>
            </div>
          </div>

        </div>

        {/* Modal Footer / Action */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-100 flex flex-col gap-3 shrink-0">
          <button
            onClick={handleDownloadExcel}
            disabled={!includeTentorSheet && !includeSiswaSheet && !includeLaporanSheet}
            className="w-full py-3 sm:py-3.5 px-4 sm:px-5 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Download Tabel Excel (.xlsx)</span>
          </button>
        </div>

      </div>
    </div>
  );
};

