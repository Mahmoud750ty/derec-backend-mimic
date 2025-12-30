// ICD-10 Data Types and Utilities
export interface ICD10Code {
  code: string;
  description: string;
  category: string;
}

export interface ICD10Mappings {
  decay: {
    enamel: ICD10Code;
    dentin: ICD10Code;
    cementum: ICD10Code;
    pulpExposure: ICD10Code;
    unspecified: ICD10Code;
  };
  pulp: {
    reversiblePulpitis: ICD10Code;
    irreversiblePulpitis: ICD10Code;
    necrosis: ICD10Code;
    acutePeriodontitis: ICD10Code;
    chronicPeriodontitis: ICD10Code;
    abscessWithSinus: ICD10Code;
    abscessWithoutSinus: ICD10Code;
  };
  fracture: {
    tooth: ICD10Code;
    crackedTooth: ICD10Code;
  };
  periodontal: {
    acuteGingivitis: ICD10Code;
    chronicGingivitis: ICD10Code;
    chronicPeriodontitis: ICD10Code;
    aggressivePeriodontitis: ICD10Code;
    gingivalRecession: ICD10Code;
  };
  restoration: {
    openMargins: ICD10Code;
    overhanging: ICD10Code;
    fracturedWithLoss: ICD10Code;
    fracturedWithoutLoss: ICD10Code;
    poorAesthetic: ICD10Code;
    other: ICD10Code;
  };
  other: {
    attrition: ICD10Code;
    abrasion: ICD10Code;
    erosion: ICD10Code;
    sensitiveDentin: ICD10Code;
    discoloration: ICD10Code;
  };
}

export interface ICD10Data {
  codes: ICD10Code[];
  categories: {
    [key: string]: ICD10Code[];
  };
  mappings: ICD10Mappings;
}

// Cache for the fetched data
let cachedData: ICD10Data | null = null;
let fetchPromise: Promise<ICD10Data> | null = null;

// Fetch ICD-10 data from the API
export async function fetchICD10Data(): Promise<ICD10Data> {
  if (cachedData) {
    return cachedData;
  }
  
  if (fetchPromise) {
    return fetchPromise;
  }
  
  fetchPromise = fetch('/api/icd10')
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch ICD-10 data');
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

// Search ICD-10 codes
export async function searchICD10Codes(query: string, category?: string): Promise<ICD10Code[]> {
  const response = await fetch('/api/icd10', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, category }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to search ICD-10 codes');
  }
  
  const data = await response.json();
  return data.results;
}

// Get ICD-10 code for a pathology type
export function getPathologyCode(
  mappings: ICD10Mappings,
  pathologyType: string,
  depth?: string
): ICD10Code | null {
  const type = pathologyType.toLowerCase();
  
  switch (type) {
    case 'decay':
    case 'caries':
      if (depth === 'Enamel') return mappings.decay.enamel;
      if (depth === 'Dentin') return mappings.decay.dentin;
      if (depth === 'Cementum') return mappings.decay.cementum;
      if (depth === 'Pulp' || depth === 'Pulp Exposure') return mappings.decay.pulpExposure;
      return mappings.decay.unspecified;
    
    case 'fracture':
      return mappings.fracture.tooth;
    
    case 'cracked tooth':
    case 'crack':
      return mappings.fracture.crackedTooth;
    
    case 'attrition':
      return mappings.other.attrition;
    
    case 'abrasion':
      return mappings.other.abrasion;
    
    case 'erosion':
      return mappings.other.erosion;
    
    case 'discoloration':
      return mappings.other.discoloration;
    
    case 'sensitivity':
    case 'sensitive':
      return mappings.other.sensitiveDentin;
    
    default:
      return null;
  }
}

// Get ICD-10 code for endodontic test results
export function getEndodonticCode(
  mappings: ICD10Mappings,
  testType: string,
  result: string
): ICD10Code | null {
  const test = testType.toLowerCase();
  const res = result.toLowerCase();
  
  // Positive results often indicate pulpal issues
  if (res === 'positive' || res === 'lingering') {
    if (test === 'cold' || test === 'heat' || test === 'electricity') {
      // Lingering response indicates irreversible pulpitis
      if (res === 'lingering') {
        return mappings.pulp.irreversiblePulpitis;
      }
      // Positive response could indicate reversible pulpitis
      return mappings.pulp.reversiblePulpitis;
    }
    if (test === 'percussion' || test === 'palpation') {
      // Positive percussion/palpation suggests periapical involvement
      return mappings.pulp.acutePeriodontitis;
    }
  }
  
  // Negative results
  if (res === 'negative') {
    if (test === 'cold' || test === 'heat' || test === 'electricity') {
      // No response to vitality tests suggests necrosis
      return mappings.pulp.necrosis;
    }
  }
  
  return null;
}

// Get ICD-10 code for restoration failure
export function getRestorationCode(
  mappings: ICD10Mappings,
  reason?: string
): ICD10Code {
  if (!reason) return mappings.restoration.other;
  
  const r = reason.toLowerCase();
  
  if (r.includes('margin') || r.includes('open')) {
    return mappings.restoration.openMargins;
  }
  if (r.includes('overhang')) {
    return mappings.restoration.overhanging;
  }
  if (r.includes('fracture') && r.includes('loss')) {
    return mappings.restoration.fracturedWithLoss;
  }
  if (r.includes('fracture')) {
    return mappings.restoration.fracturedWithoutLoss;
  }
  if (r.includes('aesthetic') || r.includes('color') || r.includes('appearance')) {
    return mappings.restoration.poorAesthetic;
  }
  
  return mappings.restoration.other;
}

// Get ICD-10 code for periodontal condition
export function getPeriodontalCode(
  mappings: ICD10Mappings,
  condition: string
): ICD10Code | null {
  const c = condition.toLowerCase();
  
  if (c.includes('acute') && c.includes('gingivitis')) {
    return mappings.periodontal.acuteGingivitis;
  }
  if (c.includes('chronic') && c.includes('gingivitis')) {
    return mappings.periodontal.chronicGingivitis;
  }
  if (c.includes('aggressive') && c.includes('periodontitis')) {
    return mappings.periodontal.aggressivePeriodontitis;
  }
  if (c.includes('periodontitis')) {
    return mappings.periodontal.chronicPeriodontitis;
  }
  if (c.includes('recession')) {
    return mappings.periodontal.gingivalRecession;
  }
  
  return null;
}

// Clear the cache (useful for testing or when Excel file is updated)
export function clearICD10Cache(): void {
  cachedData = null;
  fetchPromise = null;
}

