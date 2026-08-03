const fs = require('fs');
let code = fs.readFileSync('src/components/portal/AdminDashboard.tsx', 'utf8');

code = code.replace(
  /const \[isStudentModalOpen, setIsStudentModalOpen\] = useState\(false\);/,
  "const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);\n  const [isRekapModalOpen, setIsRekapModalOpen] = useState(false);"
);

fs.writeFileSync('src/components/portal/AdminDashboard.tsx', code);
