import React from 'react';
import { Play, Plus, Check, Star, Sparkles, ChevronRight, Layers, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function ProductCard({
  product,
  onStartPresentation,
  isInPlaylist,
  onTogglePlaylist,
  onSelectRelated,
}) {
  const isTopTier = product.isTopTier;
  const brandAccent = product.brandAccent || '#10B981';
  const hasMultipleSpecialties = Array.isArray(product.specialties) && product.specialties.length > 1;

  return (
    <div
      className={`group relative rounded-3xl glass-panel overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl ${
        isTopTier
          ? 'border-amber-500/35 hover:border-amber-400/70 shadow-glow-gold/15 bg-gradient-to-b from-[#131C31]/95 to-[#090D16]/95'
          : 'border-white/10 hover:border-white/25 bg-[#0D1322]/85'
      }`}
    >
      {/* Top Banner & Priority Badge */}
      <div 
        className="relative aspect-video w-full overflow-hidden bg-black/40 cursor-pointer" 
        onClick={() => onStartPresentation(product)}
      >
        {product.slides && product.slides.length > 0 ? (
          <img
            src={product.slides[0]}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No preview</div>
        )}
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-black/40 pointer-events-none" />

        {/* Company & Specialty Pills */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 flex-wrap max-w-[70%]">
          <span 
            className="px-2.5 py-1 rounded-md text-[10.5px] font-bold tracking-wide uppercase border shadow-md backdrop-blur-md"
            style={{
              backgroundColor: `${brandAccent}25`,
              color: brandAccent,
              borderColor: `${brandAccent}50`,
            }}
          >
            {product.company}
          </span>

          {hasMultipleSpecialties ? (
            product.specialties.map((spec, i) => (
              <span 
                key={i} 
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/75 text-emerald-300 border border-emerald-500/30 backdrop-blur-md"
              >
                {spec}
              </span>
            ))
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/70 text-slate-200 border border-white/10 backdrop-blur-md">
              {product.specialty}
            </span>
          )}
        </div>

        {/* Top-Tier "★ Core Focus" Golden Badge */}
        {isTopTier && (
          <div className="absolute top-3 right-3 z-10 gold-glow-badge">
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-amber-400 text-slate-950 border border-amber-300 shadow-md">
              <Star className="w-3.5 h-3.5 fill-current text-slate-950" />
              <span>Core Focus</span>
            </span>
          </div>
        )}

        {/* Cluster & Slide Count Chip */}
        <div className="absolute bottom-2.5 right-3 z-10 flex items-center gap-1.5 text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg bg-black/80 text-slate-200 border border-white/15 backdrop-blur-md">
          <Layers className="w-3 h-3 text-emerald-400" />
          <span>{product.slides.length} Slides</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Product Title */}
          <div className="flex items-start justify-between gap-2">
            <h3 
              onClick={() => onStartPresentation(product)}
              className="text-lg sm:text-xl font-extrabold text-white tracking-tight hover:text-emerald-400 transition-colors cursor-pointer leading-snug"
            >
              {product.name}
            </h3>
          </div>

          {/* Headline / Clinical Tagline */}
          <p className="text-xs font-semibold mt-1 mb-3 text-slate-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: brandAccent }}></span>
            <span>{product.headline}</span>
          </p>

          {/* Dosing Protocol Highlight (Special Emphasis on Virulys Twice Daily) */}
          {product.dosingProtocol && (
            <div className={`p-3 rounded-xl text-xs mb-3 border ${
              product.id === 'virulys'
                ? 'bg-blue-950/50 border-blue-400/50 text-blue-100 shadow-glow-blue/20'
                : 'bg-white/5 border-white/10 text-slate-300'
            }`}>
              <div className="flex items-center gap-1.5 font-bold text-[10px] tracking-wider uppercase text-slate-400 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Posology & Dosing Protocol</span>
              </div>
              <p className="line-clamp-2 leading-relaxed text-[11.5px] font-medium">
                {product.dosingProtocol}
              </p>
            </div>
          )}

          {/* Key Clinical Indications */}
          <div className="space-y-1.5 mb-3.5">
            {product.keyIndications && product.keyIndications.slice(0, 2).map((ind, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300 leading-tight">
                <span className="text-emerald-400 text-sm leading-none">•</span>
                <span className="line-clamp-1">{ind}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions & Cross-Sell Links */}
        <div className="pt-3.5 border-t border-white/10 mt-auto">
          {/* Related Cross-Sell Protocols preview */}
          {product.relatedProductIds && product.relatedProductIds.length > 0 && (
            <div className="mb-3.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-0.5">
                Cluster Link:
              </span>
              {product.relatedProductIds.slice(0, 3).map((relId) => (
                <button
                  key={relId}
                  onClick={() => onSelectRelated && onSelectRelated(relId)}
                  className="px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 hover:border-emerald-400/40 transition-colors flex items-center gap-0.5 active:scale-95"
                >
                  <span className="capitalize">{relId.replace(/-/g, ' ')}</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-slate-400" />
                </button>
              ))}
            </div>
          )}

          {/* Action Buttons: 1-Tap Present & Playlist Toggle (Tablet 44px Hit Target) */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onStartPresentation(product)}
              className="flex-1 min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-glow-emerald active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Present Slides</span>
            </button>

            <button
              onClick={() => onTogglePlaylist(product)}
              title={isInPlaylist ? "Remove from Call Playlist" : "Add to Call Playlist"}
              className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl border transition-all flex items-center justify-center active:scale-95 ${
                isInPlaylist
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-glow-gold'
                  : 'bg-white/5 hover:bg-white/15 text-slate-300 border-white/10'
              }`}
            >
              {isInPlaylist ? (
                <Check className="w-4 h-4 stroke-[3]" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
