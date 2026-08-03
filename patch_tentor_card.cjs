const fs = require('fs');
let code = fs.readFileSync('src/components/portal/AdminDashboard.tsx', 'utf8');

const tentorCardCode = `const TentorCard: React.FC<{
  tentor: Tentor;
  onEdit: (tentor: Tentor) => void;
}> = ({ tentor: t, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs hover:border-purple-200 transition-all flex flex-col gap-0">
      <div 
        className={\`flex items-center justify-between cursor-pointer md:cursor-default transition-all \${isExpanded ? 'pb-4 border-b border-slate-100' : 'pb-0 md:pb-4 md:border-b md:border-slate-100'}\`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <img src={t.foto} alt={t.nama} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-4 ring-slate-50 shrink-0" />
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">{t.nama}</h4>
            <p className="text-[10px] sm:text-[11px] text-purple-600 font-bold bg-purple-50 inline-block px-2 py-0.5 rounded-md mt-1">{t.gelar}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(t);
            }}
            className="p-1.5 sm:p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors bg-white border border-blue-100 shadow-xs"
            title="Edit Tentor"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <div className="md:hidden p-1.5 bg-slate-50 rounded-xl text-slate-400">
             {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>
      
      <div className={\`text-xs text-slate-600 space-y-2.5 pt-4 md:pt-0 md:mt-4 md:block \${isExpanded ? 'block animate-in slide-in-from-top-2 duration-200' : 'hidden'}\`}>
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-400">Lulusan:</span>
          <span className="font-bold text-slate-800 text-right">{t.lulusan}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-400">Spesialisasi:</span>
          <span className="font-bold text-slate-800 text-right">{t.spesialisasi}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-400">No HP:</span>
          <span className="font-bold text-slate-800 text-right">{t.noHp}</span>
        </div>
      </div>
    </div>
  );
};

export const AdminDashboard`;

code = code.replace(/export const AdminDashboard/, tentorCardCode);

const tentorListRegex = /<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">[\s\S]*?(?=<\/div>\s*<\/div>\s*\}\)\s*\{\/\* JADWAL \*\/\})/m;

const newTentorList = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {tentors.map((t) => (
              <TentorCard
                key={t.id}
                tentor={t}
                onEdit={(tentor) => {
                  setEditingTentor(tentor);
                  setIsTentorModalOpen(true);
                }}
              />
            ))}
          </div>`;

code = code.replace(tentorListRegex, newTentorList + '\n          ');

fs.writeFileSync('src/components/portal/AdminDashboard.tsx', code);
