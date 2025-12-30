/**
 * Endodontic Diagnostic Logic - ThakaaMed App
 * 
 * This file documents the diagnostic decision logic for endodontic conditions.
 * The diagnosis is determined by combining results from multiple clinical tests.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * ICD-10 CODE REFERENCE FOR ENDODONTIC CONDITIONS (K04.x)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PULP DISEASES - K04.0x
 * ──────────────────────
 * │ Code    │ Diagnosis              │ Clinical Test Results           │ UI Selection                │
 * ├─────────┼────────────────────────┼──────────────────────────────────┼─────────────────────────────┤
 * │ K04.00  │ Initial pulpitis       │ Mild cold response               │ Cold: Positive → Unpleasant │
 * │ K04.01  │ Reversible pulpitis    │ Brief cold pain (<5 sec)         │ Cold: Positive → Pain stim  │
 * │ K04.02  │ Irreversible pulpitis  │ Lingering cold pain (>30 sec)    │ Cold: Positive → Lingering  │
 * │ K04.03  │ Chronic hyperplastic   │ Pulp polyp visible               │ Visual examination          │
 * │ K04.04  │ Acute pulpitis         │ Spontaneous, throbbing pain      │ Cold: Positive → Lingering  │
 * │ K04.05  │ Pulp gangrene          │ Foul odor, discoloration         │ Cold: Negative              │
 * └─────────┴────────────────────────┴──────────────────────────────────┴─────────────────────────────┘
 * 
 * PULP NECROSIS - K04.1
 * ──────────────────────
 * │ Code    │ Diagnosis              │ Clinical Test Results            │ UI Selection               │
 * ├─────────┼────────────────────────┼──────────────────────────────────┼────────────────────────────┤
 * │ K04.1   │ Necrosis of pulp       │ No cold response, no EPT         │ Cold: Negative             │
 * │         │                        │ May have discoloration           │ EPT: 10 (no response)      │
 * │         │                        │ Percussion may/may not be painful│ Heat: Negative             │
 * └─────────┴────────────────────────┴──────────────────────────────────┴────────────────────────────┘
 * 
 * Differential: Gray discoloration → K03.7 (Posteruptive color changes)
 *               + K04.1 if pulp testing confirms necrosis
 * 
 * PULP DEGENERATION - K04.2
 * ──────────────────────────
 * │ Code    │ Diagnosis              │ Description                      │ Clinical Finding           │
 * ├─────────┼────────────────────────┼──────────────────────────────────┼────────────────────────────┤
 * │ K04.2   │ Pulp degeneration      │ Denticles, pulp stones           │ Radiographic finding       │
 * │ K04.3   │ Abnormal hard tissue   │ Secondary/tertiary dentin        │ Calcific metamorphosis     │
 * │         │ formation in pulp      │ Pulp canal obliteration          │ Yellow discoloration       │
 * └─────────┴────────────────────────┴──────────────────────────────────┴────────────────────────────┘
 * 
 * PERIAPICAL DISEASES - K04.4-K04.9
 * ──────────────────────────────────
 * │ Code    │ Diagnosis                    │ Test Results                  │ UI Selection              │
 * ├─────────┼──────────────────────────────┼───────────────────────────────┼───────────────────────────┤
 * │ K04.4   │ Acute apical periodontitis   │ Percussion: Painful           │ Percussion: Painful       │
 * │         │ (Symptomatic AP)             │ Palpation: May be tender      │ + Cold: Any result        │
 * │         │                              │ No radiographic lesion        │                           │
 * ├─────────┼──────────────────────────────┼───────────────────────────────┼───────────────────────────┤
 * │ K04.5   │ Chronic apical periodontitis │ Percussion: Not painful       │ Percussion: Not painful   │
 * │         │ (Asymptomatic AP)            │ Radiographic lesion present   │ + Apical pathology: Yes   │
 * │         │                              │ No symptoms                   │                           │
 * ├─────────┼──────────────────────────────┼───────────────────────────────┼───────────────────────────┤
 * │ K04.6   │ Periapical abscess with      │ Draining sinus tract          │ Palpation: Not painful    │
 * │         │ sinus (Chronic abscess)      │ Usually asymptomatic          │ + Sinus tract present     │
 * ├─────────┼──────────────────────────────┼───────────────────────────────┼───────────────────────────┤
 * │ K04.7   │ Periapical abscess without   │ Swelling, severe pain         │ Palpation: Painful        │
 * │         │ sinus (Acute abscess)        │ Pus accumulation              │ + Swelling present        │
 * │         │                              │ May have systemic symptoms    │ EMERGENCY                 │
 * ├─────────┼──────────────────────────────┼───────────────────────────────┼───────────────────────────┤
 * │ K04.8   │ Radicular cyst               │ Large radiolucent lesion      │ Radiographic finding      │
 * │         │                              │ Well-defined borders          │ + Histology confirms      │
 * ├─────────┼──────────────────────────────┼───────────────────────────────┼───────────────────────────┤
 * │ K04.9   │ Other periapical diseases    │ Various presentations         │ Other findings            │
 * │ K04.99  │ Unspecified                  │ Periapical pathology NOS      │ Cannot classify           │
 * └─────────┴──────────────────────────────┴───────────────────────────────┴───────────────────────────┘
 * 
 * PREVIOUSLY TREATED TEETH - M27.5x / Z98.81x
 * ────────────────────────────────────────────
 * │ Code     │ Diagnosis                    │ UI Selection                  │ Clinical Scenario        │
 * ├──────────┼──────────────────────────────┼───────────────────────────────┼──────────────────────────┤
 * │ M27.51   │ Perforation of root canal    │ Cold: N/A → Existing RCT      │ Failed RCT complication  │
 * │ M27.52   │ Endodontic overfill          │ Cold: N/A → Existing RCT      │ Material beyond apex     │
 * │ M27.53   │ Endodontic underfill         │ Cold: N/A → Existing RCT      │ Short obturation         │
 * │ Z98.810  │ Dental restoration status    │ Cold: N/A → Existing RCT      │ Successful RCT           │
 * │ Z98.811  │ Dental sealant status        │ (Not endodontic)              │ Preventive treatment     │
 * └──────────┴──────────────────────────────┴───────────────────────────────┴──────────────────────────┘
 * 
 * COMBINED DIAGNOSIS MATRIX (Decision Tree)
 * ──────────────────────────────────────────
 * The final endodontic diagnosis combines PULP STATUS + PERIAPICAL STATUS:
 * 
 * │ Cold Test Result    │ Percussion   │ Palpation  │ Pulp Dx        │ Periapical Dx   │ ICD-10        │
 * ├─────────────────────┼──────────────┼────────────┼────────────────┼─────────────────┼───────────────┤
 * │ Positive (normal)   │ Not painful  │ Not painful│ Normal pulp    │ Normal AP       │ -             │
 * │ Positive (stimulus) │ Not painful  │ Not painful│ Reversible     │ Normal AP       │ K04.01        │
 * │ Positive (lingering)│ Not painful  │ Not painful│ Irreversible   │ Normal AP       │ K04.02        │
 * │ Positive (lingering)│ Painful      │ Any        │ Irreversible   │ Symptomatic AP  │ K04.02+K04.4  │
 * │ Negative            │ Not painful  │ Not painful│ Necrotic       │ Normal AP       │ K04.1         │
 * │ Negative            │ Painful      │ Not painful│ Necrotic       │ Symptomatic AP  │ K04.1+K04.4   │
 * │ Negative            │ Painful      │ Painful    │ Necrotic       │ Acute abscess   │ K04.1+K04.7   │
 * │ Negative            │ Not painful  │ Not painful│ Necrotic       │ Asymptomatic AP │ K04.1+K04.5   │
 * │ N/A (RCT exists)    │ Not painful  │ Not painful│ Prev. treated  │ Normal AP       │ Z98.810       │
 * │ N/A (RCT exists)    │ Painful      │ Any        │ Prev. treated  │ Symptomatic AP  │ Z98.810+K04.4 │
 * └─────────────────────┴──────────────┴────────────┴────────────────┴─────────────────┴───────────────┘
 * 
 * EPT (ELECTRIC PULP TEST) INTERPRETATION
 * ────────────────────────────────────────
 * │ EPT Value │ Response Type    │ Pulp Status         │ ICD-10  │
 * ├───────────┼──────────────────┼─────────────────────┼─────────┤
 * │ 1-3       │ Hyperresponsive  │ Inflamed (pulpitis) │ K04.02  │
 * │ 4-6       │ Normal           │ Healthy pulp        │ -       │
 * │ 7-9       │ Hyporesponsive   │ Degenerating pulp   │ K04.01  │
 * │ 10        │ No response      │ Necrotic pulp       │ K04.1   │
 * └───────────┴──────────────────┴─────────────────────┴─────────┘
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface TestResult {
  performed: boolean;
  result: string | null;
  subResult?: string | null;
}

interface EndodonticDiagnosis {
  pulpDiagnosis: PulpDiagnosis | null;
  periapicalDiagnosis: PeriapicalDiagnosis | null;
  icd10Codes: string[];
  confirmationMessage: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
}

interface PulpDiagnosis {
  name: string;
  icd10Code: string;
  description: string;
}

interface PeriapicalDiagnosis {
  name: string;
  icd10Code: string;
  description: string;
}

// ============================================================================
// PULP DIAGNOSES - Based on Cold/Heat/EPT Tests
// ============================================================================

const PULP_DIAGNOSES: Record<string, PulpDiagnosis> = {
  normal_pulp: {
    name: 'Normal Pulp',
    icd10Code: '',
    description: 'Pulp is vital and healthy with no inflammation'
  },
  reversible_pulpitis: {
    name: 'Reversible Pulpitis',
    icd10Code: 'K04.01',
    description: 'Pulp inflammation that can heal if irritant is removed. Quick sharp pain that subsides quickly.'
  },
  irreversible_pulpitis: {
    name: 'Irreversible Pulpitis',
    icd10Code: 'K04.02',
    description: 'Pulp inflammation that will not heal. Characterized by lingering pain (>30 seconds), spontaneous pain, or night pain.'
  },
  pulp_necrosis: {
    name: 'Pulp Necrosis',
    icd10Code: 'K04.1',
    description: 'Dead pulp tissue. No response to thermal or electrical tests. May have tooth discoloration.'
  },
  previously_treated: {
    name: 'Previously Treated',
    icd10Code: 'M27.51',
    description: 'Tooth has existing root canal treatment.'
  },
  previously_initiated: {
    name: 'Previously Initiated Therapy',
    icd10Code: '',
    description: 'Root canal treatment has been started but not completed.'
  }
};

// ============================================================================
// PERIAPICAL DIAGNOSES - Based on Percussion/Palpation Tests
// ============================================================================

const PERIAPICAL_DIAGNOSES: Record<string, PeriapicalDiagnosis> = {
  normal_apical: {
    name: 'Normal Apical Tissues',
    icd10Code: '',
    description: 'No periapical pathology. Teeth are not tender to percussion or palpation.'
  },
  symptomatic_apical_periodontitis: {
    name: 'Symptomatic Apical Periodontitis',
    icd10Code: 'K04.4',
    description: 'Inflammation of periapical tissues with symptoms. Painful to percussion and/or palpation.'
  },
  asymptomatic_apical_periodontitis: {
    name: 'Asymptomatic Apical Periodontitis',
    icd10Code: 'K04.5',
    description: 'Chronic inflammation of periapical tissues without symptoms. May show radiographic changes.'
  },
  acute_apical_abscess: {
    name: 'Acute Apical Abscess',
    icd10Code: 'K04.7',
    description: 'Acute infection with pus formation. Severe pain, swelling, possible systemic symptoms.'
  },
  chronic_apical_abscess: {
    name: 'Chronic Apical Abscess (with sinus tract)',
    icd10Code: 'K04.6',
    description: 'Chronic infection with draining sinus tract (fistula). Usually asymptomatic.'
  }
};

// ============================================================================
// COLD TEST DECISION LOGIC
// ============================================================================

/**
 * Cold Test Results and Their Interpretations
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Cold Test                                                       │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ ├── Positive                                                    │
 * │ │   ├── Within limits → Normal pulp (healthy)                  │
 * │ │   ├── Unpleasant → Sensitive pulp (monitor)                  │
 * │ │   ├── Pain stimulus → Reversible Pulpitis (K04.01)           │
 * │ │   └── Pain lingering (>30s) → Irreversible Pulpitis (K04.02) │
 * │ ├── Uncertain → Further testing required                        │
 * │ ├── Negative → Necrotic Pulp (K04.1)                           │
 * │ └── Not Applicable                                              │
 * │     ├── Existing RCT → Previously treated                       │
 * │     └── Previously Initiated Therapy → Ongoing treatment        │
 * └─────────────────────────────────────────────────────────────────┘
 */

