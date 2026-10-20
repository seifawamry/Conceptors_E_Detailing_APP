import React, { useState, useRef } from 'react';
import { 
  Play, 
  Plus, 
  Check, 
  Star, 
  Sparkles, 
  Layers, 
  ArrowUpRight, 
  Pill, 
  Activity,
  RotateCw,
  BookOpen
} from 'lucide-react';
import { clinicalDatabase } from '../data/clinicalData.js';

export default function ProductCard({
  product,
  onStartPresentation,
  isInPlaylist,
  onTogglePlaylist,
  onSelectRelated,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });
  const cardRef = useRef(null);

  const isTopTier = product.isTopTier;
  const brandAccent = product.brandAccent || '#0B431E';
  const clinicalInfo = product.id ? clinicalDatabase[product.id] : null;
  const categoryColor = clinicalInfo?.categoryColor || brandAccent;
  const hasMultipleSpecialties = Array.isArray(product.specialties) && product.specialties.length > 1;
  const primaryEvidence = clinicalInfo?.clinicalReferences?.[0];

  // 3D Gyro / Parallax tilt on touch/pointer move
  const handlePointerMove = (e) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const tiltX = (y - 0.5) * -12;
    const tiltY = (x - 0.5) * 12;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.08s ease-out',
    });

    setGlareStyle({
      opacity: 0.35,
      background: `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 65%)`,
    });
  };

  const handlePointerLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    });
    setGlareStyle({ opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      style={tiltStyle}
      className={`group relative rounded-3xl bg-white overflow-hidden transition-all duration-300 flex flex-col justify-between border transform-style-3d ${
        isTopTier
          ? 'border-[#96916E]/40 hover:border-[#0B431E]/70 shadow-brand hover:shadow-2xl ring-1 ring-[#96916E]/20'
          : 'border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-xl'
      }`}
    >
      {/* 3D Specular Glare Layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 rounded-3xl"
        style={glareStyle}
      />

      {/* Category Color Accent Header Bar */}
      <div 
        className="h-1.5 w-full transition-all"
        style={{ backgroundColor: categoryColor }}
      />

      {/* 3D Flip Container */}
      <div className={`w-full h-full flex flex-col justify-between transition-transform duration-500 transform-style-3d ${
        isFlipped ? 'rotate-y-180' : ''
      }`}>

        {/* ========================================================================= */}
        {/* FRONT FACE                                                                */}
        {/* ========================================================================= */}
        <div className={`w-full flex-1 flex flex-col justify-between ${isFlipped ? 'hidden' : 'flex'}`}>
          {/* Top Banner & Packshot Area */}
          <div 
            className="relative aspect-video w-full overflow-hidden bg-[#F8FAFC] cursor-pointer border-b border-slate-100 flex items-center justify-center p-2" 
            onClick={() => onStartPresentation(product)}
          >
            {product.slides && product.slides.length > 0 ? (
              <img
                src={product.slides[0]}
                alt={product.name}
                className="w-full h-full object-cover object-top packshot-studio transition-transform duration-500 group-hover:scale-105 card-3d-elevate"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">No preview available</div>
            )}
            
            {/* Subtle gradient overlay for pill readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/20 pointer-events-none" />

            {/* Company & Specialty Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 flex-wrap max-w-[70%] card-3d-elevate-high">
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
              <div className="absolute top-3 right-3 z-10 gold-glow-badge card-3d-elevate-high">
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
          <div className="p-5 flex-1 flex flex-col justify-between bg-white card-3d-elevate">
            <div>
              {/* Product Title & 3D Flip Quick Action */}
              <div className="flex items-start justify-between gap-2">
                <h3 
                  onClick={() => onStartPresentation(product)}
                  className="text-lg sm:text-xl font-extrabold text-[#0B431E] tracking-tight hover:text-[#14632E] transition-colors cursor-pointer leading-snug"
                >
                  {product.name}
                </h3>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(true);
                  }}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#E8F4EC] text-slate-500 hover:text-[#0B431E] border border-slate-200 transition-all active:scale-95"
                  title="3D Flip: View Posology & Mechanism Breakdown"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
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
                    Cluster:
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

              {/* Action Buttons: 3D Physical Tactile Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStartPresentation(product)}
                  className="flex-1 min-h-[46px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-extrabold ui-3d-btn-primary"
                >
                  <Play className="w-4 h-4 fill-current text-white" />
                  <span>Present Slides</span>
                </button>

                {/* 3D Flip Quick Action */}
                <button
                  onClick={() => setIsFlipped(true)}
                  title="3D Flip: View Posology & Trial Endpoints"
                  className="min-h-[46px] min-w-[46px] p-2.5 rounded-2xl ui-3d-btn-secondary flex items-center justify-center"
                >
                  <RotateCw className="w-4 h-4 text-slate-700" />
                </button>

                {/* Playlist Toggle */}
                <button
                  onClick={() => onTogglePlaylist(product)}
                  title={isInPlaylist ? "Remove from Call Playlist" : "Add to Call Playlist"}
                  className={`min-h-[46px] min-w-[46px] p-2.5 rounded-2xl transition-all flex items-center justify-center ${
                    isInPlaylist
                      ? 'ui-3d-btn-primary'
                      : 'ui-3d-btn-secondary'
                  }`}
                >
                  {isInPlaylist ? (
                    <Check className="w-4 h-4 stroke-[3] text-white" />
                  ) : (
                    <Plus className="w-4 h-4 text-slate-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BACK FACE (3D FLIP VIEW)                                                  */}
        {/* ========================================================================= */}
        <div className={`w-full flex-1 p-5 bg-gradient-to-br from-[#F8FAFC] to-[#E8F4EC]/40 flex-col justify-between ${isFlipped ? 'flex' : 'hidden'}`}>
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#0B431E]" />
                <span className="text-xs font-black uppercase text-[#0B431E]">Clinical Posology & Evidence</span>
              </div>
              <button
                onClick={() => setIsFlipped(false)}
                className="px-3 py-1.5 rounded-xl ui-3d-btn-secondary text-xs font-bold flex items-center gap-1.5"
              >
                <span>Return</span>
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <h4 className="text-base font-black text-slate-900 mt-3 mb-1">
              {product.name}
            </h4>
            <p className="text-xs text-slate-600 font-medium mb-3">
              {product.headline}
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs">
                <span className="font-black text-[#0B431E] uppercase text-[10px] block mb-1">Full Posology Formula:</span>
                <p className="text-slate-800 leading-relaxed font-medium text-[11px]">
                  {product.dosingProtocol}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs">
                <span className="font-black text-slate-500 uppercase text-[10px] block mb-1">Key Molecular Active:</span>
                <p className="text-slate-800 leading-relaxed font-medium text-[11px]">
                  {product.activeIngredients || 'Proprietary clinical formulation'}
                </p>
              </div>

              {primaryEvidence && (
                <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-200 text-xs text-purple-950">
                  <span className="font-black text-purple-800 uppercase text-[10px] block mb-1">Clinical Trial Endpoint:</span>
                  <p className="font-bold text-[11px]">{primaryEvidence.title}</p>
                  <p className="text-[10px] text-purple-700 mt-1 font-mono">{primaryEvidence.highlight}</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2 mt-4">
            <button
              onClick={() => onStartPresentation(product)}
              className="w-full min-h-[46px] rounded-2xl ui-3d-btn-primary text-xs font-black flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current text-white" />
              <span>Launch Fullscreen Detailing</span>
            </button>

            <button
              onClick={() => setIsFlipped(false)}
              className="w-full min-h-[42px] rounded-2xl ui-3d-btn-secondary text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>Back to Card Front</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
