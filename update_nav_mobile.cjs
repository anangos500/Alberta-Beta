const fs = require('fs');

let file = fs.readFileSync('src/components/public/Navbar.tsx', 'utf8');

const oldMobileButtons = `{/* Mobile Hamburger Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="sm:hidden px-2.5 py-1.5 text-[10px] font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full whitespace-nowrap"
            >
              Daftar
            </button>
            <button`;

const newMobileButtons = `{/* Mobile Hamburger Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            {currentUser ? (
              <button
                onClick={() => navigate('/portal')}
                className="sm:hidden px-3 py-1.5 text-[10px] font-bold text-purple-700 bg-purple-100 border border-purple-200 rounded-full whitespace-nowrap flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Portal
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="sm:hidden px-3 py-1.5 text-[10px] font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-full whitespace-nowrap flex items-center gap-1"
              >
                <LogIn className="w-3 h-3" />
                Masuk
              </button>
            )}
            <button`;

file = file.replace(oldMobileButtons, newMobileButtons);

fs.writeFileSync('src/components/public/Navbar.tsx', file);
console.log("Updated mobile buttons in Navbar");
