import React, { useState } from 'react';
import { Bell, Send, CheckCircle2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationManagement: React.FC = () => {
  const { students, tentors, addNotification, deleteNotification, notifications, currentUser } = useApp();
  const [targetType, setTargetType] = useState<'all' | 'student' | 'tentor'>('all');
  const [targetId, setTargetId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    if (targetType !== 'all' && !targetId) return;

    addNotification({
      title,
      message,
      targetType,
      targetId: targetType !== 'all' ? targetId : undefined,
      senderId: currentUser?.id,
    });

    setIsSuccess(true);
    setTitle('');
    setMessage('');
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const filteredNotifications = notifications
    .filter(notif => {
      const notifDate = new Date(notif.date).getTime();
      const sevenDaysAgo = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);
      return notifDate >= sevenDaysAgo;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const displayedNotifications = showAllHistory
    ? filteredNotifications
    : filteredNotifications.slice(0, 2);

  return (
    <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600" />
            Kirim Pemberitahuan
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Kirim pesan atau pengumuman ke orang tua siswa.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Penerima
              </label>

              {/* Mobile Dropdown View */}
              <div className="block sm:hidden">
                <select
                  value={targetType}
                  onChange={(e) => {
                    setTargetType(e.target.value as 'all' | 'student' | 'tentor');
                    setTargetId('');
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                  <option value="all">Semua Siswa</option>
                  <option value="student">Pilih Siswa</option>
                  <option value="tentor">Siswa by Tentor</option>
                </select>
              </div>

              {/* Desktop Buttons View */}
              <div className="hidden sm:grid sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => { setTargetType('all'); setTargetId(''); }}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    targetType === 'all'
                      ? 'bg-purple-100 border-purple-200 text-purple-700 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Semua Siswa
                </button>
                <button
                  type="button"
                  onClick={() => { setTargetType('student'); setTargetId(''); }}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    targetType === 'student'
                      ? 'bg-purple-100 border-purple-200 text-purple-700 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Pilih Siswa
                </button>
                <button
                  type="button"
                  onClick={() => { setTargetType('tentor'); setTargetId(''); }}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    targetType === 'tentor'
                      ? 'bg-purple-100 border-purple-200 text-purple-700 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Siswa by Tentor
                </button>
              </div>
            </div>

            {targetType === 'student' && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Pilih Siswa
                </label>
                <select
                  required
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
                >
                  <option value="">-- Pilih Siswa --</option>
                  {students.filter(s => s.status === 'aktif').map(s => (
                    <option key={s.id} value={s.id}>{s.nama}</option>
                  ))}
                </select>
              </div>
            )}

            {targetType === 'tentor' && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Pilih Tentor (Kirim ke semua siswanya)
                </label>
                <select
                  required
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
                >
                  <option value="">-- Pilih Tentor --</option>
                  {tentors.map(t => (
                    <option key={t.id} value={t.id}>{t.nama}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Judul Pemberitahuan
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Info Libur Idul Fitri"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Pesan
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan pesan pemberitahuan di sini..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full px-5 py-3 rounded-xl bg-purple-600 text-white font-extrabold text-sm hover:bg-purple-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Terkirim!</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Kirim Pemberitahuan</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              Riwayat Pemberitahuan
            </h4>
            {filteredNotifications.length > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                Total {filteredNotifications.length}
              </span>
            )}
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {filteredNotifications.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-5">Belum ada riwayat pemberitahuan.</p>
            ) : (
              <>
                {displayedNotifications.map(notif => (
                  <div key={notif.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h5 className="font-bold text-slate-800 text-sm leading-tight">{notif.title}</h5>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {new Date(notif.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">{notif.message}</p>
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md">
                        Penerima: {notif.targetType === 'all' ? 'Semua' : notif.targetType === 'student' ? 'Siswa' : 'Siswa by Tentor'}
                      </span>
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus Pemberitahuan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {filteredNotifications.length > 2 && (
                  <div className="pt-2">
                    {!showAllHistory ? (
                      <button
                        type="button"
                        onClick={() => setShowAllHistory(true)}
                        className="w-full py-2.5 px-4 text-xs font-extrabold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Lihat Selengkapnya ({filteredNotifications.length - 2} lagi)</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAllHistory(false)}
                        className="w-full py-2.5 px-4 text-xs font-extrabold text-slate-600 bg-slate-200/70 hover:bg-slate-200 border border-slate-300/50 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Sembunyikan</span>
                        <ChevronUp className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
