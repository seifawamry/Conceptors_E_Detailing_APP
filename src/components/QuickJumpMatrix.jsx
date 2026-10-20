import React from 'react';
import { X, Star, ArrowRight, Grid, Zap } from 'lucide-react';

export default function QuickJumpMatrix({
  isOpen,
  onClose,
  companies = [],
  topTierProducts = [],
  onSelectProduct,
  activeProductId = null,
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8F4EC] border border-[#0B431E]/20 flex items-center justify-center text-[#0B431E] font-black shadow-sm">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#0B431E] flex items-center gap-2">
                1.5-Second Omni-Matrix 
                <span className="text-[11px] font-bold text-[#0B431E] bg-[#E8F4EC] px-2.5 py-0.5 rounded-full border border-[#0B431E]/20">
                  Thumb Zone
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">1-Tap instantaneous product & presentation navigation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto no-scrollbar flex-1 py-4 space-y-6">
          {/* TOP SECTION: 10 TOP-TIER PRODUCTS PINNED AT THE TOP */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Star className="w-4 h-4 fill-[#96916E] text-[#96916E]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0B431E]">
                Top 10 Core Focus Flagships (1-Tap Call Jump)
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {topTierProducts.map((p) => {
                const isActive = p.id === activeProductId;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p);
                      onClose();
                    }}
                    className={`relative p-3 rounded-2xl border text-left transition-all group flex flex-col justify-between shadow-sm active:scale-[0.98] ${
                      isActive
                        ? 'bg-[#0B431E] text-white border-[#0B431E] shadow-md scale-[1.02]'
                        : 'bg-[#F5F4F0] hover:bg-[#E8F4EC] border-slate-200 hover:border-[#0B431E]/30 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span 
                          className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            isActive ? 'bg-white/20 text-white' : 'bg-white text-[#0B431E] border border-slate-200'
                          }`}
                        >
                          {p.company}
                        </span>
                        <Star className={`w-3 h-3 fill-current ${isActive ? 'text-amber-300' : 'text-[#96916E]'}`} />
                      </div>
                      <div className={`font-extrabold text-xs sm:text-sm line-clamp-1 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {p.name}
                      </div>
                      <div className={`text-[10.5px] line-clamp-1 mt-0.5 font-medium ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                        {p.specialty}
                      </div>
                    </div>

                    <div className={`mt-2.5 pt-1.5 border-t flex items-center justify-between text-[10px] font-mono ${
                      isActive ? 'border-white/20 text-white/80' : 'border-slate-200 text-slate-500'
                    }`}>
                      <span>{p.slides.length} slides</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTTOM SECTION: ALL 4 COMPANIES ORGANIZED IN 4 CLEAN COLUMNS */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Grid className="w-4 h-4 text-[#0B431E]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                All 4 Portfolio Companies (16 Products)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {companies.map((comp) => (
                <div 
                  key={comp.id}
                  className="rounded-2xl p-3.5 bg-[#FAF9F5] border border-slate-200 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: comp.brandAccent }}
                      />
                      <span className="text-xs font-black text-[#0B431E] uppercase tracking-wider">
                        {comp.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      {comp.products.length} Products
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {comp.products.map((p) => {
                      const isActive = p.id === activeProductId;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            onSelectProduct(p);
                            onClose();
                          }}
                          className={`w-full text-left px-3 py-2.5 min-h-[42px] rounded-xl text-xs transition-all flex items-center justify-between group active:scale-[0.98] ${
                            isActive
                              ? 'bg-[#0B431E] text-white font-extrabold shadow-sm'
                              : 'bg-white hover:bg-[#E8F4EC] text-slate-800 border border-slate-200 hover:border-[#0B431E]/30'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            {p.isTopTier && (
                              <Star className="w-3 h-3 text-[#96916E] fill-[#96916E] flex-shrink-0" />
                            )}
                            <span className="truncate font-semibold">{p.name}</span>
                          </div>
                          <span className="text-[10px] opacity-60 font-mono font-bold flex-shrink-0">
                            {p.slides.length}s
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500 flex items-center justify-between font-medium">
          <span>Tap any product to immediately switch the active presentation view</span>
          <span className="font-mono text-[11px] text-[#0B431E] font-bold">ESC or Tap outside to close</span>
        </div>
      </div>
    </div>
  );
}
