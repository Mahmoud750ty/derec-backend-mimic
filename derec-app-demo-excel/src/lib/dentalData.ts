import { useState, useEffect } from 'react';

// Types matching the API response
export interface AttributeEntry {
  category: string;
  subCategory: string;
  attribute1: string;
  attribute2: string;
  attribute3: string;
  value: string;
  icdCode: string;
  icdDescription: string;
}

export interface CariesDiagnosis {
  aspects: string;
  depth: string;
  cavitation: string;
  classification: string;
  icdCode: string;
  icdDescription: string;
}

export interface EndoDiagnosis {
  coldTest: string;
  coldTestDetail: string;
  percussionTest: string;
  palpation: string;
  icdCode: string;
  icdDescription: string;
}

export interface PerioDiagnosis {
  probingDepth: string;
  gingivalMargin: string;
  cal: string;
  bop: string;
  plaque: string;
  age: string;
  teethPercent: string;
  icdCode: string;
  icdDescription: string;
}

export interface ICD10Code {
  code: string;
  description: string;
  category?: string;
}

export interface PathologyType {
  id: string;
  name: string;
  aspects?: AspectOption[];
  options: OptionGroup[];
}

export interface RestorationType {
  id: string;
  name: string;
  aspects?: AspectOption[];
  options: OptionGroup[];
}

export interface EndodonticTest {
  id: string;
  name: string;
  primaryOptions: TestOption[];
  subOptions?: Record<string, TestOption[]>;
}

export interface PeriodontalConfig {
  sites: string[];
  probingDepthValues: string[];
  gingivalMarginValues: string[];
  additionalInfo: string[];
  mobilityClasses: string[];
}

export interface AspectOption {
  id: string;
  name: string;
  icdCode?: string;
  icdDescription?: string;
}

export interface OptionGroup {
  id: string;
  name: string;
  inputType: 'radio' | 'checkbox';
  options: TestOption[];
  showWhen?: {
    field: string;
    value: string;
  };
}

export interface TestOption {
  id: string;
  name: string;
  icdCode?: string;
  icdDescription?: string;
}

export interface DentalData {
  attributes: AttributeEntry[];
  cariesDiagnosis: CariesDiagnosis[];
  endoDiagnosis: EndoDiagnosis[];
  perioDiagnosis: PerioDiagnosis[];
  icd10Codes: ICD10Code[];
  pathologyTypes: PathologyType[];
  restorationTypes: RestorationType[];
  endodonticTests: EndodonticTest[];
  periodontalConfig: PeriodontalConfig;
}

// Cache for dental data
let dentalDataCache: DentalData | null = null;

export async function fetchDentalData(): Promise<DentalData> {
  if (dentalDataCache) {
    return dentalDataCache;
  }
  
  const response = await fetch('/api/dental-data');
  if (!response.ok) {
    throw new Error('Failed to fetch dental data');
  }
  
  const data: DentalData = await response.json();
  dentalDataCache = data;
  return data;
}

export function useDentalData() {
  const [data, setData] = useState<DentalData | null>(dentalDataCache);
  const [loading, setLoading] = useState(!dentalDataCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dentalDataCache) {
      fetchDentalData()
        .then(setData)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, []);

  return { data, loading, error };
}

// Helper function to get caries ICD-10 code based on selections
export function getCariesICD10(
  cariesDiagnosis: CariesDiagnosis[],
  aspect: string,
  depth: string,
  cavitation: string,
  classification: string
): { code: string; description: string } | null {
  // First try exact match
  let match = cariesDiagnosis.find(d => 
    d.aspects.toLowerCase() === aspect.toLowerCase() &&
    d.depth.toLowerCase() === depth.toLowerCase() &&
    d.cavitation.toLowerCase() === cavitation.toLowerCase() &&
    d.classification.toLowerCase() === classification.toLowerCase()
  );
  
  // If no exact match, try with 'any' aspect
  if (!match) {
    match = cariesDiagnosis.find(d => 
      d.aspects.toLowerCase() === 'any' &&
      d.depth.toLowerCase() === depth.toLowerCase() &&
      d.cavitation.toLowerCase() === cavitation.toLowerCase() &&
      d.classification.toLowerCase() === classification.toLowerCase()
    );
  }
  
  if (match && match.icdCode) {
    return { code: match.icdCode, description: match.icdDescription };
  }
  
  return null;
}

// Helper function to get endodontic ICD-10 code based on test results
export function getEndodonticICD10(
  endoDiagnosis: EndoDiagnosis[],
  coldTest: string,
  coldTestDetail: string,
  percussionTest: string,
  palpation: string
): { code: string; description: string } | null {
  const match = endoDiagnosis.find(d => {
    const coldMatch = d.coldTest.toLowerCase() === coldTest.toLowerCase();
    const detailMatch = !d.coldTestDetail || d.coldTestDetail.toLowerCase() === coldTestDetail.toLowerCase();
    const percussionMatch = d.percussionTest.toLowerCase() === percussionTest.toLowerCase() ||
                           d.percussionTest.toLowerCase() === 'any';
    const palpationMatch = d.palpation.toLowerCase() === palpation.toLowerCase() ||
                          d.palpation.toLowerCase() === 'any';
    
    return coldMatch && detailMatch && percussionMatch && palpationMatch;
  });
  
  if (match && match.icdCode) {
    return { code: match.icdCode, description: match.icdDescription };
  }
  
  return null;
}

