/**
 * Restoration Options Logic - ThakaaMed App
 * 
 * This file documents the conditional display logic for restoration options.
 * Restorations are treatment codes, but they relate to underlying diagnoses.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * ICD-10 DIAGNOSIS CODES THAT LEAD TO RESTORATIONS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Restorations are TREATMENTS, not diagnoses. However, the following ICD-10
 * diagnosis codes typically lead to the restorations documented here:
 * 
 * 
 * RESTORATION QUALITY ASSESSMENT:
 * ───────────────────────────────
 * Quality assessment relates to identifying need for replacement:
 * - Sufficient: Restoration meets clinical standards, monitor
 * - Uncertain: Marginal integrity questionable, close monitoring
 * - Insufficient: Restoration failing, requires replacement
 *   Related diagnosis: K08.53 (Fractured dental restorative material)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Option {
  id: string;
  name: string;
  value: string;
  relatedICD10?: string[];  // ICD-10 codes this option relates to
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

interface RestorationType {
  id: string;
  name: string;
  route: string;
  hasAspects: boolean;
  relatedDiagnoses: RelatedDiagnosis[];  // ICD-10 codes that typically lead to this restoration
  aspects?: OptionGroup;
  optionGroups: OptionGroup[];
}

interface RelatedDiagnosis {
  icd10Code: string;
  diagnosisName: string;
  indication: string;
}

// ============================================================================
// STATIC DATA CONFIGURATION WITH ICD-10 RELATIONSHIPS
// ============================================================================

const RESTORATION_TYPES: RestorationType[] = [
  {
    id: 'filling',
    name: 'Filling',
    route: '/restoration/filling',
    hasAspects: true,
    /**
     * ICD-10 diagnoses that typically require FILLING treatment:
     */
    relatedDiagnoses: [
      { icd10Code: 'K02.0', diagnosisName: 'Caries limited to enamel', indication: 'Small enamel lesion' },
      { icd10Code: 'K02.1', diagnosisName: 'Caries of dentine', indication: 'Moderate cavity' },
      { icd10Code: 'K02.2', diagnosisName: 'Caries of cementum', indication: 'Root surface cavity' },
      { icd10Code: 'K02.52', diagnosisName: 'Caries on smooth surface', indication: 'Class III/IV cavity' },
      { icd10Code: 'K02.53', diagnosisName: 'Caries on root surface', indication: 'Class V cavity' },
      { icd10Code: 'K03.1', diagnosisName: 'Abrasion', indication: 'Cervical lesion' },
      { icd10Code: 'K03.2', diagnosisName: 'Erosion', indication: 'Acid damage' },
      { icd10Code: 'K08.53', diagnosisName: 'Fractured dental material', indication: 'Replacement needed' },
    ],
    aspects: {
      id: 'filling_aspects',
      name: 'Surfaces',
      inputType: 'checkbox',
      /**
       * Surface selection determines Black's Classification:
       * - Class I: Occlusal (posterior), Incisal pit (anterior)
       * - Class II: Mesial or Distal on posterior teeth
       * - Class III: Mesial or Distal on anterior teeth (no incisal)
       * - Class IV: Mesial or Distal on anterior teeth (with incisal)
       * - Class V: Cervical 1/3 on any tooth (buccal or lingual)
       * - Class VI: Cusp tip or incisal edge
       */
      options: [
        { id: 'cervical_buccal', name: 'Cervical Buccal', value: 'cervical_buccal', relatedICD10: ['K02.53', 'K03.1'] },
        { id: 'cervical_palatal', name: 'Cervical Palatal', value: 'cervical_palatal', relatedICD10: ['K02.53', 'K03.1'] },
        { id: 'buccal', name: 'Buccal', value: 'buccal', relatedICD10: ['K02.52'] },
        { id: 'mesial', name: 'Mesial', value: 'mesial', relatedICD10: ['K02.52'] },
        { id: 'incisal', name: 'Incisal', value: 'incisal', relatedICD10: ['K02.51'] },
        { id: 'distal', name: 'Distal', value: 'distal', relatedICD10: ['K02.52'] },
        { id: 'palatal', name: 'Palatal', value: 'palatal', relatedICD10: ['K02.52'] },
        { id: 'class4_mesial', name: 'Class 4 Mesial', value: 'class4_mesial', relatedICD10: ['K02.52', 'S02.5'] },
        { id: 'class4_distal', name: 'Class 4 Distal', value: 'class4_distal', relatedICD10: ['K02.52', 'S02.5'] },
        { id: 'buccal_surface', name: 'Buccal Surface', value: 'buccal_surface', relatedICD10: ['K02.52'] },
        { id: 'palatal_surface', name: 'Palatal Surface', value: 'palatal_surface', relatedICD10: ['K02.52'] },
      ]
    },
    optionGroups: [
      /**
       * MATERIAL selection:
       * Each material has specific indications based on diagnosis and location
       */
      {
        id: 'material',
        name: 'Material',
        inputType: 'radio',
        options: [
          { id: 'composite', name: 'Composite', value: 'composite', relatedICD10: ['K02.0', 'K02.1', 'K02.52'] },
          { id: 'ceramic', name: 'Ceramic', value: 'ceramic', relatedICD10: ['K02.1'] },
          { id: 'amalgam', name: 'Amalgam', value: 'amalgam', relatedICD10: ['K02.1', 'K02.51'] },
          { id: 'gold', name: 'Gold', value: 'gold', relatedICD10: ['K02.1'] },
          { id: 'non_precious_metal', name: 'Non-Precious Metal', value: 'non_precious_metal' },
          { id: 'temporary', name: 'Temporary', value: 'temporary' },
        ],
        showWhen: { field: 'aspects', operator: 'notEmpty' }
      },
      /**
       * QUALITY assessment indicates restoration status:
       * - Sufficient: Meeting clinical standards (no ICD-10)
       * - Uncertain: Needs monitoring (potential K08.53)
       * - Insufficient: Failing, needs replacement → K08.53
       */
      {
        id: 'quality',
        name: 'Quality',
        inputType: 'radio',
        options: [
          { id: 'sufficient', name: 'Sufficient', value: 'sufficient' },
          { id: 'uncertain', name: 'Uncertain', value: 'uncertain' },
          { id: 'insufficient', name: 'Insufficient', value: 'insufficient', relatedICD10: ['K08.53'] },
        ],
        showWhen: { field: 'material', operator: 'notEmpty' }
      },
      /**
       * DETAIL describes marginal adaptation:
       * - Overhang: Excess material → plaque trap, periodontal issue
       * - Flush: Ideal adaptation
       * - Shortfall: Deficient margin → potential recurrent caries (K02.x)
       */
      {
        id: 'detail',
        name: 'Detail',
        inputType: 'radio',
        options: [
          { id: 'overhang', name: 'Overhang', value: 'overhang' },
          { id: 'flush', name: 'Flush', value: 'flush' },
          { id: 'shortfall', name: 'Shortfall', value: 'shortfall' },
        ],
        showWhen: { field: 'quality', operator: 'notEmpty' }
      },
    ]
  },
  {
    id: 'veneer',
    name: 'Veneer',
    route: '/restoration/veneer',
    hasAspects: true,
    /**
     * ICD-10 diagnoses that typically require VENEER treatment:
     */
    relatedDiagnoses: [
      { icd10Code: 'K00.3', diagnosisName: 'Mottled teeth (fluorosis)', indication: 'Esthetic correction' },
      { icd10Code: 'K00.4', diagnosisName: 'Enamel hypoplasia', indication: 'Esthetic/protective' },
      { icd10Code: 'K03.7', diagnosisName: 'Posteruptive color changes', indication: 'Discoloration' },
      { icd10Code: 'K03.81', diagnosisName: 'Cracked tooth (minor)', indication: 'Protective' },
      { icd10Code: 'S02.5', diagnosisName: 'Enamel fracture', indication: 'Esthetic repair' },
    ],
    aspects: {
      id: 'veneer_aspects',
      name: 'Surfaces',
      inputType: 'checkbox',
      options: [
        { id: 'buccal', name: 'Buccal', value: 'buccal', relatedICD10: ['K03.7', 'K00.3'] },
        { id: 'lingual', name: 'Lingual', value: 'lingual', relatedICD10: ['K03.7'] },
      ]
    },
    optionGroups: [
      {
        id: 'material',
        name: 'Material',
        inputType: 'radio',
        options: [
          { id: 'composite', name: 'Composite', value: 'composite' },
          { id: 'ceramic', name: 'Ceramic', value: 'ceramic' },
        ],
        showWhen: { field: 'aspects', operator: 'notEmpty' }
      },
      {
        id: 'quality',
        name: 'Quality',
        inputType: 'radio',
        options: [
          { id: 'sufficient', name: 'Sufficient', value: 'sufficient' },
          { id: 'uncertain', name: 'Uncertain', value: 'uncertain' },
          { id: 'insufficient', name: 'Insufficient', value: 'insufficient', relatedICD10: ['K08.53'] },
        ],
        showWhen: { field: 'material', operator: 'notEmpty' }
      },
    ]
  },
  {
    id: 'crown',
    name: 'Crown',
    route: '/restoration/crown',
    hasAspects: true,
    /**
     * ICD-10 diagnoses that typically require CROWN treatment:
     */
    relatedDiagnoses: [
      { icd10Code: 'K02.5', diagnosisName: 'Caries with pulp exposure', indication: 'Post-RCT crown' },
      { icd10Code: 'K03.0', diagnosisName: 'Excessive attrition', indication: 'Occlusal protection' },
      { icd10Code: 'K03.81', diagnosisName: 'Cracked tooth', indication: 'Cusp protection' },
      { icd10Code: 'K04.1', diagnosisName: 'Necrosis of pulp', indication: 'Post-RCT crown' },
      { icd10Code: 'K08.1', diagnosisName: 'Loss of teeth (extraction)', indication: 'Bridge pontic' },
      { icd10Code: 'K08.4', diagnosisName: 'Partial loss of teeth', indication: 'Bridge abutment' },
      { icd10Code: 'S02.5', diagnosisName: 'Fracture of tooth', indication: 'Full coverage' },
      { icd10Code: 'Z96.5', diagnosisName: 'Dental implant present', indication: 'Implant crown' },
    ],
    aspects: {
      id: 'crown_aspects',
      name: 'Selection',
      inputType: 'checkbox',
      options: [
        { id: '1', name: '1', value: '1' },
        { id: '2', name: '2', value: '2' },
        { id: '3', name: '3', value: '3' },
        { id: '4', name: '4', value: '4' },
        { id: '5', name: '5', value: '5' },
        { id: '6', name: '6', value: '6' },
        { id: '7', name: '7', value: '7' },
        { id: '8', name: '8', value: '8' },
        { id: '9', name: '9', value: '9' },
        { id: '10', name: '10', value: '10' },
        { id: '11', name: '11', value: '11' },
      ]
    },
    optionGroups: [
      {
        id: 'material',
        name: 'Material',
        inputType: 'radio',
        options: [
          { id: 'composite', name: 'Composite', value: 'composite' },
          { id: 'ceramic', name: 'Ceramic', value: 'ceramic' },
          { id: 'gold', name: 'Gold', value: 'gold' },
          { id: 'non_precious_metal', name: 'Non-Precious Metal', value: 'non_precious_metal' },
        ],
      },
      /**
       * CROWN TYPE:
       * - Single Crown: Standalone crown on single tooth
       * - Abutment: Crown supporting a bridge → Related to K08.1/K08.4
       * - Pontic: False tooth in bridge span → Related to K08.1/K08.4
       */
      {
        id: 'crown_type',
        name: 'Crown Type',
        inputType: 'radio',
        options: [
          { id: 'single_crown', name: 'Single Crown', value: 'single_crown' },
          { id: 'abutment', name: 'Abutment', value: 'abutment', relatedICD10: ['K08.1', 'K08.4'] },
          { id: 'pontic', name: 'Pontic', value: 'pontic', relatedICD10: ['K08.1', 'K08.4'] },
        ],
        showWhen: { field: 'aspects', operator: 'notEmpty' }
      },
      /**
       * CROWN BASE:
       * - Natural: Crown on natural tooth structure
       * - Implant: Crown on dental implant → Z96.5
       */
      {
        id: 'crown_base',
        name: 'Crown Base',
        inputType: 'radio',
        options: [
          { id: 'natural', name: 'Natural', value: 'natural' },
          { id: 'implant', name: 'Implant', value: 'implant', relatedICD10: ['Z96.5'] },
        ],
        showWhen: { field: 'crown_type', operator: 'notEmpty' }
      },
      /**
       * IMPLANT TYPE (only when Crown Base = Implant):
       * - Bone level: Implant platform at bone level
       * - Tissue level: Implant platform at tissue level
       * Both relate to Z96.5 (Presence of dental implant)
       */
      {
        id: 'implant_type',
        name: 'Implant Type',
        inputType: 'radio',
        options: [
          { id: 'bone_level', name: 'Bone level', value: 'bone_level', relatedICD10: ['Z96.5'] },
          { id: 'tissue_level', name: 'Tissue level', value: 'tissue_level', relatedICD10: ['Z96.5'] },
        ],
        showWhen: { field: 'crown_base', operator: 'equals', value: 'implant' }
      },
    ]
  },
];

