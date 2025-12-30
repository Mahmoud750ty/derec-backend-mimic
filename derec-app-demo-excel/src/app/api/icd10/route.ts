import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

export interface ICD10Code {
  code: string;
  description: string;
  category: string;
}

export interface ICD10Data {
  codes: ICD10Code[];
  categories: {
    [key: string]: ICD10Code[];
  };
  // Organized by common dental conditions for easy lookup
  mappings: {
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
  };
}

let cachedData: ICD10Data | null = null;

function parseExcelFile(): ICD10Data {
  if (cachedData) {
    return cachedData;
  }

  const filePath = path.join(process.cwd(), 'public', 'derec-as-is.xlsx');
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

  const codes: ICD10Code[] = [];
  const categories: { [key: string]: ICD10Code[] } = {};
  let currentCategory = 'GENERAL';

  for (const row of jsonData) {
    if (!row || row.length < 2) continue;
    
    const col1 = String(row[0] || '').trim();
    const col2 = String(row[1] || '').trim();
    
    // If first column is empty but second has content, it's a category header
    if (!col1 && col2) {
      currentCategory = col2.toUpperCase();
      if (!categories[currentCategory]) {
        categories[currentCategory] = [];
      }
      continue;
    }
    
    // If first column has a code pattern (starts with letter followed by numbers)
    if (col1 && /^[A-Z]\d/.test(col1)) {
      const code: ICD10Code = {
        code: col1,
        description: col2,
        category: currentCategory
      };
      codes.push(code);
      
      if (!categories[currentCategory]) {
        categories[currentCategory] = [];
      }
      categories[currentCategory].push(code);
    }
  }

  // Create mappings for common lookups
  const findCode = (codeStr: string): ICD10Code => {
    return codes.find(c => c.code === codeStr) || { code: codeStr, description: 'Not found', category: 'UNKNOWN' };
  };

  const mappings: ICD10Data['mappings'] = {
    decay: {
      enamel: findCode('K02.0'),
      dentin: findCode('K02.1'),
      cementum: findCode('K02.2'),
      pulpExposure: findCode('K02.5'),
      unspecified: findCode('K02.9'),
    },
    pulp: {
      reversiblePulpitis: findCode('K0401'),
      irreversiblePulpitis: findCode('K0402'),
      necrosis: findCode('K04.1'),
      acutePeriodontitis: findCode('K04.4'),
      chronicPeriodontitis: findCode('K04.5'),
      abscessWithSinus: findCode('K04.6'),
      abscessWithoutSinus: findCode('K04.7'),
    },
    fracture: {
      tooth: findCode('S02.5'),
      crackedTooth: findCode('K0381'),
    },
    periodontal: {
      acuteGingivitis: findCode('K05.0'),
      chronicGingivitis: findCode('K05.1'),
      chronicPeriodontitis: findCode('K05.3'),
      aggressivePeriodontitis: findCode('K05.2'),
      gingivalRecession: findCode('K06.0'),
    },
    restoration: {
      openMargins: findCode('K0851'),
      overhanging: findCode('K0852'),
      fracturedWithLoss: findCode('K08531'),
      fracturedWithoutLoss: findCode('K08530'),
      poorAesthetic: findCode('K0856'),
      other: findCode('K0859'),
    },
    other: {
      attrition: findCode('K03.0'),
      abrasion: findCode('K03.1'),
      erosion: findCode('K03.2'),
      sensitiveDentin: findCode('K03.8'),
      discoloration: findCode('K03.7'),
    }
  };

  cachedData = { codes, categories, mappings };
  return cachedData;
}

export async function GET() {
  try {
    const data = parseExcelFile();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return NextResponse.json(
      { error: 'Failed to read ICD-10 data' },
      { status: 500 }
    );
  }
}

// Also export a function to search codes
export async function POST(request: Request) {
  try {
    const { query, category } = await request.json();
    const data = parseExcelFile();
    
    let results = data.codes;
    
    if (category) {
      results = results.filter(c => c.category === category.toUpperCase());
    }
    
    if (query) {
      const searchLower = query.toLowerCase();
      results = results.filter(c => 
        c.code.toLowerCase().includes(searchLower) || 
        c.description.toLowerCase().includes(searchLower)
      );
    }
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error searching ICD-10 codes:', error);
    return NextResponse.json(
      { error: 'Failed to search ICD-10 data' },
      { status: 500 }
    );
  }
}