interface ColdTestResult {
  primaryResult: 'positive' | 'uncertain' | 'negative' | 'not_applicable' | null;
  positiveDetail?: 'within_limits' | 'unpleasant' | 'pain_stimulus' | 'pain_lingering' | null;
  notApplicableReason?: 'existing_rct' | 'previously_initiated_therapy' | null;
}

function interpretColdTest(result: ColdTestResult): PulpDiagnosis | null {
  if (!result.primaryResult) return null;

  switch (result.primaryResult) {
    case 'positive':
      switch (result.positiveDetail) {
        case 'within_limits':
          return PULP_DIAGNOSES.normal_pulp;
        case 'unpleasant':
          return PULP_DIAGNOSES.normal_pulp; // Monitor, not pathological yet
        case 'pain_stimulus':
          return PULP_DIAGNOSES.reversible_pulpitis;
        case 'pain_lingering':
          return PULP_DIAGNOSES.irreversible_pulpitis;
        default:
          return null;
      }
    case 'negative':
      return PULP_DIAGNOSES.pulp_necrosis;
    case 'not_applicable':
      if (result.notApplicableReason === 'existing_rct') {
        return PULP_DIAGNOSES.previously_treated;
      }
      if (result.notApplicableReason === 'previously_initiated_therapy') {
        return PULP_DIAGNOSES.previously_initiated;
      }
      return null;
    case 'uncertain':
    default:
      return null;
  }
}

