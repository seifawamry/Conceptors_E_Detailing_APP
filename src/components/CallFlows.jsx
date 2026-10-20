import React, { useState } from 'react';
import { 
  Stethoscope, 
  Sparkles, 
  ArrowRight, 
  Play, 
  ChevronDown, 
  ChevronUp, 
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
          <div className="w-10 h-10 rounded-2xl bg-[#E8F4EC] border border-[#0B431E]/20 flex items-center justify-center text-[#0B431E] shadow-sm flex-shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-[#0B431E] tracking-tight flex items-center gap-2">
              Pre-Built Clinical Call Flows 
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E8F4EC] text-[#0B431E] border border-[#0B431E]/20">
                {callFlows.length} Protocols
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
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
              className="relative rounded-3xl bg-white border border-slate-200/90 hover:border-[#0B431E]/40 transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-brand"
            >
              {/* Flow Header */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span 
                        className="px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider shadow-sm"
                        style={{
                          backgroundColor: '#E8F4EC',
                          color: '#0B431E',
                          border: '1px solid rgba(11, 67, 30, 0.2)',
                        }}
                      >
                        {flow.badge || 'Protocol'}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {flow.category}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-slate-700 bg-[#F5F4F0] px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5 flex-shrink-0">
                      <Layers className="w-3.5 h-3.5 text-[#0B431E]" />
                      <span>{steps.length} Steps</span>
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-[#0F172A] group-hover:text-[#0B431E] transition-colors leading-snug">
                    {flow.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: flow.accent || '#0B431E' }}></span>
                    <span>{flow.tagline}</span>
                  </p>

                  {/* Target Indications Pills */}
                  {flow.targetIndications && flow.targetIndications.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-3.5">
                      {flow.targetIndications.map((ind, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#F5F4F0] text-slate-700 border border-slate-200"
                        >
                          {ind}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Visual Step-by-Step Sequence Pipeline */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2.5">
                      Clinical Delivery Pipeline:
                    </span>
                    
                    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
                      {steps.map((step, idx) => {
                        const prod = allProductsMap[step.productId];
                        const prodAccent = prod?.brandAccent || flow.accent || '#0B431E';
                        const isLast = idx === steps.length - 1;

                        return (
                          <React.Fragment key={step.step || idx}>
                            <div 
                              className="p-2.5 rounded-xl bg-[#FAF9F5] border border-slate-200 hover:border-[#0B431E]/40 transition-all flex flex-col justify-between flex-shrink-0 min-w-[130px] sm:min-w-[140px]"
                            >
                              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                                <span className="font-extrabold text-[#0B431E] font-mono">
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
                                <span className="text-xs font-extrabold text-slate-900 truncate">
                                  {prod ? prod.shortName || prod.name : step.label}
                                </span>
                              </div>
                              {prod?.isTopTier && (
                                <div className="mt-1 flex items-center gap-1 text-[9.5px] text-[#96916E] font-bold">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  <span>Core Focus</span>
                                </div>
                              )}
                            </div>

                            {!isLast && (
                              <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Expandable Clinical Rationale */}
                {isExpanded && (
                  <div className="mt-4 p-4 rounded-2xl bg-[#F5F4F0] border border-[#96916E]/20 text-xs sm:text-sm text-slate-800 leading-relaxed animate-in fade-in duration-200">
                    <div className="flex items-center gap-1.5 font-bold text-[#0B431E] mb-1.5 text-xs uppercase tracking-wider">
                      <FileText className="w-4 h-4 text-[#96916E]" />
                      <span>Doctor Rationale & Clinical Mechanism:</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {flow.clinicalRationale || flow.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Actions Bar (Tablet Reachability 48px Height) */}
              <div className="px-5 py-3.5 sm:px-6 bg-[#FAF9F5] border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={(e) => toggleExpand(flow.id, e)}
                  className="min-h-[44px] px-3 py-2 rounded-xl hover:bg-slate-200/60 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <span>{isExpanded ? 'Hide Mechanism' : 'View Clinical Mechanism'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-[#0B431E]" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>

                <button
                  onClick={() => onLaunchFlow(flow)}
                  className="min-h-[44px] flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-[#0B431E] hover:bg-[#14632E] transition-all shadow-sm active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-current text-white" />
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