// ============================================================================
// ICD-10 CODE REFERENCE TABLES
// ============================================================================

/**
 * Complete ICD-10 reference for restoration-related diagnoses
 */
const RESTORATION_ICD10_REFERENCE = {
  // Caries codes that lead to restorations
  caries: {
    'K02.0': 'Caries limited to enamel',
    'K02.1': 'Caries of dentine', 
    'K02.2': 'Caries of cementum',
    'K02.3': 'Arrested dental caries',
    'K02.5': 'Caries with pulp exposure',
    'K02.51': 'Dental caries on pit and fissure surface',
    'K02.52': 'Dental caries on smooth surface',
    'K02.53': 'Dental caries on root surface',
    'K02.61': 'Dental caries on pit and fissure surface limited to enamel',
    'K02.62': 'Dental caries on pit and fissure surface penetrating into dentin',
    'K02.63': 'Dental caries on pit and fissure surface penetrating into pulp',
  },
  
  // Tooth wear codes
  wear: {
    'K03.0': 'Excessive attrition of teeth',
    'K03.1': 'Abrasion of teeth',
    'K03.2': 'Erosion of teeth',
    'K03.81': 'Cracked tooth',
  },
  
  // Pulp and periapical codes (post-RCT crowns)
  pulp: {
    'K04.01': 'Reversible pulpitis',
    'K04.02': 'Irreversible pulpitis',
    'K04.1': 'Necrosis of pulp',
    'K04.4': 'Acute apical periodontitis',
    'K04.5': 'Chronic apical periodontitis',
  },
  
  // Tooth loss codes (bridges/implants)
  toothLoss: {
    'K08.1': 'Complete loss of teeth due to trauma, extraction, or disease',
    'K08.101': 'Complete loss of teeth, unspecified cause, class I',
    'K08.109': 'Complete loss of teeth, unspecified cause, unspecified class',
    'K08.4': 'Partial loss of teeth',
    'K08.401': 'Partial loss of teeth, unspecified cause, class I',
    'K08.409': 'Partial loss of teeth, unspecified cause, unspecified class',
  },
  
  // Failed restoration codes
  failedRestoration: {
    'K08.53': 'Fractured dental restorative material',
    'K08.530': 'Fractured dental restorative material without loss of material',
    'K08.531': 'Fractured dental restorative material with loss of material',
    'K08.539': 'Fractured dental restorative material, unspecified',
  },
  
  // Implant codes
  implant: {
    'Z96.5': 'Presence of tooth-root and mandibular implant',
    'T84.498A': 'Other mechanical complication of dental implant, initial encounter',
    'M27.61': 'Osseointegration failure of dental implant',
    'M27.62': 'Post-osseointegration biological failure of dental implant',
  },
  
  // Developmental/esthetic codes (veneers)
  developmental: {
    'K00.3': 'Mottled teeth',
    'K00.4': 'Disturbances in tooth formation',
    'K03.7': 'Posteruptive color changes of dental hard tissues',
  },
  
  // Trauma codes
  trauma: {
    'S02.5': 'Fracture of tooth',
    'S02.5xxA': 'Fracture of tooth, initial encounter',
    'S02.5xxD': 'Fracture of tooth, subsequent encounter',
    'S02.5xxS': 'Fracture of tooth, sequela',
  }
};

