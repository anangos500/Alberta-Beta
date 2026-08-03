const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(
  /currentUser: UserAccount \| null;\n  setCurrentUser: \(user: UserAccount \| null\) => void;/,
  `currentUser: UserAccount | null;\n  setCurrentUser: (user: UserAccount | null) => void;\n  isAuthLoading: boolean;`
);

code = code.replace(
  /const \[currentUser, setCurrentUser\] = useState<UserAccount \| null>\(null\);/,
  `const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);\n  const [isAuthLoading, setIsAuthLoading] = useState(true);`
);

code = code.replace(
  /supabase\.auth\.getSession\(\)\.then\(\(\{ data: \{ session \} \}\) => \{/,
  `supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setIsAuthLoading(false);
      }`
);

code = code.replace(
  /setCurrentUser\(\{\n              id: data\.id,\n              username: session\.user\.email \|\| '',\n              nama: data\.nama,\n              role: data\.role,\n              foto: data\.foto,\n              studentIds\n            \}\);\n          \}\n        \}\);/,
  `setCurrentUser({
              id: data.id,
              username: session.user.email || '',
              nama: data.nama,
              role: data.role,
              foto: data.foto,
              studentIds
            });
          }
          setIsAuthLoading(false);
        }).catch(() => setIsAuthLoading(false));`
);

code = code.replace(
  /const \{ data: authListener \} = supabase\.auth\.onAuthStateChange\(async \(event, session\) => \{/,
  `const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthLoading(false);
      }`
);

code = code.replace(
  /return \{\n      currentView,/,
  `return {
      isAuthLoading,\n      currentView,`
);

fs.writeFileSync('src/context/AppContext.tsx', code);
