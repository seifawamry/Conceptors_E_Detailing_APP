import React, { useState } from 'react';
import { 
  Stethoscope, 
  Sparkles, 
  ArrowRight, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  ShieldCheck, 
  FileText,
  Layers,
  Star
} from 'lucide-react';

export default function CallFlows({ callFlows = [], onLaunchFlow, allProductsMap = {} }) {
  const [expandedFlowId, setExpandedFlowId] = useState(null);

  if (!callFlows || callFlows.length === 0) return null;

  const toggleExpand = (flowId, e) => {
    e.stopPropagation();
    setExpandedFlowId((prev) => (prev === flowId ? null : flowId));
  };

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-glow-emerald flex-shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Pre-Built Clinical Call Flows 
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                {callFlows.length} Protocols
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Evidence-based doctor conversation pathways & sequential prescribing protocols for veterinarians
            </p>
          </div>
        </div>
      </div>

      {/* Wide Clinical Flows Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {callFlows.map((flow) => {
          const isExpanded = expandedFlowId === flow.id;
          const steps = flow.steps || flow.productIds.map((pId, idx) => ({
            step: idx + 1,
            role: 'Therapy',
            productId: pId,
            label: allProductsMap[pId]?.name || pId,
          }));

          return (
            <div
              key={flow.id}
              className="relative rounded-3xl glass-panel border border-white/10 hover:border-emerald-400/50 transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-xl bg-gradient-to-br from-[#0D1322]/95 via-[#0D1322]/80 to-[#090D16]/95"
            >
              {/* Flow Header */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span 
                        className="px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider border shadow-sm"
                        style={{
                          backgroundColor: `${flow.accent}18`,
                          color: flow.accent,
                          borderColor: `${flow.accent}45`,
                        }}
                      >
                        {flow.badge || 'Protocol'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {flow.category}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-slate-300 bg-black/60 px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 flex-shrink-0">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{steps.length} Steps</span>
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {flow.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: flow.accent }}></span>
                    <span>{flow.tagline}</span>
                  </p>

                  {/* Target Indications Pills */}
                  {flow.targetIndications && flow.targetIndications.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-3.5">
                      {flow.targetIndications.map((ind, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10"
                        >
                          {ind}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Visual Step-by-Step Sequence Pipeline */}
                  <div className="mt-4 pt-3.5 border-t border-white/10">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">
                      Clinical Delivery Pipeline:
                    </span>
                    
                    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
                      {steps.map((step, idx) => {
                        const prod = allProductsMap[step.productId];
                        const prodAccent = prod?.brandAccent || flow.accent || '#10B981';
                        const isLast = idx === steps.length - 1;

                        return (
                          <React.Fragment key={step.step || idx}>
                            <div 
                              className="p-2.5 rounded-xl bg-black/50 border border-white/10 hover:border-emerald-400/40 transition-all flex flex-col justify-between flex-shrink-0 min-w-[130px] sm:min-w-[140px]"
                            >
                              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                                <span className="font-extrabold text-emerald-400 font-mono">
                                  STEP {step.step}
                                </span>
                                <span className="truncate text-[9px] opacity-80 uppercase font-semibold">
                                  {step.role}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span 
                                  className="w-2 h-2 rounded-full flex-shrink-0" 
                                  style={{ backgroundColor: prodAccent }}
                                />
                                <span className="text-xs font-bold text-white truncate">
                                  {prod ? prod.shortName || prod.name : step.label}
                                </span>
                              </div>
                              {prod?.isTopTier && (
                                <div className="mt-1 flex items-center gap-1 text-[9.5px] text-amber-300 font-medium">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  <span>Core Focus</span>
                                </div>
                              )}
                            </div>

                            {!isLast && (
                              <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Expandable Clinical Rationale */}
                {isExpanded && (
                  <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed animate-in fade-in duration-200">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1.5 text-xs uppercase tracking-wider">
                      <FileText className="w-4 h-4" />
                      <span>Doctor Rationale & Clinical Mechanism:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {flow.clinicalRationale || flow.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Actions Bar (Tablet Reachability 48px Height) */}
              <div className="px-5 py-3.5 sm:px-6 bg-black/50 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  onClick={(e) => toggleExpand(flow.id, e)}
                  className="min-h-[44px] px-3 py-2 rounded-xl hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>{isExpanded ? 'Hide Mechanism' : 'View Clinical Mechanism'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                <button
                  onClick={() => onLaunchFlow(flow)}
                  className="min-h-[44px] flex items-center gap-2 py-2.5 px-5 rounded-2xl text-xs sm:text-sm font-extrabold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-glow-emerald active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch Protocol Call</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
