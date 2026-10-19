const fs = require('fs');
const path = require('path');

// Root working directory (scratch)
const ROOT_DIR = __dirname;
const TARGET_SLIDES_DIR = path.join(ROOT_DIR, 'public', 'slides');
const CATALOG_DIR = path.join(ROOT_DIR, 'src', 'data');
const CATALOG_FILE = path.join(CATALOG_DIR, 'catalog.json');

/**
 * 1. Recursively find all .webp files in scratch, ignoring node_modules,
 * .git, and the destination public/slides directory.
 */
function findWebpFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') {
        continue;
      }
      // Avoid scanning the destination folder
      if (path.resolve(fullPath) === path.resolve(TARGET_SLIDES_DIR)) {
        continue;
      }
      findWebpFiles(fullPath, fileList);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.webp')) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

/**
 * 2. Identify Company and Product from parent subfolder names.
 * Standardizes to the 4 companies: "Catalysis", "B.A.R.D", "Vitasignia", "Ringbio"
 */
function identifyCompanyAndProduct(filePath) {
  const relPath = path.relative(ROOT_DIR, filePath);
  const pathSignature = relPath.toLowerCase().replace(/\\/g, '/');

  // Catalysis - BlueCap Shampoo
  if (pathSignature.includes('bluecap')) {
    return {
      company: 'Catalysis',
      companySlug: 'catalysis',
      product: 'BlueCap Pets Shampoo',
      productSlug: 'bluecap-shampoo',
    };
  }

  // Catalysis - Core E-Detailing Portfolio
  if (
    pathSignature.includes('presentation-slides') ||
    pathSignature.includes('catalysis')
  ) {
    return {
      company: 'Catalysis',
      companySlug: 'catalysis',
      product: 'E-Detailing Portfolio',
      productSlug: 'edetailing',
    };
  }

  // B.A.R.D - Pythium Oligandrum products
  if (pathSignature.includes('bard')) {
    return {
      company: 'B.A.R.D',
      companySlug: 'bard',
      product: 'Pythium Oligandrum',
      productSlug: 'pythium-oligandrum',
    };
  }

  // Vitasignia - Virulys
  if (
    pathSignature.includes('virulys') ||
    pathSignature.includes('vitasignia')
  ) {
    return {
      company: 'Vitasignia',
      companySlug: 'vitasignia',
      product: 'Virulys',
      productSlug: 'virulys',
    };
  }

  // Ringbio - Rapid Tests
  if (
    pathSignature.includes('ringbio') ||
    pathSignature.includes('rapid-test') ||
    pathSignature.includes('flexy')
  ) {
    return {
      company: 'Ringbio',
      companySlug: 'ringbio',
      product: 'Rapid Diagnostic Tests',
      productSlug: 'rapid-tests',
    };
  }

  return null;
}

