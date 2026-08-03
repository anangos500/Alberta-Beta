const fs = require('fs');
let code = fs.readFileSync('src/components/portal/PdfReportView.tsx', 'utf8');

const newFunc = `  const handleDownloadPDF = () => {
    // Karena html2canvas tidak support format warna oklch (bawaan Tailwind v4),
    // kita menggunakan print API bawaan browser yang mendukung penuh CSS modern
    // untuk menyimpan laporan sebagai PDF.
    window.print();
  };`;

const oldFuncRegex = /  const handleDownloadPDF = async \(\) => \{[\s\S]*?  \};/;

code = code.replace(oldFuncRegex, newFunc);
fs.writeFileSync('src/components/portal/PdfReportView.tsx', code);
