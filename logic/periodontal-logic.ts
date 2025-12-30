/**
 * Periodontal Diagnostic Logic - ThakaaMed App
 * 
 * This file documents the diagnostic decision logic for periodontal conditions.
 * Diagnosis is based on probing depths, clinical attachment loss (CAL), 
 * bleeding, and other clinical findings.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * ICD-10 CODE REFERENCE FOR PERIODONTAL CONDITIONS (K05.x, K06.x)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * GINGIVITIS - K05.0x / K05.1x
 * ────────────────────────────
 * Inflammation of gingiva WITHOUT attachment loss or bone loss.
 * 
 * │ Code    │ Diagnosis                    │ Probing │ BOP  │ CAL  │ UI Findings               │
 * ├─────────┼──────────────────────────────┼─────────┼──────┼──────┼───────────────────────────┤
 * │ K05.00  │ Acute gingivitis, plaque     │ ≤3mm    │ Yes  │ 0    │ Bleeding + Plaque dots    │
 * │ K05.01  │ Acute gingivitis, non-plaque │ ≤3mm    │ Yes  │ 0    │ Bleeding, no Plaque dots  │
 * │ K05.10  │ Chronic gingivitis, plaque   │ ≤3mm    │ Yes  │ 0    │ Persistent bleeding       │
 * │ K05.11  │ Chronic gingivitis, non-plaque│ ≤3mm   │ Yes  │ 0    │ Systemic factors          │
 * └─────────┴──────────────────────────────┴─────────┴──────┴──────┴───────────────────────────┘
 * 
 * Key differentiation:
 * - Acute (K05.0x): Sudden onset, severe inflammation
 * - Chronic (K05.1x): Long-standing, mild-moderate inflammation
 * - Plaque-induced: Plaque dots present (🔵 Blue indicator)
 * - Non-plaque: Viral, fungal, genetic, medication-induced
 * 
 * AGGRESSIVE PERIODONTITIS - K05.2xx (Patient Age <30)
 * ─────────────────────────────────────────────────────
 * Rapid bone loss in young patients. Classified by EXTENT and SEVERITY.
 * 
 * │ Code     │ Extent      │ Severity  │ PD      │ CAL    │ Bone Loss │ UI Measurements        │
 * ├──────────┼─────────────┼───────────┼─────────┼────────┼───────────┼────────────────────────┤
 * │ K05.211  │ Localized   │ Slight    │ 4-5mm   │ 1-2mm  │ Slight    │ <30% teeth affected    │
 * │ K05.212  │ Localized   │ Moderate  │ 5-6mm   │ 3-4mm  │ Moderate  │ <30% teeth affected    │
 * │ K05.213  │ Localized   │ Severe    │ >6mm    │ ≥5mm   │ Severe    │ <30% teeth affected    │
 * │ K05.221  │ Generalized │ Slight    │ 4-5mm   │ 1-2mm  │ Slight    │ ≥30% teeth affected    │
 * │ K05.222  │ Generalized │ Moderate  │ 5-6mm   │ 3-4mm  │ Moderate  │ ≥30% teeth affected    │
 * │ K05.223  │ Generalized │ Severe    │ >6mm    │ ≥5mm   │ Severe    │ ≥30% teeth affected    │
 * └──────────┴─────────────┴───────────┴─────────┴────────┴───────────┴────────────────────────┘
 * 
 * CHRONIC PERIODONTITIS - K05.3xx (Patient Age ≥30)
 * ──────────────────────────────────────────────────
 * Slow, progressive bone loss in adults. Most common form.
 * 
 * │ Code     │ Extent      │ Severity  │ PD      │ CAL    │ Bone Loss │ UI Measurements        │
 * ├──────────┼─────────────┼───────────┼─────────┼────────┼───────────┼────────────────────────┤
 * │ K05.311  │ Localized   │ Slight    │ 4-5mm   │ 1-2mm  │ Slight    │ <30% teeth affected    │
 * │ K05.312  │ Localized   │ Moderate  │ 5-6mm   │ 3-4mm  │ Moderate  │ <30% teeth affected    │
 * │ K05.313  │ Localized   │ Severe    │ >6mm    │ ≥5mm   │ Severe    │ <30% teeth affected    │
 * │ K05.321  │ Generalized │ Slight    │ 4-5mm   │ 1-2mm  │ Slight    │ ≥30% teeth affected    │
 * │ K05.322  │ Generalized │ Moderate  │ 5-6mm   │ 3-4mm  │ Moderate  │ ≥30% teeth affected    │
 * │ K05.323  │ Generalized │ Severe    │ >6mm    │ ≥5mm   │ Severe    │ ≥30% teeth affected    │
 * └──────────┴─────────────┴───────────┴─────────┴────────┴───────────┴────────────────────────┘
 * 
 * CODE STRUCTURE EXPLAINED:
 * K05.3  [2]  [3]
 *   │     │    │
 *   │     │    └── Severity: 1=Slight, 2=Moderate, 3=Severe
 *   │     └─────── Extent: 1=Localized, 2=Generalized  
 *   └───────────── Base code for Chronic Periodontitis
 * 
 * GINGIVAL RECESSION - K06.0xx
 * ────────────────────────────
 * Root exposure due to apical migration of gingival margin.
 * 
 * │ Code     │ Extent      │ Severity  │ Recession │ UI Finding                          │
 * ├──────────┼─────────────┼───────────┼───────────┼─────────────────────────────────────┤
 * │ K06.011  │ Localized   │ Minimal   │ 1-2mm     │ Gingival Margin: -1 to -2           │
 * │ K06.012  │ Localized   │ Moderate  │ 3-4mm     │ Gingival Margin: -3 to -4           │
 * │ K06.013  │ Localized   │ Severe    │ ≥5mm      │ Gingival Margin: ≤-5                │
 * │ K06.021  │ Generalized │ Minimal   │ 1-2mm     │ Multiple teeth with recession       │
 * │ K06.022  │ Generalized │ Moderate  │ 3-4mm     │ Multiple teeth with recession       │
 * │ K06.023  │ Generalized │ Severe    │ ≥5mm      │ Multiple teeth with recession       │
 * └──────────┴─────────────┴───────────┴───────────┴─────────────────────────────────────┘
 * 
 * CLINICAL ATTACHMENT LOSS (CAL) CALCULATION
 * ───────────────────────────────────────────
 * CAL = Probing Depth + |Recession| (if recession present)
 * CAL = Probing Depth - Overgrowth (if hyperplasia present)
 * 
 * Example calculations with UI values:
 * - PD=5mm, Gingival Margin=-2mm → CAL = 5 + 2 = 7mm (Severe)
 * - PD=4mm, Gingival Margin=0mm → CAL = 4mm (Moderate)
 * - PD=6mm, Gingival Margin=+2mm → CAL = 6 - 2 = 4mm (Moderate)
 * 
 * CLINICAL INDICATORS AND ICD-10 RELATIONSHIPS
 * ─────────────────────────────────────────────
 * │ Indicator │ Color  │ UI Dot │ Clinical Meaning                    │ Related ICD-10     │
 * ├───────────┼────────┼────────┼─────────────────────────────────────┼────────────────────┤
 * │ Bleeding  │ Red    │ 🔴     │ Active inflammation, BOP positive   │ K05.x (gingivitis) │
 * │ Plaque    │ Blue   │ 🔵     │ Biofilm present, hygiene deficiency │ K05.x0 (plaque-ind)│
 * │ Pus       │ Yellow │ 🟡     │ Suppuration, active infection       │ K05.3x3 (severe)   │
 * │ Tartar    │ Black  │ ⚫     │ Calculus, needs scaling             │ K03.6 (deposits)   │
 * └───────────┴────────┴────────┴─────────────────────────────────────┴────────────────────┘
 * 
 * TOOTH MOBILITY AND ICD-10
 * ─────────────────────────
 * │ Mobility │ Symbol │ Movement   │ Significance                        │ Related ICD-10    │
 * ├──────────┼────────┼────────────┼─────────────────────────────────────┼───────────────────┤
 * │ Class 0  │ -      │ None       │ Normal                              │ -                 │
 * │ Class 1  │ ↔      │ <1mm H     │ Mild perio or occlusal trauma       │ K05.x11           │
 * │ Class 2  │ ↔↔     │ 1-2mm H    │ Significant bone loss               │ K05.x12           │
 * │ Class 3  │ ↔↔↔    │ >2mm or V  │ Severe, may need extraction         │ K05.x13 + K08.x   │
 * └──────────┴────────┴────────────┴─────────────────────────────────────┴───────────────────┘
 * 
 * H = Horizontal, V = Vertical mobility
 * 
 * DIAGNOSIS DECISION TREE
 * ───────────────────────
 * 
 *                    Probing Depth?
 *                         │
 *         ┌───────────────┼───────────────┐
 *         │               │               │
 *      ≤3mm            4-5mm           >5mm
 *         │               │               │
 *     Bleeding?       Has CAL?       Has CAL?
 *     ┌───┴───┐       ┌───┴───┐       ┌───┴───┐
 *     No     Yes     No      Yes    1-4mm   ≥5mm
 *     │       │       │       │       │       │
 *  Healthy Gingivitis Gingivitis Slight  Moderate Severe
 *           K05.x0    K05.x0   K05.x11  K05.x12 K05.x13
 *
 * Then determine:
 * - Age <30 → Aggressive (K05.2xx)
 * - Age ≥30 → Chronic (K05.3xx)
 * - <30% teeth → Localized (x1x)
 * - ≥30% teeth → Generalized (x2x)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface SiteData {
  probingDepth: number;      // 0-12 or >12 mm
  gingivalMargin: number;    // -12 to +7 mm (negative = recession)
  bleeding: boolean;         // Red dot indicator
  plaque: boolean;           // Blue dot indicator
  pus: boolean;              // Yellow dot indicator (suppuration)
  tartar: boolean;           // Black dot indicator (calculus)
}

interface PeriodontalMeasurement {
  toothNumber: string;
  sites: {
    distoPalatal: SiteData;
    palatal: SiteData;
    mesioPalatal: SiteData;
    distoBuccal: SiteData;
    buccal: SiteData;
    mesioBuccal: SiteData;
  };
  mobility: MobilityClass;
}

type MobilityClass = 0 | 1 | 2 | 3;

type SiteName = 'distoPalatal' | 'palatal' | 'mesioPalatal' | 'distoBuccal' | 'buccal' | 'mesioBuccal';

interface PeriodontalDiagnosis {
  diagnosis: string;
  severity: 'healthy' | 'mild' | 'moderate' | 'severe';
  extent: 'localized' | 'generalized';
  icd10Code: string;
  description: string;
  treatmentRecommendation: string;
  urgency: 'low' | 'medium' | 'high';
}

// ============================================================================
// CLINICAL ATTACHMENT LOSS (CAL) CALCULATION
// ============================================================================

/**
 * Clinical Attachment Loss (CAL) = Probing Depth + Recession
 * 
 * If gingival margin is:
 * - Negative (recession): CAL = Probing Depth + |Gingival Margin|
 * - Positive (overgrowth): CAL = Probing Depth - Gingival Margin
 * - Zero (normal): CAL = Probing Depth
 */
