// Dental Data Store - Using Zustand with dynamic data from Excel
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  DentalData,
  fetchDentalData,
  getCariesICD10,
  getEndodonticICD10,
  getPeriodontalICD10
} from '@/lib/dentalData';

// Surface areas for tooth selection
export const SURFACE_AREAS = {
  1: { id: 'cervical-buccal', label: 'Cervical Buccal' },
  2: { id: 'buccal', label: 'Buccal' },
  3: { id: 'mesial', label: 'Mesial' },
  4: { id: 'incisal', label: 'Incisal/Occlusal' },
  5: { id: 'distal', label: 'Distal' },
  6: { id: 'palatal', label: 'Palatal/Lingual' },
  7: { id: 'cervical-palatal', label: 'Cervical Palatal' },
  8: { id: 'class4-mesial', label: 'Class 4 Mesial' },
  9: { id: 'class4-distal', label: 'Class 4 Distal' },
  10: { id: 'buccal-surface', label: 'Buccal Surface' },
  11: { id: 'palatal-surface', label: 'Palatal Surface' },
};

// Types
export type PathologyType = 'caries' | 'fracture' | 'wear' | 'tooth-wear' | 'discoloration' | 'apical' | 'development' | 'development-disorder';
export type RestorationType = 'filling' | 'veneer' | 'crown';
export type ActionType = 'monitor' | 'treat';
export type DecayDepth = 'Enamel' | 'Dentin' | 'Root' | 'enamel' | 'dentin' | 'root';
export type CavitationType = 'Cavitated' | 'Not Cavitated';
export type ClassificationType = 'C1' | 'C2' | 'C3' | 'C4';
export type EndodonticTestType = 'cold' | 'percussion' | 'palpation' | 'heat' | 'electricity';
export type EndodonticResult = 'positive' | 'negative' | 'normal' | 'lingering' | 'within-limits' | 'unpleasant' | 'pain-stimulus' | 'pain-lingering' | 'not-painful' | 'painful' | null;

// Material types from Excel
export type FillingMaterial = 'Composite' | 'Ceramic' | 'Amalgam' | 'Gold' | 'Non-Precious Metal' | 'Temporary';
export type QualityType = 'Sufficient' | 'Uncertain' | 'Insufficient';
export type QualityDetail = 'Overhang' | 'Flush' | 'Shortfall';
export type CrownType = 'Single Crown' | 'Abutment' | 'Pontic';
export type CrownBase = 'Natural' | 'Implant';
export type ImplantType = 'Bone level' | 'Tissue level';

export interface PathologyEntry {
  id: string;
  toothNumber: number;
  type: PathologyType;
  surfaces: number[];
  depth?: DecayDepth;
  cavitation?: CavitationType;
  classification?: ClassificationType;
  // For fracture
  fractureType?: string;
  fractureDirection?: string;
  // For tooth wear
  wearType?: string;
  wearLocation?: string;
  // For discoloration
  color?: string;
  action: ActionType;
  icdCode?: string;
  icdDescription?: string;
  createdAt: string;
}

export interface RestorationEntry {
  id: string;
  toothNumber: number;
  type: RestorationType;
  surfaces: number[];
  material?: FillingMaterial;
  quality?: QualityType;
  qualityDetail?: QualityDetail;
  // For crown
  crownType?: CrownType;
  crownBase?: CrownBase;
  implantType?: ImplantType;
  action: ActionType;
  icdCode?: string;
  icdDescription?: string;
  createdAt: string;
}

export interface EndodonticEntry {
  id: string;
  toothNumber: number;
  testType: EndodonticTestType;
  result: EndodonticResult;
  positiveDetail?: string;
  notApplicableReason?: string;
  icdCode?: string;
  icdDescription?: string;
  createdAt: string;
}

export interface PeriodontalSiteData {
  probingDepth: number;
  gingivalMargin: number;
  bleeding: boolean;
  plaque: boolean;
  pus: boolean;
  tartar: boolean;
}

