import React, { useState } from 'react';
import { defaultJadwalTemplates } from '../../data/jadwalTemplates';
import { Calendar, Repeat, Grid, Edit3 } from 'lucide-react';

export const TemplateJadwalTab: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<string>('SD 1-2');

  const filteredTemplates = defaultJadwalTemplates.filter(t => t.program === selectedProgram);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-800 font-serif">Template Jadwal</h2>
          <p className="text-sm text-stone-500 mt-1">Kelola pola mata pelajaran otomatis berdasarkan program dan sistem.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['TK', 'SD 1-2', 'SD 3-6', 'SMP 7A', 'SMP 7B', 'SMP 8', 'SMP 9'].map(prog => (
          <button
            key={prog}
            onClick={() => setSelectedProgram(prog)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              selectedProgram === prog
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-teal-300 hover:text-teal-700'
            }`}
          >
            {prog}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredTemplates.map(template => (
          <div key={template.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-stone-100 bg-stone-50/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${template.sistem === 'Rotasi' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                  {template.sistem === 'Rotasi' ? <Repeat className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-stone-800 text-lg flex items-center gap-2">
                    {template.sistem === 'Rotasi' ? 'Rotasi' : 'Pembelajaran Blok'}
                  </h3>
                  <p className="text-xs font-medium text-stone-500">
                    Berlaku: Bulan {template.bulanBerlaku.join(', ')}
                  </p>
                </div>
              </div>
              <button className="p-2 text-stone-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 flex-1 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-stone-500 uppercase bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="px-3 py-2">Minggu</th>
                    <th className="px-3 py-2">Senin</th>
                    <th className="px-3 py-2">Selasa</th>
                    <th className="px-3 py-2">Rabu</th>
                    <th className="px-3 py-2">Kamis</th>
                    <th className="px-3 py-2">Jumat</th>
                    <th className="px-3 py-2">Sabtu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {['1', '2', '3', '4'].map(week => {
                    const pola = template.mingguan[week] || {};
                    return (
                      <tr key={week} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-3 py-2 font-bold text-stone-700">{week}</td>
                        <td className="px-3 py-2 text-stone-600">{pola.senin || '-'}</td>
                        <td className="px-3 py-2 text-stone-600">{pola.selasa || '-'}</td>
                        <td className="px-3 py-2 text-stone-600">{pola.rabu || '-'}</td>
                        <td className="px-3 py-2 text-stone-600">{pola.kamis || '-'}</td>
                        <td className="px-3 py-2 text-stone-600">{pola.jumat || '-'}</td>
                        <td className="px-3 py-2 text-stone-600">{pola.sabtu || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {template.program === 'TK' && (
                <div className="mt-6 border-t border-stone-100 pt-4">
                  <h4 className="text-sm font-bold text-stone-800 mb-3">Durasi per Pertemuan (60 Menit)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between p-2 bg-stone-50 rounded-lg">
                      <span className="text-stone-600">Membaca</span>
                      <span className="font-medium text-stone-800">15 Menit</span>
                    </div>
                    <div className="flex justify-between p-2 bg-stone-50 rounded-lg">
                      <span className="text-stone-600">Berhitung</span>
                      <span className="font-medium text-stone-800">15 Menit</span>
                    </div>
                    <div className="flex justify-between p-2 bg-stone-50 rounded-lg">
                      <span className="text-stone-600">Menulis</span>
                      <span className="font-medium text-stone-800">15 Menit</span>
                    </div>
                    <div className="flex justify-between p-2 bg-stone-50 rounded-lg border border-teal-100 bg-teal-50/30">
                      <span className="text-stone-600">Istirahat</span>
                      <span className="font-medium text-teal-700">5 Menit</span>
                    </div>
                    <div className="flex justify-between p-2 bg-stone-50 rounded-lg sm:col-span-2">
                      <span className="text-stone-600">Science Dasar + English Dasar + Quiz</span>
                      <span className="font-medium text-stone-800">10 Menit</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-12 text-center text-stone-500 bg-white border border-stone-200 border-dashed rounded-2xl">
            Belum ada template untuk program ini.
          </div>
        )}
      </div>
    </div>
  );
};
