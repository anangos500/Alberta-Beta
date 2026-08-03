const fs = require('fs');
let code = fs.readFileSync('src/components/portal/PdfReportView.tsx', 'utf8');

code = code.replace(
  /import \{ WeeklyReport \} from '..\/..\/types';/,
  `import { WeeklyReport } from '../../types';\nimport html2pdf from 'html2pdf.js';`
);

code = code.replace(
  /  const handlePrint = \(\) => \{\n    window.print\(\);\n  \};/,
  `  const handleDownloadPDF = () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;
    
    const opt = {
      margin: 0.5,
      filename: \`Laporan_Minggu_\${report.mingguKe}_\${report.studentNama}.pdf\`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };`
);

code = code.replace(
  /onClick={handlePrint}/,
  `onClick={handleDownloadPDF}`
);

code = code.replace(
  /<div className="space-y-6 text-stone-900 font-sans bg-white">/,
  `<div id="pdf-content" className="space-y-6 text-stone-900 font-sans bg-white p-4">`
);

fs.writeFileSync('src/components/portal/PdfReportView.tsx', code);
