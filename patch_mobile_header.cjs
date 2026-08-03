const fs = require('fs');
let code = fs.readFileSync('src/components/portal/PortalMobileHeader.tsx', 'utf8');

if (!code.includes("import { ConfirmModal }")) {
  code = code.replace(
    /import \{ useApp \} from '\.\.\/\.\.\/context\/AppContext';/,
    `import { useApp } from '../../context/AppContext';\nimport { ConfirmModal } from './ConfirmModal';\nimport { useState } from 'react';`
  );
  
  code = code.replace(
    /export const PortalMobileHeader: React\.FC = \(\) => \{/,
    `export const PortalMobileHeader: React.FC = () => {\n  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);`
  );
  
  code = code.replace(
    /onClick=\{logout\}/,
    `onClick={() => setShowLogoutConfirm(true)}`
  );
  
  code = code.replace(
    /<\/header>\n  \);\n\};/,
    `</header>\n      <ConfirmModal\n        isOpen={showLogoutConfirm}\n        onConfirm={() => {\n          setShowLogoutConfirm(false);\n          logout();\n        }}\n        onCancel={() => setShowLogoutConfirm(false)}\n        title="Konfirmasi Keluar"\n        message="Apakah Anda yakin ingin keluar dari akun ini?"\n        confirmText="Keluar"\n        cancelText="Batal"\n      />\n    </>\n  );\n};`
  );
  
  code = code.replace(
    /return \(\n    <header/,
    `return (\n    <>\n    <header`
  );

  fs.writeFileSync('src/components/portal/PortalMobileHeader.tsx', code);
}
