import React, { useState } from 'react';
import { MapPin, Phone, Clock, Send, MessageSquare, CheckCircle } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    namaOrtu: '',
    namaAnak: '',
    jenjang: 'SD' as 'TK' | 'SD' | 'SMP',
    kelas: '4',
    pertanyaan: ''
  });

  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    
    // Construct WhatsApp URL
    const text = `Halo Admin Bimbel Alberta Bondowoso,%0A%0ASaya ${encodeURIComponent(formData.namaOrtu)} ingin bertanya mengenai pendaftaran bimbel untuk putra/putri saya:%0ANama Anak: ${encodeURIComponent(formData.namaAnak)}%0AJenjang: ${formData.jenjang} Kelas ${formData.kelas}%0APertanyaan: ${encodeURIComponent(formData.pertanyaan || 'Ingin konsultasi jadwal dan biaya les.')}%0A%0AMohon informasi lebih lanjut. Terima kasih!`;
    const waUrl = `https://wa.me/6281234567890?text=${text}`;

    setTimeout(() => {
      window.open(waUrl, '_blank');
      setSentSuccess(false);
    }, 1000);
  };

  return (
    <section id="kontak" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200/50 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200/50 rounded-full blur-3xl -z-10 translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Hubungi <span className="text-purple-600">Admin Kami</span>
          </h2>
          <p className="text-slate-600 text-lg">
            Kami siap menjawab pertanyaan Anda dan menyambut konsultasi kebutuhan belajar putra-putri Anda.
          </p>
        </div>

        {/* Contact Info & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Alamat Outlet</h4>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                    Jl. Ahmad Yani No. 45, Pusat Kota Bondowoso<br />
                    <span className="text-xs text-purple-600 font-bold">(Berlokasi dekat Alun-Alun)</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t border-slate-100 pt-6">
                <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">WhatsApp Admin</h4>
                  <p className="text-slate-600 text-sm mt-1 font-medium">
                    0812-3456-7890 (Respon Cepat)
                  </p>
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm font-bold text-pink-600 hover:text-pink-700 transition-colors"
                  >
                    Chat Sekarang →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t border-slate-100 pt-6">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Jam Operasional</h4>
                  <p className="text-slate-600 text-sm mt-1 font-medium">
                    Senin - Sabtu: 08.00 - 18.00 WIB
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Minggu: Layanan Online Aktif</p>
                </div>
              </div>

            </div>

          </div>

          {/* Right: Quick Direct Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
              
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Kirim Pesan Langsung
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  Isi form di bawah untuk terhubung ke WhatsApp Admin Bimbel Alberta dengan pesan terformat rapi.
                </p>
              </div>

              {sentSuccess ? (
                <div className="p-8 bg-green-50 rounded-[1.5rem] border border-green-100 text-green-900 space-y-3 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                  <h4 className="font-bold text-lg">Membuka WhatsApp Admin...</h4>
                  <p className="text-sm">
                    Pesan konsultasi Anda telah siap dikirim ke Admin Bimbel Alberta Bondowoso.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Nama Orang Tua / Wali
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Ibu Ratna"
                        value={formData.namaOrtu}
                        onChange={(e) => setFormData({ ...formData, namaOrtu: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm focus:outline-none focus:border-purple-300 focus:bg-purple-50/30 transition-colors bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Nama Calon Siswa
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Budi"
                        value={formData.namaAnak}
                        onChange={(e) => setFormData({ ...formData, namaAnak: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm focus:outline-none focus:border-purple-300 focus:bg-purple-50/30 transition-colors bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Jenjang Sekolah
                      </label>
                      <select
                        value={formData.jenjang}
                        onChange={(e) => {
                          const newJenjang = e.target.value as 'TK' | 'SD' | 'SMP';
                          let newKelas = '1';
                          if (newJenjang === 'TK') newKelas = '0';
                          else if (newJenjang === 'SMP') newKelas = '7';
                          setFormData({ ...formData, jenjang: newJenjang, kelas: newKelas });
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm focus:outline-none focus:border-purple-300 focus:bg-purple-50/30 transition-colors bg-slate-50 cursor-pointer"
                      >
                        <option value="TK">Jenjang TK</option>
                        <option value="SD">Jenjang SD</option>
                        <option value="SMP">Jenjang SMP</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Kelas
                      </label>
                      <select
                        value={formData.kelas}
                        onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm focus:outline-none focus:border-purple-300 focus:bg-purple-50/30 transition-colors bg-slate-50 cursor-pointer"
                      >
                        {formData.jenjang === 'TK' ? (
                          <>
                            <option value="0">TK A / TK B</option>
                          </>
                        ) : formData.jenjang === 'SD' ? (
                          <>
                            <option value="1">Kelas 1 SD</option>
                            <option value="2">Kelas 2 SD</option>
                            <option value="3">Kelas 3 SD</option>
                            <option value="4">Kelas 4 SD</option>
                            <option value="5">Kelas 5 SD</option>
                            <option value="6">Kelas 6 SD</option>
                          </>
                        ) : (
                          <>
                            <option value="7">Kelas 7 SMP</option>
                            <option value="8">Kelas 8 SMP</option>
                            <option value="9">Kelas 9 SMP</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Pesan Tambahan (Opsional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tulis pertanyaan Anda di sini..."
                      value={formData.pertanyaan}
                      onChange={(e) => setFormData({ ...formData, pertanyaan: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm focus:outline-none focus:border-purple-300 focus:bg-purple-50/30 transition-colors bg-slate-50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-5 h-5" />
                    <span>Kirim via WhatsApp</span>
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
