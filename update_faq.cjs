const fs = require('fs');

let file = fs.readFileSync('src/components/public/FaqSection.tsx', 'utf8');

file = file.replace(
  `{/* Category Filter Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3">`,
  `{/* Category Filter Pills */}
          <div className="pt-6 hidden sm:flex flex-wrap items-center justify-center gap-3">`
);

fs.writeFileSync('src/components/public/FaqSection.tsx', file);
console.log("Updated FaqSection.tsx");
