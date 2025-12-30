/**
 * Pathology Options Logic - ThakaaMed App
 * 
 * This file documents the conditional display logic for pathology options.
 * The UI uses a cascading/dependent field pattern where child options
 * appear based on parent selections.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * ICD-10 CODE REFERENCE FOR PATHOLOGY CONDITIONS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * DENTAL CARIES (DECAY) - K02.x
 * ─────────────────────────────
 * │ Code    │ Condition                              │ UI Selection              │
 * ├─────────┼────────────────────────────────────────┼───────────────────────────┤
 * │ K02.0   │ Caries limited to enamel               │ Depth: Enamel             │
 * │ K02.1   │ Caries of dentine                      │ Depth: Dentin             │
 * │ K02.2   │ Caries of cementum (root caries)       │ Cervical surfaces         │
 * │ K02.3   │ Arrested dental caries                 │ No Cavitation             │
 * │ K02.5   │ Caries with pulp exposure              │ Deep dentin + symptoms    │
 * │ K02.51  │ Caries on pit and fissure surface      │ Occlusal/Incisal          │
 * │ K02.52  │ Caries on smooth surface               │ Buccal/Palatal/Lingual    │
 * │ K02.53  │ Caries on root surface                 │ Cervical Buccal/Palatal   │
 * │ K02.61  │ Caries pit/fissure limited to enamel   │ Enamel + Occlusal         │
 * │ K02.62  │ Caries pit/fissure penetrating dentin  │ Dentin + Occlusal         │
 * │ K02.63  │ Caries pit/fissure penetrating pulp    │ Dentin + Cavitation + C4  │
 * └─────────┴────────────────────────────────────────┴───────────────────────────┘
 * 
 * CLASSIFICATION (C1-C4) relates to ICDAS/ICCMS staging:
 * - C1: Initial lesion (white spot) - Early demineralization
 * - C2: Established lesion - Enamel breakdown
 * - C3: Localized enamel breakdown - Dentin exposed
 * - C4: Underlying dentin shadow - Deep dentin/pulp involvement
 * 
 * TOOTH FRACTURE - S02.5xx / K03.81
 * ──────────────────────────────────
 * │ Code     │ Condition                        │ UI Selection                  │
 * ├──────────┼──────────────────────────────────┼───────────────────────────────┤
 * │ S02.5xxA │ Fracture of tooth (initial)      │ Crown Fracture (trauma)       │
 * │ S02.5xxD │ Fracture of tooth (subsequent)   │ Crown Fracture (follow-up)    │
 * │ K03.81   │ Cracked tooth                    │ Crown Fracture (non-trauma)   │
 * │ K08.53   │ Fractured dental material        │ Restoration fracture          │
 * │ S02.5    │ Root fracture                    │ Root Fracture                 │
 * └──────────┴──────────────────────────────────┴───────────────────────────────┘
 * 
 * Root Fracture Direction:
 * - Vertical root fracture: Poor prognosis, usually extraction
 * - Horizontal root fracture: May be treatable depending on location
 * 
 * TOOTH WEAR - K03.0 / K03.1 / K03.2
 * ───────────────────────────────────
 * │ Code   │ Condition                          │ UI Selection        │ Cause           │
 * ├────────┼────────────────────────────────────┼─────────────────────┼─────────────────┤
 * │ K03.0  │ Attrition (excessive wear)         │ (not in current UI) │ Tooth-to-tooth  │
 * │ K03.1  │ Abrasion (abnormal wearing)        │ Type: Abrasion      │ Mechanical      │
 * │ K03.2  │ Erosion (chemical dissolution)     │ Type: Erosion       │ Chemical/Acid   │
 * └────────┴────────────────────────────────────┴─────────────────────┴─────────────────┘
 * 
 * Location affects diagnosis:
 * - Buccal abrasion: Often from aggressive brushing (K03.1)
 * - Lingual erosion: Often from gastric acid/GERD (K03.2)
 * - Occlusal wear: Often from bruxism (K03.0)
 * 
 * TOOTH DISCOLORATION - K03.7
 * ────────────────────────────
 * │ Code   │ Condition                    │ UI Selection    │ Clinical Significance        │
 * ├────────┼──────────────────────────────┼─────────────────┼──────────────────────────────┤
 * │ K03.7  │ Posteruptive color changes   │ Any color       │ Acquired discoloration       │
 * │ K00.8  │ Developmental discoloration  │ Any color       │ Fluorosis, tetracycline      │
 * └────────┴──────────────────────────────┴─────────────────┴──────────────────────────────┘
 * 
 * Color clinical meanings:
 * - Red: Internal resorption, hyperemic pulp
 * - Gray: Pulp necrosis, trauma, amalgam tattoo
 * - Yellow: Age-related, pulp obliteration, tetracycline
 * 
 * PERIAPICAL PATHOLOGY (APICAL) - K04.x
 * ──────────────────────────────────────
 * │ Code   │ Condition                          │ UI Selection    │ Relation to Endodontic │
 * ├────────┼────────────────────────────────────┼─────────────────┼────────────────────────┤
 * │ K04.4  │ Acute apical periodontitis         │ Present: Yes    │ Symptomatic            │
 * │ K04.5  │ Chronic apical periodontitis       │ Present: Yes    │ Asymptomatic           │
 * │ K04.6  │ Periapical abscess with sinus      │ Present: Yes    │ Draining fistula       │
 * │ K04.7  │ Periapical abscess without sinus   │ Present: Yes    │ Acute, swelling        │
 * │ K04.8  │ Radicular cyst                     │ Present: Yes    │ Chronic lesion         │
 * └────────┴────────────────────────────────────┴─────────────────┴────────────────────────┘
 * 
 * Note: Apical pathology in this section is for radiographic/clinical observation.
 * For diagnosis based on clinical tests, see endodontic-logic.ts
 * 
 * DEVELOPMENTAL DISORDERS - K00.x
 * ────────────────────────────────
 * │ Code   │ Condition                    │ Description                              │
 * ├────────┼──────────────────────────────┼──────────────────────────────────────────┤
 * │ K00.0  │ Anodontia                    │ Missing teeth (congenital)               │
 * │ K00.1  │ Supernumerary teeth          │ Extra teeth                              │
 * │ K00.2  │ Abnormalities of size/form   │ Microdontia, macrodontia, fusion         │
 * │ K00.3  │ Mottled teeth                │ Dental fluorosis                         │
 * │ K00.4  │ Disturbances in formation    │ Enamel hypoplasia, dentinogenesis        │
 * │ K00.5  │ Hereditary disturbances      │ Amelogenesis imperfecta                  │
 * │ K00.6  │ Disturbances in eruption     │ Natal teeth, delayed eruption            │
 * │ K00.7  │ Teething syndrome            │ Eruption-related symptoms                │
 * │ K00.8  │ Other disorders              │ Turner's tooth, dilaceration             │
 * │ K00.9  │ Unspecified disorder         │ General developmental anomaly            │
 * └────────┴──────────────────────────────┴──────────────────────────────────────────┘
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Option {
  id: string;
  name: string;
  type: 'radio' | 'checkbox';
  value: string;
  icd10Code?: string;  // Associated ICD-10 code
}

interface OptionGroup {
  id: string;
  name: string;
  options: Option[];
  inputType: 'radio' | 'checkbox';
  showWhen?: Condition;
}

interface Condition {
  field: string;
  operator: 'equals' | 'notEmpty' | 'includes';
  value?: string | string[];
}

interface PathologyType {
  id: string;
  name: string;
  route: string;
  hasAspects: boolean;
  icd10CodeBase: string;        // Base ICD-10 code for this pathology
  icd10Description: string;     // Description of the ICD-10 category
  aspects?: OptionGroup;
  optionGroups: OptionGroup[];
}

interface PathologyDiagnosis {
  pathologyType: string;
  icd10Code: string;
  description: string;
  surfaces?: string[];
  details: Record<string, string>;
}

// ============================================================================
// STATIC DATA WITH ICD-10 CODES
// ============================================================================

const PATHOLOGY_TYPES: PathologyType[] = [
  {
    id: 'decay',
    name: 'Decay',
    route: '/pathology/decay',
    hasAspects: true,
    icd10CodeBase: 'K02',
    icd10Description: 'Dental caries - Disease of hard tissues of teeth',
    aspects: {
      id: 'decay_aspects',
      name: 'Surfaces',
      inputType: 'checkbox',
      options: [
        // Cervical surfaces → K02.2x (root caries) or K02.53
        { id: 'cervical_buccal', name: 'Cervical Buccal', type: 'checkbox', value: 'cervical_buccal', icd10Code: 'K02.53' },
        { id: 'cervical_palatal', name: 'Cervical Palatal', type: 'checkbox', value: 'cervical_palatal', icd10Code: 'K02.53' },
        // Smooth surfaces → K02.52
        { id: 'buccal', name: 'Buccal', type: 'checkbox', value: 'buccal', icd10Code: 'K02.52' },
        { id: 'palatal', name: 'Palatal', type: 'checkbox', value: 'palatal', icd10Code: 'K02.52' },
        { id: 'buccal_surface', name: 'Buccal Surface', type: 'checkbox', value: 'buccal_surface', icd10Code: 'K02.52' },
        { id: 'palatal_surface', name: 'Palatal Surface', type: 'checkbox', value: 'palatal_surface', icd10Code: 'K02.52' },
        // Proximal surfaces → K02.52
        { id: 'mesial', name: 'Mesial', type: 'checkbox', value: 'mesial', icd10Code: 'K02.52' },
        { id: 'distal', name: 'Distal', type: 'checkbox', value: 'distal', icd10Code: 'K02.52' },
        // Pit and fissure → K02.51
        { id: 'incisal', name: 'Incisal', type: 'checkbox', value: 'incisal', icd10Code: 'K02.51' },
        // Class IV (involves incisal angle) → Complex coding
        { id: 'class4_mesial', name: 'Class 4 Mesial', type: 'checkbox', value: 'class4_mesial', icd10Code: 'K02.52' },
        { id: 'class4_distal', name: 'Class 4 Distal', type: 'checkbox', value: 'class4_distal', icd10Code: 'K02.52' },
      ]
    },
    optionGroups: [
      /**
       * DEPTH determines the severity and ICD-10 sub-code:
       * - Enamel → K02.0 (Caries limited to enamel) or K02.61 (pit/fissure enamel)
       * - Dentin → K02.1 (Caries of dentin) or K02.62 (pit/fissure dentin)
       */
      {
        id: 'depth_layer',
        name: 'Depth',
        inputType: 'radio',
        options: [
          { id: 'enamel', name: 'Enamel', type: 'radio', value: 'enamel', icd10Code: 'K02.0' },
          { id: 'dentin', name: 'Dentin', type: 'radio', value: 'dentin', icd10Code: 'K02.1' },
        ],
      },
      /**
       * CAVITATION indicates lesion activity:
       * - Cavitation → Active caries requiring restoration
       * - No Cavitation → K02.3 (Arrested caries) or remineralizable
       */
      {
        id: 'cavitation_status',
        name: 'Cavitation',
        inputType: 'radio',
        options: [
          { id: 'cavitation', name: 'Cavitation', type: 'radio', value: 'cavitation' },
          { id: 'no_cavitation', name: 'No Cavitation', type: 'radio', value: 'no_cavitation', icd10Code: 'K02.3' },
        ],
        showWhen: {
          field: 'aspects',
          operator: 'notEmpty',
        }
      },
      /**
       * CLASSIFICATION (ICDAS/ICCMS staging):
       * C1 → Initial lesion (white spot), enamel only
       * C2 → Established lesion, enamel breakdown
       * C3 → Localized enamel breakdown, dentin exposed
       * C4 → Underlying dentin shadow → K02.5 (pulp exposure risk) or K02.63
       */
      {
        id: 'classification',
        name: 'Classification',
        inputType: 'radio',
        options: [
          { id: 'c1', name: 'C1', type: 'radio', value: 'c1', icd10Code: 'K02.0' },
          { id: 'c2', name: 'C2', type: 'radio', value: 'c2', icd10Code: 'K02.0' },
          { id: 'c3', name: 'C3', type: 'radio', value: 'c3', icd10Code: 'K02.1' },
          { id: 'c4', name: 'C4', type: 'radio', value: 'c4', icd10Code: 'K02.5' },
        ],
        showWhen: {
          field: 'cavitation_status',
          operator: 'notEmpty',
        }
      },
    ]
  },
  {
    id: 'fracture',
    name: 'Fracture',
    route: '/pathology/fracture',
    hasAspects: false,
    icd10CodeBase: 'S02.5',
    icd10Description: 'Fracture of tooth - Traumatic injury to teeth',
    optionGroups: [
      /**
       * FRACTURE TYPE:
       * - Crown Fracture → S02.5xxA (initial) or K03.81 (cracked tooth)
       * - Root Fracture → S02.5 (traumatic) with additional specificity
       */
      {
        id: 'fracture_type',
        name: 'Type',
        inputType: 'radio',
        options: [
          { id: 'crown_fracture', name: 'Crown Fracture', type: 'radio', value: 'crown_fracture', icd10Code: 'S02.5xxA' },
          { id: 'root_fracture', name: 'Root Fracture', type: 'radio', value: 'root_fracture', icd10Code: 'S02.5xxA' },
        ],
      },
      /**
       * ROOT FRACTURE DIRECTION (prognosis indicator):
       * - Vertical → Poor prognosis, usually requires extraction
       * - Horizontal → May be treatable depending on fracture location
       *   - Apical 1/3: Good prognosis
       *   - Middle 1/3: Moderate prognosis  
       *   - Cervical 1/3: Poor prognosis
       */
      {
        id: 'root_fracture_direction',
        name: 'Direction',
        inputType: 'radio',
        options: [
          { id: 'vertical', name: 'Vertical', type: 'radio', value: 'vertical' },
          { id: 'horizontal', name: 'Horizontal', type: 'radio', value: 'horizontal' },
        ],
        showWhen: {
          field: 'fracture_type',
          operator: 'equals',
          value: 'root_fracture',
        }
      },
    ]
  },
  {
    id: 'tooth_wear',
    name: 'Tooth Wear',
    route: '/pathology/tooth-wear',
    hasAspects: false,
    icd10CodeBase: 'K03',
    icd10Description: 'Other diseases of hard tissues of teeth',
    optionGroups: [
      /**
       * WEAR TYPE determines the ICD-10 code:
       * - Abrasion (K03.1): Mechanical wear from external objects
       *   Causes: Aggressive brushing, toothpicks, abrasive foods
       * - Erosion (K03.2): Chemical dissolution of tooth structure
       *   Causes: Dietary acids, GERD, bulimia, acidic medications
       * 
       * Note: Attrition (K03.0) - tooth-to-tooth wear from bruxism
       * is not currently in the UI but could be added
       */
      {
        id: 'wear_type',
        name: 'Type',
        inputType: 'radio',
        options: [
          { id: 'abrasion', name: 'Abrasion', type: 'radio', value: 'abrasion', icd10Code: 'K03.1' },
          { id: 'erosion', name: 'Erosion', type: 'radio', value: 'erosion', icd10Code: 'K03.2' },
        ],
      },
      /**
       * LOCATION helps identify the cause:
       * - Buccal + Abrasion → Usually from aggressive tooth brushing
       * - Lingual + Erosion → Usually from gastric acid (GERD/bulimia)
       * - Buccal + Erosion → Usually from dietary acids (citrus, soda)
       */
      {
        id: 'wear_location',
        name: 'Location',
        inputType: 'checkbox',
        options: [
          { id: 'buccal', name: 'Buccal', type: 'checkbox', value: 'buccal' },
          { id: 'lingual', name: 'Lingual', type: 'checkbox', value: 'lingual' },
        ],
        showWhen: {
          field: 'wear_type',
          operator: 'notEmpty',
        }
      },
    ]
  },
  {
    id: 'discoloration',
    name: 'Discoloration',
    route: '/pathology/discoloration',
    hasAspects: false,
    icd10CodeBase: 'K03.7',
    icd10Description: 'Posteruptive color changes of dental hard tissues',
    optionGroups: [
      /**
       * COLOR indicates different underlying conditions:
       * 
       * RED (K03.7):
       * - Internal resorption (pink spot)
       * - Hyperemic pulp (increased blood flow)
       * - Pulp polyp
       * 
       * GRAY (K03.7):
       * - Pulp necrosis (most common cause)
       * - Post-trauma (intrapulpal hemorrhage)
       * - Amalgam tattoo/leaching
       * - Previously root canal treated tooth
       * 
       * YELLOW (K03.7):
       * - Age-related (secondary dentin)
       * - Pulp canal obliteration
       * - Tetracycline staining (historical)
       * - Fluorosis (K00.3)
       */
      {
        id: 'color',
        name: 'Color',
        inputType: 'radio',
        options: [
          { id: 'red', name: 'Red', type: 'radio', value: 'red', icd10Code: 'K03.7' },
          { id: 'gray', name: 'Gray', type: 'radio', value: 'gray', icd10Code: 'K03.7' },
          { id: 'yellow', name: 'Yellow', type: 'radio', value: 'yellow', icd10Code: 'K03.7' },
        ],
      },
    ]
  },
  {
    id: 'apical',
    name: 'Apical',
    route: '/pathology/apical',
    hasAspects: false,
    icd10CodeBase: 'K04',
    icd10Description: 'Diseases of pulp and periapical tissues',
    optionGroups: [
      /**
       * APICAL PATHOLOGY presence (radiographic finding):
       * 
       * When Present = Yes, indicates periapical lesion visible on radiograph
       * Further classification depends on clinical symptoms:
       * - K04.4: Acute apical periodontitis (symptomatic)
       * - K04.5: Chronic apical periodontitis (asymptomatic)
       * - K04.6: Periapical abscess with sinus tract
       * - K04.7: Periapical abscess without sinus tract
       * - K04.8: Radicular cyst
       * 
       * Note: Full endodontic diagnosis requires clinical tests.
       * See endodontic-logic.ts for complete diagnostic workflow.
       */
      {
        id: 'present',
        name: 'Present',
        inputType: 'radio',
        options: [
          { id: 'yes', name: 'Yes', type: 'radio', value: 'yes', icd10Code: 'K04.5' },
          { id: 'no', name: 'No', type: 'radio', value: 'no' },
        ],
      },
    ]
  },
  {
    id: 'development_disorder',
    name: 'Development Disorder',
    route: '/pathology/development-disorder',
    hasAspects: false,
    icd10CodeBase: 'K00',
    icd10Description: 'Disorders of tooth development and eruption',
    optionGroups: [
      /**
       * DEVELOPMENTAL DISORDERS include:
       * - K00.0: Anodontia (congenital absence)
       * - K00.1: Supernumerary teeth
       * - K00.2: Abnormalities of size and form
       *   - Microdontia, macrodontia, fusion, gemination
       *   - Dens invaginatus, dens evaginatus
       *   - Taurodontism
       * - K00.3: Mottled teeth (dental fluorosis)
       * - K00.4: Disturbances in tooth formation
       *   - Enamel hypoplasia, dentinogenesis imperfecta
       * - K00.5: Hereditary disturbances
       *   - Amelogenesis imperfecta
       * - K00.6: Disturbances in tooth eruption
       * - K00.8: Other specified disorders
       *   - Turner's tooth, dilaceration
       */
      {
        id: 'present',
        name: 'Present',
        inputType: 'radio',
        options: [
          { id: 'yes', name: 'Yes', type: 'radio', value: 'yes', icd10Code: 'K00.9' },
          { id: 'no', name: 'No', type: 'radio', value: 'no' },
        ],
      },
    ]
  },
];

