/**
 * Tooth Actions Logic - ThakaaMed App
 * 
 * This file documents the logic for tooth-level actions:
 * - TO BE EXTRACTED
 * - MISSING
 * - PATHOLOGY (link to pathology-logic.ts)
 * - RESTORATION (link to restoration-logic.ts)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * ICD-10 CODE REFERENCE FOR TOOTH STATUS AND ACTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * MISSING TEETH - K08.1xx / K08.4xx
 * ──────────────────────────────────
 * Complete loss of teeth and Partial loss of teeth codes.
 * These are classified by:
 * 1. Cause of loss
 * 2. Kennedy Classification (position of missing teeth)
 * 
 * │ Code      │ Condition                              │ Kennedy Class    │
 * ├───────────┼────────────────────────────────────────┼──────────────────┤
 * │ K08.101   │ Complete loss, unspecified, Class I    │ Bilateral post.  │
 * │ K08.102   │ Complete loss, unspecified, Class II   │ Unilateral post. │
 * │ K08.103   │ Complete loss, unspecified, Class III  │ Unilateral bound.│
 * │ K08.104   │ Complete loss, unspecified, Class IV   │ Anterior crossing│
 * │ K08.109   │ Complete loss, unspecified class       │ Unspecified      │
 * │ K08.111   │ Complete loss due to trauma, Class I   │ Bilateral post.  │
 * │ K08.112   │ Complete loss due to trauma, Class II  │ Unilateral post. │
 * │ K08.113   │ Complete loss due to trauma, Class III │ Unilateral bound.│
 * │ K08.114   │ Complete loss due to trauma, Class IV  │ Anterior crossing│
 * │ K08.119   │ Complete loss due to trauma, unspec.   │ Unspecified      │
 * │ K08.121   │ Complete loss due to perio, Class I    │ Bilateral post.  │
 * │ K08.122   │ Complete loss due to perio, Class II   │ Unilateral post. │
 * │ K08.123   │ Complete loss due to perio, Class III  │ Unilateral bound.│
 * │ K08.124   │ Complete loss due to perio, Class IV   │ Anterior crossing│
 * │ K08.129   │ Complete loss due to perio, unspec.    │ Unspecified      │
 * │ K08.131   │ Complete loss due to caries, Class I   │ Bilateral post.  │
 * │ K08.132   │ Complete loss due to caries, Class II  │ Unilateral post. │
 * │ K08.133   │ Complete loss due to caries, Class III │ Unilateral bound.│
 * │ K08.134   │ Complete loss due to caries, Class IV  │ Anterior crossing│
 * │ K08.139   │ Complete loss due to caries, unspec.   │ Unspecified      │
 * │ K08.19x   │ Complete loss, other specified cause   │ Various          │
 * └───────────┴────────────────────────────────────────┴──────────────────┘
 * 
 * PARTIAL LOSS OF TEETH - K08.4xx
 * ────────────────────────────────
 * │ Code      │ Condition                              │ Kennedy Class    │
 * ├───────────┼────────────────────────────────────────┼──────────────────┤
 * │ K08.401   │ Partial loss, unspecified, Class I     │ Bilateral post.  │
 * │ K08.402   │ Partial loss, unspecified, Class II    │ Unilateral post. │
 * │ K08.403   │ Partial loss, unspecified, Class III   │ Unilateral bound.│
 * │ K08.404   │ Partial loss, unspecified, Class IV    │ Anterior crossing│
 * │ K08.409   │ Partial loss, unspecified class        │ Unspecified      │
 * │ K08.411   │ Partial loss due to trauma, Class I    │ Bilateral post.  │
 * │ K08.412   │ Partial loss due to trauma, Class II   │ Unilateral post. │
 * │ K08.413   │ Partial loss due to trauma, Class III  │ Unilateral bound.│
 * │ K08.414   │ Partial loss due to trauma, Class IV   │ Anterior crossing│
 * │ K08.419   │ Partial loss due to trauma, unspec.    │ Unspecified      │
 * │ K08.421   │ Partial loss due to perio, Class I     │ Bilateral post.  │
 * │ K08.422   │ Partial loss due to perio, Class II    │ Unilateral post. │
 * │ K08.423   │ Partial loss due to perio, Class III   │ Unilateral bound.│
 * │ K08.424   │ Partial loss due to perio, Class IV    │ Anterior crossing│
 * │ K08.429   │ Partial loss due to perio, unspec.     │ Unspecified      │
 * │ K08.431   │ Partial loss due to caries, Class I    │ Bilateral post.  │
 * │ K08.432   │ Partial loss due to caries, Class II   │ Unilateral post. │
 * │ K08.433   │ Partial loss due to caries, Class III  │ Unilateral bound.│
 * │ K08.434   │ Partial loss due to caries, Class IV   │ Anterior crossing│
 * │ K08.439   │ Partial loss due to caries, unspec.    │ Unspecified      │
 * │ K08.49x   │ Partial loss, other specified cause    │ Various          │
 * └───────────┴────────────────────────────────────────┴──────────────────┘
 * 
 * CONGENITAL MISSING TEETH (ANODONTIA) - K00.0
 * ─────────────────────────────────────────────
 * │ Code    │ Condition                              │ Description          │
 * ├─────────┼────────────────────────────────────────┼──────────────────────┤
 * │ K00.0   │ Anodontia                              │ Congenital absence   │
 * └─────────┴────────────────────────────────────────┴──────────────────────┘
 * 
 * KENNEDY CLASSIFICATION EXPLAINED:
 * ─────────────────────────────────
 * - Class I:   Bilateral edentulous areas posterior to remaining natural teeth
 * - Class II:  Unilateral edentulous area posterior to remaining teeth
 * - Class III: Unilateral edentulous area with teeth on both sides (bounded)
 * - Class IV:  Single edentulous area anterior to remaining teeth,
 *              crossing midline
 * 
 * TO BE EXTRACTED - Reasons and Related ICD-10 Codes
 * ───────────────────────────────────────────────────
 * Teeth may need extraction due to various conditions:
 * 
 * │ Reason               │ ICD-10 Code │ Description                        │
 * ├──────────────────────┼─────────────┼────────────────────────────────────┤
 * │ Caries (unrestorable)│ K02.5       │ Dental caries with pulp exposure   │
 * │ Periodontitis        │ K05.3xx     │ Chronic periodontitis (severe)     │
 * │ Pulp necrosis        │ K04.1       │ Necrosis of pulp                   │
 * │ Abscess              │ K04.7       │ Periapical abscess without sinus   │
 * │ Root fracture        │ S02.5       │ Fracture of tooth (vertical root)  │
 * │ Failed RCT           │ K04.5       │ Chronic apical periodontitis       │
 * │ Orthodontic          │ Z01.20      │ Dental examination (ortho eval)    │
 * │ Impaction            │ K01.0/K01.1 │ Embedded/Impacted teeth            │
 * │ Supernumerary        │ K00.1       │ Supernumerary teeth                │
 * │ Prosthetic needs     │ Z46.3       │ Fitting and adjustment of denture  │
 * │ Mobility Class 3     │ K05.323     │ Severe periodontitis, generalized  │
 * └──────────────────────┴─────────────┴────────────────────────────────────┘
 * 
 * IMPACTED/EMBEDDED TEETH - K01.x
 * ────────────────────────────────
 * │ Code    │ Condition                    │ Description                    │
 * ├─────────┼──────────────────────────────┼────────────────────────────────┤
 * │ K01.0   │ Embedded teeth               │ Teeth that failed to erupt     │
 * │ K01.1   │ Impacted teeth               │ Teeth blocked by other teeth   │
 * └─────────┴──────────────────────────────┴────────────────────────────────┘
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ToothAction {
  id: string;
  name: string;
  route: string;
  icon: string;
  icd10Codes?: ICD10Reference[];
  description: string;
}

interface ICD10Reference {
  code: string;
  name: string;
  description: string;
  causedBy?: string[];  // Related conditions that lead to this
}

interface ToothStatus {
  toothNumber: string;
  isPresent: boolean;
  isMissing: boolean;
  missingReason?: MissingReason;
  toBeExtracted: boolean;
  extractionReason?: ExtractionReason;
  pathologies: string[];      // Links to pathology-logic.ts
  restorations: string[];     // Links to restoration-logic.ts
  endodonticStatus?: string;  // Links to endodontic-logic.ts
  periodontalStatus?: string; // Links to periodontal-logic.ts
}

type MissingReason = 
  | 'congenital'       // K00.0 - Anodontia
  | 'trauma'           // K08.x1x - Due to trauma
  | 'periodontal'      // K08.x2x - Due to periodontal disease
  | 'caries'           // K08.x3x - Due to caries
  | 'extraction'       // K08.x9x - Due to other cause
  | 'unknown';         // K08.x0x - Unspecified cause

type ExtractionReason =
  | 'caries'           // K02.5 - Unrestorable caries
  | 'periodontal'      // K05.3xx - Severe periodontitis
  | 'endodontic'       // K04.x - Pulp/periapical disease
  | 'fracture'         // S02.5 - Tooth fracture
  | 'orthodontic'      // Z01.20 - For orthodontic treatment
  | 'prosthetic'       // Z46.3 - For prosthetic needs
  | 'impacted'         // K01.1 - Impacted tooth
  | 'supernumerary'    // K00.1 - Extra tooth
  | 'other';

// ============================================================================
// TOOTH ACTIONS CONFIGURATION
// ============================================================================

const TOOTH_ACTIONS: ToothAction[] = [
  {
    id: 'to_be_extracted',
    name: 'TO BE EXTRACTED',
    route: '/tooth/{id}/extraction',
    icon: 'to-be-extracted',
    description: 'Mark tooth for planned extraction. Select reason for extraction planning.',
    icd10Codes: [
      {
        code: 'K02.5',
        name: 'Dental caries with pulp exposure',
        description: 'Caries too extensive for restoration',
        causedBy: ['Deep caries', 'Failed restorations']
      },
      {
        code: 'K04.1',
        name: 'Necrosis of pulp',
        description: 'Dead tooth not amenable to RCT',
        causedBy: ['Untreated pulpitis', 'Trauma']
      },
      {
        code: 'K04.7',
        name: 'Periapical abscess without sinus',
        description: 'Acute infection requiring removal',
        causedBy: ['Pulp necrosis', 'Failed RCT']
      },
      {
        code: 'K05.313',
        name: 'Chronic localized periodontitis - Severe',
        description: 'Severe bone loss, hopeless prognosis',
        causedBy: ['Untreated periodontal disease']
      },
      {
        code: 'K05.323',
        name: 'Chronic generalized periodontitis - Severe',
        description: 'Severe generalized bone loss',
        causedBy: ['Untreated periodontal disease']
      },
      {
        code: 'S02.5xxA',
        name: 'Fracture of tooth, initial encounter',
        description: 'Vertical root fracture, unrestorable',
        causedBy: ['Trauma', 'Bruxism', 'Post and core']
      },
      {
        code: 'K01.1',
        name: 'Impacted teeth',
        description: 'Impacted tooth causing problems',
        causedBy: ['Developmental', 'Space deficiency']
      },
      {
        code: 'K00.1',
        name: 'Supernumerary teeth',
        description: 'Extra tooth requiring removal',
        causedBy: ['Developmental anomaly']
      }
    ]
  },
  {
    id: 'missing',
    name: 'MISSING',
    route: '/tooth/{id}/missing',
    icon: 'missing',
    description: 'Document that tooth is absent. Record reason if known.',
    icd10Codes: [
      {
        code: 'K00.0',
        name: 'Anodontia',
        description: 'Congenital absence of teeth',
        causedBy: ['Genetic', 'Developmental']
      },
      {
        code: 'K08.109',
        name: 'Complete loss of teeth, unspecified cause',
        description: 'All teeth missing, cause unknown',
        causedBy: ['Various']
      },
      {
        code: 'K08.119',
        name: 'Complete loss of teeth due to trauma',
        description: 'All teeth lost from injury',
        causedBy: ['Accident', 'Sports injury']
      },
      {
        code: 'K08.129',
        name: 'Complete loss of teeth due to periodontal disease',
        description: 'All teeth lost from gum disease',
        causedBy: ['Severe periodontitis']
      },
      {
        code: 'K08.139',
        name: 'Complete loss of teeth due to caries',
        description: 'All teeth lost from decay',
        causedBy: ['Untreated caries']
      },
      {
        code: 'K08.409',
        name: 'Partial loss of teeth, unspecified cause',
        description: 'Some teeth missing, cause unknown',
        causedBy: ['Various']
      },
      {
        code: 'K08.419',
        name: 'Partial loss of teeth due to trauma',
        description: 'Some teeth lost from injury',
        causedBy: ['Accident', 'Sports injury']
      },
      {
        code: 'K08.429',
        name: 'Partial loss of teeth due to periodontal disease',
        description: 'Some teeth lost from gum disease',
        causedBy: ['Periodontitis']
      },
      {
        code: 'K08.439',
        name: 'Partial loss of teeth due to caries',
        description: 'Some teeth lost from decay',
        causedBy: ['Untreated caries', 'Failed restorations']
      }
    ]
  },
  {
    id: 'pathology',
    name: 'PATHOLOGY',
    route: '/tooth/{id}/pathology',
    icon: 'add',
    description: 'Add pathology finding to tooth. See pathology-logic.ts for details.',
    /**
     * Links to pathology-logic.ts for ICD-10 codes:
     * - Decay: K02.x
     * - Fracture: S02.5, K03.81
     * - Tooth Wear: K03.0, K03.1, K03.2
     * - Discoloration: K03.7
     * - Apical: K04.x
     * - Development Disorder: K00.x
     */
  },
  {
    id: 'restoration',
    name: 'RESTORATION',
    route: '/tooth/{id}/restoration',
    icon: 'add',
    description: 'Add restoration to tooth. See restoration-logic.ts for details.',
    /**
     * Links to restoration-logic.ts
     * Restorations are treatments, not diagnoses.
     * The underlying diagnoses are documented in pathology-logic.ts
     */
  }
];