function calculateCAL(probingDepth: number, gingivalMargin: number): number {
  // Gingival margin: negative = recession, positive = overgrowth
  if (gingivalMargin < 0) {
    // Recession: add absolute value
    return probingDepth + Math.abs(gingivalMargin);
  } else if (gingivalMargin > 0) {
    // Overgrowth: subtract (but CAL cannot be negative)
    return Math.max(0, probingDepth - gingivalMargin);
  }
  return probingDepth;
}

// ============================================================================
// PERIODONTAL CLASSIFICATION CRITERIA
// ============================================================================

/**
 * Probing Depth Classification
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Probing Depth (PD)                                              │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ ├── 0-3 mm → Healthy / Gingivitis (no attachment loss)         │
 * │ ├── 4-5 mm → Mild Periodontitis                                │
 * │ ├── 5-6 mm → Moderate Periodontitis                            │
 * │ └── >6 mm → Severe Periodontitis                               │
 * └─────────────────────────────────────────────────────────────────┘
 */

/**
 * Clinical Attachment Loss (CAL) Classification
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ CAL Classification                                              │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ ├── 0 mm → Healthy                                              │
 * │ ├── 1-2 mm → Slight/Mild attachment loss                       │
 * │ ├── 3-4 mm → Moderate attachment loss                          │
 * │ └── ≥5 mm → Severe attachment loss                             │
 * └─────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// DIAGNOSIS DEFINITIONS
// ============================================================================

const PERIODONTAL_DIAGNOSES = {
  // HEALTHY
  healthy: {
    diagnosis: 'Healthy Periodontium',
    severity: 'healthy' as const,
    icd10Code: '',
    description: 'No clinical signs of gingival inflammation or periodontal disease',
    treatmentRecommendation: 'Routine prophylaxis, maintain oral hygiene',
    urgency: 'low' as const
  },

  // GINGIVITIS
  acute_plaque_gingivitis: {
    diagnosis: 'Acute Plaque-Induced Gingivitis',
    severity: 'mild' as const,
    icd10Code: 'K05.00',
    description: 'Acute gum inflammation caused by plaque. Probing <3mm, bleeding present, no bone loss.',
    treatmentRecommendation: 'Prophylaxis, oral hygiene instruction',
    urgency: 'low' as const
  },
  
  acute_nonplaque_gingivitis: {
    diagnosis: 'Acute Non-Plaque Gingivitis',
    severity: 'mild' as const,
    icd10Code: 'K05.01',
    description: 'Acute gum inflammation from non-plaque factors (viral, bacterial, fungal, trauma)',
    treatmentRecommendation: 'Address underlying cause, supportive care',
    urgency: 'low' as const
  },
  
  chronic_plaque_gingivitis: {
    diagnosis: 'Chronic Plaque-Induced Gingivitis',
    severity: 'mild' as const,
    icd10Code: 'K05.10',
    description: 'Chronic gum inflammation caused by plaque. Persistent bleeding, no attachment loss.',
    treatmentRecommendation: 'Prophylaxis, enhanced oral hygiene education',
    urgency: 'low' as const
  },

  // AGGRESSIVE PERIODONTITIS (Age <30)
  aggressive_localized_slight: {
    diagnosis: 'Localized Aggressive Periodontitis - Slight',
    severity: 'mild' as const,
    icd10Code: 'K05.211',
    description: 'Rapid bone loss in young patient (<30), affects <30% of teeth. CAL 1-2mm.',
    treatmentRecommendation: 'SRP + systemic antibiotics',
    urgency: 'medium' as const
  },
  
  aggressive_localized_moderate: {
    diagnosis: 'Localized Aggressive Periodontitis - Moderate',
    severity: 'moderate' as const,
    icd10Code: 'K05.212',
    description: 'Rapid bone loss in young patient (<30), affects <30% of teeth. CAL 3-4mm.',
    treatmentRecommendation: 'SRP + systemic antibiotics',
    urgency: 'medium' as const
  },
  
  aggressive_localized_severe: {
    diagnosis: 'Localized Aggressive Periodontitis - Severe',
    severity: 'severe' as const,
    icd10Code: 'K05.213',
    description: 'Rapid bone loss in young patient (<30), affects <30% of teeth. CAL ≥5mm.',
    treatmentRecommendation: 'Surgery + systemic antibiotics',
    urgency: 'high' as const
  },
  
  aggressive_generalized_slight: {
    diagnosis: 'Generalized Aggressive Periodontitis - Slight',
    severity: 'mild' as const,
    icd10Code: 'K05.221',
    description: 'Rapid bone loss in young patient (<30), affects >30% of teeth. CAL 1-2mm.',
    treatmentRecommendation: 'SRP + systemic antibiotics',
    urgency: 'medium' as const
  },
  
  aggressive_generalized_moderate: {
    diagnosis: 'Generalized Aggressive Periodontitis - Moderate',
    severity: 'moderate' as const,
    icd10Code: 'K05.222',
    description: 'Rapid bone loss in young patient (<30), affects >30% of teeth. CAL 3-4mm.',
    treatmentRecommendation: 'SRP + systemic antibiotics',
    urgency: 'high' as const
  },
  
  aggressive_generalized_severe: {
    diagnosis: 'Generalized Aggressive Periodontitis - Severe',
    severity: 'severe' as const,
    icd10Code: 'K05.223',
    description: 'Rapid bone loss in young patient (<30), affects >30% of teeth. CAL ≥5mm.',
    treatmentRecommendation: 'Surgery + systemic antibiotics',
    urgency: 'high' as const
  },

  // CHRONIC PERIODONTITIS (Age >30)
  chronic_localized_slight: {
    diagnosis: 'Localized Chronic Periodontitis - Slight',
    severity: 'mild' as const,
    icd10Code: 'K05.311',
    description: 'Slow progressive bone loss, affects <30% of teeth. PD 4-5mm, CAL 1-2mm.',
    treatmentRecommendation: 'Scaling and Root Planing (SRP)',
    urgency: 'low' as const
  },
  
  chronic_localized_moderate: {
    diagnosis: 'Localized Chronic Periodontitis - Moderate',
    severity: 'moderate' as const,
    icd10Code: 'K05.312',
    description: 'Slow progressive bone loss, affects <30% of teeth. PD 5-6mm, CAL 3-4mm.',
    treatmentRecommendation: 'Scaling and Root Planing (SRP)',
    urgency: 'medium' as const
  },
  
  chronic_localized_severe: {
    diagnosis: 'Localized Chronic Periodontitis - Severe',
    severity: 'severe' as const,
    icd10Code: 'K05.313',
    description: 'Slow progressive bone loss, affects <30% of teeth. PD >6mm, CAL ≥5mm.',
    treatmentRecommendation: 'Surgery, possible extraction',
    urgency: 'high' as const
  },
  
  chronic_generalized_slight: {
    diagnosis: 'Generalized Chronic Periodontitis - Slight',
    severity: 'mild' as const,
    icd10Code: 'K05.321',
    description: 'Slow progressive bone loss, affects >30% of teeth. PD 4-5mm, CAL 1-2mm.',
    treatmentRecommendation: 'Scaling and Root Planing (SRP)',
    urgency: 'low' as const
  },
  
  chronic_generalized_moderate: {
    diagnosis: 'Generalized Chronic Periodontitis - Moderate',
    severity: 'moderate' as const,
    icd10Code: 'K05.322',
    description: 'Slow progressive bone loss, affects >30% of teeth. PD 5-6mm, CAL 3-4mm.',
    treatmentRecommendation: 'Scaling and Root Planing (SRP)',
    urgency: 'medium' as const
  },
  
  chronic_generalized_severe: {
    diagnosis: 'Generalized Chronic Periodontitis - Severe',
    severity: 'severe' as const,
    icd10Code: 'K05.323',
    description: 'Slow progressive bone loss, affects >30% of teeth. PD >6mm, CAL ≥5mm.',
    treatmentRecommendation: 'Surgery, possible extractions',
    urgency: 'high' as const
  },

  // GINGIVAL RECESSION
  recession_localized_minimal: {
    diagnosis: 'Localized Gingival Recession - Minimal',
    severity: 'mild' as const,
    icd10Code: 'K06.011',
    description: 'Localized root exposure with minimal recession',
    treatmentRecommendation: 'Monitor, desensitizing agents',
    urgency: 'low' as const
  },
  
  recession_localized_moderate: {
    diagnosis: 'Localized Gingival Recession - Moderate',
    severity: 'moderate' as const,
    icd10Code: 'K06.012',
    description: 'Localized root exposure with moderate recession',
    treatmentRecommendation: 'Consider gingival graft',
    urgency: 'low' as const
  },
  
  recession_localized_severe: {
    diagnosis: 'Localized Gingival Recession - Severe',
    severity: 'severe' as const,
    icd10Code: 'K06.013',
    description: 'Localized root exposure with severe recession',
    treatmentRecommendation: 'Gingival graft recommended',
    urgency: 'medium' as const
  },

  recession_generalized_minimal: {
    diagnosis: 'Generalized Gingival Recession - Minimal',
    severity: 'mild' as const,
    icd10Code: 'K06.021',
    description: 'Generalized root exposure with minimal recession',
    treatmentRecommendation: 'Monitor, desensitizing agents',
    urgency: 'low' as const
  },
  
  recession_generalized_moderate: {
    diagnosis: 'Generalized Gingival Recession - Moderate',
    severity: 'moderate' as const,
    icd10Code: 'K06.022',
    description: 'Generalized root exposure with moderate recession',
    treatmentRecommendation: 'Consider multiple grafts',
    urgency: 'medium' as const
  },
  
  recession_generalized_severe: {
    diagnosis: 'Generalized Gingival Recession - Severe',
    severity: 'severe' as const,
    icd10Code: 'K06.023',
    description: 'Generalized root exposure with severe recession',
    treatmentRecommendation: 'Multiple gingival grafts needed',
    urgency: 'medium' as const
  }
};

// ============================================================================
// TOOTH MOBILITY CLASSIFICATION
// ============================================================================

/**
 * Tooth Mobility Classification
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Mobility Class                                                  │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ ├── Class 0 → No detectable mobility (normal)                  │
 * │ ├── Class 1 → Slight mobility (<1mm horizontal)                │
 * │ │            → One arrow ↔                                      │
 * │ ├── Class 2 → Moderate mobility (1-2mm horizontal)             │
 * │ │            → Two arrows ↔↔                                    │
 * │ └── Class 3 → Severe mobility (>2mm or vertical movement)      │
 * │              → Three arrows ↔↔↔                                 │
 * └─────────────────────────────────────────────────────────────────┘
 */

