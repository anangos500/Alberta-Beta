const fs = require('fs');
let code = fs.readFileSync('src/components/public/Navbar.tsx', 'utf8');

code = code.replace(
  /<Link\s+to="\/"/,
  `<Link \n            to="/"\n            state={{ fromPortal: true }}`
);

code = code.replace(
  /to=\{item\.path\}/g,
  `to={item.path}\n                state={{ fromPortal: true }}`
);

fs.writeFileSync('src/components/public/Navbar.tsx', code);
