import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Settings, MessageSquare, CheckCircle, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const AdminUlasanTab: React.FC = () => {
  const { publicContent, updatePublicContent, ratings } = useApp();
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedToPublish, setSelectedToPublish] = useState<string[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>(publicContent?.testimonials || []);

  const isFormEnabled = publicContent?.isRatingFormEnabled ?? false;

  const ratingSubmissions = ratings.map(r => ({
    id: r.id,
    payload: {
      parentName: r.parent_name,
      rating: r.rating,
      comment: r.comment
    },
    date: r.created_at
  }));

  useEffect(() => {
    setTestimonials(publicContent?.testimonials || []);
  }, [publicContent]);

  const toggleRatingForm = async () => {
    setIsUpdating(true);
    try {
      await updatePublicContent({
        ...publicContent,
        isRatingFormEnabled: !isFormEnabled
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const publishSelected = async () => {
    if (selectedToPublish.length === 0) return;
    
    setIsUpdating(true);
    try {
      const newTestimonials = [...testimonials];
      
      selectedToPublish.forEach(id => {
        const rating = ratingSubmissions.find(r => r.id === id);
        if (rating && rating.payload) {
          // Avoid duplicates
          if (!newTestimonials.find(t => t.id === id)) {
            newTestimonials.push({
              id: rating.id,
              name: rating.payload.parentName || 'Orang Tua Siswa',
              role: 'Orang Tua Siswa Bimbel Alberta',
              text: rating.payload.comment,
              ratingValue: rating.payload.rating
            });
          }
        }
      });
      
      await updatePublicContent({
        ...publicContent,
        testimonials: newTestimonials
      });
      
      setSelectedToPublish([]);
      alert("Berhasil menambahkan ulasan ke Halaman Umum!");
    } finally {
      setIsUpdating(false);
    }
  };

  const removeTestimonial = async (id: string) => {
    if (!window.confirm("Hapus ulasan ini dari Halaman Umum?")) return;
    
    setIsUpdating(true);
    try {
      const newTestimonials = testimonials.filter(t => t.id !== id);
      await updatePublicContent({
        ...publicContent,
        testimonials: newTestimonials
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Settings Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Pengaturan Ulasan</h3>
            <p className="text-sm text-slate-500">Atur ketersediaan form ulasan untuk Orang Tua</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <p className="font-bold text-slate-900">Buka Form Ulasan Orang Tua</p>
            <p className="text-xs text-slate-500">Jika diaktifkan, orang tua dapat mengirimkan ulasan melalui portal mereka.</p>
          </div>
          <button
            onClick={toggleRatingForm}
            disabled={isUpdating}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors disabled:opacity-50 ${isFormEnabled ? 'bg-purple-600' : 'bg-slate-300'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isFormEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submissions List */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Ulasan Masuk</h3>
                <p className="text-xs text-slate-500">{ratingSubmissions.length} ulasan diterima</p>
              </div>
            </div>
            {selectedToPublish.length > 0 && (
              <button
                onClick={publishSelected}
                disabled={isUpdating}
                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Publish ({selectedToPublish.length})
              </button>
            )}
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {ratingSubmissions.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">Belum ada ulasan masuk.</p>
            ) : (
              ratingSubmissions.map(notif => {
                const isSelected = selectedToPublish.includes(notif.id);
                const isAlreadyPublished = testimonials.some(t => t.id === notif.id);
                
                return (
                  <div key={notif.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected || isAlreadyPublished}
                      disabled={isAlreadyPublished}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedToPublish([...selectedToPublish, notif.id]);
                        else setSelectedToPublish(selectedToPublish.filter(id => id !== notif.id));
                      }}
                      className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-sm text-slate-900">{notif.payload.parentName || 'Orang Tua'}</p>
                        <span className="text-[10px] text-slate-400">{new Date(notif.date).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className="flex gap-0.5 my-1">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= notif.payload.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 fill-slate-50'}`} />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 italic">"{notif.payload.comment}"</p>
                      
                      {isAlreadyPublished && (
                        <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Dipublish
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Published List */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Tampil di Halaman Umum</h3>
              <p className="text-xs text-slate-500">{testimonials.length} ulasan dipublish</p>
            </div>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {testimonials.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">Belum ada ulasan yang dipublish.</p>
            ) : (
              testimonials.map((t: any) => (
                <div key={t.id} className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl relative group">
                  <button
                    onClick={() => removeTestimonial(t.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white text-rose-500 hover:bg-rose-50 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Hapus dari halaman umum"
                  >
                    Hapus
                  </button>
                  <div className="flex justify-between items-start pr-8">
                    <p className="font-bold text-sm text-slate-900">{t.name}</p>
                  </div>
                  <div className="flex gap-0.5 my-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3 h-3 ${s <= (t.ratingValue || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 fill-slate-50'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 italic">"{t.text}"</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
