const fs = require('fs');
let code = fs.readFileSync('src/components/portal/PortalMobileHeader.tsx', 'utf8');

code = code.replace(
  /<Link to="\/"/,
  `<Link to="/" state={{ fromPortal: true }}`
);

fs.writeFileSync('src/components/portal/PortalMobileHeader.tsx', code);
