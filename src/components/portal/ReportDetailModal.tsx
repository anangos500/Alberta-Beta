import React, { useState } from 'react';
import { X, Printer, Calendar, User, BookOpen, CheckCircle, Award, Sparkles, Image } from 'lucide-react';
import { WeeklyReport } from '../../types';
import { PdfReportView } from './PdfReportView';

interface Props {
  report: WeeklyReport | null;
  onClose: () => void;
  hidePrintOption?: boolean;
}

export const ReportDetailModal: React.FC<Props> = ({ report, onClose, hidePrintOption = false }) => {
  const [showPdfPrint, setShowPdfPrint] = useState(false);

  if (!report) return null;

  const getRatingBadgeColor = (val: string) => {
    if (val.includes('Sangat Baik') || val.includes('Tepat dan Cepat') || val.includes('Sangat Aktif') || val.includes('Sangat Mandiri') || val.includes('Sangat Disiplin') || val.includes('Cepat, Rapi')) {
      return 'bg-teal-100 text-teal-900 border-teal-200';
    }
    if (val.includes('Baik') || val.includes('Aktif') || val.includes('Mandiri') || val.includes('Disiplin') || val.includes('Rapi dan Lengkap')) {
      return 'bg-blue-100 text-blue-900 border-blue-200';
    }
    return 'bg-emerald-100 text-emerald-900 border-emerald-200';
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-hidden" onClick={onClose}>
        <div className="bg-white rounded-3xl max-w-2xl w-full shadow-sm border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-full" onClick={(e) => e.stopPropagation()}>
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 p-6 sm:p-8 shrink-0">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bimbel Alberta Bondowoso</span>
              </div>
              <h3 className="text-xl font-bold text-stone-800 font-serif">
                Laporan Perkembangan Minggu ke-{report.mingguKe}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {!hidePrintOption && (
              <button
                onClick={() => setShowPdfPrint(true)}
                className="px-3 py-1.5 rounded-xl bg-teal-200 text-teal-900 hover:bg-teal-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / PDF</span>
              </button>
            )}

              <button
                onClick={onClose}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {/* Student Info Box */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-stone-500 font-medium block">Nama Siswa:</span>
                <span className="font-bold text-stone-800 text-sm">{report.studentNama}</span>
              </div>
              <div>
                <span className="text-stone-500 font-medium block">Jenjang & Kelas:</span>
                <span className="font-bold text-stone-800">{report.studentJenjang} Kelas {report.studentKelas}</span>
              </div>
              <div>
                <span className="text-stone-500 font-medium block">Tentor Pendamping:</span>
                <span className="font-bold text-stone-800">{report.tentorNama}</span>
              </div>
              <div>
                <span className="text-stone-500 font-medium block">Hari & Tanggal:</span>
                <span className="font-bold text-stone-800">{report.hari}, {report.tanggalPembelajaran}</span>
              </div>
              <div className="col-span-2 sm:col-span-2">
                <span className="text-stone-500 font-medium block">Materi Pelajaran:</span>
                <span className="font-bold text-stone-800">{report.mataPelajaran} — {report.materi}</span>
              </div>
            </div>

            {/* 7 Aspect Ratings Table Cards */}
            <div className="space-y-3">
              <h4 className="font-bold text-stone-800 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-stone-200 pb-2">
                <Award className="w-4 h-4 text-teal-600" />
                Penilaian Perkembangan Belajar (7 Aspek)
              </h4>

              <div className="grid grid-cols-1 gap-2 text-xs">
                
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-row items-center justify-between gap-3">
                  <span className="font-medium text-stone-700 text-xs sm:text-sm leading-tight">1. Pemahaman Materi</span>
                  <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md font-extrabold border text-[10px] sm:text-xs inline-block text-center shrink-0 max-w-[120px] sm:max-w-none ${getRatingBadgeColor(report.ratings.pemahamanMateri)}`}>
                    {report.ratings.pemahamanMateri}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-row items-center justify-between gap-3">
                  <span className="font-medium text-stone-700 text-xs sm:text-sm leading-tight">2. Kemampuan Soal</span>
                  <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md font-extrabold border text-[10px] sm:text-xs inline-block text-center shrink-0 max-w-[120px] sm:max-w-none ${getRatingBadgeColor(report.ratings.kemampuanSoal)}`}>
                    {report.ratings.kemampuanSoal}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-row items-center justify-between gap-3">
                  <span className="font-medium text-stone-700 text-xs sm:text-sm leading-tight">3. Keaktifan Belajar</span>
                  <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md font-extrabold border text-[10px] sm:text-xs inline-block text-center shrink-0 max-w-[120px] sm:max-w-none ${getRatingBadgeColor(report.ratings.keaktifan)}`}>
                    {report.ratings.keaktifan}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-row items-center justify-between gap-3">
                  <span className="font-medium text-stone-700 text-xs sm:text-sm leading-tight">4. Kemandirian Belajar</span>
                  <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md font-extrabold border text-[10px] sm:text-xs inline-block text-center shrink-0 max-w-[120px] sm:max-w-none ${getRatingBadgeColor(report.ratings.kemandirian)}`}>
                    {report.ratings.kemandirian}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-row items-center justify-between gap-3">
                  <span className="font-medium text-stone-700 text-xs sm:text-sm leading-tight">5. Interaksi dengan Tentor & Teman</span>
                  <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md font-extrabold border text-[10px] sm:text-xs inline-block text-center shrink-0 max-w-[120px] sm:max-w-none ${getRatingBadgeColor(report.ratings.interaksi)}`}>
                    {report.ratings.interaksi}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-row items-center justify-between gap-3">
                  <span className="font-medium text-stone-700 text-xs sm:text-sm leading-tight">6. Sikap Pembelajaran</span>
                  <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md font-extrabold border text-[10px] sm:text-xs inline-block text-center shrink-0 max-w-[120px] sm:max-w-none ${getRatingBadgeColor(report.ratings.sikap)}`}>
                    {report.ratings.sikap}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-row items-center justify-between gap-3">
                  <span className="font-medium text-stone-700 text-xs sm:text-sm leading-tight">7. Keterampilan Mencatat</span>
                  <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md font-extrabold border text-[10px] sm:text-xs inline-block text-center shrink-0 max-w-[120px] sm:max-w-none ${getRatingBadgeColor(report.ratings.keterampilanCatat)}`}>
                    {report.ratings.keterampilanCatat}
                  </span>
                </div>

              </div>
            </div>

            {/* Target Minggu Berikutnya */}
            <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100 space-y-1">
              <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                Target Belajar Minggu Berikutnya:
              </h4>
              <p className="text-xs text-teal-900 font-medium leading-relaxed">
                "{report.targetBerikutnya}"
              </p>
            </div>

            {/* Saran Tentor */}
            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 space-y-1">
              <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                Saran Tentor untuk Orang Tua:
              </h4>
              <p className="text-xs text-rose-900 font-medium leading-relaxed">
                "{report.saranTentor}"
              </p>
            </div>

            {/* Dokumentasi Foto */}
            {report.dokumentasiFoto && report.dokumentasiFoto.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-stone-600" />
                  Dokumentasi Kegiatan Pembelajaran:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {report.dokumentasiFoto.map((imgUrl, i) => (
                    <div key={i} className="h-32 rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                      <img src={imgUrl || undefined} alt="Dokumentasi" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
            >
              Tutup
            </button>

            {!hidePrintOption && (
            <button
              onClick={() => setShowPdfPrint(true)}
              className="px-5 py-2.5 rounded-xl bg-teal-200 text-teal-900 hover:bg-teal-300 font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF Laporan</span>
            </button>
          )}
          </div>

        </div>
      </div>

      {/* PDF Export Printable Overlay */}
      {showPdfPrint && (
        <PdfReportView report={report} onClose={() => setShowPdfPrint(false)} />
      )}
    </>
  );
};
