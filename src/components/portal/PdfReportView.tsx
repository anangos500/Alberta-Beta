import React from 'react';
import { X, Printer, GraduationCap, Download } from 'lucide-react';
import { WeeklyReport } from '../../types';
// // import html2pdf from 'html2pdf.js';

interface Props {
  report: WeeklyReport;
  onClose: () => void;
}

export const PdfReportView: React.FC<Props> = ({ report, onClose }) => {
  const handleDownloadPDF = () => {
    // Karena html2canvas tidak support format warna oklch (bawaan Tailwind v4),
    // kita menggunakan print API bawaan browser yang mendukung penuh CSS modern
    // untuk menyimpan laporan sebagai PDF.
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-sm relative my-8 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:p-0" onClick={(e) => e.stopPropagation()}>
        
        {/* Action Controls (Hidden when printing) */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-stone-100 text-stone-700 border border-stone-200 rounded-full text-xs font-bold">
              PDF Export Mode
            </span>
            <span className="text-xs text-stone-500">Pratinjau Cetak Laporan Belajar</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-xl bg-teal-200 text-teal-900 hover:bg-teal-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan Sebagai PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT CARD CONTAINER */}
        <div id="pdf-content" className="border border-stone-300 p-8 rounded-xl space-y-6 text-stone-900 font-sans bg-white">
          
          {/* Header Kop Bimbel Alberta */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-2xl font-serif overflow-hidden bg-white">
                <img src="https://exyrlwugzdvqfiafvfcv.supabase.co/storage/v1/object/public/images/Icon%20193X193.png" alt="Logo Alberta" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-stone-900 font-serif tracking-tight">
                  BIMBEL ALBERTA BONDOWOSO
                </h1>
                <p className="text-xs font-semibold text-stone-500">
                  Albertian • Bimbingan Belajar Modern Jenjang TK, SD SD & SMP SMP
                </p>
                <p className="text-[10px] text-stone-400">
                  Jl. Ahmad Yani No. 45, Pusat Kota Bondowoso • WhatsApp: 0812-3456-7890
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-stone-500 uppercase">
                LAPORAN MINGGUAN
              </div>
              <div className="text-lg font-black text-teal-800">
                Minggu ke-{report.mingguKe}
              </div>
            </div>
          </div>

          {/* Student & Session Info Table */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div>
              <span className="text-stone-500 font-medium">Nama Siswa:</span>
              <div className="font-bold text-stone-900 text-sm">{report.studentNama}</div>
            </div>
            <div>
              <span className="text-stone-500 font-medium">Jenjang & Kelas:</span>
              <div className="font-bold text-stone-900">{report.studentJenjang} Kelas {report.studentKelas}</div>
            </div>
            <div>
              <span className="text-stone-500 font-medium">Tentor Pendamping:</span>
              <div className="font-bold text-stone-900">{report.tentorNama}</div>
            </div>
            <div>
              <span className="text-stone-500 font-medium">Hari / Tanggal Pembelajaran:</span>
              <div className="font-bold text-stone-900">{report.hari}, {report.tanggalPembelajaran}</div>
            </div>
            <div className="col-span-2">
              <span className="text-stone-500 font-medium">Mata Pelajaran & Materi:</span>
              <div className="font-bold text-stone-900">{report.mataPelajaran} — {report.materi}</div>
            </div>
          </div>

          {/* 7 Aspect Ratings Table */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-stone-800 text-xs uppercase tracking-wider border-b border-stone-200 pb-1">
              I. Penilaian Perkembangan Belajar (7 Aspek)
            </h3>

            <table className="w-full text-xs border-collapse border border-stone-200">
              <thead>
                <tr className="bg-stone-100 text-stone-800">
                  <th className="border border-stone-200 p-2 text-left w-12 text-center">No</th>
                  <th className="border border-stone-200 p-2 text-left">Aspek Penilaian</th>
                  <th className="border border-stone-200 p-2 text-left w-2/5">Hasil Penilaian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="border border-stone-200 p-2 text-center font-bold">1</td>
                  <td className="border border-stone-200 p-2 font-medium">Pemahaman Materi</td>
                  <td className="border border-stone-200 p-2 font-bold text-stone-900">{report.ratings.pemahamanMateri}</td>
                </tr>
                <tr>
                  <td className="border border-stone-200 p-2 text-center font-bold">2</td>
                  <td className="border border-stone-200 p-2 font-medium">Kemampuan Mengerjakan Soal</td>
                  <td className="border border-stone-200 p-2 font-bold text-stone-900">{report.ratings.kemampuanSoal}</td>
                </tr>
                <tr>
                  <td className="border border-stone-200 p-2 text-center font-bold">3</td>
                  <td className="border border-stone-200 p-2 font-medium">Keaktifan Saat Belajar</td>
                  <td className="border border-stone-200 p-2 font-bold text-stone-900">{report.ratings.keaktifan}</td>
                </tr>
                <tr>
                  <td className="border border-stone-200 p-2 text-center font-bold">4</td>
                  <td className="border border-stone-200 p-2 font-medium">Kemandirian Belajar</td>
                  <td className="border border-stone-200 p-2 font-bold text-stone-900">{report.ratings.kemandirian}</td>
                </tr>
                <tr>
                  <td className="border border-stone-200 p-2 text-center font-bold">5</td>
                  <td className="border border-stone-200 p-2 font-medium">Interaksi dengan Tentor & Teman</td>
                  <td className="border border-stone-200 p-2 font-bold text-stone-900">{report.ratings.interaksi}</td>
                </tr>
                <tr>
                  <td className="border border-stone-200 p-2 text-center font-bold">6</td>
                  <td className="border border-stone-200 p-2 font-medium">Sikap Selama Pembelajaran</td>
                  <td className="border border-stone-200 p-2 font-bold text-stone-900">{report.ratings.sikap}</td>
                </tr>
                <tr>
                  <td className="border border-stone-200 p-2 text-center font-bold">7</td>
                  <td className="border border-stone-200 p-2 font-medium">Keterampilan Mencatat Materi</td>
                  <td className="border border-stone-200 p-2 font-bold text-stone-900">{report.ratings.keterampilanCatat}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Targets & Recommendations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="border border-stone-200 bg-stone-50 p-3 rounded-lg space-y-1">
              <h4 className="font-bold text-stone-700 uppercase text-[11px]">
                II. Target Belajar Minggu Berikutnya:
              </h4>
              <p className="text-stone-800 italic">
                "{report.targetBerikutnya}"
              </p>
            </div>

            <div className="border border-stone-200 bg-stone-50 p-3 rounded-lg space-y-1">
              <h4 className="font-bold text-stone-700 uppercase text-[11px]">
                III. Saran Tentor untuk Orang Tua:
              </h4>
              <p className="text-stone-800 italic">
                "{report.saranTentor}"
              </p>
            </div>
          </div>

          {/* Photo Documentation */}
          {report.dokumentasiFoto && report.dokumentasiFoto.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider">
                IV. Dokumentasi Pembelajaran
              </h4>
              <div className="flex gap-3">
                {report.dokumentasiFoto.map((img, i) => (
                  <div key={i} className="h-24 w-36 rounded-lg overflow-hidden border border-stone-200">
                    <img src={img || undefined} alt="Dokumentasi" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signatures */}
          <div className="pt-8 border-t border-stone-200 grid grid-cols-2 text-center text-xs">
            <div>
              <p className="text-stone-500 mb-12">Tentor Pengajar Bimbel Alberta,</p>
              <p className="font-bold text-stone-900 underline">{report.tentorNama}</p>
            </div>
            <div>
              <p className="text-stone-500 mb-12">Bondowoso, {report.tanggalPembelajaran}<br />Orang Tua / Wali Murid,</p>
              <p className="font-bold text-stone-900 underline">( ............................................ )</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