interface MobilityInterpretation {
  class: MobilityClass;
  description: string;
  clinicalSignificance: string;
  symbol: string;
}

const MOBILITY_CLASSIFICATIONS: Record<MobilityClass, MobilityInterpretation> = {
  0: {
    class: 0,
    description: 'No detectable mobility',
    clinicalSignificance: 'Normal, healthy periodontal support',
    symbol: ''
  },
  1: {
    class: 1,
    description: 'Slight mobility (<1mm)',
    clinicalSignificance: 'Mild periodontal involvement or occlusal trauma',
    symbol: '↔'
  },
  2: {
    class: 2,
    description: 'Moderate mobility (1-2mm)',
    clinicalSignificance: 'Significant bone loss, may need splinting',
    symbol: '↔↔'
  },
  3: {
    class: 3,
    description: 'Severe mobility (>2mm or vertical)',
    clinicalSignificance: 'Poor prognosis, may require extraction',
    symbol: '↔↔↔'
  }
};

// ============================================================================
// CLINICAL INDICATORS
// ============================================================================

/**
 * Clinical Indicators (Dot System)
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Indicator     │ Color  │ Significance                          │
 * ├───────────────┼────────┼───────────────────────────────────────┤
 * │ Bleeding      │ Red    │ Active inflammation                   │
 * │ Plaque        │ Blue   │ Biofilm present, hygiene issue        │
 * │ Pus           │ Yellow │ Active infection (suppuration)        │
 * │ Tartar        │ Black  │ Calculus present, needs scaling       │
 * └─────────────────────────────────────────────────────────────────┘
 */

