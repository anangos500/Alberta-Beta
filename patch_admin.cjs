const fs = require('fs');
let code = fs.readFileSync('src/components/portal/AdminDashboard.tsx', 'utf8');

code = code.replace(
  /import \{ useApp \} from '\.\.\/\.\.\/context\/AppContext';/,
  `import { useApp } from '../../context/AppContext';\nimport { downloadReportsZip } from '../../utils/exportZip';`
);

code = code.replace(
  /onClick=\{\(\) => alert\(\`Mengunduh semua laporan milik \$\{tentor\.nama\}\`\)\}/,
  `onClick={() => downloadReportsZip(tentorReports, \`Laporan_\${tentor.nama.replace(/[^a-z0-9]/gi, '_')}\`)}`
);

fs.writeFileSync('src/components/portal/AdminDashboard.tsx', code);