// ============================================================================
// ICD-10 CODE GENERATION LOGIC
// ============================================================================

/**
 * Generates the appropriate ICD-10 code based on pathology selections
 * 
 * @example
 * // Decay on buccal surface, enamel depth, with cavitation, C2 classification
 * generatePathologyICD10('decay', {
 *   aspects: ['buccal'],
 *   depth_layer: 'enamel',
 *   cavitation_status: 'cavitation',
 *   classification: 'c2'
 * });
 * // Returns: { code: 'K02.52', description: 'Dental caries on smooth surface' }
 */
function generatePathologyICD10(
  pathologyId: string,
  selections: Record<string, string | string[]>
): { code: string; description: string } {
  const pathology = PATHOLOGY_TYPES.find(p => p.id === pathologyId);
  if (!pathology) {
    return { code: '', description: 'Unknown pathology' };
  }

  switch (pathologyId) {
    case 'decay':
      return generateDecayICD10(selections);
    case 'fracture':
      return generateFractureICD10(selections);
    case 'tooth_wear':
      return generateWearICD10(selections);
    case 'discoloration':
      return { code: 'K03.7', description: 'Posteruptive color changes of dental hard tissues' };
    case 'apical':
      return selections.present === 'yes' 
        ? { code: 'K04.5', description: 'Chronic apical periodontitis' }
        : { code: '', description: 'No apical pathology' };
    case 'development_disorder':
      return selections.present === 'yes'
        ? { code: 'K00.9', description: 'Disorder of tooth development, unspecified' }
        : { code: '', description: 'No developmental disorder' };
    default:
      return { code: pathology.icd10CodeBase, description: pathology.icd10Description };
  }
}

