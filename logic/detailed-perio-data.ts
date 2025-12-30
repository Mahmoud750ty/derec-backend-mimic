/**
 * Detailed Periodontal Probing Data - ThakaaMed App
 * 
 * This file documents the EXACT UI structure and data from the Derec app
 * periodontal probing section as observed in the application.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * SOURCE: DOM Path: div.app > div > main > div
 * HTML Element: <div data-view="periodontal-probing" data-tooth-number="21" 
 *               data-quadrant="2" data-mode="single-tooth">
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * UI LAYOUT OBSERVED:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                         Periodontal                                     │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │   Site Selection:                                                       │
 * │   ┌──────────────┬──────────────┬──────────────┐                       │
 * │   │ Mesio Palatal│   Palatal    │ Disto Palatal│   (Palatal/Lingual)   │
 * │   │     0   0    │    0   0     │    0   0     │                       │
 * │   ├──────────────┼──────────────┼──────────────┤                       │
 * │   │ Mesio Buccal │   Buccal     │ Disto Buccal │   (Buccal/Labial)     │
 * │   │     0   0    │    0   0     │    0   0     │                       │
 * │   └──────────────┴──────────────┴──────────────┘                       │
 * │                                                                         │
 * │   PROBING DEPTH:                                                        │
 * │   [0] [1] [2] [3] [4] [5] [6] [7] [8] [9] [10] [11] [12] [>12]         │
 * │                                                                         │
 * │   GINGIVAL MARGIN:                                                      │
 * │   [0] [-1] [-2] [-3] [-4] [-5] [-6] ... [-12] [<-12]                   │
 * │   [+/-] [0] [+1] [+2] [+3] [+4] [+5] [+6] [+7]                         │
 * │                                                                         │
 * │   Additional Information:                                               │
 * │   [🔴 Bleeding] [🔵 Plaque] [🟡 Pus] [⚫ Tartar]                        │
 * │                                                                         │
 * │   Tooth Mobility:                                                       │
 * │   [Class 1 ↔] [Class 2 ↔↔] [Class 3 ↔↔↔]                              │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ============================================================================
// UI DATA ATTRIBUTES (from HTML element)
// ============================================================================

interface PeriodontalViewAttributes {
  'data-view': 'periodontal-probing';
  'data-tooth-number': string;  // e.g., "21" (FDI notation)
  'data-quadrant': '1' | '2' | '3' | '4';  // Upper right=1, Upper left=2, Lower left=3, Lower right=4
  'data-mode': 'single-tooth' | 'full-mouth';
}

// ============================================================================
// SITE NAMES - Exact names from UI
// ============================================================================

/**
 * Six probing sites per tooth as shown in UI
 * 
 * PALATAL/LINGUAL SIDE (for upper/lower teeth):
 * - Mesio Palatal (or Mesio Lingual for lower teeth)
 * - Palatal (or Lingual)
 * - Disto Palatal (or Disto Lingual)
 * 
 * BUCCAL/LABIAL SIDE:
 * - Mesio Buccal
 * - Buccal
 * - Disto Buccal
 */
const SITE_NAMES = {
  palatalSide: ['Mesio Palatal', 'Palatal', 'Disto Palatal'] as const,
  buccalSide: ['Mesio Buccal', 'Buccal', 'Disto Buccal'] as const,
  
  // Alternative names for lower teeth
  lingualSide: ['Mesio Lingual', 'Lingual', 'Disto Lingual'] as const,
  labialSide: ['Mesio Labial', 'Labial', 'Disto Labial'] as const,
};

type PalatalSiteName = typeof SITE_NAMES.palatalSide[number];
type BuccalSiteName = typeof SITE_NAMES.buccalSide[number];
type SiteName = PalatalSiteName | BuccalSiteName;

// ============================================================================
// PROBING DEPTH OPTIONS - Exact values from UI
// ============================================================================

