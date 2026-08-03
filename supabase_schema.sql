-- Supabase Schema for Bimbel Alberta

-- Users table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('admin', 'tentor', 'orang_tua')) not null,
  nama text not null,
  no_hp text,
  foto text,
  gelar text,
  spesialisasi text,
  lulusan text,
  bio text
);

-- Students
create table public.students (
  id uuid default gen_random_uuid() primary key,
  nama text not null,
  jenjang text check (jenjang in ('SD', 'SMP')) not null,
  kelas integer not null,
  sekolah text not null,
  status text check (status in ('aktif', 'cuti', 'lulus')) not null,
  tentor_id uuid references public.profiles(id),
  parent_id uuid references public.profiles(id)
);

-- Note: We no longer need the parent_students table, but keeping it for backward compatibility or dropping it.

-- Weekly Reports
create table public.weekly_reports (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.students(id) on delete cascade not null,
  tentor_id uuid references public.profiles(id) on delete cascade not null,
  minggu_ke integer not null,
  tanggal_pembelajaran text,
  hari text,
  mata_pelajaran text,
  materi_diajarkan text not null,
  target_berikutnya text not null,
  saran_tentor text not null,
  dokumentasi_foto jsonb default '[]'::jsonb,
  rating_pemahaman text not null,
  rating_ketelitian text not null,
  rating_keaktifan text not null,
  rating_sikap text not null,
  rating_kemandirian text,
  rating_interaksi text,
  rating_keterampilan text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Jadwal
create table public.jadwals (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.students(id) on delete cascade not null,
  tentor_id uuid references public.profiles(id) on delete cascade not null,
  hari text not null,
  jam text not null,
  ruangan text
);

-- Notifications
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  message text not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  target_type text check (target_type in ('all', 'student', 'tentor')) not null,
  target_id uuid, -- could be student_id or tentor_id depending on target_type
  sender_id uuid references public.profiles(id) on delete cascade not null
);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.weekly_reports enable row level security;
alter table public.jadwals enable row level security;
alter table public.notifications enable row level security;

-- Create policies (Simplification for now: allow all authenticated users to read/write)
-- In production, these should be more strictly scoped based on roles.
create policy "Allow all actions for authenticated users on profiles" on public.profiles for all using (auth.role() = 'authenticated');
create policy "Allow all actions for authenticated users on students" on public.students for all using (auth.role() = 'authenticated');
create policy "Allow all actions for authenticated users on weekly_reports" on public.weekly_reports for all using (auth.role() = 'authenticated');
create policy "Allow all actions for authenticated users on jadwals" on public.jadwals for all using (auth.role() = 'authenticated');
create policy "Allow all actions for authenticated users on notifications" on public.notifications for all using (auth.role() = 'authenticated');

-- Auto-confirm email trigger for users created by admin
CREATE OR REPLACE FUNCTION auto_confirm_user_email()
RETURNS trigger AS $$
BEGIN
  -- Set email_confirmed_at to current timestamp
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created_auto_confirm ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created_auto_confirm
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION auto_confirm_user_email();
CREATE TABLE public.public_settings (
  id text primary key,
  content jsonb not null default '{}'::jsonb
);

ALTER TABLE public.public_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only access" ON public.public_settings FOR SELECT USING (true);
CREATE POLICY "Allow admin to update" ON public.public_settings FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO public.public_settings (id, content) VALUES ('main', '{
  "hero_slides": [
    {
      "image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000",
      "title": "Raih Prestasi Gemilang Bersama Bimbel Alberta",
      "description": "Program bimbingan belajar intensif untuk TK, SD, dan SMP di Bondowoso. Dilengkapi dengan laporan mingguan ke orang tua, pengajar profesional, dan kelas interaktif maksimal 6 siswa per sesi.",
      "buttonText": "Daftar Sekarang",
      "primary": true
    },
    {
      "image": "https://images.unsplash.com/photo-1427504494785-319ce51d8cce?auto=format&fit=crop&q=80&w=2000",
      "title": "Fasilitas Belajar Modern dan Nyaman",
      "description": "Nikmati suasana belajar yang kondusif dengan fasilitas lengkap, ruang kelas ber-AC, dan media pembelajaran interaktif untuk mendukung pemahaman materi.",
      "buttonText": "Lihat Fasilitas",
      "primary": false
    },
    {
      "image": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=2000",
      "title": "Tutor Berpengalaman dan Profesional",
      "description": "Dibimbing langsung oleh pengajar yang ahli di bidangnya, sabar, dan menggunakan metode pendekatan personal agar setiap siswa dapat berkembang maksimal.",
      "buttonText": "Kenali Tutor Kami",
      "primary": false
    }
  ],
  "programs": [
    {
      "id": "prog-tk",
      "jenjang": "TK",
      "deskripsi": "Program belajar membaca, menulis, dan berhitung dasar dengan metode menyenangkan.",
      "image": "https://images.unsplash.com/photo-1544252890-50284ab9c3b8?auto=format&fit=crop&q=80&w=600"
    },
    {
      "id": "prog-sd",
      "jenjang": "SD",
      "deskripsi": "Program bimbingan belajar komprehensif untuk siswa SD kelas 1-6 dengan metode interaktif.",
      "image": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600"
    },
    {
      "id": "prog-smp",
      "jenjang": "SMP",
      "deskripsi": "Program bimbingan intensif untuk siswa SMP dengan fokus pada pemahaman konsep.",
      "image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600"
    }
  ],
  "featured_tentors": []
}');
