import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Send, CheckCircle2, Edit3 } from 'lucide-react';
import { supabase } from '../../lib/supabase'; 

export const OrangTuaUlasanTab: React.FC = () => {
  const { currentUser, publicContent, notifications } = useApp();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Check if admin has enabled the rating form
  const isEnabled = publicContent?.isRatingFormEnabled ?? false;

  const existingSubmission = notifications.find(n => n.title === 'RATING_SUBMISSION' && n.senderId === currentUser?.id);
  
  useEffect(() => {
    if (existingSubmission && !isEditing) {
      try {
        const payload = JSON.parse(existingSubmission.message);
        setRating(payload.rating || 5);
        setComment(payload.comment || '');
      } catch(e) {}
    }
  }, [existingSubmission, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Mohon isi komentar ulasan.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = {
        rating,
        comment,
        parentId: currentUser?.id,
        parentName: currentUser?.nama
      };
      
      if (existingSubmission) {
        const { error } = await supabase.from('notifications').update({
          message: JSON.stringify(payload),
          date: new Date().toISOString()
        }).eq('id', existingSubmission.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('notifications').insert([{
          title: 'RATING_SUBMISSION',
          message: JSON.stringify(payload),
          target_type: 'all',
          sender_id: currentUser?.id
        }]);
        if (error) throw error;
      }
      
      alert('Ulasan berhasil disimpan!');
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Gagal mengirim ulasan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEnabled && !existingSubmission) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Form Ulasan Belum Tersedia
        </h3>
        <p className="text-slate-600">
          Saat ini pengisian ulasan sedang ditutup oleh Admin.
        </p>
      </div>
    );
  }

  if (existingSubmission && !isEditing) {
    let savedRating = 5;
    let savedComment = '';
    try {
      const payload = JSON.parse(existingSubmission.message);
      savedRating = payload.rating || 5;
      savedComment = payload.comment || '';
    } catch(e) {}

    const canEdit = savedRating < 5 && isEnabled;

    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Ulasan Anda Telah Tersimpan
          </h3>
          <p className="text-slate-600 text-sm">
            Terima kasih telah memberikan penilaian untuk Bimbel Alberta.
          </p>
        </div>
        
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Penilaian Anda</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-6 h-6 ${star <= savedRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 fill-slate-50'}`} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Komentar</p>
            <p className="text-slate-700 italic">"{savedComment}"</p>
          </div>
        </div>

        {canEdit && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 bg-purple-50 text-purple-700 font-bold rounded-xl hover:bg-purple-100 transition-colors flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Perbarui Ulasan
            </button>
          </div>
        )}
        {!isEnabled && savedRating < 5 && (
           <p className="text-xs text-center text-slate-400 mt-4">Form ulasan saat ini sedang ditutup oleh Admin sehingga ulasan tidak dapat diperbarui.</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
          Bagaimana Pengalaman Belajar Ananda?
        </h3>
        <p className="text-slate-600 text-sm">
          Berikan penilaian dan ulasan Anda terkait layanan Bimbel Alberta. Ulasan Anda mungkin akan ditampilkan di halaman depan website kami.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-700">Penilaian (Bintang)</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star className={`w-10 h-10 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 fill-slate-50'}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-700">Ulasan & Komentar</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 text-slate-700"
            placeholder="Tuliskan pengalaman Anda..."
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {existingSubmission ? 'Simpan Perubahan' : 'Kirim Ulasan'}
          </button>
          
          {existingSubmission && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                // reset to saved
                try {
                  const payload = JSON.parse(existingSubmission.message);
                  setRating(payload.rating || 5);
                  setComment(payload.comment || '');
                } catch(e) {}
              }}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