/**
 * PROBING DEPTH selector values as shown in UI:
 * [0] [1] [2] [3] [4] [5] [6] [7] [8] [9] [10] [11] [12] [>12]
 * 
 * Values 0-12 are numeric, ">12" indicates depth exceeding 12mm
 */
const PROBING_DEPTH_OPTIONS = {
  values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const,
  maxValue: 12,
  overflowOption: '>12',  // For depths exceeding 12mm
  
  // Clinical interpretation
  interpretation: {
    healthy: { min: 0, max: 3, description: 'Healthy sulcus/shallow pocket' },
    mild: { min: 4, max: 5, description: 'Mild pocket' },
    moderate: { min: 6, max: 6, description: 'Moderate pocket' },
    severe: { min: 7, max: 12, description: 'Deep pocket' },
    veryDeep: { min: 13, max: Infinity, description: 'Very deep pocket (>12mm)' }
  }
};

type ProbingDepthValue = typeof PROBING_DEPTH_OPTIONS.values[number] | '>12';

// ============================================================================
// GINGIVAL MARGIN OPTIONS - Exact values from UI
// ============================================================================

/**
 * GINGIVAL MARGIN selector values as shown in UI:
 * 
 * Negative values (recession):
 * [0] [-1] [-2] [-3] [-4] [-5] [-6] ... [-12] [<-12]
 * 
 * Positive values (overgrowth/hyperplasia):
 * [+/-] [0] [+1] [+2] [+3] [+4] [+5] [+6] [+7]
 * 
 * The +/- switcher toggles between recession and overgrowth modes
 */
const GINGIVAL_MARGIN_OPTIONS = {
  // Recession values (gum has moved apically, root exposed)
  recession: {
    values: [0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12] as const,
    overflowOption: '<-12',  // For recession exceeding 12mm
    description: 'Negative values indicate recession (root exposure)'
  },
  
  // Overgrowth values (gum covers more crown than normal)
  overgrowth: {
    values: [0, 1, 2, 3, 4, 5, 6, 7] as const,
    description: 'Positive values indicate gingival overgrowth/hyperplasia'
  },
  
  // Range
  minValue: -12,  // or <-12
  maxValue: 7,
  
  // UI toggle
  toggleButton: '+/-',  // Switches between recession and overgrowth input
};

type GingivalMarginValue = number | '<-12';

// ============================================================================
// ADDITIONAL INFORMATION - Clinical Indicators
// ============================================================================

/**
 * Additional clinical indicators with color-coded dots
 * These are toggle buttons that mark findings at each site
 */
const CLINICAL_INDICATORS = {
  bleeding: {
    id: 'bleeding',
    name: 'Bleeding',
    color: 'red',
    emoji: '🔴',
    description: 'Bleeding on probing (BOP) - indicates active inflammation',
    clinicalSignificance: 'Sign of active gingival/periodontal inflammation'
  },
  plaque: {
    id: 'plaque',
    name: 'Plaque',
    color: 'blue', 
    emoji: '🔵',
    description: 'Visible plaque/biofilm present',
    clinicalSignificance: 'Indicates inadequate oral hygiene at this site'
  },
  pus: {
    id: 'pus',
    name: 'Pus',
    color: 'yellow',
    emoji: '🟡',
    description: 'Suppuration/purulent exudate',
    clinicalSignificance: 'Sign of active infection - more serious finding'
  },
  tartar: {
    id: 'tartar',
    name: 'Tartar',
    color: 'black',
    emoji: '⚫',
    description: 'Calculus/tartar deposits',
    clinicalSignificance: 'Calcified plaque - requires professional removal'
  }
} as const;

type ClinicalIndicatorId = keyof typeof CLINICAL_INDICATORS;

// ============================================================================
// TOOTH MOBILITY - Classification options
// ============================================================================

/**
 * Tooth mobility classification as shown in UI
 * Each class is represented by arrows (↔) indicating movement
 */
