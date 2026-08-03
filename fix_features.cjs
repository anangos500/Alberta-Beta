const fs = require('fs');
let file = fs.readFileSync('src/components/public/FeaturesSection.tsx', 'utf8');

file = file.replace(
  `const featuresImages = publicContent?.features_images || [
    {featuresImages[0]},
    {featuresImages[1]},
    {featuresImages[2]},
    {featuresImages[3]}
  ];`,
  `const featuresImages = publicContent?.features_images || [
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80"
  ];`
);

fs.writeFileSync('src/components/public/FeaturesSection.tsx', file);
console.log("Fixed FeaturesSection.tsx");
