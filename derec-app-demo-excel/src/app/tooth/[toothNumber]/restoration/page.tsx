"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDentalStore, FillingMaterial, QualityType, QualityDetail, CrownType, CrownBase, ImplantType } from "@/store/dentalStore";
import { useDentalData, SURFACE_AREAS } from "@/lib/dentalData";
import Sidebar from "@/components/Sidebar";

// Helper functions for tooth images
const getBuccalImagePath = (toothNumber: number): string => {
  const mappedNumber = getMappedToothNumber(toothNumber);
  return `/teeth/permanent-buc/buccal.${mappedNumber}.svg`;
};

const getIncisalImagePath = (toothNumber: number): string => {
  const mappedNumber = getMappedToothNumber(toothNumber);
  return `/teeth/permanent-inc/incisal.${mappedNumber}.svg`;
};

const getLingualImagePath = (toothNumber: number): string => {
  const mappedNumber = getMappedToothNumber(toothNumber);
  return `/teeth/permenant-lin/${mappedNumber}.svg`;
};

const getMappedToothNumber = (toothNumber: number): number => {
  if (toothNumber >= 21 && toothNumber <= 28) return toothNumber - 10;
  if (toothNumber >= 31 && toothNumber <= 38) return toothNumber + 10;
  return toothNumber;
};

const shouldMirrorHorizontally = (toothNumber: number): boolean => {
  return (toothNumber >= 21 && toothNumber <= 28) || (toothNumber >= 31 && toothNumber <= 38);
};

