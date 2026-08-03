const fs = require('fs');
let code = fs.readFileSync('src/components/portal/StudentManagementModal.tsx', 'utf8');
code = code.replace(/              \}\)\n          \)\}/, '              )}\n            </div>\n          )}');
fs.writeFileSync('src/components/portal/StudentManagementModal.tsx', code);
