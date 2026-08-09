import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export const InstallPWA: React.FC = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    
    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setSupportsPWA(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const onClick = async () => {
    if (!promptInstall) return;
    promptInstall.prompt();
    const { outcome } = await promptInstall.userChoice;
    if (outcome === 'accepted') {
      setSupportsPWA(false);
    }
  };

  if (!supportsPWA || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl border border-purple-100 p-4 z-[9999] animate-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
            <img src="https://exyrlwugzdvqfiafvfcv.supabase.co/storage/v1/object/public/images/Icon%20193X193.png" alt="Alberta" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Instal Aplikasi Alberta</h3>
            <p className="text-xs text-slate-500 mt-0.5">Akses lebih cepat dan hemat kuota!</p>
          </div>
        </div>
        <button 
          onClick={() => setIsDismissed(true)}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <button
        onClick={onClick}
        className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2.5 px-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all text-sm"
      >
        <Download className="w-4 h-4" />
        Instal Sekarang
      </button>
    </div>
  );
};
