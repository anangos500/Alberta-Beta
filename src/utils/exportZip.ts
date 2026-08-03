import { WeeklyReport } from '../types';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const downloadReportsZip = async (reports: WeeklyReport[], filename: string) => {
  const zip = new JSZip();

  const csvHeader = [
    'Minggu Ke',
    'Tanggal',
    'Siswa',
    'Kelas',
    'Tentor',
    'Mata Pelajaran',
    'Materi',
    'Pemahaman',
    'Kemampuan Soal',
    'Keaktifan',
    'Kemandirian',
    'Interaksi',
    'Sikap',
    'Keterampilan Catat',
    'Target Berikutnya',
    'Saran Tentor'
  ].join(',');

  const csvRows = reports.map(r => {
    return [
      r.mingguKe,
      r.tanggalPembelajaran,
      r.studentNama,
      r.studentKelas,
      r.tentorNama,
      `"${r.mataPelajaran}"`,
      `"${r.materi}"`,
      `"${r.ratings.pemahamanMateri}"`,
      `"${r.ratings.kemampuanSoal}"`,
      `"${r.ratings.keaktifan}"`,
      `"${r.ratings.kemandirian}"`,
      `"${r.ratings.interaksi}"`,
      `"${r.ratings.sikap}"`,
      `"${r.ratings.keterampilanCatat}"`,
      `"${r.targetBerikutnya}"`,
      `"${r.saranTentor}"`
    ].join(',');
  });

  const csvContent = [csvHeader, ...csvRows].join('\n');
  zip.file('laporan.csv', csvContent);

  reports.forEach(r => {
    zip.file(`laporan_${r.studentNama.replace(/[^a-z0-9]/gi, '_')}_minggu_${r.mingguKe}.json`, JSON.stringify(r, null, 2));
  });

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${filename}.zip`);
};