function generateDecayICD10(selections: Record<string, string | string[]>): { code: string; description: string } {
  const depth = selections.depth_layer as string;
  const cavitation = selections.cavitation_status as string;
  const classification = selections.classification as string;
  const aspects = selections.aspects as string[] || [];

  // Check for arrested caries
  if (cavitation === 'no_cavitation') {
    return { code: 'K02.3', description: 'Arrested dental caries' };
  }

  // Check for C4 (pulp exposure risk)
  if (classification === 'c4') {
    return { code: 'K02.5', description: 'Dental caries with pulp exposure' };
  }

  // Determine surface type
  const hasCervical = aspects.some(a => a.includes('cervical'));
  const hasOcclusal = aspects.some(a => a === 'incisal' || a === 'occlusal');
  
  if (hasCervical) {
    return { code: 'K02.53', description: 'Dental caries on root surface' };
  }
  
  if (hasOcclusal) {
    if (depth === 'enamel') {
      return { code: 'K02.61', description: 'Dental caries on pit and fissure surface limited to enamel' };
    }
    return { code: 'K02.62', description: 'Dental caries on pit and fissure surface penetrating into dentin' };
  }

  // Smooth surface caries
  if (depth === 'enamel') {
    return { code: 'K02.0', description: 'Dental caries limited to enamel' };
  }
  
  return { code: 'K02.1', description: 'Dental caries of dentin' };
}

