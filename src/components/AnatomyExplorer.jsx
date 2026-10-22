import React, { useState, useMemo } from 'react';
import { clinicalDatabase } from '../data/clinicalData.js';
import {
  Activity,
  Sparkles,
  Play,
  ArrowRight,
  Clock,
  Crosshair,
  CheckCircle2,
  Stethoscope,
  Star,
  BarChart3,
  FileText,
  ChevronRight,
  Layers,
} from 'lucide-react';

/**
 * STRICT 16-PRODUCT ROSTER ENFORCEMENT
 * Every anatomical zone and embedded call flow is strictly bound ONLY to the 16 products in catalog.json:
 * - Catalysis (6): viusid, viusid-detox, carminal, renalof, asprib, bluecap-shampoo
 * - B.A.R.D (5): ecosin, dermasin, pythie-pet-ointment, pythie-pet-ear-cleaner, pythie-pet-fresh-breath
 * - Vitasignia (1): virulys (Strictly enforce: Twice daily / BID recommended protocol for URI)
 * - Ringbio (4): flexy-cpv, flexy-fpv, flexy-fcov, flexy-toxoplasma
 *
 * SVG Coordinate System: viewBox="72 52 726 392" (Tightly cropped so the 3D animal fills 95% of the stage!)
 * Pin % conversion: pctX = ((svgX - 72) / 726) * 100, pctY = ((svgY - 52) / 392) * 100
 */

