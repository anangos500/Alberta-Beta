export type Role = 'admin' | 'tentor' | 'orang_tua';

export type Jenjang = 'TK' | 'SD' | 'SMP';

export interface Student {
  id: string;
  nis: string; // Nomor Induk Siswa Alberta
  nama: string;
  jenjang: Jenjang;
  kelas: number; // 0 for TK, 1-6 for SD, 7-9 for SMP
  sekolah: string;
  status: 'aktif' | 'nonaktif'; // 'nonaktif' for soft-deleted / alumni
  namaOrangTua: string;
  noHpOrangTua: string;
  parentId: string; // connects to parent user
  tentorId: string; // assigned tentor
  tentorNama: string;
  tanggalDaftar: string;
  foto?: string;
}

export interface Tentor {
  id: string;
  nama: string;
  gelar: string;
  spesialisasi: string; // e.g. "Matematika & IPA (SD & SMP)"
  lulusan: string;
  noHp: string;
  foto: string;
  bio: string;
}

// 7 Aspect Ratings for Weekly Report
export interface WeeklyRatings {
  pemahamanMateri: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Bimbingan';
  kemampuanSoal: 'Tepat dan Cepat' | 'Tepat namun Masih Membutuhkan Waktu' | 'Cukup Tepat' | 'Masih Perlu Latihan';
  keaktifan: 'Sangat Aktif' | 'Aktif' | 'Cukup Aktif' | 'Kurang Aktif';
  kemandirian: 'Sangat Mandiri' | 'Mandiri' | 'Kadang Masih Dibantu' | 'Masih Memerlukan Pendampingan';
  interaksi: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Pendampingan';
  sikap: 'Sangat Disiplin' | 'Disiplin' | 'Cukup Disiplin' | 'Perlu Diingatkan';
  keterampilanCatat: 'Cepat, Rapi, dan Lengkap' | 'Rapi dan Lengkap' | 'Cukup Lengkap, Masih Perlu Meningkatkan Kecepatan' | 'Masih Memerlukan Pendampingan dalam Mencatat';
}

export interface WeeklyReport {
  id: string;
  studentId: string;
  studentNama: string;
  studentJenjang: Jenjang;
  studentKelas: number;
  tentorId: string;
  tentorNama: string;
  mingguKe: number;
  tanggalPembelajaran: string; // YYYY-MM-DD
  hari: string; // Senin, Selasa, etc.
  mataPelajaran: string; // e.g., "Matematika & IPA"
  materi: string; // e.g., "Pecahan Campuran & Tata Surya"
  ratings: WeeklyRatings;
  targetBerikutnya: string;
  saranTentor: string;
  dokumentasiFoto: string[]; // max 3 image URLs
  createdDate: string;
}

export interface ProgramInfo {
  id: string;
  nama: string;
  jenjang: Jenjang;
  deskripsi: string;
  mapel: string[];
  fasilitas: string[];
  hargaEstimate: string;
  jadwal: string;
  badge: string;
}

export interface UserAccount {
  id: string;
  username: string;
  nama: string;
  role: Role;
  studentIds?: string[]; // for Orang Tua
  tentorId?: string; // for Tentor
  foto?: string;
}

export interface Jadwal {
  id: string;
  tentorId: string;
  studentIds: string[];
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  mataPelajaran: string;
  ruangan?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  targetType: 'all' | 'student' | 'tentor';
  targetId?: string; // studentId or tentorId, undefined if 'all'
  senderId: string; // admin user ID
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Umum' | 'Pendaftaran' | 'Program TK' | 'Program SD' | 'Program SMP' | 'Laporan Belajar';
}
export interface Parent {
  id: string;
  nama: string;
  noHp: string;
  foto?: string;
}
