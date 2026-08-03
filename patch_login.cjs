const fs = require('fs');
let code = fs.readFileSync('src/components/public/LoginModal.tsx', 'utf8');

code = code.replace(
  /setCurrentView\('portal'\);\n      setPortalTab\('dashboard'\);/,
  `setCurrentView('portal');\n      setPortalTab('dashboard');\n      navigate('/portal');`
);

fs.writeFileSync('src/components/public/LoginModal.tsx', code);
