import React, { useState } from 'react';
import { 
  Users, 
  PlusCircle, 
  FileText, 
  Edit3, 
  Trash2, 
  Eye, 
  Sparkles, 
  CheckCircle,
  Clock,
  BookOpen,
  Calendar,
  Download,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { downloadReportsZip } from '../../utils/exportZip';
import { Student, WeeklyReport } from '../../types';
import { WeeklyReportFormModal } from './WeeklyReportFormModal';
import { ReportDetailModal } from './ReportDetailModal';
import { TentorManagementModal } from './TentorManagementModal';

export const TentorDashboard: React.FC = () => {
  const { students, reports, currentUser, portalTab, deleteWeeklyReport, jadwalList, tentors, updateTentor } = useApp();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);
  const [editingReport, setEditingReport] = useState<WeeklyReport | null>(null);

  const [viewDetailReport, setViewDetailReport] = useState<WeeklyReport | null>(null);
  
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const myTentorProfile = tentors.find(t => t.id === currentUser?.tentorId) || null;

  // Active students assigned to this tentor or all active students for tentor view
  const myStudents = students.filter(
    (s) => s.status === 'aktif' && (s.tentorId === currentUser?.tentorId || true)
  );

  // Reports written by this tentor
  const myReports = reports.filter(
    (r) => r.tentorId === currentUser?.tentorId || true
  );

  const currentWeek = 4; // Mock minggu sekarang
  const studentsWithoutReport = myStudents.filter(s => 
    !myReports.find(r => r.studentId === s.id && r.mingguKe === currentWeek)
  ).length;

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long' });

  // Real jadwal for this tentor
  const myJadwal = jadwalList.filter(j => j.tentorId === currentUser?.id);
  const myJadwalToday = myJadwal.filter(j => j.hari.toLowerCase() === today.toLowerCase());

  const handleOpenNewReport = (student: Student) => {
    setSelectedStudentForReport(student);
    setEditingReport(null);
    setIsReportModalOpen(true);
  };

  const handleEditReport = (report: WeeklyReport) => {
    setEditingReport(report);
    setSelectedStudentForReport(null);
    setIsReportModalOpen(true);
  };

  const handleDeleteReport = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan perkembangan ini?')) {
      deleteWeeklyReport(id);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Top Banner - Show on dashboard */}
      {portalTab === 'dashboard' && (
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 text-pink-900 rounded-3xl p-6 sm:p-8 border border-pink-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-pink-600 text-[10px] font-extrabold border border-pink-100 shadow-sm uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Portal Pengajar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Selamat Datang, <span className="text-pink-600">{currentUser?.nama}!</span>
            </h2>
            <p className="text-slate-600 text-sm max-w-xl">
              Isi & perbarui Laporan Perkembangan Belajar Mingguan (7 Aspek Penilaian) untuk siswa bimbingan Anda secara praktis dan transparan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {myTentorProfile && (
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-extrabold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-sm hover:shadow-md w-full md:w-auto"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profil</span>
              </button>
            )}
            <button
              onClick={() => {
                setSelectedStudentForReport(null);
                setEditingReport(null);
                setIsReportModalOpen(true);
              }}
              className="px-6 py-3.5 rounded-2xl bg-pink-600 text-white font-extrabold text-sm hover:bg-pink-700 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-md hover:shadow-lg w-full md:w-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Isi Laporan Baru</span>
            </button>
          </div>
        </div>
      )}

      {/* BERANDA - Show on dashboard */}
      {portalTab === 'dashboard' && (
        <div className="space-y-6">
          {studentsWithoutReport > 0 && (
            <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex items-start sm:items-center gap-4 shadow-sm">
              <div className="bg-rose-100 p-2.5 rounded-xl shrink-0">
                <AlertCircle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h4 className="text-rose-900 font-extrabold text-sm sm:text-base">Pemberitahuan Laporan</h4>
                <p className="text-rose-700 text-xs sm:text-sm font-medium mt-0.5">
                  Terdapat <span className="font-extrabold">{studentsWithoutReport} siswa</span> yang belum Anda berikan laporan untuk minggu ini.
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Jadwal Mengajar Hari Ini
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Jadwal mengajar Anda untuk hari {today}.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {myJadwalToday.map((schedule) => {
                const studentId = schedule.studentIds?.[0] || (schedule as any).student_id;
                const student = students.find(s => s.id === studentId);
                const jenjangInfo = student ? `${student.jenjang} Kelas ${student.kelas} - ${student.nama}` : 'Bimbingan Belajar';
                
                return (
                <div key={schedule.id} className="bg-slate-50 rounded-[1.25rem] border border-slate-100 p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-white text-purple-600 flex flex-col items-center justify-center border border-purple-100 shadow-sm">
                    <Calendar className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px] font-extrabold uppercase">{schedule.hari}</span>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-base">{schedule.mataPelajaran || 'Bimbingan'}</h4>
                    <p className="text-xs font-semibold text-slate-500">{jenjangInfo}</p>
                    <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                        <Clock className="w-3 h-3 text-purple-500" />
                        {(schedule as any).jam || `${schedule.jamMulai} - ${schedule.jamSelesai}`}
                      </div>
                    </div>
                  </div>
                </div>
              )})}
              {/* Optional Empty State */}
              {myJadwalToday.length === 0 && (
                <div className="col-span-full py-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                  <span className="font-bold">Tidak ada jadwal mengajar hari ini.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* JADWAL MENGAJAR - Show on jadwal_mengajar */}
      {portalTab === 'jadwal_mengajar' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Jadwal Mengajar
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Jadwal mengajar mingguan Anda.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {myJadwal.map((schedule) => {
              const studentId = schedule.studentIds?.[0] || (schedule as any).student_id;
              const student = students.find(s => s.id === studentId);
              const jenjangInfo = student ? `${student.jenjang} Kelas ${student.kelas} - ${student.nama}` : 'Bimbingan Belajar';

              return (
              <div key={schedule.id} className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 text-purple-600 flex flex-col items-center justify-center border border-purple-100">
                  <Calendar className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold uppercase">{schedule.hari}</span>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-lg">{schedule.mataPelajaran || 'Bimbingan'}</h4>
                      <p className="text-xs font-semibold text-slate-500">{jenjangInfo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-purple-500" />
                      {(schedule as any).jam || `${schedule.jamMulai} - ${schedule.jamSelesai}`}
                    </div>
                  </div>
                </div>
              </div>
            )})}
            {myJadwal.length === 0 && (
              <div className="col-span-full py-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                <span className="font-bold">Belum ada jadwal mengajar.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BUAT LAPORAN - Show on buat_laporan */}
      {portalTab === 'buat_laporan' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Isi Laporan Mingguan
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Pilih siswa untuk menginputkan laporan minggu ini.
              </p>
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-700 bg-pink-100 px-4 py-1.5 rounded-full border border-pink-200 shadow-xs self-start sm:self-auto">
              {myStudents.length} Siswa Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myStudents.map((student) => {
              // Check if report for week 4 already exists for this student
              const hasLatestReport = myReports.some(
                (r) => r.studentId === student.id && r.mingguKe === 4
              );

              return (
                <div
                  key={student.id}
                  className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-pink-200 transition-all space-y-5 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-100 text-pink-700 font-black flex items-center justify-center text-xs border border-pink-200/50 shadow-inner group-hover:scale-105 transition-transform">
                          {student.jenjang}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-base">{student.nama}</h4>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">{student.sekolah}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-slate-500 font-bold">Kelas:</span>
                      <span className="font-extrabold text-slate-800">{student.jenjang} Kelas {student.kelas}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-slate-500 font-bold">Orang Tua:</span>
                      <span className="font-extrabold text-slate-800">{student.namaOrangTua}</span>
                    </div>
                  </div>

                  <div className="pt-2 space-y-3">
                    <button
                      onClick={() => handleOpenNewReport(student)}
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Isi Laporan Minggu Ini</span>
                    </button>

                    {hasLatestReport && (
                      <div className="text-[10px] text-center font-extrabold text-green-600 flex items-center justify-center gap-1 uppercase tracking-wider bg-green-50 py-1.5 rounded-lg border border-green-100">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Laporan M-4 Terisi
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MY SUBMITTED REPORTS TABLE - Show on history_tentor */}
      {portalTab === 'history_tentor' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Riwayat Laporan Anda
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Daftar laporan mingguan yang dibuat untuk dapat diperbarui atau dicetak.
              </p>
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.keys(myReports.reduce((acc, r) => {
            acc[r.mingguKe] = (acc[r.mingguKe] || 0) + 1;
            return acc;
          }, {} as Record<number, number>)).sort((a, b) => Number(b) - Number(a)).map(week => (
            <div key={week} className="bg-slate-50 rounded-[1.5rem] border border-slate-200 p-6 flex flex-col justify-between h-full space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-100 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100 shadow-inner">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-lg">Arsip Minggu Ke-{week}</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    {myReports.filter(r => r.mingguKe === Number(week)).length} Laporan Terkirim
                  </p>
                </div>
              </div>
              <button
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                onClick={() => downloadReportsZip(myReports.filter(r => r.mingguKe === Number(week)), `Arsip_Laporan_Minggu_${week}`)}
              >
                <Download className="w-4 h-4" />
                Download Arsip (ZIP)
              </button>
            </div>
          ))}
          {myReports.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-[1.5rem] border border-slate-200 border-dashed">
              <div className="flex flex-col items-center justify-center space-y-3">
                <FileText className="w-8 h-8 text-slate-300" />
                <span className="font-bold">Belum ada arsip laporan.</span>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Form Modal */}
      {isReportModalOpen && (
        <WeeklyReportFormModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          preselectedStudent={selectedStudentForReport}
          editingReport={editingReport}
        />
      )}

      {/* Detail View Modal */}
      {/* Edit Profile Modal */}
      {isEditProfileOpen && myTentorProfile && (
        <TentorManagementModal
          editingTentor={myTentorProfile}
          onClose={() => setIsEditProfileOpen(false)}
          onSubmit={(data) => {
            updateTentor({ ...myTentorProfile, ...data } as any);
            setIsEditProfileOpen(false);
          }}
        />
      )}

      {viewDetailReport && (
        <ReportDetailModal
          report={viewDetailReport}
          onClose={() => setViewDetailReport(null)}
        />
      )}

    </div>
  );
};
