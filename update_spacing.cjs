const fs = require('fs');

let file = fs.readFileSync('src/components/public/FeaturesSection.tsx', 'utf8');
file = file.replace(/text-justify(?! hyphens-auto)/g, 'text-justify hyphens-auto');
fs.writeFileSync('src/components/public/FeaturesSection.tsx', file);

let file2 = fs.readFileSync('src/components/public/GallerySection.tsx', 'utf8');
file2 = file2.replace(/text-justify(?! hyphens-auto)/g, 'text-justify hyphens-auto');
fs.writeFileSync('src/components/public/GallerySection.tsx', file2);
console.log("Updated spacing classes");