// ============================================================================
// ICD-10 CODE LOOKUP TABLES
// ============================================================================

/**
 * Complete ICD-10 reference for missing teeth by cause and class
 */
const MISSING_TEETH_ICD10 = {
  // By cause
  causes: {
    unspecified: 'x0',
    trauma: 'x1',
    periodontal: 'x2',
    caries: 'x3',
    other: 'x9'
  },
  
  // By Kennedy class
  classes: {
    I: '1',    // Bilateral posterior
    II: '2',   // Unilateral posterior
    III: '3',  // Unilateral bounded
    IV: '4',   // Anterior crossing midline
    unspecified: '9'
  },
  
  // Code builder
  buildCode: (
    isComplete: boolean, 
    cause: 'unspecified' | 'trauma' | 'periodontal' | 'caries' | 'other',
    kennedyClass: 'I' | 'II' | 'III' | 'IV' | 'unspecified'
  ): string => {
    const baseCode = isComplete ? 'K08.1' : 'K08.4';
    const causeDigit = cause === 'unspecified' ? '0' : 
                       cause === 'trauma' ? '1' :
                       cause === 'periodontal' ? '2' :
                       cause === 'caries' ? '3' : '9';
    const classDigit = kennedyClass === 'I' ? '1' :
                       kennedyClass === 'II' ? '2' :
                       kennedyClass === 'III' ? '3' :
                       kennedyClass === 'IV' ? '4' : '9';
    return `${baseCode}${causeDigit}${classDigit}`;
  }
};