export interface PeriodontalEntry {
  toothNumber: number;
  sites: {
    distoPalatal: PeriodontalSiteData;
    palatal: PeriodontalSiteData;
    mesioPalatal: PeriodontalSiteData;
    distoBuccal: PeriodontalSiteData;
    buccal: PeriodontalSiteData;
    mesioBuccal: PeriodontalSiteData;
  };
  mobility: number; // 0, 1, 2, or 3
  icdCode?: string;
  icdDescription?: string;
  updatedAt: string;
}

export interface ToothStatus {
  toothNumber: number;
  isMissing: boolean;
  isToBeExtracted: boolean;
}

interface DentalStore {
  pathologies: PathologyEntry[];
  restorations: RestorationEntry[];
  endodontics: EndodonticEntry[];
  periodontal: PeriodontalEntry[];
  toothStatuses: ToothStatus[];
  
  // Dental data cache from Excel
  dentalData: DentalData | null;
  dataLoading: boolean;
  dataError: string | null;
  
  // Actions
  loadDentalData: () => Promise<void>;
  
  addPathology: (entry: Omit<PathologyEntry, 'id' | 'createdAt'>) => void;
  removePathology: (id: string) => void;
  
  addRestoration: (entry: Omit<RestorationEntry, 'id' | 'createdAt'>) => void;
  removeRestoration: (id: string) => void;
  
  addEndodontic: (entry: Omit<EndodonticEntry, 'id' | 'createdAt'>) => void;
  updateEndodontic: (toothNumber: number, testType: EndodonticTestType, result: EndodonticResult, positiveDetail?: string) => void;
  
  updatePeriodontal: (entry: Omit<PeriodontalEntry, 'updatedAt'>) => void;
  
  setToothStatus: (toothNumber: number, status: Partial<Omit<ToothStatus, 'toothNumber'>>) => void;
  
  // Getters
  getToothPathologies: (toothNumber: number) => PathologyEntry[];
  getToothRestorations: (toothNumber: number) => RestorationEntry[];
  getToothEndodontics: (toothNumber: number) => EndodonticEntry[];
  getToothPeriodontal: (toothNumber: number) => PeriodontalEntry | undefined;
  getToothStatus: (toothNumber: number) => ToothStatus | undefined;
  
  // Get all ICD codes from dental data
  getAllICDCodes: () => DentalData['icd10Codes'];
  getICDCategories: () => Record<string, { code: string; description: string; category?: string }[]>;
  getPathologyTypes: () => DentalData['pathologyTypes'];
  getRestorationTypes: () => DentalData['restorationTypes'];
  getEndodonticTests: () => DentalData['endodonticTests'];
  getPeriodontalConfig: () => DentalData['periodontalConfig'];
  
