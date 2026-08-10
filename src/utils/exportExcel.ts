import { WeeklyReport } from '../types';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const downloadReportsExcel = async (reports: WeeklyReport[], filename: string) => {
  const excelData = reports.map(r => ({
    'Minggu Ke': r.mingguKe,
    'Tanggal': r.tanggalPembelajaran,
    'Siswa': r.studentNama,
    'Kelas': r.studentKelas,
    'Tentor': r.tentorNama,
    'Mata Pelajaran': r.mataPelajaran,
    'Materi': r.materi,
    'Pemahaman': r.ratings.subjects && r.ratings.subjects.length > 0 
      ? r.ratings.subjects.map(s => `${s.mataPelajaran}: ${s.pemahamanMateri}`).join(' | ') 
      : r.ratings.pemahamanMateri,
    'Kemampuan Soal': r.ratings.subjects && r.ratings.subjects.length > 0
      ? r.ratings.subjects.map(s => `${s.mataPelajaran}: ${s.kemampuanSoal}`).join(' | ')
      : r.ratings.kemampuanSoal,
    'Target Berikutnya': r.targetBerikutnya,
    'Saran Tentor': r.saranTentor
  }));

  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Adjust column widths
  const colWidths = [
    { wch: 10 }, // Minggu Ke
    { wch: 15 }, // Tanggal
    { wch: 20 }, // Siswa
    { wch: 10 }, // Kelas
    { wch: 20 }, // Tentor
    { wch: 25 }, // Mata Pelajaran
    { wch: 30 }, // Materi
    { wch: 15 }, // Pemahaman
    { wch: 15 }, // Kemampuan
    { wch: 30 }, // Target
    { wch: 35 }  // Saran
  ];
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Laporan");
  
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const content = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(content, `${filename}.xlsx`);
};