function main() {
  console.log('='.repeat(70));
  console.log('SCANNING AND ORGANIZING PRESENTATION SLIDES');
  console.log('='.repeat(70));
  console.log(`Working Directory: ${ROOT_DIR}`);
  console.log(`Destination Directory: ${TARGET_SLIDES_DIR}`);
  console.log(`Catalog JSON Output: ${CATALOG_FILE}\n`);

  // Ensure directories exist
  fs.mkdirSync(TARGET_SLIDES_DIR, { recursive: true });
  fs.mkdirSync(CATALOG_DIR, { recursive: true });

  // Clean up legacy unprefixed slides in public/slides (e.g. slide-1.webp)
  const existingFiles = fs.readdirSync(TARGET_SLIDES_DIR);
  let cleanedCount = 0;
  for (const f of existingFiles) {
    if (/^slide-\d+\.webp$/i.test(f)) {
      fs.unlinkSync(path.join(TARGET_SLIDES_DIR, f));
      cleanedCount++;
    }
  }
  if (cleanedCount > 0) {
    console.log(`Cleaned up ${cleanedCount} legacy unprefixed slide file(s) in public/slides.\n`);
  }

  // Step 1: Scan for webp files
  const allWebpFiles = findWebpFiles(ROOT_DIR);
  console.log(`Found ${allWebpFiles.length} source .webp file(s) across subfolders.\n`);

  // Step 2 & 3: Group, copy, and rename
  // Structure: companyMap[companyName] = { company, companySlug, products: { [productSlug]: { ... } } }
  const companyMap = {
    'Catalysis': { name: 'Catalysis', slug: 'catalysis', products: {} },
    'B.A.R.D': { name: 'B.A.R.D', slug: 'bard', products: {} },
    'Vitasignia': { name: 'Vitasignia', slug: 'vitasignia', products: {} },
    'Ringbio': { name: 'Ringbio', slug: 'ringbio', products: {} },
  };

  let totalCopied = 0;

  for (const filePath of allWebpFiles) {
    const info = identifyCompanyAndProduct(filePath);
    if (!info) {
      console.warn(`[WARN] Skipping unrecognized file: ${filePath}`);
      continue;
    }

    const match = path.basename(filePath).match(/slide-(\d+)\.webp/i) || path.basename(filePath).match(/(\d+)/);
    const slideNumber = match ? parseInt(match[1], 10) : 1;

    // Naming convention: <company>-<product>-slide-<number>.webp
    const newFileName = `${info.companySlug}-${info.productSlug}-slide-${slideNumber}.webp`;
    const destPath = path.join(TARGET_SLIDES_DIR, newFileName);

    // Copy to flat public/slides folder
    fs.copyFileSync(filePath, destPath);
    totalCopied++;

    // Ensure company exists in map
    if (!companyMap[info.company]) {
      companyMap[info.company] = {
        name: info.company,
        slug: info.companySlug,
        products: {},
      };
    }

    // Ensure product exists in company
    if (!companyMap[info.company].products[info.productSlug]) {
      companyMap[info.company].products[info.productSlug] = {
        name: info.product,
        slug: info.productSlug,
        slides: [],
      };
    }

    companyMap[info.company].products[info.productSlug].slides.push({
      slideNumber,
      fileName: newFileName,
      publicPath: `/slides/${newFileName}`,
      sourcePath: filePath,
    });
  }

  // Step 4: Sort slides numerically and build catalog.json
  const companiesOutput = [];
  const byCompanyOutput = {};

  for (const [companyName, compData] of Object.entries(companyMap)) {
    const productList = [];

    for (const [prodSlug, prodData] of Object.entries(compData.products)) {
      // Sort in numerical order
      prodData.slides.sort((a, b) => a.slideNumber - b.slideNumber);

      const slideUrls = prodData.slides.map((s) => s.publicPath);

      productList.push({
        name: prodData.name,
        slug: prodData.slug,
        slideCount: slideUrls.length,
        slides: slideUrls,
      });
    }

    const companyEntry = {
      name: compData.name,
      slug: compData.slug,
      productCount: productList.length,
      products: productList,
    };

    companiesOutput.push(companyEntry);
    byCompanyOutput[companyName] = companyEntry;
  }

  const catalog = {
    updatedAt: new Date().toISOString(),
    totalCompanies: companiesOutput.length,
    totalSlides: totalCopied,
    companies: companiesOutput,
    byCompany: byCompanyOutput,
  };

  fs.writeFileSync(CATALOG_FILE, JSON.stringify(catalog, null, 2), 'utf-8');
  console.log(`Saved catalog JSON with ${totalCopied} slide entries to:\n  ${CATALOG_FILE}\n`);

  // Step 5: Print Summary
  console.log('='.repeat(70));
  console.log('SUMMARY OF ORGANIZED PRODUCTS & SLIDES');
  console.log('='.repeat(70));

  let grandTotalSlides = 0;
  for (const comp of companiesOutput) {
    const compSlideTotal = comp.products.reduce((acc, p) => acc + p.slideCount, 0);
    grandTotalSlides += compSlideTotal;

    console.log(`\n🏢 Company: ${comp.name} (${compSlideTotal} slides total)`);
    if (comp.products.length === 0) {
      console.log('   (No products found)');
    } else {
      for (const prod of comp.products) {
        console.log(`   📦 Product: ${prod.name}`);
        console.log(`      - Slug:        ${prod.slug}`);
        console.log(`      - Slide Count: ${prod.slideCount}`);
        console.log(`      - First Slide: ${prod.slides[0] || 'N/A'}`);
        console.log(`      - Last Slide:  ${prod.slides[prod.slides.length - 1] || 'N/A'}`);
      }
    }
  }

  console.log('\n' + '-'.repeat(70));
  console.log(`TOTAL COPIED SLIDES:   ${totalCopied}`);
  console.log(`TOTAL CATALOG SLIDES:  ${grandTotalSlides}`);
  console.log(`DESTINATION FOLDER:    ${TARGET_SLIDES_DIR}`);
  console.log('='.repeat(70) + '\n');
}

main();
