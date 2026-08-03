const fs = require('fs');
let code = fs.readFileSync('src/components/portal/StudentManagementModal.tsx', 'utf8');
code = code.replace(/            <\/div>\n              <\/select>/, '              </select>\n            </div>');
fs.writeFileSync('src/components/portal/StudentManagementModal.tsx', code);
