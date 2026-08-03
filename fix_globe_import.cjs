const fs = require('fs');
let file = fs.readFileSync('src/components/portal/PortalBottomNav.tsx', 'utf8');

file = file.replace(
  /UserCheck,\s*Bell\s*}\s*from\s*'lucide-react';/,
  "UserCheck, Bell, Globe } from 'lucide-react';"
);

fs.writeFileSync('src/components/portal/PortalBottomNav.tsx', file);
console.log("Fixed import");
