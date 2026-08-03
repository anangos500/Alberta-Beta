const fs = require('fs');

let file = fs.readFileSync('src/components/public/Navbar.tsx', 'utf8');

file = file.replace(
  `className="flex items-center justify-between h-16 sm:h-20"`,
  `className="flex items-center justify-between h-14 sm:h-20"`
);

file = file.replace(
  `w-10 h-10 sm:w-12 sm:h-12 rounded-xl`,
  `w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl`
);

file = file.replace(
  `<GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />`,
  `<GraduationCap className="w-5 h-5 sm:w-7 sm:h-7" />`
);

fs.writeFileSync('src/components/public/Navbar.tsx', file);
console.log("Updated Navbar.tsx again");