// ============================================================================
// LOGIC FUNCTIONS
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
  restorationType: RestorationType,
  formState: Record<string, string | string[]>
): OptionGroup[] {
  return restorationType.optionGroups.filter(group => 
    shouldShowOptionGroup(group, formState)
  );
}

/**
 * Get related ICD-10 codes for a restoration configuration
 */
function getRelatedDiagnoses(
  restorationId: string,
  selections: Record<string, string | string[]>
): RelatedDiagnosis[] {
  const restoration = RESTORATION_TYPES.find(r => r.id === restorationId);
  if (!restoration) return [];
  
  return restoration.relatedDiagnoses;
}

// ============================================================================
// COMPARISON TABLES (with ICD-10 context)
// ============================================================================

/**
 * Material options by restoration type:
 * 
 * | Material           | Filling | Veneer | Crown | Common Indications (ICD-10)      |
 * |--------------------|---------|--------|-------|----------------------------------|
 * | Composite          |    ✓    |   ✓    |   ✓   | K02.x (caries), K03.7 (color)    |
 * | Ceramic            |    ✓    |   ✓    |   ✓   | K02.x, K03.81 (aesthetic)        |
 * | Amalgam            |    ✓    |   ✗    |   ✗   | K02.1 (posterior caries)         |
 * | Gold               |    ✓    |   ✗    |   ✓   | K02.1, K03.81 (durability)       |
 * | Non-Precious Metal |    ✓    |   ✗    |   ✓   | K08.1 (bridge framework)         |
 * | Temporary          |    ✓    |   ✗    |   ✗   | Interim during treatment         |
 * 
 * Crown Type relationships to ICD-10:
 * - Single Crown: K02.5, K04.x, K03.81, S02.5
 * - Abutment: K08.1, K08.4 (tooth loss requiring bridge)
 * - Pontic: K08.1, K08.4 (replacing missing tooth)
 * 
 * Crown Base relationships to ICD-10:
 * - Natural: Any tooth-related diagnosis
 * - Implant: Z96.5 (presence of dental implant)
 */

