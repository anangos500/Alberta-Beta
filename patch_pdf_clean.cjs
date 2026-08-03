const fs = require('fs');
let code = fs.readFileSync('src/components/portal/PdfReportView.tsx', 'utf8');

const regex = /export const PdfReportView: React\.FC<Props> = \(\{ report, onClose \}\) => \{[\s\S]*?  return \(/;

const newBlock = `export const PdfReportView: React.FC<Props> = ({ report, onClose }) => {
  const handleDownloadPDF = () => {
    // Karena html2canvas tidak support format warna oklch (bawaan Tailwind v4),
    // kita menggunakan print API bawaan browser yang mendukung penuh CSS modern
    // untuk menyimpan laporan sebagai PDF.
    window.print();
  };

  return (`

code = code.replace(regex, newBlock);
fs.writeFileSync('src/components/portal/PdfReportView.tsx', code);