interface ClinicalIndicators {
  bleedingOnProbing: boolean;  // BOP - red
  plaquePresent: boolean;       // Blue
  suppuration: boolean;         // Pus - yellow
  calculusPresent: boolean;     // Tartar - black
}

// ============================================================================
// DIAGNOSTIC LOGIC FUNCTIONS
// ============================================================================

/**
 * Determine severity based on probing depth
 */
function getSeverityFromProbingDepth(pd: number): 'healthy' | 'mild' | 'moderate' | 'severe' {
  if (pd <= 3) return 'healthy';
  if (pd <= 5) return 'mild';
  if (pd <= 6) return 'moderate';
  return 'severe';
}

/**
 * Determine severity based on CAL
 */
function getSeverityFromCAL(cal: number): 'healthy' | 'mild' | 'moderate' | 'severe' {
  if (cal === 0) return 'healthy';
  if (cal <= 2) return 'mild';
  if (cal <= 4) return 'moderate';
  return 'severe';
}

/**
 * Calculate the deepest probing depth for a tooth
 */
function getDeepestProbing(measurement: PeriodontalMeasurement): { site: SiteName; depth: number } {
  const sites = measurement.sites;
  let deepest: { site: SiteName; depth: number } = { site: 'buccal', depth: 0 };

  (Object.keys(sites) as SiteName[]).forEach(siteName => {
    const site = sites[siteName];
    if (site.probingDepth > deepest.depth) {
      deepest = { site: siteName, depth: site.probingDepth };
    }
  });

  return deepest;
}

