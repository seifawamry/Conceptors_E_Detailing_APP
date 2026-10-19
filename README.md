# The Conceptors for Animal Health — E-Detailing PWA 🐾

An evidence-based, interactive Veterinary E-Detailing Progressive Web Application (PWA) built with **React 19**, **Vite 6**, and **Tailwind CSS**. Designed specifically for veterinary medical representatives detailing clinicians on iPads, tablets, and desktop workstations.

---

## 🌟 Portfolio Overview (16 Clinical Products)

The portfolio encompasses **16 veterinary therapies and rapid diagnostics** organized across 4 principal partner companies, with **10 Top-Tier Core Focus flagships** pinned across all views:

### 1. Catalysis (Brand Accent: Emerald `#10B981`)
- **Viusid Pets** (`★ Core Focus`): Potent glycyrrhizinic antiviral & cellular immune revitalization.
- **Viusid Detox** (`★ Core Focus`): 12-strain probiotic & antioxidant hepatic/gut microbiome reconstruction.
- **Carminal Pets** (`★ Core Focus`): Rapid gastric mucosal healing, acid reflux & antispasmodic colic relief.
- **Renalof Pets** (`★ Core Focus`): Activated *Agropyron repens* extract for calcium oxalate & struvite calculi dissolution (-70% volume).
- **Asprib Pets** (`★ Core Focus`): Activated eucalyptus & mint airway antiseptic, secretolytic, and canine distemper survival booster (+61% survival).
- **Blue Cap Pets Shampoo** (`★ Core Focus`): Kerato-seborrheic & Malassezia yeast wash (+22% hair diameter increase).

### 2. B.A.R.D (Brand Accent: Amber Gold `#F59E0B`)
- **Ecosin Clever Fungus** (`★ Core Focus`): Natural *Pythium oligandrum* mycoparasitic effervescent bath for dermatophytosis (ringworm).
- **Dermasin Oil** (`★ Core Focus`): Botanical lipid barrier restoration for hot/humid climate dermatitis & atopic skin.
- **Pythie Pet Veterinary Ointment** (`★ Core Focus`): Bioactive enzymatic wound debridement & rapid granulation for surgical incisions and trauma.
- **Pythie Pet Ear Cleaner**: Deep otic canal cleansing and soothing relief from otitis externa.
- **Pythie Pet Fresh Breath**: Daily drinking water bio-control disrupting oral plaque biofilms and halitosis.

### 3. Vitasignia (Brand Accent: Royal Blue `#3B82F6`)
- **Virulys** (`★ Core Focus`): Multimodal Feline URI resolution & antiviral defense. Calibrated 50:1 Lysine-to-Arginine ratio preventing feline hyperammonemia. Features dual-specialty indexing (**Respiratory & URI** + **Viral & Immunity**) and twice-daily recommended posology.

### 4. Ringbio Flexy® Rapid Diagnostics (Brand Accent: Magenta `#EC4899`)
- **Flexy Toxoplasma Ab**: 10-minute lateral flow screening for *Toxoplasma gondii* antibodies in dogs & cats.
- **Flexy Canine Parvovirus (CPV) Ag**: Rapid 10-minute fecal antigen triage for parvoviral enteritis.
- **Flexy Feline Panleukopenia (FPV) Ag**: Immediate bed-side fecal confirmation for feline distemper.
- **Flexy Coronavirus (FCoV) Ag**: Enteric coronavirus shedding detection in cats with chronic diarrhea or suspect FIP.

---

## 🩺 8 Pre-Built Clinical Call Flows

Complete, sequential prescribing pathways designed for rapid doctor engagement:
1. **Flagship Viral & GI Triple Protocol**: `Flexy CPV/FPV Ag` $\rightarrow$ `Viusid Pets` $\rightarrow$ `Carminal Pets` $\rightarrow$ `Viusid Detox`
2. **Feline URI & Multimodal Antiviral Defense**: `Virulys (Twice Daily)` $\rightarrow$ `Asprib Pets` $\rightarrow$ `Viusid Pets`
3. **5-Step Biological Dermatology Suite**: `Ecosin` $\rightarrow$ `Dermasin` $\rightarrow$ `Pythie Vet Ointment` $\rightarrow$ `Blue Cap Shampoo` $\rightarrow$ `Pythie Ear Cleaner`
4. **Feline Coronavirus (FCoV/FIP) & Enteric Shield**: `Flexy FCoV Ag` $\rightarrow$ `Viusid Pets` $\rightarrow$ `Carminal Pets` $\rightarrow$ `Viusid Detox`
5. **Renal Calculi Dissolution & Systemic Screening**: `Renalof Pets` $\rightarrow$ `Viusid Pets` $\rightarrow$ `Flexy Toxoplasma Ab`
6. **Canine Infectious Respiratory & Distemper Flow**: `Asprib Pets` $\rightarrow$ `Viusid Pets` $\rightarrow$ `Carminal Pets`
7. **Post-Surgical, Trauma & Tissue Regeneration Pathway**: `Pythie Pet Ointment` $\rightarrow$ `Viusid Pets` $\rightarrow$ `Viusid Detox`
8. **Canine & Feline Oral Bio-Defense Pathway**: `Pythie Pet Fresh Breath` $\rightarrow$ `Viusid Pets`

---

## ⚡ Detailing & Presentation Features

- **Full-Screen Cinema Showroom**: Direct 16:9 full-screen presentation mode (`requestFullscreen`).
- **Cluster Quick Switcher Dock**: Persistent floating dock allowing reps to switch between sibling products in the same therapeutic cluster in 1 single tap without leaving the active presentation.
- **Doctor Engagement Tools**: Red Laser Pointer (`L`), 60% Spotlight Dimmer (`S`), 2x Interactive Zoom & Pan (`Z`).
- **iPad & Tablet Swipe Gestures**: Smooth horizontal touch swipes to advance or rewind slides naturally.
- **1.5s Omni-Matrix (Thumb Zone)**: Instant zero-scroll modal overlay covering all 16 products in 4 neat company columns.
- **100% Offline Ready**: Pre-caches all 187 high-resolution WebP slides (20.5 MB total) via Service Worker and Cache Storage.
- **Call Analytics & Export**: Silently records time spent on every slide and exports structured CSV/JSON call summaries.

---

## 🚀 Deployment to Vercel

This repository is pre-configured for 1-click deployment on [Vercel](https://vercel.com):

1. **Import Project**: In your Vercel Dashboard, click **Add New** $\rightarrow$ **Project**.
2. **Select Repository**: Connect your GitHub account and select `Conceptors_E_Detailing_APP`.
3. **Build & Output Settings**:
   - **Framework Preset**: `Vite` (automatically detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. **Deploy**: Click **Deploy**. Vercel will build the project and assign a live production URL (e.g. `https://conceptors-e-detailing-app.vercel.app`).
5. **SPA Routing**: `vercel.json` is already configured with wildcard rewrites and immutable HTTP cache headers for WebP slides.

---

## 💻 Local Development

```bash
# 1. Clone repository
git clone https://github.com/seifawamry/Conceptors_E_Detailing_APP.git
cd Conceptors_E_Detailing_APP

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 🔄 Applying Future Amendments

- **Update Products or Protocols**: Edit `build_16_catalog.cjs` and run `node build_16_catalog.cjs` to automatically refresh `src/data/catalog.json`.
- **Add Slides**: Add WebP images to `public/slides/` and reference them in `build_16_catalog.cjs`.
- **Commit & Push**:
  ```bash
  git add .
  git commit -m "Update clinical flows and product data"
  git push origin main
  ```
  Vercel will automatically build and deploy new commits pushed to the `main` branch.