function generateFractureICD10(selections: Record<string, string | string[]>): { code: string; description: string } {
  const fractureType = selections.fracture_type as string;
  const direction = selections.root_fracture_direction as string;

  if (fractureType === 'root_fracture') {
    if (direction === 'vertical') {
      return { code: 'S02.5xxA', description: 'Vertical root fracture - poor prognosis' };
    }
    return { code: 'S02.5xxA', description: 'Horizontal root fracture' };
  }

  return { code: 'K03.81', description: 'Cracked tooth' };
}

function generateWearICD10(selections: Record<string, string | string[]>): { code: string; description: string } {
  const wearType = selections.wear_type as string;

  if (wearType === 'abrasion') {
    return { code: 'K03.1', description: 'Abrasion of teeth' };
  }
  if (wearType === 'erosion') {
    return { code: 'K03.2', description: 'Erosion of teeth' };
  }

  return { code: 'K03.0', description: 'Excessive attrition of teeth' };
}

// ============================================================================
// VISIBILITY LOGIC FUNCTIONS
// ============================================================================

function shouldShowOptionGroup(
  group: OptionGroup,
  formState: Record<string, string | string[]>
): boolean {
  if (!group.showWhen) {
    return true;
  }

  const { field, operator, value } = group.showWhen;
  const fieldValue = formState[field];

  switch (operator) {
    case 'equals':
      return fieldValue === value;
    case 'notEmpty':
      if (Array.isArray(fieldValue)) {
        return fieldValue.length > 0;
      }
      return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
    case 'includes':
      if (Array.isArray(value) && typeof fieldValue === 'string') {
        return value.includes(fieldValue);
      }
      if (Array.isArray(fieldValue) && typeof value === 'string') {
        return fieldValue.includes(value);
      }
      return false;
    default:
      return true;
  }
}

