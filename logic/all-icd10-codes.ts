/**
 * ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
 * ║                          THAKAAMED - ALL ICD-10 CODES & BACKEND LOGIC                             ║
 * ║                      How Frontend Selections → Backend Processing → ICD-10 Codes                  ║
 * ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝
 * 
 * This file contains:
 
 * 1. Backend Logic Functions (mimicking server-side processing)
 * 2. Frontend Selection → ICD-10 Code Mapping
 * 3. API Response Structures
 */



// ════════════════════════════════════════════════════════════════════════════
// SECTION 1 : TYPE DEFINITIONS
// ════════════════════════════════════════════════════════════════════════════

export interface ICD10Code {
  code: string;
  description: string;
  shortDescription: string;
  category: DiagnosticCategory;
  severity: Severity;
  urgency: Urgency;
  treatmentRequired: boolean;
}

export type DiagnosticCategory = 
  | 'decay' 
  | 'fracture' 
  | 'tooth_wear' 
  | 'discoloration'
  | 'endodontic' 
  | 'periodontal' 
  | 'developmental'
  | 'missing'
  | 'restoration';

export type Severity = 'none' | 'mild' | 'moderate' | 'severe';
export type Urgency = 'low' | 'medium' | 'high' | 'emergency';

// Frontend selection types
export interface DecaySelection {
  toothNumber: string;
  aspects: string[];          // ['buccal', 'mesial', 'occlusal']
  depth: 'enamel' | 'dentin';
  cavitation: 'cavitated' | 'not_cavitated';
  classification?: 'c1' | 'c2' | 'c3' | 'c4';
}

export interface FractureSelection {
  toothNumber: string;
  type: 'crown_fracture' | 'root_fracture';
  direction?: 'vertical' | 'horizontal';
}

export interface ToothWearSelection {
  toothNumber: string;
  type: 'abrasion' | 'erosion' | 'attrition';
  locations: string[];        // ['buccal', 'lingual']
}

export interface DiscolorationSelection {
  toothNumber: string;
  color: 'red' | 'gray' | 'yellow';
}

export interface EndodonticSelection {
  toothNumber: string;
  coldTest: {
    result: 'positive' | 'uncertain' | 'negative' | 'not_applicable';
    positiveDetail?: 'within_limits' | 'unpleasant' | 'pain_stimulus' | 'pain_lingering';
    notApplicableReason?: 'existing_rct' | 'previously_initiated';
  };
  percussionTest: 'not_painful' | 'unpleasant' | 'painful';
  palpationTest: 'not_painful' | 'unpleasant' | 'painful';
  heatTest?: {
    result: 'positive' | 'uncertain' | 'negative' | 'not_applicable';
    positiveDetail?: 'within_limits' | 'unpleasant' | 'pain_stimulus' | 'pain_lingering';
  };
  electricityTest?: number;   // 1-10
}

export interface PeriodontalSelection {
  toothNumber: string;
  patientAge: number;
  sites: {
    name: string;             // 'mesio_buccal', 'buccal', etc.
    probingDepth: number;     // 0-12 or 13 for >12
    gingivalMargin: number;   // -12 to +7
    bleeding: boolean;
    plaque: boolean;
    pus: boolean;
    tartar: boolean;
  }[];
  mobility: 0 | 1 | 2 | 3;
}

export interface DiagnosisResult {
  toothNumber: string;
  icd10Codes: string[];
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  severity: Severity;
  urgency: Urgency;
  treatmentRequired: boolean;
  confirmationMessage: string;
}


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: BACKEND LOGIC FUNCTIONS (Mimicking Server-Side Processing)
// ════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ DECAY DIAGNOSIS ENGINE                                                  │
 * │ Frontend Selection → ICD-10 Code                                        │
 * └─────────────────────────────────────────────────────────────────────────┘
 */