// ============================================================================
// DIAGNOSTIC RELATIONSHIP TABLES & FLOWCHARTS
// ============================================================================

/**
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * DIAGNOSIS TO RESTORATION MAPPING TABLE
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * 
 * This table shows how ICD-10 diagnoses lead to restoration selections:
 * 
 * ┌─────────────┬──────────────────────────────┬─────────────────┬─────────────────────────────────┐
 * │ ICD-10 Code │ Diagnosis                    │ Restoration     │ Typical Material/Details        │
 * ├─────────────┼──────────────────────────────┼─────────────────┼─────────────────────────────────┤
 * │             │                              │                 │                                 │
 * │ CARIES (FILLING INDICATIONS)               │                 │                                 │
 * │             │                              │                 │                                 │
 * │ K02.0       │ Caries limited to enamel     │ Filling/Sealant │ Composite, preventive resin     │
 * │ K02.1       │ Caries of dentine            │ Filling         │ Composite, Amalgam, GIC         │
 * │ K02.2       │ Caries of cementum           │ Filling (Cl V)  │ GIC, Composite                  │
 * │ K02.5       │ Caries with pulp exposure    │ RCT + Crown     │ See crown section               │
 * │ K02.51      │ Pit/fissure caries           │ Filling (Cl I)  │ Composite, Amalgam              │
 * │ K02.52      │ Smooth surface caries        │ Filling (Cl III/IV) │ Composite                   │
 * │ K02.53      │ Root surface caries          │ Filling (Cl V)  │ GIC, Composite                  │
 * │ K02.61      │ Pit/fissure enamel only      │ Sealant/Filling │ Preventive resin                │
 * │ K02.62      │ Pit/fissure into dentin      │ Filling         │ Composite, Amalgam              │
 * ├─────────────┼──────────────────────────────┼─────────────────┼─────────────────────────────────┤
 * │             │                              │                 │                                 │
 * │ WEAR (FILLING INDICATIONS)                 │                 │                                 │
 * │             │                              │                 │                                 │
 * │ K03.0       │ Excessive attrition          │ Crown           │ Occlusal rehabilitation         │
 * │ K03.1       │ Abrasion                     │ Filling (Cl V)  │ GIC, Composite                  │
 * │ K03.2       │ Erosion                      │ Filling (Cl V)  │ GIC, Composite                  │
 * │ K03.81      │ Cracked tooth                │ Crown/Onlay     │ Ceramic, Gold                   │
 * ├─────────────┼──────────────────────────────┼─────────────────┼─────────────────────────────────┤
 * │             │                              │                 │                                 │
 * │ PULP/PERIAPICAL (POST-RCT CROWN)           │                 │                                 │
 * │             │                              │                 │                                 │
 * │ K04.01      │ Reversible pulpitis          │ Filling         │ After pulp cap                  │
 * │ K04.02      │ Irreversible pulpitis        │ RCT + Crown     │ Full coverage crown             │
 * │ K04.1       │ Necrosis of pulp             │ RCT + Crown     │ Full coverage crown             │
 * │ K04.4       │ Acute apical periodontitis   │ RCT + Crown     │ Full coverage crown             │
 * │ K04.5       │ Chronic apical periodontitis │ RCT + Crown     │ Full coverage crown             │
 * ├─────────────┼──────────────────────────────┼─────────────────┼─────────────────────────────────┤
 * │             │                              │                 │                                 │
 * │ TOOTH LOSS (BRIDGE/IMPLANT)                │                 │                                 │
 * │             │                              │                 │                                 │
 * │ K08.1       │ Complete loss of teeth       │ Bridge/Implant  │ Pontic, Abutment crown          │
 * │ K08.101     │ Complete loss, class I       │ Bridge/Implant  │ FPD or implant crown            │
 * │ K08.4       │ Partial loss of teeth        │ Bridge/Implant  │ Pontic, Abutment crown          │
 * │ K08.401     │ Partial loss, class I        │ Bridge/Implant  │ FPD or implant crown            │
 * ├─────────────┼──────────────────────────────┼─────────────────┼─────────────────────────────────┤
 * │             │                              │                 │                                 │
 * │ FAILED RESTORATION                         │                 │                                 │
 * │             │                              │                 │                                 │
 * │ K08.53      │ Fractured dental material    │ Replacement     │ Same or upgraded material       │
 * │ K08.530     │ Fractured without loss       │ Repair/Replace  │ Repair if possible              │
 * │ K08.531     │ Fractured with loss          │ Replacement     │ Full replacement needed         │
 * ├─────────────┼──────────────────────────────┼─────────────────┼─────────────────────────────────┤
 * │             │                              │                 │                                 │
 * │ IMPLANT-RELATED                            │                 │                                 │
 * │             │                              │                 │                                 │
 * │ Z96.5       │ Dental implant present       │ Implant Crown   │ Ceramic, PFM, Zirconia          │
 * │ M27.61      │ Osseointegration failure     │ Remove + Replace│ New implant or bridge           │
 * │ M27.62      │ Post-osseo failure           │ Remove + Replace│ New implant or bridge           │
 * ├─────────────┼──────────────────────────────┼─────────────────┼─────────────────────────────────┤
 * │             │                              │                 │                                 │
 * │ ESTHETIC (VENEER INDICATIONS)              │                 │                                 │
 * │             │                              │                 │                                 │
 * │ K00.3       │ Mottled teeth (fluorosis)    │ Veneer          │ Ceramic, Composite              │
 * │ K00.4       │ Enamel hypoplasia            │ Veneer/Crown    │ Ceramic                         │
 * │ K03.7       │ Posteruptive color changes   │ Veneer          │ Ceramic, Composite              │
 * ├─────────────┼──────────────────────────────┼─────────────────┼─────────────────────────────────┤
 * │             │                              │                 │                                 │
 * │ TRAUMA                                     │                 │                                 │
 * │             │                              │                 │                                 │
 * │ S02.5xxA    │ Fracture (initial)           │ Filling/Crown   │ Depends on fracture extent      │
 * │ S02.5xxD    │ Fracture (subsequent)        │ Crown/Veneer    │ Definitive restoration          │
 * └─────────────┴──────────────────────────────┴─────────────────┴─────────────────────────────────┘
 * 
 * 
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * RESTORATION TYPE SELECTION FLOWCHART
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * 
 *                                    ┌─────────────────────────┐
 *                                    │   RESTORATION SECTION   │
 *                                    │    (Add Restoration)    │
 *                                    └───────────┬─────────────┘
 *                                                │
 *                         ┌──────────────────────┼──────────────────────┐
 *                         ▼                      ▼                      ▼
 *                  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
 *                  │   FILLING    │       │    VENEER    │       │    CROWN     │
 *                  │              │       │              │       │              │
 *                  │ For: Caries  │       │ For: Esthetic│       │ For: Large   │
 *                  │ Wear, Small  │       │ Discoloration│       │ lesions, RCT │
 *                  │ lesions      │       │ Fluorosis    │       │ Fractures    │
 *                  └──────┬───────┘       └──────┬───────┘       └──────┬───────┘
 *                         │                      │                      │
 *                         ▼                      ▼                      ▼
 *               (See Filling Flow)     (See Veneer Flow)      (See Crown Flow)
 * 
 * 
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * FILLING SELECTION FLOWCHART
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * 
 *                              ┌─────────────────────┐
 *                              │   FILLING SELECTED  │
 *                              └──────────┬──────────┘
 *                                         │
 *                                         ▼
 *                              ┌─────────────────────┐
 *                              │   SELECT SURFACES   │
 *                              │   (Aspects)         │
 *                              └──────────┬──────────┘
 *                                         │
 *    ┌──────────┬──────────┬──────────────┼──────────────┬──────────┬──────────┐
 *    ▼          ▼          ▼              ▼              ▼          ▼          ▼
 * ┌──────┐  ┌──────┐  ┌──────┐      ┌───────────┐  ┌──────┐  ┌──────┐  ┌──────┐
 * │Cerv  │  │Buccal│  │Mesial│      │  Incisal  │  │Distal│  │Palat │  │Class4│
 * │Buccal│  │      │  │      │      │           │  │      │  │      │  │M or D│
 * │K02.53│  │K02.52│  │K02.52│      │  K02.51   │  │K02.52│  │K02.52│  │K02.52│
 * │Cl V  │  │Cl V  │  │Cl III│      │  Cl I/VI  │  │Cl III│  │Cl V  │  │Cl IV │
 * └──────┘  └──────┘  └──────┘      └───────────┘  └──────┘  └──────┘  └──────┘
 *                                         │
 *                                         ▼
 *                              ┌─────────────────────┐
 *                              │   SELECT MATERIAL   │
 *                              └──────────┬──────────┘
 *                                         │
 *    ┌──────────────┬──────────────┬──────┴──────┬──────────────┬──────────────┐
 *    ▼              ▼              ▼             ▼              ▼              ▼
 * ┌─────────┐  ┌─────────┐  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
 * │Composite│  │ Ceramic │  │ Amalgam │   │  Gold   │   │Non-Prec │   │Temporary│
 * │         │  │         │  │         │   │         │   │ Metal   │   │         │
 * │Anterior │  │Inlay/   │  │Posterior│   │Posterior│   │Large    │   │Interim  │
 * │& Small  │  │Onlay    │  │Class I/II   │High     │   │Cavities │   │While    │
 * │Posterior│  │         │  │         │   │Strength │   │         │   │Waiting  │
 * └────┬────┘  └────┬────┘  └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
 *      │            │            │             │             │             │
 *      └────────────┴────────────┴──────┬──────┴─────────────┴─────────────┘
 *                                       │
 *                                       ▼
 *                              ┌─────────────────────┐
 *                              │   SELECT QUALITY    │
 *                              └──────────┬──────────┘
 *                                         │
 *                    ┌────────────────────┼────────────────────┐
 *                    ▼                    ▼                    ▼
 *             ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
 *             │  SUFFICIENT  │     │  UNCERTAIN   │     │ INSUFFICIENT │
 *             │              │     │              │     │    K08.53    │
 *             │ Meeting      │     │ Marginal,    │     │ Failing,     │
 *             │ standards    │     │ monitor      │     │ replace      │
 *             └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
 *                    │                    │                    │
 *                    └────────────────────┼────────────────────┘
 *                                         │
 *                                         ▼
 *                              ┌─────────────────────┐
 *                              │   SELECT DETAIL     │
 *                              │   (Margin Status)   │
 *                              └──────────┬──────────┘
 *                                         │
 *                    ┌────────────────────┼────────────────────┐
 *                    ▼                    ▼                    ▼
 *             ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
 *             │   OVERHANG   │     │    FLUSH     │     │  SHORTFALL   │
 *             │              │     │              │     │              │
 *             │ Excess mat.  │     │ Ideal        │     │ Deficient    │
 *             │ Plaque trap  │     │ adaptation   │     │ margin       │
 *             │ Perio risk   │     │              │     │ Caries risk  │
 *             └──────────────┘     └──────────────┘     └──────────────┘
 * 
 * 
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * CROWN SELECTION FLOWCHART
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * 
 *                              ┌─────────────────────┐
 *                              │    CROWN SELECTED   │
 *                              └──────────┬──────────┘
 *                                         │
 *                                         ▼
 *                              ┌─────────────────────┐
 *                              │   SELECT CROWN #    │
 *                              │   (1-11 aspects)    │
 *                              └──────────┬──────────┘
 *                                         │
 *                                         ▼
 *                              ┌─────────────────────┐
 *                              │   SELECT MATERIAL   │
 *                              └──────────┬──────────┘
 *                                         │
 *              ┌──────────────────────────┼──────────────────────────┐
 *              ▼                          ▼                          ▼
 *       ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
 *       │  COMPOSITE   │          │   CERAMIC    │          │  METAL       │
 *       │              │          │              │          │  (Gold/NPM)  │
 *       │ Provisional  │          │ Esthetic     │          │ Strength     │
 *       │ or temp      │          │ Anterior     │          │ Posterior    │
 *       └──────┬───────┘          └──────┬───────┘          └──────┬───────┘
 *              │                         │                         │
 *              └─────────────────────────┼─────────────────────────┘
 *                                        │
 *                                        ▼
 *                              ┌─────────────────────┐
 *                              │   SELECT CROWN TYPE │
 *                              └──────────┬──────────┘
 *                                         │
 *              ┌──────────────────────────┼──────────────────────────┐
 *              ▼                          ▼                          ▼
 *       ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
 *       │ SINGLE CROWN │          │   ABUTMENT   │          │    PONTIC    │
 *       │              │          │   K08.1/K08.4│          │   K08.1/K08.4│
 *       │ Standalone   │          │ Bridge       │          │ False tooth  │
 *       │ restoration  │          │ support      │          │ in bridge    │
 *       └──────┬───────┘          └──────┬───────┘          └──────┬───────┘
 *              │                         │                         │
 *              └─────────────────────────┼─────────────────────────┘
 *                                        │
 *                                        ▼
 *                              ┌─────────────────────┐
 *                              │   SELECT CROWN BASE │
 *                              └──────────┬──────────┘
 *                                         │
 *                    ┌────────────────────┴────────────────────┐
 *                    ▼                                         ▼
 *             ┌──────────────┐                          ┌──────────────┐
 *             │   NATURAL    │                          │   IMPLANT    │
 *             │              │                          │    Z96.5     │
 *             │ On natural   │                          │ On dental    │
 *             │ tooth        │                          │ implant      │
 *             └──────────────┘                          └──────┬───────┘
 *                                                              │
 *                                                              ▼
 *                                               ┌─────────────────────────┐
 *                                               │   SELECT IMPLANT TYPE   │
 *                                               └──────────────┬──────────┘
 *                                                              │
 *                                          ┌───────────────────┴───────────────────┐
 *                                          ▼                                       ▼
 *                                   ┌──────────────┐                        ┌──────────────┐
 *                                   │  BONE LEVEL  │                        │ TISSUE LEVEL │
 *                                   │    Z96.5     │                        │    Z96.5     │
 *                                   │              │                        │              │
 *                                   │ Platform at  │                        │ Platform at  │
 *                                   │ bone level   │                        │ tissue level │
 *                                   └──────────────┘                        └──────────────┘
 * 
 * 
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * VENEER SELECTION FLOWCHART
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * 
 *                              ┌─────────────────────┐
 *                              │   VENEER SELECTED   │
 *                              │  For: K03.7, K00.3  │
 *                              │  K00.4, esthetic    │
 *                              └──────────┬──────────┘
 *                                         │
 *                                         ▼
 *                              ┌─────────────────────┐
 *                              │   SELECT SURFACES   │
 *                              └──────────┬──────────┘
 *                                         │
 *                    ┌────────────────────┴────────────────────┐
 *                    ▼                                         ▼
 *             ┌──────────────┐                          ┌──────────────┐
 *             │    BUCCAL    │                          │   LINGUAL    │
 *             │              │                          │              │
 *             │ Most common  │                          │ Uncommon,    │
 *             │ for esthetics│                          │ for erosion  │
 *             └──────┬───────┘                          └──────┬───────┘
 *                    │                                         │
 *                    └────────────────────┬────────────────────┘
 *                                         │
 *                                         ▼
 *                              ┌─────────────────────┐
 *                              │   SELECT MATERIAL   │
 *                              └──────────┬──────────┘
 *                                         │
 *                    ┌────────────────────┴────────────────────┐
 *                    ▼                                         ▼
 *             ┌──────────────┐                          ┌──────────────┐
 *             │  COMPOSITE   │                          │   CERAMIC    │
 *             │              │                          │              │
 *             │ Direct       │                          │ Indirect     │
 *             │ Less durable │                          │ More durable │
 *             │ Repairable   │                          │ Natural look │
 *             └──────┬───────┘                          └──────┬───────┘
 *                    │                                         │
 *                    └────────────────────┬────────────────────┘
 *                                         │
 *                                         ▼
 *                              ┌─────────────────────┐
 *                              │   SELECT QUALITY    │
 *                              └──────────┬──────────┘
 *                                         │
 *              ┌──────────────────────────┼──────────────────────────┐
 *              ▼                          ▼                          ▼
 *       ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
 *       │  SUFFICIENT  │          │  UNCERTAIN   │          │ INSUFFICIENT │
 *       │              │          │              │          │    K08.53    │
 *       │ Meeting      │          │ Monitor      │          │ Replace      │
 *       │ standards    │          │ closely      │          │ needed       │
 *       └──────────────┘          └──────────────┘          └──────────────┘
 * 
 * 
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * MATERIAL SELECTION GUIDE BY INDICATION
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * 
 * ┌──────────────────┬────────────────┬─────────────────────────────────────────────────┐
 * │ Material         │ Best For       │ ICD-10 Diagnoses Commonly Treated               │
 * ├──────────────────┼────────────────┼─────────────────────────────────────────────────┤
 * │ COMPOSITE        │                │                                                 │
 * │  - Anterior      │ Class III, IV  │ K02.52 (smooth surface caries)                  │
 * │  - Small post.   │ Small Class I  │ K02.51 (pit/fissure, limited)                   │
 * │  - Esthetic      │ Class V        │ K03.1, K03.2 (abrasion, erosion)                │
 * ├──────────────────┼────────────────┼─────────────────────────────────────────────────┤
 * │ CERAMIC          │                │                                                 │
 * │  - Inlay/Onlay   │ Large cavities │ K02.1, K02.62 (large dentin caries)             │
 * │  - Crown         │ Full coverage  │ K04.1, K03.81 (post-RCT, cracked)               │
 * │  - Veneer        │ Esthetics      │ K03.7, K00.3 (discoloration, fluorosis)         │
 * ├──────────────────┼────────────────┼─────────────────────────────────────────────────┤
 * │ AMALGAM          │                │                                                 │
 * │  - Class I, II   │ Posterior only │ K02.51, K02.62 (pit/fissure caries)             │
 * │  - Large cavit.  │ Strength       │ K02.1 (dentin caries, large)                    │
 * ├──────────────────┼────────────────┼─────────────────────────────────────────────────┤
 * │ GOLD             │                │                                                 │
 * │  - Inlay/Onlay   │ Durability     │ K02.1, K03.81 (long-term solution)              │
 * │  - Crown         │ Posteriors     │ K04.1 (post-RCT, molars)                        │
 * ├──────────────────┼────────────────┼─────────────────────────────────────────────────┤
 * │ NON-PRECIOUS     │                │                                                 │
 * │  - Crown/Bridge  │ Cost-effective │ K08.1, K08.4 (bridge frameworks)                │
 * │  - Framework     │ Strength       │ Z96.5 (implant superstructure)                  │
 * ├──────────────────┼────────────────┼─────────────────────────────────────────────────┤
 * │ GIC              │                │                                                 │
 * │  - Class V       │ Root caries    │ K02.53 (root surface caries)                    │
 * │  - Cervical      │ Fluoride rel.  │ K03.1, K03.2 (cervical lesions)                 │
 * │  - Pediatric     │ Temporary      │ K02.x (primary teeth)                           │
 * ├──────────────────┼────────────────┼─────────────────────────────────────────────────┤
 * │ TEMPORARY        │                │                                                 │
 * │  - Interim       │ Between visits │ Any (during multi-visit treatment)              │
 * │  - Sedative      │ Pain relief    │ K04.01 (reversible pulpitis, short-term)        │
 * └──────────────────┴────────────────┴─────────────────────────────────────────────────┘
 * 
 * 
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * BLACK'S CLASSIFICATION REFERENCE (for Fillings)
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * 
 * ┌───────────┬─────────────────────────────┬────────────────┬───────────────────────────┐
 * │ Class     │ Location                    │ UI Surface     │ Common ICD-10             │
 * ├───────────┼─────────────────────────────┼────────────────┼───────────────────────────┤
 * │ Class I   │ Occlusal (posterior)        │ Incisal        │ K02.51, K02.61, K02.62    │
 * │           │ Lingual pit (anterior)      │                │                           │
 * ├───────────┼─────────────────────────────┼────────────────┼───────────────────────────┤
 * │ Class II  │ Proximal (posterior)        │ Mesial, Distal │ K02.52                    │
 * │           │ Includes occlusal           │ + Incisal      │                           │
 * ├───────────┼─────────────────────────────┼────────────────┼───────────────────────────┤
 * │ Class III │ Proximal (anterior)         │ Mesial, Distal │ K02.52                    │
 * │           │ Not involving incisal       │                │                           │
 * ├───────────┼─────────────────────────────┼────────────────┼───────────────────────────┤
 * │ Class IV  │ Proximal (anterior)         │ Class4 Mesial  │ K02.52, S02.5             │
 * │           │ Involving incisal angle     │ Class4 Distal  │                           │
 * ├───────────┼─────────────────────────────┼────────────────┼───────────────────────────┤
 * │ Class V   │ Gingival 1/3 (any tooth)    │ Cervical Bucc. │ K02.53, K03.1, K03.2      │
 * │           │ Buccal or lingual           │ Cervical Pal.  │                           │
 * ├───────────┼─────────────────────────────┼────────────────┼───────────────────────────┤
 * │ Class VI  │ Cusp tip or incisal edge    │ Incisal        │ K03.0 (attrition)         │
 * │           │ (not commonly used)         │                │                           │
 * └───────────┴─────────────────────────────┴────────────────┴───────────────────────────┘
 */

// ============================================================================
// EXPORTS
// ============================================================================

export {
  RESTORATION_TYPES,
  RESTORATION_ICD10_REFERENCE,
  shouldShowOptionGroup,
  getVisibleOptionGroups,
  getRelatedDiagnoses,
  type RestorationType,
  type RelatedDiagnosis,
  type OptionGroup,
  type Option,
  type Condition,
};