// ============================================================================
// PERCUSSION TEST DECISION LOGIC
// ============================================================================

/**
 * Percussion Test Results and Their Interpretations
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Percussion Test                                                 │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ ├── Not Painful → Normal periapical tissues                    │
 * │ ├── Unpleasant → Early periapical involvement                  │
 * │ └── Painful → Symptomatic Apical Periodontitis                 │
 * └─────────────────────────────────────────────────────────────────┘
 */

type PercussionResult = 'not_painful' | 'unpleasant' | 'painful' | null;

function interpretPercussionTest(result: PercussionResult): PeriapicalDiagnosis | null {
  switch (result) {
    case 'not_painful':
      return PERIAPICAL_DIAGNOSES.normal_apical;
    case 'unpleasant':
      return PERIAPICAL_DIAGNOSES.symptomatic_apical_periodontitis; // Early stage
    case 'painful':
      return PERIAPICAL_DIAGNOSES.symptomatic_apical_periodontitis;
    default:
      return null;
  }
}

// ============================================================================
// PALPATION TEST DECISION LOGIC
// ============================================================================

/**
 * Palpation Test Results and Their Interpretations
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Palpation Test                                                  │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ ├── Not Painful → No significant periapical infection          │
 * │ ├── Unpleasant → Localized inflammation                        │
 * │ └── Painful → Abscess likely forming (K04.6/K04.7)             │
 * └─────────────────────────────────────────────────────────────────┘
 */

