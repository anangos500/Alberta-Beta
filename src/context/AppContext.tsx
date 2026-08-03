import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Tentor, Parent, WeeklyReport, UserAccount, Role, Jadwal, Notification } from '../types';
import { supabase } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';

interface AppContextType {
  // Navigation State
  currentView: 'public' | 'portal';
  setCurrentView: (view: 'public' | 'portal') => void;
  publicSection: string;
  setPublicSection: (section: string) => void;
  portalTab: string;
  setPortalTab: (tab: string) => void;

  // Auth State
  currentUser: UserAccount | null;
  setCurrentUser: (user: UserAccount | null) => void;
  isAuthLoading: boolean;
  logout: () => void;
  loginAsRole: (role: Role, studentId?: string) => void;

  // Data State
  students: Student[];
  tentors: Tentor[];
  parents: Parent[];
  reports: WeeklyReport[];
  jadwalList: Jadwal[];
  notifications: Notification[];
  
  // Selected child for Orang Tua view
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;

  // Jadwal Actions
  addJadwal: (jadwal: Omit<Jadwal, 'id'>) => void;
  updateJadwal: (jadwal: Jadwal) => void;
  deleteJadwal: (id: string) => void;

  // Notification Actions
  addNotification: (notification: Omit<Notification, 'id' | 'date'>) => void;
  deleteNotification: (id: string) => void;

  // Student Actions
  addStudent: (student: Omit<Student, 'id' | 'nis' | 'tanggalDaftar'>) => void;
  updateStudent: (student: Student) => void;
  toggleStudentStatus: (id: string) => void;

  // Report Actions
  addWeeklyReport: (report: Omit<WeeklyReport, 'id' | 'createdDate'>) => void;
  updateWeeklyReport: (report: WeeklyReport) => void;
  deleteWeeklyReport: (id: string) => void;

  // Tentor Actions
  addTentor: (tentor: Omit<Tentor, 'id'>) => void;
  updateTentor: (tentor: Tentor) => void;

  // Modal Controls
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: (open: boolean) => void;
  
  resetData: () => void;
  publicContent: any;
  updatePublicContent: (content: any) => void;
  isPublicDataLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'public' | 'portal'>('public');
  const [publicSection, setPublicSection] = useState<string>('home');
  const [portalTab, setPortalTab] = useState<string>('dashboard');

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const [students, setStudents] = useState<Student[]>([]);
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [tentors, setTentors] = useState<Tentor[]>([]);
  const [publicContent, setPublicContent] = useState<any>(null);
  const [parents, setParents] = useState<Parent[]>([]);
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [isPublicDataLoading, setIsPublicDataLoading] = useState(true);

