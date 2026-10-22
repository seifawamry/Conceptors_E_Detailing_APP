import React, { useState, useRef, useMemo } from 'react';
import {
  Sparkles,
  Play,
  ArrowRight,
  ChevronRight,
  Activity,
  ShieldCheck,
  Layers,
  Crosshair,
  RotateCcw,
  Star,
  CheckCircle2,
  Stethoscope,
  Zap,
  Clock,
  Eye
} from 'lucide-react';
import { clinicalDatabase } from '../data/clinicalData.js';

/**
 * STRICT 16-PRODUCT ANATOMICAL ZONES & CLINICAL PROTOCOLS
 * Every product ID maps strictly to the 16 existing products in catalog.json:
 * - Catalysis (6): viusid, viusid-detox, carminal, renalof, asprib, bluecap-shampoo
 * - B.A.R.D (5): ecosin, dermasin, pythie-pet-ointment, pythie-pet-ear-cleaner, pythie-pet-fresh-breath
 * - Vitasignia (1): virulys (Strictly Twice Daily / BID protocol)
 * - Ringbio (4): flexy-cpv, flexy-fpv, flexy-fcov, flexy-toxoplasma
 */
export const ANATOMICAL_ZONES = [
  {
    id: 'ocular-nasal-respiratory',
    number: 1,
    shortLabel: '1. URI & Respiratory',
    name: 'Ocular-Nasal & Upper Respiratory Zone',
    anatomicalStructure: '3D Cranial Sinus, Nasal Turbinates & Tracheobronchial Airway',
    protocolTitle: 'Feline URI & Respiratory Management',
    clinicalSummary:
      'Dual-action viral suppression (FHV-1 / FCV), mucosal clearance, and bronchodilation for upper & lower respiratory tract infections.',
    productIds: ['virulys', 'asprib', 'viusid'],
    // Coordinates (%) on the 800x520 SVG stage for Feline and Canine
    coords: {
      feline: { x: 20, y: 31, labelX: 8, labelY: 16, zoomX: 24, zoomY: 32, scale: 1.55 },
      canine: { x: 17, y: 29, labelX: 7, labelY: 14, zoomX: 22, zoomY: 30, scale: 1.55 },
    },
    productMeta: {
      virulys: {
        roleBadge: 'Step 1 • Direct Antiviral & Mucosal Defense',
        dosingPill: '⭐ TWICE DAILY (BID) • Kitten: 1–2 ml BID | Adult Cat: 2 ml BID',
        indicationBadge: 'FHV-1 & FCV URI • 50:1 Lysine-to-Arginine Safe Ratio',
        highlightBid: true,
      },
      asprib: {
        roleBadge: 'Step 2 • Airway Clearance & Bronchodilation',
        dosingPill: '1 ml / 5 kg BW • 2–3x Daily (7–10 Days)',
        indicationBadge: 'Rhinitis, Tracheobronchitis & Canine Distemper (-61% Mortality)',
      },
      viusid: {
        roleBadge: 'Step 3 • Systemic Antiviral & Interferon Booster',
        dosingPill: '1 ml / 5 kg BW • Twice Daily (BID)',
        indicationBadge: 'Activated Glycyrrhizinic Acid • Systemic Viral Immunity',
      },
    },
  },
  {
    id: 'otic-ear',
    number: 2,
    shortLabel: '2. Otic / Ear',
    name: 'Otic / Ear Zone',
    anatomicalStructure: '3D Ear Pinna & External Tympanic Canal',
    protocolTitle: 'Otic Hygiene & Otitis Externa Care',
    clinicalSummary:
      'Biological mycoparasitic cleansing and soothing of the external auditory meatus against Malassezia yeast, cerumen buildup, and erythema.',
    productIds: ['pythie-pet-ear-cleaner'],
    coords: {
      feline: { x: 25, y: 17, labelX: 26, labelY: 6, zoomX: 26, zoomY: 22, scale: 1.65 },
      canine: { x: 25, y: 19, labelX: 26, labelY: 7, zoomX: 26, zoomY: 22, scale: 1.65 },
    },
    productMeta: {
      'pythie-pet-ear-cleaner': {
        roleBadge: 'Targeted Otic Biological Care',
        dosingPill: 'Instill Drops into Ear Canal • Massage Base & Wipe Clean',
        indicationBadge: 'Otitis Externa (Malassezia / Bacteria), Wax & Foul Odor',
      },
    },
  },
  {
    id: 'oral-dental',
    number: 3,
    shortLabel: '3. Oral & Dental',
    name: 'Oral & Dental Zone',
    anatomicalStructure: '3D Maxilla / Mandible & Periodontal Dental Arcade',
    protocolTitle: 'Oral Biofilm & Periodontal Hygiene',
    clinicalSummary:
      'Enzymatic and biological disruption of subgingival plaque biofilm, halitosis control, and gingival tissue protection.',
    productIds: ['pythie-pet-fresh-breath'],
    coords: {
      feline: { x: 16, y: 39, labelX: 6, labelY: 54, zoomX: 20, zoomY: 38, scale: 1.65 },
      canine: { x: 13, y: 37, labelX: 5, labelY: 52, zoomX: 18, zoomY: 36, scale: 1.65 },
    },
    productMeta: {
      'pythie-pet-fresh-breath': {
        roleBadge: 'Water-Additive Oral Biofilm Control',
        dosingPill: 'Daily in Drinking Water (5–15 drops per 100–400 ml) for 7 Days',
        indicationBadge: 'Halitosis, Gingivitis & Plaque Biofilm Suppression',
      },
    },
  },
  {
    id: 'dermal-coat',
    number: 4,
    shortLabel: '4. Dermal & Coat',
    name: 'Dermal & Coat Zone',
    anatomicalStructure: '3D Outer Epidermal Mesh & Dorsal Coat Barrier',
    protocolTitle: 'Mycotic Dermatitis, Wound Healing & Seborrhea',
    clinicalSummary:
      'Targeted 3-pillar dermatological suite covering mycoparasitic ringworm eradication, epidermal wound regeneration, and ceramide barrier restoration.',
    productIds: ['ecosin', 'dermasin', 'pythie-pet-ointment', 'bluecap-shampoo'],
    coords: {
      feline: { x: 54, y: 24, labelX: 55, labelY: 9, zoomX: 52, zoomY: 28, scale: 1.45 },
      canine: { x: 53, y: 24, labelX: 54, labelY: 9, zoomX: 52, zoomY: 28, scale: 1.45 },
    },
    subTabs: [
      {
        id: 'all',
        label: 'All Dermal Protocol (4)',
        productIds: ['ecosin', 'dermasin', 'pythie-pet-ointment', 'bluecap-shampoo'],
      },
      {
        id: 'antifungal',
        label: 'Antifungal / Mycoparasitic',
        productIds: ['ecosin'],
      },
      {
        id: 'wound',
        label: 'Wound & Tissue Regeneration',
        productIds: ['dermasin', 'pythie-pet-ointment'],
      },
      {
        id: 'seborrhea',
        label: 'Seborrhea & Coat Barrier',
        productIds: ['bluecap-shampoo'],
      },
    ],
    productMeta: {
      ecosin: {
        subGroup: 'Antifungal / Mycoparasitic',
        roleBadge: 'Antifungal & Mycoparasitic Bath/Spray',
        dosingPill: '1 Tab in 2L Lukewarm Water (34°C) • Apply 3x Weekly',
        indicationBadge: 'Dermatophytosis (Ringworm) & Malassezia Dermatitis',
      },
      dermasin: {
        subGroup: 'Wound & Tissue Regeneration',
        roleBadge: 'Epidermal Barrier & Eczema Oil',
        dosingPill: '1 tsp in 1L Bath or Direct Rub on Moist Skin (10 min)',
        indicationBadge: 'Atopic Dermatitis, Pruritus & Dry Flaky Skin Recovery',
      },
      'pythie-pet-ointment': {
        subGroup: 'Wound & Tissue Regeneration',
        roleBadge: 'Intensive Wound & Abscess Ointment',
        dosingPill: 'Apply Thin Layer to Cleansed Skin Several Times Daily',
        indicationBadge: 'Lacerations, Post-Surgical Wounds, Burns & Hot Spots',
      },
      'bluecap-shampoo': {
        subGroup: 'Seborrhea & Coat Barrier',
        roleBadge: 'Kerato-Seborrheic & Ceramide Shampoo',
        dosingPill: 'Bathe Every 4 Days (Leave Foam 5–10 min) • 24-Day Cycle',
        indicationBadge: 'Kerato-Seborrhea (100% Resolution) & Pruritic Dermatoses',
      },
    },
  },
  {
    id: 'gi-hepatic',
    number: 5,
    shortLabel: '5. GI & Hepatic',
    name: 'Gastrointestinal & Hepatic Zone',
    anatomicalStructure: '3D Illuminated Stomach, Intestinal Loops & Hepatic Lobes',
    protocolTitle: 'Viral Enteritis (Parvo / Panleukopenia / Corona) & Hepato-GI Recovery',
    clinicalSummary:
      'Complete 3-Step hospital & clinic pipeline: rapid 10-minute fecal antigen triage followed by antiviral hepatoprotection and gastric mucosal repair.',
    productIds: ['flexy-cpv', 'flexy-fpv', 'flexy-fcov', 'viusid', 'viusid-detox', 'carminal'],
    coords: {
      feline: { x: 52, y: 49, labelX: 52, labelY: 74, zoomX: 52, zoomY: 48, scale: 1.5 },
      canine: { x: 52, y: 48, labelX: 52, labelY: 74, zoomX: 52, zoomY: 48, scale: 1.5 },
    },
    subTabs: [
      {
        id: 'all',
        label: 'Full 3-Step Pipeline (6)',
        productIds: ['flexy-cpv', 'flexy-fpv', 'flexy-fcov', 'viusid', 'viusid-detox', 'carminal'],
      },
      {
        id: 'step1',
        label: 'Step 1: Point-of-Care Screen (3)',
        productIds: ['flexy-cpv', 'flexy-fpv', 'flexy-fcov'],
      },
      {
        id: 'step2',
        label: 'Step 2: Antiviral & Hepatoprotection (2)',
        productIds: ['viusid', 'viusid-detox'],
      },
      {
        id: 'step3',
        label: 'Step 3: GI Mucosal Restoration (1)',
        productIds: ['carminal'],
      },
    ],
    productMeta: {
      'flexy-cpv': {
        subGroup: 'Step 1 • Point-of-Care Screen',
        roleBadge: 'Step 1A • Canine Parvo Rapid Triage',
        dosingPill: 'Fecal Swab Cassette • 10-Minute Visual Readout',
        indicationBadge: 'Acute Hemorrhagic Diarrhea & Canine Parvovirus (CPV)',
      },
      'flexy-fpv': {
        subGroup: 'Step 1 • Point-of-Care Screen',
        roleBadge: 'Step 1B • Feline Panleukopenia Triage',
        dosingPill: 'Fecal Swab Cassette • 10-Minute Visual Readout',
        indicationBadge: 'Feline Panleukopenia (FPV) Emergency Screening',
      },
      'flexy-fcov': {
        subGroup: 'Step 1 • Point-of-Care Screen',
        roleBadge: 'Step 1C • Feline Coronavirus Triage',
        dosingPill: 'Fresh Feces Swab • 10-Minute Lateral Flow Readout',
        indicationBadge: 'Feline Enteric Coronavirus (FCoV) Shedding & Chronic Diarrhea',
      },
      viusid: {
        subGroup: 'Step 2 • Antiviral & Hepatoprotection',
        roleBadge: 'Step 2A • Antiviral & Hepatic Support',
        dosingPill: '1 ml / 5 kg BW • Twice Daily (BID)',
        indicationBadge: 'Viral Enteritis Survival, Interferon & Appetite Recovery',
      },
      'viusid-detox': {
        subGroup: 'Step 2 • Antiviral & Hepatoprotection',
        roleBadge: 'Step 2B • Hepatic Detox & 12-Strain Probiotic',
        dosingPill: '1 ml / 5 kg BW • Once/Twice Daily (10–14 Days)',
        indicationBadge: 'Post-Antibiotic Dysbiosis, Severe Diarrhea & Toxin Clearance',
      },
      carminal: {
        subGroup: 'Step 3 • GI Mucosal Restoration',
        roleBadge: 'Step 3 • Gastric & Intestinal Mucosal Repair',
        dosingPill: '1 ml / 5 kg BW • 2–3x Daily Before Feeding',
        indicationBadge: 'Vomiting, Gastritis, Acid Reflux & Mucosal Erosion Relief',
      },
    },
  },
  {
    id: 'renal-urinary',
    number: 6,
    shortLabel: '6. Renal & Urinary',
    name: 'Renal & Urinary Tract Zone',
    anatomicalStructure: '3D Illuminated Kidneys (Renal Cortex) & Urinary Bladder',
    protocolTitle: 'Urolithiasis Dissolution & Renal Support',
    clinicalSummary:
      'Non-surgical dissolution of struvite & calcium oxalate uroliths (-70% stone volume in 30 days) paired with renal toxin elimination.',
    productIds: ['renalof', 'viusid-detox'],
    coords: {
      feline: { x: 68, y: 43, labelX: 78, labelY: 22, zoomX: 64, zoomY: 44, scale: 1.55 },
      canine: { x: 67, y: 42, labelX: 78, labelY: 22, zoomX: 64, zoomY: 44, scale: 1.55 },
    },
    productMeta: {
      renalof: {
        roleBadge: 'Step 1 • Urolith Dissolution & Diuresis',
        dosingPill: '1 ml / 5 kg BW • Twice Daily (BID) for 30 Days',
        indicationBadge: 'Calcium Oxalate & Struvite Stones, Cystitis & Dysuria',
      },
      'viusid-detox': {
        roleBadge: 'Step 2 • Renal & Hepatic Toxin Clearance',
        dosingPill: '1 ml / 5 kg BW • Once/Twice Daily (10–14 Days)',
        indicationBadge: 'Renal Toxin Elimination & Post-Medication Nephroprotection',
      },
    },
  },
  {
    id: 'systemic-immune',
    number: 7,
    shortLabel: '7. Systemic & Zoonotic',
    name: 'Systemic / Zoonotic & Immune Node',
    anatomicalStructure: '3D Thoracic Vascular Core & Systemic Lymphatic Network',
    protocolTitle: 'Toxoplasma Screening & Systemic Immune Support',
    clinicalSummary:
      'Rapid 10-minute serological screening for Toxoplasma gondii antibodies followed by targeted systemic immunomodulation and respiratory-immune defense.',
    productIds: ['flexy-toxoplasma', 'viusid', 'asprib'],
    coords: {
      feline: { x: 36, y: 44, labelX: 25, labelY: 72, zoomX: 38, zoomY: 44, scale: 1.55 },
      canine: { x: 36, y: 43, labelX: 25, labelY: 72, zoomX: 38, zoomY: 44, scale: 1.55 },
    },
    productMeta: {
      'flexy-toxoplasma': {
        roleBadge: 'Step 1 • Rapid Zoonotic Antibody Triage',
        dosingPill: 'Serum / Whole Blood Cassette • 10-Minute Result',
        indicationBadge: 'Toxoplasma gondii Antibody Screen (100% Specificity)',
      },
      viusid: {
        roleBadge: 'Step 2 • Core Immunomodulation & Antiviral Support',
        dosingPill: '1 ml / 5 kg BW • Twice Daily (BID)',
        indicationBadge: 'Systemic Immune Deficiency, Vaccine Break & Recovery',
      },
      asprib: {
        roleBadge: 'Step 3 • Systemic Cardiorespiratory & Antioxidant Support',
        dosingPill: '1 ml / 5 kg BW • 2–3x Daily (7–10 Days)',
        indicationBadge: 'Systemic Viral Defense & Respiratory Mucosal Protection',
      },
    },
  },
];

