"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import QuickDiagnosisToolbar from "@/components/QuickDiagnosisToolbar";
import { DiagnosisCondition } from "@/lib/easyDiagnosis";
import { useDentalStore } from "@/store/dentalStore";
import Sidebar from "@/components/Sidebar";

// Helper function to get the buccal (frontal) image path for a tooth
const getBuccalImagePath = (toothNumber: number): string => {
  // Map left-side teeth to their right-side equivalents for mirroring
  const mappedNumber = getMappedToothNumber(toothNumber);
  return `/teeth/permanent-buc/buccal.${mappedNumber}.svg`;
};

// Helper function to get the incisal (occlusal) image path for a tooth
const getIncisalImagePath = (toothNumber: number): string => {
  const mappedNumber = getMappedToothNumber(toothNumber);
  return `/teeth/permanent-inc/incisal.${mappedNumber}.svg`;
};

// Map left-side teeth to their right-side equivalents
const getMappedToothNumber = (toothNumber: number): number => {
  // Upper left (21-28) maps to upper right (11-18)
  if (toothNumber >= 21 && toothNumber <= 28) {
    return toothNumber - 10; // 21->11, 22->12, etc.
  }
  // Lower left (31-38) maps to lower right (41-48)
  if (toothNumber >= 31 && toothNumber <= 38) {
    return toothNumber + 10; // 31->41, 32->42, etc.
  }
  return toothNumber;
};

// Check if tooth should be mirrored horizontally (left-side teeth)
const shouldMirrorHorizontally = (toothNumber: number): boolean => {
  return (toothNumber >= 21 && toothNumber <= 28) || (toothNumber >= 31 && toothNumber <= 38);
};

// Lower teeth should NOT be flipped - they're already in correct orientation
// We removed the vertical flip as the images show crowns correctly

// Get tooth dimensions based on type
const getToothDimensions = (toothNumber: number, viewType: 'buccal' | 'incisal'): { width: number; height: number } => {
  const baseNumber = getMappedToothNumber(toothNumber);
  const isMolar = [16, 17, 18, 46, 47, 48].includes(baseNumber);
  const isPremolar = [14, 15, 44, 45].includes(baseNumber);
  const isCanine = [13, 43].includes(baseNumber);
  const isLateralIncisor = [12, 42].includes(baseNumber);
  const isCentralIncisor = [11, 41].includes(baseNumber);

  if (viewType === 'buccal') {
    if (isMolar) return { width: 50, height: 75 };
    if (isPremolar) return { width: 38, height: 70 };
    if (isCanine) return { width: 32, height: 78 };
    if (isLateralIncisor) return { width: 28, height: 68 };
    if (isCentralIncisor) return { width: 32, height: 70 };
    return { width: 35, height: 70 };
  } else {
    if (isMolar) return { width: 48, height: 42 };
    if (isPremolar) return { width: 36, height: 32 };
    if (isCanine) return { width: 28, height: 28 };
    if (isLateralIncisor) return { width: 24, height: 22 };
    if (isCentralIncisor) return { width: 28, height: 26 };
    return { width: 30, height: 28 };
  }
};

// Icon Components
const UpperJawIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 16c0-6 4-10 8-10s8 4 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="8" cy="14" r="1.5" fill="currentColor" />
    <circle cx="12" cy="11" r="1.5" fill="currentColor" />
    <circle cx="16" cy="14" r="1.5" fill="currentColor" />
  </svg>
);

const FullMouthIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="7" cy="6" r="2" />
    <circle cx="12" cy="5" r="2" />
    <circle cx="17" cy="6" r="2" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="12" cy="19" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

const LowerJawIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 8c0 6 4 10 8 10s8-4 8-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="8" cy="10" r="1.5" fill="currentColor" />
    <circle cx="12" cy="13" r="1.5" fill="currentColor" />
    <circle cx="16" cy="10" r="1.5" fill="currentColor" />
  </svg>
);

const RollbackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const LegendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 8h3M7 12h3M7 16h3" />
    <circle cx="16" cy="8" r="1" fill="currentColor" />
    <circle cx="16" cy="12" r="1" fill="currentColor" />
    <circle cx="16" cy="16" r="1" fill="currentColor" />
  </svg>
);