type PalpationResult = 'not_painful' | 'unpleasant' | 'painful' | null;

function interpretPalpationTest(result: PalpationResult, hasSwelling: boolean = false): PeriapicalDiagnosis | null {
  switch (result) {
    case 'not_painful':
      return PERIAPICAL_DIAGNOSES.normal_apical;
    case 'unpleasant':
      return PERIAPICAL_DIAGNOSES.symptomatic_apical_periodontitis;
    case 'painful':
      // Painful palpation with swelling indicates acute abscess
      return hasSwelling 
        ? PERIAPICAL_DIAGNOSES.acute_apical_abscess 
        : PERIAPICAL_DIAGNOSES.symptomatic_apical_periodontitis;
    default:
      return null;
  }
}

// ============================================================================
// HEAT TEST DECISION LOGIC
// ============================================================================

/**
 * Heat Test Results and Their Interpretations
 * (Similar logic to Cold Test, used for confirmation)
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Heat Test                                                       │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ ├── Positive                                                    │
 * │ │   ├── Within limits → Normal pulp                            │
 * │ │   ├── Unpleasant → Sensitive pulp                            │
 * │ │   ├── Pain stimulus → Reversible Pulpitis                    │
 * │ │   └── Pain lingering → Irreversible Pulpitis                 │
 * │ ├── Uncertain → Inconclusive                                    │
 * │ ├── Negative → Necrotic Pulp                                    │
 * │ └── Not Applicable → Previous treatment                         │
 * └─────────────────────────────────────────────────────────────────┘
 */

