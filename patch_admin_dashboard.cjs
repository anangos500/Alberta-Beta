const fs = require('fs');
let code = fs.readFileSync('src/components/portal/AdminDashboard.tsx', 'utf8');

// Ensure ChevronDown and ChevronUp are imported
if (!code.includes('ChevronDown')) {
  code = code.replace(/Calendar\n\} from 'lucide-react';/, "Calendar,\n  ChevronDown,\n  ChevronUp\n} from 'lucide-react';");
}

// Add MobileStudentCard component above AdminDashboard
const mobileCardCode = `const MobileStudentCard: React.FC<{
  student: Student;
  onEdit: (student: Student) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ student: s, onEdit, onToggleStatus, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3 relative">
      <div 
        className="flex justify-between items-center gap-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-xl">
            {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">{s.nama}</h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{s.nis}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {s.status === 'aktif' ? (
            <span className="px-2 py-1 rounded-lg text-[10px] font-extrabold bg-green-100 text-green-700 border border-green-200 inline-flex items-center gap-1 uppercase tracking-wider shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Aktif
            </span>
          ) : (
            <span className="px-2 py-1 rounded-lg text-[10px] font-extrabold bg-slate-100 text-slate-500 border border-slate-200 inline-flex items-center gap-1 uppercase tracking-wider shrink-0">
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
              Alumni
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(s);
            }}
            className="p-1.5 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors shadow-xs bg-white border border-blue-100"
            title="Edit Data Siswa"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="pt-3 border-t border-slate-100 mt-1 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jenjang</p>
              <span className={\`inline-block px-2 py-0.5 rounded-md font-extrabold text-[10px] \${
                s.jenjang === 'SD' ? 'bg-rose-100 text-rose-700' : 'bg-purple-100 text-purple-700'
              }\`}>
                {s.jenjang} Kelas {s.kelas}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Asal Sekolah</p>
              <p className="font-semibold text-slate-800 text-xs">{s.sekolah}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Orang Tua</p>
              <p className="font-bold text-slate-800 text-xs">{s.namaOrangTua}</p>
              <p className="text-[10px] text-slate-500">{s.noHpOrangTua}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tentor</p>
              <p className="font-bold text-slate-800 text-xs">{s.tentorNama}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(s.id);
              }}
              className={\`px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold rounded-xl border transition-colors shadow-xs bg-white \${
                s.status === 'aktif' 
                ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50 border-slate-200 hover:border-amber-200'
                : 'text-emerald-600 hover:bg-emerald-50 border-emerald-100 hover:border-emerald-200'
              }\`}
            >
              {s.status === 'aktif' ? (
                <><XCircle className="w-3.5 h-3.5" /> Nonaktifkan</>
              ) : (
                <><CheckCircle2 className="w-3.5 h-3.5" /> Aktifkan</>
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(s.id);
              }}
              className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold rounded-xl text-red-500 hover:bg-red-50 border border-red-100 transition-colors shadow-xs bg-white"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminDashboard`;

code = code.replace(/export const AdminDashboard/, mobileCardCode);

const newResponsiveList = `          {/* Student List - Responsive */}
          <div className="block lg:hidden space-y-4">
            {filteredStudents.length === 0 ? (
              <div className="p-12 text-center text-slate-400 border border-slate-100 rounded-2xl bg-slate-50">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Search className="w-8 h-8 text-slate-300" />
                  <span className="font-bold">Tidak ada data siswa ditemukan.</span>
                </div>
              </div>
            ) : (
              filteredStudents.map((s) => (
                <MobileStudentCard
                  key={s.id}
                  student={s}
                  onEdit={(student) => {
                    setEditingStudent(student);
                    setIsStudentModalOpen(true);
                  }}
                  onToggleStatus={toggleStudentStatus}
                  onDelete={(id) => {
                    setStudentToDelete(id);
                    setIsDeleteConfirmOpen(true);
                  }}
                />
              ))
            )}
          </div>`;

code = code.replace(
  /\{\/\* Student List - Responsive \*\/\}\n\s*<div className="block lg:hidden space-y-4">[\s\S]*?(?=\s*\{\/\* Student Table - Desktop \*\/\})/g,
  newResponsiveList + "\n\n"
);

fs.writeFileSync('src/components/portal/AdminDashboard.tsx', code);
