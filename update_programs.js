const fs = require('fs');

let file = fs.readFileSync('src/components/public/ProgramsSection.tsx', 'utf8');

if (!file.includes('const scrollRef = useRef<HTMLDivElement>(null);')) {
  file = file.replace(
    `import React, { useState } from 'react';`,
    `import React, { useState, useRef, useEffect } from 'react';`
  );
  
  file = file.replace(
    `const { setIsRegisterModalOpen, publicContent } = useApp();`,
    `const { setIsRegisterModalOpen, publicContent } = useApp();\n  const scrollRef = useRef<HTMLDivElement>(null);\n\n  useEffect(() => {\n    const container = scrollRef.current;\n    if (!container) return;\n\n    const intervalId = setInterval(() => {\n      // Only auto-scroll on mobile\n      if (window.innerWidth >= 768) return;\n      \n      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 20) {\n        container.scrollTo({ left: 0, behavior: 'smooth' });\n      } else {\n        container.scrollBy({ left: window.innerWidth * 0.85, behavior: 'smooth' });\n      }\n    }, 3500);\n\n    return () => clearInterval(intervalId);\n  }, []);`
  );
  
  file = file.replace(
    `<div className="mt-10 lg:mt-16 flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 snap-x snap-mandatory hide-scrollbar justify-start md:justify-center">`,
    `<div \n          ref={scrollRef}\n          className="mt-10 lg:mt-16 flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 snap-x snap-mandatory hide-scrollbar justify-start md:justify-center scroll-smooth"\n        >`
  );
  
  fs.writeFileSync('src/components/public/ProgramsSection.tsx', file);
  console.log("Updated ProgramsSection");
} else {
  console.log("Already updated");
}
