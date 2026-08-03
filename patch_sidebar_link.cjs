const fs = require('fs');
let code = fs.readFileSync('src/components/portal/PortalSidebar.tsx', 'utf8');

code = code.replace(
  /<Link\n          to="\/"/,
  `<Link\n          to="/"\n          state={{ fromPortal: true }}`
);

fs.writeFileSync('src/components/portal/PortalSidebar.tsx', code);