  // Clear all data
  clearAll: () => void;
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const useDentalStore = create<DentalStore>()(
  persist(
    (set, get) => ({
      pathologies: [],
      restorations: [],
      endodontics: [],
      periodontal: [],
      toothStatuses: [],
      dentalData: null,
      dataLoading: false,
      dataError: null,
      
      loadDentalData: async () => {
        const state = get();
        if (state.dentalData || state.dataLoading) return;
        
        set({ dataLoading: true, dataError: null });
        
        try {
          const data = await fetchDentalData();
          set({ dentalData: data, dataLoading: false });
        } catch (error) {
          set({ 
            dataError: error instanceof Error ? error.message : 'Failed to load dental data',
            dataLoading: false 
          });
        }
      },
      
      addPathology: (entry) => {
        const state = get();
        let icdCode = entry.icdCode;
        let icdDescription = entry.icdDescription;
        
        // If no ICD code provided, try to calculate from caries diagnosis data
        if (!icdCode && entry.type === 'caries' && state.dentalData && entry.depth && entry.cavitation) {
          const aspectName = entry.surfaces?.includes(4) ? 'Occlusal' : 'any';
          const icd = getCariesICD10(
            state.dentalData.cariesDiagnosis,
            aspectName,
            entry.depth,
            entry.cavitation,
            entry.classification || 'C1'
          );
          if (icd) {
            icdCode = icd.code;
            icdDescription = icd.description;
          }
        }
        
        // For fracture, use default fracture code
        if (!icdCode && entry.type === 'fracture') {
          icdCode = 'S02.5';
          icdDescription = 'Fracture of tooth';
        }
        
        // For tooth wear
        if (!icdCode && entry.type === 'tooth-wear') {
          icdCode = entry.wearType === 'Abrasion' ? 'K03.1' : 'K03.2';
          icdDescription = entry.wearType === 'Abrasion' ? 'Abrasion of teeth' : 'Erosion of teeth';
        }
        
        // For discoloration
        if (!icdCode && entry.type === 'discoloration') {
          icdCode = 'K03.7';
          icdDescription = 'Posteruptive color changes';
        }
        
        const newEntry: PathologyEntry = {
          ...entry,
          id: generateId(),
          icdCode,
          icdDescription,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ pathologies: [...state.pathologies, newEntry] }));
      },
      
      removePathology: (id) => {
        set((state) => ({
          pathologies: state.pathologies.filter((p) => p.id !== id),
        }));
      },
      
      addRestoration: (entry) => {
        let icdCode = entry.icdCode;
        let icdDescription = entry.icdDescription;
        
        // Add ICD code for insufficient quality restorations
        if (!icdCode && entry.quality === 'Insufficient') {
          icdCode = 'K08.53';
          icdDescription = 'Fractured dental restorative material';
        }
        
        // Add ICD code for crown types
        if (!icdCode && entry.type === 'crown') {
          if (entry.crownType === 'Abutment') {
            icdCode = 'K08.1';
            icdDescription = 'Bridge support';
          } else if (entry.crownType === 'Pontic') {
            icdCode = 'K08.4';
            icdDescription = 'Replaces missing tooth';
          }
        }
        
        const newEntry: RestorationEntry = {
          ...entry,
          id: generateId(),
          icdCode,
          icdDescription,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ restorations: [...state.restorations, newEntry] }));
      },
      
      removeRestoration: (id) => {
        set((state) => ({
          restorations: state.restorations.filter((r) => r.id !== id),
        }));
      },
      