/**
 * Calculate maximum CAL for a tooth
 */
function getMaxCAL(measurement: PeriodontalMeasurement): number {
  const sites = measurement.sites;
  let maxCAL = 0;

  (Object.keys(sites) as SiteName[]).forEach(siteName => {
    const site = sites[siteName];
    const cal = calculateCAL(site.probingDepth, site.gingivalMargin);
    if (cal > maxCAL) {
      maxCAL = cal;
    }
  });

  return maxCAL;
}

/**
 * Count bleeding sites for a tooth
 */
function countBleedingSites(measurement: PeriodontalMeasurement): number {
  const sites = measurement.sites;
  let count = 0;

  (Object.keys(sites) as SiteName[]).forEach(siteName => {
    if (sites[siteName].bleeding) count++;
  });

  return count;
}

/**
 * Calculate Bleeding on Probing percentage for full mouth
 */
function calculateBOPPercentage(measurements: PeriodontalMeasurement[]): number {
  let totalSites = 0;
  let bleedingSites = 0;

  measurements.forEach(tooth => {
    const sites = tooth.sites;
    (Object.keys(sites) as SiteName[]).forEach(siteName => {
      totalSites++;
      if (sites[siteName].bleeding) bleedingSites++;
    });
  });

  return totalSites > 0 ? (bleedingSites / totalSites) * 100 : 0;
}