  useEffect(() => {
    // Initial fetch of public data (tentors)
    const fetchPublicData = async () => {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        setIsPublicDataLoading(false);
        return;
      }
      setIsPublicDataLoading(true);
      try {
        const tentorsRes = await supabase.from('profiles').select('*').eq('role', 'tentor');
        if (tentorsRes.data) {
          const mappedTentors = tentorsRes.data.map((t: any) => ({
            ...t,
            noHp: t.no_hp,
            gelar: t.gelar || 'S.Pd.',
            spesialisasi: t.spesialisasi || 'Guru Bimbel',
            lulusan: t.lulusan || 'Universitas',
            bio: t.bio || 'Pengajar berpengalaman'
          }));
          setTentors(mappedTentors);
        }
        
        const settingsRes = await supabase.from('public_settings').select('*').eq('id', 'main').single();
        if (settingsRes.data) {
          setPublicContent(settingsRes.data.content);
        }
      } catch (e) {
        console.error('Error fetching public data:', e);
      } finally {
        setIsPublicDataLoading(false);
      }
    };
    fetchPublicData();
  }, []);

  const updatePublicContent = async (newContent: any) => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    const { error } = await supabase.from('public_settings').upsert({ id: 'main', content: newContent });
    if (error) {
      console.error(error);
      alert("Gagal memperbarui pengaturan publik.");
    } else {
      setPublicContent(newContent);
    }
  };

  useEffect(() => {
    // Initial fetch of data if user is logged in
    const fetchData = async () => {
      if (!currentUser || !import.meta.env.VITE_SUPABASE_URL) return;

      try {
        const [studentsRes, tentorsRes, parentsRes, reportsRes, jadwalRes, notifRes] = await Promise.all([
          supabase.from("students").select("*"),
          supabase.from('profiles').select('*').eq('role', 'tentor'),
          supabase.from('profiles').select('*').eq('role', 'orang_tua'),
          supabase.from('weekly_reports').select('*'),
          supabase.from('jadwals').select('*'),
          supabase.from('notifications').select('*').order('date', { ascending: false })
        ]);

        if (studentsRes.data) {
          const tentorsData = tentorsRes.data || [];
          const parentsData = parentsRes.data || [];

          // Map DB keys to frontend keys if needed, e.g. parent_id -> parentId
          const mappedStudents = studentsRes.data.map((s: any) => {
            const tentor = tentorsData.find((t: any) => t.id === s.tentor_id);
            const parent = parentsData.find((p: any) => p.id === s.parent_id);

            return {
              ...s,
              nis: s.id.substring(0, 8).toUpperCase(),
              parentId: s.parent_id,
              tentorId: s.tentor_id,
              tentorNama: tentor ? tentor.nama : 'Belum Ditentukan',
              namaOrangTua: parent ? parent.nama : 'Belum Ditentukan',
              noHpOrangTua: parent ? parent.no_hp : '',
            };
          });
          setStudents(mappedStudents as any);
        }
        if (tentorsRes.data) {
          const mappedTentors = tentorsRes.data.map((t: any) => ({
            ...t,
            noHp: t.no_hp,
            gelar: t.gelar || 'S.Pd.',
            spesialisasi: t.spesialisasi || 'Guru Bimbel',
            lulusan: t.lulusan || 'Universitas',
            bio: t.bio || 'Pengajar berpengalaman'
          }));
          setTentors(mappedTentors);
        }
        if (parentsRes.data) setParents(parentsRes.data.map((p: any) => ({ id: p.id, nama: p.nama, noHp: p.no_hp, foto: p.foto })));
        if (reportsRes.data) {
          const studentsData = studentsRes.data || [];
          const tentorsData = tentorsRes.data || [];
          
          const mappedReports = reportsRes.data.map((r: any) => {
            const student = studentsData.find((s: any) => s.id === r.student_id);
            const tentor = tentorsData.find((t: any) => t.id === r.tentor_id);
            
            return {
              id: r.id,
              studentId: r.student_id,
              studentNama: student?.nama || 'Unknown Student',
              studentJenjang: student?.jenjang || 'SD',
              studentKelas: student?.kelas || 1,
              tentorId: r.tentor_id,
              tentorNama: tentor?.nama || 'Unknown Tentor',
              mingguKe: r.minggu_ke,
              tanggalPembelajaran: r.tanggal_pembelajaran || new Date().toISOString().split('T')[0],
              hari: r.hari || 'Senin',
              mataPelajaran: r.mata_pelajaran || 'Umum',
              materi: r.materi_diajarkan,
              targetBerikutnya: r.target_berikutnya,
              saranTentor: r.saran_tentor,
              dokumentasiFoto: r.dokumentasi_foto,
              createdDate: r.created_at,
              ratings: {
                pemahamanMateri: r.rating_pemahaman,
                kemampuanSoal: r.rating_ketelitian,
                keaktifan: r.rating_keaktifan,
                sikap: r.rating_sikap,
                kemandirian: r.rating_kemandirian || 'Mandiri',
                interaksi: r.rating_interaksi || 'Sangat Baik',
                keterampilanCatat: r.rating_keterampilan || 'Rapi dan Lengkap'
              }
            };
          });
          setReports(mappedReports as any);
        }
        if (jadwalRes.data) setJadwalList(jadwalRes.data as any);
        if (notifRes.data) {
          const mappedNotifs = notifRes.data.map((n: any) => ({
            ...n,
            targetType: n.target_type,
            targetId: n.target_id,
            senderId: n.sender_id,
          }));
          setNotifications(mappedNotifs as any);
        }
      } catch (e) {
        console.error('Error fetching data:', e);
      }
    };
    fetchData();
  }, [currentUser]);

  // Handle session check on mount
  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setIsAuthLoading(false);
      }
      if (session) {
        (async () => {
          try {
            const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            if (data) {
              let studentIds: string[] = [];
              if (data.role === "orang_tua") {
                const { data: studentsData } = await supabase.from("students").select("id").eq("parent_id", data.id);
                if (studentsData) studentIds = studentsData.map(s => s.id);
              }

              setCurrentUser({
                id: data.id,
                username: session.user.email || '',
                nama: data.nama,
                role: data.role,
                foto: data.foto,
                studentIds
              });
            }
          } catch (err) {
            console.error(err);
          } finally {
            setIsAuthLoading(false);
          }
        })();
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthLoading(false);
      }
      if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loginAsRole = () => {}; // Removed mock login

  const logout = async () => {
    if (import.meta.env.VITE_SUPABASE_URL) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setCurrentView('public');
    setPublicSection('home');
  };

  const addStudent = async (newStudentData: any) => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    
    let parentId = newStudentData.parentId;

    // Handle Parent Account Creation
    if (newStudentData.parentMode === 'new') {
      const adminClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );
      
      const { data: authData, error: authError } = await adminClient.auth.signUp({
        email: newStudentData.parentEmail,
        password: newStudentData.parentPassword,
      });
      
      if (authError) {
        console.error('Error creating parent auth account:', authError);
        alert(`Gagal membuat akun login orang tua: ${authError.message}`);
        return;
      }
      
      parentId = authData.user?.id || crypto.randomUUID();
      
      const newParentProfile = {
        id: parentId,
        role: 'orang_tua',
        nama: newStudentData.namaOrangTua,
        no_hp: newStudentData.noHpOrangTua
      };

      const { data: parentData, error: parentError } = await supabase.from('profiles').insert([newParentProfile]).select();
      
      if (parentError) {
        console.error('Error adding parent profile:', parentError);
        alert('Gagal menyimpan profil orang tua.');
        return;
      }

      if (parentData) {
        setParents(prev => [...prev, {
          id: parentData[0].id,
          nama: parentData[0].nama,
          noHp: parentData[0].no_hp,
          foto: parentData[0].foto
        }]);
      }
    }

    // Prepare student data for Supabase (excluding UI-only fields)
    const dbStudentData = {
      nama: newStudentData.nama,
      jenjang: newStudentData.jenjang,
      kelas: newStudentData.kelas,
      sekolah: newStudentData.sekolah,
      status: newStudentData.status,
      tentor_id: newStudentData.tentorId,
      parent_id: parentId || null
    };

    const { data, error } = await supabase.from('students').insert([dbStudentData]).select();
    
    if (data && !error) {
      const insertedStudent = data[0];
      
      // For local state UI compatibility
      const fullStudent: Student = {
        id: insertedStudent.id,
        nis: insertedStudent.id.substring(0, 8).toUpperCase(),
        nama: insertedStudent.nama,
        jenjang: insertedStudent.jenjang,
        kelas: insertedStudent.kelas,
        sekolah: insertedStudent.sekolah,
        status: insertedStudent.status,
        namaOrangTua: newStudentData.namaOrangTua,
        noHpOrangTua: newStudentData.noHpOrangTua,
        parentId: parentId,
        tentorId: newStudentData.tentorId,
        tentorNama: newStudentData.tentorNama,
        tanggalDaftar: new Date().toISOString(),
        foto: newStudentData.foto
      };
      
      setStudents((prev) => [...prev, fullStudent]);
    } else {
       console.error('Error adding student:', error);
       alert('Gagal menyimpan data siswa.');
    }
  };

  const updateStudent = async (updatedStudent: any) => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    const { error } = await supabase.from('students').update(updatedStudent).eq('id', updatedStudent.id);
    if (!error) setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  const toggleStudentStatus = async (id: string) => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    const student = students.find(s => s.id === id);
    if (student) {
      const newStatus = student.status === 'aktif' ? 'nonaktif' : 'aktif';
      await updateStudent({ ...student, status: newStatus });
    }
  };

  const addWeeklyReport = async (reportData: any) => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    const dbData = {
      student_id: reportData.studentId,
      tentor_id: reportData.tentorId,
      minggu_ke: reportData.mingguKe,
      tanggal_pembelajaran: reportData.tanggalPembelajaran,
      hari: reportData.hari,
      mata_pelajaran: reportData.mataPelajaran,
      materi_diajarkan: reportData.materi,
      target_berikutnya: reportData.targetBerikutnya,
      saran_tentor: reportData.saranTentor,
      dokumentasi_foto: reportData.dokumentasiFoto,
      rating_pemahaman: reportData.ratings.pemahamanMateri,
      rating_ketelitian: reportData.ratings.kemampuanSoal,
      rating_keaktifan: reportData.ratings.keaktifan,
      rating_sikap: reportData.ratings.sikap,
      rating_kemandirian: reportData.ratings.kemandirian,
      rating_interaksi: reportData.ratings.interaksi,
      rating_keterampilan: reportData.ratings.keterampilanCatat
    };
    const { data, error } = await supabase.from('weekly_reports').insert([dbData]).select();
    if (error) {
      console.error("Insert report error:", error);
      alert("Gagal menyimpan laporan ke database.");
    }
    if (data && !error) {
      const r = data[0];
      const newReport = {
        ...reportData,
        id: r.id,
        createdDate: r.created_at
      };
      setReports((prev) => [...prev, newReport as any]);
    }
  };

  const updateWeeklyReport = async (updatedReport: any) => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    const dbData = {
      student_id: updatedReport.studentId,
      tentor_id: updatedReport.tentorId,
      minggu_ke: updatedReport.mingguKe,
      tanggal_pembelajaran: updatedReport.tanggalPembelajaran,
      hari: updatedReport.hari,
      mata_pelajaran: updatedReport.mataPelajaran,
      materi_diajarkan: updatedReport.materi,
      target_berikutnya: updatedReport.targetBerikutnya,
      saran_tentor: updatedReport.saranTentor,
      dokumentasi_foto: updatedReport.dokumentasiFoto,
      rating_pemahaman: updatedReport.ratings.pemahamanMateri,
      rating_ketelitian: updatedReport.ratings.kemampuanSoal,
      rating_keaktifan: updatedReport.ratings.keaktifan,
      rating_sikap: updatedReport.ratings.sikap,
      rating_kemandirian: updatedReport.ratings.kemandirian,
      rating_interaksi: updatedReport.ratings.interaksi,
      rating_keterampilan: updatedReport.ratings.keterampilanCatat
    };
    const { error } = await supabase.from('weekly_reports').update(dbData).eq('id', updatedReport.id);
    if (error) {
      console.error("Update report error:", error);
      alert("Gagal memperbarui laporan di database.");
    }
    if (!error) setReports((prev) => prev.map((r) => (r.id === updatedReport.id ? updatedReport : r)));
  };

  const deleteWeeklyReport = async (id: string) => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    const { error } = await supabase.from('weekly_reports').delete().eq('id', id);
    if (!error) setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const addTentor = async (tentorData: any) => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    
    let userId = null;
    
    // If email and password provided, create user first
    if (tentorData.email && tentorData.password) {
      // Use secondary client so we don't clobber admin's session
      const adminClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );
      
      const { data: authData, error: authError } = await adminClient.auth.signUp({
        email: tentorData.email,
        password: tentorData.password,
      });
      
      if (authError) {
        console.error('Error creating tentor auth account:', authError);
        alert(`Gagal membuat akun login tentor: ${authError.message}`);
        return;
      }
      userId = authData.user?.id;
    }

    const newProfile = {
      id: userId || crypto.randomUUID(),
      role: 'tentor',
      nama: tentorData.nama,
      no_hp: tentorData.noHp,
      foto: tentorData.foto,
      gelar: tentorData.gelar,
      spesialisasi: tentorData.spesialisasi,
      lulusan: tentorData.lulusan,
      bio: tentorData.bio
    };

    const { data, error } = await supabase.from('profiles').insert([newProfile]).select();
    
    if (error) {
      console.error('Error adding tentor profile:', error);
      alert('Gagal menyimpan profil tentor.');
      return;
    }

    // Since our local type has more fields that aren't in DB right now, we merge them
    if (data) {
      const addedTentor = {
        ...tentorData,
        id: data[0].id,
        nama: data[0].nama,
        noHp: data[0].no_hp,
        foto: data[0].foto
      };

      setTentors(prev => [...prev, addedTentor]);
    }
  };
  const updateTentor = async (tentorData: any) => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    
    const updateProfile = {
      nama: tentorData.nama,
      no_hp: tentorData.noHp,
      foto: tentorData.foto,
      gelar: tentorData.gelar,
      spesialisasi: tentorData.spesialisasi,
      lulusan: tentorData.lulusan,
      bio: tentorData.bio
    };

    const { error } = await supabase.from('profiles').update(updateProfile).eq('id', tentorData.id);
    
    if (error) {
      console.error('Error updating tentor profile:', error);
      alert('Gagal memperbarui profil tentor.');
      return;
    }
    
    setTentors(prev => prev.map(t => t.id === tentorData.id ? { ...t, ...tentorData } : t));
  };

  const addJadwal = async (jadwalData: any) => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    const { data, error } = await supabase.from('jadwals').insert([jadwalData]).select();
    if (data && !error) setJadwalList((prev) => [...prev, data[0] as any]);
  };

  const updateJadwal = async (updatedJadwal: any) => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    const { error } = await supabase.from('jadwals').update(updatedJadwal).eq('id', updatedJadwal.id);
    if (!error) setJadwalList((prev) => prev.map((j) => (j.id === updatedJadwal.id ? updatedJadwal : j)));
  };

  const deleteJadwal = async (id: string) => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    const { error } = await supabase.from('jadwals').delete().eq('id', id);
    if (!error) setJadwalList((prev) => prev.filter((j) => j.id !== id));
  };

  const addNotification = async (notifData: any) => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    
    const dbData = {
      title: notifData.title,
      message: notifData.message,
      target_type: notifData.targetType,
      target_id: notifData.targetId,
      sender_id: notifData.senderId
    };

    const { data, error } = await supabase.from('notifications').insert([dbData]).select();
    if (data && !error) {
      const inserted = data[0];
      const newNotif = {
        ...inserted,
        targetType: inserted.target_type,
        targetId: inserted.target_id,
        senderId: inserted.sender_id,
      };
      setNotifications((prev) => [newNotif as any, ...prev]);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (!error) setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const resetData = () => {};

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        publicSection,
        setPublicSection,
        portalTab,
        setPortalTab,
        currentUser,
        setCurrentUser,
        loginAsRole,
        logout,
        students,
        tentors,
        parents,
        reports,
        selectedChildId,
        setSelectedChildId,
        addStudent,
        updateStudent,
        toggleStudentStatus,
        addWeeklyReport,
        updateWeeklyReport,
        deleteWeeklyReport,
        addTentor,
        updateTentor,
        jadwalList,
        addJadwal,
        updateJadwal,
        deleteJadwal,
        notifications,
        addNotification,
        deleteNotification,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        resetData,
        publicContent,
        updatePublicContent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
