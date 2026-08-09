import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Send, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Assuming supabase is here, wait, AppContext has it or we can import it

export const OrangTuaUlasanTab: React.FC = () => {
  const { currentUser, publicContent } = useApp();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Check if admin has enabled the rating form
  const isEnabled = publicContent?.isRatingFormEnabled ?? false;

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
      
      const { error } = await supabase.from('notifications').insert([{
        title: 'RATING_SUBMISSION',
        message: JSON.stringify(payload),
        target_type: 'all',
        sender_id: currentUser?.id
      }]);
      
      if (error) throw error;
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('Gagal mengirim ulasan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEnabled) {
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

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Terima Kasih!
        </h3>
        <p className="text-slate-600">
          Ulasan Anda telah berhasil dikirim. Kami sangat menghargai feedback dari Anda untuk meningkatkan kualitas Bimbel Alberta.
        </p>
        <button 
          onClick={() => { setSubmitted(false); setComment(''); setRating(5); }}
          className="mt-6 px-6 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-full hover:bg-emerald-100 transition-colors"
        >
          Kirim Ulasan Lainnya
        </button>
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
          Kirim Ulasan
        </button>
      </form>
    </div>
  );
};
