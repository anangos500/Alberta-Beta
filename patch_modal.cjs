const fs = require('fs');
let code = fs.readFileSync('src/components/portal/ReportDetailModal.tsx', 'utf8');

code = code.replace(
  /interface Props \{\n  report: WeeklyReport \| null;\n  onClose: \(\) => void;\n\}/,
  `interface Props {
  report: WeeklyReport | null;
  onClose: () => void;
  hidePrintOption?: boolean;
}`
);

code = code.replace(
  /export const ReportDetailModal: React\.FC<Props> = \(\{ report, onClose \}\) => \{/,
  `export const ReportDetailModal: React.FC<Props> = ({ report, onClose, hidePrintOption = false }) => {`
);

code = code.replace(
  /<button\s+onClick=\{\(\) => setShowPdfPrint\(true\)\}\s+className="px-3 py-1\.5 rounded-xl bg-teal-200 text-teal-900 hover:bg-teal-300 font-bold text-xs flex items-center gap-1\.5 cursor-pointer"\s+>\s+<Printer className="w-4 h-4" \/>\s+<span>Cetak \/ PDF<\/span>\s+<\/button>/,
  `{!hidePrintOption && (
              <button
                onClick={() => setShowPdfPrint(true)}
                className="px-3 py-1.5 rounded-xl bg-teal-200 text-teal-900 hover:bg-teal-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / PDF</span>
              </button>
            )}`
);

code = code.replace(
  /<button\s+onClick=\{\(\) => setShowPdfPrint\(true\)\}\s+className="px-5 py-2\.5 rounded-xl bg-teal-200 text-teal-900 hover:bg-teal-300 font-bold text-xs flex items-center gap-1\.5 shadow-sm cursor-pointer"\s+>\s+<Printer className="w-4 h-4" \/>\s+<span>Cetak \/ Simpan PDF Laporan<\/span>\s+<\/button>/,
  `{!hidePrintOption && (
            <button
              onClick={() => setShowPdfPrint(true)}
              className="px-5 py-2.5 rounded-xl bg-teal-200 text-teal-900 hover:bg-teal-300 font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF Laporan</span>
            </button>
          )}`
);

fs.writeFileSync('src/components/portal/ReportDetailModal.tsx', code);