export default function AnatomyExplorer({
  allProductsMap = {},
  onSelectProductFromAnatomy,
  onLaunchZoneProtocol,
  initialSpecies = 'feline',
  initialZoneId = 'ocular-nasal-respiratory',
  onStateChange,
}) {
  const [species, setSpecies] = useState(initialSpecies); // 'feline' | 'canine'
  const [activeZoneId, setActiveZoneId] = useState(initialZoneId);
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [isZoomedToOrgan, setIsZoomedToOrgan] = useState(true);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);

  const activeZone = useMemo(
    () => ANATOMICAL_ZONES.find((z) => z.id === activeZoneId) || ANATOMICAL_ZONES[0],
    [activeZoneId]
  );

  const handleSelectZone = (zoneId) => {
    setActiveZoneId(zoneId);
    setActiveSubTab('all');
    setIsZoomedToOrgan(true);
    if (onStateChange) {
      onStateChange({ species, zoneId });
    }
  };

  const handleSelectSpecies = (newSpecies) => {
    setSpecies(newSpecies);
    if (onStateChange) {
      onStateChange({ species: newSpecies, zoneId: activeZoneId });
    }
  };

  // Products to display in the right-hand panel based on activeZone & subTab
  const displayedProductIds = useMemo(() => {
    if (activeZone.subTabs && activeSubTab !== 'all') {
      const sub = activeZone.subTabs.find((t) => t.id === activeSubTab);
      if (sub) return sub.productIds;
    }
    return activeZone.productIds;
  }, [activeZone, activeSubTab]);

  const displayedProducts = useMemo(() => {
    return displayedProductIds.map((id) => allProductsMap[id]).filter(Boolean);
  }, [displayedProductIds, allProductsMap]);

  // 3D Stage interactive tilt on mouse / touch move
  const handleStagePointerMove = (e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const normX = (clientX - rect.left) / rect.width - 0.5;
    const normY = (clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: normY * -10,
      y: normX * 12,
    });
  };

  const handleStagePointerLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Compute 3D camera transform when zoomed into an organ vs full-body view
  const activeCoords = activeZone.coords[species] || activeZone.coords.feline;
  const cameraTransform = useMemo(() => {
    if (!isZoomedToOrgan) {
      return `perspective(1200px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) scale3d(1, 1, 1) translate3d(0px, 0px, 0px)`;
    }
    // Pan slightly toward the selected organ's coordinates
    const panX = (50 - activeCoords.zoomX) * 0.55;
    const panY = (50 - activeCoords.zoomY) * 0.55;
    const scale = activeCoords.scale || 1.45;
    return `perspective(1200px) rotateX(${(tilt.x * 0.6).toFixed(2)}deg) rotateY(${(tilt.y * 0.6).toFixed(2)}deg) scale3d(${scale}, ${scale}, 1) translate3d(${panX.toFixed(1)}%, ${panY.toFixed(1)}%, 20px)`;
  }, [isZoomedToOrgan, tilt, activeCoords]);

  const getCompanyBrandStyle = (companyId) => {
    switch (companyId) {
      case 'catalysis':
        return { bg: '#0B431E', lightBg: '#E8F4EC', text: '#0B431E', border: '#10B981' };
      case 'bard':
        return { bg: '#D97706', lightBg: '#FEF3C7', text: '#92400E', border: '#F59E0B' };
      case 'vitasignia':
        return { bg: '#2563EB', lightBg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' };
      case 'ringbio':
        return { bg: '#DB2777', lightBg: '#FCE7F3', text: '#9D174D', border: '#EC4899' };
      default:
        return { bg: '#0B431E', lightBg: '#E8F4EC', text: '#0B431E', border: '#10B981' };
    }
  };

  return (
    <section className="w-full rounded-3xl overflow-hidden border border-slate-800/80 shadow-[0_25px_60px_-15px_rgba(11,17,32,0.45)] bg-[#0B1120] text-white mb-10">
      {/* ===================================================================== */}
      {/* TOP COMMAND HEADER BAR                                                */}
      {/* ===================================================================== */}
      <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#0B1120] via-[#0F172A] to-[#0B1120] border-b border-teal-500/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
            <Crosshair className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                3D Holographic Biometrics
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                • Strictly Locked to 16 Validated Portfolio Products
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-black tracking-tight text-white mt-0.5">
              3D Anatomical Clinical Protocol Explorer
            </h2>
          </div>
        </div>

        {/* Species 3D Model Switcher + Camera Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center gap-1 shadow-inner">
            <button
              onClick={() => handleSelectSpecies('feline')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                species === 'feline'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="text-base leading-none">🐈</span>
              <span>3D Feline Anatomy</span>
            </button>
            <button
              onClick={() => handleSelectSpecies('canine')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                species === 'canine'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="text-base leading-none">🐕</span>
              <span>3D Canine Anatomy</span>
            </button>
          </div>

          <button
            onClick={() => setIsZoomedToOrgan((prev) => !prev)}
            className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isZoomedToOrgan
                ? 'bg-teal-950/80 border-teal-400/50 text-teal-300 hover:bg-teal-900/80'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Toggle 3D Organ Zoom vs Full Body Overview"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isZoomedToOrgan ? 'Reset Full Body' : 'Zoom to Organ'}</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MAIN SPLIT STAGE: LEFT 50% (3D X-RAY BODY) | RIGHT 50% (PROTOCOL)     */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        
        {/* =================================================================== */}
        {/* LEFT 50% (6 COLS): 3D HOLOGRAPHIC / MEDICAL X-RAY ANIMAL STAGE      */}
        {/* =================================================================== */}
        <div
          ref={stageRef}
          onMouseMove={handleStagePointerMove}
          onMouseLeave={handleStagePointerLeave}
          onTouchMove={handleStagePointerMove}
          onTouchEnd={handleStagePointerLeave}
          className="lg:col-span-6 relative bg-[#0B1120] overflow-hidden flex flex-col justify-between p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-800/90 select-none min-h-[480px] sm:min-h-[580px]"
        >
          {/* Radial Medical Lighting & Holographic Scan Backdrop */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, rgba(20, 184, 166, 0.16) 0%, rgba(14, 116, 144, 0.08) 38%, rgba(11, 17, 32, 0.98) 78%)',
            }}
          />

          {/* 3D Perspective Floor Grid */}
          <div
            className="absolute inset-x-0 bottom-0 h-56 pointer-events-none opacity-45"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(20,184,166,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,184,166,0.22) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
              transform: 'perspective(500px) rotateX(68deg) translateY(40px) scale(1.35)',
              transformOrigin: 'bottom center',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)',
            }}
          />

          {/* Holographic Pedestal Rings */}
          <div
            className="absolute left-1/2 bottom-14 -translate-x-1/2 w-[78%] h-16 rounded-full border border-teal-400/30 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(20,184,166,0.25) 0%, rgba(20,184,166,0) 75%)',
              transform: 'rotateX(75deg)',
              boxShadow: '0 0 40px rgba(20, 184, 166, 0.35)',
            }}
          />

          {/* Top-Left HUD Telemetry Overlay */}
          <div className="relative z-20 flex items-center justify-between gap-2 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 border border-teal-500/30 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span className="text-[11px] font-mono font-bold text-teal-300 uppercase tracking-wider">
                {species === 'feline' ? 'FELIS CATUS • 3D X-RAY' : 'CANIS LUPUS • 3D X-RAY'}
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/85 border border-slate-700/80 text-[11px] font-mono text-slate-300 backdrop-blur-md">
              <span>TARGET:</span>
              <span className="text-teal-300 font-bold">ZONE 0{activeZone.number}</span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 3D INTERACTIVE PERSPECTIVE ANIMAL STAGE                           */}
          {/* ================================================================= */}
          <div className="relative z-10 flex-1 flex items-center justify-center my-2">
            <div
              className="relative w-full max-w-[640px] aspect-[800/520] transition-transform duration-500 ease-out"
              style={{
                transform: cameraTransform,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* 3D X-RAY TRANSLUCENT SVG ANATOMY (FELINE & CANINE) */}
              <svg
                viewBox="0 0 800 520"
                className="w-full h-full overflow-visible drop-shadow-[0_15px_35px_rgba(20,184,166,0.22)]"
              >
                <defs>
                  {/* 3D Hologram Body Fill Gradient */}
                  <linearGradient id="xrayBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.22" />
                    <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity="0.26" />
                  </linearGradient>

                  {/* Outer Rim Glow */}
                  <linearGradient id="xrayRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.85" />
                  </linearGradient>

                  {/* Active Organ Cyan Illumination */}
                  <radialGradient id="activeOrganGlow" cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.95" />
                    <stop offset="45%" stopColor="#14B8A6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0D9488" stopOpacity="0.15" />
                  </radialGradient>

                  {/* Dormant Organ Subtle Shader */}
                  <radialGradient id="dormantOrganGlow" cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#0369A1" stopOpacity="0.1" />
                  </radialGradient>

                  {/* Glowing Filter for Active Organ */}
                  <filter id="cyanGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  {/* Dorsal Epidermal Mesh Pattern for Zone 4 */}
                  <pattern id="dermalHexMesh" width="18" height="18" patternUnits="userSpaceOnUse">
                    <path
                      d="M 9 0 L 18 5 L 18 13 L 9 18 L 0 13 L 0 5 Z"
                      fill="none"
                      stroke="#14B8A6"
                      strokeWidth="0.9"
                      strokeOpacity="0.65"
                    />
                  </pattern>
                </defs>

                {/* =========================================================== */}
                {/* SPECIES 1: 3D FELINE ANATOMY SILHOUETTE & SKELETAL MESH     */}
                {/* =========================================================== */}
                {species === 'feline' ? (
                  <g className="transition-opacity duration-500">
                    {/* Outer 3D Translucent Feline Body Contour */}
                    <path
                      d="M 118 192
                         C 115 170, 128 148, 148 138
                         L 172 90 L 195 124
                         L 212 84 L 228 132
                         C 258 140, 295 162, 345 162
                         C 425 162, 520 145, 595 166
                         C 645 180, 672 212, 684 238
                         C 715 215, 748 165, 762 125
                         C 768 108, 784 114, 778 135
                         C 764 185, 730 238, 688 265
                         C 685 312, 665 365, 655 425
                         L 632 425 L 638 345
                         C 620 355, 608 395, 602 425
                         L 578 425 L 588 320
                         C 520 332, 425 335, 355 318
                         L 335 425 L 310 425 L 320 328
                         L 285 425 L 260 425 L 278 308
                         C 242 292, 212 265, 198 238
                         C 165 242, 132 232, 118 210 Z"
                      fill="url(#xrayBodyGrad)"
                      stroke="url(#xrayRimGrad)"
                      strokeWidth="2.5"
                    />

                    {/* Internal 3D Skeletal Spine, Ribcage & Skull Wireframe */}
                    <g stroke="#38BDF8" strokeOpacity="0.32" fill="none" strokeLinecap="round">
                      {/* Vertebral Column */}
                      <path
                        d="M 225 165 Q 320 185, 450 175 T 675 248"
                        strokeWidth="4"
                        strokeDasharray="8 5"
                      />
                      {/* Ribcage Arcs */}
                      <path d="M 325 182 Q 318 245, 342 292" strokeWidth="2.2" />
                      <path d="M 348 182 Q 342 250, 366 298" strokeWidth="2.2" />
                      <path d="M 372 180 Q 368 252, 390 300" strokeWidth="2.2" />
                      <path d="M 396 178 Q 392 250, 412 296" strokeWidth="2.2" />
                      <path d="M 420 177 Q 418 244, 434 288" strokeWidth="2" />
                      <path d="M 442 176 Q 440 236, 454 276" strokeWidth="1.8" />
                      {/* Forelimb & Hindlimb Bone Axes */}
                      <path d="M 305 220 L 290 295 L 312 415" strokeWidth="2.5" />
                      <path d="M 615 215 L 635 310 L 642 415" strokeWidth="2.5" />
                    </g>
                  </g>
                ) : (
                  /* =========================================================== */
                  /* SPECIES 2: 3D CANINE ANATOMY SILHOUETTE & SKELETAL MESH     */
                  /* =========================================================== */
                  <g className="transition-opacity duration-500">
                    {/* Outer 3D Translucent Canine Body Contour */}
                    <path
                      d="M 88 182
                         C 88 164, 118 158, 145 154
                         C 158 132, 178 112, 204 108
                         L 228 78 L 248 122
                         C 278 135, 315 158, 360 162
                         C 445 166, 535 155, 610 172
                         C 655 182, 680 208, 692 234
                         C 722 208, 752 168, 768 135
                         C 775 118, 790 128, 782 148
                         C 765 192, 735 232, 695 258
                         C 692 312, 672 368, 662 430
                         L 636 430 L 644 345
                         C 625 356, 612 396, 606 430
                         L 582 430 L 594 316
                         C 522 332, 435 340, 355 322
                         L 336 430 L 310 430 L 320 326
                         L 286 430 L 260 430 L 278 302
                         C 238 286, 210 255, 195 224
                         C 155 228, 108 220, 92 202 Z"
                      fill="url(#xrayBodyGrad)"
                      stroke="url(#xrayRimGrad)"
                      strokeWidth="2.5"
                    />

                    {/* Internal 3D Skeletal Spine, Ribcage & Skull Wireframe */}
                    <g stroke="#38BDF8" strokeOpacity="0.32" fill="none" strokeLinecap="round">
                      {/* Vertebral Column */}
                      <path
                        d="M 225 148 Q 330 182, 460 176 T 682 242"
                        strokeWidth="4.5"
                        strokeDasharray="9 5"
                      />
                      {/* Ribcage Arcs */}
                      <path d="M 325 180 Q 318 250, 344 302" strokeWidth="2.4" />
                      <path d="M 350 180 Q 344 256, 370 308" strokeWidth="2.4" />
                      <path d="M 375 178 Q 370 258, 395 310" strokeWidth="2.4" />
                      <path d="M 400 177 Q 396 254, 418 304" strokeWidth="2.2" />
                      <path d="M 425 176 Q 422 248, 440 294" strokeWidth="2" />
                      <path d="M 448 176 Q 445 240, 460 280" strokeWidth="1.8" />
                      {/* Forelimb & Hindlimb Bone Axes */}
                      <path d="M 302 215 L 288 295 L 312 420" strokeWidth="2.8" />
                      <path d="M 622 210 L 642 310 L 648 420" strokeWidth="2.8" />
                    </g>
                  </g>
                )}

                {/* =========================================================== */}
                {/* INTERNAL 3D ORGAN MESHES (ILLUMINATED BY ACTIVE ZONE)       */}
                {/* =========================================================== */}

                {/* ZONE 4: DERMAL & COAT EPIDERMAL MESH OVERLAY */}
                <g
                  className="transition-all duration-500 cursor-pointer"
                  onClick={() => handleSelectZone('dermal-coat')}
                  opacity={activeZoneId === 'dermal-coat' ? 1 : 0.25}
                  filter={activeZoneId === 'dermal-coat' ? 'url(#cyanGlowFilter)' : 'none'}
                >
                  <path
                    d="M 295 162 C 395 150, 525 148, 625 174 C 605 205, 425 205, 295 185 Z"
                    fill="url(#dermalHexMesh)"
                    stroke="#14B8A6"
                    strokeWidth={activeZoneId === 'dermal-coat' ? '2.5' : '1'}
                  />
                  <path
                    d="M 285 156 C 400 142, 535 142, 638 170"
                    fill="none"
                    stroke="#5EEAD4"
                    strokeWidth={activeZoneId === 'dermal-coat' ? '3.5' : '1.2'}
                    strokeDasharray="6 4"
                  />
                </g>

                {/* ZONE 1: OCULAR-NASAL SINUS, TRACHEA & PULMONARY LOBES */}
                <g
                  className="transition-all duration-500 cursor-pointer"
                  onClick={() => handleSelectZone('ocular-nasal-respiratory')}
                  opacity={activeZoneId === 'ocular-nasal-respiratory' ? 1 : 0.32}
                  filter={activeZoneId === 'ocular-nasal-respiratory' ? 'url(#cyanGlowFilter)' : 'none'}
                >
                  {/* Cranial Sinus & Nasal Passages */}
                  <ellipse
                    cx={species === 'feline' ? '155' : '132'}
                    cy={species === 'feline' ? '168' : '168'}
                    rx={species === 'feline' ? '26' : '34'}
                    ry="14"
                    fill="url(#activeOrganGlow)"
                    stroke="#5EEAD4"
                    strokeWidth="1.8"
                  />
                  {/* Trachea Conduit */}
                  <path
                    d={
                      species === 'feline'
                        ? 'M 180 176 Q 235 205, 315 225'
                        : 'M 165 175 Q 230 205, 315 225'
                    }
                    fill="none"
                    stroke="#2DD4BF"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray="3 3"
                  />
                  {/* Bronchial Tree & Lungs */}
                  <path
                    d="M 310 202 C 345 188, 405 195, 418 232 C 428 265, 385 288, 335 276 C 305 268, 295 225, 310 202 Z"
                    fill="url(#activeOrganGlow)"
                    stroke="#5EEAD4"
                    strokeWidth="2"
                  />
                </g>

                {/* ZONE 2: OTIC / EAR PINNA & TYMPANIC CANAL */}
                <g
                  className="transition-all duration-500 cursor-pointer"
                  onClick={() => handleSelectZone('otic-ear')}
                  opacity={activeZoneId === 'otic-ear' ? 1 : 0.32}
                  filter={activeZoneId === 'otic-ear' ? 'url(#cyanGlowFilter)' : 'none'}
                >
                  <path
                    d={
                      species === 'feline'
                        ? 'M 176 95 L 194 128 L 212 88 L 224 136 C 212 152, 190 152, 176 135 Z'
                        : 'M 205 106 L 228 80 L 246 125 C 235 148, 210 148, 200 128 Z'
                    }
                    fill="url(#activeOrganGlow)"
                    stroke="#5EEAD4"
                    strokeWidth="2.2"
                  />
                  <circle
                    cx={species === 'feline' ? '202' : '222'}
                    cy={species === 'feline' ? '136' : '128'}
                    r="11"
                    fill="#14B8A6"
                    stroke="#CCFBF1"
                    strokeWidth="1.5"
                  />
                </g>

                {/* ZONE 3: ORAL & DENTAL MAXILLA / MANDIBLE ARCADE */}
                <g
                  className="transition-all duration-500 cursor-pointer"
                  onClick={() => handleSelectZone('oral-dental')}
                  opacity={activeZoneId === 'oral-dental' ? 1 : 0.32}
                  filter={activeZoneId === 'oral-dental' ? 'url(#cyanGlowFilter)' : 'none'}
                >
                  <path
                    d={
                      species === 'feline'
                        ? 'M 122 195 Q 152 192, 182 204 Q 155 224, 124 210 Z'
                        : 'M 94 188 Q 138 184, 178 198 Q 145 218, 96 204 Z'
                    }
                    fill="url(#activeOrganGlow)"
                    stroke="#5EEAD4"
                    strokeWidth="2"
                  />
                  {/* Dental Arcade Teeth Highlights */}
                  <path
                    d={
                      species === 'feline'
                        ? 'M 128 201 L 174 203'
                        : 'M 102 194 L 168 198'
                    }
                    stroke="#F0FDFA"
                    strokeWidth="3.5"
                    strokeDasharray="4 3"
                  />
                </g>

                {/* ZONE 7: SYSTEMIC / ZOONOTIC & IMMUNE NODE (THORACIC VASCULAR CORE) */}
                <g
                  className="transition-all duration-500 cursor-pointer"
                  onClick={() => handleSelectZone('systemic-immune')}
                  opacity={activeZoneId === 'systemic-immune' ? 1 : 0.35}
                  filter={activeZoneId === 'systemic-immune' ? 'url(#cyanGlowFilter)' : 'none'}
                >
                  {/* Heart & Thoracic Vascular Core */}
                  <circle
                    cx="292"
                    cy="248"
                    r="22"
                    fill="url(#activeOrganGlow)"
                    stroke="#5EEAD4"
                    strokeWidth="2.2"
                  />
                  {/* Systemic Vascular & Lymphatic Conduit */}
                  <path
                    d="M 215 190 Q 260 235, 292 248 T 420 230 T 565 235"
                    fill="none"
                    stroke="#2DD4BF"
                    strokeWidth="2.8"
                    strokeDasharray="5 3"
                  />
                  <circle cx="292" cy="248" r="7" fill="#CCFBF1" />
                </g>

                {/* ZONE 5: GASTROINTESTINAL & HEPATIC ZONE (LIVER, STOMACH, INTESTINES) */}
                <g
                  className="transition-all duration-500 cursor-pointer"
                  onClick={() => handleSelectZone('gi-hepatic')}
                  opacity={activeZoneId === 'gi-hepatic' ? 1 : 0.32}
                  filter={activeZoneId === 'gi-hepatic' ? 'url(#cyanGlowFilter)' : 'none'}
                >
                  {/* Hepatic Lobes (Liver) */}
                  <path
                    d="M 412 208 C 432 202, 452 222, 446 262 C 440 288, 415 294, 405 270 Z"
                    fill="url(#activeOrganGlow)"
                    stroke="#5EEAD4"
                    strokeWidth="2"
                  />
                  {/* Stomach & Intestinal Loops */}
                  <path
                    d="M 448 228 C 488 215, 538 230, 545 268 C 552 302, 495 316, 456 296 C 435 285, 435 245, 448 228 Z"
                    fill="url(#activeOrganGlow)"
                    stroke="#5EEAD4"
                    strokeWidth="2"
                  />
                  {/* Intestinal Coils */}
                  <path
                    d="M 466 254 Q 495 242, 515 262 T 478 282 T 522 292"
                    fill="none"
                    stroke="#CCFBF1"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </g>

                {/* ZONE 6: RENAL & URINARY TRACT ZONE (KIDNEYS, URETERS & BLADDER) */}
                <g
                  className="transition-all duration-500 cursor-pointer"
                  onClick={() => handleSelectZone('renal-urinary')}
                  opacity={activeZoneId === 'renal-urinary' ? 1 : 0.32}
                  filter={activeZoneId === 'renal-urinary' ? 'url(#cyanGlowFilter)' : 'none'}
                >
                  {/* Left & Right Kidneys */}
                  <ellipse
                    cx="535"
                    cy="210"
                    rx="20"
                    ry="13"
                    fill="url(#activeOrganGlow)"
                    stroke="#5EEAD4"
                    strokeWidth="2"
                  />
                  <ellipse
                    cx="562"
                    cy="218"
                    rx="18"
                    ry="12"
                    fill="url(#activeOrganGlow)"
                    stroke="#5EEAD4"
                    strokeWidth="2"
                  />
                  {/* Ureter Conduit */}
                  <path
                    d="M 548 222 Q 585 245, 612 268"
                    fill="none"
                    stroke="#5EEAD4"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />
                  {/* Urinary Bladder */}
                  <ellipse
                    cx="624"
                    cy="274"
                    rx="22"
                    ry="16"
                    fill="url(#activeOrganGlow)"
                    stroke="#5EEAD4"
                    strokeWidth="2.2"
                  />
                </g>

                {/* =========================================================== */}
                {/* GLASSMORPHIC CALLOUT LINES FROM ORGANS TO BEACONS           */}
                {/* =========================================================== */}
                {ANATOMICAL_ZONES.map((zone) => {
                  const c = zone.coords[species] || zone.coords.feline;
                  const isActive = zone.id === activeZoneId;
                  const x1 = (c.x / 100) * 800;
                  const y1 = (c.y / 100) * 520;
                  const x2 = (c.labelX / 100) * 800;
                  const y2 = (c.labelY / 100) * 520;
                  return (
                    <g key={zone.id} className="pointer-events-none">
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isActive ? '#2DD4BF' : '#64748B'}
                        strokeWidth={isActive ? '2' : '1'}
                        strokeDasharray={isActive ? 'none' : '3 3'}
                        opacity={isActive ? 0.95 : 0.45}
                      />
                      <circle
                        cx={x2}
                        cy={y2}
                        r={isActive ? '4' : '2.5'}
                        fill={isActive ? '#2DD4BF' : '#94A3B8'}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* ============================================================= */}
              {/* 7 FLOATING 3D ANATOMICAL HOTSPOT BEACON PINS                  */}
              {/* ============================================================= */}
              {ANATOMICAL_ZONES.map((zone) => {
                const c = zone.coords[species] || zone.coords.feline;
                const isActive = zone.id === activeZoneId;
                return (
                  <React.Fragment key={zone.id}>
                    {/* Organ Pin Beacon */}
                    <button
                      onClick={() => handleSelectZone(zone.id)}
                      style={{ left: `${c.x}%`, top: `${c.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer focus:outline-none transition-transform duration-300 ${
                        isActive ? 'scale-125 z-40' : 'hover:scale-110'
                      }`}
                      title={`${zone.number}. ${zone.name} (${zone.productIds.length} Products)`}
                    >
                      {/* Pulsing Radar Ring */}
                      <span
                        className={`absolute -inset-2 rounded-full animate-ping ${
                          isActive ? 'bg-teal-400/75' : 'bg-cyan-400/35 group-hover:bg-teal-400/60'
                        }`}
                      />
                      {/* Beacon Core */}
                      <span
                        className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all shadow-lg ${
                          isActive
                            ? 'bg-teal-400 text-slate-950 border-white shadow-[0_0_20px_rgba(20,184,166,0.95)]'
                            : 'bg-slate-900/90 text-teal-300 border-teal-400/70 hover:bg-teal-500 hover:text-slate-950'
                        }`}
                      >
                        {zone.number}
                      </span>
                    </button>

                    {/* Glassmorphic Callout Pill */}
                    <button
                      onClick={() => handleSelectZone(zone.id)}
                      style={{ left: `${c.labelX}%`, top: `${c.labelY}%` }}
                      className={`hidden sm:flex absolute -translate-x-1/2 -translate-y-1/2 z-20 items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[10px] font-extrabold whitespace-nowrap backdrop-blur-md transition-all cursor-pointer ${
                        isActive
                          ? 'bg-teal-500/25 border-teal-300 text-white shadow-[0_0_20px_rgba(20,184,166,0.4)] scale-105 z-30'
                          : 'bg-slate-900/75 border-slate-700/80 text-slate-300 hover:border-teal-400/60 hover:text-white opacity-80 hover:opacity-100'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-teal-400/20 border border-teal-400/50 text-teal-300 flex items-center justify-center text-[9px] font-mono">
                        {zone.number}
                      </span>
                      <span>{zone.shortLabel.replace(/^\d+\.\s*/, '')}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-teal-200">
                        {zone.productIds.length}
                      </span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Bottom 7-Zone Quick-Selector Strip (Tablet Thumb Ergonomics) */}
          <div className="relative z-20 pt-2 border-t border-slate-800/80">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Tap Any 3D Anatomical Hotspot or Select Zone Below:</span>
              <span className="text-teal-400">7 Validated Clinical Zones</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {ANATOMICAL_ZONES.map((zone) => {
                const isActive = zone.id === activeZoneId;
                return (
                  <button
                    key={zone.id}
                    onClick={() => handleSelectZone(zone.id)}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 border ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 border-teal-300 shadow-[0_0_16px_rgba(20,184,166,0.45)]'
                        : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:border-teal-500/50 hover:text-white'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center ${
                        isActive ? 'bg-slate-950 text-teal-300' : 'bg-teal-500/20 text-teal-300'
                      }`}
                    >
                      {zone.number}
                    </span>
                    <span>{zone.shortLabel.replace(/^\d+\.\s*/, '')}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT 50% (6 COLS): VISUAL PROTOCOL CARDS & 1-TAP SLIDE NAVIGATION  */}
        {/* =================================================================== */}
        <div className="lg:col-span-6 bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Active Anatomical Zone Protocol Header Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm mb-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-[220px]">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-teal-500/15 text-teal-800 border border-teal-500/30">
                      Zone 0{activeZone.number} • {activeZone.name}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-teal-600" />
                      <span>{activeZone.anatomicalStructure}</span>
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-[#0B431E] tracking-tight">
                    {activeZone.protocolTitle}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                    {activeZone.clinicalSummary}
                  </p>
                </div>

                {/* 1-Tap Launch Entire Zone Protocol Deck */}
                <button
                  onClick={() => onLaunchZoneProtocol && onLaunchZoneProtocol(activeZone, species)}
                  className="min-h-[44px] px-4 py-2.5 rounded-2xl ui-3d-btn-primary text-xs font-extrabold flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-md"
                  title="Launch sequential presentation for all products in this anatomical protocol"
                >
                  <Play className="w-4 h-4 fill-current text-amber-300" />
                  <span>Launch Protocol ({activeZone.productIds.length})</span>
                </button>
              </div>

              {/* Zone Sub-Tabs (For Zone 4 Dermal Sub-Tabs & Zone 5 3-Step Pipeline) */}
              {activeZone.subTabs && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {activeZone.subTabs.map((tab) => {
                    const isSubActive = activeSubTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={`min-h-[36px] px-3 py-1.5 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                          isSubActive
                            ? 'bg-[#0B431E] text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* =============================================================== */}
            {/* MAPPED PRODUCT PROTOCOL CARDS (CLICK TO OPEN FULL SLIDE DECK)   */}
            {/* =============================================================== */}
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 no-scrollbar">
              {displayedProducts.map((product, idx) => {
                const meta = activeZone.productMeta?.[product.id] || {};
                const brandStyle = getCompanyBrandStyle(product.companyId);
                const clinicalInfo = clinicalDatabase[product.id];
                const primaryIndication =
                  meta.indicationBadge ||
                  product.keyIndications?.[0] ||
                  product.headline;
                const dosingText = meta.dosingPill || product.dosingProtocol;

                return (
                  <div
                    key={product.id}
                    onClick={() =>
                      onSelectProductFromAnatomy &&
                      onSelectProductFromAnatomy(product, activeZone, species)
                    }
                    className={`group relative rounded-2xl bg-white border transition-all duration-200 p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 ${
                      meta.highlightBid
                        ? 'border-blue-400/80 ring-2 ring-blue-500/15'
                        : 'border-slate-200/90 hover:border-[#0B431E]/50'
                    }`}
                  >
                    {/* Packshot Studio Thumbnail */}
                    <div className="relative w-full sm:w-36 h-28 sm:h-24 rounded-xl bg-slate-100 border border-slate-200/70 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {product.slides && product.slides.length > 0 ? (
                        <img
                          src={product.slides[0]}
                          alt={product.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold">No Slide</span>
                      )}

                      {/* Slide Count Pill */}
                      <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md bg-slate-900/85 text-white text-[9px] font-mono font-bold backdrop-blur-sm">
                        {product.slides?.length || 0} Slides
                      </span>

                      {/* Step Number Badge */}
                      <span className="absolute top-1.5 left-1.5 w-6 h-6 rounded-lg bg-[#0B431E] text-white text-[11px] font-black flex items-center justify-center shadow">
                        {idx + 1}
                      </span>
                    </div>

                    {/* Product Clinical Protocol Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        {/* Principal Partner Badge + Role Badge */}
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow-xs"
                            style={{ backgroundColor: brandStyle.bg }}
                          >
                            {product.company}
                          </span>

                          {meta.roleBadge && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                              {meta.roleBadge}
                            </span>
                          )}

                          {product.isTopTier && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                              <span>Core Focus</span>
                            </span>
                          )}
                        </div>

                        {/* Product Name & Open Slide Deck CTA */}
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-[#0B431E] transition-colors truncate">
                            {product.name}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#0B431E] group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                            <span>Open Slides</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>

                        {/* Key Indication Badge */}
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E8F4EC] border border-[#0B431E]/15 text-[#0B431E] text-[11px] font-bold leading-snug">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0B431E] flex-shrink-0" />
                            <span className="line-clamp-1">{primaryIndication}</span>
                          </span>
                        </div>
                      </div>

                      {/* Dosing Frequency Pill (JetBrains Mono) */}
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold ${
                            meta.highlightBid
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-900 text-teal-300'
                          }`}
                        >
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span>{dosingText}</span>
                        </span>

                        {clinicalInfo?.clinicalReferences?.[0]?.metric && (
                          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {clinicalInfo.clinicalReferences[0].metric}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Instruction Bar */}
          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2 text-[11px] text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0B431E]" />
              <span>Click any product card to open its full e-detailing slide deck</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              16/16 Validated Products
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
