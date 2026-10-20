import React from 'react';
import { 
  Play, 
  Plus, 
  Check, 
  Star, 
  Sparkles, 
  Layers, 
  ArrowUpRight, 
  ShieldCheck, 
  Pill, 
  BookOpen, 
  Calculator 
} from 'lucide-react';
import { clinicalDatabase } from '../data/clinicalData.js';

export default function ProductCard({
  product,
  onStartPresentation,
  isInPlaylist,
  onTogglePlaylist,
  onSelectRelated,
}) {
  const isTopTier = product.isTopTier;
  const brandAccent = product.brandAccent || '#0B431E';
  const clinicalInfo = product.id ? clinicalDatabase[product.id] : null;
  const categoryColor = clinicalInfo?.categoryColor || brandAccent;
  const hasMultipleSpecialties = Array.isArray(product.specialties) && product.specialties.length > 1;
  const primaryEvidence = clinicalInfo?.clinicalReferences?.[0];

  return (
    <div
      className={`group relative rounded-3xl bg-white overflow-hidden transition-all duration-300 flex flex-col justify-between border ${
        isTopTier
          ? 'border-[#96916E]/40 hover:border-[#0B431E]/70 shadow-brand hover:shadow-brand-hover ring-1 ring-[#96916E]/20'
          : 'border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Category Color Accent Header Bar */}
      <div 
        className="h-1.5 w-full transition-all"
        style={{ backgroundColor: categoryColor }}
      />

      {/* Top Banner & Packshot Area */}
      <div 
        className="relative aspect-video w-full overflow-hidden bg-[#F8FAFC] cursor-pointer border-b border-slate-100 flex items-center justify-center p-2" 
        onClick={() => onStartPresentation(product)}
      >
        {product.slides && product.slides.length > 0 ? (
          <img
            src={product.slides[0]}
            alt={product.name}
            className="w-full h-full object-cover object-top packshot-studio transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">No preview available</div>
        )}
        
        {/* Subtle gradient overlay for pill readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/20 pointer-events-none" />

        {/* Company & Specialty Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 flex-wrap max-w-[70%]">
          <span 
            className="px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wide uppercase shadow-sm text-white"
            style={{ backgroundColor: brandAccent }}
          >
            {product.company}
          </span>

          {hasMultipleSpecialties ? (
            product.specialties.map((spec, i) => (
              <span 
                key={i} 
                className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/95 text-slate-800 shadow-sm backdrop-blur-md"
              >
                {spec}
              </span>
            ))
          ) : (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/95 text-slate-800 shadow-sm backdrop-blur-md">
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

        {/* Primary Clinical Endpoint Tag on packshot */}
        {primaryEvidence && (
          <div className="absolute bottom-2.5 left-3 z-10 hidden sm:flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-[#0B431E]/90 text-white backdrop-blur-md shadow-sm">
            <Sparkles className="w-3 h-3 text-emerald-300" />
            <span>{primaryEvidence.metric}</span>
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

          {/* Scannable Bento Information Architecture */}
          <div className="space-y-2 mb-3">
            {/* Bento Block 1: Posology & Protocol */}
            {product.dosingProtocol && (
              <div className={`p-2.5 rounded-xl text-xs border ${
                product.id === 'virulys'
                  ? 'bg-blue-50/70 border-blue-200 text-blue-950'
                  : 'bg-[#F8FAFC] border-slate-200 text-slate-800'
              }`}>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="flex items-center gap-1 font-black text-[10px] tracking-wider uppercase text-[#0B431E]">
                    <Pill className="w-3 h-3 text-[#96916E]" />
                    <span>Posology & Protocol</span>
                  </span>
                  {clinicalInfo?.dosingConfig?.frequencyShort && (
                    <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-white text-[#0B431E] border border-slate-200">
                      {clinicalInfo.dosingConfig.frequencyShort}
                    </span>
                  )}
                </div>
                <p className="line-clamp-2 leading-relaxed text-[11px] font-medium text-slate-700">
                  {product.dosingProtocol}
                </p>
              </div>
            )}

            {/* Bento Block 2: Key Active Ingredients */}
            {product.activeIngredients && (
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs">
                <span className="font-black text-[10px] tracking-wider uppercase text-slate-500 block mb-0.5">
                  Molecular Actives:
                </span>
                <p className="text-[11px] text-slate-700 font-medium line-clamp-1">
                  {product.activeIngredients}
                </p>
              </div>
            )}
          </div>

          {/* Key Clinical Indications */}
          <div className="space-y-1 mb-3.5">
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
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-0.5">
                Cluster Link:
              </span>
              {product.relatedProductIds.slice(0, 3).map((relId) => (
                <button
                  key={relId}
                  onClick={() => onSelectRelated && onSelectRelated(relId)}
                  className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-[#F8FAFC] hover:bg-[#E8F4EC] text-slate-700 hover:text-[#0B431E] border border-slate-200 hover:border-[#0B431E]/30 transition-colors flex items-center gap-0.5 active:scale-95"
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
                  : 'bg-white hover:bg-[#F8FAFC] text-slate-700 border-slate-200'
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