/**
 * Main diagnostic function for a single tooth
 */
function diagnoseToothPeriodontal(
  measurement: PeriodontalMeasurement,
  patientAge: number = 35
): PeriodontalDiagnosis & { toothNumber: string } {
  const deepest = getDeepestProbing(measurement);
  const maxCAL = getMaxCAL(measurement);
  const bleedingSites = countBleedingSites(measurement);
  const hasRecession = Object.values(measurement.sites).some(s => s.gingivalMargin < 0);
  
  // Check for gingivitis first (PD ≤3mm with bleeding)
  if (deepest.depth <= 3) {
    if (bleedingSites > 0) {
      const hasPlaque = Object.values(measurement.sites).some(s => s.plaque);
      if (hasPlaque) {
        return {
          ...PERIODONTAL_DIAGNOSES.chronic_plaque_gingivitis,
          extent: bleedingSites >= 3 ? 'generalized' : 'localized',
          toothNumber: measurement.toothNumber
        };
      } else {
        return {
          ...PERIODONTAL_DIAGNOSES.acute_nonplaque_gingivitis,
          extent: 'localized',
          toothNumber: measurement.toothNumber
        };
      }
    }
    // Check for recession without periodontitis
    if (hasRecession) {
      const maxRecession = Math.max(...Object.values(measurement.sites).map(s => Math.abs(Math.min(0, s.gingivalMargin))));
      if (maxRecession <= 2) {
        return { ...PERIODONTAL_DIAGNOSES.recession_localized_minimal, extent: 'localized', toothNumber: measurement.toothNumber };
      } else if (maxRecession <= 4) {
        return { ...PERIODONTAL_DIAGNOSES.recession_localized_moderate, extent: 'localized', toothNumber: measurement.toothNumber };
      } else {
        return { ...PERIODONTAL_DIAGNOSES.recession_localized_severe, extent: 'localized', toothNumber: measurement.toothNumber };
      }
    }
    return { ...PERIODONTAL_DIAGNOSES.healthy, extent: 'localized', toothNumber: measurement.toothNumber };
  }

  // Periodontitis present (PD > 3mm)
  const isAggressive = patientAge < 30;
  const severity = getSeverityFromCAL(maxCAL);

  if (isAggressive) {
    // Aggressive periodontitis
    switch (severity) {
      case 'mild':
        return { ...PERIODONTAL_DIAGNOSES.aggressive_localized_slight, extent: 'localized', toothNumber: measurement.toothNumber };
      case 'moderate':
        return { ...PERIODONTAL_DIAGNOSES.aggressive_localized_moderate, extent: 'localized', toothNumber: measurement.toothNumber };
      case 'severe':
        return { ...PERIODONTAL_DIAGNOSES.aggressive_localized_severe, extent: 'localized', toothNumber: measurement.toothNumber };
      default:
        return { ...PERIODONTAL_DIAGNOSES.healthy, extent: 'localized', toothNumber: measurement.toothNumber };
    }
  } else {
    // Chronic periodontitis
    switch (severity) {
      case 'mild':
        return { ...PERIODONTAL_DIAGNOSES.chronic_localized_slight, extent: 'localized', toothNumber: measurement.toothNumber };
      case 'moderate':
        return { ...PERIODONTAL_DIAGNOSES.chronic_localized_moderate, extent: 'localized', toothNumber: measurement.toothNumber };
      case 'severe':
        return { ...PERIODONTAL_DIAGNOSES.chronic_localized_severe, extent: 'localized', toothNumber: measurement.toothNumber };
      default:
        return { ...PERIODONTAL_DIAGNOSES.healthy, extent: 'localized', toothNumber: measurement.toothNumber };
    }
  }
}

