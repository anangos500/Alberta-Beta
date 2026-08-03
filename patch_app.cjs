const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto">/g;
const newCode = `<main className={\`flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto \${
            currentUser.role === 'admin' ? 'scrollbar-admin' :
            currentUser.role === 'tentor' ? 'scrollbar-tentor' :
            'scrollbar-orangtua'
          }\`}>`;

code = code.replace(regex, newCode);

fs.writeFileSync('src/App.tsx', code);
