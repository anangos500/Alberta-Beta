const fs = require('fs');

let file = fs.readFileSync('src/components/public/TentorsSection.tsx', 'utf8');

const originalTopDiv = `<div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 relative">
              <div className="text-center md:text-left max-w-3xl space-y-4">
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Pengajar <span className="text-purple-600 md:block mt-2">Sabar & Spesialis</span>
                </h2>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
                  Seluruh tentor Bimbel Alberta merupakan lulusan terbaik yang memiliki minat tinggi dalam membimbing anak-anak untuk mencapai prestasi maksimal.
                </p>
              </div>
              <div className="shrink-0 pt-4 md:pt-0">
                <Link
                  to="/tentor"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all shadow-xl shadow-purple-500/30 group"
                >
                  Lihat Semua Tentor
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </Link>
              </div>
            </div>`;

const newTopDiv = `<div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 relative">
              <div className="text-center md:text-left max-w-3xl space-y-4">
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Pengajar <span className="text-purple-600 md:block mt-2">Sabar & Spesialis</span>
                </h2>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto md:mx-0 text-justify md:text-left">
                  Seluruh tentor Bimbel Alberta merupakan lulusan terbaik yang memiliki minat tinggi dalam membimbing anak-anak untuk mencapai prestasi maksimal.
                </p>
              </div>
              <div className="hidden md:block shrink-0 pt-4 md:pt-0">
                <Link
                  to="/tentor"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all shadow-xl shadow-purple-500/30 group"
                >
                  Lihat Semua Tentor
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </Link>
              </div>
            </div>`;

file = file.replace(originalTopDiv, newTopDiv);

const originalBottomCards = `<ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        ) : (`;

const newBottomCards = `<ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Mobile button below cards */}
            <div className="flex justify-center md:hidden -mt-4">
              <Link
                to="/tentor"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all shadow-xl shadow-purple-500/30 group"
              >
                Lihat Semua Tentor
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </Link>
            </div>
          </div>
        ) : (`;

file = file.replace(originalBottomCards, newBottomCards);

fs.writeFileSync('src/components/public/TentorsSection.tsx', file);
console.log("Updated TentorsSection.tsx");
