const fs = require('fs');
let code = fs.readFileSync('src/components/portal/TentorManagementModal.tsx', 'utf8');
code = code.replace(/<\/div>\n        <\/form>\n        <\/div>/, '</form>\n        </div>');
fs.writeFileSync('src/components/portal/TentorManagementModal.tsx', code);
