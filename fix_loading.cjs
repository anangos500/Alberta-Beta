const fs = require('fs');
let file = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

file = file.replace(
  '      } catch (e) {\n        console.error(\'Error fetching public data:\', e);\n      }\n    };\n    fetchPublicData();',
  '      } catch (e) {\n        console.error(\'Error fetching public data:\', e);\n      } finally {\n        setIsPublicDataLoading(false);\n      }\n    };\n    fetchPublicData();'
);

fs.writeFileSync('src/context/AppContext.tsx', file);
console.log("Fixed AppContext.tsx loading state");
