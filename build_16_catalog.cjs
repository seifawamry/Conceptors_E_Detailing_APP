const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const SLIDES_DIR = path.join(ROOT_DIR, 'public', 'slides');
const DATA_DIR = path.join(ROOT_DIR, 'src', 'data');
const CATALOG_PATH = path.join(DATA_DIR, 'catalog.json');

fs.mkdirSync(SLIDES_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });

function copySlide(srcName, destName) {
  const src = path.join(SLIDES_DIR, srcName);
  const dest = path.join(SLIDES_DIR, destName);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    return true;
  }
  return false;
}

console.log('Mapping slides and generating enriched 16-product clinical catalog...');

// Build Catalog definition
const catalogData = {
  appName: "The Conceptors for Animal Health - E-Detailing PWA",
  version: "2.5.0",
  updatedAt: new Date().toISOString(),
  totalProducts: 16,
  topTierCount: 10,
  companies: [
    {
      id: "catalysis",
      name: "Catalysis",
      brandAccent: "#10B981",
      brandAccentLight: "#D1FAE5",
      tagline: "Molecular Activation Technology (MAT) in Veterinary Practice",
      products: [
        {
          id: "viusid",
          name: "Viusid Pets",
          shortName: "Viusid",
          company: "Catalysis",
          companyId: "catalysis",
          specialty: "Viral & Immunity",
          specialties: ["Viral & Immunity", "GI & Hepatic"],
          clusterId: "viral-immune-gi",
          clusterName: "Viral, Immunity & GI Suite",
          isTopTier: true,
          badge: "★ Core Focus",
          headline: "Revive Immunity • Restore Vitality",
          dosingProtocol: "1 ml per 5 kg body weight, twice daily (or mixed in food/drinking water)",
          keyIndications: [
            "Viral & bacterial infections (FHV, FCV, Parvovirus, Distemper)",
            "Immune deficiency & post-vaccination support (covers Vaccine Break)",
            "Post-illness fatigue and anorexia recovery"
          ],
          activeIngredients: "Activated Glycyrrhizinic Acid, Arginine, Glucosamine, Malic Acid, Zinc, B-Vitamins (B6, B12)",
          relatedProductIds: ["carminal", "viusid-detox", "asprib", "virulys", "flexy-cpv", "flexy-fpv"],
          slides: Array.from({ length: 9 }, (_, i) => `/slides/catalysis-viusid-slide-${i + 1}.webp`)
        },
        {
          id: "viusid-detox",
          name: "Viusid Detox",
          shortName: "Viusid Detox",
          company: "Catalysis",
          companyId: "catalysis",
          specialty: "GI & Hepatic",
          specialties: ["GI & Hepatic", "Viral & Immunity"],
          clusterId: "viral-immune-gi",
          clusterName: "Viral, Immunity & GI Suite",
          isTopTier: true,
          badge: "★ Core Focus",
          headline: "Detox • Restore • Strengthen",
          dosingProtocol: "1 ml per 5 kg body weight once/twice daily for 10-14 days post medication or severe stress",
          keyIndications: [
            "Post-antibiotic, chemotherapy or anti-inflammatory recovery",
            "Severe diarrhea and dysbiosis",
            "Hepatic and renal toxin elimination"
          ],
          activeIngredients: "Activated Antioxidants, 12 Probiotic Strains, Prebiotic Base, Activated Arginine & Malic Acid",
          relatedProductIds: ["carminal", "viusid", "flexy-cpv", "flexy-fpv"],
          slides: Array.from({ length: 6 }, (_, i) => `/slides/catalysis-viusid-detox-slide-${i + 1}.webp`)
        },
        {
          id: "carminal",
          name: "Carminal Pets",
          shortName: "Carminal",
          company: "Catalysis",
          companyId: "catalysis",
          specialty: "GI & Hepatic",
          specialties: ["GI & Hepatic"],
          clusterId: "viral-immune-gi",
          clusterName: "Viral, Immunity & GI Suite",
          isTopTier: true,
          badge: "★ Core Focus",
          headline: "Soothe the Gut • Heal from Within",
          dosingProtocol: "1 ml per 5 kg body weight, 2-3 times daily before feeding",
          keyIndications: [
            "Gastritis, acid reflux, heartburn & vomiting",
            "Colic, flatulence & bloating (rapid relief within 3 days)",
            "IBS, intestinal mucosal injury & peptic erosion"
          ],
          activeIngredients: "Activated Aloe Vera, Activated Fennel, Glutamine, L-Carnosine, Zinc, B-Complex",
          relatedProductIds: ["viusid", "viusid-detox", "flexy-cpv", "flexy-fcov"],
          slides: Array.from({ length: 7 }, (_, i) => `/slides/catalysis-carminal-slide-${i + 1}.webp`)
        },
        {
          id: "renalof",
          name: "Renalof Pets",
          shortName: "Renalof",
          company: "Catalysis",
          companyId: "catalysis",
          specialty: "Renal & Urinary",
          specialties: ["Renal & Urinary"],
          clusterId: "renal-diagnostics",
          clusterName: "Renal & Diagnostic Screening",
          isTopTier: true,
          badge: "★ Core Focus",
          headline: "Clear the Stones • Block Recurrence",
          dosingProtocol: "1 ml per 5 kg body weight, twice daily for 30 consecutive days",
          keyIndications: [
            "Calcium oxalate & struvite urolithiasis dissolution",
            "Cystitis, painful dysuria & lumbar discomfort",
            "Post-surgical stone recurrence prevention (proven -70% stone volume reduction)"
          ],
          activeIngredients: "Activated Agropyron Repens (Couch grass extract), Mannitol, Inositol, Triticin, Potassium Salts",
          relatedProductIds: ["viusid", "flexy-toxoplasma", "flexy-cpv"],
          slides: Array.from({ length: 8 }, (_, i) => `/slides/catalysis-renalof-slide-${i + 1}.webp`)
        },
        {
          id: "asprib",
          name: "Asprib Pets",
          shortName: "Asprib",
          company: "Catalysis",
          companyId: "catalysis",
          specialty: "Respiratory & URI",
          specialties: ["Respiratory & URI", "Viral & Immunity"],
          clusterId: "respiratory-immune",
          clusterName: "Respiratory, URI & Antiviral Suite",
          isTopTier: true,
          badge: "★ Core Focus",
          headline: "Clear Airways • Reduce Infection",
          dosingProtocol: "1 ml per 5 kg body weight, 2-3 times daily for 7-10 days",
          keyIndications: [
            "Canine Distemper (proven -61% mortality, -70% CNS symptoms, -14.3 recovery days)",
            "Kennel cough (Infectious tracheobronchitis), bronchitis, rhinitis",
            "Respiratory congestion, bronchial spasm & productive/dry cough"
          ],
          activeIngredients: "Activated Ascorbic Acid, Activated Eucalyptus Oil, Activated Mint, Flavonoids",
          relatedProductIds: ["virulys", "viusid"],
          slides: Array.from({ length: 7 }, (_, i) => `/slides/catalysis-asprib-slide-${i + 1}.webp`)
        },
        {
          id: "bluecap-shampoo",
          name: "Blue Cap Pets Shampoo",
          shortName: "Blue Cap Shampoo",
          company: "Catalysis",
          companyId: "catalysis",
          specialty: "Dermatology & Otitis",
          specialties: ["Dermatology & Otitis"],
          clusterId: "dermatology",
          clusterName: "Comprehensive Dermatology & Otitis Suite",
          isTopTier: true,
          badge: "★ Core Focus",
          headline: "Cleanse • Defend • Restore",
          dosingProtocol: "Bathe pet every 4 days; leave foam on coat for 5-10 minutes before rinsing; repeat for 24-day full cycle",
          keyIndications: [
            "Pruritic, sensitive & infected skin dermatoses",
            "Kerato-seborrheic disorder (100% resolution shown in clinical study)",
            "Malassezia yeast overgrowth & fungal infections (outperforms ketoconazole by +22% hair diameter)"
          ],
          activeIngredients: "Piroctone Olamine, Ceramides (NP, AP, EOP), Phytosphingosine, Vitamin E, Menthol",
          relatedProductIds: ["ecosin", "dermasin", "pythie-pet-ointment", "pythie-pet-ear-cleaner"],
          slides: Array.from({ length: 9 }, (_, i) => `/slides/catalysis-bluecap-shampoo-slide-${i + 1}.webp`)
        }
      ]
    },
    {
      id: "bard",
      name: "B.A.R.D",
      brandAccent: "#F59E0B",
      brandAccentLight: "#FEF3C7",
      tagline: "Eco-Friendly Biological Solutions with Pythium Oligandrum",
      products: [
        {
          id: "ecosin",
          name: "Ecosin Clever Fungus",
          shortName: "Ecosin",
          company: "B.A.R.D",
          companyId: "bard",
          specialty: "Dermatology & Otitis",
          specialties: ["Dermatology & Otitis"],
          clusterId: "dermatology",
          clusterName: "Comprehensive Dermatology & Otitis Suite",
          isTopTier: true,
          badge: "★ Core Focus",
          headline: "Clever Fungus Against Fungal & Yeast Skin Infections",
          dosingProtocol: "Dissolve 1 effervescent tablet in 2L lukewarm water (34°C); activate 20-30 min; bathe or spray 3x weekly",
          keyIndications: [
            "Dermatophytosis (Ringworm) in kittens, cats and dogs",
            "Malassezia dermatitis & chronic fungal dermatoses",
            "Severe alopecia, scaling, and pruritus"
          ],
          activeIngredients: "Pythium Oligandrum (natural mycoparasitic fungus), Citric Acid, Sorbitol, Silica, Sodium Bicarbonate",
          relatedProductIds: ["dermasin", "pythie-pet-ointment", "bluecap-shampoo", "pythie-pet-ear-cleaner"],
          slides: Array.from({ length: 7 }, (_, i) => `/slides/bard-ecosin-slide-${i + 1}.webp`)
        },
        {
          id: "dermasin",
          name: "Dermasin Oil",
          shortName: "Dermasin",
          company: "B.A.R.D",
          companyId: "bard",
          specialty: "Dermatology & Otitis",
          specialties: ["Dermatology & Otitis"],
          clusterId: "dermatology",
          clusterName: "Comprehensive Dermatology & Otitis Suite",
          isTopTier: true,
          badge: "★ Core Focus",
          headline: "Soothing Relief • Lasting Skin Barrier Protection",
          dosingProtocol: "Add 1 tsp to 1L bath or rub gently directly onto moistened skin; leave 10 min, gently blot excess",
          keyIndications: [
            "Dermatitis & Eczema in high temperature/humidity climates (GCC region)",
            "Dry, flaky, pruritic skin and atopic skin barrier disruption",
            "Synergistic partner with Ecosin for complete hydration & recovery"
          ],
          activeIngredients: "Pythium Oligandrum, Olea Europaea Fruit Oil, Eucalyptus Globulus Oil, Tocopherol",
          relatedProductIds: ["ecosin", "pythie-pet-ointment", "bluecap-shampoo", "pythie-pet-ear-cleaner"],
          slides: Array.from({ length: 6 }, (_, i) => `/slides/bard-dermasin-slide-${i + 1}.webp`)
        },
        {
          id: "pythie-pet-ointment",
          name: "Pythie Pet Veterinary Ointment",
          shortName: "Pythie Pet Vet Ointment",
          company: "B.A.R.D",
          companyId: "bard",
          specialty: "Dermatology & Otitis",
          specialties: ["Dermatology & Otitis"],
          clusterId: "dermatology",
          clusterName: "Comprehensive Dermatology & Otitis Suite",
          isTopTier: true,
          badge: "★ Core Focus",
          headline: "Natural Healing • Faster Wound Recovery",
          dosingProtocol: "Apply thin layer to cleansed & moistened skin several times daily until completely healed",
          keyIndications: [
            "Abrasions, lacerations, burns, and post-surgical wounds",
            "Puncture wounds, abscesses, insect bites & contusions",
            "Promotes tissue regeneration, debridement & microbial inhibition"
          ],
          activeIngredients: "Pythium Oligandrum, Petrolatum, Panicum Miliaceum, Silica",
          relatedProductIds: ["ecosin", "dermasin", "bluecap-shampoo", "pythie-pet-ear-cleaner"],
          slides: Array.from({ length: 5 }, (_, i) => `/slides/bard-pythie-pet-vet-ointment-slide-${i + 1}.webp`)
        },
        {
          id: "pythie-pet-ear-cleaner",
          name: "Pythie Pet Ear Cleaner",
          shortName: "Pythie Pet Ear Cleaner",
          company: "B.A.R.D",
          companyId: "bard",
          specialty: "Dermatology & Otitis",
          specialties: ["Dermatology & Otitis"],
          clusterId: "dermatology",
          clusterName: "Comprehensive Dermatology & Otitis Suite",
          isTopTier: false,
          badge: "Clinical Care",
          headline: "Relief from Otitis Externa: Cleanse, Soothe, and Protect",
          dosingProtocol: "Pump a few drops into ear canal, gently massage ear base, wipe clean with gauze; use as needed",
          keyIndications: [
            "Otitis externa (Malassezia, Pseudomonas, Staphylococcus)",
            "Excessive earwax buildup, foul odor & ear discharge",
            "Ear scratching, head shaking & canal erythema/inflammation"
          ],
          activeIngredients: "Pythium Oligandrum, Olea Europaea Oil, Helianthus Annuus Seed Oil, Zea Mays Extract, Tocopherol",
          relatedProductIds: ["ecosin", "dermasin", "bluecap-shampoo", "pythie-pet-ointment"],
          slides: Array.from({ length: 7 }, (_, i) => `/slides/bard-pythie-pet-ear-cleaner-slide-${i + 1}.webp`)
        },
        {
          id: "pythie-pet-fresh-breath",
          name: "Pythie Pet Fresh Breath",
          shortName: "Pythie Pet Fresh Breath",
          company: "B.A.R.D",
          companyId: "bard",
          specialty: "Dental & Oral Care",
          specialties: ["Dental & Oral Care"],
          clusterId: "dental-oral",
          clusterName: "Dental & Oral Hygiene",
          isTopTier: false,
          badge: "Dental Care",
          headline: "Bright Smiles, Fresh Breath — Happy Dogs!",
          dosingProtocol: "Dispense into drinking water daily for 1 week (Small <10kg: 5 drops/100ml; Medium 10-25kg: 10 drops/200ml; Large >25kg: 15 drops/400ml)",
          keyIndications: [
            "Halitosis (persistent bad breath) in dogs and cats",
            "Gingivitis, inflamed gums & periodontal disease prevention",
            "Controls oral bacteria and plaque biofilm formation"
          ],
          activeIngredients: "Pythium Oligandrum, Olea Europaea Fruit Oil, Helianthus Annuus Seed Oil, Tocopherol",
          relatedProductIds: ["viusid"],
          slides: Array.from({ length: 7 }, (_, i) => `/slides/bard-pythie-pet-fresh-breath-slide-${i + 1}.webp`)
        }
      ]
    },
    {
      id: "vitasignia",
      name: "Vitasignia",
      brandAccent: "#3B82F6",
      brandAccentLight: "#DBEAFE",
      tagline: "Advanced Multimodal Feline Health Solutions",
      products: [
        {
          id: "virulys",
          name: "Virulys",
          shortName: "Virulys",
          company: "Vitasignia",
          companyId: "vitasignia",
          specialty: "Respiratory & URI • Viral & Immunity",
          specialties: ["Respiratory & URI", "Viral & Immunity"],
          clusterId: "respiratory-immune",
          clusterName: "Respiratory, URI & Antiviral Suite",
          isTopTier: true,
          badge: "★ Core Focus",
          headline: "Beyond Lysine. Multimodal URI Resolution & Antiviral Defense",
          dosingProtocol: "⭐ TWICE A DAY RECOMMENDED DOSING: Kitten (under 6 mo): 1-2 ml BID | Adult Cat: 2 ml BID (oral syringe / palatable paste)",
          keyIndications: [
            "Feline Upper Respiratory Infections (FHV-1, FCV)",
            "Dual-Action: Potent viral immune defense + rapid mucosal respiratory clearance",
            "Preserves lysine dominance (500mg) while including calibrated 10mg Arginine (50:1 ratio) to prevent feline hyperammonemia safely"
          ],
          activeIngredients: "L-Lysine (500mg), Ginger Extract, Taurine, Geranium (Pelargonium sidoides) Extract, Calibrated Arginine (10mg)",
          relatedProductIds: ["asprib", "viusid"],
          slides: Array.from({ length: 5 }, (_, i) => `/slides/vitasignia-virulys-slide-${i + 1}.webp`)
        }
      ]
    },
    {
      id: "ringbio",
      name: "Ringbio",
      brandAccent: "#EC4899",
      brandAccentLight: "#FCE7F3",
      tagline: "Flexy® Rapid Diagnostic Veterinary Test Cards",
      products: [
        {
          id: "flexy-toxoplasma",
          name: "Flexy Toxoplasma Antibody Rapid Test Card",
          shortName: "Flexy Toxoplasma Ab",
          company: "Ringbio",
          companyId: "ringbio",
          specialty: "Rapid Diagnostics",
          specialties: ["Rapid Diagnostics"],
          clusterId: "rapid-diagnostics",
          clusterName: "Rapid Diagnostic & In-Clinic Triage",
          isTopTier: false,
          badge: "Rapid Diagnostic",
          headline: "Fast / Accurate / Sensitive — 10 Minutes Detection",
          dosingProtocol: "Lateral flow cassette for serum or whole blood; 15 test cassette kit; results in 10 minutes",
          keyIndications: [
            "Rapid screening for Toxoplasma gondii antibodies in canines and felines",
            "100% Specificity, >95% Sensitivity",
            "Supports clinical decision-making before prescribing immunomodulators"
          ],
          activeIngredients: "Colloidal Gold Immunoassay Test Cassette, 15 pcs, Pipettes, Swabs",
          relatedProductIds: ["viusid", "renalof"],
          slides: [
            "/slides/ringbio-flexy-toxoplasma-slide-1.webp",
            "/slides/ringbio-flexy-toxoplasma-slide-2.webp",
            "/slides/ringbio-flexy-toxoplasma-slide-3.webp"
          ]
        },
        {
          id: "flexy-cpv",
          name: "Flexy Canine Parvovirus Antigen Test Card",
          shortName: "Flexy CPV Ag",
          company: "Ringbio",
          companyId: "ringbio",
          specialty: "Rapid Diagnostics",
          specialties: ["Rapid Diagnostics"],
          clusterId: "rapid-diagnostics",
          clusterName: "Rapid Diagnostic & In-Clinic Triage",
          isTopTier: false,
          badge: "Rapid Diagnostic",
          headline: "Canine Parvovirus (CPV) Antigen Detection in Feces",
          dosingProtocol: "Feces swab sample with sample buffer; 10 min detection time; 15 tests per kit",
          keyIndications: [
            "Emergency diagnosis of acute hemorrhagic diarrhea and parvoviral enteritis in puppies",
            "Immediate triage to initiate supportive therapy (Viusid + Carminal + Viusid Detox)",
            "High specificity and sensitivity to prevent clinic contamination"
          ],
          activeIngredients: "Monoclonal Anti-CPV Antibody Cassette, Sample Buffer, Swabs",
          relatedProductIds: ["viusid", "carminal", "viusid-detox"],
          slides: [
            "/slides/ringbio-flexy-cpv-slide-1.webp",
            "/slides/ringbio-flexy-cpv-slide-2.webp",
            "/slides/ringbio-flexy-cpv-slide-3.webp"
          ]
        },
        {
          id: "flexy-fpv",
          name: "Flexy Feline Panleukopenia Virus (FPV) Ag Rapid Test Card",
          shortName: "Flexy FPV Ag",
          company: "Ringbio",
          companyId: "ringbio",
          specialty: "Rapid Diagnostics",
          specialties: ["Rapid Diagnostics"],
          clusterId: "rapid-diagnostics",
          clusterName: "Rapid Diagnostic & In-Clinic Triage",
          isTopTier: false,
          badge: "Rapid Diagnostic",
          headline: "Feline Panleukopenia (FPV) Antigen Detection in Feces",
          dosingProtocol: "Fecal swab in buffer tube; 10 minutes rapid visual test result",
          keyIndications: [
            "Feline distemper / panleukopenia emergency testing in kittens and cats",
            "Triage for immediate antiviral and immune support protocol (Viusid + Detox)",
            "Essential for catteries, rescue shelters, and inpatient hospitalization"
          ],
          activeIngredients: "FPV Antigen Test Cassette (15 pcs), Buffer Vials, Pipettes, Swabs",
          relatedProductIds: ["viusid", "carminal", "viusid-detox"],
          slides: [
            "/slides/ringbio-flexy-fpv-slide-1.webp",
            "/slides/ringbio-flexy-fpv-slide-2.webp",
            "/slides/ringbio-flexy-fpv-slide-3.webp"
          ]
        },
        {
          id: "flexy-fcov",
          name: "Flexy Coronavirus (FCoV) AntiGEN Test Card",
          shortName: "Flexy FCoV Ag",
          company: "Ringbio",
          companyId: "ringbio",
          specialty: "Rapid Diagnostics",
          specialties: ["Rapid Diagnostics"],
          clusterId: "rapid-diagnostics",
          clusterName: "Rapid Diagnostic & In-Clinic Triage",
          isTopTier: false,
          badge: "Rapid Diagnostic",
          headline: "Feline Enteric Coronavirus (FCoV) Antigen Rapid Detection",
          dosingProtocol: "Fresh feces swab sample; 10 min lateral flow detection",
          keyIndications: [
            "Detection of FCoV shedding in cats with chronic diarrhea or suspect FIP",
            "Early identification to initiate mucosal and gastrointestinal stabilization with Carminal",
            "High accuracy and clean visual readout"
          ],
          activeIngredients: "Anti-FCoV Test Cassettes (15 pcs), Extraction Buffer, Swabs",
          relatedProductIds: ["carminal", "viusid", "viusid-detox"],
          slides: [
            "/slides/ringbio-flexy-fcov-slide-1.webp",
            "/slides/ringbio-flexy-fcov-slide-2.webp",
            "/slides/ringbio-flexy-fcov-slide-3.webp"
          ]
        }
      ]
    }
  ],
  callFlows: [
    {
      id: "viral-gi-protocol",
      title: "Flagship Viral & GI Triple Protocol",
      tagline: "Bedside In-Clinic Triage & Gastrointestinal Restoration",
      accent: "#10B981",
      category: "Viral, Immunity & Enteric Care",
      badge: "Flagship Protocol",
      steps: [
        { step: 1, role: "In-Clinic Triage", productId: "flexy-cpv", label: "Flexy CPV/FPV Rapid Test" },
        { step: 2, role: "Viral Suppression", productId: "viusid", label: "Viusid Pets" },
        { step: 3, role: "Gastric Mucosal Repair", productId: "carminal", label: "Carminal Pets" },
        { step: 4, role: "Microbiome Detox", productId: "viusid-detox", label: "Viusid Detox" }
      ],
      productIds: ["flexy-cpv", "viusid", "carminal", "viusid-detox"],
      clinicalRationale: "Begin with Flexy 10-minute diagnostic card for instant fecal confirmation. Initiate Viusid for glycyrrhizinic acid viral suppression, Carminal for rapid relief of colic and reflux, followed by Viusid Detox with 12 probiotic strains to reconstruct the damaged gut microbiome.",
      targetIndications: ["Canine Parvovirus Enteritis", "Feline Panleukopenia", "Severe Diarrhea & Vomiting", "Post-Infection Dysbiosis"]
    },
    {
      id: "feline-uri-protocol",
      title: "Feline URI & Multimodal Antiviral Defense",
      tagline: "Targeted FHV-1 Inhibition, Twice-Daily Dosing & Bronchial Clearance",
      accent: "#3B82F6",
      category: "Respiratory & Antiviral Immunity",
      badge: "Core URI Suite",
      steps: [
        { step: 1, role: "FHV-1 Viral Block", productId: "virulys", label: "Virulys (Twice Daily)" },
        { step: 2, role: "Airway Clearance", productId: "asprib", label: "Asprib Pets" },
        { step: 3, role: "Systemic Immunity", productId: "viusid", label: "Viusid Pets" }
      ],
      productIds: ["virulys", "asprib", "viusid"],
      clinicalRationale: "Virulys delivers calibrated twice-daily L-Lysine dominance (50:1 ratio) to shut down FHV-1 replication without risking hyperammonemia. Asprib provides natural eucalyptus and mint expectorant clearance, while Viusid boosts systemic T-cell count and mucosal resilience.",
      targetIndications: ["Feline Herpesvirus (FHV-1)", "Feline Calicivirus (FCV)", "Severe Sneezing & Conjunctivitis", "Tracheobronchial Congestion"]
    },
    {
      id: "dermatology-protocol",
      title: "Comprehensive 5-Step Biological Dermatology Suite",
      tagline: "Biological Mycoparasitic Control, Lipid Barrier Restoration & Malassezia Wash",
      accent: "#F59E0B",
      category: "Dermatology, Wound & Otitis",
      badge: "Dermatology Suite",
      steps: [
        { step: 1, role: "Biological Cleansing", productId: "ecosin", label: "Ecosin (Clever Fungus)" },
        { step: 2, role: "Skin Barrier Oil", productId: "dermasin", label: "Dermasin Oil" },
        { step: 3, role: "Tissue Regeneration", productId: "pythie-pet-ointment", label: "Pythie Vet Ointment" },
        { step: 4, role: "Seborrheic Wash", productId: "bluecap-shampoo", label: "Blue Cap Shampoo" },
        { step: 5, role: "Otic Protection", productId: "pythie-pet-ear-cleaner", label: "Pythie Ear Cleaner" }
      ],
      productIds: ["ecosin", "dermasin", "pythie-pet-ointment", "bluecap-shampoo", "pythie-pet-ear-cleaner"],
      clinicalRationale: "A complete 5-step dermatological clinical pathway. Ecosin effervescent bath attacks fungal ringworm hyphae, Dermasin restores epidermal lipids in humid/dry climates, Pythie Pet ointment accelerates open wound closure, Blue Cap Shampoo eradicates Malassezia yeast (+22% hair diameter increase), and Pythie Pet Ear Cleaner resolves otitis externa.",
      targetIndications: ["Ringworm (Dermatophytosis)", "Malassezia Yeast Dermatitis", "Atopic Eczema & Pruritus", "Otitis Externa & Abrasions"]
    },
    {
      id: "feline-fip-enteric-flow",
      title: "Feline Coronavirus (FCoV/FIP) & Enteric Shield",
      tagline: "In-Clinic Antigen Confirmation & Anti-Inflammatory Gut Shield",
      accent: "#EC4899",
      category: "Feline Enteric & Coronavirus",
      badge: "Enteric Shield",
      steps: [
        { step: 1, role: "Antigen Triage", productId: "flexy-fcov", label: "Flexy FCoV Ag Card" },
        { step: 2, role: "Antiviral Defense", productId: "viusid", label: "Viusid Pets" },
        { step: 3, role: "Mucosal Coating", productId: "carminal", label: "Carminal Pets" },
        { step: 4, role: "Gut Stabilization", productId: "viusid-detox", label: "Viusid Detox" }
      ],
      productIds: ["flexy-fcov", "viusid", "carminal", "viusid-detox"],
      clinicalRationale: "Screen symptomatic cats exhibiting persistent diarrhea or malaise with the 10-minute Flexy FCoV Antigen card. Deploy Viusid for antioxidant cell preservation, Carminal for mucosal healing and antispasmodic comfort, and Viusid Detox with 12 probiotic strains to reverse enteropathy.",
      targetIndications: ["Feline Enteric Coronavirus (FCoV)", "Suspected FIP Enteric Phase", "Chronic Lymphocytic Enteritis", "Persistent Feline Diarrhea"]
    },
    {
      id: "renal-diagnostics-flow",
      title: "Renal Calculi Dissolution & Systemic Screening",
      tagline: "Agropyron Repens Anti-Lithic Therapy (-70% Stone Volume) & Protozoal Triage",
      accent: "#EC4899",
      category: "Renal & Emergency Screening",
      badge: "Urological Protocol",
      steps: [
        { step: 1, role: "Calculi Dissolution", productId: "renalof", label: "Renalof Pets" },
        { step: 2, role: "Systemic Resistance", productId: "viusid", label: "Viusid Pets" },
        { step: 3, role: "In-Clinic Screening", productId: "flexy-toxoplasma", label: "Flexy Toxoplasma Ab" }
      ],
      productIds: ["renalof", "viusid", "flexy-toxoplasma"],
      clinicalRationale: "Renalof Agropyron repens extract lubricates the urinary tract and breaks down calcium oxalate and struvite calculi (proven -70% stone volume). Paired with Viusid for renal cell preservation and Ringbio 10-minute diagnostic cards to rule out concurrent protozoal and viral strains.",
      targetIndications: ["Urolithiasis (Calcium Oxalate/Struvite)", "Feline Lower Urinary Tract Disease (FLUTD)", "Dysuria & Cystitis", "Protozoal Screening"]
    },
    {
      id: "canine-respiratory-distemper",
      title: "Canine Infectious Respiratory & Distemper Flow",
      tagline: "Proven Survival Enhancement (+61%) in Severe Viral Tracheobronchitis",
      accent: "#10B981",
      category: "Canine Respiratory & Emergency Care",
      badge: "Emergency Care",
      steps: [
        { step: 1, role: "Airway Antiseptic", productId: "asprib", label: "Asprib Pets" },
        { step: 2, role: "Systemic Antiviral", productId: "viusid", label: "Viusid Pets" },
        { step: 3, role: "Digestive Recovery", productId: "carminal", label: "Carminal Pets" }
      ],
      productIds: ["asprib", "viusid", "carminal"],
      clinicalRationale: "Asprib's activated eucalyptus, mint, and ascorbic acid control microbial growth and ease airway spasms. When coupled with Viusid, clinical trials prove a 61% reduction in distemper mortality, a 70% decrease in CNS symptoms, and a 14.3-day acceleration in recovery.",
      targetIndications: ["Canine Distemper (Morbillivirus)", "Kennel Cough (Infectious Tracheobronchitis)", "Severe Bronchial Congestion", "Secondary GI Enteritis"]
    },
    {
      id: "post-surgical-wound-flow",
      title: "Post-Surgical, Trauma & Tissue Regeneration Pathway",
      tagline: "Topical Bio-Granulation Coupled with Systemic Tissue Repair",
      accent: "#F59E0B",
      category: "Surgical Recovery & Wound Care",
      badge: "Regenerative Care",
      steps: [
        { step: 1, role: "Bio-Debridement", productId: "pythie-pet-ointment", label: "Pythie Vet Ointment" },
        { step: 2, role: "Collagen Support", productId: "viusid", label: "Viusid Pets" },
        { step: 3, role: "Post-Rx Detox", productId: "viusid-detox", label: "Viusid Detox" }
      ],
      productIds: ["pythie-pet-ointment", "viusid", "viusid-detox"],
      clinicalRationale: "Pythie Pet Veterinary Ointment deploys Pythium oligandrum to enzymatically debride necrotic debris and accelerate granulation without stinging. Viusid provides activated arginine and zinc for rapid collagen cross-linking, while Viusid Detox restores gut microflora following perioperative antibiotics.",
      targetIndications: ["Post-Operative Incisions", "Traumatic Lacerations & Bite Wounds", "Thermal & Chemical Burns", "Post-Antibiotic Fatigue"]
    },
    {
      id: "dental-oral-hygiene-flow",
      title: "Canine & Feline Oral Bio-Defense Pathway",
      tagline: "Daily Drinking Water Microflora Balance & Gum Regeneration",
      accent: "#F59E0B",
      category: "Dental & Oral Hygiene",
      badge: "Preventive Care",
      steps: [
        { step: 1, role: "Oral Biocontrol", productId: "pythie-pet-fresh-breath", label: "Pythie Fresh Breath" },
        { step: 2, role: "Tissue Recovery", productId: "viusid", label: "Viusid Pets" }
      ],
      productIds: ["pythie-pet-fresh-breath", "viusid"],
      clinicalRationale: "Pythie Pet Fresh Breath utilizes Pythium oligandrum and natural botanical oils in daily drinking water to inhibit bacterial biofilm and halitosis, while Viusid provides systemic arginine and zinc for rapid gingival healing.",
      targetIndications: ["Severe Halitosis", "Gingivitis & Stomatitis", "Periodontal Plaque Prevention", "Post-Dental Scaling Support"]
    }
  ]
};

fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalogData, null, 2), 'utf-8');
console.log(`Successfully generated updated clinical catalog at:\n  ${CATALOG_PATH}`);