export const ANATOMICAL_ZONES = [
  {
    id: 'ocular-nasal-respiratory',
    number: 1,
    shortLabel: '1. Ocular-Nasal & URI',
    name: 'Ocular-Nasal & Upper Respiratory Zone',
    anatomicalStructure: '3D Cranial Sinus, Nasal Turbinates, Trachea & Bronchial Tree',
    protocolTitle: 'Feline URI & Respiratory Management',
    clinicalSummary:
      'Targeted L-Lysine viral replication blockade (strictly Twice Daily / BID protocol) paired with natural bronchial secretolysis and systemic antiviral immune activation.',
    productIds: ['virulys', 'asprib', 'viusid'],
    highlightedOrgans: ['ocular-nasal-respiratory'],
    linkedFlowIds: ['feline-uri-protocol', 'canine-respiratory-distemper'],
    coords: {
      feline: { x: 13.5, y: 29.5, labelX: 14, labelY: 8, svgX: 170, svgY: 168 },
      canine: { x: 11.5, y: 28.0, labelX: 14, labelY: 8, svgX: 155, svgY: 162 },
    },
    clinicalMetrics: [
      {
        value: 'Multimodal',
        label: 'Multimodal Support',
        sub: 'Antiviral replication block, airway secretolysis & mucosal immune defense',
        percent: 98,
        color: '#3B82F6',
      },
      {
        value: 'BID (2x/Day)',
        label: 'Mandatory URI Dosing',
        sub: 'Sustained 12-hour tear & mucosal coverage',
        percent: 100,
        color: '#14B8A6',
      },
      {
        value: '+61% Survival',
        label: 'Respiratory Viral Recovery',
        sub: 'Accelerated clinical resolution (-14.3 days)',
        percent: 88,
        color: '#10B981',
      },
    ],
    targetIndications: [
      'Feline Herpesvirus-1 (FHV-1)',
      'Conjunctivitis & Ocular Discharge',
      'Infectious Tracheobronchitis',
      'Severe Rhinitis & Sneezing',
    ],
    mechanismFlow:
      'Step 1 (Virulys BID) competitively antagonizes viral arginine uptake in ocular-nasal mucosa → Step 2 (Asprib) clears mucopurulent bronchial exudate via eucalyptus/mint secretolysis → Step 3 (Viusid) elevates endogenous interferon & T-cell immunity.',
    productMeta: {
      virulys: {
        roleBadge: 'Step 1 • Direct FHV-1 Replication Block',
        dosingPill: 'TWICE DAILY (BID) • Cats: 1–2 ml BID | Kittens: 0.5–1 ml BID',
        indicationBadge: 'Feline Herpesvirus (FHV-1), Conjunctivitis & Ocular-Nasal Discharge',
        highlightBid: true,
      },
      asprib: {
        roleBadge: 'Step 2 • Upper & Lower Airway Clearance',
        dosingPill: '1 ml per 5 kg BW • Every 8–12 Hours (7–10 Days)',
        indicationBadge: 'Bronchial Secretolysis, Cough Relief & Mucosal Antisepsis',
      },
      viusid: {
        roleBadge: 'Step 3 • Systemic Antiviral & Interferon Boost',
        dosingPill: '1 ml per 5 kg BW • Every 12 Hours (BID)',
        indicationBadge: 'Glycyrrhizinic Acid Antiviral Defense & Immune Recovery',
      },
    },
  },
  {
    id: 'otic-ear',
    number: 2,
    shortLabel: '2. Otic / Ear Canal',
    name: 'Otic / Ear Zone',
    anatomicalStructure: '3D Auricular Pinna, Vertical/Horizontal Canal & Tympanic Bulla',
    protocolTitle: 'Otic Hygiene & Otitis Externa Care',
    clinicalSummary:
      'Enzymatic mycoparasitic biocontrol (Pythium oligandrum) and non-irritating ceruminolytic cleansing of the external auditory meatus.',
    productIds: ['pythie-pet-ear-cleaner'],
    highlightedOrgans: ['otic-ear'],
    linkedFlowIds: ['dermatology-protocol'],
    coords: {
      feline: { x: 19.0, y: 15.5, labelX: 34, labelY: 7, svgX: 210, svgY: 112 },
      canine: { x: 19.8, y: 14.5, labelX: 34, labelY: 7, svgX: 216, svgY: 109 },
    },
    clinicalMetrics: [
      {
        value: 'Zero Sting',
        label: 'Non-Ototoxic Formula',
        sub: 'Physiological pH safe for sensitive ear canals',
        percent: 100,
        color: '#F59E0B',
      },
      {
        value: 'Bio-Enzyme',
        label: 'Pythium oligandrum',
        sub: 'Targets Malassezia pachydermatis & biofilm',
        percent: 92,
        color: '#14B8A6',
      },
      {
        value: '3x / Week',
        label: 'Cerumen & Odor Control',
        sub: 'Dissolves waxy exudate & prevents recurrence',
        percent: 85,
        color: '#10B981',
      },
    ],
    targetIndications: [
      'Malassezia Otitis Externa',
      'Excessive Cerumen & Waxy Debris',
      'Auricular Pruritus & Head Shaking',
      'Foul Otic Odor & Biofilm',
    ],
    mechanismFlow:
      'Instill 3–5 drops into the external auditory canal → Massage base of ear cartilage for 60 seconds to emulsify cerumen → Pythium oligandrum enzymes disrupt yeast/bacterial biofilm without antibiotics.',
    productMeta: {
      'pythie-pet-ear-cleaner': {
        roleBadge: 'Targeted Otic Biocontrol & Ceruminolytic',
        dosingPill: '3–5 Drops per Ear • 2–3x Weekly or Daily in Acute Otitis',
        indicationBadge: 'Otitis Externa, Malassezia Overgrowth & Cerumen Dissolution',
      },
    },
  },
  {
    id: 'oral-dental',
    number: 3,
    shortLabel: '3. Oral & Dental',
    name: 'Oral & Dental Zone',
    anatomicalStructure: '3D Maxilla/Mandible, Carnassial Dental Arcade & Gingival Sulcus',
    protocolTitle: 'Oral Biofilm & Periodontal Hygiene',
    clinicalSummary:
      'Brushless daily drinking-water biological dental care that disrupts subgingival plaque biofilm, neutralizes volatile sulfur halitosis, and supports gingival repair.',
    productIds: ['pythie-pet-fresh-breath'],
    highlightedOrgans: ['oral-dental'],
    linkedFlowIds: ['dental-oral-hygiene-flow'],
    coords: {
      feline: { x: 10.5, y: 38.5, labelX: 12, labelY: 60, svgX: 148, svgY: 203 },
      canine: { x: 8.5, y: 35.5, labelX: 12, labelY: 60, svgX: 134, svgY: 191 },
    },
    clinicalMetrics: [
      {
        value: '24h Shield',
        label: 'Drinking Water Delivery',
        sub: '100% owner compliance with zero brushing stress',
        percent: 98,
        color: '#F59E0B',
      },
      {
        value: '-82% Odor',
        label: 'Halitosis Neutralization',
        sub: 'Eliminates volatile sulfur compounds in 7 days',
        percent: 82,
        color: '#14B8A6',
      },
      {
        value: 'Bio-Plaque',
        label: 'Biofilm Matrix Lysis',
        sub: 'Prevents tartar mineralization on enamel',
        percent: 90,
        color: '#10B981',
      },
    ],
    targetIndications: [
      'Periodontal Plaque & Tartar',
      'Feline Stomatitis & Gingivitis',
      'Chronic Halitosis (Oral Malodor)',
      'Post-Ultrasonic Scaling Maintenance',
    ],
    mechanismFlow:
      'Continuous oral delivery via daily drinking water (5 ml / 500 ml water) → Botanical oils & biological enzymes coat dental enamel and gingival sulcus → Suppresses anaerobic periodontal pathogens.',
    productMeta: {
      'pythie-pet-fresh-breath': {
        roleBadge: 'Daily Oral Biofilm & Gingival Care',
        dosingPill: '5 ml per 500 ml Drinking Water • Continuous Daily Oral Care',
        indicationBadge: 'Periodontal Plaque Control, Gingivitis & Halitosis Elimination',
      },
    },
  },
  {
    id: 'dermal-coat',
    number: 4,
    shortLabel: '4. Dermal & Coat',
    name: 'Dermal & Coat Zone',
    anatomicalStructure: '3D Outer Epidermal Lipid Matrix, Hair Follicles & Dorsal Coat',
    protocolTitle: 'Mycotic Dermatitis, Wound Healing & Seborrhea',
    clinicalSummary:
      'Complete 3-pillar dermatological suite covering biological mycoparasitic ringworm eradication, enzymatic open wound granulation, and activated Zinc Pyrithione seborrhea therapy.',
    productIds: ['ecosin', 'dermasin', 'pythie-pet-ointment', 'bluecap-shampoo'],
    highlightedOrgans: ['dermal-coat'],
    linkedFlowIds: ['dermatology-protocol', 'post-surgical-wound-flow'],
    coords: {
      feline: { x: 52.8, y: 26.5, labelX: 56, labelY: 7, svgX: 455, svgY: 156 },
      canine: { x: 52.8, y: 26.5, labelX: 56, labelY: 7, svgX: 455, svgY: 156 },
    },
    clinicalMetrics: [
      {
        value: '+22% Shaft',
        label: 'Hair Follicle Diameter',
        sub: 'Clinically proven follicle strengthening (Blue Cap)',
        percent: 94,
        color: '#14B8A6',
      },
      {
        value: '0% Azoles',
        label: 'Zero Hepatotoxicity',
        sub: 'Safe biological mycoparasitism for kittens & puppies',
        percent: 100,
        color: '#F59E0B',
      },
      {
        value: '3-Pillar',
        label: 'Fungal • Wound • Seborrhea',
        sub: 'Complete epidermal & deep tissue regeneration',
        percent: 95,
        color: '#10B981',
      },
    ],
    targetIndications: [
      'Microsporum canis (Ringworm)',
      'Malassezia & Seborrheic Dermatitis',
      'Open Traumatic Wounds & Burns',
      'Atopic Pruritus & Alopecia',
    ],
    mechanismFlow:
      'Pillar 1 (Ecosin): Pythium oligandrum parasitizes dermatophyte hyphae → Pillar 2 (Dermasin + Pythie Ointment): Enzymatic debridement & rapid granulation → Pillar 3 (Blue Cap Shampoo): Molecular-activated Zinc Pyrithione normalizes keratinocyte turnover.',
    subTabs: [
      {
        id: 'all',
        label: 'All Dermal Protocol (4)',
        productIds: ['ecosin', 'dermasin', 'pythie-pet-ointment', 'bluecap-shampoo'],
      },
      {
        id: 'antifungal',
        label: 'Antifungal / Mycoparasitic (1)',
        productIds: ['ecosin'],
      },
      {
        id: 'wound',
        label: 'Wound & Tissue Regeneration (2)',
        productIds: ['dermasin', 'pythie-pet-ointment'],
      },
      {
        id: 'seborrhea',
        label: 'Seborrhea & Coat Barrier (1)',
        productIds: ['bluecap-shampoo'],
      },
    ],
    productMeta: {
      ecosin: {
        subGroup: 'Antifungal / Mycoparasitic',
        roleBadge: 'Antifungal / Mycoparasitic Bath & Spray',
        dosingPill: '1 Tablet in 2–5 L Warm Water • 2–3 Applications Weekly',
        indicationBadge: 'Dermatophytosis (Ringworm), Microsporum & Malassezia Control',
      },
      dermasin: {
        subGroup: 'Wound & Tissue Regeneration',
        roleBadge: 'Epidermal Lipid & Acute Lesion Oil',
        dosingPill: 'Apply Topically to Affected Skin • 1–2x Daily',
        indicationBadge: 'Acute Wet Eczema, Hot Spots & Epidermal Barrier Restoration',
      },
      'pythie-pet-ointment': {
        subGroup: 'Wound & Tissue Regeneration',
        roleBadge: 'Enzymatic Bio-Debridement & Granulation',
        dosingPill: 'Apply Thin Layer • 2x Daily (BID) for 7–14 Days',
        indicationBadge: 'Open Wounds, Post-Surgical Incisions, Abscesses & Burns',
      },
      'bluecap-shampoo': {
        subGroup: 'Seborrhea & Coat Barrier',
        roleBadge: 'Seborrhea & Keratolytic Medicated Wash',
        dosingPill: '8–10 Min Lather Contact • 2–3x Weekly (4 Weeks)',
        indicationBadge: 'Keratoseborrheic Disorders, Scaling, Pruritus & +22% Hair Shaft',
      },
    },
  },
  {
    id: 'gi-hepatic',
    number: 5,
    shortLabel: '5. GI & Hepatic',
    name: 'Gastrointestinal & Hepatic Zone',
    anatomicalStructure: '3D Illuminated Hepatic Lobes, J-Stomach & Duodenal/Intestinal Loops',
    protocolTitle: 'Viral Enteritis (Parvo / Panleukopenia / Corona) & Hepato-GI Recovery',
    clinicalSummary:
      'Complete 3-Step hospital & clinic pipeline: rapid 10-minute fecal antigen triage followed by antiviral hepatoprotection and gastric mucosal repair.',
    productIds: ['flexy-cpv', 'flexy-fpv', 'flexy-fcov', 'viusid', 'viusid-detox', 'carminal'],
    highlightedOrgans: ['gi-hepatic'],
    linkedFlowIds: ['viral-gi-protocol', 'feline-fip-enteric-flow'],
    coords: {
      feline: { x: 55.5, y: 52.0, labelX: 52, labelY: 86, svgX: 475, svgY: 256 },
      canine: { x: 55.5, y: 52.0, labelX: 52, labelY: 86, svgX: 475, svgY: 256 },
    },
    clinicalMetrics: [
      {
        value: '10 Mins',
        label: 'Point-of-Care Triage',
        sub: 'Instant CPV, FPV & FCoV fecal antigen confirmation',
        percent: 100,
        color: '#EC4899',
      },
      {
        value: '12 Strains',
        label: 'Synbiotic + Hepatoprotection',
        sub: 'Rebuilds gut flora & clears mycotoxins/ALT/AST',
        percent: 94,
        color: '#10B981',
      },
      {
        value: '3-Step Care',
        label: 'Screen → Suppress → Repair',
        sub: 'Stops vomiting, hemorrhagic enteritis & villous atrophy',
        percent: 96,
        color: '#14B8A6',
      },
    ],
    targetIndications: [
      'Canine Parvovirus (CPV) Enteritis',
      'Feline Panleukopenia (FPV)',
      'Feline Enteric Coronavirus (FCoV)',
      'Acute Gastritis, Vomiting & Hepatic Stress',
    ],
    mechanismFlow:
      'Step 1 (Flexy CPV / FPV / FCoV): 10-min bedside fecal triage → Step 2 (Viusid + Viusid Detox): Glycyrrhizinic antiviral blockade, hepatic transaminase normalization & 12-strain microbiome restoration → Step 3 (Carminal): Aloe vera + glutamine mucosal coating & anti-emetic relief.',
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
    anatomicalStructure: '3D Illuminated Renal Cortex, Ureters & Urinary Bladder',
    protocolTitle: 'Urolithiasis Dissolution & Renal Support',
    clinicalSummary:
      'Non-surgical dissolution of struvite & calcium oxalate uroliths (-70% stone volume in 30 days) paired with renal toxin elimination.',
    productIds: ['renalof', 'viusid-detox'],
    highlightedOrgans: ['renal-urinary'],
    linkedFlowIds: ['renal-diagnostics-flow'],
    coords: {
      feline: { x: 67.2, y: 42.8, labelX: 78, labelY: 14, svgX: 560, svgY: 220 },
      canine: { x: 67.2, y: 42.8, labelX: 78, labelY: 14, svgX: 560, svgY: 220 },
    },
    clinicalMetrics: [
      {
        value: '-70% Stone',
        label: '30-Day Urolith Reduction',
        sub: 'Dissolves Calcium Oxalate & Struvite calculi',
        percent: 92,
        color: '#10B981',
      },
      {
        value: 'Non-Surgical',
        label: 'Agropyron repens Extract',
        sub: 'Smooths crystal edges & relieves dysuria/hematuria',
        percent: 95,
        color: '#14B8A6',
      },
      {
        value: 'Nephro-Safe',
        label: 'Renal Toxin Clearance',
        sub: 'Supports glomerular filtration & uremic detox',
        percent: 88,
        color: '#3B82F6',
      },
    ],
    targetIndications: [
      'Calcium Oxalate & Struvite Urolithiasis',
      'Feline Lower Urinary Tract Disease (FLUTD)',
      'Idiopathic Cystitis & Dysuria',
      'Post-Catheterization Renal Support',
    ],
    mechanismFlow:
      'Step 1 (Renalof): Molecular-activated Agropyron repens chelates crystal matrices and increases painless diuresis (-70% stone size in 30d) → Step 2 (Viusid Detox): Binds nitrogenous/uremic toxins in the gut-kidney axis.',
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
    anatomicalStructure: '3D Cardiac Core, Aortic Vascular Tree & Lymphatic Network',
    protocolTitle: 'Toxoplasma Screening & Systemic Immune Support',
    clinicalSummary:
      'Rapid 10-minute serological screening for Toxoplasma gondii antibodies followed by targeted systemic immunomodulation and cardiorespiratory defense.',
    productIds: ['flexy-toxoplasma', 'viusid', 'asprib'],
    highlightedOrgans: ['systemic-immune'],
    linkedFlowIds: ['renal-diagnostics-flow'],
    coords: {
      feline: { x: 29.5, y: 50.0, labelX: 26, labelY: 86, svgX: 286, svgY: 248 },
      canine: { x: 29.5, y: 50.0, labelX: 26, labelY: 86, svgX: 286, svgY: 248 },
    },
    clinicalMetrics: [
      {
        value: '100% Spec.',
        label: 'Toxoplasma Ab Specificity',
        sub: 'Zero cross-reactivity in feline & canine serum',
        percent: 100,
        color: '#EC4899',
      },
      {
        value: '96.2% Sens.',
        label: '10-Min Zoonotic Screen',
        sub: 'Essential pre-breeding & household safety check',
        percent: 96,
        color: '#14B8A6',
      },
      {
        value: 'T-Cell Boost',
        label: 'Systemic Immunomodulation',
        sub: 'Elevates natural killer cells & interferon-gamma',
        percent: 93,
        color: '#10B981',
      },
    ],
    targetIndications: [
      'Toxoplasma gondii Serological Triage',
      'Zoonotic Household / Pregnancy Screening',
      'Systemic Immunosuppression & Fever',
      'Pre-Vaccination Immune Conditioning',
    ],
    mechanismFlow:
      'Step 1 (Flexy Toxoplasma Ab): 10-minute whole blood/serum lateral flow screening → Step 2 (Viusid): Systemic macrophage and T-lymphocyte activation → Step 3 (Asprib): Cardiorespiratory antioxidant protection.',
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

/**
 * Mapping between all 8 Pre-Built Clinical Call Flows (in catalog.json)
 * and the 3D Anatomical Zones & Species so selecting any Call Flow illuminates
 * the exact target organs on the 3D body!
 */
const CALL_FLOW_ANATOMY_MAP = {
  'viral-gi-protocol': {
    primaryZoneId: 'gi-hepatic',
    highlightedOrgans: ['gi-hepatic', 'systemic-immune'],
    preferredSpecies: null,
    organBadge: 'GI Tract, Liver & Systemic Immune Core',
    clinicalMetrics: [
      { value: '10 Mins', label: 'CPV/FPV Fecal Triage', sub: 'Instant point-of-care confirmation', percent: 100, color: '#EC4899' },
      { value: '4-Step Flow', label: 'Triage → Suppress → Coat → Detox', sub: 'Complete hospital viral enteritis pathway', percent: 96, color: '#10B981' },
      { value: '12 Strains', label: 'Microbiome Reconstruction', sub: 'Reverses post-viral & antibiotic dysbiosis', percent: 94, color: '#14B8A6' },
    ],
  },
  'feline-uri-protocol': {
    primaryZoneId: 'ocular-nasal-respiratory',
    highlightedOrgans: ['ocular-nasal-respiratory', 'systemic-immune'],
    preferredSpecies: 'feline',
    organBadge: 'Feline Cranial Sinus, Conjunctiva & Bronchial Tree',
    clinicalMetrics: [
      { value: 'Multimodal', label: 'Multimodal Support', sub: 'Antiviral replication block, airway secretolysis & mucosal immune defense', percent: 98, color: '#3B82F6' },
      { value: 'BID Dosing', label: 'Twice-Daily URI Protocol', sub: 'Sustained 12h ocular-nasal viral block', percent: 100, color: '#14B8A6' },
      { value: '3-Step URI', label: 'Block → Clear → Immunize', sub: 'Resolves sneezing, discharge & congestion', percent: 92, color: '#10B981' },
    ],
  },
  'dermatology-protocol': {
    primaryZoneId: 'dermal-coat',
    highlightedOrgans: ['dermal-coat', 'otic-ear'],
    preferredSpecies: null,
    organBadge: 'Epidermal Barrier, Dorsal Coat & Otic Canal',
    clinicalMetrics: [
      { value: '5-Step Suite', label: 'Complete Derm & Otic Care', sub: 'Ringworm, eczema, wounds, seborrhea & ears', percent: 100, color: '#F59E0B' },
      { value: '+22% Shaft', label: 'Hair Follicle Recovery', sub: 'Proven hair shaft diameter increase', percent: 94, color: '#14B8A6' },
      { value: '0% Azoles', label: 'Hepatoprotective Biocontrol', sub: 'Clever Fungus enzymatic mycoparasitism', percent: 96, color: '#10B981' },
    ],
  },
  'feline-fip-enteric-flow': {
    primaryZoneId: 'gi-hepatic',
    highlightedOrgans: ['gi-hepatic', 'systemic-immune'],
    preferredSpecies: 'feline',
    organBadge: 'Feline Intestinal Mucosa, Liver & Mesenteric Nodes',
    clinicalMetrics: [
      { value: '10 Mins', label: 'FCoV Antigen Detection', sub: 'Screens coronavirus shedding in chronic diarrhea', percent: 98, color: '#EC4899' },
      { value: 'Mucosal Shield', label: 'Glutamine + Aloe Coating', sub: 'Protects enterocytes & halts reflux/vomiting', percent: 93, color: '#14B8A6' },
      { value: 'Hepato-Gut', label: 'Antiviral + 12 Probiotics', sub: 'Stabilizes enteric phase & systemic immunity', percent: 95, color: '#10B981' },
    ],
  },
  'renal-diagnostics-flow': {
    primaryZoneId: 'renal-urinary',
    highlightedOrgans: ['renal-urinary', 'systemic-immune'],
    preferredSpecies: null,
    organBadge: 'Kidneys, Ureters, Bladder & Systemic Circulation',
    clinicalMetrics: [
      { value: '-70% Stone', label: 'Calculi Volume Reduction', sub: '30-day dissolution of Oxalate & Struvite stones', percent: 92, color: '#10B981' },
      { value: '100% Spec.', label: 'Toxoplasma Ab Screen', sub: 'Rules out systemic protozoal co-infection', percent: 100, color: '#EC4899' },
      { value: 'Diuresis', label: 'Smooth Tract Lubrication', sub: 'Relieves dysuria, hematuria & FLUTD spasm', percent: 90, color: '#14B8A6' },
    ],
  },
  'canine-respiratory-distemper': {
    primaryZoneId: 'ocular-nasal-respiratory',
    highlightedOrgans: ['ocular-nasal-respiratory', 'gi-hepatic', 'systemic-immune'],
    preferredSpecies: 'canine',
    organBadge: 'Canine Tracheobronchial Tree, GI Tract & CNS/Immune Core',
    clinicalMetrics: [
      { value: '+61% Survival', label: 'Distemper Mortality Drop', sub: 'Clinically proven survival enhancement', percent: 96, color: '#10B981' },
      { value: '-70% CNS', label: 'Neurological Protection', sub: 'Reduces severe distemper CNS sequelae', percent: 90, color: '#14B8A6' },
      { value: '-14.3 Days', label: 'Faster Clinical Recovery', sub: 'Accelerated resolution of cough & enteritis', percent: 94, color: '#3B82F6' },
    ],
  },
  'post-surgical-wound-flow': {
    primaryZoneId: 'dermal-coat',
    highlightedOrgans: ['dermal-coat', 'gi-hepatic', 'systemic-immune'],
    preferredSpecies: null,
    organBadge: 'Epidermal Wound Bed, Collagen Matrix & Gut-Liver Axis',
    clinicalMetrics: [
      { value: 'Bio-Debride', label: 'Enzymatic Granulation', sub: 'Non-stinging Pythium oligandrum wound care', percent: 95, color: '#F59E0B' },
      { value: 'Collagen+', label: 'Activated Zinc & Arginine', sub: 'Accelerates surgical incision tensile closure', percent: 94, color: '#10B981' },
      { value: 'Post-Rx', label: 'Antibiotic Gut Recovery', sub: 'Restores flora after perioperative antibiotics', percent: 92, color: '#14B8A6' },
    ],
  },
  'dental-oral-hygiene-flow': {
    primaryZoneId: 'oral-dental',
    highlightedOrgans: ['oral-dental', 'systemic-immune'],
    preferredSpecies: null,
    organBadge: 'Maxilla/Mandible Dental Arcade & Gingival Tissue',
    clinicalMetrics: [
      { value: 'Brushless', label: 'Daily Water Bio-Control', sub: 'Continuous plaque & tartar inhibition', percent: 98, color: '#F59E0B' },
      { value: 'Gingival+', label: 'Stomatitis & Gum Repair', sub: 'Systemic arginine + zinc mucosal healing', percent: 91, color: '#10B981' },
      { value: 'Fresh Breath', label: 'Halitosis Elimination', sub: 'Neutralizes oral volatile sulfur compounds', percent: 94, color: '#14B8A6' },
    ],
  },
};

export default function AnatomyExplorer({
  allProductsMap = {},
  callFlows = [],
  onSelectProduct,
  onSelectProductFromAnatomy,
  onLaunchZoneProtocol,
  onLaunchFlow,
  initialSpecies = 'feline',
  initialZoneId = 'ocular-nasal-respiratory',
  onStateChange,
}) {
  const [species, setSpecies] = useState(initialSpecies); // 'feline' | 'canine'
  const [activeZoneId, setActiveZoneId] = useState(initialZoneId);
  const [selectedCallFlowId, setSelectedCallFlowId] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('all');

  const handleProductSelect = onSelectProduct || onSelectProductFromAnatomy;

  const activeZone = useMemo(
    () => ANATOMICAL_ZONES.find((z) => z.id === activeZoneId) || ANATOMICAL_ZONES[0],
    [activeZoneId]
  );

  const activeCallFlow = useMemo(() => {
    if (!selectedCallFlowId) return null;
    return callFlows.find((f) => f.id === selectedCallFlowId) || null;
  }, [selectedCallFlowId, callFlows]);

  // Which organ systems on the 3D body are currently illuminated
  const illuminatedOrgans = useMemo(() => {
    if (activeCallFlow && CALL_FLOW_ANATOMY_MAP[activeCallFlow.id]) {
      return CALL_FLOW_ANATOMY_MAP[activeCallFlow.id].highlightedOrgans;
    }
    return activeZone.highlightedOrgans || [activeZone.id];
  }, [activeCallFlow, activeZone]);

  const isOrganIlluminated = (organId) => illuminatedOrgans.includes(organId);

  // Select one of the 7 Anatomical Zones on the 3D Body
  const handleSelectZone = (zoneId) => {
    setActiveZoneId(zoneId);
    setSelectedCallFlowId(null);
    setActiveSubTab('all');
    if (onStateChange) {
      onStateChange({ species, zoneId });
    }
  };

  // Select one of the 8 Pre-Built Clinical Call Flows embedded in the 3D Explorer
  const handleSelectCallFlow = (flow) => {
    const mapping = CALL_FLOW_ANATOMY_MAP[flow.id];
    setSelectedCallFlowId(flow.id);
    setActiveSubTab('all');
    if (mapping?.primaryZoneId) {
      setActiveZoneId(mapping.primaryZoneId);
    }
    if (mapping?.preferredSpecies) {
      setSpecies(mapping.preferredSpecies);
    }
  };

  const handleSelectSpecies = (newSpecies) => {
    setSpecies(newSpecies);
    if (onStateChange) {
      onStateChange({ species: newSpecies, zoneId: activeZoneId });
    }
  };

  // Products to display in the right-hand panel based on whether a Call Flow or Zone is active
  const displayedProductIds = useMemo(() => {
    if (activeCallFlow) {
      return activeCallFlow.productIds || [];
    }
    if (activeZone.subTabs && activeSubTab !== 'all') {
      const sub = activeZone.subTabs.find((t) => t.id === activeSubTab);
      if (sub) return sub.productIds;
    }
    return activeZone.productIds;
  }, [activeCallFlow, activeZone, activeSubTab]);

  const displayedProducts = useMemo(() => {
    return displayedProductIds.map((id) => allProductsMap[id]).filter(Boolean);
  }, [displayedProductIds, allProductsMap]);

  // Active metrics, indications & mechanism shown in the right-hand visual data panel
  const activeMetrics = useMemo(() => {
    if (activeCallFlow && CALL_FLOW_ANATOMY_MAP[activeCallFlow.id]?.clinicalMetrics) {
      return CALL_FLOW_ANATOMY_MAP[activeCallFlow.id].clinicalMetrics;
    }
    return activeZone.clinicalMetrics || [];
  }, [activeCallFlow, activeZone]);

  const activeIndications = useMemo(() => {
    if (activeCallFlow?.targetIndications) {
      return activeCallFlow.targetIndications;
    }
    return activeZone.targetIndications || [];
  }, [activeCallFlow, activeZone]);

  const activeMechanismText = useMemo(() => {
    if (activeCallFlow?.clinicalRationale) {
      return activeCallFlow.clinicalRationale;
    }
    return activeZone.mechanismFlow || activeZone.clinicalSummary;
  }, [activeCallFlow, activeZone]);

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
    <section className="w-full rounded-3xl overflow-hidden border border-slate-800 shadow-[0_28px_70px_-15px_rgba(11,17,32,0.55)] bg-[#0B1120] text-white mb-10">
      {/* ===================================================================== */}
      {/* 1. TOP COMMAND HEADER BAR                                             */}
      {/* ===================================================================== */}
      <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-[#0B1120] via-[#0F172A] to-[#0B1120] border-b border-teal-500/25 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500/25 to-cyan-500/10 border border-teal-400/50 flex items-center justify-center text-teal-300 shadow-[0_0_25px_rgba(20,184,166,0.35)]">
            <Crosshair className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/35">
                3D Anatomical Atlas & Clinical Call Flows
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                • 7 Organ Zones • {callFlows.length || 8} Pre-Built Flows • 16 Validated Products
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-black tracking-tight text-white mt-0.5">
              Interactive 3D Companion Animal Clinical Protocol Explorer
            </h2>
          </div>
        </div>

        {/* Species 3D Model Switcher (Large Tablet Touch Buttons) */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1 rounded-2xl bg-slate-900/95 border border-slate-700/80 flex items-center gap-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => handleSelectSpecies('feline')}
              className={`min-h-[46px] px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
                species === 'feline'
                  ? 'bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <span className="text-lg leading-none">🐈</span>
              <span>3D Feline Anatomy</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectSpecies('canine')}
              className={`min-h-[46px] px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
                species === 'canine'
                  ? 'bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <span className="text-lg leading-none">🐕</span>
              <span>3D Canine Anatomy</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. MAIN TOP-ALIGNED SPLIT STAGE:                                      */}
      {/*    LEFT 50% (LARGE 3D X-RAY BODY) | RIGHT 50% (LAUNCH & VISUAL DATA)  */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-start">
        
        {/* =================================================================== */}
        {/* LEFT 50% (6 COLS): LARGE, TOP-ALIGNED 3D X-RAY ANIMAL STAGE         */}
        {/* =================================================================== */}
        <div className="lg:col-span-6 relative bg-[#0B1120] overflow-hidden flex flex-col justify-start p-4 sm:p-5 border-b lg:border-b-0 lg:border-r border-slate-800 select-none">
          {/* Multi-Layer Radial Medical Lighting & Biometric Grid Backdrop */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 38%, rgba(20, 184, 166, 0.22) 0%, rgba(14, 165, 233, 0.10) 45%, rgba(11, 17, 32, 0.98) 82%)',
            }}
          />

          {/* Subtle Technical Blueprint Grid Behind Animal */}
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(56, 189, 248, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.25) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />

          {/* Top HUD Biometric Telemetry Row (Aligned with Right Protocol Header) */}
          <div className="relative z-20 flex items-center justify-between gap-2 flex-wrap mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-teal-500/35 backdrop-blur-md shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
              <span className="text-[11px] font-mono font-bold text-teal-300 uppercase tracking-wider">
                {species === 'feline' ? 'FELIS CATUS • FULL-BODY 3D ATLAS' : 'CANIS LUPUS • FULL-BODY 3D ATLAS'}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-[11px] font-mono text-slate-300 backdrop-blur-md">
              <span className="text-slate-400">ACTIVE:</span>
              <span className="text-teal-300 font-bold">
                {activeCallFlow
                  ? activeCallFlow.badge
                  : `ZONE 0${activeZone.number} • ${activeZone.shortLabel.replace(/^\d+\.\s*/, '')}`}
              </span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* LARGE, FULL-BLEED 3D X-RAY COMPANION ANIMAL VIEWPORT              */}
          {/* Tightly cropped viewBox="72 52 726 392" so the drawing fills 95%! */}
          {/* ================================================================= */}
          <div className="relative z-10 w-full rounded-2xl bg-slate-950/60 border border-teal-500/25 p-2 sm:p-3 shadow-[inset_0_0_40px_rgba(20,184,166,0.12)] overflow-hidden">
            {/* 3D Perspective Surgical Floor Grid Inside Stage */}
            <div
              className="absolute inset-x-0 bottom-0 h-36 pointer-events-none opacity-60"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(20,184,166,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,184,166,0.3) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
                transform: 'perspective(420px) rotateX(68deg) translateY(24px) scale(1.35)',
                transformOrigin: 'bottom center',
                maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 100%)',
              }}
            />

            {/* Concentric Holographic Pedestal Ring */}
            <div
              className="absolute left-1/2 bottom-4 -translate-x-1/2 w-[88%] h-14 rounded-full border border-teal-400/45 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(20,184,166,0.3) 0%, rgba(20,184,166,0) 75%)',
                transform: 'rotateX(76deg)',
                boxShadow: '0 0 40px rgba(20, 184, 166, 0.4)',
              }}
            />

            <div className="relative w-full aspect-[726/392]">
              {/* HIGH-PRECISION VETERINARY 3D X-RAY SVG ATLAS (LARGE CROPPED VIEWBOX) */}
              <svg
                viewBox="72 52 726 392"
                className="w-full h-full overflow-visible drop-shadow-[0_16px_36px_rgba(20,184,166,0.32)]"
              >
                <defs>
                  {/* Translucent 3D Hologram Outer Flesh Shader */}
                  <linearGradient id="vetHoloBodyFill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.32" />
                    <stop offset="35%" stopColor="#0F766E" stopOpacity="0.22" />
                    <stop offset="70%" stopColor="#0369A1" stopOpacity="0.26" />
                    <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.34" />
                  </linearGradient>

                  {/* Inner Volumetric Depth Gradient */}
                  <radialGradient id="vetInnerDepth" cx="46%" cy="44%" r="52%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.20" />
                    <stop offset="60%" stopColor="#0F172A" stopOpacity="0.48" />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity="0.28" />
                  </radialGradient>

                  {/* Specular Cyan Rim Highlight */}
                  <linearGradient id="vetRimStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.98" />
                    <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.90" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.98" />
                  </linearGradient>

                  {/* Skeletal Bone X-Ray Shader */}
                  <linearGradient id="vetBoneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.62" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.28" />
                  </linearGradient>

                  {/* Active Organ Illuminated Medical Cyan/Teal Gradient */}
                  <radialGradient id="organActiveCyan" cx="45%" cy="45%" r="58%">
                    <stop offset="0%" stopColor="#99F6E4" stopOpacity="1" />
                    <stop offset="45%" stopColor="#14B8A6" stopOpacity="0.9" />
                    <stop offset="85%" stopColor="#0D9488" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#0F766E" stopOpacity="0.25" />
                  </radialGradient>

                  {/* Active Organ Warm Emerald Accent */}
                  <radialGradient id="organActiveEmerald" cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.98" />
                    <stop offset="50%" stopColor="#10B981" stopOpacity="0.86" />
                    <stop offset="100%" stopColor="#047857" stopOpacity="0.3" />
                  </radialGradient>

                  {/* Dormant Organ Translucent X-Ray Shader */}
                  <radialGradient id="organDormant" cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.38" />
                    <stop offset="70%" stopColor="#0284C7" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#0F172A" stopOpacity="0.12" />
                  </radialGradient>

                  {/* High-Intensity Cyan Luminescence Filter */}
                  <filter id="organGlow" x="-35%" y="-35%" width="170%" height="170%">
                    <feGaussianBlur stdDeviation="6" result="blur1" />
                    <feGaussianBlur stdDeviation="12" result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur2" />
                      <feMergeNode in="blur1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Dorsal Epidermal Hexagonal Mesh Pattern */}
                  <pattern id="dermalHexPattern" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path
                      d="M 8 0 L 16 4.5 L 16 11.5 L 8 16 L 0 11.5 L 0 4.5 Z"
                      fill="none"
                      stroke="#2DD4BF"
                      strokeWidth="1.2"
                      strokeOpacity="0.8"
                    />
                  </pattern>
                </defs>

                {/* =========================================================== */}
                {/* SPECIES 1: ANATOMICALLY ACCURATE 3D FELINE ATLAS            */}
                {/* =========================================================== */}
                {species === 'feline' ? (
                  <g className="transition-opacity duration-500">
                    {/* Outer 3D Feline Anatomical Silhouette */}
                    <path
                      d="M 116 186
                         C 114 172, 122 158, 138 150
                         C 148 136, 160 124, 174 118
                         L 184 72 L 206 108
                         L 224 68 L 238 116
                         C 262 128, 288 152, 326 156
                         C 392 158, 468 140, 548 148
                         C 608 154, 650 178, 674 214
                         C 708 196, 736 146, 748 96
                         C 752 78, 772 82, 768 104
                         C 756 162, 724 214, 682 242
                         C 686 286, 668 334, 654 378
                         L 660 426 L 632 426 L 630 374
                         C 618 352, 608 334, 598 320
                         L 592 426 L 566 426 L 570 308
                         C 512 316, 434 316, 358 300
                         L 342 426 L 314 426 L 324 318
                         L 296 426 L 268 426 L 284 294
                         C 246 280, 216 254, 200 226
                         C 178 232, 148 230, 128 214
                         C 116 206, 114 196, 116 186 Z"
                      fill="url(#vetHoloBodyFill)"
                      stroke="url(#vetRimStroke)"
                      strokeWidth="2.8"
                    />
                    {/* Inner Volumetric Rim Contour */}
                    <path
                      d="M 124 188 C 134 156, 172 132, 232 126 C 310 164, 460 148, 560 156 C 625 164, 660 198, 672 232 C 668 290, 640 340, 580 302 C 495 310, 415 308, 340 292 C 260 278, 215 245, 196 218 C 165 224, 134 214, 124 188 Z"
                      fill="url(#vetInnerDepth)"
                      stroke="#38BDF8"
                      strokeOpacity="0.3"
                      strokeWidth="1.2"
                    />

                    {/* Detailed Feline Skeletal X-Ray System */}
                    <g stroke="url(#vetBoneGrad)" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 124 182 C 132 154, 168 134, 212 138 C 228 142, 234 166, 218 184 C 194 198, 152 198, 124 182 Z" strokeWidth="2.4" />
                      <circle cx="158" cy="164" r="10" strokeWidth="1.8" stroke="#7DD3FC" strokeOpacity="0.55" />
                      <path
                        d="M 222 158 C 258 176, 298 182, 355 176 C 435 166, 520 158, 605 178 C 645 188, 668 212, 680 228 C 718 202, 745 152, 758 98"
                        strokeWidth="4.8"
                        strokeDasharray="7 4"
                      />
                      <path d="M 315 176 L 320 162 M 335 175 L 340 160 M 355 174 L 360 160 M 375 172 L 380 159 M 395 170 L 400 158 M 415 168 L 420 157 M 435 167 L 440 157" strokeWidth="2" />
                      <path d="M 316 178 Q 308 232, 326 276" strokeWidth="2.5" />
                      <path d="M 334 177 Q 326 238, 346 284" strokeWidth="2.5" />
                      <path d="M 352 175 Q 345 242, 366 288" strokeWidth="2.5" />
                      <path d="M 370 174 Q 364 244, 386 290" strokeWidth="2.5" />
                      <path d="M 388 172 Q 382 242, 404 288" strokeWidth="2.3" />
                      <path d="M 406 170 Q 402 238, 422 282" strokeWidth="2.2" />
                      <path d="M 424 169 Q 420 232, 438 274" strokeWidth="2" />
                      <path d="M 442 168 Q 438 224, 454 262" strokeWidth="1.8" />
                      <path d="M 286 262 Q 345 294, 418 286" strokeWidth="2.6" strokeDasharray="5 3" />
                      <path d="M 308 178 L 284 228 L 306 282 L 298 358 L 308 418" strokeWidth="3" />
                      <path d="M 295 182 L 316 178 L 292 228 Z" fill="#38BDF8" fillOpacity="0.14" strokeWidth="1.8" />
                      <path d="M 575 172 L 632 192 L 615 212 L 568 188 Z" fill="#38BDF8" fillOpacity="0.14" strokeWidth="2" />
                      <path d="M 608 194 L 584 268 L 622 336 L 616 418" strokeWidth="3" />
                    </g>
                  </g>
                ) : (
                  /* =========================================================== */
                  /* SPECIES 2: ANATOMICALLY ACCURATE 3D CANINE ATLAS            */
                  /* =========================================================== */
                  <g className="transition-opacity duration-500">
                    {/* Outer 3D Canine Anatomical Silhouette */}
                    <path
                      d="M 84 176
                         C 82 160, 96 150, 128 146
                         C 146 144, 162 122, 188 112
                         L 216 74 L 244 108
                         C 256 122, 240 144, 256 148
                         C 288 156, 326 158, 378 158
                         C 458 158, 542 152, 616 168
                         C 656 176, 682 198, 694 224
                         C 726 196, 756 152, 770 112
                         C 776 96, 792 104, 786 126
                         C 770 178, 738 224, 698 250
                         C 694 304, 674 358, 662 426
                         L 634 426 L 642 342
                         C 624 354, 612 392, 606 426
                         L 580 426 L 592 304
                         C 536 312, 478 278, 422 312
                         C 392 324, 362 324, 344 316
                         L 334 426 L 306 426 L 316 318
                         L 288 426 L 260 426 L 276 296
                         C 236 280, 208 248, 194 216
                         C 156 222, 108 214, 90 198
                         C 84 192, 84 184, 84 176 Z"
                      fill="url(#vetHoloBodyFill)"
                      stroke="url(#vetRimStroke)"
                      strokeWidth="2.8"
                    />
                    {/* Inner Volumetric Rim Contour */}
                    <path
                      d="M 96 178 C 120 156, 168 128, 232 122 C 305 162, 465 156, 585 168 C 645 174, 675 205, 684 238 C 675 292, 645 335, 588 294 C 520 296, 468 272, 412 304 C 350 318, 250 280, 196 208 C 154 214, 108 204, 96 178 Z"
                      fill="url(#vetInnerDepth)"
                      stroke="#38BDF8"
                      strokeOpacity="0.3"
                      strokeWidth="1.2"
                    />

                    {/* Detailed Canine Skeletal X-Ray System */}
                    <g stroke="url(#vetBoneGrad)" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 94 172 C 122 164, 148 156, 174 132 C 198 118, 226 124, 234 152 C 228 176, 196 190, 165 190 L 98 188 Z" strokeWidth="2.4" />
                      <circle cx="176" cy="150" r="10" strokeWidth="1.8" stroke="#7DD3FC" strokeOpacity="0.55" />
                      <path
                        d="M 232 146 C 272 172, 318 178, 378 172 C 458 166, 542 162, 622 182 C 660 192, 680 212, 692 232 C 728 202, 758 158, 774 114"
                        strokeWidth="4.8"
                        strokeDasharray="8 4"
                      />
                      <path d="M 312 174 L 318 152 M 332 174 L 338 152 M 352 173 L 358 154 M 372 172 L 378 155 M 392 170 L 398 156 M 412 169 L 416 157 M 432 168 L 436 157" strokeWidth="2" />
                      <path d="M 314 176 Q 306 238, 326 292" strokeWidth="2.5" />
                      <path d="M 334 175 Q 326 246, 348 300" strokeWidth="2.5" />
                      <path d="M 354 174 Q 348 250, 370 304" strokeWidth="2.5" />
                      <path d="M 374 172 Q 368 250, 392 302" strokeWidth="2.5" />
                      <path d="M 394 170 Q 390 246, 412 294" strokeWidth="2.3" />
                      <path d="M 414 169 Q 410 238, 430 282" strokeWidth="2.2" />
                      <path d="M 434 168 Q 430 230, 448 268" strokeWidth="2" />
                      <path d="M 452 168 Q 448 220, 464 254" strokeWidth="1.8" />
                      <path d="M 282 268 Q 348 308, 422 296" strokeWidth="2.6" strokeDasharray="5 3" />
                      <path d="M 308 172 L 280 226 L 304 284 L 296 360 L 306 420" strokeWidth="3" />
                      <path d="M 294 176 L 316 172 L 288 226 Z" fill="#38BDF8" fillOpacity="0.14" strokeWidth="1.8" />
                      <path d="M 585 174 L 642 194 L 625 214 L 578 190 Z" fill="#38BDF8" fillOpacity="0.14" strokeWidth="2" />
                      <path d="M 616 196 L 592 268 L 630 338 L 624 420" strokeWidth="3" />
                    </g>
                  </g>
                )}

                {/* =========================================================== */}
                {/* HIGH-DETAIL 3D INTERNAL ORGAN SYSTEMS (7 ZONES)             */}
                {/* =========================================================== */}

                {/* ZONE 4: DERMAL & COAT EPIDERMAL HEXAGONAL MATRIX + FOLLICLES */}
                <g
                  className="transition-all duration-500 cursor-pointer"
                  onClick={() => handleSelectZone('dermal-coat')}
                  opacity={isOrganIlluminated('dermal-coat') ? 1 : 0.3}
                  filter={isOrganIlluminated('dermal-coat') ? 'url(#organGlow)' : 'none'}
                >
                  <path
                    d="M 288 158 C 390 144, 520 142, 628 170 C 608 202, 425 200, 288 182 Z"
                    fill="url(#dermalHexPattern)"
                    stroke="#2DD4BF"
                    strokeWidth={isOrganIlluminated('dermal-coat') ? '2.8' : '1.4'}
                  />
                  <path
                    d="M 280 150 C 395 134, 530 134, 640 164"
                    fill="none"
                    stroke="#5EEAD4"
                    strokeWidth={isOrganIlluminated('dermal-coat') ? '3.8' : '1.6'}
                    strokeDasharray="8 4"
                  />
                  <circle cx="415" cy="146" r="4.5" fill="#99F6E4" />
                  <circle cx="465" cy="145" r="4.5" fill="#99F6E4" />
                  <circle cx="515" cy="148" r="4.5" fill="#99F6E4" />
                </g>

                {/* ZONE 1: OCULAR-NASAL SINUS, RINGED TRACHEA & MULTILOBED LUNGS */}
                <g
                  className="transition-all duration-500 cursor-pointer"
                  onClick={() => handleSelectZone('ocular-nasal-respiratory')}
                  opacity={isOrganIlluminated('ocular-nasal-respiratory') ? 1 : 0.36}
                  filter={isOrganIlluminated('ocular-nasal-respiratory') ? 'url(#organGlow)' : 'none'}
                >
                  <path
                    d={
                      species === 'feline'
                        ? 'M 124 176 C 132 156, 162 146, 184 156 C 192 166, 178 180, 152 182 Z'
                        : 'M 96 170 C 118 156, 156 146, 182 154 C 188 166, 166 178, 128 180 Z'
                    }
                    fill={isOrganIlluminated('ocular-nasal-respiratory') ? 'url(#organActiveCyan)' : 'url(#organDormant)'}
                    stroke="#5EEAD4"
                    strokeWidth="2.2"
                  />
                  <circle
                    cx={species === 'feline' ? '158' : '176'}
                    cy={species === 'feline' ? '164' : '150'}
                    r="8.5"
                    fill="#CCFBF1"
                    stroke="#14B8A6"
                    strokeWidth="2.2"
                  />
                  <path
                    d={
                      species === 'feline'
                        ? 'M 184 174 C 222 198, 264 214, 316 222'
                        : 'M 182 168 C 224 196, 266 214, 318 224'
                    }
                    fill="none"
                    stroke="#2DD4BF"
                    strokeWidth="8.5"
                    strokeLinecap="round"
                  />
                  <path
                    d={
                      species === 'feline'
                        ? 'M 184 174 C 222 198, 264 214, 316 222'
                        : 'M 182 168 C 224 196, 266 214, 318 224'
                    }
                    fill="none"
                    stroke="#0F172A"
                    strokeWidth="6.5"
                    strokeDasharray="2 5"
                  />
                  <path
                    d="M 306 196 C 338 180, 396 184, 414 218 C 426 248, 404 282, 366 280 C 332 278, 304 258, 298 232 C 294 214, 298 202, 306 196 Z"
                    fill={isOrganIlluminated('ocular-nasal-respiratory') ? 'url(#organActiveCyan)' : 'url(#organDormant)'}
                    stroke="#5EEAD4"
                    strokeWidth="2.4"
                  />
                  <path
                    d="M 316 222 L 352 226 M 352 226 L 382 210 M 352 226 L 392 236 M 352 226 L 374 256 M 334 224 L 354 202 M 334 224 L 344 252"
                    fill="none"
                    stroke="#CCFBF1"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </g>

                {/* ZONE 2: OTIC / EAR PINNA, AUDITORY CANAL & TYMPANIC BULLA */}
                <g
                  className="transition-all duration-500 cursor-pointer"
                  onClick={() => handleSelectZone('otic-ear')}
                  opacity={isOrganIlluminated('otic-ear') ? 1 : 0.36}
                  filter={isOrganIlluminated('otic-ear') ? 'url(#organGlow)' : 'none'}
                >
                  <path
                    d={
                      species === 'feline'
                        ? 'M 184 78 L 204 110 L 222 74 L 234 118 C 222 138, 196 138, 182 120 Z'
                        : 'M 192 108 L 216 76 L 242 108 C 234 136, 206 138, 192 118 Z'
                    }
                    fill={isOrganIlluminated('otic-ear') ? 'url(#organActiveCyan)' : 'url(#organDormant)'}
                    stroke="#5EEAD4"
                    strokeWidth="2.4"
                  />
                  <path
                    d={
                      species === 'feline'
                        ? 'M 210 112 L 208 134 L 196 142'
                        : 'M 218 104 L 214 128 L 202 136'
                    }
                    fill="none"
                    stroke="#CCFBF1"
                    strokeWidth="4.2"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={species === 'feline' ? '196' : '202'}
                    cy={species === 'feline' ? '142' : '136'}
                    r="8.5"
                    fill="#14B8A6"
                    stroke="#F0FDFA"
                    strokeWidth="2.2"
                  />
                </g>

                {/* ZONE 3: ORAL & DENTAL MAXILLA / MANDIBLE ARCADE */}
                <g
                  className="transition-all duration-500 cursor-pointer"
                  onClick={() => handleSelectZone('oral-dental')}
                  opacity={isOrganIlluminated('oral-dental') ? 1 : 0.36}
                  filter={isOrganIlluminated('oral-dental') ? 'url(#organGlow)' : 'none'}
                >
                  <path
                    d={
                      species === 'feline'
                        ? 'M 120 190 Q 152 186, 184 198 Q 156 220, 122 206 Z'
                        : 'M 90 180 Q 136 176, 178 190 Q 144 212, 92 196 Z'
                    }
                    fill={isOrganIlluminated('oral-dental') ? 'url(#organActiveCyan)' : 'url(#organDormant)'}
                    stroke="#5EEAD4"
                    strokeWidth="2.2"
                  />
                  <path
                    d={
                      species === 'feline'
                        ? 'M 126 196 L 130 202 L 135 196 L 142 201 L 148 196 L 156 202 L 164 197 L 172 202'
                        : 'M 98 186 L 104 193 L 110 186 L 118 192 L 126 186 L 136 193 L 146 187 L 158 194 L 168 188'
                    }
                    fill="none"
                    stroke="#F0FDFA"
                    strokeWidth="2.8"
                    strokeLinejoin="round"
                  />
                </g>

                {/* ZONE 7: SYSTEMIC / ZOONOTIC & IMMUNE NODE (CARDIAC CORE & AORTA) */}
                <g
                  className="transition-all duration-500 cursor-pointer"
                  onClick={() => handleSelectZone('systemic-immune')}
                  opacity={isOrganIlluminated('systemic-immune') ? 1 : 0.38}
                  filter={isOrganIlluminated('systemic-immune') ? 'url(#organGlow)' : 'none'}
                >
                  <path
                    d="M 212 182 Q 252 222, 286 248 M 286 248 Q 350 194, 445 192 T 595 212 M 286 248 Q 345 268, 425 262"
                    fill="none"
                    stroke="#2DD4BF"
                    strokeWidth="3"
                    strokeDasharray="6 3"
                  />
                  <path
                    d="M 272 232 C 278 220, 298 220, 304 234 C 310 250, 298 270, 284 272 C 270 268, 266 248, 272 232 Z"
                    fill={isOrganIlluminated('systemic-immune') ? 'url(#organActiveCyan)' : 'url(#organDormant)'}
                    stroke="#99F6E4"
                    strokeWidth="2.4"
                  />
                  <circle cx="222" cy="190" r="5.5" fill="#99F6E4" />
                  <circle cx="286" cy="248" r="6.5" fill="#F0FDFA" />
                  <circle cx="585" cy="212" r="5.5" fill="#99F6E4" />
                </g>

                {/* ZONE 5: GASTROINTESTINAL & HEPATIC ZONE (LIVER, STOMACH, INTESTINES) */}
                <g
                  className="transition-all duration-500 cursor-pointer"
                  onClick={() => handleSelectZone('gi-hepatic')}
                  opacity={isOrganIlluminated('gi-hepatic') ? 1 : 0.36}
                  filter={isOrganIlluminated('gi-hepatic') ? 'url(#organGlow)' : 'none'}
                >
                  <path
                    d="M 406 196 C 428 190, 446 210, 442 252 C 438 282, 412 292, 398 270 C 392 248, 396 212, 406 196 Z"
                    fill={isOrganIlluminated('gi-hepatic') ? 'url(#organActiveEmerald)' : 'url(#organDormant)'}
                    stroke="#6EE7B7"
                    strokeWidth="2.4"
                  />
                  <path
                    d="M 438 214 C 462 204, 486 218, 482 248 C 478 272, 452 280, 438 264 Z"
                    fill={isOrganIlluminated('gi-hepatic') ? 'url(#organActiveCyan)' : 'url(#organDormant)'}
                    stroke="#5EEAD4"
                    strokeWidth="2.4"
                  />
                  <path
                    d="M 464 232 C 504 222, 548 234, 554 268 C 558 298, 506 308, 468 294 C 446 284, 448 252, 464 232 Z"
                    fill={isOrganIlluminated('gi-hepatic') ? 'url(#organActiveCyan)' : 'url(#organDormant)'}
                    stroke="#5EEAD4"
                    strokeWidth="2.2"
                  />
                  <path
                    d="M 472 252 C 492 240, 524 246, 522 262 C 520 276, 482 268, 480 282 C 478 294, 524 294, 542 276"
                    fill="none"
                    stroke="#F0FDFA"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                  />
                </g>

                {/* ZONE 6: RENAL & URINARY TRACT ZONE (KIDNEYS, URETERS & BLADDER) */}
                <g
                  className="transition-all duration-500 cursor-pointer"
                  onClick={() => handleSelectZone('renal-urinary')}
                  opacity={isOrganIlluminated('renal-urinary') ? 1 : 0.36}
                  filter={isOrganIlluminated('renal-urinary') ? 'url(#organGlow)' : 'none'}
                >
                  <path
                    d="M 518 196 C 534 188, 552 196, 550 212 C 548 226, 526 228, 516 216 C 510 208, 512 200, 518 196 Z"
                    fill={isOrganIlluminated('renal-urinary') ? 'url(#organActiveCyan)' : 'url(#organDormant)'}
                    stroke="#5EEAD4"
                    strokeWidth="2.4"
                  />
                  <path
                    d="M 546 204 C 562 196, 578 204, 576 218 C 574 232, 554 234, 544 222 Z"
                    fill={isOrganIlluminated('renal-urinary') ? 'url(#organActiveCyan)' : 'url(#organDormant)'}
                    stroke="#5EEAD4"
                    strokeWidth="2.2"
                  />
                  <path
                    d="M 536 218 Q 576 244, 608 264 M 562 224 Q 590 246, 612 262"
                    fill="none"
                    stroke="#99F6E4"
                    strokeWidth="2.6"
                    strokeDasharray="4 2"
                  />
                  <path
                    d="M 604 256 C 622 246, 646 254, 646 272 C 646 290, 620 296, 604 282 C 594 274, 594 262, 604 256 Z"
                    fill={isOrganIlluminated('renal-urinary') ? 'url(#organActiveCyan)' : 'url(#organDormant)'}
                    stroke="#5EEAD4"
                    strokeWidth="2.6"
                  />
                  <circle cx="624" cy="270" r="5.5" fill="#F0FDFA" />
                </g>

                {/* =========================================================== */}
                {/* PRECISION LEADER CALLOUT LINES FROM ORGANS TO LABELS        */}
                {/* =========================================================== */}
                {ANATOMICAL_ZONES.map((zone) => {
                  const c = zone.coords[species] || zone.coords.feline;
                  const isActive = isOrganIlluminated(zone.id);
                  const x1 = c.svgX;
                  const y1 = c.svgY;
                  const x2 = 72 + (c.labelX / 100) * 726;
                  const y2 = 52 + (c.labelY / 100) * 392;
                  const midX = (x1 + x2) / 2;
                  return (
                    <g key={zone.id} className="pointer-events-none">
                      <polyline
                        points={`${x1},${y1} ${midX},${y2} ${x2},${y2}`}
                        fill="none"
                        stroke={isActive ? '#2DD4BF' : '#475569'}
                        strokeWidth={isActive ? '2.4' : '1.3'}
                        strokeDasharray={isActive ? 'none' : '3 3'}
                        opacity={isActive ? 0.95 : 0.45}
                      />
                      <circle
                        cx={x2}
                        cy={y2}
                        r={isActive ? '4.5' : '2.8'}
                        fill={isActive ? '#2DD4BF' : '#94A3B8'}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* ============================================================= */}
              {/* 7 LARGE TABLET-TOUCH 3D ANATOMICAL HOTSPOT BEACON PINS        */}
              {/* ============================================================= */}
              {ANATOMICAL_ZONES.map((zone) => {
                const c = zone.coords[species] || zone.coords.feline;
                const isActive = isOrganIlluminated(zone.id);
                const isPrimary = zone.id === activeZoneId;
                return (
                  <React.Fragment key={zone.id}>
                    {/* Organ Pin Beacon (Large 44px+ Touch Target) */}
                    <button
                      type="button"
                      onClick={() => handleSelectZone(zone.id)}
                      style={{ left: `${c.x}%`, top: `${c.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer focus:outline-none transition-transform duration-200 p-1.5 ${
                        isPrimary ? 'scale-125 z-40' : isActive ? 'scale-110 z-35' : 'active:scale-95'
                      }`}
                      title={`${zone.number}. ${zone.name} (${zone.productIds.length} Products)`}
                    >
                      {/* Pulsing Radar Ring */}
                      <span
                        className={`absolute inset-0.5 rounded-full animate-ping ${
                          isActive ? 'bg-teal-400/80' : 'bg-cyan-400/30'
                        }`}
                      />
                      {/* Beacon Core */}
                      <span
                        className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-black border-2 transition-all shadow-lg ${
                          isPrimary
                            ? 'bg-teal-400 text-slate-950 border-white shadow-[0_0_24px_rgba(20,184,166,1)]'
                            : isActive
                            ? 'bg-emerald-400 text-slate-950 border-white shadow-[0_0_18px_rgba(16,185,129,0.9)]'
                            : 'bg-slate-900/95 text-teal-300 border-teal-400/80'
                        }`}
                      >
                        {zone.number}
                      </span>
                    </button>

                    {/* Glassmorphic Callout Pill */}
                    <button
                      type="button"
                      onClick={() => handleSelectZone(zone.id)}
                      style={{ left: `${c.labelX}%`, top: `${c.labelY}%` }}
                      className={`hidden sm:flex absolute -translate-x-1/2 -translate-y-1/2 z-20 items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10.5px] font-extrabold whitespace-nowrap backdrop-blur-md transition-all cursor-pointer active:scale-95 ${
                        isActive
                          ? 'bg-teal-500/30 border-teal-300 text-white shadow-[0_0_20px_rgba(20,184,166,0.45)] scale-105 z-30'
                          : 'bg-slate-900/85 border-slate-700/80 text-slate-300 hover:border-teal-400/60 hover:text-white'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-teal-400/25 border border-teal-400/60 text-teal-200 flex items-center justify-center text-[9px] font-mono">
                        {zone.number}
                      </span>
                      <span>{zone.shortLabel.replace(/^\d+\.\s*/, '')}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/15 text-teal-200">
                        {zone.productIds.length}
                      </span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* ================================================================= */}
          {/* 7 ANATOMICAL ORGAN ZONES — FULL WRAPPED TABLET TOUCH GRID         */}
          {/* (All 7 Organ Protocols 100% Visible Without Hidden Scrolling!)    */}
          {/* ================================================================= */}
          <div className="relative z-20 mt-4 pt-3 border-t border-slate-800/90">
            <div className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center justify-between">
              <span>7 Anatomical Organ Zone Protocols (Tap Any Zone):</span>
              <span className="text-teal-400">All 7 Visible</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ANATOMICAL_ZONES.map((zone) => {
                const isActive = !activeCallFlow && zone.id === activeZoneId;
                const isIlluminated = isOrganIlluminated(zone.id);
                return (
                  <button
                    type="button"
                    key={zone.id}
                    onClick={() => handleSelectZone(zone.id)}
                    className={`min-h-[46px] px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-between gap-1.5 cursor-pointer border active:scale-95 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 border-teal-300 shadow-[0_0_16px_rgba(20,184,166,0.45)]'
                        : isIlluminated
                        ? 'bg-teal-950/90 text-teal-200 border-teal-400/60'
                        : 'bg-slate-900/95 text-slate-200 border-slate-700/80 hover:border-teal-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center flex-shrink-0 ${
                          isActive ? 'bg-slate-950 text-teal-300' : 'bg-teal-500/20 text-teal-300'
                        }`}
                      >
                        {zone.number}
                      </span>
                      <span className="truncate">{zone.shortLabel.replace(/^\d+\.\s*/, '')}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md flex-shrink-0 ${
                        isActive ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-800 text-teal-300'
                      }`}
                    >
                      {zone.productIds.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================================= */}
          {/* ALL 8 PRE-BUILT CLINICAL CALL FLOWS — FULL VISIBLE TABLET GRID    */}
          {/* (Zero Missing Protocols: All 8 Pre-Built Flows Shown at Once!)    */}
          {/* ================================================================= */}
          {callFlows && callFlows.length > 0 && (
            <div className="relative z-20 mt-4 pt-3.5 border-t border-slate-800/90">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-400" />
                  <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-teal-300">
                    All {callFlows.length} Pre-Built Clinical Call Flows (Tap to View or ▶ Launch)
                  </span>
                </div>
                {activeCallFlow && (
                  <button
                    type="button"
                    onClick={() => setSelectedCallFlowId(null)}
                    className="min-h-[34px] text-[10px] font-mono font-bold text-teal-300 hover:text-white px-2.5 py-1 rounded-lg bg-teal-500/15 border border-teal-400/30 cursor-pointer active:scale-95"
                  >
                    Reset to Single Organ
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {callFlows.map((flow) => {
                  const isSelected = selectedCallFlowId === flow.id;
                  const isZoneLinked = !selectedCallFlowId && activeZone.linkedFlowIds?.includes(flow.id);
                  const stepCount = flow.steps?.length || flow.productIds?.length || 0;

                  return (
                    <div
                      key={flow.id}
                      onClick={() => handleSelectCallFlow(flow)}
                      className={`group relative min-h-[54px] p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer active:scale-[0.98] ${
                        isSelected
                          ? 'bg-gradient-to-r from-teal-500/30 via-emerald-500/20 to-slate-900 border-teal-300 shadow-[0_0_22px_rgba(20,184,166,0.35)]'
                          : isZoneLinked
                          ? 'bg-slate-900/95 border-teal-500/50 text-slate-100'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border ${
                            isSelected
                              ? 'bg-teal-400 text-slate-950 border-white font-black'
                              : 'bg-slate-800 text-teal-300 border-slate-700 font-bold'
                          }`}
                        >
                          <span className="text-xs leading-none">{stepCount}</span>
                          <span className="text-[7px] uppercase tracking-tighter leading-none mt-0.5">Steps</span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: flow.accent || '#14B8A6' }}
                            />
                            <span className="text-[9.5px] font-mono uppercase tracking-wider text-teal-300 font-bold truncate">
                              {flow.badge || 'Clinical Flow'}
                            </span>
                          </div>
                          <div className="text-xs font-extrabold text-white line-clamp-1">
                            {flow.title}
                          </div>
                        </div>
                      </div>

                      {/* 1-Tap Direct Launch Button on Every Call Flow Card */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onLaunchFlow) {
                            onLaunchFlow(flow, 0);
                          }
                        }}
                        className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#0B431E] hover:bg-[#14632E] text-white border border-emerald-400/40 text-[11px] font-extrabold flex items-center gap-1 flex-shrink-0 shadow-md active:scale-95 cursor-pointer"
                        title={`Launch ${flow.title} directly in Full-Screen Mode`}
                      >
                        <Play className="w-3 h-3 fill-amber-300 text-amber-300" />
                        <span>Launch</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* RIGHT 50% (6 COLS): TOP-ALIGNED PROTOCOL LAUNCH & VISUAL TELEMETRY  */}
        {/* =================================================================== */}
        <div className="lg:col-span-6 bg-[#F8FAFC] text-slate-900 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            {/* --------------------------------------------------------------- */}
            {/* A. PROTOCOL / CALL FLOW HERO HEADER CARD (ALIGNED WITH 3D VIEW) */}
            {/* --------------------------------------------------------------- */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white via-white to-[#ECFDF5]/60 border border-slate-200/90 shadow-sm mb-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-[220px]">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-[#0B431E] text-white shadow-xs">
                      {activeCallFlow
                        ? `Pre-Built Call Flow • ${activeCallFlow.badge}`
                        : `Zone 0${activeZone.number} • ${activeZone.name}`}
                    </span>
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-teal-600" />
                      <span>
                        {activeCallFlow
                          ? CALL_FLOW_ANATOMY_MAP[activeCallFlow.id]?.organBadge || activeCallFlow.category
                          : activeZone.anatomicalStructure}
                      </span>
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-black text-[#0B431E] tracking-tight leading-snug">
                    {activeCallFlow ? activeCallFlow.title : activeZone.protocolTitle}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                    {activeCallFlow ? activeCallFlow.tagline : activeZone.clinicalSummary}
                  </p>
                </div>

                {/* 1-Tap Launch Entire Protocol Deck (Large 48px Tablet Touch Target) */}
                <button
                  type="button"
                  onClick={() => {
                    if (activeCallFlow && onLaunchFlow) {
                      onLaunchFlow(activeCallFlow, 0);
                    } else if (onLaunchZoneProtocol) {
                      onLaunchZoneProtocol(activeZone, species);
                    }
                  }}
                  className="min-h-[48px] px-5 py-3 rounded-2xl ui-3d-btn-primary text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-md active:scale-95"
                  title="Launch full-screen sequential presentation for this protocol"
                >
                  <Play className="w-4 h-4 fill-current text-amber-300" />
                  <span>
                    Launch Protocol ({displayedProducts.length})
                  </span>
                </button>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* B. VISUAL CLINICAL EVIDENCE & EFFICACY METRICS STRIP          */}
              {/* ------------------------------------------------------------- */}
              {activeMetrics.length > 0 && (
                <div className="mt-4 pt-3.5 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {activeMetrics.map((m, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className="text-sm sm:text-base font-black tracking-tight font-mono"
                          style={{ color: m.color || '#2DD4BF' }}
                        >
                          {m.value}
                        </span>
                        <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div className="text-[11px] font-extrabold text-white leading-tight">
                        {m.label}
                      </div>
                      <div className="text-[10px] text-slate-300 mt-0.5 leading-snug">
                        {m.sub}
                      </div>
                      <div className="mt-2 w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${m.percent || 90}%`,
                            backgroundColor: m.color || '#14B8A6',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* C. SEQUENTIAL STEP-BY-STEP CALL FLOW PIPELINE (1-TAP LAUNCH)  */}
              {/* ------------------------------------------------------------- */}
              {displayedProducts.length > 1 && (
                <div className="mt-3.5 pt-3 border-t border-slate-200/70">
                  <div className="flex items-center justify-between text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                    <span>Sequential Prescribing Pipeline (Tap Any Step to Start):</span>
                    <span className="text-[#0B431E]">{displayedProducts.length}-Step Clinical Pathway</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {displayedProducts.map((prod, idx) => {
                      const stepRole =
                        activeCallFlow?.steps?.[idx]?.role ||
                        activeZone.productMeta?.[prod.id]?.roleBadge?.split('•')?.[1]?.trim() ||
                        prod.specialty;
                      return (
                        <React.Fragment key={prod.id}>
                          <button
                            type="button"
                            onClick={() => {
                              if (activeCallFlow && onLaunchFlow) {
                                onLaunchFlow(activeCallFlow, idx);
                              } else if (handleProductSelect) {
                                handleProductSelect(prod, activeZone, species);
                              }
                            }}
                            className="group/step min-h-[44px] flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-[#E8F4EC] border border-slate-200 hover:border-[#0B431E] transition-all flex-shrink-0 cursor-pointer shadow-2xs active:scale-95"
                          >
                            <span className="w-6 h-6 rounded-lg bg-[#0B431E] text-white text-[11px] font-mono font-black flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <div className="text-left">
                              <div className="text-xs font-black text-slate-900 group-hover/step:text-[#0B431E] leading-none">
                                {prod.shortName || prod.name}
                              </div>
                              <div className="text-[9.5px] font-semibold text-slate-500 leading-none mt-1 truncate max-w-[120px]">
                                {stepRole}
                              </div>
                            </div>
                          </button>
                          {idx < displayedProducts.length - 1 && (
                            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* D. TARGET INDICATIONS & CLINICAL MECHANISM VISUAL SUMMARY     */}
              {/* ------------------------------------------------------------- */}
              <div className="mt-3.5 pt-3 border-t border-slate-200/70 flex flex-col gap-2">
                {activeIndications.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-extrabold uppercase text-slate-500 mr-1">
                      Indications:
                    </span>
                    {activeIndications.map((ind, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-lg text-[10.5px] font-bold bg-[#E8F4EC] text-[#0B431E] border border-[#0B431E]/20"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-slate-100/90 border border-slate-200/80 text-[11px] text-slate-700 leading-relaxed flex items-start gap-2">
                  <FileText className="w-3.5 h-3.5 text-[#0B431E] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-[#0B431E] uppercase text-[10px] tracking-wider mr-1.5">
                      Clinical Mechanism:
                    </span>
                    <span className="font-medium">{activeMechanismText}</span>
                  </div>
                </div>
              </div>

              {/* Zone Sub-Tabs (For Zone 4 Dermal Sub-Tabs & Zone 5 3-Step Pipeline when not in CallFlow override) */}
              {!activeCallFlow && activeZone.subTabs && (
                <div className="mt-3.5 pt-3 border-t border-slate-200/70 flex items-center gap-1.5 flex-wrap">
                  {activeZone.subTabs.map((tab) => {
                    const isSubActive = activeSubTab === tab.id;
                    return (
                      <button
                        type="button"
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                          isSubActive
                            ? 'bg-[#0B431E] text-white shadow-xs'
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

            {/* --------------------------------------------------------------- */}
            {/* E. VISUAL PRODUCT PROTOCOL CARDS (CLICK TO OPEN SLIDE DECK)     */}
            {/* --------------------------------------------------------------- */}
            <div className="space-y-2.5">
              {displayedProducts.map((product, idx) => {
                const meta = activeZone.productMeta?.[product.id] || {};
                const flowStep = activeCallFlow?.steps?.find((s) => s.productId === product.id);
                const brandStyle = getCompanyBrandStyle(product.companyId);
                const clinicalInfo = clinicalDatabase[product.id];
                const primaryIndication =
                  meta.indicationBadge ||
                  product.keyIndications?.[0] ||
                  product.headline;
                const dosingText =
                  product.id === 'virulys'
                    ? 'TWICE DAILY (BID) • Cats: 1–2 ml BID | Kittens: 0.5–1 ml BID'
                    : meta.dosingPill || product.dosingProtocol;
                const isBidHighlight = product.id === 'virulys' || meta.highlightBid;

                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      if (activeCallFlow && onLaunchFlow) {
                        onLaunchFlow(activeCallFlow, idx);
                      } else if (handleProductSelect) {
                        handleProductSelect(product, activeZone, species);
                      }
                    }}
                    className={`group relative rounded-2xl bg-white border transition-all duration-200 p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 cursor-pointer hover:shadow-xl active:scale-[0.99] ${
                      isBidHighlight
                        ? 'border-blue-400/90 ring-2 ring-blue-500/15'
                        : 'border-slate-200/90 hover:border-[#0B431E]/60'
                    }`}
                  >
                    {/* Packshot Studio Thumbnail */}
                    <div className="relative w-full sm:w-36 h-28 sm:h-24 rounded-xl bg-slate-100 border border-slate-200/70 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {product.slides && product.slides.length > 0 ? (
                        <img
                          src={product.slides[0]}
                          alt={product.name}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold">No Slide</span>
                      )}

                      {/* Slide Count Pill */}
                      <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-slate-900/85 text-white text-[9.5px] font-mono font-bold backdrop-blur-sm">
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
                            className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow-2xs"
                            style={{ backgroundColor: brandStyle.bg }}
                          >
                            {product.company}
                          </span>

                          {(flowStep?.role || meta.roleBadge) && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                              {flowStep ? `Step ${idx + 1} • ${flowStep.role}` : meta.roleBadge}
                            </span>
                          )}

                          {product.isTopTier && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                              <span>Core Focus</span>
                            </span>
                          )}
                        </div>

                        {/* Product Name & Open Slide Deck CTA */}
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">
                            {product.name}
                          </h4>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E8F4EC] text-xs font-extrabold text-[#0B431E] flex-shrink-0">
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
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold ${
                            isBidHighlight
                              ? 'bg-blue-600 text-white shadow-2xs'
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
              <span>Tap any product or pipeline step to launch full-screen e-detailing slides</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              16/16 Validated Portfolio
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
