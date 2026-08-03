const fs = require('fs');
let file = fs.readFileSync('src/components/public/Hero.tsx', 'utf8');

// Replace the image URLs in the default slides to be empty, or just use a solid color.
// Wait, if it's empty, we should not render an img tag.

file = file.replace(
  'image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000",',
  'image: "",'
);
file = file.replace(
  'image: "https://images.unsplash.com/photo-1427504494785-319ce51d8cce?auto=format&fit=crop&q=80&w=2000",',
  'image: "",'
);
file = file.replace(
  'image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=2000",',
  'image: "",'
);

// Conditionally render the img tag
file = file.replace(
  /<img\s*src=\{slide\.image\}\s*alt=\{slide\.title\}\s*className="w-full h-full object-cover object-center"\s*\/>/g,
  `{slide.image ? (
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover object-center" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 to-purple-900"></div>
          )}`
);

fs.writeFileSync('src/components/public/Hero.tsx', file);
