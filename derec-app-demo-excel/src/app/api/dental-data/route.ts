import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

// Types for the dental data
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

export interface DentalData {
  attributes: AttributeEntry[];
  cariesDiagnosis: CariesDiagnosis[];
  endoDiagnosis: EndoDiagnosis[];
  perioDiagnosis: PerioDiagnosis[];
  icd10Codes: ICD10Code[];
  // Organized data for UI
  pathologyTypes: PathologyType[];
  restorationTypes: RestorationType[];
  endodonticTests: EndodonticTest[];
  periodontalConfig: PeriodontalConfig;
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

let cachedDentalData: DentalData | null = null;

async function parseDentalExcel(): Promise<DentalData> {
  if (cachedDentalData) {
    return cachedDentalData;
  }

  // Use absolute path to Excel file
  const absolutePath = 'C:\\Users\\Lenovo\\Desktop\\dev\\ThakaaMed\\derect-data\\derec-app-demo-excel\\public\\derec-as-is.xlsx';
  
  let workbook: XLSX.WorkBook | null = null;
  
  try {
    // Try reading file as buffer first
    const buffer = fs.readFileSync(absolutePath);
    workbook = XLSX.read(buffer, { type: 'buffer' });
    console.log('Successfully loaded Excel file using fs.readFileSync');
  } catch (e: unknown) {
    console.error('Failed to read Excel file:', e);
    // Fallback: try XLSX.readFile directly with different paths
    const possiblePaths = [
      path.resolve(process.cwd(), 'public', 'derec-as-is.xlsx'),
      absolutePath,
    ];
    
    for (const filePath of possiblePaths) {
      try {
        workbook = XLSX.readFile(filePath);
        console.log('Successfully loaded Excel from:', filePath);
        break;
      } catch (err) {
        console.log('Failed to load from:', filePath);
      }
    }
  }
  
  if (!workbook) {
    throw new Error('Could not find derec-as-is.xlsx in any expected location');
  }

  // Parse all-attrebutes sheet
  const attributesSheet = workbook.Sheets['all-attrebutes'];
  const attributesData: string[][] = XLSX.utils.sheet_to_json(attributesSheet, { header: 1 });
  const attributes = parseAttributes(attributesData);

  // Parse caries sheet
  const cariesSheet = workbook.Sheets['caries'];
  const cariesData: string[][] = XLSX.utils.sheet_to_json(cariesSheet, { header: 1 });
  const cariesDiagnosis = parseCariesDiagnosis(cariesData);

  // Parse endo sheet
  const endoSheet = workbook.Sheets['endo'];
  const endoData: string[][] = XLSX.utils.sheet_to_json(endoSheet, { header: 1 });
  const endoDiagnosis = parseEndoDiagnosis(endoData);

  // Parse perio sheet
  const perioSheet = workbook.Sheets['perio'];
  const perioData: string[][] = XLSX.utils.sheet_to_json(perioSheet, { header: 1 });
  const perioDiagnosis = parsePerioDiagnosis(perioData);

  // Parse all the icd10 codes sheet
  const icd10Sheet = workbook.Sheets['all the icd10 codes'];
  const icd10Data: string[][] = XLSX.utils.sheet_to_json(icd10Sheet, { header: 1 });
  const icd10Codes = parseICD10Codes(icd10Data);

  // Organize data for UI
  const pathologyTypes = organizePathologyTypes(attributes);
  const restorationTypes = organizeRestorationTypes(attributes);
  const endodonticTests = organizeEndodonticTests(attributes);
  const periodontalConfig = organizePeriodontalConfig(attributes);

  cachedDentalData = {
    attributes,
    cariesDiagnosis,
    endoDiagnosis,
    perioDiagnosis,
    icd10Codes,
    pathologyTypes,
    restorationTypes,
    endodonticTests,
    periodontalConfig,
  };

  return cachedDentalData;
}

function parseAttributes(data: string[][]): AttributeEntry[] {
  const entries: AttributeEntry[] = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[0]) continue;
    
    entries.push({
      category: String(row[0] || '').trim(),
      subCategory: String(row[1] || '').trim(),
      attribute1: String(row[2] || '').trim(),
      attribute2: String(row[3] || '').trim(),
      attribute3: String(row[4] || '').trim(),
      value: String(row[5] || '').trim(),
      icdCode: String(row[6] || '').trim(),
      icdDescription: String(row[7] || '').trim(),
    });
  }
  
  return entries;
}