/**
 * Extraction reason to ICD-10 mapping
 */
const EXTRACTION_REASON_ICD10: Record<ExtractionReason, ICD10Reference> = {
  caries: {
    code: 'K02.5',
    name: 'Dental caries with pulp exposure',
    description: 'Tooth unrestorable due to extensive caries'
  },
  periodontal: {
    code: 'K05.323',
    name: 'Chronic periodontitis, severe',
    description: 'Tooth has hopeless periodontal prognosis'
  },
  endodontic: {
    code: 'K04.7',
    name: 'Periapical abscess',
    description: 'Endodontic failure or untreatable'
  },
  fracture: {
    code: 'S02.5xxA',
    name: 'Fracture of tooth',
    description: 'Vertical root fracture or severe crown fracture'
  },
  orthodontic: {
    code: 'Z01.20',
    name: 'Encounter for dental examination',
    description: 'Extraction for orthodontic space'
  },
  prosthetic: {
    code: 'Z46.3',
    name: 'Encounter for fitting of dental prosthetic device',
    description: 'Extraction for prosthetic treatment plan'
  },
  impacted: {
    code: 'K01.1',
    name: 'Impacted teeth',
    description: 'Impacted tooth causing pathology or preventing treatment'
  },
  supernumerary: {
    code: 'K00.1',
    name: 'Supernumerary teeth',
    description: 'Extra tooth requiring removal'
  },
  other: {
    code: 'K08.89',
    name: 'Other specified disorders of teeth and supporting structures',
    description: 'Other reason for extraction'
  }
};

