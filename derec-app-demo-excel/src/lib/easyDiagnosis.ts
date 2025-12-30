// Easy Diagnosis Data Types and Utilities

export interface DiagnosisCondition {
  level: 'Tooth' | 'Oral Cavity';
  category: string;
  condition: string;
  icdCode: string;
  description: string;
}

export interface EasyDiagnosisData {
  toothLevel: {
    categories: string[];
    conditions: { [category: string]: DiagnosisCondition[] };
  };
  oralCavityLevel: {
    categories: string[];
    conditions: { [category: string]: DiagnosisCondition[] };
  };
}

// Cache for the fetched data
let cachedData: EasyDiagnosisData | null = null;
let fetchPromise: Promise<EasyDiagnosisData> | null = null;

// Fetch Easy Diagnosis data from the API
export async function fetchEasyDiagnosisData(): Promise<EasyDiagnosisData> {
  if (cachedData) {
    return cachedData;
  }
  
  if (fetchPromise) {
    return fetchPromise;
  }
  
  fetchPromise = fetch('/api/easy-diagnosis')
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch easy diagnosis data');
      }
      return res.json();
    })
    .then(data => {
      cachedData = data;
      return data;
    })
    .catch(err => {
      fetchPromise = null;
      throw err;
    });
  
  return fetchPromise;
}

// Category icons mapping
export const CATEGORY_ICONS: { [key: string]: string } = {
  // Tooth Level
  'Caries': '🦷',
  'Pulp': '💉',
  'Periapical': '🎯',
  'Impacted': '⬇️',
  'Hard Tissue Defect': '💔',
  'Endodontic Complication': '⚠️',
  
  // Oral Cavity Level
  'Gingiva': '🩸',
  'Periodontal': '📊',
  'Odontogenic Cyst': '⭕',
  'Soft Tissue Infection': '🔴',
  'Oral Mucosa': '👄',
  'Lips': '💋',
  'Tongue': '👅',
  'Jaw': '🦴',
  'Salivary Glands': '💧',
  'TMJ': '🔗',
};

// Short labels for toolbar display
export const CATEGORY_SHORT_LABELS: { [key: string]: string } = {
  // Tooth Level
  'Caries': 'Caries',
  'Pulp': 'Pulp',
  'Periapical': 'Periapical',
  'Impacted': 'Impacted',
  'Hard Tissue Defect': 'Hard Tissue',
  'Endodontic Complication': 'Endo Comp.',
  
  // Oral Cavity Level
  'Gingiva': 'Gingiva',
  'Periodontal': 'Perio',
  'Odontogenic Cyst': 'Cyst',
  'Soft Tissue Infection': 'Infection',
  'Oral Mucosa': 'Mucosa',
  'Lips': 'Lips',
  'Tongue': 'Tongue',
  'Jaw': 'Jaw',
  'Salivary Glands': 'Salivary',
  'TMJ': 'TMJ',
};

// Clear the cache
export function clearEasyDiagnosisCache(): void {
  cachedData = null;
  fetchPromise = null;
}