// Heat test uses same interpretation as cold test
const interpretHeatTest = interpretColdTest;

// ============================================================================
// ELECTRICITY (EPT) TEST DECISION LOGIC
// ============================================================================

/**
 * Electric Pulp Test (EPT) Results and Their Interpretations
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ EPT Value (1-10 scale)                                          │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ ├── 1-3 → Hyperresponsive (inflamed pulp - pulpitis)           │
 * │ ├── 4-6 → Normal response (healthy pulp)                        │
 * │ ├── 7-9 → Hyporesponsive (degenerating pulp)                   │
 * │ └── 10 → No response (necrotic pulp)                            │
 * └─────────────────────────────────────────────────────────────────┘
 */

function interpretEPT(value: number | null): PulpDiagnosis | null {
  if (value === null) return null;

  if (value >= 1 && value <= 3) {
    return PULP_DIAGNOSES.irreversible_pulpitis; // Hyperresponsive
  } else if (value >= 4 && value <= 6) {
    return PULP_DIAGNOSES.normal_pulp; // Normal
  } else if (value >= 7 && value <= 9) {
    return PULP_DIAGNOSES.reversible_pulpitis; // Hyporesponsive - degenerating
  } else if (value === 10) {
    return PULP_DIAGNOSES.pulp_necrosis; // No response
  }
  return null;
}

// ============================================================================
// COMBINED DIAGNOSIS MATRIX
// ============================================================================

/**
 * Combined Diagnosis Matrix
 * 
 * The final diagnosis is determined by combining all test results:
 * 
 * | Cold Test           | Percussion  | Palpation | Final Diagnosis                                          | ICD-10        |
 * |---------------------|-------------|-----------|----------------------------------------------------------|---------------|
 * | Positive (lingering)| Painful     | Any       | Irreversible pulpitis with symptomatic apical periodontitis | K04.02 + K04.4|
 * | Positive (lingering)| Not painful | Any       | Irreversible pulpitis                                    | K04.02        |
 * | Positive (stimulus) | Not painful | Any       | Reversible pulpitis                                      | K04.01        |
 * | Negative            | Painful     | Painful   | Necrotic pulp with acute apical abscess                  | K04.1 + K04.7 |
 * | Negative            | Painful     | Not painful| Necrotic pulp with chronic apical periodontitis         | K04.1 + K04.5 |
 * | Positive (normal)   | Not painful | Not painful| Normal pulp                                              | -             |
 */

interface EndodonticTestResults {
  toothNumber: string;
  coldTest: ColdTestResult;
  percussionTest: PercussionResult;
  palpationTest: PalpationResult;
  heatTest?: ColdTestResult;
  eptValue?: number | null;
  hasSwelling?: boolean;
  hasSinusTract?: boolean;
}

function generateEndodonticDiagnosis(tests: EndodonticTestResults): EndodonticDiagnosis {
  const pulpDiagnosis = interpretColdTest(tests.coldTest);
  let periapicalDiagnosis = interpretPercussionTest(tests.percussionTest);

  // Refine periapical diagnosis with palpation results
  const palpationInterpretation = interpretPalpationTest(tests.palpationTest, tests.hasSwelling);
  if (palpationInterpretation && 
      palpationInterpretation.name !== 'Normal Apical Tissues' &&
      (!periapicalDiagnosis || periapicalDiagnosis.name === 'Normal Apical Tissues')) {
    periapicalDiagnosis = palpationInterpretation;
  }

  // Check for abscess conditions
  if (tests.hasSinusTract) {
    periapicalDiagnosis = PERIAPICAL_DIAGNOSES.chronic_apical_abscess;
  } else if (tests.hasSwelling && tests.palpationTest === 'painful') {
    periapicalDiagnosis = PERIAPICAL_DIAGNOSES.acute_apical_abscess;
  }

  // Build ICD-10 codes array
  const icd10Codes: string[] = [];
  if (pulpDiagnosis?.icd10Code) icd10Codes.push(pulpDiagnosis.icd10Code);
  if (periapicalDiagnosis?.icd10Code) icd10Codes.push(periapicalDiagnosis.icd10Code);

  // Generate confirmation message
  const confirmationMessage = generateConfirmationMessage(
    tests.toothNumber,
    pulpDiagnosis,
    periapicalDiagnosis
  );

  // Determine urgency
  const urgency = determineUrgency(pulpDiagnosis, periapicalDiagnosis);

  return {
    pulpDiagnosis,
    periapicalDiagnosis,
    icd10Codes,
    confirmationMessage,
    urgency
  };
}

