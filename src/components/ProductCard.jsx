import React from 'react';
import { Play, Plus, Check, Star, Sparkles, Layers, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function ProductCard({
  product,
  onStartPresentation,
  isInPlaylist,
  onTogglePlaylist,
  onSelectRelated,
}) {
  const isTopTier = product.isTopTier;
  const brandAccent = product.brandAccent || '#0B431E';
  const hasMultipleSpecialties = Array.isArray(product.specialties) && product.specialties.length > 1;

  return (
    <div
      className={`group relative rounded-3xl bg-white overflow-hidden transition-all duration-300 flex flex-col justify-between border ${
        isTopTier
          ? 'border-[#96916E]/40 hover:border-[#0B431E]/70 shadow-brand hover:shadow-brand-hover'
          : 'border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Top Banner & Priority Badge */}
      <div 
        className="relative aspect-video w-full overflow-hidden bg-[#F5F4F0] cursor-pointer border-b border-slate-100" 
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
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">No preview available</div>
        )}
        
        {/* Soft gradient overlay for pill readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/30 pointer-events-none" />

        {/* Company & Specialty Pills */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 flex-wrap max-w-[70%]">
          <span 
            className="px-2.5 py-1 rounded-md text-[10.5px] font-extrabold tracking-wide uppercase shadow-sm backdrop-blur-md text-white"
            style={{
              backgroundColor: brandAccent,
            }}
          >
            {product.company}
          </span>

          {hasMultipleSpecialties ? (
            product.specialties.map((spec, i) => (
              <span 
                key={i} 
                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-[#0B431E] shadow-sm backdrop-blur-md"
              >
                {spec}
              </span>
            ))
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-slate-700 shadow-sm backdrop-blur-md">
              {product.specialty}
            </span>
          )}
        </div>

        {/* Top-Tier "★ Core Focus" Golden Badge */}
        {isTopTier && (
          <div className="absolute top-3 right-3 z-10 gold-glow-badge">
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-[#96916E] text-white shadow-sm border border-white/20">
              <Star className="w-3.5 h-3.5 fill-current text-amber-300" />
              <span>Core Focus</span>
            </span>
          </div>
        )}

        {/* Cluster & Slide Count Chip */}
        <div className="absolute bottom-2.5 right-3 z-10 flex items-center gap-1.5 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900/80 text-white backdrop-blur-md">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>{product.slides.length} Slides</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Product Title */}
          <div className="flex items-start justify-between gap-2">
            <h3 
              onClick={() => onStartPresentation(product)}
              className="text-lg sm:text-xl font-extrabold text-[#0B431E] tracking-tight hover:text-[#14632E] transition-colors cursor-pointer leading-snug"
            >
              {product.name}
            </h3>
          </div>

          {/* Headline / Clinical Tagline */}
          <p className="text-xs font-semibold mt-1 mb-3 text-slate-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: brandAccent }}></span>
            <span>{product.headline}</span>
          </p>

          {/* Dosing Protocol Highlight (Brand Reference Sheet Off-White Fill #F5F4F0) */}
          {product.dosingProtocol && (
            <div className={`p-3 rounded-xl text-xs mb-3 border ${
              product.id === 'virulys'
                ? 'bg-blue-50/70 border-blue-200 text-blue-950'
                : 'bg-[#F5F4F0] border-[#96916E]/20 text-slate-800'
            }`}>
              <div className="flex items-center gap-1.5 font-bold text-[10px] tracking-wider uppercase text-[#0B431E] mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#96916E]" />
                <span>Posology & Dosing Protocol</span>
              </div>
              <p className="line-clamp-2 leading-relaxed text-[11.5px] font-medium text-slate-700">
                {product.dosingProtocol}
              </p>
            </div>
          )}

          {/* Key Clinical Indications */}
          <div className="space-y-1.5 mb-3.5">
            {product.keyIndications && product.keyIndications.slice(0, 2).map((ind, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600 leading-tight">
                <span className="text-[#0B431E] font-bold text-sm leading-none">•</span>
                <span className="line-clamp-1">{ind}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions & Cross-Sell Links */}
        <div className="pt-3.5 border-t border-slate-100 mt-auto">
          {/* Related Cross-Sell Protocols preview */}
          {product.relatedProductIds && product.relatedProductIds.length > 0 && (
            <div className="mb-3.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-0.5">
                Cluster Link:
              </span>
              {product.relatedProductIds.slice(0, 3).map((relId) => (
                <button
                  key={relId}
                  onClick={() => onSelectRelated && onSelectRelated(relId)}
                  className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-[#F5F4F0] hover:bg-[#E8F4EC] text-slate-700 hover:text-[#0B431E] border border-slate-200 hover:border-[#0B431E]/30 transition-colors flex items-center gap-0.5 active:scale-95"
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
              className="flex-1 min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-[#0B431E] hover:bg-[#14632E] transition-all shadow-sm hover:shadow active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-current text-white" />
              <span>Present Slides</span>
            </button>

            <button
              onClick={() => onTogglePlaylist(product)}
              title={isInPlaylist ? "Remove from Call Playlist" : "Add to Call Playlist"}
              className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl border transition-all flex items-center justify-center active:scale-95 ${
                isInPlaylist
                  ? 'bg-[#96916E] text-white border-[#96916E]'
                  : 'bg-white hover:bg-[#F5F4F0] text-slate-700 border-slate-200'
              }`}
            >
              {isInPlaylist ? (
                <Check className="w-4 h-4 stroke-[3]" />
              ) : (
                <Plus className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