/**
 * Missing reason to ICD-10 mapping
 */
const MISSING_REASON_ICD10: Record<MissingReason, { codePrefix: string; description: string }> = {
  congenital: {
    codePrefix: 'K00.0',
    description: 'Anodontia - congenital absence of tooth'
  },
  trauma: {
    codePrefix: 'K08.x1x',
    description: 'Loss of teeth due to trauma'
  },
  periodontal: {
    codePrefix: 'K08.x2x',
    description: 'Loss of teeth due to periodontal disease'
  },
  caries: {
    codePrefix: 'K08.x3x',
    description: 'Loss of teeth due to caries'
  },
  extraction: {
    codePrefix: 'K08.x9x',
    description: 'Loss of teeth due to other specified cause'
  },
  unknown: {
    codePrefix: 'K08.x0x',
    description: 'Loss of teeth, unspecified cause'
  }
};

// ============================================================================
// LOGIC FUNCTIONS
// ============================================================================

/**
 * Generate ICD-10 code for missing tooth
 */
function getMissingToothICD10(
  reason: MissingReason,
  isComplete: boolean,
  kennedyClass: 'I' | 'II' | 'III' | 'IV' | 'unspecified' = 'unspecified'
): string {
  if (reason === 'congenital') {
    return 'K00.0';
  }
  
  const causeMap: Record<MissingReason, 'unspecified' | 'trauma' | 'periodontal' | 'caries' | 'other'> = {
    congenital: 'other',
    trauma: 'trauma',
    periodontal: 'periodontal',
    caries: 'caries',
    extraction: 'other',
    unknown: 'unspecified'
  };
  
  return MISSING_TEETH_ICD10.buildCode(isComplete, causeMap[reason], kennedyClass);
}