// Helper function to get periodontal ICD-10 code based on measurements
export function getPeriodontalICD10(
  perioDiagnosis: PerioDiagnosis[],
  probingDepth: number,
  gingivalMargin: number,
  hasBleeding: boolean,
  hasPlaque: boolean,
  patientAge: number,
  teethAffectedPercent: number
): { code: string; description: string } | null {
  // Calculate CAL
  const cal = gingivalMargin < 0 
    ? probingDepth + Math.abs(gingivalMargin) 
    : Math.max(0, probingDepth - gingivalMargin);
  
  // Find matching diagnosis
  const match = perioDiagnosis.find(d => {
    // Check probing depth range
    const pdMatch = matchRange(probingDepth, d.probingDepth);
    
    // Check CAL range
    const calMatch = matchRange(cal, d.cal);
    
    // Check BOP
    const bopMatch = d.bop === 'Any' || 
                    (d.bop === 'Yes' && hasBleeding) || 
                    (d.bop === 'No' && !hasBleeding);
    
    // Check plaque
    const plaqueMatch = d.plaque === 'Any' || 
                       (d.plaque === 'Yes' && hasPlaque) || 
                       (d.plaque === 'No' && !hasPlaque);
    
    // Check age
    const ageMatch = d.age === 'Any' ||
                    (d.age === '<30' && patientAge < 30) ||
                    (d.age === '≥30' && patientAge >= 30);
    
    // Check teeth affected percentage
    const teethMatch = d.teethPercent === 'Any' ||
                      (d.teethPercent === '<30%' && teethAffectedPercent < 30) ||
                      (d.teethPercent === '≥30%' && teethAffectedPercent >= 30);
    
    return pdMatch && calMatch && bopMatch && plaqueMatch && ageMatch && teethMatch;
  });
  
  if (match && match.icdCode) {
    return { code: match.icdCode, description: match.icdDescription };
  }
  
  return null;
}

function matchRange(value: number, rangeStr: string): boolean {
  if (!rangeStr || rangeStr === 'Any') return true;
  
  // Handle exact numeric match first (e.g., "0", "3", etc.)
  const exactNum = Number(rangeStr);
  if (!isNaN(exactNum) && !rangeStr.includes('-') && !rangeStr.includes('+') && !rangeStr.includes('>') && !rangeStr.includes('<') && !rangeStr.includes('≥') && !rangeStr.includes('to')) {
    return value === exactNum;
  }
  
  // Handle specific ranges like "0-3", "4-5", "5-6"
  // But be careful with negative numbers like "-1", we need to differentiate from ranges
  if (rangeStr.includes('-')) {
    // Check if it's a negative number starting with minus or a range
    // A range would look like "0-3" or "1-4", while a negative number looks like "-1", "-2"
    const parts = rangeStr.split('-').filter(p => p !== '');
    
    // If we have exactly one part after filtering empty strings AND the string starts with '-'
    // then it's a negative number, not a range
    if (parts.length === 1 && rangeStr.startsWith('-')) {
      const negNum = Number(rangeStr);
      return !isNaN(negNum) && value === negNum;
    }
    
    // Otherwise it's a range like "0-3" or "-1--2" (negative to negative)
    // For "0-3": parts would be ["0", "3"]
    // For "-1 to -2": this would be handled by the ' to ' case below
    if (parts.length >= 2) {
      // Handle "0-3" style ranges
      if (!rangeStr.startsWith('-')) {
        const [min, max] = rangeStr.split('-').map(Number);
        return value >= min && value <= max;
      }
      // Handle ranges starting with negative, like "-5-0" meaning -5 to 0
      // This is tricky - we'll parse it as the first number being negative
    }
  }
  
  if (rangeStr.startsWith('>')) {
    const threshold = Number(rangeStr.substring(1));
    return value > threshold;
  }
  
  if (rangeStr.startsWith('≥')) {
    const threshold = Number(rangeStr.substring(1));
    return value >= threshold;
  }
  
  if (rangeStr.startsWith('<')) {
    const threshold = Number(rangeStr.substring(1));
    return value < threshold;
  }
  
  // Handle ranges like "-1 to -2", "-3 to -4", "-5+"
  if (rangeStr.includes(' to ')) {
    const [minStr, maxStr] = rangeStr.split(' to ');
    const min = Number(minStr);
    const max = Number(maxStr);
    // For negative ranges like "-1 to -2", min would be -1 and max would be -2
    // We need to swap if min > max for negative ranges
    const actualMin = Math.min(min, max);
    const actualMax = Math.max(min, max);
    return value >= actualMin && value <= actualMax;
  }
  
  if (rangeStr.endsWith('+')) {
    const threshold = Number(rangeStr.slice(0, -1));
    return value >= threshold;
  }
  
  return false;
}

// Surface areas mapping (same as before but can be used with new data)
export const SURFACE_AREAS = {
  1: { id: 'cervical-buccal', label: 'Cervical Buccal', icdCode: 'K02.53' },
  2: { id: 'buccal', label: 'Buccal', icdCode: 'K02.52' },
  3: { id: 'mesial', label: 'Mesial', icdCode: 'K02.52' },
  4: { id: 'incisal', label: 'Incisal/Occlusal', icdCode: 'K02.51' },
  5: { id: 'distal', label: 'Distal', icdCode: 'K02.52' },
  6: { id: 'palatal', label: 'Palatal/Lingual', icdCode: 'K02.52' },
  7: { id: 'cervical-palatal', label: 'Cervical Palatal', icdCode: 'K02.53' },
  8: { id: 'class4-mesial', label: 'Class 4 Mesial', icdCode: 'K02.52' },
  9: { id: 'class4-distal', label: 'Class 4 Distal', icdCode: 'K02.52' },
  10: { id: 'buccal-surface', label: 'Buccal Surface', icdCode: 'K02.52' },
  11: { id: 'palatal-surface', label: 'Palatal Surface', icdCode: 'K02.52' },
};

