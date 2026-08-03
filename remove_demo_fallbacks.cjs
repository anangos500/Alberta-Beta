const fs = require('fs');

// 1. Fix AdminDashboard Features Fallback
let admin = fs.readFileSync('src/components/portal/PublicSettingsAdmin.tsx', 'utf8');
admin = admin.replace(
  /features_images:\s*publicContent\.features_images\s*\|\|\s*\[\s*"[^"]+",\s*"[^"]+",\s*"[^"]+",\s*"[^"]+"\s*\]/g,
  'features_images: publicContent.features_images || ["", "", "", ""]'
);
fs.writeFileSync('src/components/portal/PublicSettingsAdmin.tsx', admin);

// 2. Fix FeaturesSection
let features = fs.readFileSync('src/components/public/FeaturesSection.tsx', 'utf8');
features = features.replace(
  /const featuresImages = publicContent\?\.features_images \|\| \[\s*"[^"]+",\s*"[^"]+",\s*"[^"]+",\s*"[^"]+"\s*\];/g,
  'const featuresImages = publicContent?.features_images || ["", "", "", ""];'
);
fs.writeFileSync('src/components/public/FeaturesSection.tsx', features);

// 3. Fix Hero fallback (if they want to remove demo entirely)
// I will keep the demo slides for Hero only if publicContent is entirely null, but wait, the user wants NO demo images.
// Actually, let's let Hero keep its demo IF the user hasn't set anything up yet?
// If the user says "remove elements indicating demo", let's replace the Hero demo images with solid colors or abstract gradients.
console.log("Done");
