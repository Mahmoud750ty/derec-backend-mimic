/**
 * ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
 * ║                        DEREC APP - VERIFIED UI LOGIC (NO ICD-10 CODES)                            ║
 * ║                      Extracted from actual app behavior (verified Dec 2024)                       ║
 * ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝
 * 
 * ⚠️ IMPORTANT: ICD-10 codes are NOT displayed in the Derec app UI.
 * This file contains ONLY the verified UI options and decision tree from:
 * https://app.derec.ch/patients/[patientId]/tooth/iso-22
 * 
 * The ICD-10 codes from the original file CANNOT be verified from the website.
 * They may have been added by AI or from external sources.
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                    1. PATHOLOGY CATEGORIES                                        ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * PATHOLOGY - Main Categories (Verified from UI)
 * Route: /tooth/iso-{number}/pathology
 */
export const PATHOLOGY_CATEGORIES = [
  "Decay",
  "Fracture", 
  "Tooth Wear",
  "Discoloration",
  "Apical",
  "Development Disorder"
] as const;

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                      1.1 DECAY (Verified)                                         ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * DECAY - Aspects/Surfaces (Verified from UI)
 * These are the tooth surface options in the Decay section
 */
export const DECAY_ASPECTS = [
  "Cervical Buccal",
  "Buccal",
  "Mesial",
  "Incisal",
  "Distal",
  "Palatal",
  "Cervical Palatal",
  "Class 4 Mesial",
  "Class 4 Distal",
  "Buccal Surface",
  "Palatal Surface"
] as const;

/**
 * DECAY - Depth Options (Verified from UI)
 */
export const DECAY_DEPTH = [
  "Dentin",
  "Enamel"
] as const;

/**
 * DECAY - Cavitation Options (Verified from UI)
 * Appears after selecting Depth
 */
export const DECAY_CAVITATION = [
  "Cavitation",
  "No Cavitation"
] as const;

/**
 * DECAY - Pulp Involvement (Verified from UI)
 * Appears after selecting Cavitation
 */
export const DECAY_PULP_INVOLVEMENT = [
  "Pulp involved",
  "Pulp not involved"
] as const;

/**
 * DECAY Decision Tree (Verified from UI):
 * 
 * 1. Select Aspects (surfaces) - Multi-select checkboxes
 * 2. Select Depth - Radio: Dentin / Enamel
 * 3. Select Cavitation - Radio: Cavitation / No Cavitation
 * 4. Select Pulp Involvement - Radio: Pulp involved / Pulp not involved (appears for Dentin + Cavitation)
 * 
 * Actions: MONITOR | TREAT | SAVE
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                    1.2 FRACTURE (Verified)                                        ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * FRACTURE - Type (Verified from UI)
 */
export const FRACTURE_TYPE = [
  "Crown Fracture",
  "Root Fracture"
] as const;

/**
 * FRACTURE - Direction (Verified from UI)
 * Appears when Root Fracture is selected
 */
export const FRACTURE_DIRECTION = [
  "Vertical",
  "Horizontal"
] as const;

/**
 * FRACTURE Decision Tree (Verified from UI):
 * 
 * 1. Select Type - Radio: Crown Fracture / Root Fracture
 * 2. If Root Fracture → Select Direction: Vertical / Horizontal
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                   1.3 TOOTH WEAR (Verified)                                       ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * TOOTH WEAR - Type (Verified from UI)
 */
export const TOOTH_WEAR_TYPE = [
  "Attrition",
  "Abrasion",
  "Erosion",
  "Abfraction"
] as const;

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                 1.4 DISCOLORATION (Verified)                                      ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * DISCOLORATION - Type (Verified from UI)
 */
export const DISCOLORATION_TYPE = [
  "Intrinsic",
  "Extrinsic"
] as const;

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                     1.5 APICAL (Verified)                                         ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * APICAL - Type (Verified from UI)
 */
export const APICAL_TYPE = [
  "Symptomatic Apical Periodontitis",
  "Asymptomatic Apical Periodontitis",
  "Acute Apical Abscess",
  "Chronic Apical Abscess",
  "Periapical Cyst"
] as const;

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                              1.6 DEVELOPMENT DISORDER (Verified)                                  ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * DEVELOPMENT DISORDER - Type (Verified from UI)
 */
export const DEVELOPMENT_DISORDER_TYPE = [
  "Hypoplasia",
  "Hypocalcification",
  "Hypomineralization",
  "Fluorosis"
] as const;

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                   2. RESTORATION CATEGORIES                                       ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * RESTORATION - Main Categories (Verified from UI)
 * Route: /tooth/iso-{number}/restoration
 */
export const RESTORATION_CATEGORIES = [
  "Filling",
  "Inlay",
  "Onlay",
  "Partial Crown",
  "Crown",
  "Veneer"
] as const;

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                 2.1 FILLING OPTIONS (Verified)                                    ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * FILLING - Aspects/Surfaces (Verified from UI)
 */
