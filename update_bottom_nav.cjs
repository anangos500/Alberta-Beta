const fs = require('fs');
let file = fs.readFileSync('src/components/portal/PortalBottomNav.tsx', 'utf8');

// Import Globe
file = file.replace(
  "UserCheck, Bell } from 'lucide-react';",
  "UserCheck, Bell, Globe } from 'lucide-react';"
);

const oldAdminNav = `<button
              onClick={() => setPortalTab('rekap_laporan')}
              className={\`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors flex-1 \${
                portalTab === 'rekap_laporan' ? activeColorClass : inactiveColorClass
              }\`}
            >
              <FileText className="w-5 h-5" />
              <span>Laporan</span>
            </button>
          </>`;

const newAdminNav = `<button
              onClick={() => setPortalTab('rekap_laporan')}
              className={\`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors min-w-[64px] \${
                portalTab === 'rekap_laporan' ? activeColorClass : inactiveColorClass
              }\`}
            >
              <FileText className="w-5 h-5" />
              <span>Laporan</span>
            </button>
            <button
              onClick={() => setPortalTab('public_settings')}
              className={\`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors min-w-[64px] \${
                portalTab === 'public_settings' ? activeColorClass : inactiveColorClass
              }\`}
            >
              <Globe className="w-5 h-5" />
              <span>Publik</span>
            </button>
          </>`;

file = file.replace(oldAdminNav, newAdminNav);

// Update all flex-1 to min-w-[64px] for admin ONLY, so it doesn't squash
file = file.replace(
  /flex flex-col items-center gap-1 p-2 rounded-xl text-\[10px\] font-bold cursor-pointer transition-colors flex-1/g,
  "flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold cursor-pointer transition-colors min-w-[60px]"
);

// Update container to be horizontally scrollable
file = file.replace(
  'className="flex items-center justify-around gap-1 max-w-md mx-auto"',
  'className="flex items-center justify-start sm:justify-around gap-1 w-full overflow-x-auto scrollbar-hide pb-1"'
);

fs.writeFileSync('src/components/portal/PortalBottomNav.tsx', file);
console.log("Updated bottom nav");
