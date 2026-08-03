const fs = require('fs');
let file = fs.readFileSync('src/components/public/FeaturesSection.tsx', 'utf8');

// Update imports
file = file.replace(
  "import { Award, Heart, CheckCircle, MapPin } from 'lucide-react';",
  "import { Award, Heart, CheckCircle, MapPin } from 'lucide-react';\nimport { useApp } from '../../context/AppContext';"
);

// Get public content in component
file = file.replace(
  "export const FeaturesSection: React.FC = () => {",
  "export const FeaturesSection: React.FC = () => {\n  const { publicContent } = useApp();\n  const featuresImages = publicContent?.features_images || [\n    \"https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80\",\n    \"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80\",\n    \"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80\",\n    \"https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80\"\n  ];"
);

// Replace hardcoded images with featuresImages array
file = file.replace(
  /"https:\/\/images\.unsplash\.com\/photo-1577896851231-70ef18881754\?w=800&q=80"/g,
  "{featuresImages[0]}"
);
file = file.replace(
  /"https:\/\/images\.unsplash\.com\/photo-1503676260728-1c00da094a0b\?w=800&q=80"/g,
  "{featuresImages[1]}"
);
file = file.replace(
  /"https:\/\/images\.unsplash\.com\/photo-1522202176988-66273c2fd55f\?w=800&q=80"/g,
  "{featuresImages[2]}"
);
file = file.replace(
  /"https:\/\/images\.unsplash\.com\/photo-1509062522246-3755977927d7\?w=800&q=80"/g,
  "{featuresImages[3]}"
);

fs.writeFileSync('src/components/public/FeaturesSection.tsx', file);
console.log("Updated FeaturesSection.tsx");