/**
 * Diagnose full mouth and determine extent (localized vs generalized)
 */
function diagnoseFullMouthPeriodontal(
  measurements: PeriodontalMeasurement[],
  patientAge: number = 35
): {
  overallDiagnosis: PeriodontalDiagnosis;
  affectedTeethPercentage: number;
  bopPercentage: number;
  toothDiagnoses: Array<PeriodontalDiagnosis & { toothNumber: string }>;
} {
  const toothDiagnoses = measurements.map(m => diagnoseToothPeriodontal(m, patientAge));
  
  // Count affected teeth (those with periodontitis)
  const affectedTeeth = toothDiagnoses.filter(d => 
    d.severity !== 'healthy' && !d.diagnosis.includes('Gingivitis') && !d.diagnosis.includes('Recession')
  );
  
  const affectedPercentage = (affectedTeeth.length / measurements.length) * 100;
  const bopPercentage = calculateBOPPercentage(measurements);
  
  // Determine extent
  const extent: 'localized' | 'generalized' = affectedPercentage > 30 ? 'generalized' : 'localized';
  
  // Find worst severity
  const severityOrder = { healthy: 0, mild: 1, moderate: 2, severe: 3 };
  const worstDiagnosis = toothDiagnoses.reduce((worst, current) => 
    severityOrder[current.severity] > severityOrder[worst.severity] ? current : worst
  );

  return {
    overallDiagnosis: { ...worstDiagnosis, extent },
    affectedTeethPercentage: affectedPercentage,
    bopPercentage,
    toothDiagnoses
  };
}

