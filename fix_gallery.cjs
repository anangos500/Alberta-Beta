const fs = require('fs');
let file = fs.readFileSync('src/components/public/GallerySection.tsx', 'utf8');

file = file.replace(
  'image: \'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800\',',
  'image: \'\','
);
file = file.replace(
  'image: \'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800\',',
  'image: \'\','
);
file = file.replace(
  'image: \'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800\',',
  'image: \'\','
);
file = file.replace(
  'image: \'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800\',',
  'image: \'\','
);

file = file.replace(
  /<img\s*src=\{item\.image\}\s*alt=\{item\.title\}\s*className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"\s*\/>/g,
  `{item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 bg-slate-100" />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                  <Camera className="w-12 h-12" />
                </div>
              )}`
);

fs.writeFileSync('src/components/public/GallerySection.tsx', file);
