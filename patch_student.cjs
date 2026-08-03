const fs = require('fs');
let code = fs.readFileSync('src/components/portal/StudentManagementModal.tsx', 'utf8');

code = code.replace(/    if \(isDirty\) \{\n      if \(window.confirm\('Ada data yang belum disimpan. Apakah Anda yakin ingin membuang data ini\?'\)\) \{\n        onClose\(\);\n      \}\n    \} else \{\n      onClose\(\);\n    \}/g, `    if (isDirty) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }`);

code = code.replace(/<\/div>\n    <\/div>\n  \);\n\};\n$/g, `      </div>
      <ConfirmModal 
        isOpen={showConfirmClose} 
        onConfirm={onClose} 
        onCancel={() => setShowConfirmClose(false)} 
      />
    </div>
  );
};
`);
fs.writeFileSync('src/components/portal/StudentManagementModal.tsx', code);
