interface EndodonticData {
  toothNumber: string;          // FDI or Universal tooth number

  coldTest: {
    performed: boolean;         // Whether test was conducted
    primaryResult: string | null;  // "positive" | "uncertain" | "negative" | "not_applicable" | null

    // If primaryResult is "positive", ONE of these sub-options MUST be selected:
    positiveDetail: string | null;  // "within_limits" | "unpleasant" | "pain_stimulus" | "pain_lingering" | null
    // Note: positiveDetail is REQUIRED when primaryResult = "positive"

    // If primaryResult is "not_applicable", these sub-options are available:
    notApplicableReason: string | null;  // "existing_rct" | "previously_initiated_therapy" | null

    // Confirmation messages that may be triggered
    confirmationMessage: string | null;  // Dynamic message based on selection

    // Resulting diagnosis based on selection
    diagnosis: string | null;           // Diagnosis text
    icd10Code: string | null;          // ICD-10 code if applicable
  },

  percussionTest: {
    performed: boolean;         // Whether test was conducted
    result: string | null;      // "not_painful" | "unpleasant" | "painful" | null

    // Context for interpretation (if previous RCT exists)
    previousRCT: boolean;       // Whether tooth has previous root canal treatment

    // Confirmation message based on result + context
    confirmationMessage: string | null;

    // Resulting diagnosis
    diagnosis: string | null;   // Diagnosis text
    icd10Code: string | null;   // ICD-10 code if applicable
  },

  palpationTest: {
    performed: boolean;         // Whether test was conducted
    result: string | null;      // "not_painful" | "unpleasant" | "painful" | null

    // Resulting diagnosis
    diagnosis: string | null;   // Diagnosis text
    icd10Code: string | null;   // ICD-10 code if applicable
  },

  heatTest: {
    performed: boolean;         // Whether test was conducted
    primaryResult: string | null;  // "positive" | "uncertain" | "negative" | "not_applicable" | null

    // If primaryResult is "positive", ONE of these sub-options MUST be selected:
    positiveDetail: string | null;  // "within_limits" | "unpleasant" | "pain_stimulus" | "pain_lingering" | null
    // Note: positiveDetail is REQUIRED when primaryResult = "positive"

    // Resulting diagnosis
    diagnosis: string | null;   // Diagnosis text
    icd10Code: string | null;   // ICD-10 code if applicable
  },

  electricityTest: {
    performed: boolean;         // Whether test was conducted
    value: number | null;       // 1-10 scale electrical pulp test reading

    // Interpretation based on value
    interpretation: string | null;  // Based on value ranges (1-3: hyperresponsive, 4-6: normal, 7-9: hyporesponsive, 10: no response)
    diagnosis: string | null;   // Diagnosis text
  }
}
// 