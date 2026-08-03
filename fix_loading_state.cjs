const fs = require('fs');
let file = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

file = file.replace(
  '  updatePublicContent: (content: any) => void;\n}',
  '  updatePublicContent: (content: any) => void;\n  isPublicDataLoading: boolean;\n}'
);

file = file.replace(
  'const [selectedChildId, setSelectedChildId] = useState<string>(\'\');',
  'const [selectedChildId, setSelectedChildId] = useState<string>(\'\');\n  const [isPublicDataLoading, setIsPublicDataLoading] = useState(true);'
);

file = file.replace(
  '  useEffect(() => {\n    // Initial fetch of public data (tentors)\n    const fetchPublicData = async () => {\n      if (!import.meta.env.VITE_SUPABASE_URL) return;',
  '  useEffect(() => {\n    // Initial fetch of public data (tentors)\n    const fetchPublicData = async () => {\n      if (!import.meta.env.VITE_SUPABASE_URL) {\n        setIsPublicDataLoading(false);\n        return;\n      }\n      setIsPublicDataLoading(true);'
);

file = file.replace(
  '      } catch (error) {\n        console.error("Error fetching public data:", error);\n      }\n    };',
  '      } catch (error) {\n        console.error("Error fetching public data:", error);\n      } finally {\n        setIsPublicDataLoading(false);\n      }\n    };'
);

file = file.replace(
  'updatePublicContent,\n  };',
  'updatePublicContent,\n    isPublicDataLoading,\n  };'
);

fs.writeFileSync('src/context/AppContext.tsx', file);
console.log("Updated AppContext.tsx");