export function processDecayDiagnosis(selection: DecaySelection): DiagnosisResult {
  let icd10Code: string;
  let primaryDiagnosis: string;

  // Step 1: Check if arrested caries (not cavitated)
  if (selection.cavitation === 'not_cavitated') {
    icd10Code = 'K02.3';
    primaryDiagnosis = 'Arrested dental caries';
  }
  // Step 2: Check for pulp exposure (C4 classification)
  else if (selection.classification === 'c4' && selection.depth === 'dentin') {
    icd10Code = 'K02.5';
    primaryDiagnosis = 'Dental caries with pulp exposure';
  }
  // Step 3: Determine by surface type and depth
  else {
    const hasCervical = selection.aspects.some(a => a.includes('cervical'));
    const hasOcclusal = selection.aspects.some(a => ['occlusal', 'incisal'].includes(a));

    if (hasCervical) {
      icd10Code = 'K02.53';
      primaryDiagnosis = 'Dental caries on root surface';
    } else if (hasOcclusal) {
      if (selection.depth === 'enamel') {
        icd10Code = 'K02.61';
        primaryDiagnosis = 'Pit/fissure caries limited to enamel';
      } else if (selection.classification === 'c4') {
        icd10Code = 'K02.63';
        primaryDiagnosis = 'Pit/fissure caries penetrating into pulp';
      } else {
        icd10Code = 'K02.62';
        primaryDiagnosis = 'Pit/fissure caries penetrating into dentin';
      }
    } else {
      // Smooth surface
      if (selection.depth === 'enamel') {
        icd10Code = 'K02.0';
        primaryDiagnosis = 'Dental caries limited to enamel';
      } else {
        icd10Code = 'K02.1';
        primaryDiagnosis = 'Dental caries of dentine';
      }
    }
  }

  const code = ICD10_DATABASE[icd10Code];
  
  return {
    toothNumber: selection.toothNumber,
    icd10Codes: [icd10Code],
    primaryDiagnosis,
    secondaryDiagnoses: [],
    severity: code?.severity || 'moderate',
    urgency: code?.urgency || 'medium',
    treatmentRequired: code?.treatmentRequired || true,
    confirmationMessage: `Tooth ${selection.toothNumber}: ${primaryDiagnosis}`
  };
}


/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ ENDODONTIC DIAGNOSIS ENGINE                                             │
 * │ Frontend Selection → ICD-10 Code(s)                                     │
 * └─────────────────────────────────────────────────────────────────────────┘
 */
export function processEndodonticDiagnosis(selection: EndodonticSelection): DiagnosisResult {
  const icd10Codes: string[] = [];
  let pulpDiagnosis = '';
  let periapicalDiagnosis = '';
  let severity: Severity = 'moderate';
  let urgency: Urgency = 'medium';

  // Step 1: Determine PULP diagnosis from Cold Test
  switch (selection.coldTest.result) {
    case 'positive':
      switch (selection.coldTest.positiveDetail) {
        case 'within_limits':
        case 'unpleasant':
          // Normal or sensitive pulp - no ICD-10 code
          pulpDiagnosis = 'Normal pulp';
          break;
        case 'pain_stimulus':
          icd10Codes.push('K04.01');
          pulpDiagnosis = 'Reversible pulpitis';
          break;
        case 'pain_lingering':
          icd10Codes.push('K04.02');
          pulpDiagnosis = 'Irreversible pulpitis';
          severity = 'severe';
          urgency = 'high';
          break;
      }
      break;
    case 'negative':
      icd10Codes.push('K04.1');
      pulpDiagnosis = 'Necrosis of pulp';
      severity = 'severe';
      urgency = 'high';
      break;
    case 'not_applicable':
      if (selection.coldTest.notApplicableReason === 'existing_rct') {
        pulpDiagnosis = 'Previously treated';
      } else {
        pulpDiagnosis = 'Treatment in progress';
      }
      break;
    case 'uncertain':
      pulpDiagnosis = 'Inconclusive';
      break;
  }

  // Step 2: Determine PERIAPICAL diagnosis from Percussion + Palpation
  if (selection.palpationTest === 'painful') {
    icd10Codes.push('K04.7');
    periapicalDiagnosis = 'Periapical abscess';
    severity = 'severe';
    urgency = 'emergency';
  } else if (selection.percussionTest === 'painful' || selection.percussionTest === 'unpleasant') {
    icd10Codes.push('K04.4');
    periapicalDiagnosis = 'Symptomatic apical periodontitis';
  } else if (selection.coldTest.result === 'negative' && selection.percussionTest === 'not_painful') {
    // Necrotic but no symptoms - chronic
    if (!icd10Codes.includes('K04.4')) {
      icd10Codes.push('K04.5');
      periapicalDiagnosis = 'Chronic apical periodontitis';
    }
  }

  // Step 3: Build confirmation message
  const parts: string[] = [];
  if (pulpDiagnosis && pulpDiagnosis !== 'Normal pulp') {
    parts.push(pulpDiagnosis);
  }
  if (periapicalDiagnosis) {
    parts.push(`with ${periapicalDiagnosis.toLowerCase()}`);
  }

  const confirmationMessage = parts.length > 0
    ? `Tooth ${selection.toothNumber}: ${parts.join(' ')}`
    : `Tooth ${selection.toothNumber}: Normal pulp with normal apical tissues`;

  return {
    toothNumber: selection.toothNumber,
    icd10Codes,
    primaryDiagnosis: pulpDiagnosis,
    secondaryDiagnoses: periapicalDiagnosis ? [periapicalDiagnosis] : [],
    severity,
    urgency,
    treatmentRequired: icd10Codes.length > 0,
    confirmationMessage
  };
}


