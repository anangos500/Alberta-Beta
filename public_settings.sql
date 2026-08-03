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
