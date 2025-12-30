/**
 * ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
 * ║                          DEREC APP - COMPREHENSIVE DIAGNOSTIC TABLES                              ║
 * ║                              All ICD-10 Codes & UI Attribute Mappings                             ║
 * ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝
 * 
 * Format: Category | Attribute 1 | Attribute 2 | Attribute 3 | Value | ICD-10 Code | ICD-10 Description
 * Each row contains ONE value per cell - matches exact Derec app selection hierarchy
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                    1. DECAY (CARIES) TABLE                                        ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * DECAY - COMPLETE ATTRIBUTE TABLE (From Derec App)
 * 
 * | Category | Attribute 1 | Attribute 2 | Attribute 3    | Value          | ICD-10 Code | ICD-10 Description             |
 * |----------|-------------|-------------|----------------|----------------|-------------|--------------------------------|
 * | Decay    |             |             |                |                |             |                                |
 * | Decay    | Aspects     |             |                | Buccal         | K02.52      | Caries on smooth surface       |
 * | Decay    | Aspects     |             |                | Labial         | K02.52      | Caries on smooth surface       |
 * | Decay    | Aspects     |             |                | Lingual        | K02.52      | Caries on smooth surface       |
 * | Decay    | Aspects     |             |                | Palatal        | K02.52      | Caries on smooth surface       |
 * | Decay    | Aspects     |             |                | Mesial         | K02.52      | Caries on smooth surface       |
 * | Decay    | Aspects     |             |                | Distal         | K02.52      | Caries on smooth surface       |
 * | Decay    | Aspects     |             |                | Occlusal       | K02.51      | Caries on pit and fissure      |
 * | Decay    | Aspects     |             |                | Incisal        | K02.51      | Caries on pit and fissure      |
 * | Decay    | Aspects     |             |                | Cervical Buccal| K02.53      | Caries on root surface         |
 * | Decay    | Aspects     |             |                | Cervical Palatal| K02.53     | Caries on root surface         |
 * | Decay    | Aspects     |             |                | Class 4 Mesial | K02.52      | Caries on smooth surface       |
 * | Decay    | Aspects     |             |                | Class 4 Distal | K02.52      | Caries on smooth surface       |
 * | Decay    | Depth       |             |                | Enamel         | K02.0       | Caries limited to enamel       |
 * | Decay    | Depth       |             |                | Dentin         | K02.1       | Caries of dentine              |
 * | Decay    | Depth       | Cavitation  |                | Cavitated      | -           | Active caries                  |
 * | Decay    | Depth       | Cavitation  |                | Not Cavitated  | K02.3       | Arrested dental caries         |
 * | Decay    | Depth       | Cavitation  | Classification | C1             | K02.0       | Initial lesion (Enamel only)   |
 * | Decay    | Depth       | Cavitation  | Classification | C2             | K02.0/K02.1 | Established lesion             |
 * | Decay    | Depth       | Cavitation  | Classification | C3             | K02.1       | Deep lesion (Dentin required)  |
 * | Decay    | Depth       | Cavitation  | Classification | C4             | K02.5       | Pulp exposure (Dentin required)|
 * 
 * 
 * DECAY - FULL SELECTION PATH TABLE
 * 
 * SMOOTH SURFACE (Buccal, Labial, Lingual, Palatal, Mesial, Distal):
 * 
 * CLINICAL RULE: Enamel can only have C1-C2. C3-C4 require Dentin depth.
 * 
 * | Category | Aspects        | Depth  | Cavitation    | Classification | ICD-10 Code | ICD-10 Description             |
 * |----------|----------------|--------|---------------|----------------|-------------|--------------------------------|
 * | Decay    | Buccal         | Enamel | Cavitated     | C1             | K02.0       | Caries limited to enamel       |
 * | Decay    | Buccal         | Enamel | Cavitated     | C2             | K02.0       | Caries limited to enamel       |
 * | Decay    | Buccal         | Enamel | Not Cavitated | C1             | K02.3       | Arrested dental caries         |
 * | Decay    | Buccal         | Enamel | Not Cavitated | C2             | K02.3       | Arrested dental caries         |
 * | Decay    | Buccal         | Dentin | Cavitated     | C1             | K02.1       | Caries of dentine              |
 * | Decay    | Buccal         | Dentin | Cavitated     | C2             | K02.1       | Caries of dentine              |
 * | Decay    | Buccal         | Dentin | Cavitated     | C3             | K02.1       | Caries of dentine              |
 * | Decay    | Buccal         | Dentin | Cavitated     | C4             | K02.5       | Caries with pulp exposure      |
 * | Decay    | Buccal         | Dentin | Not Cavitated | C1             | K02.3       | Arrested dental caries         |
 * | Decay    | Buccal         | Dentin | Not Cavitated | C2             | K02.3       | Arrested dental caries         |
 * | Decay    | Buccal         | Dentin | Not Cavitated | C3             | K02.3       | Arrested dental caries         |
 * | Decay    | Buccal         | Dentin | Not Cavitated | C4             | K02.3       | Arrested dental caries         |
 * | Decay    | Labial         | (same logic as Buccal)                | K02.52      | Caries on smooth surface       |
 * | Decay    | Lingual        | (same logic as Buccal)                | K02.52      | Caries on smooth surface       |
 * | Decay    | Palatal        | (same logic as Buccal)                | K02.52      | Caries on smooth surface       |
 * | Decay    | Mesial         | (same logic as Buccal)                | K02.52      | Caries on smooth surface       |
 * | Decay    | Distal         | (same logic as Buccal)                | K02.52      | Caries on smooth surface       |
 * 
 * PIT AND FISSURE (Occlusal, Incisal):
 * 
 * CLINICAL RULE: Enamel can only have C1-C2. C3-C4 require Dentin depth.
 * 
 * | Category | Aspects        | Depth  | Cavitation    | Classification | ICD-10 Code | ICD-10 Description             |
 * |----------|----------------|--------|---------------|----------------|-------------|--------------------------------|
 * | Decay    | Occlusal       | Enamel | Cavitated     | C1             | K02.61      | Pit/fissure caries enamel      |
 * | Decay    | Occlusal       | Enamel | Cavitated     | C2             | K02.61      | Pit/fissure caries enamel      |
 * | Decay    | Occlusal       | Enamel | Not Cavitated | C1             | K02.3       | Arrested dental caries         |
 * | Decay    | Occlusal       | Enamel | Not Cavitated | C2             | K02.3       | Arrested dental caries         |
 * | Decay    | Occlusal       | Dentin | Cavitated     | C1             | K02.62      | Pit/fissure caries dentin      |
 * | Decay    | Occlusal       | Dentin | Cavitated     | C2             | K02.62      | Pit/fissure caries dentin      |
 * | Decay    | Occlusal       | Dentin | Cavitated     | C3             | K02.62      | Pit/fissure caries dentin      |
 * | Decay    | Occlusal       | Dentin | Cavitated     | C4             | K02.63      | Pit/fissure caries pulp        |
 * | Decay    | Occlusal       | Dentin | Not Cavitated | C1             | K02.3       | Arrested dental caries         |
 * | Decay    | Occlusal       | Dentin | Not Cavitated | C2             | K02.3       | Arrested dental caries         |
 * | Decay    | Occlusal       | Dentin | Not Cavitated | C3             | K02.3       | Arrested dental caries         |
 * | Decay    | Occlusal       | Dentin | Not Cavitated | C4             | K02.3       | Arrested dental caries         |
 * | Decay    | Incisal        | (same logic as Occlusal)              | K02.51      | Caries on pit and fissure      |
 * 
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                    2. FRACTURE TABLE                                              ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * FRACTURE - COMPLETE ATTRIBUTE TABLE (From Derec App)
 * 
 * | Category | Attribute 1 | Attribute 2 | Value      | ICD-10 Code | ICD-10 Description             |
 * |----------|-------------|-------------|------------|-------------|--------------------------------|
 * | Fracture |             |             |            |             |                                |
 * | Fracture | Type        |             | Crown Fracture | S02.5xxA | Fracture of tooth              |
 * | Fracture | Type        |             | Root Fracture  | S02.5xxA | Fracture of tooth              |
 * | Fracture | Type        | Direction   | Vertical   | S02.5xxA    | Vertical root fracture         |
 * | Fracture | Type        | Direction   | Horizontal | S02.5xxA    | Horizontal root fracture       |
 * 
 * 
 * FRACTURE - FULL SELECTION PATH TABLE
 * 
 * | Category | Type           | Direction  | ICD-10 Code | ICD-10 Description             |
 * |----------|----------------|------------|-------------|--------------------------------|
 * | Fracture | Crown Fracture | -          | S02.5xxA    | Fracture of tooth              |
 * | Fracture | Crown Fracture | -          | K03.81      | Cracked tooth (non-traumatic)  |
 * | Fracture | Root Fracture  | Vertical   | S02.5xxA    | Vertical root fracture         |
 * | Fracture | Root Fracture  | Horizontal | S02.5xxA    | Horizontal root fracture       |
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                    3. TOOTH WEAR TABLE                                            ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * TOOTH WEAR - COMPLETE ATTRIBUTE TABLE (From Derec App)
 * 
 * | Category   | Attribute 1 | Attribute 2 | Value    | ICD-10 Code | ICD-10 Description             |
 * |------------|-------------|-------------|----------|-------------|--------------------------------|
 * | Tooth Wear |             |             |          |             |                                |
 * | Tooth Wear | Type        |             | Abrasion | K03.1       | Abrasion of teeth              |
 * | Tooth Wear | Type        |             | Erosion  | K03.2       | Erosion of teeth               |
 * | Tooth Wear | Type        | Location    | Buccal   | K03.1       | Abrasion of teeth              |
 * | Tooth Wear | Type        | Location    | Lingual  | K03.2       | Erosion of teeth               |
 * 
 * 
 * TOOTH WEAR - FULL SELECTION PATH TABLE
 * 
 * | Category   | Type     | Location | ICD-10 Code | ICD-10 Description             |
 * |------------|----------|----------|-------------|--------------------------------|
 * | Tooth Wear | Abrasion | Buccal   | K03.1       | Abrasion of teeth              |
 * | Tooth Wear | Abrasion | Lingual  | K03.1       | Abrasion of teeth              |
 * | Tooth Wear | Erosion  | Buccal   | K03.2       | Erosion of teeth               |
 * | Tooth Wear | Erosion  | Lingual  | K03.2       | Erosion of teeth               |
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                    4. DISCOLORATION TABLE                                         ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * DISCOLORATION - COMPLETE ATTRIBUTE TABLE (From Derec App)
 * 
 * | Category      | Attribute 1 | Value  | ICD-10 Code | ICD-10 Description                    |
 * |---------------|-------------|--------|-------------|---------------------------------------|
 * | Discoloration |             |        |             |                                       |
 * | Discoloration | Color       | Red    | K03.7       | Posteruptive color changes            |
 * | Discoloration | Color       | Gray   | K03.7       | Posteruptive color changes            |
 * | Discoloration | Color       | Yellow | K03.7       | Posteruptive color changes            |
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                    5. APICAL TABLE                                                ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * APICAL - COMPLETE ATTRIBUTE TABLE (From Derec App)
 * 
 * | Category | Attribute 1 | Value | ICD-10 Code | ICD-10 Description                    |
 * |----------|-------------|-------|-------------|---------------------------------------|
 * | Apical   |             |       |             |                                       |
 * | Apical   | Present     | Yes   | K04.5       | Chronic apical periodontitis          |
 * | Apical   | Present     | No    | -           | Normal periapex                       |
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                 6. DEVELOPMENT DISORDER TABLE                                     ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * DEVELOPMENT DISORDER - COMPLETE ATTRIBUTE TABLE (From Derec App)
 * 
 * | Category             | Attribute 1 | Value | ICD-10 Code | ICD-10 Description                 |
 * |----------------------|-------------|-------|-------------|------------------------------------|
 * | Development Disorder |             |       |             |                                    |
 * | Development Disorder | Present     | Yes   | K00.9       | Disorder tooth development unspec  |
 * | Development Disorder | Present     | No    | -           | Normal development                 |
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                    7. FILLING TABLE                                               ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * FILLING - COMPLETE ATTRIBUTE TABLE (From Derec App)
 * 
 * | Category | Attribute 1 | Attribute 2 | Attribute 3 | Value             | ICD-10 Code | ICD-10 Description   |
 * |----------|-------------|-------------|-------------|-------------------|-------------|----------------------|
 * | Filling  |             |             |             |                   |             |                      |
 * | Filling  | Aspects     |             |             | Mesial            | -           | Surface selection    |
 * | Filling  | Aspects     |             |             | Distal            | -           | Surface selection    |
 * | Filling  | Aspects     |             |             | Occlusal          | -           | Surface selection    |
 * | Filling  | Aspects     |             |             | Buccal            | -           | Surface selection    |
 * | Filling  | Aspects     |             |             | Lingual           | -           | Surface selection    |
 * | Filling  | Aspects     |             |             | Palatal           | -           | Surface selection    |
 * | Filling  | Aspects     |             |             | Cervical Buccal   | -           | Surface selection    |
 * | Filling  | Aspects     |             |             | Cervical Lingual  | -           | Surface selection    |
 * | Filling  | Aspects     |             |             | Buccal Cusp       | -           | Surface selection    |
 * | Filling  | Aspects     |             |             | Lingual Cusp      | -           | Surface selection    |
 * | Filling  | Aspects     |             |             | Buccal Surface    | -           | Surface selection    |
 * | Filling  | Aspects     |             |             | Lingual Surface   | -           | Surface selection    |
 * | Filling  | Material    |             |             | Composite         | -           | Treatment material   |
 * | Filling  | Material    |             |             | Ceramic           | -           | Treatment material   |
 * | Filling  | Material    |             |             | Amalgam           | -           | Treatment material   |
 * | Filling  | Material    |             |             | Gold              | -           | Treatment material   |
 * | Filling  | Material    |             |             | Non-Precious Metal| -           | Treatment material   |
 * | Filling  | Material    |             |             | Temporary         | -           | Treatment material   |
 * | Filling  | Material    | Quality     |             | Sufficient        | -           | Meeting standards    |
 * | Filling  | Material    | Quality     |             | Uncertain         | -           | Needs monitoring     |
 * | Filling  | Material    | Quality     |             | Insufficient      | K08.53      | Fractured rest matrl |
 * | Filling  | Material    | Quality     | Detail      | Overhang          | -           | Excess material      |
 * | Filling  | Material    | Quality     | Detail      | Flush             | -           | Ideal adaptation     |
 * | Filling  | Material    | Quality     | Detail      | Shortfall         | -           | Deficient margin     |
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                    8. INLAY TABLE                                                 ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * INLAY - COMPLETE ATTRIBUTE TABLE (From Derec App)
 * 
 * | Category | Attribute 1 | Attribute 2 | Attribute 3 | Value             | ICD-10 Code | ICD-10 Description   |
 * |----------|-------------|-------------|-------------|-------------------|-------------|----------------------|
 * | Inlay    |             |             |             |                   |             |                      |
 * | Inlay    | Aspects     |             |             | Mesial            | -           | Surface selection    |
 * | Inlay    | Aspects     |             |             | Distal            | -           | Surface selection    |
 * | Inlay    | Aspects     |             |             | Occlusal          | -           | Surface selection    |
 * | Inlay    | Material    |             |             | Composite         | -           | Treatment material   |
 * | Inlay    | Material    |             |             | Ceramic           | -           | Treatment material   |
 * | Inlay    | Material    |             |             | Gold              | -           | Treatment material   |
 * | Inlay    | Material    |             |             | Non-Precious Metal| -           | Treatment material   |
 * | Inlay    | Material    | Quality     |             | Sufficient        | -           | Meeting standards    |
 * | Inlay    | Material    | Quality     |             | Uncertain         | -           | Needs monitoring     |
 * | Inlay    | Material    | Quality     |             | Insufficient      | K08.53      | Fractured rest matrl |
 * | Inlay    | Material    | Quality     | Detail      | Flush             | -           | Ideal adaptation     |
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                    9. ONLAY TABLE                                                 ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * ONLAY - COMPLETE ATTRIBUTE TABLE (From Derec App)
 * 
 * | Category | Attribute 1 | Value             | ICD-10 Code | ICD-10 Description   |
 * |----------|-------------|-------------------|-------------|----------------------|
 * | Onlay    |             |                   |             |                      |
 * | Onlay    | Aspects     | Mesial            | -           | Surface selection    |
 * | Onlay    | Aspects     | Distal            | -           | Surface selection    |
 * | Onlay    | Aspects     | Buccal            | -           | Surface selection    |
 * | Onlay    | Aspects     | Lingual           | -           | Surface selection    |
 * | Onlay    | Material    | Composite         | -           | Treatment material   |
 * | Onlay    | Material    | Ceramic           | -           | Treatment material   |
 * | Onlay    | Material    | Gold              | -           | Treatment material   |
 * | Onlay    | Material    | Non-Precious Metal| -           | Treatment material   |
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                    10. VENEER TABLE                                               ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * VENEER - COMPLETE ATTRIBUTE TABLE (From Derec App)
 * 
 * | Category | Attribute 1 | Attribute 2 | Value             | ICD-10 Code | ICD-10 Description   |
 * |----------|-------------|-------------|-------------------|-------------|----------------------|
 * | Veneer   |             |             |                   |             |                      |
 * | Veneer   | Aspects     |             | Buccal            | -           | Surface selection    |
 * | Veneer   | Aspects     |             | Lingual           | -           | Surface selection    |
 * | Veneer   | Material    |             | Composite         | -           | Treatment material   |
 * | Veneer   | Material    |             | Ceramic           | -           | Treatment material   |
 * | Veneer   | Material    | Quality     | Sufficient        | -           | Meeting standards    |
 * | Veneer   | Material    | Quality     | Uncertain         | -           | Needs monitoring     |
 * | Veneer   | Material    | Quality     | Insufficient      | K08.53      | Fractured rest matrl |
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                    11. PARTIAL CROWN TABLE                                        ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * PARTIAL CROWN - COMPLETE ATTRIBUTE TABLE (From Derec App)
 * 
 * | Category      | Attribute 1 | Attribute 2 | Value             | ICD-10 Code | ICD-10 Description   |
 * |---------------|-------------|-------------|-------------------|-------------|----------------------|
 * | Partial Crown |             |             |                   |             |                      |
 * | Partial Crown | Aspects     |             | Buccal            | -           | Surface selection    |
 * | Partial Crown | Aspects     |             | Lingual           | -           | Surface selection    |
 * | Partial Crown | Material    |             | Composite         | -           | Treatment material   |
 * | Partial Crown | Material    |             | Ceramic           | -           | Treatment material   |
 * | Partial Crown | Material    |             | Gold              | -           | Treatment material   |
 * | Partial Crown | Material    |             | Non-Precious Metal| -           | Treatment material   |
 * | Partial Crown | Material    | Quality     | Sufficient        | -           | Meeting standards    |
 * | Partial Crown | Material    | Quality     | Uncertain         | -           | Needs monitoring     |
 * | Partial Crown | Material    | Quality     | Insufficient      | K08.53      | Fractured rest matrl |
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                    12. CROWN TABLE                                                ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * CROWN - COMPLETE ATTRIBUTE TABLE (From Derec App)
 * 
 * | Category | Attribute 1 | Attribute 2 | Attribute 3  | Value             | ICD-10 Code | ICD-10 Description   |
 * |----------|-------------|-------------|--------------|-------------------|-------------|----------------------|
 * | Crown    |             |             |              |                   |             |                      |
 * | Crown    | Material    |             |              | Composite         | -           | Treatment material   |
 * | Crown    | Material    |             |              | Ceramic           | -           | Treatment material   |
 * | Crown    | Material    |             |              | Gold              | -           | Treatment material   |
 * | Crown    | Material    |             |              | Non-Precious Metal| -           | Treatment material   |
 * | Crown    | Crown Type  |             |              | Single Crown      | -           | Single tooth resto   |
 * | Crown    | Crown Type  |             |              | Abutment          | K08.1       | Bridge support       |
 * | Crown    | Crown Type  |             |              | Pontic            | K08.4       | Replaces missing     |
 * | Crown    | Crown Type  | Crown Base  |              | Natural           | -           | On natural tooth     |
 * | Crown    | Crown Type  | Crown Base  |              | Implant           | Z96.5       | On dental implant    |
 * | Crown    | Crown Type  | Crown Base  | Implant Type | Bone level        | Z96.5       | Platform at bone     |
 * | Crown    | Crown Type  | Crown Base  | Implant Type | Tissue level      | Z96.5       | Platform at tissue   |
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                    13. MISSING TABLE                                              ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * MISSING - COMPLETE ATTRIBUTE TABLE (From Derec App)
 * 
 * | Category | Attribute 1 | Value | ICD-10 Code | ICD-10 Description                    |
 * |----------|-------------|-------|-------------|---------------------------------------|
 * | Missing  |             |       |             |                                       |
 * | Missing  | Status      | Yes   | K08.40x     | Partial loss of teeth                 |
 * | Missing  | Status      | No    | -           | Tooth present                         |
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                 14. TO BE EXTRACTED TABLE                                         ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * TO BE EXTRACTED - COMPLETE ATTRIBUTE TABLE (From Derec App)
 * 
 * | Category        | Attribute 1 | Value | ICD-10 Code | ICD-10 Description                 |
 * |-----------------|-------------|-------|-------------|------------------------------------|
 * | To Be Extracted |             |       |             |                                    |
 * | To Be Extracted | Status      | Yes   | -           | Extraction planned                 |
 * | To Be Extracted | Status      | No    | -           | No extraction planned              |
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                    15. ENDODONTIC TABLES                                          ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * ENDODONTIC - COLD TEST TABLE (From Derec App)
 * 
 * | Category   | Attribute 1 | Attribute 2     | Value                    | ICD-10 Code | ICD-10 Description         |
 * |------------|-------------|-----------------|--------------------------|-------------|----------------------------|
 * | Endodontic |             |                 |                          |             |                            |
 * | Endodontic | Cold Test   |                 | Positive                 | -           | Response present           |
 * | Endodontic | Cold Test   |                 | Uncertain                | -           | Inconclusive               |
 * | Endodontic | Cold Test   |                 | Negative                 | K04.1       | Necrosis of pulp           |
 * | Endodontic | Cold Test   |                 | Not Applicable           | -           | Previous treatment         |
 * | Endodontic | Cold Test   | Positive Detail | Within Limits            | -           | Normal pulp                |
 * | Endodontic | Cold Test   | Positive Detail | Unpleasant               | -           | Sensitive pulp             |
 * | Endodontic | Cold Test   | Positive Detail | Pain Stimulus            | K04.01      | Reversible pulpitis        |
 * | Endodontic | Cold Test   | Positive Detail | Pain Lingering           | K04.02      | Irreversible pulpitis      |
 * | Endodontic | Cold Test   | N/A Reason      | Existing RCT             | M27.51      | Previously treated         |
 * | Endodontic | Cold Test   | N/A Reason      | Previously Initiated     | -           | Ongoing treatment          |
 * 
 * 
 * ENDODONTIC - PERCUSSION TEST TABLE (From Derec App)
 * 
 * | Category   | Attribute 1     | Value       | ICD-10 Code | ICD-10 Description         |
 * |------------|-----------------|-------------|-------------|----------------------------|
 * | Endodontic | Percussion Test | Not Painful | -           | Normal apical tissues      |
 * | Endodontic | Percussion Test | Unpleasant  | K04.4       | Symptomatic apical perio   |
 * | Endodontic | Percussion Test | Painful     | K04.4       | Symptomatic apical perio   |
 * 
 * 
 * ENDODONTIC - PALPATION TEST TABLE (From Derec App)
 * 
 * | Category   | Attribute 1    | Value       | ICD-10 Code | ICD-10 Description         |
 * |------------|----------------|-------------|-------------|----------------------------|
 * | Endodontic | Palpation Test | Not Painful | -           | Normal apical tissues      |
 * | Endodontic | Palpation Test | Unpleasant  | K04.4       | Symptomatic apical perio   |
 * | Endodontic | Palpation Test | Painful     | K04.7       | Periapical abscess         |
 * 
 * 
 * ENDODONTIC - HEAT TEST TABLE (From Derec App)
 * 
 * | Category   | Attribute 1 | Attribute 2     | Value                    | ICD-10 Code | ICD-10 Description         |
 * |------------|-------------|-----------------|--------------------------|-------------|----------------------------|
 * | Endodontic | Heat Test   |                 | Positive                 | -           | Response present           |
 * | Endodontic | Heat Test   |                 | Uncertain                | -           | Inconclusive               |
 * | Endodontic | Heat Test   |                 | Negative                 | K04.1       | Necrosis of pulp           |
 * | Endodontic | Heat Test   |                 | Not Applicable           | -           | Previous treatment         |
 * | Endodontic | Heat Test   | Positive Detail | Within Limits            | -           | Normal pulp                |
 * | Endodontic | Heat Test   | Positive Detail | Unpleasant               | -           | Sensitive pulp             |
 * | Endodontic | Heat Test   | Positive Detail | Pain Stimulus            | K04.01      | Reversible pulpitis        |
 * | Endodontic | Heat Test   | Positive Detail | Pain Lingering           | K04.02      | Irreversible pulpitis      |
 * 
 * 
 * ENDODONTIC - ELECTRICITY TEST TABLE (From Derec App)
 * 
 * | Category   | Attribute 1      | Value | ICD-10 Code | ICD-10 Description         |
 * |------------|------------------|-------|-------------|----------------------------|
 * | Endodontic | Electricity Test | 1     | K04.02      | Irreversible pulpitis      |
 * | Endodontic | Electricity Test | 2     | K04.02      | Irreversible pulpitis      |
 * | Endodontic | Electricity Test | 3     | K04.02      | Irreversible pulpitis      |
 * | Endodontic | Electricity Test | 4     | -           | Normal pulp                |
 * | Endodontic | Electricity Test | 5     | -           | Normal pulp                |
 * | Endodontic | Electricity Test | 6     | -           | Normal pulp                |
 * | Endodontic | Electricity Test | 7     | K04.01      | Reversible pulpitis        |
 * | Endodontic | Electricity Test | 8     | K04.01      | Reversible pulpitis        |
 * | Endodontic | Electricity Test | 9     | K04.01      | Reversible pulpitis        |
 * | Endodontic | Electricity Test | 10    | K04.1       | Necrosis of pulp           |
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                        ENDODONTIC - COMBINED TEST RESULTS → DIAGNOSIS                             ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * ENDODONTIC - COMPLETE COMBINED TEST RESULTS TABLE
 * 
 * COLD TEST + PERCUSSION TEST + PALPATION TEST → DIAGNOSIS
 * 
 * | Cold Test | Cold Detail    | Percussion  | Palpation   | ICD-10 Code  | Final Diagnosis                                       |
 * |-----------|----------------|-------------|-------------|--------------|-------------------------------------------------------|
 * | Positive  | Within Limits  | Not Painful | Not Painful | -            | Normal pulp                                           |
 * | Positive  | Within Limits  | Not Painful | Unpleasant  | K04.4        | Normal pulp + early apical inflammation               |
 * | Positive  | Within Limits  | Not Painful | Painful     | K04.7        | Normal pulp + periapical abscess                      |
 * | Positive  | Within Limits  | Unpleasant  | Not Painful | K04.4        | Normal pulp + symptomatic apical periodontitis        |
 * | Positive  | Within Limits  | Unpleasant  | Unpleasant  | K04.4        | Normal pulp + symptomatic apical periodontitis        |
 * | Positive  | Within Limits  | Unpleasant  | Painful     | K04.4+K04.7  | Normal pulp + abscess                                 |
 * | Positive  | Within Limits  | Painful     | Not Painful | K04.4        | Normal pulp + symptomatic apical periodontitis        |
 * | Positive  | Within Limits  | Painful     | Unpleasant  | K04.4        | Normal pulp + symptomatic apical periodontitis        |
 * | Positive  | Within Limits  | Painful     | Painful     | K04.4+K04.7  | Normal pulp + periapical abscess                      |
 * |-----------|----------------|-------------|-------------|--------------|-------------------------------------------------------|
 * | Positive  | Unpleasant     | Not Painful | Not Painful | -            | Sensitive pulp                                        |
 * | Positive  | Unpleasant     | Not Painful | Unpleasant  | K04.4        | Sensitive pulp + early apical inflammation            |
 * | Positive  | Unpleasant     | Not Painful | Painful     | K04.7        | Sensitive pulp + periapical abscess                   |
 * | Positive  | Unpleasant     | Unpleasant  | Not Painful | K04.4        | Sensitive pulp + symptomatic apical periodontitis     |
 * | Positive  | Unpleasant     | Unpleasant  | Unpleasant  | K04.4        | Sensitive pulp + symptomatic apical periodontitis     |
 * | Positive  | Unpleasant     | Unpleasant  | Painful     | K04.4+K04.7  | Sensitive pulp + abscess                              |
 * | Positive  | Unpleasant     | Painful     | Not Painful | K04.4        | Sensitive pulp + symptomatic apical periodontitis     |
 * | Positive  | Unpleasant     | Painful     | Unpleasant  | K04.4        | Sensitive pulp + symptomatic apical periodontitis     |
 * | Positive  | Unpleasant     | Painful     | Painful     | K04.4+K04.7  | Sensitive pulp + periapical abscess                   |
 * |-----------|----------------|-------------|-------------|--------------|-------------------------------------------------------|
 * | Positive  | Pain Stimulus  | Not Painful | Not Painful | K04.01       | Reversible pulpitis                                   |
 * | Positive  | Pain Stimulus  | Not Painful | Unpleasant  | K04.01+K04.4 | Reversible pulpitis + early apical inflammation       |
 * | Positive  | Pain Stimulus  | Not Painful | Painful     | K04.01+K04.7 | Reversible pulpitis + periapical abscess              |
 * | Positive  | Pain Stimulus  | Unpleasant  | Not Painful | K04.01+K04.4 | Reversible pulpitis + symptomatic apical periodontitis|
 * | Positive  | Pain Stimulus  | Unpleasant  | Unpleasant  | K04.01+K04.4 | Reversible pulpitis + symptomatic apical periodontitis|
 * | Positive  | Pain Stimulus  | Unpleasant  | Painful     | K04.01+K04.7 | Reversible pulpitis + abscess                         |
 * | Positive  | Pain Stimulus  | Painful     | Not Painful | K04.01+K04.4 | Reversible pulpitis + symptomatic apical periodontitis|
 * | Positive  | Pain Stimulus  | Painful     | Unpleasant  | K04.01+K04.4 | Reversible pulpitis + symptomatic apical periodontitis|
 * | Positive  | Pain Stimulus  | Painful     | Painful     | K04.01+K04.7 | Reversible pulpitis + periapical abscess              |
 * |-----------|----------------|-------------|-------------|--------------|-------------------------------------------------------|
 * | Positive  | Pain Lingering | Not Painful | Not Painful | K04.02       | Irreversible pulpitis                                 |
 * | Positive  | Pain Lingering | Not Painful | Unpleasant  | K04.02+K04.4 | Irreversible pulpitis + early apical inflammation     |
 * | Positive  | Pain Lingering | Not Painful | Painful     | K04.02+K04.7 | Irreversible pulpitis + periapical abscess            |
 * | Positive  | Pain Lingering | Unpleasant  | Not Painful | K04.02+K04.4 | Irreversible pulpitis + symptomatic apical perio      |
 * | Positive  | Pain Lingering | Unpleasant  | Unpleasant  | K04.02+K04.4 | Irreversible pulpitis + symptomatic apical perio      |
 * | Positive  | Pain Lingering | Unpleasant  | Painful     | K04.02+K04.7 | Irreversible pulpitis + abscess                       |
 * | Positive  | Pain Lingering | Painful     | Not Painful | K04.02+K04.4 | Irreversible pulpitis + symptomatic apical perio      |
 * | Positive  | Pain Lingering | Painful     | Unpleasant  | K04.02+K04.4 | Irreversible pulpitis + symptomatic apical perio      |
 * | Positive  | Pain Lingering | Painful     | Painful     | K04.02+K04.7 | Irreversible pulpitis + periapical abscess            |
 * |-----------|----------------|-------------|-------------|--------------|-------------------------------------------------------|
 * | Uncertain | -              | Not Painful | Not Painful | -            | Inconclusive - retest needed                          |
 * | Uncertain | -              | Not Painful | Unpleasant  | K04.4        | Inconclusive + early apical inflammation              |
 * | Uncertain | -              | Not Painful | Painful     | K04.7        | Inconclusive + periapical abscess                     |
 * | Uncertain | -              | Unpleasant  | Not Painful | K04.4        | Inconclusive + symptomatic apical periodontitis       |
 * | Uncertain | -              | Unpleasant  | Unpleasant  | K04.4        | Inconclusive + symptomatic apical periodontitis       |
 * | Uncertain | -              | Unpleasant  | Painful     | K04.4+K04.7  | Inconclusive + abscess                                |
 * | Uncertain | -              | Painful     | Not Painful | K04.4        | Inconclusive + symptomatic apical periodontitis       |
 * | Uncertain | -              | Painful     | Unpleasant  | K04.4        | Inconclusive + symptomatic apical periodontitis       |
 * | Uncertain | -              | Painful     | Painful     | K04.4+K04.7  | Inconclusive + periapical abscess                     |
 * |-----------|----------------|-------------|-------------|--------------|-------------------------------------------------------|
 * | Negative  | -              | Not Painful | Not Painful | K04.1        | Necrosis of pulp                                      |
 * | Negative  | -              | Not Painful | Unpleasant  | K04.1+K04.4  | Necrosis + early apical inflammation                  |
 * | Negative  | -              | Not Painful | Painful     | K04.1+K04.7  | Necrosis + periapical abscess                         |
 * | Negative  | -              | Unpleasant  | Not Painful | K04.1+K04.4  | Necrosis + symptomatic apical periodontitis           |
 * | Negative  | -              | Unpleasant  | Unpleasant  | K04.1+K04.4  | Necrosis + symptomatic apical periodontitis           |
 * | Negative  | -              | Unpleasant  | Painful     | K04.1+K04.7  | Necrosis + abscess                                    |
 * | Negative  | -              | Painful     | Not Painful | K04.1+K04.5  | Necrosis + chronic apical periodontitis               |
 * | Negative  | -              | Painful     | Unpleasant  | K04.1+K04.4  | Necrosis + symptomatic apical periodontitis           |
 * | Negative  | -              | Painful     | Painful     | K04.1+K04.7  | Necrosis + acute apical abscess                       |
 * |-----------|----------------|-------------|-------------|--------------|-------------------------------------------------------|
 * | N/A       | Existing RCT   | Not Painful | Not Painful | Z98.810      | Previously treated - normal                           |
 * | N/A       | Existing RCT   | Not Painful | Unpleasant  | M27.51+K04.4 | Failed RCT + early inflammation                       |
 * | N/A       | Existing RCT   | Not Painful | Painful     | M27.51+K04.7 | Failed RCT + periapical abscess                       |
 * | N/A       | Existing RCT   | Unpleasant  | Not Painful | M27.51+K04.4 | Failed RCT + symptomatic apical periodontitis         |
 * | N/A       | Existing RCT   | Unpleasant  | Unpleasant  | M27.51+K04.4 | Failed RCT + symptomatic apical periodontitis         |
 * | N/A       | Existing RCT   | Unpleasant  | Painful     | M27.51+K04.7 | Failed RCT + abscess                                  |
 * | N/A       | Existing RCT   | Painful     | Not Painful | M27.51+K04.4 | Failed RCT + symptomatic apical periodontitis         |
 * | N/A       | Existing RCT   | Painful     | Unpleasant  | M27.51+K04.4 | Failed RCT + symptomatic apical periodontitis         |
 * | N/A       | Existing RCT   | Painful     | Painful     | M27.51+K04.7 | Failed RCT + periapical abscess                       |
 * |-----------|----------------|-------------|-------------|--------------|-------------------------------------------------------|
 * | N/A       | Prev Initiated | Not Painful | Not Painful | -            | Treatment in progress - normal                        |
 * | N/A       | Prev Initiated | Not Painful | Unpleasant  | K04.4        | Treatment in progress + early inflammation            |
 * | N/A       | Prev Initiated | Not Painful | Painful     | K04.7        | Treatment in progress + periapical abscess            |
 * | N/A       | Prev Initiated | Unpleasant  | Not Painful | K04.4        | Treatment in progress + symptomatic apical perio      |
 * | N/A       | Prev Initiated | Unpleasant  | Unpleasant  | K04.4        | Treatment in progress + symptomatic apical perio      |
 * | N/A       | Prev Initiated | Unpleasant  | Painful     | K04.7        | Treatment in progress + abscess                       |
 * | N/A       | Prev Initiated | Painful     | Not Painful | K04.4        | Treatment in progress + symptomatic apical perio      |
 * | N/A       | Prev Initiated | Painful     | Unpleasant  | K04.4        | Treatment in progress + symptomatic apical perio      |
 * | N/A       | Prev Initiated | Painful     | Painful     | K04.7        | Treatment in progress + periapical abscess            |
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                    16. PERIODONTAL TABLES                                         ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * PERIODONTAL - SITE SELECTION TABLE (From Derec App)
 * 
 * | Category    | Attribute 1 | Value         | ICD-10 Code | ICD-10 Description                 |
 * |-------------|-------------|---------------|-------------|------------------------------------|
 * | Periodontal |             |               |             |                                    |
 * | Periodontal | Site        | Disto Palatal | -           | Site selection                     |
 * | Periodontal | Site        | Palatal       | -           | Site selection                     |
 * | Periodontal | Site        | Mesio Palatal | -           | Site selection                     |
 * | Periodontal | Site        | Disto Buccal  | -           | Site selection                     |
 * | Periodontal | Site        | Buccal        | -           | Site selection                     |
 * | Periodontal | Site        | Mesio Buccal  | -           | Site selection                     |
 * 
 * 
 * PERIODONTAL - PROBING DEPTH TABLE (From Derec App)
 * 
 * | Category    | Attribute 1   | Value | ICD-10 Code | ICD-10 Description                 |
 * |-------------|---------------|-------|-------------|------------------------------------|
 * | Periodontal | Probing Depth | 0     | -           | Healthy                            |
 * | Periodontal | Probing Depth | 1     | -           | Healthy                            |
 * | Periodontal | Probing Depth | 2     | -           | Healthy                            |
 * | Periodontal | Probing Depth | 3     | K05.x0      | Healthy or Gingivitis              |
 * | Periodontal | Probing Depth | 4     | K05.x11     | Slight periodontitis               |
 * | Periodontal | Probing Depth | 5     | K05.x12     | Moderate periodontitis             |
 * | Periodontal | Probing Depth | 6     | K05.x12     | Moderate periodontitis             |
 * | Periodontal | Probing Depth | 7     | K05.x13     | Severe periodontitis               |
 * | Periodontal | Probing Depth | 8     | K05.x13     | Severe periodontitis               |
 * | Periodontal | Probing Depth | 9     | K05.x13     | Severe periodontitis               |
 * | Periodontal | Probing Depth | 10    | K05.x13     | Severe periodontitis               |
 * | Periodontal | Probing Depth | 11    | K05.x13     | Severe periodontitis               |
 * | Periodontal | Probing Depth | 12    | K05.x13     | Severe periodontitis               |
 * | Periodontal | Probing Depth | >12   | K05.x13     | Severe periodontitis               |
 * 
 * 
 * PERIODONTAL - GINGIVAL MARGIN TABLE (From Derec App)
 * 
 * | Category    | Attribute 1     | Value | ICD-10 Code | ICD-10 Description                 |
 * |-------------|-----------------|-------|-------------|------------------------------------|
 * | Periodontal | Gingival Margin | 0     | -           | Normal position                    |
 * | Periodontal | Gingival Margin | -1    | K06.011     | Minimal recession                  |
 * | Periodontal | Gingival Margin | -2    | K06.011     | Minimal recession                  |
 * | Periodontal | Gingival Margin | -3    | K06.012     | Moderate recession                 |
 * | Periodontal | Gingival Margin | -4    | K06.012     | Moderate recession                 |
 * | Periodontal | Gingival Margin | -5    | K06.013     | Severe recession                   |
 * | Periodontal | Gingival Margin | -6    | K06.013     | Severe recession                   |
 * | Periodontal | Gingival Margin | -7    | K06.013     | Severe recession                   |
 * | Periodontal | Gingival Margin | -8    | K06.013     | Severe recession                   |
 * | Periodontal | Gingival Margin | -9    | K06.013     | Severe recession                   |
 * | Periodontal | Gingival Margin | -10   | K06.013     | Severe recession                   |
 * | Periodontal | Gingival Margin | -11   | K06.013     | Severe recession                   |
 * | Periodontal | Gingival Margin | -12   | K06.013     | Severe recession                   |
 * | Periodontal | Gingival Margin | <-12  | K06.013     | Severe recession                   |
 * | Periodontal | Gingival Margin | +1    | K06.1       | Gingival enlargement               |
 * | Periodontal | Gingival Margin | +2    | K06.1       | Gingival enlargement               |
 * | Periodontal | Gingival Margin | +3    | K06.1       | Gingival enlargement               |
 * | Periodontal | Gingival Margin | +4    | K06.1       | Gingival enlargement               |
 * | Periodontal | Gingival Margin | +5    | K06.1       | Gingival enlargement               |
 * | Periodontal | Gingival Margin | +6    | K06.1       | Gingival enlargement               |
 * | Periodontal | Gingival Margin | +7    | K06.1       | Gingival enlargement               |
 * 
 * 
 * PERIODONTAL - ADDITIONAL INFORMATION TABLE (From Derec App)
 * 
 * | Category    | Attribute 1            | Value   | ICD-10 Code | ICD-10 Description                 |
 * |-------------|------------------------|---------|-------------|------------------------------------|
 * | Periodontal | Additional Information | Bleeding| K05.x       | Active inflammation                |
 * | Periodontal | Additional Information | Plaque  | K05.x0      | Plaque-induced                     |
 * | Periodontal | Additional Information | Pus     | K05.x13     | Severe with suppuration            |
 * | Periodontal | Additional Information | Tartar  | K03.6       | Deposits on teeth                  |
 * 
 * 
 * PERIODONTAL - TOOTH MOBILITY TABLE (From Derec App)
 * 
 * | Category    | Attribute 1    | Value   | ICD-10 Code | ICD-10 Description                 |
 * |-------------|----------------|---------|-------------|------------------------------------|
 * | Periodontal | Tooth Mobility | Class 1 | K05.x11     | Slight mobility                    |
 * | Periodontal | Tooth Mobility | Class 2 | K05.x12     | Moderate mobility                  |
 * | Periodontal | Tooth Mobility | Class 3 | K05.x13     | Severe mobility                    |
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                     PERIODONTAL - QUICK REFERENCE COMBINED LOGIC TABLE                            ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * PERIODONTAL - QUICK REFERENCE: UI INPUTS → DIAGNOSIS TABLE (From perio.csv)
 * 
 * | Probing Depth | Gingival Margin | CAL  | BOP | Plaque | Age  | % Teeth | ICD-10 Code | Final Diagnosis                  |
 * |---------------|-----------------|------|-----|--------|------|---------|-------------|----------------------------------|
 * | 0-3           | 0               | 0-3  | No  | Any    | Any  | Any     | -           | Healthy                          |
 * | 0-3           | 0               | 0-3  | Yes | Yes    | Any  | Any     | K05.10      | Chronic plaque gingivitis        |
 * | 0-3           | 0               | 0-3  | Yes | No     | Any  | Any     | K05.01      | Acute non-plaque gingivitis      |
 * | 0-3           | -1 to -2        | 1-2  | Any | Any    | Any  | <30%    | K06.011     | Localized recession minimal      |
 * | 0-3           | -3 to -4        | 3-4  | Any | Any    | Any  | <30%    | K06.012     | Localized recession moderate     |
 * | 0-3           | -5+             | ≥5   | Any | Any    | Any  | <30%    | K06.013     | Localized recession severe       |
 * | 4-5           | Any             | 1-2  | Any | Any    | <30  | <30%    | K05.211     | Localized aggressive slight      |
 * | 4-5           | Any             | 1-2  | Any | Any    | ≥30  | <30%    | K05.311     | Localized chronic slight         |
 * | 4-5           | Any             | 1-2  | Any | Any    | <30  | ≥30%    | K05.221     | Generalized aggressive slight    |
 * | 4-5           | Any             | 1-2  | Any | Any    | ≥30  | ≥30%    | K05.321     | Generalized chronic slight       |
 * | 5-6           | Any             | 3-4  | Any | Any    | <30  | <30%    | K05.212     | Localized aggressive moderate    |
 * | 5-6           | Any             | 3-4  | Any | Any    | ≥30  | <30%    | K05.312     | Localized chronic moderate       |
 * | 5-6           | Any             | 3-4  | Any | Any    | <30  | ≥30%    | K05.222     | Generalized aggressive moderate  |
 * | 5-6           | Any             | 3-4  | Any | Any    | ≥30  | ≥30%    | K05.322     | Generalized chronic moderate     |
 * | >6            | Any             | ≥5   | Any | Any    | <30  | <30%    | K05.213     | Localized aggressive severe      |
 * | >6            | Any             | ≥5   | Any | Any    | ≥30  | <30%    | K05.313     | Localized chronic severe         |
 * | >6            | Any             | ≥5   | Any | Any    | <30  | ≥30%    | K05.223     | Generalized aggressive severe    |
 * | >6            | Any             | ≥5   | Any | Any    | ≥30  | ≥30%    | K05.323     | Generalized chronic severe       |
 */

// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                               MASTER ICD-10 CODE LIST                                             ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝

/**
 * COMPLETE ICD-10 CODE LIST
 * 
 * | ICD-10 Code | ICD-10 Description                                   | Category      |
 * |-------------|------------------------------------------------------|---------------|
 * | K00.9       | Disorder of tooth development unspecified            | Development   |
 * | K02.0       | Caries limited to enamel                             | Decay         |
 * | K02.1       | Caries of dentine                                    | Decay         |
 * | K02.3       | Arrested dental caries                               | Decay         |
 * | K02.5       | Dental caries with pulp exposure                     | Decay         |
 * | K02.51      | Dental caries on pit and fissure surface             | Decay         |
 * | K02.52      | Dental caries on smooth surface                      | Decay         |
 * | K02.53      | Dental caries on root surface                        | Decay         |
 * | K02.61      | Pit/fissure caries limited to enamel                 | Decay         |
 * | K02.62      | Pit/fissure caries penetrating into dentin           | Decay         |
 * | K02.63      | Pit/fissure caries penetrating into pulp             | Decay         |
 * | K03.1       | Abrasion of teeth                                    | Tooth Wear    |
 * | K03.2       | Erosion of teeth                                     | Tooth Wear    |
 * | K03.6       | Deposits (accretions) on teeth                       | Periodontal   |
 * | K03.7       | Posteruptive color changes of dental hard tissues    | Discoloration |
 * | K03.81      | Cracked tooth                                        | Fracture      |
 * | K04.01      | Reversible pulpitis                                  | Endodontic    |
 * | K04.02      | Irreversible pulpitis                                | Endodontic    |
 * | K04.1       | Necrosis of pulp                                     | Endodontic    |
 * | K04.4       | Acute apical periodontitis of pulpal origin          | Endodontic    |
 * | K04.5       | Chronic apical periodontitis                         | Endodontic    |
 * | K04.7       | Periapical abscess without sinus                     | Endodontic    |
 * | K05.01      | Acute gingivitis non-plaque induced                  | Periodontal   |
 * | K05.10      | Chronic gingivitis plaque induced                    | Periodontal   |
 * | K05.211     | Aggressive periodontitis localized slight            | Periodontal   |
 * | K05.212     | Aggressive periodontitis localized moderate          | Periodontal   |
 * | K05.213     | Aggressive periodontitis localized severe            | Periodontal   |
 * | K05.221     | Aggressive periodontitis generalized slight          | Periodontal   |
 * | K05.222     | Aggressive periodontitis generalized moderate        | Periodontal   |
 * | K05.223     | Aggressive periodontitis generalized severe          | Periodontal   |
 * | K05.311     | Chronic periodontitis localized slight               | Periodontal   |
 * | K05.312     | Chronic periodontitis localized moderate             | Periodontal   |
 * | K05.313     | Chronic periodontitis localized severe               | Periodontal   |
 * | K05.321     | Chronic periodontitis generalized slight             | Periodontal   |
 * | K05.322     | Chronic periodontitis generalized moderate           | Periodontal   |
 * | K05.323     | Chronic periodontitis generalized severe             | Periodontal   |
 * | K06.011     | Gingival recession localized minimal                 | Periodontal   |
 * | K06.012     | Gingival recession localized moderate                | Periodontal   |
 * | K06.013     | Gingival recession localized severe                  | Periodontal   |
 * | K06.1       | Gingival enlargement                                 | Periodontal   |
 * | K08.1       | Complete loss of teeth due to trauma/extraction      | Restoration   |
 * | K08.4       | Partial loss of teeth                                | Restoration   |
 * | K08.40x     | Partial loss of teeth                                | Missing       |
 * | K08.53      | Fractured dental restorative material                | Restoration   |
 * | M27.51      | Perforation of root canal space                      | Endodontic    |
 * | S02.5xxA    | Fracture of tooth initial encounter                  | Fracture      |
 * | Z96.5       | Presence of tooth-root and mandibular implant        | Restoration   |
 * | Z98.810     | Dental restoration status                            | Endodontic    |
 */

export {};
