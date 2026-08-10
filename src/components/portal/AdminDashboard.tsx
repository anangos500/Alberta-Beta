import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  FileText, 
  UserCheck, 
  Plus, 
  Eye, 
  BookOpen,
  Download,
  Sparkles,
  Clock,
  MapPin,
  Trash2,
  Folder,
  ChevronRight,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { downloadReportsExcel } from '../../utils/exportExcel';
import { Student, Tentor, WeeklyReport, Jadwal } from '../../types';
import { StudentManagementModal } from './StudentManagementModal';
import { TentorManagementModal } from './TentorManagementModal';
import { ReportDetailModal } from './ReportDetailModal';
import { JadwalManagementModal } from './JadwalManagementModal';
import { TemplateJadwalTab } from './TemplateJadwalTab';
import { GenerateJadwalModal } from './GenerateJadwalModal';
import { Wand2 } from 'lucide-react';
import { NotificationManagement } from './NotificationManagement';
import { RekapitulasiModal } from './RekapitulasiModal';
import { AdminUlasanTab } from './AdminUlasanTab';
import { PublicSettingsAdmin } from './PublicSettingsAdmin';
import { ConfirmModal } from './ConfirmModal';
import { FileSpreadsheet, Settings } from 'lucide-react';

const MobileStudentCard: React.FC<{
  student: Student;
  onEdit: (student: Student) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ student: s, onEdit, onToggleStatus, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3 relative">
      <div 
        className="flex justify-between items-center gap-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-xl">
            {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">{s.nama}</h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{s.nis}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {s.status === 'aktif' ? (
            <span className="px-2 py-1 rounded-lg text-[10px] font-extrabold bg-green-100 text-green-700 border border-green-200 inline-flex items-center gap-1 uppercase tracking-wider shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Aktif
            </span>
          ) : (
            <span className="px-2 py-1 rounded-lg text-[10px] font-extrabold bg-slate-100 text-slate-500 border border-slate-200 inline-flex items-center gap-1 uppercase tracking-wider shrink-0">
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
              Alumni
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(s);
            }}
            className="p-1.5 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors shadow-xs bg-white border border-blue-100"
            title="Edit Data Siswa"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="pt-3 border-t border-slate-100 mt-1 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jenjang</p>
              <span className={`inline-block px-2 py-0.5 rounded-md font-extrabold text-[10px] ${
                s.jenjang === 'SD' ? 'bg-rose-100 text-rose-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {s.jenjang} Kelas {s.kelas}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Asal Sekolah</p>
              <p className="font-semibold text-slate-800 text-xs">{s.sekolah}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Orang Tua</p>
              <p className="font-bold text-slate-800 text-xs">{s.namaOrangTua}</p>
              <p className="text-[10px] text-slate-500">{s.noHpOrangTua}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tentor</p>
              <p className="font-bold text-slate-800 text-xs">{s.tentorNama}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(s.id);
              }}
              className={`px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold rounded-xl border transition-colors shadow-xs bg-white ${
                s.status === 'aktif' 
                ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50 border-slate-200 hover:border-amber-200'
                : 'text-emerald-600 hover:bg-emerald-50 border-emerald-100 hover:border-emerald-200'
              }`}
            >
              {s.status === 'aktif' ? (
                <><XCircle className="w-3.5 h-3.5" /> Nonaktifkan</>
              ) : (
                <><CheckCircle2 className="w-3.5 h-3.5" /> Aktifkan</>
              )}
            </button>
            {s.status !== 'aktif' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(s.id);
                }}
                className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold rounded-xl text-red-500 hover:bg-red-50 border border-red-100 transition-colors shadow-xs bg-white"
              >
                <Trash2 className="w-3.5 h-3.5" /> Hapus
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TentorCard: React.FC<{
  tentor: Tentor;
  onEdit: (tentor: Tentor) => void;
  onDelete: (id: string) => void;
}> = ({ tentor: t, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs hover:border-purple-200 transition-all flex flex-col gap-0">
      <div 
        className={`flex items-center justify-between cursor-pointer md:cursor-default transition-all ${isExpanded ? 'pb-4 border-b border-slate-100' : 'pb-0 md:pb-4 md:border-b md:border-slate-100'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <img src={t.foto || undefined} alt={t.nama} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-4 ring-slate-50 shrink-0" />
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">{t.nama}</h4>
            <p className="hidden md:inline-block text-[10px] sm:text-[11px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-md mt-1">{t.gelar}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(t);
            }}
            className="p-1.5 sm:p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors bg-white border border-blue-100 shadow-xs"
            title="Edit Tentor"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(t.id);
            }}
            className="p-1.5 sm:p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors bg-white border border-red-100 shadow-xs"
            title="Hapus Tentor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="md:hidden p-1.5 bg-slate-50 rounded-xl text-slate-400"> 
             {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>
      
      <div className={`text-xs text-slate-600 space-y-2.5 pt-4 md:pt-0 md:mt-4 md:block ${isExpanded ? 'block animate-in slide-in-from-top-2 duration-200' : 'hidden'}`}>
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-400">Lulusan:</span>
          <span className="font-bold text-slate-800 text-right">{t.lulusan}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-400">Spesialisasi:</span>
          <span className="font-bold text-slate-800 text-right">{t.spesialisasi}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-400">No HP:</span>
          <span className="font-bold text-slate-800 text-right">{t.noHp}</span>
        </div>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const { 
    students, 
    tentors, 
    reports, 
    toggleStudentStatus,
    deleteStudent,
    portalTab, 
    setPortalTab,
    addTentor,
    updateTentor,
    deleteTentor,
    jadwalList,
    deleteJadwal
  } = useApp();

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Hapus',
    onConfirm: () => {},
  });

  const [search, setSearch] = useState('');
  const [filterJenjang, setFilterJenjang] = useState<'ALL' | 'SD' | 'SMP'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'aktif' | 'cuti'>('aktif');

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isRekapModalOpen, setIsRekapModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isTentorModalOpen, setIsTentorModalOpen] = useState(false);
  const [editingTentor, setEditingTentor] = useState<any>(null);

  const [isJadwalModalOpen, setIsJadwalModalOpen] = useState(false);
  const [editingJadwal, setEditingJadwal] = useState<Jadwal | null>(null);
  const [jadwalSubTab, setJadwalSubTab] = useState<'aktif' | 'template'>('aktif');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  const [selectedReport, setSelectedReport] = useState<WeeklyReport | null>(null);
  
  const [studentPage, setStudentPage] = useState(1);
  const studentsPerPage = 10;
  
  const [tentorPage, setTentorPage] = useState(1);
  const tentorsPerPage = 10;

  // Statistics
  const totalAktif = students.filter((s) => s.status === 'aktif').length;
  const totalSD = students.filter((s) => s.status === 'aktif' && s.jenjang === 'SD').length;
  const totalSMP = students.filter((s) => s.status === 'aktif' && s.jenjang === 'SMP').length;
  const totalNonaktif = students.filter((s) => s.status === 'cuti').length;

  const currentWeek = Math.ceil(new Date().getDate() / 7); // Calculate current week of the month
  const reportsThisWeek = reports.filter(r => r.mingguKe === currentWeek);
  const tentorIdsWithReports = new Set(reportsThisWeek.map(r => r.tentorId));
  const tentorSudahLaporan = tentors.filter(t => tentorIdsWithReports.has(t.id));
  const tentorBelumLaporan = tentors.filter(t => !tentorIdsWithReports.has(t.id));

  // Filtered students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.toLowerCase().includes(search.toLowerCase()) ||
      s.sekolah.toLowerCase().includes(search.toLowerCase());

    const matchesJenjang = filterJenjang === 'ALL' || s.jenjang === filterJenjang;
    const matchesStatus = filterStatus === 'ALL' || s.status === filterStatus;

    return matchesSearch && matchesJenjang && matchesStatus;
  });
  const paginatedStudents = filteredStudents.slice((studentPage - 1) * studentsPerPage, studentPage * studentsPerPage);
  const totalStudentPages = Math.ceil(filteredStudents.length / studentsPerPage);
  
  const paginatedTentors = tentors.slice((tentorPage - 1) * tentorsPerPage, tentorPage * tentorsPerPage);
  const totalTentorPages = Math.ceil(tentors.length / tentorsPerPage);

  const groupedJadwal = useMemo(() => {
    // Jenjang > Bulan > Minggu > Hari > Ruangan
    const grouped: Record<string, Record<string, Record<string, Record<string, Record<string, Jadwal[]>>>>> = {};

    jadwalList.forEach(j => {
      const sids = Array.from(new Set([...(j.studentIds || []), (j as any).studentId])).filter(Boolean);
      let jenjang = 'Lainnya';
      if (sids.length > 0) {
        const student = students.find(s => s.id === sids[0]);
        if (student && student.jenjang) jenjang = student.jenjang;
      }
      
      const bulan = (j as any).bulan || 'Bulan Berjalan';
      const minggu = j.mingguKe ? `Minggu Ke-${j.mingguKe}` : 'Tanpa Minggu';
      const hari = j.hari || 'Tanpa Hari';
      const ruangan = j.ruangan || 'Tanpa Ruangan';

      if (!grouped[jenjang]) grouped[jenjang] = {};
      if (!grouped[jenjang][bulan]) grouped[jenjang][bulan] = {};
      if (!grouped[jenjang][bulan][minggu]) grouped[jenjang][bulan][minggu] = {};
      if (!grouped[jenjang][bulan][minggu][hari]) grouped[jenjang][bulan][minggu][hari] = {};
      if (!grouped[jenjang][bulan][minggu][hari][ruangan]) grouped[jenjang][bulan][minggu][hari][ruangan] = [];

      grouped[jenjang][bulan][minggu][hari][ruangan].push(j);
    });

    return grouped;
  }, [jadwalList, students]);

    const [jadwalPath, setJadwalPath] = useState<string[]>([]);

  // Calculate current folder contents
  const currentFolderContent = useMemo(() => {
    let current: any = groupedJadwal;
    for (const path of jadwalPath) {
      if (current[path]) {
        current = current[path];
      } else {
        return null;
      }
    }
    return current;
  }, [groupedJadwal, jadwalPath]);
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Top Banner - Only on dashboard */}
      {portalTab === 'dashboard' && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 text-purple-900 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-sm">
          <div className="space-y-1.5 sm:space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white text-purple-600 text-[10px] font-extrabold border border-purple-100 shadow-sm uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Dashboard Pengelola</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Panel Master <span className="text-purple-600">Admin</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-xl leading-relaxed">
              Kelola data siswa TK, SD SD & SMP SMP, penugasan tentor, serta pemantauan rekap laporan perkembangan belajar bulanan.
            </p>
          </div>
          <button
            onClick={() => setIsRekapModalOpen(true)}
            className="px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl bg-emerald-600 text-white font-extrabold text-xs sm:text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <FileSpreadsheet className="w-4 h-4 shrink-0" />
            <span>Download Rekap Excel</span>
          </button>
        </div>
      )}

      {/* Summary Stat Cards - Only on dashboard */}
      {portalTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-[1.25rem] sm:rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col h-full gap-1.5 sm:gap-2">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider min-h-[2.5rem] sm:min-h-[3rem] flex items-start">Total Siswa Aktif</div>
              <div className="text-3xl font-black text-slate-900">{totalAktif} <span className="text-sm font-bold text-slate-500">Siswa</span></div>
              <p className="text-[11px] text-purple-600 font-bold bg-purple-50 inline-block px-2 py-0.5 rounded-md border border-purple-100 mt-auto self-start">TK, SD SD & SMP SMP</p>
            </div>
            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-[1.25rem] sm:rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col h-full gap-1.5 sm:gap-2">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider min-h-[2.5rem] sm:min-h-[3rem] flex items-start">Total Tentor</div>
              <div className="text-3xl font-black text-slate-900">{tentors.length} <span className="text-sm font-bold text-slate-500">Pengajar</span></div>
              <p className="text-[11px] text-purple-600 font-bold bg-purple-50 inline-block px-2 py-0.5 rounded-md border border-purple-100 mt-auto self-start">Aktif Mengajar</p>
            </div>
            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-[1.25rem] sm:rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col h-full gap-1.5 sm:gap-2">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider min-h-[2.5rem] sm:min-h-[3rem] flex items-start">Laporan Minggu Ke-{currentWeek}</div>
              <div className="text-3xl font-black text-emerald-600">{tentorSudahLaporan.length} <span className="text-sm font-bold text-emerald-400">Tentor</span></div>
              <p className="text-[11px] text-emerald-700 font-bold bg-emerald-50 inline-block px-2 py-0.5 rounded-md border border-emerald-200 mt-auto self-start">Sudah Submit</p>
            </div>
            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-[1.25rem] sm:rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col h-full gap-1.5 sm:gap-2">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider min-h-[2.5rem] sm:min-h-[3rem] flex items-start">Belum Laporan</div>
              <div className="text-3xl font-black text-rose-500">{tentorBelumLaporan.length} <span className="text-sm font-bold text-rose-300">Tentor</span></div>
              <p className="text-[11px] text-rose-700 font-bold bg-rose-50 inline-block px-2 py-0.5 rounded-md border border-rose-200 mt-auto self-start">Menunggu Submit</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white rounded-[1.25rem] sm:rounded-[1.5rem] border border-slate-100 shadow-sm p-4 sm:p-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 sm:pb-4 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">Sudah Memberikan Laporan</h3>
                  <p className="text-xs text-slate-500">Minggu Ke-{currentWeek}</p>
                </div>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto hide-scrollbar pr-2">
                {tentorSudahLaporan.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">Belum ada tentor yang submit laporan minggu ini.</p>
                ) : (
                  tentorSudahLaporan.map(t => (
                    <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
                      <img src={t.foto || undefined} alt={t.nama} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                      <div>
                        <p className="font-bold text-sm text-slate-900">{t.nama}</p>
                        <p className="text-xs text-slate-500">{t.spesialisasi}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-[1.25rem] sm:rounded-[1.5rem] border border-slate-100 shadow-sm p-4 sm:p-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 sm:pb-4 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">Belum Memberikan Laporan</h3>
                  <p className="text-xs text-slate-500">Minggu Ke-{currentWeek}</p>
                </div>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto hide-scrollbar pr-2">
                {tentorBelumLaporan.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">Semua tentor sudah submit laporan minggu ini.</p>
                ) : (
                  tentorBelumLaporan.map(t => (
                    <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
                      <img src={t.foto || undefined} alt={t.nama} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                      <div>
                        <p className="font-bold text-sm text-slate-900">{t.nama}</p>
                        <p className="text-xs text-slate-500">{t.spesialisasi}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MASTER DATA SISWA TABLE */}
      {portalTab === 'siswa' && (
        <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Table Controls */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Data Siswa
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Kelola data profil siswa dan pengaturan status keanggotaan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setEditingStudent(null);
                  setIsStudentModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold text-sm hover:bg-purple-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md w-full sm:w-auto"
              >
                <UserPlus className="w-4 h-4" />
                <span>Tambah Siswa</span>
              </button>

              {/* Search Box */}
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Cari siswa / sekolah..."
                  value={search}
                  onChange={(e) => {
                  setSearch(e.target.value);
                  setStudentPage(1);
                }}
                  className="w-full sm:w-56 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 bg-slate-50 transition-colors font-semibold"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Jenjang Filter */}
                <select
                  value={filterJenjang}
                  onChange={(e) => setFilterJenjang(e.target.value as 'ALL' | 'SD' | 'SMP')}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 font-bold text-slate-700 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 appearance-none cursor-pointer"
                >
                  <option value="ALL">Semua Jenjang</option>
                  <option value="SD">Khusus SD</option>
                  <option value="SMP">Khusus SMP</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'ALL' | 'aktif' | 'cuti')}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 font-bold text-slate-700 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 appearance-none cursor-pointer"
                >
                  <option value="aktif">Status Aktif</option>
                  <option value="cuti">Alumni</option>
                  <option value="ALL">Semua Status</option>
                </select>
              </div>
            </div>
          </div>

          
                    {/* Student List - Responsive */}
          <div className="block lg:hidden space-y-4">
            {filteredStudents.length === 0 ? (
              <div className="p-12 text-center text-slate-400 border border-slate-100 rounded-2xl bg-slate-50">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Search className="w-8 h-8 text-slate-300" />
                  <span className="font-bold">Tidak ada data siswa ditemukan.</span>
                </div>
              </div>
            ) : (
              paginatedStudents.map((s) => (
                <MobileStudentCard
                  key={s.id}
                  student={s}
                  onEdit={(student) => {
                    setEditingStudent(student);
                    setIsStudentModalOpen(true);
                  }}
                  onToggleStatus={toggleStudentStatus}
                  onDelete={(id) => {
                    setConfirmModal({
                      isOpen: true,
                      title: 'Hapus Data Siswa',
                      message: 'Yakin ingin menghapus data siswa ini secara permanen? Data yang dihapus tidak dapat dikembalikan.',
                      confirmText: 'Hapus Permanen',
                      onConfirm: () => {
                        deleteStudent(id);
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                      }
                    });
                  }}
                />
              ))
            )}
          </div>



          {/* Student Table - Desktop */}
          <div className="hidden lg:block overflow-x-auto hide-scrollbar">
            <table className="w-full text-sm text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-extrabold border-y border-slate-200">
                <tr>
                  <th className="p-4 rounded-tl-xl">Siswa</th>
                  <th className="p-4">Jenjang</th>
                  <th className="p-4">Asal Sekolah</th>
                  <th className="p-4">Orang Tua</th>
                  <th className="p-4">Tentor Pendamping</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right rounded-tr-xl">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Search className="w-8 h-8 text-slate-300" />
                        <span className="font-bold">Tidak ada data siswa ditemukan.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900">{s.nama}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{s.nis}</div>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg font-extrabold text-[10px] ${
                          s.jenjang === 'SD' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-purple-100 text-purple-700 border border-purple-200'
                        }`}>
                          {s.jenjang} Kelas {s.kelas}
                        </span>
                      </td>

                      <td className="p-4 font-semibold text-slate-800 text-xs">
                        {s.sekolah}
                      </td>

                      <td className="p-4">
                        <div className="font-extrabold text-slate-900 text-xs">{s.namaOrangTua}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{s.noHpOrangTua}</div>
                      </td>

                      <td className="p-4 font-bold text-slate-700 text-xs">
                        {s.tentorNama}
                      </td>

                      <td className="p-4">
                        {s.status === 'aktif' ? (
                          <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold bg-green-100 text-green-700 border border-green-200 inline-flex items-center gap-1.5 uppercase tracking-wider">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Aktif
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold bg-slate-100 text-slate-500 border border-slate-200 inline-flex items-center gap-1.5 uppercase tracking-wider">
                            <XCircle className="w-3.5 h-3.5 text-slate-400" />
                            Nonaktif
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingStudent(s);
                              setIsStudentModalOpen(true);
                            }}
                            className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 border border-blue-100 transition-colors cursor-pointer shadow-xs bg-white"
                            title="Edit Data Siswa"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => toggleStudentStatus(s.id)}
                            className={`px-3 py-2 rounded-xl text-[11px] font-extrabold transition-colors cursor-pointer border shadow-xs ${
                              s.status === 'aktif'
                                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            }`}
                            title={s.status === 'aktif' ? 'Nonaktifkan Siswa (Soft Delete)' : 'Aktifkan Kembali Siswa'}
                          >
                            {s.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                          
                          {s.status !== 'aktif' && (
                            <button
                              onClick={() => {
                                setConfirmModal({
                                  isOpen: true,
                                  title: 'Hapus Data Siswa',
                                  message: 'Yakin ingin menghapus data siswa ini secara permanen? Data yang dihapus tidak dapat dikembalikan.',
                                  confirmText: 'Hapus Permanen',
                                  onConfirm: () => {
                                    deleteStudent(s.id);
                                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                                  }
                                });
                              }}
                              className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-100 transition-colors cursor-pointer shadow-xs bg-white ml-1"
                              title="Hapus Permanen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* REKAP SEMUA LAPORAN BULANAN */}
      {portalTab === 'rekap_laporan' && (
        <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-4 sm:p-8 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 sm:pb-5 gap-3 sm:gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Arsip Laporan per Pengajar
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
                Kumpulan laporan bulanan yang dikelompokkan berdasarkan tentor/pengajar.
              </p>
            </div>
            <span className="text-[10px] sm:text-[11px] font-extrabold text-purple-700 bg-purple-50 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-purple-200 uppercase tracking-wider self-start sm:self-auto">
              Total {tentors.length} Pengajar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {paginatedTentors.map((tentor) => {
              const tentorReports = reports.filter(r => r.tentorId === tentor.id);
              return (
                <div key={tentor.id} className="bg-slate-50 rounded-2xl sm:rounded-[1.5rem] border border-slate-200 p-4 sm:p-6 flex flex-col justify-between h-full space-y-4 sm:space-y-6">
                  <div className="flex items-start gap-3 sm:gap-4 border-b border-slate-200 pb-3 sm:pb-4">
                    <img src={tentor.foto || undefined} alt={tentor.nama} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 sm:ring-4 ring-white shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight truncate">{tentor.nama}</h4>
                      <p className="text-[10px] sm:text-[11px] text-purple-600 font-bold bg-purple-100 inline-block px-2 py-0.5 rounded-md mt-1 truncate">{tentor.spesialisasi}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 sm:space-y-1">
                      <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Laporan</p>
                      <p className="text-xl sm:text-2xl font-black text-slate-900">{tentorReports.length} <span className="text-xs sm:text-sm font-bold text-slate-400">Berkas</span></p>
                    </div>
                  </div>

                  <button
                    className="w-full py-2.5 sm:py-3.5 px-3.5 sm:px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-purple-600 hover:bg-purple-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => downloadReportsExcel(tentorReports, `Laporan_${tentor.nama.replace(/[^a-z0-9]/gi, '_')}`)}
                    disabled={tentorReports.length === 0}
                  >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>Download Kumpulan Laporan</span>
                  </button>
                </div>
              );
            })}
          </div>
          {totalTentorPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                onClick={() => setTentorPage(p => Math.max(1, p - 1))}
                disabled={tentorPage === 1}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-xs font-bold text-slate-500">
                Halaman {tentorPage} dari {totalTentorPages}
              </span>
              <button
                onClick={() => setTentorPage(p => Math.min(totalTentorPages, p + 1))}
                disabled={tentorPage === totalTentorPages}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* MASTER DATA TENTOR */}
      {portalTab === 'tentor_master' && (
        <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Master Data Pengajar / Tentor Bimbel
              </h3>
              <p className="text-sm text-slate-500 mt-1">Daftar tenaga pengajar aktif di Bimbel Alberta Bondowoso.</p>
            </div>
            <button
              onClick={() => {
                setEditingTentor(null);
                setIsTentorModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold text-sm hover:bg-purple-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md w-full sm:w-auto shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Tentor</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {paginatedTentors.map((t) => (
              <TentorCard
                key={t.id}
                tentor={t}
                onEdit={(tentor) => {
                  setEditingTentor(tentor);
                  setIsTentorModalOpen(true);
                }}
                onDelete={(id) => {
                  setConfirmModal({
                    isOpen: true,
                    title: 'Hapus Data Tentor',
                    message: 'Yakin ingin menghapus data pengajar ini? Aksi ini tidak dapat dibatalkan.',
                    confirmText: 'Hapus',
                    onConfirm: () => {
                      deleteTentor(id);
                      setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }
                  });
                }}
              />
            ))}
          </div>
          {totalTentorPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                onClick={() => setTentorPage(p => Math.max(1, p - 1))}
                disabled={tentorPage === 1}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-xs font-bold text-slate-500">
                Halaman {tentorPage} dari {totalTentorPages}
              </span>
              <button
                onClick={() => setTentorPage(p => Math.min(totalTentorPages, p + 1))}
                disabled={tentorPage === totalTentorPages}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

            {/* JADWAL */}
      {portalTab === 'jadwal' && (
        <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Jadwal Belajar
              </h3>
              <p className="text-sm text-slate-500 mt-1">Atur jadwal pertemuan tentor dengan siswa.</p>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto">
              <button
                onClick={() => setJadwalSubTab('aktif')}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all ${
                  jadwalSubTab === 'aktif'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Jadwal Aktif
              </button>
              <button
                onClick={() => setJadwalSubTab('template')}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all ${
                  jadwalSubTab === 'template'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Template Jadwal
              </button>
            </div>
          </div>
          
          {jadwalSubTab === 'aktif' ? (
            <div className="space-y-6">
              <div className="flex justify-end">
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setIsGenerateModalOpen(true)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-teal-600 text-white font-extrabold text-sm hover:bg-teal-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>Generate Jadwal</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <button 
                    onClick={() => setJadwalPath([])} 
                    className={`hover:text-indigo-600 transition-colors flex items-center gap-1.5 ${jadwalPath.length === 0 ? 'text-indigo-600' : ''}`}
                  >
                    <Folder className="w-4 h-4" />
                    Jadwal
                  </button>
                  {jadwalPath.map((path, idx) => (
                    <React.Fragment key={idx}>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                      <button 
                        onClick={() => setJadwalPath(jadwalPath.slice(0, idx + 1))} 
                        className={`hover:text-indigo-600 transition-colors ${idx === jadwalPath.length - 1 ? 'text-indigo-600' : ''}`}
                      >
                        {path}
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                {Object.keys(groupedJadwal).length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                    <p className="text-slate-500 font-bold text-sm sm:text-base">Belum ada jadwal yang dibuat.</p>
                  </div>
                ) : !currentFolderContent ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                    <p className="text-slate-500 font-bold text-sm sm:text-base">Folder tidak ditemukan.</p>
                  </div>
                ) : (
                  <div>
                    {jadwalPath.length < 5 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Object.keys(currentFolderContent).sort((a,b) => {
                          if (jadwalPath.length === 3) {
                             const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
                             return days.indexOf(a) - days.indexOf(b);
                          }
                          return a.localeCompare(b);
                        }).map((folderName) => {
                          // Calculate item count recursively
                          const countItems = (obj: any): number => {
                            if (Array.isArray(obj)) return obj.length;
                            let count = 0;
                            for (const key in obj) {
                              count += countItems(obj[key]);
                            }
                            return count;
                          };
                          const itemsCount = countItems(currentFolderContent[folderName]);

                          return (
                            <div 
                              key={folderName}
                              onClick={() => setJadwalPath([...jadwalPath, folderName])}
                              className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 hover:border-indigo-200 transition-all shadow-sm hover:shadow-md group"
                            >
                              <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-indigo-500 transition-colors shrink-0">
                                <Folder className="w-6 h-6 fill-indigo-100 group-hover:fill-indigo-200 transition-colors" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-extrabold text-slate-800 truncate" title={folderName}>{folderName}</h4>
                                <p className="text-xs font-bold text-slate-400 mt-0.5">{itemsCount} Jadwal</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {currentFolderContent.sort((a: any, b: any) => a.jamMulai.localeCompare(b.jamMulai)).map((j: any) => {
                          const tentor = tentors.find(t => t.id === j.tentorId);
                          return (
                            <div key={j.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
                              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                    <Clock className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-black text-slate-900 text-base">{j.mataPelajaran}</h4>
                                    <p className="text-sm font-bold text-indigo-600 mt-0.5">{j.jamMulai} - {j.jamSelesai}</p>
                                  </div>
                                </div>
                                <div className="flex gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-100">
                                  <button 
                                    onClick={() => {
                                      setEditingJadwal(j);
                                      setIsJadwalModalOpen(true);
                                    }}
                                    className="p-2 rounded-md text-slate-400 hover:text-purple-600 hover:bg-purple-100 transition-colors"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setConfirmModal({
                                        isOpen: true,
                                        title: 'Hapus Jadwal',
                                        message: 'Yakin ingin menghapus jadwal ini? Jadwal yang dihapus tidak dapat dikembalikan.',
                                        confirmText: 'Hapus',
                                        onConfirm: () => {
                                          deleteJadwal(j.id);
                                          setConfirmModal(prev => ({ ...prev, isOpen: false }));
                                        }
                                      });
                                    }}
                                    className="p-2 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-100 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">Pengajar</p>
                                  <p className="text-sm font-bold text-slate-800">{tentor?.nama || 'Unknown'}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 max-h-32 overflow-y-auto">
                                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">Siswa</p>
                                  <div className="space-y-1.5">
                                    {Array.from(new Set([...(j.studentIds || []), (j as any).studentId])).filter(Boolean).map((sid: any) => {
                                      const student = students.find(s => s.id === sid);
                                      return (
                                        <p key={sid} className="text-xs font-bold text-slate-700 flex items-center gap-2 truncate">
                                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                                          {student?.nama || 'Unknown'}
                                        </p>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <TemplateJadwalTab />
          )}
        </div>
      )}

{/* PEMBERITAHUAN */}
      {portalTab === 'pemberitahuan' && (
        <NotificationManagement />
      )}

      {/* ULASAN TAB */}
      {portalTab === 'ulasan' && (
        <AdminUlasanTab />
      )}
      
      {/* PENGATURAN PUBLIK */}
      {portalTab === 'public_settings' && (
        <PublicSettingsAdmin />
      )}

      {/* Tentor Modal */}
      {isTentorModalOpen && (
        <TentorManagementModal
          onClose={() => setIsTentorModalOpen(false)}
          editingTentor={editingTentor}
          onSubmit={(data) => {
            if (editingTentor) {
              updateTentor({ ...editingTentor, ...data } as any);
            } else {
              addTentor(data as any);
            }
            setIsTentorModalOpen(false);
          }}
        />
      )}

      {/* Student Modal */}
      {isStudentModalOpen && (
        <StudentManagementModal
          isOpen={isStudentModalOpen}
          onClose={() => setIsStudentModalOpen(false)}
          editingStudent={editingStudent}
        />
      )}

      {/* Jadwal Modal */}
      {isJadwalModalOpen && (
        <JadwalManagementModal
          onClose={() => setIsJadwalModalOpen(false)}
          editingJadwal={editingJadwal}
        />
      )}
      
      {isGenerateModalOpen && (
        <GenerateJadwalModal onClose={() => setIsGenerateModalOpen(false)} />
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText="Batal"
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      <RekapitulasiModal 
        isOpen={isRekapModalOpen} 
        onClose={() => setIsRekapModalOpen(false)} 
        students={students}
        tentors={tentors}
        reports={reports}
        jadwals={jadwalList}
      />
    </div>
  );
};