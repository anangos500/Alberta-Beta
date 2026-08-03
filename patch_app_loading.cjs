const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const \{ currentUser \} = useApp\(\);/,
  `const { currentUser, isAuthLoading } = useApp();`
);

code = code.replace(
  /if \(currentUser && !isFromPortal\) \{/,
  `if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (currentUser && !isFromPortal) {`
);

// also in PortalLayout
code = code.replace(
  /const PortalLayout: React\.FC = \(\) => \{\n  const \{ currentUser \} = useApp\(\);/,
  `const PortalLayout: React.FC = () => {
  const { currentUser, isAuthLoading } = useApp();`
);

code = code.replace(
  /if \(!currentUser\) \{\n    return <Navigate to="\/" replace \/>;\n  \}/,
  `if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }`
);


fs.writeFileSync('src/App.tsx', code);
