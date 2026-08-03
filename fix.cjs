const fs = require('fs');
let code = fs.readFileSync('src/components/portal/StudentManagementModal.tsx', 'utf8');
code = code.replace(/<\/form>\n        <\/div>/g, '</div>');
fs.writeFileSync('src/components/portal/StudentManagementModal.tsx', code);