function generateConfirmationMessage(
  toothNumber: string,
  pulpDiagnosis: PulpDiagnosis | null,
  periapicalDiagnosis: PeriapicalDiagnosis | null
): string {
  const parts: string[] = [];
  
  if (pulpDiagnosis && pulpDiagnosis.name !== 'Normal Pulp') {
    parts.push(pulpDiagnosis.name);
  }
  
  if (periapicalDiagnosis && periapicalDiagnosis.name !== 'Normal Apical Tissues') {
    parts.push(`with ${periapicalDiagnosis.name.toLowerCase()}`);
  }

  if (parts.length === 0) {
    return `Tooth ${toothNumber}: Normal pulp with normal apical tissues`;
  }

  return `Tooth ${toothNumber}: ${parts.join(' ')}`;
}

function determineUrgency(
  pulpDiagnosis: PulpDiagnosis | null,
  periapicalDiagnosis: PeriapicalDiagnosis | null
): 'low' | 'medium' | 'high' | 'emergency' {
  // Emergency conditions
  if (periapicalDiagnosis?.name === 'Acute Apical Abscess') {
    return 'emergency';
  }

  // High urgency conditions
  if (pulpDiagnosis?.name === 'Irreversible Pulpitis' || 
      pulpDiagnosis?.name === 'Pulp Necrosis') {
    return 'high';
  }

  // Medium urgency conditions
  if (pulpDiagnosis?.name === 'Reversible Pulpitis' ||
      periapicalDiagnosis?.name === 'Symptomatic Apical Periodontitis') {
    return 'medium';
  }

  return 'low';
}

// ============================================================================
// CONFIRMATION MESSAGES - Specific scenarios from derec-data.txt
// ============================================================================

const CONFIRMATION_MESSAGES = {
  // Cold Test Confirmations
  cold_unpleasant: (tooth: string) => 
    `Unpleasant reaction to cold tooth ${tooth}`,
  
  cold_pain_stimulus: (tooth: string) => 
    `Reversible pulpitis tooth ${tooth}?`,
  
  cold_existing_rct: (tooth: string) => 
    `Previously root canal treated tooth ${tooth} with normal apical tissues`,

  // Percussion Test Confirmations (for previously treated teeth)
  percussion_not_painful_rct: (tooth: string) => 
    `Previously initiated root canal treatment tooth ${tooth} with normal apical tissues`,
  
  percussion_painful_rct: (tooth: string) => 
    `Previously initiated root canal treatment tooth ${tooth} with symptomatic apical periodontitis`,

  // Combined Diagnosis Messages
  irreversible_with_sap: (tooth: string) => 
    `Irreversible pulpitis tooth ${tooth} with symptomatic apical periodontitis`,
  
  necrotic_with_abscess: (tooth: string) => 
    `Necrotic pulp tooth ${tooth} with acute apical abscess`,
  
  necrotic_with_chronic: (tooth: string) => 
    `Necrotic pulp tooth ${tooth} with chronic apical periodontitis`
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Types
  EndodonticDiagnosis,
  PulpDiagnosis,
  PeriapicalDiagnosis,
  ColdTestResult,
  PercussionResult,
  PalpationResult,
  EndodonticTestResults,
  
  // Constants
  PULP_DIAGNOSES,
  PERIAPICAL_DIAGNOSES,
  CONFIRMATION_MESSAGES,
  
  // Functions
  interpretColdTest,
  interpretHeatTest,
  interpretPercussionTest,
  interpretPalpationTest,
  interpretEPT,
  generateEndodonticDiagnosis,
  generateConfirmationMessage,
  determineUrgency
};

