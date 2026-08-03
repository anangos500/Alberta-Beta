const fs = require('fs');
let code = fs.readFileSync('src/components/portal/AdminDashboard.tsx', 'utf8');

if (!code.includes("RekapitulasiModal")) {
  code = code.replace(
    /import \{ NotificationManagement \} from '\.\/NotificationManagement';/,
    "import { NotificationManagement } from './NotificationManagement';\nimport { RekapitulasiModal } from './RekapitulasiModal';\nimport { FileSpreadsheet } from 'lucide-react';"
  );
  
  // Need to insert state for the modal
  code = code.replace(
    /const \[isDeleteConfirmOpen, setIsDeleteConfirmOpen\] = useState\(false\);/,
    "const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);\n  const [isRekapModalOpen, setIsRekapModalOpen] = useState(false);"
  );

  // Update button in the top banner
  code = code.replace(
    /<button\n\s*onClick=\{\(\) => \{\n\s*setEditingStudent\(null\);\n\s*setIsStudentModalOpen\(true\);\n\s*\}\}\n\s*className="px-6 py-3\.5 rounded-2xl bg-purple-600 text-white font-extrabold text-sm hover:bg-purple-700 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-md hover:shadow-lg w-full md:w-auto"\n\s*>\n\s*<UserPlus className="w-4 h-4" \/>\n\s*<span>Tambah Siswa Baru<\/span>\n\s*<\/button>/m,
    `<button
            onClick={() => setIsRekapModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-purple-600 text-white font-extrabold text-sm hover:bg-purple-700 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-md hover:shadow-lg w-full md:w-auto"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Rekapitulasi Belajar</span>
          </button>`
  );
  
  // Add modal component to the end of the file
  const modalComponentStr = `      <RekapitulasiModal 
        isOpen={isRekapModalOpen} 
        onClose={() => setIsRekapModalOpen(false)} 
        students={students}
        tentors={tentors}
        reports={reports}
        jadwals={jadwals}
      />
    </div>
  );
};`;
  code = code.replace(/    <\/div>\n  \);\n\};\n?$/, modalComponentStr);
  
  fs.writeFileSync('src/components/portal/AdminDashboard.tsx', code);
  console.log("Success");
} else {
  console.log("Already patched");
}