      addEndodontic: (entry) => {
        const state = get();
        let icdCode = entry.icdCode;
        let icdDescription = entry.icdDescription;
        
        // Calculate ICD code based on test results using endo diagnosis data
        if (!icdCode && state.dentalData && entry.result) {
          const icd = getEndodonticICD10(
            state.dentalData.endoDiagnosis,
            entry.testType === 'cold' ? (entry.result === 'positive' ? 'Positive' : entry.result === 'negative' ? 'Negative' : '') : '',
            entry.positiveDetail || '',
            entry.testType === 'percussion' ? (entry.result === 'painful' ? 'Painful' : 'Not painful') : '',
            entry.testType === 'palpation' ? (entry.result === 'painful' ? 'Painful' : 'Not painful') : ''
          );
          if (icd) {
            icdCode = icd.code;
            icdDescription = icd.description;
          }
        }
        
        // Fallback ICD codes based on simple logic
        if (!icdCode) {
          if (entry.result === 'pain-lingering' || entry.positiveDetail === 'pain-lingering') {
            icdCode = 'K04.02';
            icdDescription = 'Irreversible pulpitis';
          } else if (entry.result === 'pain-stimulus' || entry.positiveDetail === 'pain-stimulus') {
            icdCode = 'K04.01';
            icdDescription = 'Reversible pulpitis';
          } else if (entry.result === 'negative' && (entry.testType === 'cold' || entry.testType === 'heat')) {
            icdCode = 'K04.1';
            icdDescription = 'Necrosis of pulp';
          } else if (entry.result === 'painful' && (entry.testType === 'percussion' || entry.testType === 'palpation')) {
            icdCode = 'K04.4';
            icdDescription = 'Acute apical periodontitis';
          }
        }
        
        const newEntry: EndodonticEntry = {
          ...entry,
          id: generateId(),
          icdCode,
          icdDescription,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ endodontics: [...state.endodontics, newEntry] }));
      },
      
      updateEndodontic: (toothNumber, testType, result, positiveDetail) => {
        const state = get();
        const existingIndex = state.endodontics.findIndex(
          (e) => e.toothNumber === toothNumber && e.testType === testType
        );
        
        // First, update or add this test entry
        let updatedEndodontics = [...state.endodontics];
        
        if (existingIndex >= 0) {
          updatedEndodontics[existingIndex] = {
            ...updatedEndodontics[existingIndex],
            result,
            positiveDetail,
          };
        } else {
          updatedEndodontics.push({
            id: generateId(),
            toothNumber,
            testType,
            result,
            positiveDetail,
            createdAt: new Date().toISOString(),
          });
        }
        
        // Now calculate combined ICD diagnosis based on all tests for this tooth
        const toothTests = updatedEndodontics.filter(e => e.toothNumber === toothNumber);
        const coldTest = toothTests.find(t => t.testType === 'cold');
        const percussionTest = toothTests.find(t => t.testType === 'percussion');
        const palpationTest = toothTests.find(t => t.testType === 'palpation');
        
        // Try to calculate from Excel endo diagnosis logic
        if (state.dentalData?.endoDiagnosis && coldTest) {
          // Determine cold test parameters
          const coldResult = coldTest.result === 'positive' ? 'Positive' : 
                           coldTest.result === 'negative' ? 'Negative' : '';
          const coldDetail = coldTest.positiveDetail === 'pain-lingering' ? 'lingering' :
                           coldTest.positiveDetail === 'pain-stimulus' ? 'stimulus' : '';
          
          // Determine percussion test result
          const percussionResult = percussionTest?.result === 'painful' ? 'Painful' :
                                  percussionTest?.result === 'not-painful' ? 'Not painful' : '';
          
          // Determine palpation test result
          const palpationResult = palpationTest?.result === 'painful' ? 'Painful' :
                                 palpationTest?.result === 'not-painful' ? 'Not painful' : 
                                 palpationTest?.result === 'negative' ? 'Negative' : '';
          
          // Try to find matching diagnosis from Excel
          const icd = getEndodonticICD10(
            state.dentalData.endoDiagnosis,
            coldResult,
            coldDetail,
            percussionResult,
            palpationResult
          );
          
          if (icd) {
            // Update all tests for this tooth with the combined diagnosis
            updatedEndodontics = updatedEndodontics.map(e => {
              if (e.toothNumber === toothNumber) {
                return { ...e, icdCode: icd.code, icdDescription: icd.description };
              }
              return e;
            });
            set({ endodontics: updatedEndodontics });
            return;
          }
        }
        
        // Fallback: calculate ICD based on individual test result
        let icdCode: string | undefined;
        let icdDescription: string | undefined;
        
        if (result === 'pain-lingering' || positiveDetail === 'pain-lingering') {
          icdCode = 'K04.02';
          icdDescription = 'Irreversible pulpitis';
        } else if (result === 'pain-stimulus' || positiveDetail === 'pain-stimulus') {
          icdCode = 'K04.01';
          icdDescription = 'Reversible pulpitis';
        } else if (result === 'negative' && (testType === 'cold' || testType === 'heat')) {
          icdCode = 'K04.1';
          icdDescription = 'Necrosis of pulp';
        } else if (result === 'painful' && (testType === 'percussion' || testType === 'palpation')) {
          icdCode = 'K04.4';
          icdDescription = 'Acute apical periodontitis';
        }
        
        // Update the current test with fallback ICD
        updatedEndodontics = updatedEndodontics.map(e => {
          if (e.toothNumber === toothNumber && e.testType === testType) {
            return { ...e, icdCode, icdDescription };
          }
          return e;
        });
        
        set({ endodontics: updatedEndodontics });
      },
      
      updatePeriodontal: (entry) => {
        const state = get();
        const existingIndex = state.periodontal.findIndex(
          (p) => p.toothNumber === entry.toothNumber
        );
        
        // Calculate ICD code based on periodontal measurements
        let icdCode: string | undefined;
        let icdDescription: string | undefined;
        
        if (state.dentalData) {
          // Get max probing depth and check for bleeding
          const sites = Object.values(entry.sites);
          const maxPD = Math.max(...sites.map(s => s.probingDepth));
          const minGM = Math.min(...sites.map(s => s.gingivalMargin));
          const hasBleeding = sites.some(s => s.bleeding);
          const hasPlaque = sites.some(s => s.plaque);
          
          const icd = getPeriodontalICD10(
            state.dentalData.perioDiagnosis,
            maxPD,
            minGM,
            hasBleeding,
            hasPlaque,
            30, // Default age
            30  // Default teeth affected %
          );
          
          if (icd) {
            icdCode = icd.code;
            icdDescription = icd.description;
          }
        }
        
        const newEntry: PeriodontalEntry = {
          ...entry,
          icdCode,
          icdDescription,
          updatedAt: new Date().toISOString(),
        };
        
        if (existingIndex >= 0) {
          const updated = [...state.periodontal];
          updated[existingIndex] = newEntry;
          set({ periodontal: updated });
        } else {
          set((state) => ({ periodontal: [...state.periodontal, newEntry] }));
        }
      },
      
      setToothStatus: (toothNumber, status) => {
        const state = get();
        const existingIndex = state.toothStatuses.findIndex(
          (t) => t.toothNumber === toothNumber
        );
        
        if (existingIndex >= 0) {
          const updated = [...state.toothStatuses];
          updated[existingIndex] = { ...updated[existingIndex], ...status };
          set({ toothStatuses: updated });
        } else {
          const newStatus: ToothStatus = {
            toothNumber,
            isMissing: status.isMissing ?? false,
            isToBeExtracted: status.isToBeExtracted ?? false,
          };
          set((state) => ({ toothStatuses: [...state.toothStatuses, newStatus] }));
        }
      },
      
      getToothPathologies: (toothNumber) => {
        return get().pathologies.filter((p) => p.toothNumber === toothNumber);
      },
      
      getToothRestorations: (toothNumber) => {
        return get().restorations.filter((r) => r.toothNumber === toothNumber);
      },
      
      getToothEndodontics: (toothNumber) => {
        return get().endodontics.filter((e) => e.toothNumber === toothNumber);
      },
      
      getToothPeriodontal: (toothNumber) => {
        return get().periodontal.find((p) => p.toothNumber === toothNumber);
      },
      
      getToothStatus: (toothNumber) => {
        return get().toothStatuses.find((t) => t.toothNumber === toothNumber);
      },
      
      getAllICDCodes: () => {
        return get().dentalData?.icd10Codes || [];
      },
      
      getICDCategories: () => {
        const codes = get().dentalData?.icd10Codes || [];
        const categories: Record<string, { code: string; description: string; category?: string }[]> = {};
        
        for (const code of codes) {
          const category = code.category || 'Other';
          if (!categories[category]) {
            categories[category] = [];
          }
          categories[category].push(code);
        }
        
        return categories;
      },
      
      getPathologyTypes: () => {
        return get().dentalData?.pathologyTypes || [];
      },
      
      getRestorationTypes: () => {
        return get().dentalData?.restorationTypes || [];
      },
      
      getEndodonticTests: () => {
        return get().dentalData?.endodonticTests || [];
      },
      
      getPeriodontalConfig: () => {
        return get().dentalData?.periodontalConfig || {
          sites: [],
          probingDepthValues: [],
          gingivalMarginValues: [],
          additionalInfo: [],
          mobilityClasses: [],
        };
      },
      
      clearAll: () => {
        set({
          pathologies: [],
          restorations: [],
          endodontics: [],
          periodontal: [],
          toothStatuses: [],
          // Keep dental data loaded
        });
      },
    }),
    {
      name: 'dental-store',
      // Don't persist dentalData - it will be fetched fresh
      partialize: (state) => ({
        pathologies: state.pathologies,
        restorations: state.restorations,
        endodontics: state.endodontics,
        periodontal: state.periodontal,
        toothStatuses: state.toothStatuses,
      }),
    }
  )
);

// Hook to ensure dental data is loaded
export function useDentalDataStore() {
  const { dentalData, dataLoading, dataError, loadDentalData } = useDentalStore();
  
  // Auto-load on first use
  if (!dentalData && !dataLoading && !dataError) {
    loadDentalData();
  }
  
  return { dentalData, dataLoading, dataError, loadDentalData };
}