const TOOTH_MOBILITY_OPTIONS = {
  class0: {
    value: 0,
    symbol: '',
    arrows: '',
    description: 'No detectable mobility',
    uiLabel: 'None'
  },
  class1: {
    value: 1,
    symbol: '↔',
    arrows: 'one arrow left and right',
    description: 'Slight mobility (<1mm horizontal)',
    uiLabel: 'Class 1'
  },
  class2: {
    value: 2,
    symbol: '↔↔',
    arrows: 'two arrows left and right',
    description: 'Moderate mobility (1-2mm horizontal)',
    uiLabel: 'Class 2'
  },
  class3: {
    value: 3,
    symbol: '↔↔↔',
    arrows: 'three arrows left and right',
    description: 'Severe mobility (>2mm horizontal or vertical movement)',
    uiLabel: 'Class 3'
  }
} as const;

type MobilityClass = 0 | 1 | 2 | 3;

// ============================================================================
// COMPLETE SITE DATA STRUCTURE
// ============================================================================

/**
 * Data structure for a single probing site
 * This is what gets stored for each of the 6 sites per tooth
 */
interface SiteData {
  siteName: SiteName;
  probingDepth: ProbingDepthValue;
  gingivalMargin: GingivalMarginValue;
  
  // Clinical indicators (toggles)
  bleeding: boolean;
  plaque: boolean;
  pus: boolean;
  tartar: boolean;
}

/**
 * Complete periodontal data for a single tooth
 * Matches the UI layout exactly
 */
interface ToothPeriodontalData {
  // Tooth identification
  toothNumber: string;  // FDI notation (e.g., "21")
  quadrant: 1 | 2 | 3 | 4;
  
  // Six probing sites
  sites: {
    // Palatal/Lingual side (3 sites)
    mesioPalatal: SiteData;
    palatal: SiteData;
    distoPalatal: SiteData;
    
    // Buccal side (3 sites)
    mesioBuccal: SiteData;
    buccal: SiteData;
    distoBuccal: SiteData;
  };
  
  // Tooth-level data
  mobility: MobilityClass;
}

// ============================================================================
// UI INTERACTION FLOW
// ============================================================================

/**
 * UI Interaction Flow for Periodontal Probing:
 * 
 * 1. SELECT SITE
 *    - Click on one of 6 site buttons (e.g., "Mesio Palatal")
 *    - The two numbers shown are: [Probing Depth] [Gingival Margin]
 *    - Initially both show "0 0"
 * 
 * 2. ENTER PROBING DEPTH
 *    - Click number from 0-12 or ">12"
 *    - Value appears in first position of site display
 * 
 * 3. ENTER GINGIVAL MARGIN
 *    - Use +/- toggle if needed to switch between recession/overgrowth
 *    - Click value (-12 to +7)
 *    - Value appears in second position of site display
 * 
 * 4. MARK CLINICAL INDICATORS (optional)
 *    - Click colored dots to toggle: Bleeding (red), Plaque (blue), 
 *      Pus (yellow), Tartar (black)
 *    - Dots appear next to site when selected
 * 
 * 5. SET MOBILITY (once per tooth)
 *    - Select Class 1, 2, or 3 if tooth is mobile
 *    - Arrows (↔) appear to indicate mobility class
 * 
 * 6. REPEAT for all 6 sites
 * 
 * 7. MOVE TO NEXT TOOTH or complete charting
 */

// ============================================================================
// DEFAULT/INITIAL VALUES
// ============================================================================

/**
 * Default values when a new tooth is selected
 */
const DEFAULT_SITE_DATA: Omit<SiteData, 'siteName'> = {
  probingDepth: 0,
  gingivalMargin: 0,
  bleeding: false,
  plaque: false,
  pus: false,
  tartar: false
};