function parseCariesDiagnosis(data: string[][]): CariesDiagnosis[] {
  const entries: CariesDiagnosis[] = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[0]) continue;
    
    entries.push({
      aspects: String(row[1] || '').trim(),
      depth: String(row[2] || '').trim(),
      cavitation: String(row[3] || '').trim(),
      classification: String(row[4] || '').trim(),
      icdCode: String(row[5] || '').trim(),
      icdDescription: String(row[6] || '').trim(),
    });
  }
  
  return entries;
}

function parseEndoDiagnosis(data: string[][]): EndoDiagnosis[] {
  const entries: EndoDiagnosis[] = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[0]) continue;
    
    entries.push({
      coldTest: String(row[0] || '').trim(),
      coldTestDetail: String(row[1] || '').trim(),
      percussionTest: String(row[2] || '').trim(),
      palpation: String(row[3] || '').trim(),
      icdCode: String(row[4] || '').trim(),
      icdDescription: String(row[5] || '').trim(),
    });
  }
  
  return entries;
}

function parsePerioDiagnosis(data: string[][]): PerioDiagnosis[] {
  const entries: PerioDiagnosis[] = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[0]) continue;
    
    // Skip empty rows (columns are doubled in the Excel with commas)
    const probingDepth = String(row[0] || '').trim();
    if (!probingDepth) continue;
    
    entries.push({
      probingDepth,
      gingivalMargin: String(row[2] || '').trim(),
      cal: String(row[4] || '').trim(),
      bop: String(row[6] || '').trim(),
      plaque: String(row[8] || '').trim(),
      age: String(row[10] || '').trim(),
      teethPercent: String(row[12] || '').trim(),
      icdCode: String(row[14] || '').trim(),
      icdDescription: String(row[16] || '').trim(),
    });
  }
  
  return entries;
}

function parseICD10Codes(data: string[][]): ICD10Code[] {
  const codes: ICD10Code[] = [];
  let currentCategory = '';
  
  for (const row of data) {
    if (!row || row.length === 0) continue;
    
    const firstCell = String(row[0] || '').trim();
    const secondCell = String(row[1] || '').trim();
    
    // Check if it's a category header (no code, just description)
    if (!firstCell && secondCell) {
      currentCategory = secondCell;
      continue;
    }
    
    // It's an ICD-10 code
    if (firstCell && secondCell) {
      codes.push({
        code: firstCell,
        description: secondCell,
        category: currentCategory,
      });
    }
  }
  
  return codes;
}

