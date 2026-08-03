const fs = require('fs');
let code = fs.readFileSync('src/components/portal/ConfirmModal.tsx', 'utf8');

code = code.replace(
  /interface ConfirmModalProps \{/,
  `interface ConfirmModalProps {
  confirmText?: string;
  cancelText?: string;`
);

code = code.replace(
  /export const ConfirmModal: React\.FC<ConfirmModalProps> = \(\{[\s\S]*?message = "Ada data yang belum disimpan\. Apakah Anda yakin ingin membuang data ini\?"\n\}\) => \{/,
  `export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Peringatan",
  message = "Ada data yang belum disimpan. Apakah Anda yakin ingin membuang data ini?",
  confirmText = "Buang Data",
  cancelText = "Kembali"
}) => {`
);

code = code.replace(
  />\n            Kembali\n          <\/button>/,
  `>
            {cancelText}
          </button>`
);

code = code.replace(
  />\n            Buang Data\n          <\/button>/,
  `>
            {confirmText}
          </button>`
);

fs.writeFileSync('src/components/portal/ConfirmModal.tsx', code);
