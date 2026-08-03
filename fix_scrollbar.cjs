const fs = require('fs');
let file = fs.readFileSync('src/components/portal/PortalBottomNav.tsx', 'utf8');

file = file.replace(
  'className="flex items-center justify-start sm:justify-around gap-1 w-full overflow-x-auto scrollbar-hide pb-1"',
  'className="flex items-center justify-start sm:justify-around gap-1 w-full overflow-x-auto hide-scrollbar pb-1"'
);

fs.writeFileSync('src/components/portal/PortalBottomNav.tsx', file);
