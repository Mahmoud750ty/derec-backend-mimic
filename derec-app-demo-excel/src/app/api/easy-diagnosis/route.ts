import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

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

let cachedData: EasyDiagnosisData | null = null;

function parseEasyDiagnosisSheet(): EasyDiagnosisData {
  if (cachedData) {
    return cachedData;
  }

  const filePath = path.join(process.cwd(), 'public', 'derec-as-is.xlsx');
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  
  const worksheet = workbook.Sheets['easy-diagnosis'];
  if (!worksheet) {
    throw new Error('easy-diagnosis sheet not found');
  }
  
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

  const toothLevel: EasyDiagnosisData['toothLevel'] = {
    categories: [],
    conditions: {}
  };
  
  const oralCavityLevel: EasyDiagnosisData['oralCavityLevel'] = {
    categories: [],
    conditions: {}
  };

  let currentSection: 'tooth' | 'oral' | null = null;

  // Skip header row
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row || row.length < 2) continue;
    
    const level = String(row[0] || '').trim();
    const category = String(row[1] || '').trim();
    const condition = String(row[2] || '').trim();
    const icdCode = String(row[3] || '').trim();
    const description = String(row[4] || '').trim();
    
    // Check for section markers
    if (level === 'TOOTH LEVEL') {
      currentSection = 'tooth';
      continue;
    }
    if (level === 'ORAL CAVITY LEVEL') {
      currentSection = 'oral';
      continue;
    }
    
    // Skip empty rows
    if (!level || !category || !condition) continue;
    
    const diagnosisCondition: DiagnosisCondition = {
      level: level === 'Tooth' ? 'Tooth' : 'Oral Cavity',
      category,
      condition,
      icdCode,
      description
    };
    
    if (level === 'Tooth') {
      if (!toothLevel.conditions[category]) {
        toothLevel.conditions[category] = [];
        toothLevel.categories.push(category);
      }
      toothLevel.conditions[category].push(diagnosisCondition);
    } else if (level === 'Oral Cavity') {
      if (!oralCavityLevel.conditions[category]) {
        oralCavityLevel.conditions[category] = [];
        oralCavityLevel.categories.push(category);
      }
      oralCavityLevel.conditions[category].push(diagnosisCondition);
    }
  }

  cachedData = { toothLevel, oralCavityLevel };
  return cachedData;
}

export async function GET() {
  try {
    const data = parseEasyDiagnosisSheet();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading easy-diagnosis sheet:', error);
    return NextResponse.json(
      { error: 'Failed to read easy diagnosis data' },
      { status: 500 }
    );
  }
}