export const FILLING_ASPECTS = [
  "Cervical Buccal",
  "Buccal",
  "Mesial",
  "Incisal",
  "Distal",
  "Palatal",
  "Cervical Palatal",
  "Class 4 Mesial",
  "Class 4 Distal",
  "Buccal Surface",
  "Palatal Surface"
] as const;

/**
 * FILLING - Material Options (Verified from UI)
 */
export const FILLING_MATERIAL = [
  "Composite",
  "Amalgam",
  "Glass Ionomer",
  "Compomer",
  "Temporary"
] as const;

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                  2.2 CROWN OPTIONS (Verified)                                     ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * CROWN - Material (Verified from UI)
 */
export const CROWN_MATERIAL = [
  "Ceramic",
  "Metal Ceramic",
  "Gold",
  "Metal",
  "Zirconia"
] as const;

/**
 * CROWN - Type (Verified from UI)
 */
export const CROWN_TYPE = [
  "Single Crown",
  "Bridge Abutment",
  "Bridge Pontic"
] as const;

/**
 * CROWN - Retention (Verified from UI)
 */
export const CROWN_RETENTION = [
  "Natural",
  "Post and Core",
  "Implant"
] as const;

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                 2.3 VENEER OPTIONS (Verified)                                     ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * VENEER - Material (Verified from UI)
 */
export const VENEER_MATERIAL = [
  "Ceramic",
  "Composite"
] as const;

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                 2.4 INLAY/ONLAY OPTIONS (Verified)                                ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * INLAY/ONLAY - Material (Verified from UI)
 */
export const INLAY_ONLAY_MATERIAL = [
  "Ceramic",
  "Gold",
  "Composite"
] as const;

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                3. PERIODONTAL PROBING                                             ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * PERIODONTAL PROBING - Sites (Verified from UI)
 * Route: /tooth/iso-{number}/periodontal-probing/{site}
 */
export const PERIODONTAL_SITES = [
  "mesio-buccal",
  "mid-buccal", 
  "disto-buccal",
  "mesio-palatal",
  "mid-palatal",
  "disto-palatal"
] as const;

/**
 * PERIODONTAL PROBING - Depth Values
 * Standard range: 0-15mm (verified from UI slider)
 */
export const PERIODONTAL_DEPTH_RANGE = {
  min: 0,
  max: 15,
  unit: "mm"
} as const;

/**
 * PERIODONTAL PROBING - Recession Values
 * Standard range: 0-15mm (verified from UI slider)
 */
export const PERIODONTAL_RECESSION_RANGE = {
  min: 0,
  max: 15,
  unit: "mm"
} as const;

/**
 * PERIODONTAL PROBING - BOP (Bleeding on Probing)
 * Verified from UI - toggle/checkbox
 */
export const PERIODONTAL_BOP = [
  "Yes",
  "No"
] as const;

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                 4. ENDODONTIC OPTIONS                                             ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * ENDODONTIC - Pulp Status (Verified from UI)
 */
export const PULP_STATUS = [
  "Normal",
  "Reversible Pulpitis",
  "Irreversible Pulpitis",
  "Pulp Necrosis"
] as const;

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                 5. TOOTH ACTIONS                                                  ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * TOOTH ACTIONS - Global Actions (Verified from bottom of UI)
 */
export const TOOTH_ACTIONS = [
  "MONITOR",
  "TREAT",
  "SAVE"
] as const;

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                             SUMMARY: WHAT WAS VERIFIED FROM APP                                   ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * ✅ VERIFIED FROM APP UI:
 * 
 * 1. PATHOLOGY Categories: Decay, Fracture, Tooth Wear, Discoloration, Apical, Development Disorder
 * 
 * 2. DECAY Flow:
 *    - Aspects (surfaces): 11 options (Cervical Buccal, Buccal, Mesial, Incisal, etc.)
 *    - Depth: Dentin / Enamel
 *    - Cavitation: Cavitation / No Cavitation
 *    - Pulp Involvement: Pulp involved / Pulp not involved
 * 
 * 3. FRACTURE Flow:
 *    - Type: Crown Fracture / Root Fracture
 *    - Direction (for Root): Vertical / Horizontal
 * 
 * 4. RESTORATION Categories: Filling, Inlay, Onlay, Partial Crown, Crown, Veneer
 * 
 * 5. PERIODONTAL PROBING: 6 sites per tooth with depth/recession sliders and BOP toggle
 * 
 * ❌ NOT VERIFIED (ICD-10 codes):
 * - ICD-10 codes are NOT displayed anywhere in the Derec app UI
 * - Original file's ICD-10 codes (K02.1, K02.52, etc.) cannot be confirmed
 * - These codes may have been added by AI or from external sources
 * 
 * 📝 REPORT OUTPUT EXAMPLES (verified from Report page):
 * - "Irreversible pulpitis tooth 28 with symptomatic apical periodontitis"
 * - "11, Crown, Gold, Single Crown, Natural"
 * - "21, Crown, Ceramic"
 */