const DEFAULT_TOOTH_DATA: Omit<ToothPeriodontalData, 'toothNumber' | 'quadrant'> = {
  sites: {
    mesioPalatal: { siteName: 'Mesio Palatal', ...DEFAULT_SITE_DATA },
    palatal: { siteName: 'Palatal', ...DEFAULT_SITE_DATA },
    distoPalatal: { siteName: 'Disto Palatal', ...DEFAULT_SITE_DATA },
    mesioBuccal: { siteName: 'Mesio Buccal', ...DEFAULT_SITE_DATA },
    buccal: { siteName: 'Buccal', ...DEFAULT_SITE_DATA },
    distoBuccal: { siteName: 'Disto Buccal', ...DEFAULT_SITE_DATA }
  },
  mobility: 0
};

// ============================================================================
// CALCULATED VALUES
// ============================================================================

/**
 * Calculate Clinical Attachment Loss (CAL) for a site
 * CAL = Probing Depth + |Recession| or Probing Depth - Overgrowth
 */
function calculateCAL(probingDepth: number, gingivalMargin: number): number {
  if (gingivalMargin < 0) {
    // Recession: add absolute value
    return probingDepth + Math.abs(gingivalMargin);
  } else if (gingivalMargin > 0) {
    // Overgrowth: subtract (CAL cannot be negative)
    return Math.max(0, probingDepth - gingivalMargin);
  }
  return probingDepth;
}

/**
 * Get the deepest probing depth for a tooth
 */
function getDeepestSite(toothData: ToothPeriodontalData): { site: SiteName; depth: number } {
  const sites = toothData.sites;
  let deepest = { site: 'buccal' as SiteName, depth: 0 };
  
  Object.values(sites).forEach(site => {
    const depth = site.probingDepth === '>12' ? 13 : site.probingDepth;
    if (depth > deepest.depth) {
      deepest = { site: site.siteName, depth };
    }
  });
  
  return deepest;
}

/**
 * Count sites with bleeding
 */
function countBleedingSites(toothData: ToothPeriodontalData): number {
  return Object.values(toothData.sites).filter(site => site.bleeding).length;
}

/**
 * Calculate BOP percentage for a tooth (out of 6 sites)
 */
function calculateToothBOP(toothData: ToothPeriodontalData): number {
  const bleedingSites = countBleedingSites(toothData);
  return (bleedingSites / 6) * 100;
}

// ============================================================================
// DISPLAY FORMATTING
// ============================================================================

/**
 * Format site display as shown in UI: "PD GM" (e.g., "5 -2")
 */
function formatSiteDisplay(site: SiteData): string {
  const pd = site.probingDepth === '>12' ? '>12' : site.probingDepth.toString();
  const gm = site.gingivalMargin === '<-12' 
    ? '<-12' 
    : site.gingivalMargin >= 0 
      ? `+${site.gingivalMargin}` 
      : site.gingivalMargin.toString();
  return `${pd} ${gm}`;
}

/**
 * Get indicator dots for a site
 */
function getSiteIndicators(site: SiteData): string[] {
  const indicators: string[] = [];
  if (site.bleeding) indicators.push(CLINICAL_INDICATORS.bleeding.emoji);
  if (site.plaque) indicators.push(CLINICAL_INDICATORS.plaque.emoji);
  if (site.pus) indicators.push(CLINICAL_INDICATORS.pus.emoji);
  if (site.tartar) indicators.push(CLINICAL_INDICATORS.tartar.emoji);
  return indicators;
}

/**
 * Format mobility display
 */
function formatMobilityDisplay(mobility: MobilityClass): string {
  switch (mobility) {
    case 0: return '';
    case 1: return TOOTH_MOBILITY_OPTIONS.class1.symbol;
    case 2: return TOOTH_MOBILITY_OPTIONS.class2.symbol;
    case 3: return TOOTH_MOBILITY_OPTIONS.class3.symbol;
    default: return '';
  }
}

// ============================================================================
// QUADRANT HELPERS
// ============================================================================

/**
 * Determine if tooth is upper or lower based on quadrant
 */
