const fs = require('fs');
let file = fs.readFileSync('src/components/public/TestimonialSection.tsx', 'utf8');

file = file.replace(
  'className="min-w-[85vw] sm:min-w-0 bg-white rounded-[2rem] p-8 shadow-xl flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 snap-center"',
  'className="w-[80vw] sm:w-[320px] sm:min-w-0 bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 snap-center shrink-0"'
);

fs.writeFileSync('src/components/public/TestimonialSection.tsx', file);
console.log("Updated testimonial card sizing");
