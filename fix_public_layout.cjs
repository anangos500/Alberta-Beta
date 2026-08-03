const fs = require('fs');
let file = fs.readFileSync('src/App.tsx', 'utf8');

file = file.replace(
  '  const { currentUser, isAuthLoading } = useApp();',
  '  const { currentUser, isAuthLoading, isPublicDataLoading } = useApp();'
);

file = file.replace(
  '  if (isAuthLoading) {',
  '  if (isAuthLoading || isPublicDataLoading) {'
);

fs.writeFileSync('src/App.tsx', file);
console.log("Fixed App.tsx");