function isUpperTooth(quadrant: 1 | 2 | 3 | 4): boolean {
  return quadrant === 1 || quadrant === 2;
}

/**
 * Get appropriate site name based on jaw position
 * Upper teeth: Palatal, Lower teeth: Lingual
 */
function getSiteNameForJaw(baseName: string, quadrant: 1 | 2 | 3 | 4): string {
  const isUpper = isUpperTooth(quadrant);
  
  if (baseName.includes('Palatal')) {
    return isUpper ? baseName : baseName.replace('Palatal', 'Lingual');
  }
  
  return baseName;
}

// ============================================================================
// DIAGNOSIS RELATIONSHIP TABLE
// ============================================================================

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HOW UI SELECTIONS LEAD TO DIAGNOSIS (ICD-10 CODES)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * STEP 1: PROBING DEPTH determines BASE SEVERITY
 * ───────────────────────────────────────────────
 * │ UI Selection      │ Probing Depth │ Base Condition        │ Next Step     │
 * ├───────────────────┼───────────────┼───────────────────────┼───────────────┤
 * │ [0] [1] [2] [3]   │ 0-3mm         │ Healthy or Gingivitis │ Check BOP     │
 * │ [4] [5]           │ 4-5mm         │ Slight Periodontitis  │ Calculate CAL │
 * │ [6]               │ 6mm           │ Moderate Periodontitis│ Calculate CAL │
 * │ [7]-[12] or [>12] │ >6mm          │ Severe Periodontitis  │ Calculate CAL │
 * └───────────────────┴───────────────┴───────────────────────┴───────────────┘
 * 
 * STEP 2: GINGIVAL MARGIN affects CAL (Clinical Attachment Loss)
 * ───────────────────────────────────────────────────────────────
 * │ UI Selection        │ Gingival Margin │ Effect on CAL              │
 * ├─────────────────────┼─────────────────┼────────────────────────────┤
 * │ [0]                 │ 0mm             │ CAL = Probing Depth        │
 * │ [-1] to [-12]       │ -1 to -12mm     │ CAL = PD + |GM| (ADDS)     │
 * │ [<-12]              │ <-12mm          │ CAL = PD + 12+ (severe)    │
 * │ [+1] to [+7]        │ +1 to +7mm      │ CAL = PD - GM (SUBTRACTS)  │
 * └─────────────────────┴─────────────────┴────────────────────────────┘
 * 
 * Example Calculations:
 * - PD=5, GM=0  → CAL = 5mm (Moderate)
 * - PD=4, GM=-3 → CAL = 4+3 = 7mm (Severe!)  ← Recession makes it worse
 * - PD=6, GM=+2 → CAL = 6-2 = 4mm (Moderate) ← Overgrowth reduces CAL
 * 
 * STEP 3: CAL determines SEVERITY for ICD-10 code
 * ─────────────────────────────────────────────────
 * │ CAL Result │ Severity  │ ICD-10 Last Digit │ Example Code  │
 * ├────────────┼───────────┼───────────────────┼───────────────┤
 * │ 0mm        │ Healthy   │ -                 │ No code       │
 * │ 1-2mm      │ Slight    │ 1                 │ K05.311       │
 * │ 3-4mm      │ Moderate  │ 2                 │ K05.312       │
 * │ ≥5mm       │ Severe    │ 3                 │ K05.313       │
 * └────────────┴───────────┴───────────────────┴───────────────┘
 * 
 * STEP 4: BLEEDING (🔴) determines GINGIVITIS vs HEALTHY
 * ────────────────────────────────────────────────────────
 * │ Probing Depth │ Bleeding │ Plaque    │ Diagnosis           │ ICD-10  │
 * ├───────────────┼──────────┼───────────┼─────────────────────┼─────────┤
 * │ 0-3mm         │    Yes   │    Yes    │ Plaque gingivitis   │ K05.10  │
 * │ 0-3mm         │    Yes   │ No        │ Non-plaque gingivit │ K05.01  │
 * │ 0-3mm         │ No       │ Any       │ Healthy             │ -       │
 * │ >3mm          │ Any      │ Any       │ Periodontitis       │ K05.3xx │
 * └───────────────┴──────────┴───────────┴─────────────────────┴─────────┘
 * 
 * STEP 5: ADDITIONAL INDICATORS modify diagnosis
 * ───────────────────────────────────────────────
 * │ Indicator   │ UI       │ Clinical Meaning           │ Effect on Diagnosis    │
 * ├─────────────┼──────────┼────────────────────────────┼────────────────────────┤
 * │ Bleeding    │ 🔴 Red   │ Active inflammation        │ Confirms active disease│
 * │ Plaque      │ 🔵 Blue  │ Biofilm present            │ Indicates plaque-induced│
 * │ Pus         │ 🟡 Yellow│ Suppuration (infection)    │ Indicates severe/active│
 * │ Tartar      │ ⚫ Black │ Calculus deposits          │ Contributing factor    │
 * └─────────────┴──────────┴────────────────────────────┴────────────────────────┘
 * 
 * STEP 6: MOBILITY adds to severity assessment
 * ─────────────────────────────────────────────
 * │ UI Selection    │ Mobility │ Clinical Meaning              │ ICD-10 Relation     │
 * ├─────────────────┼──────────┼───────────────────────────────┼─────────────────────┤
 * │ (none selected) │ Class 0  │ Normal                        │ No additional code  │
 * │ Class 1 ↔       │ Class 1  │ Slight (<1mm)                 │ Supports mild dx    │
 * │ Class 2 ↔↔      │ Class 2  │ Moderate (1-2mm)              │ Supports moderate dx│
 * │ Class 3 ↔↔↔     │ Class 3  │ Severe (>2mm or vertical)     │ May indicate K08.x  │
 * └─────────────────┴──────────┴───────────────────────────────┴─────────────────────┘
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * COMPLETE DIAGNOSIS FLOW CHART
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 *                         START: Enter Probing Depth
 *                                    │
 *                    ┌───────────────┼───────────────┐
 *                    │               │               │
 *                 PD ≤3mm         PD 4-6mm        PD >6mm
 *                    │               │               │
 *              Has Bleeding?    Calculate CAL    Calculate CAL
 *              ┌────┴────┐          │               │
 *              No       Yes         │               │
 *              │         │          │               │
 *           HEALTHY  GINGIVITIS  PERIODONTITIS  PERIODONTITIS
 *              │         │          │               │
 *              │    Has Plaque?  CAL 1-2mm?     CAL ≥5mm
 *              │    ┌───┴───┐       │               │
 *              │   Yes     No    SLIGHT         SEVERE
 *              │    │       │    K05.x11       K05.x13
 *              │ K05.10  K05.01     │
 *              │    │       │    CAL 3-4mm?
 *              │    │       │       │
 *              │    │       │    MODERATE
 *              │    │       │    K05.x12
 *              │    │       │       │
 *              └────┴───────┴───────┴─── Then check:
 *                                         - Patient Age (<30 = K05.2xx, ≥30 = K05.3xx)
 *                                         - % Teeth affected (<30% = x1x, ≥30% = x2x)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * QUICK REFERENCE: UI → ICD-10 CODE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * │ Probing │ Ging.   │ CAL  │ BOP │ Plaque│ Age  │ %Teeth │ ICD-10  │ Diagnosis                    │
 * │ Depth   │ Margin  │      │     │       │      │        │         │                              │
 * ├─────────┼─────────┼──────┼─────┼───────┼──────┼────────┼─────────┼──────────────────────────────┤
 * │ 0-3     │ 0       │ 0-3  │ No  │ Any   │ Any  │ Any    │ -       │ Healthy                      │
 * │ 0-3     │ 0       │ 0-3  │ Yes │ Yes   │ Any  │ Any    │ K05.10  │ Chronic plaque gingivitis    │
 * │ 0-3     │ 0       │ 0-3  │ Yes │ No    │ Any  │ Any    │ K05.01  │ Acute non-plaque gingivitis  │
 * │ 0-3     │ -1 to -2│ 1-2  │ Any │ Any   │ Any  │ <30%   │ K06.011 │ Localized recession minimal  │
 * │ 0-3     │ -3 to -4│ 3-4  │ Any │ Any   │ Any  │ <30%   │ K06.012 │ Localized recession moderate │
 * │ 0-3     │ -5+     │ ≥5   │ Any │ Any   │ Any  │ <30%   │ K06.013 │ Localized recession severe   │
 * │ 4-5     │ Any     │ 1-2  │ Any │ Any   │ <30  │ <30%   │ K05.211 │ Loc aggressive slight        │
 * │ 4-5     │ Any     │ 1-2  │ Any │ Any   │ ≥30  │ <30%   │ K05.311 │ Loc chronic slight           │
 * │ 4-5     │ Any     │ 1-2  │ Any │ Any   │ <30  │ ≥30%   │ K05.221 │ Gen aggressive slight        │
 * │ 4-5     │ Any     │ 1-2  │ Any │ Any   │ ≥30  │ ≥30%   │ K05.321 │ Gen chronic slight           │
 * │ 5-6     │ Any     │ 3-4  │ Any │ Any   │ <30  │ <30%   │ K05.212 │ Loc aggressive moderate      │
 * │ 5-6     │ Any     │ 3-4  │ Any │ Any   │ ≥30  │ <30%   │ K05.312 │ Loc chronic moderate         │
 * │ 5-6     │ Any     │ 3-4  │ Any │ Any   │ <30  │ ≥30%   │ K05.222 │ Gen aggressive moderate      │
 * │ 5-6     │ Any     │ 3-4  │ Any │ Any   │ ≥30  │ ≥30%   │ K05.322 │ Gen chronic moderate         │
 * │ >6      │ Any     │ ≥5   │ Any │ Any   │ <30  │ <30%   │ K05.213 │ Loc aggressive severe        │
 * │ >6      │ Any     │ ≥5   │ Any │ Any   │ ≥30  │ <30%   │ K05.313 │ Loc chronic severe           │
 * │ >6      │ Any     │ ≥5   │ Any │ Any   │ <30  │ ≥30%   │ K05.223 │ Gen aggressive severe        │
 * │ >6      │ Any     │ ≥5   │ Any │ Any   │ ≥30  │ ≥30%   │ K05.323 │ Gen chronic severe           │
 * └─────────┴─────────┴──────┴─────┴───────┴──────┴────────┴─────────┴──────────────────────────────┘
 * 
 * LEGEND:
 * - PD: Probing Depth (mm)
 * - GM: Gingival Margin (mm, negative = recession)
 * - CAL: Clinical Attachment Loss = PD + |GM| if recession
 * - BOP: Bleeding on Probing (🔴)
 * - Age: Patient age (determines Aggressive vs Chronic)
 * - %Teeth: Percentage of teeth affected (determines Localized vs Generalized)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Types
  SiteData,
  ToothPeriodontalData,
  SiteName,
  ProbingDepthValue,
  GingivalMarginValue,
  MobilityClass,
  ClinicalIndicatorId,
  PeriodontalViewAttributes,
  
  // Constants
  SITE_NAMES,
  PROBING_DEPTH_OPTIONS,
  GINGIVAL_MARGIN_OPTIONS,
  CLINICAL_INDICATORS,
  TOOTH_MOBILITY_OPTIONS,
  DEFAULT_SITE_DATA,
  DEFAULT_TOOTH_DATA,
  
  // Functions
  calculateCAL,
  getDeepestSite,
  countBleedingSites,
  calculateToothBOP,
  formatSiteDisplay,
  getSiteIndicators,
  formatMobilityDisplay,
  isUpperTooth,
  getSiteNameForJaw
};

