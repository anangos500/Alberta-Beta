const fs = require('fs');
let code = fs.readFileSync('src/components/portal/PdfReportView.tsx', 'utf8');

code = code.replace(
  /import html2pdf from 'html2pdf\.js';/,
  `// import html2pdf from 'html2pdf.js';`
);

const oldFunc = `  const handleDownloadPDF = () => {
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
  };`;

const newFunc = `  const handleDownloadPDF = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('pdf-content');
      if (!element) return;
      
      const opt = {
        margin: 0.5,
        filename: \`Laporan_Minggu_\${report.mingguKe}_\${report.studentNama}.pdf\`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().set(opt).from(element).save();
    } catch(err) {
      console.error("Gagal membuat PDF dengan html2pdf.js:", err);
      alert('Gagal membuat file PDF secara langsung. Membuka mode cetak bawaan browser...');
      window.print();
    }
  };`;

code = code.replace(oldFunc, newFunc);
fs.writeFileSync('src/components/portal/PdfReportView.tsx', code);