// Tooth component using actual images
const ToothBuccal = ({ 
  number, 
  isUpper, 
  isSelected, 
  onClick 
}: { 
  number: number; 
  isUpper: boolean; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  const dimensions = getToothDimensions(number, 'buccal');
  const mirrorH = shouldMirrorHorizontally(number);
  
  // Only mirror horizontally for left teeth - no vertical flip needed
  const transform = mirrorH ? 'scaleX(-1)' : undefined;
  
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center transition-all hover:scale-105 ${
        isUpper ? 'hover:-translate-y-1' : 'hover:translate-y-1'
      } ${isSelected ? 'ring-2 ring-[#2196F3] ring-offset-1 rounded-lg bg-blue-50/50' : ''}`}
      style={{ 
        width: dimensions.width, 
        height: dimensions.height,
      }}
    >
        <Image
        src={getBuccalImagePath(number)}
        alt={`Tooth ${number}`}
        width={dimensions.width}
        height={dimensions.height}
        className="object-contain"
        style={{ 
          transform: transform
        }}
      />
    </button>
  );
};

const ToothIncisal = ({ 
  number, 
  isSelected, 
  onClick 
}: { 
  number: number; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  const dimensions = getToothDimensions(number, 'incisal');
  const mirrorH = shouldMirrorHorizontally(number);
  
  return (
    <button
      onClick={onClick}
      className={`relative flex m-[2px] items-center justify-center transition-all hover:scale-110 ${
        isSelected ? 'ring-2 ring-[#2196F3] rounded-full' : ''
      }`}
      style={{ 
        width: dimensions.width, 
        height: dimensions.height,
      }}
          >
            <Image
        src={getIncisalImagePath(number)}
        alt={`Tooth ${number} occlusal`}
        width={dimensions.width}
        height={dimensions.height}
        className="object-contain"
        style={{ 
          transform: mirrorH ? 'scaleX(-1)' : undefined
        }}
      />
    </button>
  );
};

export default function DentalChart() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [jawView, setJawView] = useState("full");
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [lastClickedTooth, setLastClickedTooth] = useState<number | null>(null);

  const addPathology = useDentalStore((state) => state.addPathology);

  const tabs = ["Overview", "Quickselect", "Periodontal Probing", "Pathology", "Restoration"];

  // Handle condition selection from the toolbar - save directly
  const handleConditionSelect = (condition: DiagnosisCondition) => {
    // Add to store with ICD code from Excel - save directly without confirmation
    addPathology({
      toothNumber: selectedTooth || 0,
      type: 'caries', // Generic type, the real diagnosis is in the ICD code
      surfaces: [],
      action: 'monitor', // Default action
      icdCode: condition.icdCode,
      icdDescription: `${condition.condition} - ${condition.description}`,
    });
  };
  
  // Upper jaw teeth (right to left from patient's perspective)
  const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  // Lower jaw teeth (right to left from patient's perspective)
  const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  const patientName = "Mahmoud";

  const handleToothClick = useCallback((tooth: number) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;
    
    // Double-click detection (within 300ms on the same tooth)
    if (timeDiff < 300 && lastClickedTooth === tooth) {
      // Double-click: navigate to tooth detail page
      router.push(`/tooth/${tooth}`);
    } else {
      // Single click: toggle selection
      setSelectedTooth(selectedTooth === tooth ? null : tooth);
    }
    
    setLastClickTime(currentTime);
    setLastClickedTooth(tooth);
  }, [lastClickTime, lastClickedTooth, selectedTooth, router]);

  return (
    <div className="flex h-screen bg-[#F5F7FA] font-sans">
      {/* Left Sidebar */}
      <Sidebar showBack={false} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white relative">
        {/* Header */}
        <header className="px-8 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">{patientName}</h1>
            
            <div className="flex items-center gap-4">
              {/* Tabs */}
              <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-100">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all ${
                      activeTab === tab
                        ? "bg-[#2196F3] text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              {/* BPE Button */}
              <button className="px-5 py-2.5 text-[#2196F3] font-semibold text-sm hover:bg-blue-50 rounded-lg transition-colors tracking-wide">
                BASIC PERIODONTAL EXAMINATION
              </button>
            </div>
          </div>
        </header>

        {/* Dental Chart Area */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-6 overflow-auto flex flex-col">
            {/* Jaw View Selector */}
            <div className="flex justify-center mb-4">
              <div className="flex bg-gray-50 rounded-xl p-1.5 gap-1 border border-gray-100 shadow-sm">
                <button
                  onClick={() => setJawView("upper")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${
                    jawView === "upper" 
                      ? "bg-white shadow-sm text-[#2196F3] border border-gray-100" 
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <UpperJawIcon />
                  <span className="text-sm font-medium">Upper Jaw</span>
                </button>
                <button
                  onClick={() => setJawView("full")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${
                    jawView === "full" 
                      ? "bg-white shadow-sm text-[#2196F3] border border-gray-100" 
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <FullMouthIcon />
                  <span className="text-sm font-medium">Full mouth</span>
                </button>
                <button
                  onClick={() => setJawView("lower")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${
                    jawView === "lower" 
                      ? "bg-white shadow-sm text-[#2196F3] border border-gray-100" 
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <LowerJawIcon />
                  <span className="text-sm font-medium">Lower Jaw</span>
                </button>
              </div>
            </div>

            {/* Quick Diagnosis Toolbar */}
            <div className="flex justify-center mb-6 mt-2">
              <QuickDiagnosisToolbar 
                selectedTooth={selectedTooth}
                onSelectCondition={handleConditionSelect}
              />
            </div>

            {/* Dental Chart */}
            <div className="flex flex-col items-center gap-2 flex-1 justify-center min-h-0">
              {/* Upper Jaw */}
              {(jawView === "full" || jawView === "upper") && (
                <div className="flex flex-col items-center">
                  {/* Upper Teeth - Frontal View */}
                  <div className="relative flex items-end justify-center">
                    {upperTeeth.map((tooth) => (
                      <ToothBuccal
                        key={tooth}
                        number={tooth}
                        isUpper={true}
                        isSelected={selectedTooth === tooth}
                        onClick={() => handleToothClick(tooth)}
                      />
                    ))}
                  </div>
                  
                  {/* Upper Teeth - Occlusal View */}
                  <div className="flex items-center justify-center p-2 mt-8">
                    {upperTeeth.map((tooth) => (
                      <ToothIncisal
                        key={`occ-${tooth}`}
                        number={tooth}
                        isSelected={selectedTooth === tooth}
                        onClick={() => handleToothClick(tooth)}
                      />
                    ))}
                  </div>
                  
                  {/* Upper Tooth Numbers */}
                  <div className="flex items-center justify-center mt-1">
                    {upperTeeth.map((tooth) => {
                      const dims = getToothDimensions(tooth, 'buccal');
                      return (
                        <button
                          key={`num-${tooth}`}
                          onClick={() => handleToothClick(tooth)}
                          style={{ width: dims.width }}
                          className={`h-6 flex items-center justify-center text-xs font-semibold transition-all ${
                            selectedTooth === tooth
                              ? "text-[#2196F3] bg-blue-50 rounded-md"
                              : "text-gray-500 hover:text-[#2196F3]"
                          }`}
                        >
                          {tooth}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Separator Line */}
              {jawView === "full" && (
                <div className="w-full max-w-4xl border-t border-gray-200 my-2"></div>
              )}

              {/* Lower Jaw */}
              {(jawView === "full" || jawView === "lower") && (
                <div className="flex flex-col items-center">
                  {/* Lower Tooth Numbers */}
                  <div className="flex items-center justify-center mb-1">
                    {lowerTeeth.map((tooth) => {
                      const dims = getToothDimensions(tooth, 'buccal');
                      return (
                        <button
                          key={`num-${tooth}`}
                          onClick={() => handleToothClick(tooth)}
                          style={{ width: dims.width }}
                          className={`h-6 flex items-center justify-center text-xs font-semibold transition-all ${
                            selectedTooth === tooth
                              ? "text-[#2196F3] bg-blue-50 rounded-md"
                              : "text-gray-500 hover:text-[#2196F3]"
                          }`}
                        >
                          {tooth}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Lower Teeth - Occlusal View */}
                  <div className="flex items-center justify-center mb-6">
                    {lowerTeeth.map((tooth) => (
                      <ToothIncisal
                        key={`occ-${tooth}`}
                        number={tooth}
                        isSelected={selectedTooth === tooth}
                        onClick={() => handleToothClick(tooth)}
                      />
                    ))}
                  </div>
                  
                  {/* Lower Teeth - Frontal View */}
                  <div className="relative flex items-start justify-center mt-2">
                    {lowerTeeth.map((tooth) => (
                      <ToothBuccal
                        key={tooth}
                        number={tooth}
                        isUpper={false}
                        isSelected={selectedTooth === tooth}
                        onClick={() => handleToothClick(tooth)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Jaw View Icons */}
          <div className="w-16 border-l border-gray-100 flex flex-col items-center justify-center py-4">
            <div className="flex flex-col gap-1 bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm">
              <button
                onClick={() => setJawView("upper")}
                className={`w-11 h-11 flex items-center justify-center rounded-lg transition-all ${
                  jawView === "upper" ? "bg-[#2196F3] text-white shadow-md" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                }`}
                title="Upper Jaw"
              >
                <UpperJawIcon />
              </button>
              <button
                onClick={() => setJawView("full")}
                className={`w-11 h-11 flex items-center justify-center rounded-lg transition-all ${
                  jawView === "full" ? "bg-[#2196F3] text-white shadow-md" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                }`}
                title="Full mouth"
              >
                <FullMouthIcon />
              </button>
              <button
                onClick={() => setJawView("lower")}
                className={`w-11 h-11 flex items-center justify-center rounded-lg transition-all ${
                  jawView === "lower" ? "bg-[#2196F3] text-white shadow-md" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                }`}
                title="Lower Jaw"
              >
                <LowerJawIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="absolute bottom-6 right-24 flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600">
            <RollbackIcon />
            <span className="text-sm font-medium">Open rollback</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600">
            <LegendIcon />
            <span className="text-sm font-medium">Show legend</span>
          </button>
        </div>

      </main>
    </div>
  );
}