// Icon Components
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// Surface checkbox component
const SurfaceCheckbox = ({ 
  surfaceId, 
  label, 
  checked, 
  onChange, 
  className = "" 
}: { 
  surfaceId: number; 
  label: string; 
  checked: boolean; 
  onChange: () => void;
  className?: string;
}) => (
  <label className={`relative cursor-pointer ${className}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="sr-only peer"
    />
    <div className={`border-2 rounded-lg transition-all flex items-center justify-center h-full ${
      checked 
        ? 'border-[#2196F3] bg-blue-50' 
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <span className={`text-xs font-medium text-center px-1 ${checked ? 'text-[#2196F3]' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  </label>
);

// Option button component
const OptionButton = ({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-2.5 text-sm font-medium rounded-lg border-2 transition-all text-center ${className} ${
      selected
        ? 'border-[#2196F3] bg-[#2196F3] text-white'
        : 'border-gray-200 text-[#2196F3] hover:border-[#2196F3] hover:bg-blue-50/30'
    }`}
  >
    {children}
  </button>
);

export default function RestorationPage() {
  const params = useParams();
  const router = useRouter();
  const toothNumber = parseInt(params.toothNumber as string, 10);
  
  const addRestoration = useDentalStore((state) => state.addRestoration);
  
  // Load dental data from Excel file
  const { data: dentalData, loading: dentalLoading } = useDentalData();
  
  // Selection state
  const [selectedRestoration, setSelectedRestoration] = useState<string | null>(null);
  const [selectedSurfaces, setSelectedSurfaces] = useState<number[]>([]);
  
  // For Filling
  const [selectedMaterial, setSelectedMaterial] = useState<FillingMaterial | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<QualityType | null>(null);
  const [selectedQualityDetail, setSelectedQualityDetail] = useState<QualityDetail | null>(null);
  
  // For Crown
  const [selectedCrownType, setSelectedCrownType] = useState<CrownType | null>(null);
  const [selectedCrownBase, setSelectedCrownBase] = useState<CrownBase | null>(null);
  const [selectedImplantType, setSelectedImplantType] = useState<ImplantType | null>(null);
  
  // All teeth numbers for navigation
  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerLeft = [38, 37, 36, 35, 34, 33, 32, 31];
  const lowerRight = [41, 42, 43, 44, 45, 46, 47, 48];
  const allTeeth = [...upperRight, ...upperLeft, ...lowerLeft, ...lowerRight];
  
  const mirrorH = shouldMirrorHorizontally(toothNumber);
  
  // Reset selections when restoration type changes
  useEffect(() => {
    setSelectedSurfaces([]);
    setSelectedMaterial(null);
    setSelectedQuality(null);
    setSelectedQualityDetail(null);
    setSelectedCrownType(null);
    setSelectedCrownBase(null);
    setSelectedImplantType(null);
  }, [selectedRestoration]);
  
  const toggleSurface = (surface: number) => {
    setSelectedSurfaces(prev => 
      prev.includes(surface) 
        ? prev.filter(s => s !== surface)
        : [...prev, surface]
    );
  };

  const handleClose = () => {
    router.push(`/tooth/${toothNumber}`);
  };

  const getICD10Code = (): { code: string; description: string } | null => {
    // Insufficient quality restoration
    if (selectedQuality === 'Insufficient') {
      return { code: 'K08.53', description: 'Fractured dental restorative material' };
    }
    
    // Crown types
    if (selectedRestoration === 'crown') {
      if (selectedCrownType === 'Abutment') {
        return { code: 'K08.1', description: 'Bridge support' };
      }
      if (selectedCrownType === 'Pontic') {
        return { code: 'K08.4', description: 'Replaces missing tooth' };
      }
    }
    
    return null;
  };

  const handleSave = (action: 'monitor' | 'treat') => {
    if (!selectedRestoration) {
      alert('Please select a restoration type');
      return;
    }
    
    // Surface selection is optional
    
    const icd = getICD10Code();
    
    addRestoration({
      toothNumber,
      type: selectedRestoration as 'filling' | 'veneer' | 'crown',
      surfaces: selectedSurfaces,
      material: selectedMaterial || undefined,
      quality: selectedQuality || undefined,
      qualityDetail: selectedQualityDetail || undefined,
      crownType: selectedCrownType || undefined,
      crownBase: selectedCrownBase || undefined,
      implantType: selectedImplantType || undefined,
      action,
      icdCode: icd?.code,
      icdDescription: icd?.description,
    });
    
    router.push('/diagnosis');
  };

  // Get options for current restoration type
  const getOptionsForRestoration = () => {
    if (selectedRestoration === 'filling') {
      return (
        <div className="space-y-4">
          {/* Material Selection */}
          <div>
            <p className="text-sm text-gray-600 mb-2 font-medium">Material:</p>
            <div className="flex gap-2 flex-wrap">
              {(['Composite', 'Ceramic', 'Amalgam', 'Gold', 'Non-Precious Metal', 'Temporary'] as FillingMaterial[]).map((material) => (
                <OptionButton
                  key={material}
                  selected={selectedMaterial === material}
                  onClick={() => setSelectedMaterial(material)}
                >
                  {material}
                </OptionButton>
              ))}
            </div>
          </div>
          
          {/* Quality Selection */}
          {selectedMaterial && (
            <div>
              <p className="text-sm text-gray-600 mb-2 font-medium">Quality:</p>
              <div className="flex gap-2 flex-wrap">
                {(['Sufficient', 'Uncertain', 'Insufficient'] as QualityType[]).map((quality) => (
                  <OptionButton
                    key={quality}
                    selected={selectedQuality === quality}
                    onClick={() => {
                      setSelectedQuality(quality);
                      if (quality !== 'Insufficient') {
                        setSelectedQualityDetail(null);
                      }
                    }}
                  >
                    {quality}
                  </OptionButton>
                ))}
              </div>
            </div>
          )}
          
          {/* Quality Detail - shows when Insufficient is selected */}
          {selectedQuality === 'Insufficient' && (
            <div>
              <p className="text-sm text-gray-600 mb-2 font-medium">Detail:</p>
              <div className="flex gap-2 flex-wrap">
                {(['Overhang', 'Flush', 'Shortfall'] as QualityDetail[]).map((detail) => (
                  <OptionButton
                    key={detail}
                    selected={selectedQualityDetail === detail}
                    onClick={() => setSelectedQualityDetail(detail)}
                  >
                    {detail}
                  </OptionButton>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    if (selectedRestoration === 'veneer') {
      return (
        <div className="space-y-4">
          {/* Material Selection */}
          <div>
            <p className="text-sm text-gray-600 mb-2 font-medium">Material:</p>
            <div className="flex gap-2 flex-wrap">
              {(['Composite', 'Ceramic'] as FillingMaterial[]).map((material) => (
                <OptionButton
                  key={material}
                  selected={selectedMaterial === material}
                  onClick={() => setSelectedMaterial(material)}
                >
                  {material}
                </OptionButton>
              ))}
            </div>
          </div>
          
          {/* Quality Selection */}
          {selectedMaterial && (
            <div>
              <p className="text-sm text-gray-600 mb-2 font-medium">Quality:</p>
              <div className="flex gap-2 flex-wrap">
                {(['Sufficient', 'Uncertain', 'Insufficient'] as QualityType[]).map((quality) => (
                  <OptionButton
                    key={quality}
                    selected={selectedQuality === quality}
                    onClick={() => setSelectedQuality(quality)}
                  >
                    {quality}
                  </OptionButton>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    if (selectedRestoration === 'crown') {
      return (
        <div className="space-y-4">
          {/* Material Selection */}
          <div>
            <p className="text-sm text-gray-600 mb-2 font-medium">Material:</p>
            <div className="flex gap-2 flex-wrap">
              {(['Composite', 'Ceramic', 'Gold', 'Non-Precious Metal'] as FillingMaterial[]).map((material) => (
                <OptionButton
                  key={material}
                  selected={selectedMaterial === material}
                  onClick={() => setSelectedMaterial(material)}
                >
                  {material}
                </OptionButton>
              ))}
            </div>
          </div>
          
          {/* Crown Type Selection */}
          {selectedMaterial && (
            <div>
              <p className="text-sm text-gray-600 mb-2 font-medium">Crown Type:</p>
              <div className="flex gap-2 flex-wrap">
                {(['Single Crown', 'Abutment', 'Pontic'] as CrownType[]).map((type) => (
                  <OptionButton
                    key={type}
                    selected={selectedCrownType === type}
                    onClick={() => {
                      setSelectedCrownType(type);
                      if (type === 'Pontic') {
                        setSelectedCrownBase(null);
                        setSelectedImplantType(null);
                      }
                    }}
                  >
                    {type}
                  </OptionButton>
                ))}
              </div>
            </div>
          )}
          
          {/* Crown Base - not shown for Pontic */}
          {selectedCrownType && selectedCrownType !== 'Pontic' && (
            <div>
              <p className="text-sm text-gray-600 mb-2 font-medium">Crown Base:</p>
              <div className="flex gap-2 flex-wrap">
                {(['Natural', 'Implant'] as CrownBase[]).map((base) => (
                  <OptionButton
                    key={base}
                    selected={selectedCrownBase === base}
                    onClick={() => {
                      setSelectedCrownBase(base);
                      if (base === 'Natural') {
                        setSelectedImplantType(null);
                      }
                    }}
                  >
                    {base}
                  </OptionButton>
                ))}
              </div>
            </div>
          )}
          
          {/* Implant Type - only when Implant base is selected */}
          {selectedCrownBase === 'Implant' && (
            <div>
              <p className="text-sm text-gray-600 mb-2 font-medium">Implant Type:</p>
              <div className="flex gap-2 flex-wrap">
                {(['Bone level', 'Tissue level'] as ImplantType[]).map((type) => (
                  <OptionButton
                    key={type}
                    selected={selectedImplantType === type}
                    onClick={() => setSelectedImplantType(type)}
                  >
                    {type}
                  </OptionButton>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  // Display ICD-10 preview
  const icdPreview = getICD10Code();

  if (dentalLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F7FA]">
        <div className="text-gray-500">Loading dental data...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F5F7FA] font-sans">
      {/* Left Sidebar */}
      <Sidebar backHref={`/tooth/${toothNumber}`} />

      {/* Tooth Navigation Sidebar */}
      <div className="w-14 bg-white border-r border-gray-200 overflow-y-auto shrink-0">
        <div className="py-1">
          {allTeeth.map((tooth) => (
            <Link
              key={tooth}
              href={`/tooth/${tooth}/restoration`}
              className={`block px-2 py-1.5 text-sm text-center font-medium transition-colors ${
                tooth === toothNumber
                  ? 'bg-blue-50 text-[#2196F3] border-l-4 border-[#2196F3]'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-[#2196F3]'
              }`}
            >
              {tooth}
            </Link>
          ))}
        </div>
      </div>

      {/* Tooth Display Area */}
      <div className="w-[170px] bg-[#f8f9fa] border-r border-gray-200 flex flex-col items-center justify-center py-2 px-3 h-full">
        <div className="flex-1 flex flex-col items-center justify-end">
          <Image src={getBuccalImagePath(toothNumber)} alt={`Tooth ${toothNumber} buccal`} width={100} height={100} className="object-contain" style={{ transform: mirrorH ? 'scaleX(-1)' : undefined }} />
        </div>
        <div className="flex flex-col items-center justify-center py-2">
          <Image src={getIncisalImagePath(toothNumber)} alt={`Tooth ${toothNumber} occlusal`} width={90} height={80} className="object-contain" style={{ transform: mirrorH ? 'scaleX(-1)' : undefined }} />
        </div>
        <div className="flex-1 flex flex-col items-center justify-start">
          <Image src={getLingualImagePath(toothNumber)} alt={`Tooth ${toothNumber} lingual`} width={100} height={100} className="object-contain" style={{ transform: 'scaleX(-1) scaleY(-1)' }} />
        </div>
      </div>

      {/* Tooth Surface Selection Grid - for filling and veneer */}
      {selectedRestoration && selectedRestoration !== 'crown' && (
        <div className="flex-1 flex items-center justify-center bg-white p-6 overflow-auto">
          <div className="grid gap-3">
            <SurfaceCheckbox surfaceId={1} label={SURFACE_AREAS[1].label} checked={selectedSurfaces.includes(1)} onChange={() => toggleSurface(1)} className="w-[280px] h-[50px]" />
            <div className="flex justify-center">
              <SurfaceCheckbox surfaceId={2} label={SURFACE_AREAS[2].label} checked={selectedSurfaces.includes(2)} onChange={() => toggleSurface(2)} className="w-[75px] h-[75px]" />
            </div>
            <div className="flex justify-center gap-3">
              <SurfaceCheckbox surfaceId={3} label={SURFACE_AREAS[3].label} checked={selectedSurfaces.includes(3)} onChange={() => toggleSurface(3)} className="w-[75px] h-[75px]" />
              <SurfaceCheckbox surfaceId={4} label={SURFACE_AREAS[4].label} checked={selectedSurfaces.includes(4)} onChange={() => toggleSurface(4)} className="w-[75px] h-[75px]" />
              <SurfaceCheckbox surfaceId={5} label={SURFACE_AREAS[5].label} checked={selectedSurfaces.includes(5)} onChange={() => toggleSurface(5)} className="w-[75px] h-[75px]" />
            </div>
            <div className="flex justify-center">
              <SurfaceCheckbox surfaceId={6} label={SURFACE_AREAS[6].label} checked={selectedSurfaces.includes(6)} onChange={() => toggleSurface(6)} className="w-[75px] h-[75px]" />
            </div>
            <SurfaceCheckbox surfaceId={7} label={SURFACE_AREAS[7].label} checked={selectedSurfaces.includes(7)} onChange={() => toggleSurface(7)} className="w-[280px] h-[50px]" />
            <div className="flex justify-center gap-3">
              <SurfaceCheckbox surfaceId={8} label={SURFACE_AREAS[8].label} checked={selectedSurfaces.includes(8)} onChange={() => toggleSurface(8)} className="w-[130px] h-[70px]" />
              <SurfaceCheckbox surfaceId={9} label={SURFACE_AREAS[9].label} checked={selectedSurfaces.includes(9)} onChange={() => toggleSurface(9)} className="w-[130px] h-[70px]" />
            </div>
            <div className="flex justify-center gap-3">
              <SurfaceCheckbox surfaceId={10} label={SURFACE_AREAS[10].label} checked={selectedSurfaces.includes(10)} onChange={() => toggleSurface(10)} className="w-[130px] h-[70px]" />
              <SurfaceCheckbox surfaceId={11} label={SURFACE_AREAS[11].label} checked={selectedSurfaces.includes(11)} onChange={() => toggleSurface(11)} className="w-[130px] h-[70px]" />
            </div>
          </div>
        </div>
      )}
      
      {/* Crown doesn't need surface selection */}
      {selectedRestoration === 'crown' && (
        <div className="flex-1 flex items-center justify-center bg-white p-6">
          <p className="text-gray-400 text-sm">Crown covers the entire tooth - select options from the right panel</p>
        </div>
      )}
      
      {/* Placeholder when no restoration selected */}
      {!selectedRestoration && (
        <div className="flex-1 flex items-center justify-center bg-white p-6">
          <p className="text-gray-400 text-sm">Select a restoration type to begin</p>
        </div>
      )}

      {/* Right Panel - Restoration Selection */}
      <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-2xl font-light text-gray-800">Restoration</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <CloseIcon />
          </button>
        </div>
        
        {/* Restoration Type Buttons */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { id: 'filling', name: 'Filling' },
              { id: 'veneer', name: 'Veneer' },
              { id: 'crown', name: 'Crown' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedRestoration(type.id)}
                className={`px-3 py-3 text-sm font-medium rounded-lg border-2 transition-all text-center ${
                  selectedRestoration === type.id
                    ? 'border-[#2196F3] bg-[#2196F3] text-white'
                    : 'border-gray-200 text-[#2196F3] hover:border-[#2196F3] hover:bg-blue-50/30'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
          
          {/* Dynamic Options based on selected restoration */}
          {selectedRestoration && (
            <div className="border-t border-gray-100 pt-4">
              {getOptionsForRestoration()}
            </div>
          )}
        </div>
        
        {/* Selection Summary & ICD-10 Preview */}
        {(selectedSurfaces.length > 0 || icdPreview) && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
            {selectedSurfaces.length > 0 && (
              <>
                <p className="text-xs text-gray-500 mb-1">Selected surfaces:</p>
                <p className="text-sm text-gray-700 mb-2">
                  {selectedSurfaces.map(s => SURFACE_AREAS[s as keyof typeof SURFACE_AREAS]?.label).join(', ')}
                </p>
              </>
            )}
            {icdPreview && (
              <div className="bg-blue-50 rounded-lg p-2 mt-2">
                <p className="text-xs text-blue-600 font-medium">ICD-10: {icdPreview.code}</p>
                <p className="text-xs text-blue-500">{icdPreview.description}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex gap-3">
            <button 
              onClick={() => handleSave('monitor')}
              className="flex-1 py-3 px-4 bg-[#FFC107] hover:bg-[#FFB300] text-white font-semibold rounded-lg transition-colors"
            >
              MONITOR
            </button>
            <button 
              onClick={() => handleSave('treat')}
              className="flex-1 py-3 px-4 bg-[#F44336] hover:bg-[#E53935] text-white font-semibold rounded-lg transition-colors"
            >
              TREAT
            </button>
            <button 
              onClick={() => handleSave('treat')}
              className="flex-1 py-3 px-4 bg-[#2196F3] hover:bg-[#1E88E5] text-white font-semibold rounded-lg transition-colors"
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