function organizePathologyTypes(attributes: AttributeEntry[]): PathologyType[] {
  const pathologyTypes: PathologyType[] = [];
  
  // Get unique pathology categories
  const pathologyAttrs = attributes.filter(a => a.category === 'pathology');
  const categories = [...new Set(pathologyAttrs.map(a => a.subCategory))].filter(c => c);
  
  for (const category of categories) {
    const categoryAttrs = pathologyAttrs.filter(a => a.subCategory === category);
    const pathologyType: PathologyType = {
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category === 'caries' ? 'Caries' : category,
      aspects: [],
      options: [],
    };
    
    // Extract aspects
    const aspectAttrs = categoryAttrs.filter(a => a.attribute1 === 'Aspects');
    if (aspectAttrs.length > 0) {
      pathologyType.aspects = aspectAttrs.map(a => ({
        id: a.value.toLowerCase().replace(/\s+/g, '-'),
        name: a.value,
        icdCode: a.icdCode !== '-' ? a.icdCode : undefined,
        icdDescription: a.icdDescription || undefined,
      }));
    }
    
    // Extract other option groups
    const optionGroups = new Map<string, OptionGroup>();
    
    for (const attr of categoryAttrs) {
      if (attr.attribute1 === 'Aspects') continue;
      if (!attr.attribute1) continue;
      
      const groupKey = attr.attribute1;
      if (!optionGroups.has(groupKey)) {
        optionGroups.set(groupKey, {
          id: groupKey.toLowerCase().replace(/\s+/g, '-'),
          name: groupKey,
          inputType: 'radio',
          options: [],
        });
      }
      
      const group = optionGroups.get(groupKey)!;
      
      // Handle nested options
      if (attr.attribute2 && !attr.attribute3) {
        // This is a sub-group
        const subGroupKey = `${groupKey}-${attr.attribute2}`;
        if (!optionGroups.has(subGroupKey)) {
          optionGroups.set(subGroupKey, {
            id: attr.attribute2.toLowerCase().replace(/\s+/g, '-'),
            name: attr.attribute2,
            inputType: 'radio',
            options: [],
            showWhen: { field: groupKey.toLowerCase().replace(/\s+/g, '-'), value: '' },
          });
        }
        const subGroup = optionGroups.get(subGroupKey)!;
        if (attr.value) {
          subGroup.options.push({
            id: attr.value.toLowerCase().replace(/\s+/g, '-'),
            name: attr.value,
            icdCode: attr.icdCode !== '-' ? attr.icdCode : undefined,
            icdDescription: attr.icdDescription || undefined,
          });
        }
      } else if (attr.attribute3) {
        // This is a deeply nested option (Classification under Cavitation)
        const deepGroupKey = `${groupKey}-${attr.attribute2}-${attr.attribute3}`;
        if (!optionGroups.has(deepGroupKey)) {
          optionGroups.set(deepGroupKey, {
            id: attr.attribute3.toLowerCase().replace(/\s+/g, '-'),
            name: attr.attribute3,
            inputType: 'radio',
            options: [],
            showWhen: { field: attr.attribute2.toLowerCase().replace(/\s+/g, '-'), value: 'cavitated' },
          });
        }
        const deepGroup = optionGroups.get(deepGroupKey)!;
        if (attr.value) {
          deepGroup.options.push({
            id: attr.value.toLowerCase().replace(/\s+/g, '-'),
            name: attr.value,
            icdCode: attr.icdCode !== '-' ? attr.icdCode : undefined,
            icdDescription: attr.icdDescription || undefined,
          });
        }
      } else if (attr.value) {
        // Regular option
        group.options.push({
          id: attr.value.toLowerCase().replace(/\s+/g, '-'),
          name: attr.value,
          icdCode: attr.icdCode !== '-' ? attr.icdCode : undefined,
          icdDescription: attr.icdDescription || undefined,
        });
      }
    }
    
    pathologyType.options = Array.from(optionGroups.values()).filter(g => g.options.length > 0);
    pathologyTypes.push(pathologyType);
  }
  
  return pathologyTypes;
}

function organizeRestorationTypes(attributes: AttributeEntry[]): RestorationType[] {
  const restorationTypes: RestorationType[] = [];
  
  const restorationAttrs = attributes.filter(a => a.category === 'restoration');
  const categories = [...new Set(restorationAttrs.map(a => a.subCategory))].filter(c => c);
  
  for (const category of categories) {
    const categoryAttrs = restorationAttrs.filter(a => a.subCategory === category);
    const restorationType: RestorationType = {
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category,
      aspects: [],
      options: [],
    };
    
    // Extract aspects
    const aspectAttrs = categoryAttrs.filter(a => a.attribute1 === 'Aspects');
    if (aspectAttrs.length > 0) {
      restorationType.aspects = aspectAttrs.map(a => ({
        id: a.value.toLowerCase().replace(/\s+/g, '-'),
        name: a.value,
        icdCode: a.icdCode !== '-' ? a.icdCode : undefined,
        icdDescription: a.icdDescription || undefined,
      }));
    }
    
    // Extract option groups (similar logic to pathology)
    const optionGroups = new Map<string, OptionGroup>();
    
    for (const attr of categoryAttrs) {
      if (attr.attribute1 === 'Aspects') continue;
      if (!attr.attribute1) continue;
      
      const groupKey = attr.attribute1;
      if (!optionGroups.has(groupKey)) {
        optionGroups.set(groupKey, {
          id: groupKey.toLowerCase().replace(/\s+/g, '-'),
          name: groupKey,
          inputType: 'radio',
          options: [],
        });
      }
      
      const group = optionGroups.get(groupKey)!;
      
      if (attr.attribute2 && !attr.attribute3 && attr.value) {
        const subGroupKey = `${groupKey}-${attr.attribute2}`;
        if (!optionGroups.has(subGroupKey)) {
          optionGroups.set(subGroupKey, {
            id: attr.attribute2.toLowerCase().replace(/\s+/g, '-'),
            name: attr.attribute2,
            inputType: 'radio',
            options: [],
            showWhen: { field: groupKey.toLowerCase().replace(/\s+/g, '-'), value: '' },
          });
        }
        const subGroup = optionGroups.get(subGroupKey)!;
        subGroup.options.push({
          id: attr.value.toLowerCase().replace(/\s+/g, '-'),
          name: attr.value,
          icdCode: attr.icdCode !== '-' ? attr.icdCode : undefined,
          icdDescription: attr.icdDescription || undefined,
        });
      } else if (attr.attribute3 && attr.value) {
        const deepGroupKey = `${groupKey}-${attr.attribute2}-${attr.attribute3}`;
        if (!optionGroups.has(deepGroupKey)) {
          optionGroups.set(deepGroupKey, {
            id: attr.attribute3.toLowerCase().replace(/\s+/g, '-'),
            name: attr.attribute3,
            inputType: 'radio',
            options: [],
            showWhen: { field: attr.attribute2.toLowerCase().replace(/\s+/g, '-'), value: '' },
          });
        }
        const deepGroup = optionGroups.get(deepGroupKey)!;
        deepGroup.options.push({
          id: attr.value.toLowerCase().replace(/\s+/g, '-'),
          name: attr.value,
          icdCode: attr.icdCode !== '-' ? attr.icdCode : undefined,
          icdDescription: attr.icdDescription || undefined,
        });
      } else if (attr.value) {
        group.options.push({
          id: attr.value.toLowerCase().replace(/\s+/g, '-'),
          name: attr.value,
          icdCode: attr.icdCode !== '-' ? attr.icdCode : undefined,
          icdDescription: attr.icdDescription || undefined,
        });
      }
    }
    
    restorationType.options = Array.from(optionGroups.values()).filter(g => g.options.length > 0);
    restorationTypes.push(restorationType);
  }
  
  return restorationTypes;
}