/**
 * Generate ICD-10 code for tooth to be extracted
 */
function getExtractionReasonICD10(reason: ExtractionReason): ICD10Reference {
  return EXTRACTION_REASON_ICD10[reason];
}

/**
 * Get all related ICD-10 codes for a tooth based on its status
 */
function getToothICD10Codes(status: ToothStatus): string[] {
  const codes: string[] = [];
  
  if (status.isMissing && status.missingReason) {
    codes.push(getMissingToothICD10(status.missingReason, false));
  }
  
  if (status.toBeExtracted && status.extractionReason) {
    codes.push(getExtractionReasonICD10(status.extractionReason).code);
  }
  
  return codes;
}

// ============================================================================
// UI DATA - Tooth numbering systems
// ============================================================================

/**
 * FDI (ISO) Two-Digit Tooth Numbering System
 * 
 * Quadrant numbers (first digit):
 * - 1: Upper right (permanent)
 * - 2: Upper left (permanent)
 * - 3: Lower left (permanent)
 * - 4: Lower right (permanent)
 * - 5-8: Same pattern for deciduous teeth
 * 
 * Tooth numbers (second digit): 1-8
 * - 1: Central incisor
 * - 2: Lateral incisor
 * - 3: Canine
 * - 4: First premolar
 * - 5: Second premolar
 * - 6: First molar
 * - 7: Second molar
 * - 8: Third molar
 * 
 * Example: Tooth 21 = Upper left central incisor
 */
const FDI_TOOTH_NUMBERS = {
  upperRight: ['18', '17', '16', '15', '14', '13', '12', '11'],
  upperLeft: ['21', '22', '23', '24', '25', '26', '27', '28'],
  lowerLeft: ['31', '32', '33', '34', '35', '36', '37', '38'],
  lowerRight: ['48', '47', '46', '45', '44', '43', '42', '41']
};

/**
 * Universal (ADA) Tooth Numbering System
 * 
 * Numbers 1-32 for permanent teeth:
 * - 1-16: Upper arch (right to left)
 * - 17-32: Lower arch (left to right)
 * 
 * Letters A-T for deciduous teeth
 */
const UNIVERSAL_TOOTH_NUMBERS = {
  upper: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
  lower: ['32', '31', '30', '29', '28', '27', '26', '25', '24', '23', '22', '21', '20', '19', '18', '17']
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Types
  ToothAction,
  ToothStatus,
  ICD10Reference,
  MissingReason,
  ExtractionReason,
  
  // Constants
  TOOTH_ACTIONS,
  MISSING_TEETH_ICD10,
  EXTRACTION_REASON_ICD10,
  MISSING_REASON_ICD10,
  FDI_TOOTH_NUMBERS,
  UNIVERSAL_TOOTH_NUMBERS,
  
  // Functions
  getMissingToothICD10,
  getExtractionReasonICD10,
  getToothICD10Codes
};

