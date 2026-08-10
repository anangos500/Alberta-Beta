import React, { useState } from 'react';
import { 
  Heart, 
  ChevronDown, 
  Calendar, 
  Award, 
  CheckCircle, 
  MessageSquare, 
  Printer, 
  Eye, 
  TrendingUp, 
  Sparkles, 
  Image,
  BookOpen,
  Send,
  UserCheck,
  Bell
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WeeklyReport } from '../../types';
import { ReportDetailModal } from './ReportDetailModal';
import { OrangTuaUlasanTab } from './OrangTuaUlasanTab';

export const OrangTuaDashboard: React.FC = () => {
  const { students, reports, notifications, selectedChildId, setSelectedChildId, currentUser, portalTab, setPortalTab } = useApp();

  const [selectedReport, setSelectedReport] = useState<WeeklyReport | null>(null);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  React.useEffect(() => {
    if (currentUser?.id) {
      const stored = localStorage.getItem(`readNotifs_${currentUser.id}`);
      if (stored) {
        try { setReadNotifications(JSON.parse(stored)); } catch (e) {}
      }
    }
  }, [currentUser?.id]);

  const markAsRead = (id: string) => {
    if (!readNotifications.includes(id)) {
      const newRead = [...readNotifications, id];
      setReadNotifications(newRead);
      if (currentUser?.id) {
        localStorage.setItem(`readNotifs_${currentUser.id}`, JSON.stringify(newRead));
      }
    }
  };

  // Get parent's children (or fallback to student list)
  const myChildren = students.filter((s) => {
    if (currentUser?.studentIds) {
      return currentUser.studentIds.includes(s.id);
    }
    return s.id === 'S001' || s.id === 'S002'; // Demo children
  });

  const activeChild = students.find((s) => s.id === selectedChildId) || myChildren[0] || students[0];

  // Child's reports sorted by week descending
  const childReports = reports
    .filter((r) => r.studentId === activeChild?.id)
    .sort((a, b) => b.mingguKe - a.mingguKe);

  const latestReport = childReports[0];

  const getRatingBadgeColor = (val: string) => {
    if (val.includes('Sangat Baik') || val.includes('Tepat dan Cepat') || val.includes('Sangat Aktif') || val.includes('Sangat Mandiri') || val.includes('Sangat Disiplin') || val.includes('Cepat, Rapi')) {
      return 'bg-emerald-100 text-emerald-900 border-emerald-200';
    }
    if (val.includes('Baik') || val.includes('Aktif') || val.includes('Mandiri') || val.includes('Disiplin') || val.includes('Rapi dan Lengkap')) {
      return 'bg-teal-100 text-teal-900 border-teal-200';
    }
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const myNotifications = notifications.filter(notif => {
    // Filter out notifications older than 7 days
    const notifDate = new Date(notif.date).getTime();
    const sevenDaysAgo = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);
    if (notifDate < sevenDaysAgo) return false;

    if (notif.targetType === 'all') return true;
    if (notif.targetType === 'student' && myChildren.some(c => c.id === notif.targetId)) return true;
    if (notif.targetType === 'tentor' && myChildren.some(c => c.tentorId === notif.targetId)) return true;
    return false;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Top Child Selector Header */}
      {portalTab === 'dashboard' && (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-4 sm:p-6 lg:p-8 border border-emerald-100/50 space-y-5 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-emerald-600 text-[10px] font-extrabold border border-emerald-100 uppercase tracking-wider shadow-sm">
              <Heart className="w-3.5 h-3.5 text-emerald-500" />
              <span>Portal Wali Murid</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Profil <span className="text-emerald-600">Ananda</span>
            </h2>
            <p className="text-slate-600 text-sm">
              Pilih profil ananda untuk melihat laporan perkembangan dan evaluasi bulanan.
            </p>
          </div>

          {/* MULTI-CHILD SELECTOR DROPDOWN */}
          {myChildren.length > 1 && (
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm space-y-1.5 shrink-0 w-full sm:w-auto sm:min-w-[240px]">
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Pilih Ananda:
              </label>
              <div className="relative">
                <select
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 sm:py-2 rounded-xl bg-slate-50 text-slate-900 font-bold text-xs border border-slate-200 focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 appearance-none cursor-pointer transition-colors"
                >
                  {myChildren.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nama} ({c.jenjang} Kelas {c.kelas})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-[50%] -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Selected Child Info Badge */}
        {activeChild && (
          <div className="bg-white rounded-2xl border border-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
            {/* Mobile Compact Profile View (Accordion) */}
            <details className="group sm:hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none bg-white hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden ring-2 ring-emerald-50 shrink-0">
                    <svg className="w-8 h-8 text-slate-300 mt-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">{activeChild.nama}</h3>
                    <p className="text-[10px] font-bold text-emerald-600 mt-0.5">{activeChild.jenjang} Kelas {activeChild.kelas}</p>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 pt-0 border-t border-slate-100 space-y-3 bg-slate-50/50">
                <p className="text-xs text-slate-500 font-medium">
                  NIS: <span className="font-mono text-slate-600">{activeChild.nis}</span> • {activeChild.sekolah}
                </p>
                <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  Tentor: {activeChild.tentorNama}
                </p>
                <a
                  href={`https://wa.me/6281234567890?text=Halo%20Admin%20Alberta,%20saya%20orang%20tua%20dari%20${encodeURIComponent(activeChild.nama)}%20ingin%20bertanya.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md mt-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Hubungi Tentor (WA)</span>
                </a>
              </div>
            </details>

            {/* Desktop View */}
            <div className="hidden sm:flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-4 p-5">
              <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 w-full sm:w-auto">
                <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden ring-4 ring-emerald-50 shrink-0 mx-auto sm:mx-0">
                  <svg className="w-12 h-12 sm:w-10 sm:h-10 text-slate-300 mt-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div className="space-y-1.5 sm:space-y-1 w-full">
                  <div className="flex flex-col sm:flex-row flex-wrap items-center sm:justify-start justify-center gap-2 mb-1">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">{activeChild.nama}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      {activeChild.jenjang} Kelas {activeChild.kelas}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    NIS: <span className="font-mono text-slate-600">{activeChild.nis}</span> • {activeChild.sekolah}
                  </p>
                  <p className="text-[11px] font-bold text-slate-700 mt-1 flex items-center justify-center sm:justify-start gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Tentor: {activeChild.tentorNama}
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/6281234567890?text=Halo%20Admin%20Alberta,%20saya%20orang%20tua%20dari%20${encodeURIComponent(activeChild.nama)}%20ingin%20bertanya.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 sm:py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Hubungi Tentor (WA)</span>
              </a>
            </div>
          </div>
        )}

        {/* Papan Pengumuman */}
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Bell className="w-24 h-24 text-emerald-900" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-emerald-600" />
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Papan Pengumuman</h3>
          </div>
          
          <div className="space-y-3 relative z-10 max-h-96 overflow-y-auto">
            {myNotifications.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">Belum ada pengumuman terbaru.</p>
            ) : (
              myNotifications.map((notif, index) => {
                const isUnread = !readNotifications.includes(notif.id);
                return (
                <div 
                  key={notif.id} 
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${isUnread ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-80'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${isUnread ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {notif.targetType === 'all' ? 'Pengumuman Umum' : notif.targetType === 'student' ? 'Khusus Siswa' : 'Info dari Tentor'}
                        </span>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-slate-900">{notif.title}</p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0">
                      {new Date(notif.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              )})
            )}
          </div>
        </div>

      </div>
      )}

      {/* WEEKLY REPORTS LIST */}
      {portalTab === 'laporan' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Laporan Bulanan
              </h3>
              {activeChild && (
                <p className="text-sm text-slate-500 mt-1">
                  Menampilkan laporan untuk Ananda <span className="font-bold text-emerald-600">{activeChild.nama}</span>
                </p>
              )}
            </div>
            
            {/* MULTI-CHILD SELECTOR DROPDOWN */}
            {myChildren.length > 1 && (
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 shrink-0 w-full sm:w-auto sm:min-w-[200px]">
                <div className="relative">
                  <select
                    value={selectedChildId}
                    onChange={(e) => setSelectedChildId(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 sm:py-2 rounded-lg bg-white text-slate-900 font-bold text-xs border border-slate-200 focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 appearance-none cursor-pointer transition-colors"
                  >
                    {myChildren.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama} ({c.jenjang} Kelas {c.kelas})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-[50%] -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}
          </div>
          
          {childReports.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8 text-slate-300" />
              </div>
              <h4 className="text-base font-extrabold text-slate-700">Belum ada laporan belajar minggu ini.</h4>
              <p className="text-sm text-slate-500 max-w-md mx-auto">Laporan Bulanan akan otomatis muncul setelah diselesaikan oleh Tentor Pendamping.</p>
            </div>
          ) : (
            childReports.map((report) => (
              <details
                key={report.id}
                className="group bg-white rounded-[1.5rem] border border-slate-100 hover:border-emerald-200 hover:shadow-md shadow-sm transition-all"
              >
                
                {/* Card Header (Summary) */}
                <summary className="list-none p-5 sm:p-8 cursor-pointer relative">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 pr-8 sm:pr-0">
                      <span className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 font-black flex items-center justify-center text-sm border border-emerald-200/50 shadow-inner">
                        M{report.mingguKe}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-[15px] sm:text-lg leading-snug">
                          Laporan Minggu ke-{report.mingguKe}
                        </h4>
                        <p className="text-[11px] sm:text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{new Date(report.tanggalPembelajaran).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-1 sm:mt-0 ml-[58px] sm:ml-0">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedReport(report);
                        }}
                        className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 font-bold text-xs flex items-center gap-2 cursor-pointer shrink-0 transition-colors border border-emerald-100"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Lihat Rincian</span>
                      </button>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform absolute top-8 right-5 sm:top-1/2 sm:-translate-y-1/2 sm:right-8" />
                </summary>

                <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 space-y-6 mt-4">
                  {/* Lesson Subject & Topic */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Mata Pelajaran & Materi:</span>
                  <div className="text-sm font-bold text-slate-900">
                    {report.mataPelajaran} <span className="text-slate-400 mx-1">—</span> <span className="text-slate-700">{report.materi}</span>
                  </div>
                </div>

                {/* Ratings Grid */}
                <div className="space-y-3">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-500" />
                    Ringkasan Penilaian:
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    {report.ratings.subjects && report.ratings.subjects.length > 0 ? (
                      report.ratings.subjects.map((subject, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-2">
                          <div className="text-[11px] font-extrabold text-emerald-700 tracking-wide border-b border-slate-100 pb-1.5">{subject.mataPelajaran || 'Mapel'}</div>
                          
                          <div className="flex flex-col gap-1.5">
                             <div className="flex items-center justify-between gap-2">
                               <span className="text-[10px] font-bold text-slate-500 uppercase">Pemahaman</span>
                               <span className={`font-bold text-[10px] ${getRatingBadgeColor(subject.pemahamanMateri)} px-2 py-0.5 rounded-md border`}>
                                 {subject.pemahamanMateri}
                               </span>
                             </div>
                             <div className="flex items-center justify-between gap-2">
                               <span className="text-[10px] font-bold text-slate-500 uppercase">Pengerjaan</span>
                               <span className={`font-bold text-[10px] ${getRatingBadgeColor(subject.kemampuanSoal)} px-2 py-0.5 rounded-md border`}>
                                 {subject.kemampuanSoal}
                               </span>
                             </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs">
                          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Pemahaman:</div>
                          <div className={`font-bold mt-1 text-xs ${getRatingBadgeColor(report.ratings.pemahamanMateri)} px-2.5 py-1 rounded-lg inline-block border`}>
                            {report.ratings.pemahamanMateri}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs">
                          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Pengerjaan:</div>
                          <div className={`font-bold mt-1 text-xs ${getRatingBadgeColor(report.ratings.kemampuanSoal)} px-2.5 py-1 rounded-lg inline-block border`}>
                            {report.ratings.kemampuanSoal}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Target & Tentor Advice */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-1.5">
                    <span className="font-extrabold text-emerald-600 text-[10px] uppercase tracking-wider block">Target Belajar Berikutnya:</span>
                    <p className="text-slate-700 font-medium leading-relaxed italic">"{report.targetBerikutnya}"</p>
                  </div>

                  <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100 space-y-1.5">
                    <span className="font-extrabold text-teal-600 text-[10px] uppercase tracking-wider block">Saran Tentor:</span>
                    <p className="text-slate-700 font-medium leading-relaxed italic">"{report.saranTentor}"</p>
                  </div>
                </div>

                {/* Photos thumbnail preview */}
                {report.dokumentasiFoto && report.dokumentasiFoto.length > 0 && (
                  <div className="pt-2 flex items-start sm:items-center gap-3 flex-col sm:flex-row">
                    <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
                      <Image className="w-4 h-4 text-slate-400" />
                      Foto Kegiatan
                    </span>
                    <div className="flex gap-2 sm:gap-3 flex-wrap">
                      {report.dokumentasiFoto.map((img, i) => (
                        <img
                          key={i}
                          src={img || undefined}
                          alt="Dokumentasi"
                          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:opacity-80 hover:shadow-md transition-all"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (img) setPreviewImage(img);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                </div>
              </details>
            ))
          )}

        </div>
      )}

      {/* GRAFIK & TREN TAB */}
      {portalTab === 'evaluasi' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-8">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Grafik & Tren Perkembangan Belajar Ananda
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Visualisasi kestabilan pemahaman materi dan keaktifan belajar per minggu berdasarkan laporan terbaru.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-sm">
            
            <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100 space-y-3">
              <span className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-wider">Pemahaman Konsep:</span>
              <div className="text-2xl font-black text-emerald-900">
                {childReports.length > 0 ? childReports[0].ratings.pemahamanMateri : 'Belum Ada Data'}
              </div>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                {childReports.length > 0 
                  ? `Berdasarkan evaluasi laporan terbaru (Minggu ke-${childReports[0].mingguKe}), tingkat pemahaman materi ananda dinilai: ${childReports[0].ratings.pemahamanMateri}.`
                  : `Belum ada data laporan untuk ananda ${activeChild?.nama}.`}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-teal-50/50 border border-teal-100 space-y-3">
              <span className="text-[10px] font-extrabold text-teal-500 uppercase tracking-wider">Pengerjaan Soal:</span>
              <div className="text-2xl font-black text-teal-900">
                {childReports.length > 0 ? childReports[0].ratings.kemampuanSoal : 'Belum Ada Data'}
              </div>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                {childReports.length > 0
                  ? `Kemampuan dalam mengerjakan soal latihan dinilai: ${childReports[0].ratings.kemampuanSoal}.`
                  : 'Belum ada data yang cukup untuk menganalisis perkembangan pengerjaan soal.'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-3">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Sikap & Kedisiplinan:</span>
              <div className="text-2xl font-black text-slate-900">
                {childReports.length > 0 ? childReports[0].ratings.sikap : 'Belum Ada Data'}
              </div>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                {childReports.length > 0
                  ? `Kedisiplinan ananda ${activeChild?.nama} selama sesi les: ${childReports[0].ratings.sikap}.`
                  : 'Belum ada catatan sikap dan kedisiplinan.'}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ULASAN TAB */}
      {portalTab === 'ulasan' && (
        <OrangTuaUlasanTab />
      )}
      
      {/* RINGKASAN BULANAN TAB */}
      {portalTab === 'evaluasi' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-8">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Ringkasan Evaluasi Bulanan Bimbel Alberta
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Rangkuman kehadiran dan catatan perkembangan oleh Tim Akademik Bimbel Alberta Bondowoso.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  {childReports.length > 0 
                    ? `Bulan ${new Date(childReports[0].tanggalPembelajaran).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`
                    : `Bulan ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`}
                </h4>
                {activeChild && (
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Jenjang {activeChild.jenjang} Kelas {activeChild.kelas}</p>
                )}
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold border self-start sm:self-auto ${childReports.length > 0 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                {childReports.length > 0 ? `Tercatat ${childReports.length} Laporan Belajar` : 'Belum Ada Sesi (0 Laporan)'}
              </span>
            </div>

            <div className="text-sm text-slate-700 leading-relaxed space-y-4">
              <p>
                <strong className="text-slate-900 font-extrabold">Catatan Akademik Utama:</strong><br />
                {childReports.length > 0 
                  ? `Ananda ${activeChild?.nama} telah menyelesaikan ${childReports.length} sesi pembelajaran yang tercatat di portal ini. Terus pantau laporan bulanan untuk melihat perkembangan secara detail.`
                  : `Belum ada catatan akademik untuk ananda ${activeChild?.nama} bulan ini.`}
              </p>
              <p>
                <strong className="text-slate-900 font-extrabold">Rekomendasi / Saran Tentor Terbaru:</strong><br />
                {childReports.length > 0 
                  ? `"${childReports[0].saranTentor}"`
                  : 'Belum ada saran dari tentor untuk saat ini.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedReport && (
        <ReportDetailModal hidePrintOption={true}
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-900/95 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
            <button 
              onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-all z-10 cursor-pointer shadow-lg backdrop-blur-md"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={previewImage} 
              alt="Preview Dokumentasi" 
              className="max-w-full max-h-[85vh] md:max-h-[90vh] object-contain rounded-xl shadow-2xl ring-1 ring-white/20 select-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

    </div>
  );
};
