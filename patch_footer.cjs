const fs = require('fs');
let code = fs.readFileSync('src/components/public/Footer.tsx', 'utf8');

code = code.replace(
  /<Link to="(\/[a-z]*)"/g,
  '<Link to="$1" state={{ fromPortal: true }}'
);

fs.writeFileSync('src/components/public/Footer.tsx', code);
