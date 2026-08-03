const fs = require('fs');
let code = fs.readFileSync('src/components/portal/TentorDashboard.tsx', 'utf8');

code = code.replace(
  /import \{ useApp \} from '\.\.\/\.\.\/context\/AppContext';/,
  `import { useApp } from '../../context/AppContext';\nimport { downloadReportsZip } from '../../utils/exportZip';`
);

code = code.replace(
  /onClick=\{\(\) => alert\(\`Mengunduh arsip laporan minggu ke-\$\{week\}\`\)\}/,
  `onClick={() => downloadReportsZip(weekReports, \`Arsip_Laporan_Minggu_\${week}\`)}`
);

fs.writeFileSync('src/components/portal/TentorDashboard.tsx', code);
