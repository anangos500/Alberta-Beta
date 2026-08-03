const fs = require('fs');
let code = fs.readFileSync('src/components/portal/PortalSidebar.tsx', 'utf8');

if (!code.includes("import { ConfirmModal }")) {
  code = code.replace(
    /import \{ useApp \} from '\.\.\/\.\.\/context\/AppContext';/,
    `import { useApp } from '../../context/AppContext';\nimport { ConfirmModal } from './ConfirmModal';\nimport { useState } from 'react';`
  );
  
  code = code.replace(
    /export const PortalSidebar: React\.FC = \(\) => \{/,
    `export const PortalSidebar: React.FC = () => {\n  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);`
  );
  
  code = code.replace(
    /onClick=\{logout\}/g,
    `onClick={() => setShowLogoutConfirm(true)}`
  );
  
  code = code.replace(
    /<\/aside>\n    <\/div>\n  \);\n\};/,
    `</aside>\n      <ConfirmModal\n        isOpen={showLogoutConfirm}\n        onConfirm={() => {\n          setShowLogoutConfirm(false);\n          logout();\n        }}\n        onCancel={() => setShowLogoutConfirm(false)}\n        title="Konfirmasi Keluar"\n        message="Apakah Anda yakin ingin keluar dari akun ini?"\n        confirmText="Keluar"\n        cancelText="Batal"\n      />\n    </div>\n  );\n};`
  );
  
  fs.writeFileSync('src/components/portal/PortalSidebar.tsx', code);
}