// ============================================================================
// SITE-SPECIFIC DISPLAY HELPERS
// ============================================================================

/**
 * Format site data for display
 */
function formatSiteDisplay(siteName: string, data: SiteData): {
  name: string;
  probingDepth: string;
  gingivalMargin: string;
  cal: number;
  indicators: string[];
} {
  const indicators: string[] = [];
  if (data.bleeding) indicators.push('🔴 Bleeding');
  if (data.plaque) indicators.push('🔵 Plaque');
  if (data.pus) indicators.push('🟡 Pus');
  if (data.tartar) indicators.push('⚫ Tartar');

  return {
    name: siteName,
    probingDepth: data.probingDepth.toString(),
    gingivalMargin: data.gingivalMargin >= 0 ? `+${data.gingivalMargin}` : data.gingivalMargin.toString(),
    cal: calculateCAL(data.probingDepth, data.gingivalMargin),
    indicators
  };
}

// ============================================================================
// SUMMARY TABLE
// ============================================================================

/**
 * Periodontal Diagnosis Summary
 * 
 * | Condition              | PD (mm)  | CAL (mm) | Bone Loss | BOP  | ICD-10    |
 * |------------------------|----------|----------|-----------|------|-----------|
 * | Healthy                | ≤3       | 0        | None      | No   | -         |
 * | Gingivitis             | ≤3       | 0        | None      | Yes  | K05.00/10 |
 * | Slight Periodontitis   | 4-5      | 1-2      | Slight    | Yes  | K05.x11   |
 * | Moderate Periodontitis | 5-6      | 3-4      | Moderate  | Yes  | K05.x12   |
 * | Severe Periodontitis   | >6       | ≥5       | Severe    | Yes  | K05.x13   |
 * 
 * Extent:
 * - Localized: <30% of teeth affected
 * - Generalized: ≥30% of teeth affected
 * 
 * Type (by age):
 * - Aggressive: Patient <30 years old (K05.2xx)
 * - Chronic: Patient ≥30 years old (K05.3xx)
 */

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Types
  SiteData,
  PeriodontalMeasurement,
  MobilityClass,
  SiteName,
  PeriodontalDiagnosis,
  ClinicalIndicators,
  MobilityInterpretation,
  
  // Constants
  PERIODONTAL_DIAGNOSES,
  MOBILITY_CLASSIFICATIONS,
  
  // Functions
  calculateCAL,
  getSeverityFromProbingDepth,
  getSeverityFromCAL,
  getDeepestProbing,
  getMaxCAL,
  countBleedingSites,
  calculateBOPPercentage,
  diagnoseToothPeriodontal,
  diagnoseFullMouthPeriodontal,
  formatSiteDisplay
};