/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ PERIODONTAL DIAGNOSIS ENGINE                                            │
 * │ Frontend Selection → ICD-10 Code                                        │
 * └─────────────────────────────────────────────────────────────────────────┘
 */
export function processPeriodontalDiagnosis(selection: PeriodontalSelection): DiagnosisResult {
  // Step 1: Calculate deepest probing depth and max CAL
  let maxPD = 0;
  let maxCAL = 0;
  let hasRecession = false;
  let hasBleeding = false;
  let hasPlaque = false;
  let hasPus = false;

  for (const site of selection.sites) {
    if (site.probingDepth > maxPD) maxPD = site.probingDepth;
    
    // Calculate CAL
    const cal = site.gingivalMargin < 0 
      ? site.probingDepth + Math.abs(site.gingivalMargin)
      : Math.max(0, site.probingDepth - site.gingivalMargin);
    if (cal > maxCAL) maxCAL = cal;
    
    if (site.gingivalMargin < 0) hasRecession = true;
    if (site.bleeding) hasBleeding = true;
    if (site.plaque) hasPlaque = true;
    if (site.pus) hasPus = true;
  }

  let icd10Code: string;
  let primaryDiagnosis: string;
  let severity: Severity;
  let urgency: Urgency;

  // Step 2: Determine diagnosis based on probing depth and CAL
  if (maxPD <= 3) {
    // Healthy or Gingivitis
    if (hasBleeding) {
      icd10Code = hasPlaque ? 'K05.10' : 'K05.01';
      primaryDiagnosis = hasPlaque ? 'Chronic plaque-induced gingivitis' : 'Acute non-plaque gingivitis';
      severity = 'mild';
      urgency = 'low';
    } else if (hasRecession) {
      // Recession without periodontitis
      const maxRecession = Math.max(...selection.sites.map(s => Math.abs(Math.min(0, s.gingivalMargin))));
      if (maxRecession <= 2) {
        icd10Code = 'K06.011';
        primaryDiagnosis = 'Localized gingival recession - minimal';
      } else if (maxRecession <= 4) {
        icd10Code = 'K06.012';
        primaryDiagnosis = 'Localized gingival recession - moderate';
      } else {
        icd10Code = 'K06.013';
        primaryDiagnosis = 'Localized gingival recession - severe';
      }
      severity = maxRecession > 4 ? 'severe' : maxRecession > 2 ? 'moderate' : 'mild';
      urgency = 'low';
    } else {
      return {
        toothNumber: selection.toothNumber,
        icd10Codes: [],
        primaryDiagnosis: 'Healthy periodontium',
        secondaryDiagnoses: [],
        severity: 'none',
        urgency: 'low',
        treatmentRequired: false,
        confirmationMessage: `Tooth ${selection.toothNumber}: Healthy periodontium`
      };
    }
  } else {
    // Periodontitis
    const isAggressive = selection.patientAge < 30;
    const typePrefix = isAggressive ? 'K05.2' : 'K05.3';
    const extentDigit = '1'; // Assume localized for single tooth
    
    // Severity based on CAL
    let severityDigit: string;
    if (maxCAL <= 2) {
      severityDigit = '1';
      severity = 'mild';
      urgency = isAggressive ? 'medium' : 'low';
      primaryDiagnosis = `${isAggressive ? 'Aggressive' : 'Chronic'} periodontitis - slight`;
    } else if (maxCAL <= 4) {
      severityDigit = '2';
      severity = 'moderate';
      urgency = 'medium';
      primaryDiagnosis = `${isAggressive ? 'Aggressive' : 'Chronic'} periodontitis - moderate`;
    } else {
      severityDigit = '3';
      severity = 'severe';
      urgency = 'high';
      primaryDiagnosis = `${isAggressive ? 'Aggressive' : 'Chronic'} periodontitis - severe`;
    }

    icd10Code = `${typePrefix}${extentDigit}${severityDigit}`;
  }

  return {
    toothNumber: selection.toothNumber,
    icd10Codes: [icd10Code!],
    primaryDiagnosis: primaryDiagnosis!,
    secondaryDiagnoses: [],
    severity: severity!,
    urgency: urgency!,
    treatmentRequired: true,
    confirmationMessage: `Tooth ${selection.toothNumber}: ${primaryDiagnosis}`
  };
}


/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ FRACTURE DIAGNOSIS ENGINE                                               │
 * │ Frontend Selection → ICD-10 Code                                        │
 * └─────────────────────────────────────────────────────────────────────────┘
 */
