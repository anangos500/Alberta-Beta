import React from 'react';
import { Camera, Instagram, Video } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GalleryPage: React.FC = () => {
  const { publicContent } = useApp();
  
  const defaultGalleryItems = [
    {
      title: 'Suasana Belajar Kelompok',
      caption: 'Pendampingan matematika interaktif di kelas AC Bimbel Alberta.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
      tag: 'Kegiatan SD'
    },
    {
      title: 'Eksperimen Sains Seru',
      caption: 'Siswa mempelajari konsep sains secara visual dan praktikal.',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
      tag: 'Kegiatan SMP'
    },
    {
      title: 'Diskusi Pemecahan Soal',
      caption: 'Tentor membimbing penyelesaian soal dengan pendekatan menyenangkan.',
      image: 'https://images.unsplash.com/photo-1427504494785-319ce51d8cce?auto=format&fit=crop&q=80&w=800',
      tag: 'Diskusi Interaktif'
    },
    {
      title: 'Fasilitas Nyaman',
      caption: 'Ruang belajar ber-AC dengan penerangan optimal untuk fokus maksimal.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
      tag: 'Fasilitas'
    }
  ];

  const galleryItems = publicContent?.gallery_items && publicContent.gallery_items.length > 0 
    ? publicContent.gallery_items 
    : defaultGalleryItems;

  return (
    <section className="py-12 lg:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Camera className="w-4 h-4" />
            <span>Galeri Alberta</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            Kumpulan Dokumentasi <span className="text-purple-600">Kegiatan</span>
          </h1>
          <p className="text-slate-600 text-base lg:text-lg">
            Intip berbagai keseruan aktivitas belajar mengajar dan fasilitas yang ada di Bimbel Alberta.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {galleryItems.map((item: any, idx: number) => (
            <div key={idx} className="group relative rounded-xl overflow-hidden aspect-square bg-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
              <img 
                src={item.image || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800'} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 translate-y-2 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-2 py-1 bg-purple-600/90 backdrop-blur-sm text-[10px] md:text-xs font-bold rounded-lg mb-1.5 md:mb-2 text-white">
                  {item.tag}
                </span>
                <h3 className="text-sm md:text-lg font-bold text-white leading-tight mb-1">{item.title}</h3>
                <p className="text-white/80 text-[10px] md:text-xs line-clamp-2 hidden md:block">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
