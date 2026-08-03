const fs = require('fs');
let code = fs.readFileSync('src/components/portal/StudentManagementModal.tsx', 'utf8');
code = code.replace(/          \)\}\n          <\/div>/g, '          )}\n        </form>\n        </div>');
fs.writeFileSync('src/components/portal/StudentManagementModal.tsx', code);