export function processFractureDiagnosis(selection: FractureSelection): DiagnosisResult {
  let icd10Code: string;
  let primaryDiagnosis: string;

  if (selection.type === 'root_fracture') {
    icd10Code = 'S02.5xxA';
    primaryDiagnosis = selection.direction === 'vertical' 
      ? 'Vertical root fracture' 
      : 'Horizontal root fracture';
  } else {
    icd10Code = 'K03.81';
    primaryDiagnosis = 'Cracked tooth';
  }

  return {
    toothNumber: selection.toothNumber,
    icd10Codes: [icd10Code],
    primaryDiagnosis,
    secondaryDiagnoses: [],
    severity: selection.type === 'root_fracture' && selection.direction === 'vertical' ? 'severe' : 'moderate',
    urgency: selection.type === 'root_fracture' ? 'high' : 'medium',
    treatmentRequired: true,
    confirmationMessage: `Tooth ${selection.toothNumber}: ${primaryDiagnosis}`
  };
}


/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ TOOTH WEAR DIAGNOSIS ENGINE                                             │
 * │ Frontend Selection → ICD-10 Code                                        │
 * └─────────────────────────────────────────────────────────────────────────┘
 */
export function processToothWearDiagnosis(selection: ToothWearSelection): DiagnosisResult {
  const icd10Map: Record<string, string> = {
    'abrasion': 'K03.1',
    'erosion': 'K03.2',
    'attrition': 'K03.0'
  };

  const icd10Code = icd10Map[selection.type];
  const code = ICD10_DATABASE[icd10Code];

  return {
    toothNumber: selection.toothNumber,
    icd10Codes: [icd10Code],
    primaryDiagnosis: code.description,
    secondaryDiagnoses: [],
    severity: 'moderate',
    urgency: 'low',
    treatmentRequired: true,
    confirmationMessage: `Tooth ${selection.toothNumber}: ${code.shortDescription} on ${selection.locations.join(', ')}`
  };
}


/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ DISCOLORATION DIAGNOSIS ENGINE                                          │
 * │ Frontend Selection → ICD-10 Code                                        │
 * └─────────────────────────────────────────────────────────────────────────┘
 */
export function processDiscolorationDiagnosis(selection: DiscolorationSelection): DiagnosisResult {
  return {
    toothNumber: selection.toothNumber,
    icd10Codes: ['K03.7'],
    primaryDiagnosis: 'Posteruptive color changes',
    secondaryDiagnoses: [],
    severity: 'mild',
    urgency: 'low',
    treatmentRequired: false,
    confirmationMessage: `Tooth ${selection.toothNumber}: ${selection.color} discoloration`
  };
}


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: API HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Get ICD-10 code details by code
 */
export function getICD10ByCode(code: string): ICD10Code | null {
  return ICD10_DATABASE[code] || null;
}

/**
 * Get all ICD-10 codes for a category
 */
export function getICD10ByCategory(category: DiagnosticCategory): ICD10Code[] {
  return Object.values(ICD10_DATABASE).filter(c => c.category === category);
}

/**
 * Search ICD-10 codes by description
 */
export function searchICD10(query: string): ICD10Code[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(ICD10_DATABASE).filter(c => 
    c.description.toLowerCase().includes(lowerQuery) ||
    c.shortDescription.toLowerCase().includes(lowerQuery) ||
    c.code.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get all codes (for dropdown/autocomplete)
 */
export function getAllICD10Codes(): ICD10Code[] {
  return Object.values(ICD10_DATABASE);
}

/**
 * Validate an ICD-10 code
 */
export function isValidICD10Code(code: string): boolean {
  return code in ICD10_DATABASE;
}


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: EXPORT SUMMARY
// ════════════════════════════════════════════════════════════════════════════

/**
 * USAGE EXAMPLE:
 * 
 * // 1. Frontend collects user selection
 * const decaySelection: DecaySelection = {
 *   toothNumber: '21',
 *   aspects: ['buccal'],
 *   depth: 'dentin',
 *   cavitation: 'cavitated',
 *   classification: 'c3'
 * };
 * 
 * // 2. Send to backend (or process locally)
 * const result = processDecayDiagnosis(decaySelection);
 * 
 * // 3. Result contains:
 * // {
 * //   toothNumber: '21',
 * //   icd10Codes: ['K02.1'],
 * //   primaryDiagnosis: 'Dental caries of dentine',
 * //   severity: 'moderate',
 * //   urgency: 'medium',
 * //   treatmentRequired: true,
 * //   confirmationMessage: 'Tooth 21: Dental caries of dentine'
 * // }
 * 
 * // 4. Display in popup confirmation dialog
 */