function organizeEndodonticTests(attributes: AttributeEntry[]): EndodonticTest[] {
  const endoAttrs = attributes.filter(a => a.category === 'Endodontic');
  const tests: EndodonticTest[] = [];
  
  // Group by test type
  const testTypes = ['Cold Test', 'Percussion Test', 'Palpation Test', 'Heat Test', 'Electricity Test'];
  
  for (const testType of testTypes) {
    const testAttrs = endoAttrs.filter(a => a.attribute1 === testType);
    if (testAttrs.length === 0) continue;
    
    const test: EndodonticTest = {
      id: testType.toLowerCase().replace(/\s+/g, '-'),
      name: testType,
      primaryOptions: [],
      subOptions: {},
    };
    
    // Get primary options (no attribute2)
    const primaryAttrs = testAttrs.filter(a => !a.attribute2 && a.value);
    test.primaryOptions = primaryAttrs.map(a => ({
      id: a.value.toLowerCase().replace(/\s+/g, '-'),
      name: a.value,
      icdCode: a.icdCode !== '-' ? a.icdCode : undefined,
      icdDescription: a.icdDescription || undefined,
    }));
    
    // Get sub-options
    const subOptionAttrs = testAttrs.filter(a => a.attribute2 && a.value);
    for (const attr of subOptionAttrs) {
      const key = attr.attribute2.toLowerCase().replace(/\s+/g, '-');
      if (!test.subOptions![key]) {
        test.subOptions![key] = [];
      }
      test.subOptions![key].push({
        id: attr.value.toLowerCase().replace(/\s+/g, '-'),
        name: attr.value,
        icdCode: attr.icdCode !== '-' ? attr.icdCode : undefined,
        icdDescription: attr.icdDescription || undefined,
      });
    }
    
    tests.push(test);
  }
  
  return tests;
}

function organizePeriodontalConfig(attributes: AttributeEntry[]): PeriodontalConfig {
  const perioAttrs = attributes.filter(a => a.category === 'Periodontal');
  
  const config: PeriodontalConfig = {
    sites: [],
    probingDepthValues: [],
    gingivalMarginValues: [],
    additionalInfo: [],
    mobilityClasses: [],
  };
  
  for (const attr of perioAttrs) {
    if (attr.attribute1 === 'Site') {
      config.sites.push(attr.value);
    } else if (attr.attribute1 === 'Probing Depth') {
      config.probingDepthValues.push(attr.value);
    } else if (attr.attribute1 === 'Gingival Margin') {
      config.gingivalMarginValues.push(attr.value);
    } else if (attr.attribute1 === 'Additional Information') {
      config.additionalInfo.push(attr.value);
    } else if (attr.attribute1 === 'Tooth Mobility') {
      config.mobilityClasses.push(attr.value);
    }
  }
  
  return config;
}

export async function GET() {
  try {
    const data = await parseDentalExcel();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading or parsing dental Excel file:', error);
    return NextResponse.json({ error: 'Failed to load dental data' }, { status: 500 });
  }
}

