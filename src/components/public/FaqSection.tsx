import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FaqItem } from '../../types';
import { useApp } from '../../context/AppContext';

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Umum',
    question: 'Di mana lokasi Bimbel Alberta?',
    answer: 'Bimbel Alberta berlokasi di Jl. PB Sudirman No. 45, Blindungan, Bondowoso. Lokasinya sangat strategis dan mudah diakses dari pusat kota.'
  },
  {
    id: 'faq-2',
    category: 'Pendaftaran',
    question: 'Bagaimana cara mendaftar di Bimbel Alberta?',
    answer: 'Pendaftaran dapat dilakukan dengan mengisi form pendaftaran di website ini yang akan terhubung ke WhatsApp Admin kami, atau datang langsung ke kantor kami.'
  },
  {
    id: 'faq-3',
    category: 'Program SD',
    question: 'Mata pelajaran apa saja yang diajarkan untuk tingkat SD?',
    answer: 'Fokus utama kami adalah Matematika, Ilmu Pengetahuan Alam (IPA), dan Bahasa Inggris untuk jenjang SD. Kami juga ada persiapan khusus OSN.'
  },
  {
    id: 'faq-4',
    category: 'Laporan Belajar',
    question: 'Bagaimana orang tua bisa memantau perkembangan anak?',
    answer: 'Setiap orang tua akan diberikan akses ke Portal Albertian. Di sana, orang tua dapat melihat laporan bulanan dari tentor yang berisi nilai, tingkat pemahaman, serta catatan khusus.'
  }
];

export const FaqSection: React.FC = () => {
  const { publicContent } = useApp();
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const faqsList = publicContent?.faqs?.length > 0 ? publicContent.faqs : FAQS;

  // Extract unique categories from faqsList dynamically and prepend 'Semua'
  const dynamicCategories = ['Semua', ...Array.from(new Set(faqsList.map((faq: FaqItem) => faq.category)))];

  const filteredFaqs = faqsList.filter(
    (faq: FaqItem) => selectedCategory === 'Semua' || faq.category === selectedCategory
  );

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-12 lg:py-16 bg-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-10 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            {publicContent?.faq_title || 'Pertanyaan yang Sering Diajukan'}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            {publicContent?.faq_desc || 'Temukan jawaban lengkap mengenai pendaftaran, program TK, SD & SMP, serta sistem laporan kami.'}
          </p>

          {/* Category Filter Pills */}
          <div className="pt-6 hidden sm:flex flex-wrap items-center justify-center gap-3">
            {(dynamicCategories as string[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer shadow-sm border ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:border-purple-200"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 sm:p-6 text-left flex items-start sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-purple-50 text-purple-600 border border-purple-100">
                      {faq.category}
                    </span>
                    <span className="font-bold text-slate-800 text-sm sm:text-base">
                      {faq.question}
                    </span>
                  </div>
                  <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-purple-100 text-purple-600' : 'bg-slate-50 text-slate-400'}`}>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 shrink-0" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 sm:pt-2 text-slate-600 text-sm leading-relaxed border-t border-slate-50 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