function getVisibleOptionGroups(
  pathologyType: PathologyType,
  formState: Record<string, string | string[]>
): OptionGroup[] {
  return pathologyType.optionGroups.filter(group => 
    shouldShowOptionGroup(group, formState)
  );
}

// ============================================================================
// DIAGNOSTIC RELATIONSHIP TABLES
// ============================================================================

/**
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * PATHOLOGY DIAGNOSTIC SUMMARY TABLE
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * 
 * This table shows how UI selections map to diagnoses and ICD-10 codes:
 * 
 * ┌─────────────────┬─────────────────────┬─────────────────────┬─────────────┬──────────────────────────────────┐
 * │ Pathology Type  │ UI Input Field      │ UI Value            │ ICD-10 Code │ Diagnosis                        │
 * ├─────────────────┼─────────────────────┼─────────────────────┼─────────────┼──────────────────────────────────┤
 * │ DECAY           │ Surface             │ Cervical Buccal     │ K02.53      │ Caries on root surface           │
 * │                 │                     │ Cervical Palatal    │ K02.53      │ Caries on root surface           │
 * │                 │                     │ Buccal/Palatal      │ K02.52      │ Caries on smooth surface         │
 * │                 │                     │ Mesial/Distal       │ K02.52      │ Caries on smooth surface         │
 * │                 │                     │ Incisal             │ K02.51      │ Caries on pit/fissure surface    │
 * │                 ├─────────────────────┼─────────────────────┼─────────────┼──────────────────────────────────┤
 * │                 │ Depth               │ Enamel              │ K02.0       │ Caries limited to enamel         │
 * │                 │                     │ Dentin              │ K02.1       │ Caries of dentine                │
 * │                 ├─────────────────────┼─────────────────────┼─────────────┼──────────────────────────────────┤
 * │                 │ Cavitation          │ No Cavitation       │ K02.3       │ Arrested dental caries           │
 * │                 │                     │ Cavitation          │ (see depth) │ Active caries                    │
 * │                 ├─────────────────────┼─────────────────────┼─────────────┼──────────────────────────────────┤
 * │                 │ Classification      │ C1                  │ K02.0       │ Initial lesion (white spot)      │
 * │                 │                     │ C2                  │ K02.0       │ Established lesion               │
 * │                 │                     │ C3                  │ K02.1       │ Enamel breakdown, dentin exposed │
 * │                 │                     │ C4                  │ K02.5       │ Pulp exposure risk               │
 * ├─────────────────┼─────────────────────┼─────────────────────┼─────────────┼──────────────────────────────────┤
 * │ FRACTURE        │ Fracture Type       │ Crown Fracture      │ S02.5xxA    │ Crown fracture (trauma)          │
 * │                 │                     │                     │ K03.81      │ Cracked tooth (non-trauma)       │
 * │                 │                     │ Root Fracture       │ S02.5xxA    │ Root fracture                    │
 * │                 ├─────────────────────┼─────────────────────┼─────────────┼──────────────────────────────────┤
 * │                 │ Direction           │ Vertical            │ S02.5       │ Poor prognosis → extraction      │
 * │                 │ (Root only)         │ Horizontal          │ S02.5       │ Prognosis depends on location    │
 * ├─────────────────┼─────────────────────┼─────────────────────┼─────────────┼──────────────────────────────────┤
 * │ TOOTH WEAR      │ Type                │ Abrasion            │ K03.1       │ Mechanical wear                  │
 * │                 │                     │ Erosion             │ K03.2       │ Chemical dissolution             │
 * │                 ├─────────────────────┼─────────────────────┼─────────────┼──────────────────────────────────┤
 * │                 │ Location            │ Buccal + Abrasion   │ K03.1       │ Aggressive brushing              │
 * │                 │                     │ Lingual + Erosion   │ K03.2       │ GERD/Bulimia                     │
 * │                 │                     │ Buccal + Erosion    │ K03.2       │ Dietary acids                    │
 * ├─────────────────┼─────────────────────┼─────────────────────┼─────────────┼──────────────────────────────────┤
 * │ DISCOLORATION   │ Color               │ Red                 │ K03.7       │ Internal resorption/hyperemia    │
 * │                 │                     │ Gray                │ K03.7       │ Pulp necrosis/trauma             │
 * │                 │                     │ Yellow              │ K03.7       │ Age-related/tetracycline         │
 * ├─────────────────┼─────────────────────┼─────────────────────┼─────────────┼──────────────────────────────────┤
 * │ APICAL          │ Present             │ Yes                 │ K04.5       │ Chronic apical periodontitis     │
 * │                 │                     │ No                  │ -           │ No apical pathology              │
 * ├─────────────────┼─────────────────────┼─────────────────────┼─────────────┼──────────────────────────────────┤
 * │ DEVELOPMENT     │ Present             │ Yes                 │ K00.9       │ Developmental disorder           │
 * │ DISORDER        │                     │ No                  │ -           │ No developmental disorder        │
 * └─────────────────┴─────────────────────┴─────────────────────┴─────────────┴──────────────────────────────────┘
 * 
 * 
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * DECAY DIAGNOSTIC FLOWCHART
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * 
 *                              ┌─────────────────────┐
 *                              │   SELECT SURFACE    │
 *                              │  (Aspects/Location) │
 *                              └──────────┬──────────┘
 *                                         │
 *          ┌──────────────────────────────┼──────────────────────────────┐
 *          ▼                              ▼                              ▼
 *   ┌──────────────┐              ┌──────────────┐              ┌──────────────┐
 *   │   CERVICAL   │              │   OCCLUSAL/  │              │   SMOOTH     │
 *   │   Surface    │              │   INCISAL    │              │   Surface    │
 *   └──────┬───────┘              └──────┬───────┘              └──────┬───────┘
 *          │                             │                             │
 *          ▼                             ▼                             ▼
 *   ┌──────────────┐              ┌──────────────┐              ┌──────────────┐
 *   │ Root Caries  │              │ Pit/Fissure  │              │ Proximal or  │
 *   │   K02.53     │              │   K02.51     │              │ Buccal/Ling  │
 *   └──────────────┘              └──────┬───────┘              └──────┬───────┘
 *                                        │                             │
 *                                        └──────────────┬──────────────┘
 *                                                       │
 *                                                       ▼
 *                                        ┌──────────────────────────┐
 *                                        │      SELECT DEPTH        │
 *                                        └──────────────┬───────────┘
 *                                                       │
 *                              ┌────────────────────────┼────────────────────────┐
 *                              ▼                                                 ▼
 *                       ┌──────────────┐                                 ┌──────────────┐
 *                       │    ENAMEL    │                                 │    DENTIN    │
 *                       │    K02.0     │                                 │    K02.1     │
 *                       └──────┬───────┘                                 └──────┬───────┘
 *                              │                                                │
 *                              └────────────────────────┬───────────────────────┘
 *                                                       │
 *                                                       ▼
 *                                        ┌──────────────────────────┐
 *                                        │   SELECT CAVITATION      │
 *                                        └──────────────┬───────────┘
 *                                                       │
 *                              ┌────────────────────────┴────────────────────────┐
 *                              ▼                                                 ▼
 *                       ┌──────────────┐                                 ┌──────────────┐
 *                       │ NO CAVITATION│                                 │  CAVITATION  │
 *                       │    K02.3     │                                 │  (Continue)  │
 *                       │  (Arrested)  │                                 └──────┬───────┘
 *                       └──────────────┘                                        │
 *                                                                               ▼
 *                                                              ┌──────────────────────────┐
 *                                                              │  SELECT CLASSIFICATION   │
 *                                                              └──────────────┬───────────┘
 *                                                                             │
 *                              ┌──────────────────┬───────────────────────────┼───────────────────┬──────────────────┐
 *                              ▼                  ▼                           ▼                   ▼                  
 *                       ┌──────────┐       ┌──────────┐                ┌──────────┐        ┌──────────┐
 *                       │    C1    │       │    C2    │                │    C3    │        │    C4    │
 *                       │  K02.0   │       │  K02.0   │                │  K02.1   │        │  K02.5   │
 *                       │ Initial  │       │ Establ.  │                │ Dentin   │        │  Pulp    │
 *                       └──────────┘       └──────────┘                └──────────┘        └──────────┘
 * 
 * 
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * FRACTURE DIAGNOSTIC FLOWCHART
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * 
 *                              ┌─────────────────────┐
 *                              │  SELECT FRACTURE    │
 *                              │       TYPE          │
 *                              └──────────┬──────────┘
 *                                         │
 *                    ┌────────────────────┴────────────────────┐
 *                    ▼                                         ▼
 *             ┌──────────────┐                          ┌──────────────┐
 *             │    CROWN     │                          │    ROOT      │
 *             │   FRACTURE   │                          │   FRACTURE   │
 *             └──────┬───────┘                          └──────┬───────┘
 *                    │                                         │
 *                    ▼                                         ▼
 *      ┌─────────────────────────┐              ┌──────────────────────────┐
 *      │ Traumatic?              │              │     SELECT DIRECTION     │
 *      │ Yes → S02.5xxA          │              └──────────────┬───────────┘
 *      │ No  → K03.81            │                             │
 *      └─────────────────────────┘              ┌──────────────┴──────────────┐
 *                                               ▼                             ▼
 *                                        ┌──────────────┐              ┌──────────────┐
 *                                        │   VERTICAL   │              │  HORIZONTAL  │
 *                                        │   S02.5xxA   │              │   S02.5xxA   │
 *                                        │              │              │              │
 *                                        │ PROGNOSIS:   │              │ PROGNOSIS:   │
 *                                        │    POOR      │              │  Apical: Good│
 *                                        │  (Extract)   │              │  Middle: Mod │
 *                                        └──────────────┘              │  Cervical:Bad│
 *                                                                      └──────────────┘
 * 
 * 
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * TOOTH WEAR DIAGNOSTIC FLOWCHART
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * 
 *                              ┌─────────────────────┐
 *                              │   SELECT WEAR TYPE  │
 *                              └──────────┬──────────┘
 *                                         │
 *                    ┌────────────────────┴────────────────────┐
 *                    ▼                                         ▼
 *             ┌──────────────┐                          ┌──────────────┐
 *             │   ABRASION   │                          │   EROSION    │
 *             │    K03.1     │                          │    K03.2     │
 *             │  Mechanical  │                          │   Chemical   │
 *             └──────┬───────┘                          └──────┬───────┘
 *                    │                                         │
 *                    ▼                                         ▼
 *             ┌──────────────┐                          ┌──────────────┐
 *             │   LOCATION   │                          │   LOCATION   │
 *             └──────┬───────┘                          └──────┬───────┘
 *                    │                                         │
 *          ┌─────────┴─────────┐                     ┌─────────┴─────────┐
 *          ▼                   ▼                     ▼                   ▼
 *   ┌──────────────┐    ┌──────────────┐     ┌──────────────┐    ┌──────────────┐
 *   │    BUCCAL    │    │   LINGUAL    │     │    BUCCAL    │    │   LINGUAL    │
 *   │  Aggressive  │    │  Uncommon    │     │   Dietary    │    │    GERD/     │
 *   │  Brushing    │    │  Abrasion    │     │    Acids     │    │   Bulimia    │
 *   └──────────────┘    └──────────────┘     └──────────────┘    └──────────────┘
 * 
 * 
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * COMPLETE PATHOLOGY SELECTION FLOWCHART
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * 
 *                                    ┌─────────────────────────┐
 *                                    │   PATHOLOGY SECTION     │
 *                                    │    (Add Pathology)      │
 *                                    └───────────┬─────────────┘
 *                                                │
 *        ┌────────────┬────────────┬─────────────┼─────────────┬────────────┬────────────┐
 *        ▼            ▼            ▼             ▼             ▼            ▼            
 *   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
 *   │  DECAY  │  │FRACTURE │  │  TOOTH  │  │DISCOLOR │  │ APICAL  │  │  DEV    │
 *   │  K02.x  │  │ S02.5/  │  │  WEAR   │  │ ATION   │  │         │  │DISORDER │
 *   │         │  │ K03.81  │  │  K03.x  │  │  K03.7  │  │  K04.x  │  │  K00.x  │
 *   └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
 *        │            │            │            │            │            │
 *        ▼            ▼            ▼            ▼            ▼            ▼
 *   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
 *   │Surfaces │  │  Type   │  │  Type   │  │  Color  │  │Present? │  │Present? │
 *   │ Depth   │  │Direction│  │Location │  │         │  │ Yes/No  │  │ Yes/No  │
 *   │Cavitate │  │         │  │         │  │         │  │         │  │         │
 *   │ Class   │  │         │  │         │  │         │  │         │  │         │
 *   └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
 *        │            │            │            │            │            │
 *        └────────────┴────────────┴─────┬──────┴────────────┴────────────┘
 *                                        │
 *                                        ▼
 *                              ┌───────────────────┐
 *                              │  FINAL ICD-10     │
 *                              │  CODE GENERATED   │
 *                              └───────────────────┘
 * 
 * 
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * TREATMENT RECOMMENDATIONS BY PATHOLOGY
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * 
 * ┌─────────────┬─────────────┬────────────────────────────────────────────────────────┐
 * │ ICD-10      │ Pathology   │ Recommended Treatment                                  │
 * ├─────────────┼─────────────┼────────────────────────────────────────────────────────┤
 * │ K02.0       │ Enamel only │ Fluoride varnish, sealant, remineralization            │
 * │ K02.1       │ Dentin      │ Filling (Composite/Amalgam)                            │
 * │ K02.3       │ Arrested    │ Monitor, preventive care                               │
 * │ K02.5       │ Pulp risk   │ Pulp cap or RCT + Crown                                │
 * │ K02.51      │ Pit/fissure │ Filling, sealant if early                              │
 * │ K02.52      │ Smooth surf │ Class III/IV/V Filling                                 │
 * │ K02.53      │ Root caries │ Class V Filling, GIC                                   │
 * ├─────────────┼─────────────┼────────────────────────────────────────────────────────┤
 * │ S02.5xxA    │ Trauma frac │ Crown/Filling depending on extent                      │
 * │ K03.81      │ Cracked     │ Crown, extraction if vertical root                     │
 * ├─────────────┼─────────────┼────────────────────────────────────────────────────────┤
 * │ K03.1       │ Abrasion    │ Filling, address cause (brushing technique)            │
 * │ K03.2       │ Erosion     │ Filling, address cause (diet, GERD)                    │
 * ├─────────────┼─────────────┼────────────────────────────────────────────────────────┤
 * │ K03.7       │ Discolor    │ Bleaching, veneer, crown (depending on cause)          │
 * ├─────────────┼─────────────┼────────────────────────────────────────────────────────┤
 * │ K04.4       │ Acute apic  │ RCT (urgent), incision if abscess                      │
 * │ K04.5       │ Chronic ap  │ RCT or extraction                                      │
 * │ K04.6       │ Abscess +   │ RCT, antibiotics if needed                             │
 * │ K04.7       │ Abscess -   │ RCT, incision and drainage, antibiotics                │
 * ├─────────────┼─────────────┼────────────────────────────────────────────────────────┤
 * │ K00.x       │ Development │ Depends on specific disorder, cosmetic/functional      │
 * └─────────────┴─────────────┴────────────────────────────────────────────────────────┘
*/

// ============================================================================
// EXPORTS
// ============================================================================

export {
  PATHOLOGY_TYPES,
  shouldShowOptionGroup,
  getVisibleOptionGroups,
  generatePathologyICD10,
  generateDecayICD10,
  generateFractureICD10,
  generateWearICD10,
  type PathologyType,
  type PathologyDiagnosis,
  type OptionGroup,
  type Option,
  type Condition,
};
