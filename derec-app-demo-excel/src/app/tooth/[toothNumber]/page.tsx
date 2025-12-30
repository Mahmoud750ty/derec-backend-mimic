"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDentalStore, useDentalDataStore, EndodonticTestType, EndodonticResult } from "@/store/dentalStore";
import Sidebar from "@/components/Sidebar";

// Helper functions
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

const isUpperTooth = (toothNumber: number): boolean => {
  return (toothNumber >= 11 && toothNumber <= 18) || (toothNumber >= 21 && toothNumber <= 28);
};

// Icon Components
const ResetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
  </svg>
);

const ExtractedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 8v8" />
  </svg>
);

const MissingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
  </svg>
);

const PlusCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
  </svg>
);

const ColdIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
  </svg>
);

const PercussionIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v8M8 6l4 4 4-4" /><rect x="6" y="14" width="12" height="6" rx="1" />
  </svg>
);

const PalpationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 11V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v5" /><path d="M14 10V6" /><path d="M6 11a6 6 0 0012 0v7a2 2 0 01-2 2H8a2 2 0 01-2-2v-7z" />
  </svg>
);

const HeatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c-4 0-8 4-8 8 0 6 8 12 8 12s8-6 8-12c0-4-4-8-8-8z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const ElectricityIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// Enhanced Endodontic Test Modal with sub-options from Excel
const EndodonticTestModal = ({
  testType,
  toothNumber,
  currentResult,
  currentPositiveDetail,
  onClose,
  onSave,
}: {
  testType: EndodonticTestType;
  toothNumber: number;
  currentResult: EndodonticResult;
  currentPositiveDetail?: string;
  onClose: () => void;
  onSave: (result: EndodonticResult, positiveDetail?: string) => void;
}) => {
  const [selectedResult, setSelectedResult] = useState<EndodonticResult>(currentResult);
  const [selectedPositiveDetail, setSelectedPositiveDetail] = useState<string | undefined>(currentPositiveDetail);
  
  // Primary results based on test type
  const getPrimaryResults = () => {
    if (testType === 'cold' || testType === 'heat') {
      return [
        { id: 'positive', label: 'Positive', color: 'bg-green-500' },
        { id: 'uncertain', label: 'Uncertain', color: 'bg-yellow-500' },
        { id: 'negative', label: 'Negative', color: 'bg-red-500', icdCode: 'K04.1', icdDesc: 'Necrosis of pulp' },
        { id: 'not-applicable', label: 'Not Applicable', color: 'bg-gray-400' },
      ];
    }
    if (testType === 'percussion' || testType === 'palpation') {
      return [
        { id: 'not-painful', label: 'Not Painful', color: 'bg-green-500' },
        { id: 'unpleasant', label: 'Unpleasant', color: 'bg-yellow-500', icdCode: 'K04.4', icdDesc: 'Symptomatic apical periodontitis' },
        { id: 'painful', label: 'Painful', color: 'bg-red-500', icdCode: testType === 'palpation' ? 'K04.5' : 'K04.4', icdDesc: testType === 'palpation' ? 'Chronic apical periodontitis' : 'Symptomatic apical periodontitis' },
      ];
    }
    // Electricity test - shows scale 1-10
    return [];
  };
  
  // Positive detail options (for Cold and Heat tests)
  const positiveDetails = [
    { id: 'within-limits', label: 'Within Limits', color: 'bg-green-100 text-green-700 border-green-300' },
    { id: 'unpleasant', label: 'Unpleasant', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { id: 'pain-stimulus', label: 'Pain (Stimulus)', color: 'bg-orange-100 text-orange-700 border-orange-300', icdCode: 'K04.01', icdDesc: 'Reversible pulpitis' },
    { id: 'pain-lingering', label: 'Pain (Lingering)', color: 'bg-red-100 text-red-700 border-red-300', icdCode: 'K04.02', icdDesc: 'Irreversible pulpitis' },
  ];
  
  const primaryResults = getPrimaryResults();
  const showPositiveDetail = (testType === 'cold' || testType === 'heat') && selectedResult === 'positive';
  const showElectricityScale = testType === 'electricity';
  
  // Get current ICD code based on selection
  const getSelectedICD = () => {
    if (showPositiveDetail && selectedPositiveDetail) {
      const detail = positiveDetails.find(d => d.id === selectedPositiveDetail);
      if (detail && 'icdCode' in detail) {
        return { code: detail.icdCode, desc: detail.icdDesc };
      }
    }
    const result = primaryResults.find(r => r.id === selectedResult);
    if (result && 'icdCode' in result) {
      return { code: result.icdCode, desc: result.icdDesc };
    }
    return null;
  };
  
  const selectedICD = getSelectedICD();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[450px] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 capitalize">{testType} Test</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseIcon />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">Select test result for Tooth {toothNumber}:</p>
          
          {/* Primary Results */}
          {!showElectricityScale ? (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {primaryResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => {
                    setSelectedResult(result.id as EndodonticResult);
                    if (result.id !== 'positive') {
                      setSelectedPositiveDetail(undefined);
                    }
                  }}
                  className={`px-4 py-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                    selectedResult === result.id
                      ? 'border-[#2196F3] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${result.color}`}></span>
                  <span className="text-sm font-medium text-gray-700">{result.label}</span>
                </button>
              ))}
            </div>
          ) : (
            /* Electricity Test - Scale 1-10 */
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Select EPT Reading (1-10):</p>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => {
                  const getColor = () => {
                    if (val <= 3) return 'bg-red-500'; // Hyperresponsive
                    if (val <= 6) return 'bg-green-500'; // Normal
                    if (val <= 9) return 'bg-orange-500'; // Hyporesponsive
                    return 'bg-gray-500'; // No response
                  };
                  return (
                    <button
                      key={val}
                      onClick={() => setSelectedResult(val.toString() as EndodonticResult)}
                      className={`py-3 rounded-lg border-2 transition-all text-center ${
                        selectedResult === val.toString()
                          ? 'border-[#2196F3] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className={`inline-block w-3 h-3 rounded-full ${getColor()} mb-1`}></span>
                      <span className="block text-sm font-medium text-gray-700">{val}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>1-3: Hyperresponsive</span>
                <span>4-6: Normal</span>
                <span>7-9: Hyporesponsive</span>
                <span>10: No response</span>
              </div>
            </div>
          )}
          
          {/* Positive Detail Options */}
          {showPositiveDetail && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-600 mb-3">Specify positive response detail:</p>
              <div className="grid grid-cols-2 gap-2">
                {positiveDetails.map((detail) => (
                  <button
                    key={detail.id}
                    onClick={() => setSelectedPositiveDetail(detail.id)}
                    className={`px-3 py-2 rounded-lg border-2 transition-all text-left ${
                      selectedPositiveDetail === detail.id
                        ? `${detail.color} border-current`
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className="text-sm font-medium">{detail.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* ICD-10 Preview */}
          {selectedICD && (
            <div className="mt-4 bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-600 font-medium">ICD-10: {selectedICD.code}</p>
              <p className="text-xs text-blue-500">{selectedICD.desc}</p>
            </div>
          )}
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(selectedResult, selectedPositiveDetail);
              onClose();
            }}
            className="flex-1 py-2.5 bg-[#2196F3] text-white rounded-lg hover:bg-[#1E88E5] transition-colors font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ToothDetailPage() {
  const params = useParams();
  const toothNumber = parseInt(params.toothNumber as string, 10);
  
  // Load dental data from Excel file
  useDentalDataStore();
  
  // Store hooks
  const updateEndodontic = useDentalStore((state) => state.updateEndodontic);
  const getToothEndodontics = useDentalStore((state) => state.getToothEndodontics);
  const getToothPathologies = useDentalStore((state) => state.getToothPathologies);
  const getToothRestorations = useDentalStore((state) => state.getToothRestorations);
  const getToothPeriodontal = useDentalStore((state) => state.getToothPeriodontal);
  
  const toothEndodontics = getToothEndodontics(toothNumber);
  const toothPathologies = getToothPathologies(toothNumber);
  const toothRestorations = getToothRestorations(toothNumber);
  const toothPeriodontal = getToothPeriodontal(toothNumber);
  
  const [activeTestModal, setActiveTestModal] = useState<EndodonticTestType | null>(null);
  
  // All teeth numbers for navigation
  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerLeft = [38, 37, 36, 35, 34, 33, 32, 31];
  const lowerRight = [41, 42, 43, 44, 45, 46, 47, 48];
  const allTeeth = [...upperRight, ...upperLeft, ...lowerLeft, ...lowerRight];
  
  const isUpper = isUpperTooth(toothNumber);
  const mirrorH = shouldMirrorHorizontally(toothNumber);
  
  // Periodontal probing positions
  const upperProbingPositions = [
    { id: 'distoPalatal', label: 'Disto Palatal' },
    { id: 'palatal', label: 'Palatal' },
    { id: 'mesioPalatal', label: 'Mesio Palatal' },
    { id: 'distoBuccal', label: 'Disto Buccal' },
    { id: 'buccal', label: 'Buccal' },
    { id: 'mesioBuccal', label: 'Mesio Buccal' },
  ];
  
  const lowerProbingPositions = [
    { id: 'distoPalatal', label: 'Disto Lingual' },
    { id: 'palatal', label: 'Lingual' },
    { id: 'mesioPalatal', label: 'Mesio Lingual' },
    { id: 'distoBuccal', label: 'Disto Buccal' },
    { id: 'buccal', label: 'Buccal' },
    { id: 'mesioBuccal', label: 'Mesio Buccal' },
  ];
  
  const probingPositions = isUpper ? upperProbingPositions : lowerProbingPositions;
  
  // Endodontic tests
  const endodonticTests: { type: EndodonticTestType; icon: React.ReactNode; label: string }[] = [
    { type: 'cold', icon: <ColdIcon />, label: 'Cold' },
    { type: 'percussion', icon: <PercussionIcon />, label: 'Percussion' },
    { type: 'palpation', icon: <PalpationIcon />, label: 'Palpation' },
    { type: 'heat', icon: <HeatIcon />, label: 'Heat' },
    { type: 'electricity', icon: <ElectricityIcon />, label: 'Electricity' },
  ];
  
  const getTestResult = (testType: EndodonticTestType) => {
    const test = toothEndodontics.find(e => e.testType === testType);
    return { result: test?.result || null, positiveDetail: test?.positiveDetail };
  };

  const hasTreatments = toothPathologies.length > 0 || toothRestorations.length > 0;
  
  // Get periodontal value for a site
  const getPerioValue = (siteId: string) => {
    if (!toothPeriodontal) return { pd: 0, gm: 0 };
    const site = toothPeriodontal.sites[siteId as keyof typeof toothPeriodontal.sites];
    return { pd: site?.probingDepth || 0, gm: site?.gingivalMargin || 0 };
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] font-sans">
      {/* Left Sidebar */}
      <Sidebar backHref="/" />

      {/* Tooth Navigation Sidebar */}
      <div className="w-14 bg-white border-r border-gray-200 overflow-y-auto shrink-0">
        <div className="py-1">
          {allTeeth.map((tooth) => (
            <Link
              key={tooth}
              href={`/tooth/${tooth}`}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Header with Action Buttons */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">Dental</h2>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-[#2196F3] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                <ResetIcon /><span className="text-sm font-medium">RESET</span>
              </button>
              <button className="flex items-center gap-2 text-[#2196F3] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                <ExtractedIcon /><span className="text-sm font-medium">TO BE EXTRACTED</span>
              </button>
              <button className="flex items-center gap-2 text-[#2196F3] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                <MissingIcon /><span className="text-sm font-medium">MISSING</span>
              </button>
              <Link href={`/tooth/${toothNumber}/pathology`} className="flex items-center gap-2 text-[#2196F3] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                <PlusCircleIcon /><span className="text-sm font-medium">PATHOLOGY</span>
              </Link>
              <Link href={`/tooth/${toothNumber}/restoration`} className="flex items-center gap-2 text-[#4CAF50] hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors">
                <PlusCircleIcon /><span className="text-sm font-medium">RESTORATION</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Treatments area */}
        <div className="flex-1 flex items-center justify-center">
          {hasTreatments ? (
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                {toothPathologies.length} patholog{toothPathologies.length === 1 ? 'y' : 'ies'}, 
                {' '}{toothRestorations.length} restoration{toothRestorations.length === 1 ? '' : 's'}
              </p>
              <Link href="/diagnosis" className="text-[#2196F3] hover:underline text-sm font-medium">
                View in Diagnosis →
              </Link>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Currently there are no treatments pending</p>
          )}
        </div>

        {/* Two Column Layout: Endodontic & Periodontal */}
        <div className="border-t border-gray-200">
          <div className="flex">
            {/* Endodontic Section */}
            <div className="flex-1 border-r border-gray-200 p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Endodontic</h2>
              <div className="space-y-1">
                {endodonticTests.map((test) => {
                  const { result, positiveDetail } = getTestResult(test.type);
                  const displayResult = positiveDetail || result;
                  return (
                    <button
                      key={test.type}
                      onClick={() => setActiveTestModal(test.type)}
                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#2196F3]">{test.icon}</span>
                        <span className="text-gray-700 text-sm">{test.label}</span>
                        {displayResult && (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                            displayResult === 'positive' || displayResult === 'within-limits' ? 'bg-green-100 text-green-700' :
                            displayResult === 'negative' || displayResult === 'painful' ? 'bg-red-100 text-red-700' :
                            displayResult === 'pain-lingering' ? 'bg-red-100 text-red-700' :
                            displayResult === 'pain-stimulus' ? 'bg-orange-100 text-orange-700' :
                            displayResult === 'lingering' || displayResult === 'unpleasant' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {displayResult.replace(/-/g, ' ')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[#2196F3]">
                        <span className="text-sm">Test</span>
                        <ChevronIcon />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Periodontal Section */}
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-gray-800">Periodontal</h2>
                <Link 
                  href={`/tooth/${toothNumber}/periodontal`}
                  className="flex items-center gap-1.5 text-[#9C27B0] hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <PlusCircleIcon /><span className="text-sm font-medium">PROBING</span>
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {probingPositions.map((position) => {
                  const { pd, gm } = getPerioValue(position.id);
                  return (
                    <Link
                      key={position.id}
                      href={`/tooth/${toothNumber}/periodontal`}
                      className={`flex flex-col items-center p-3 border rounded-lg hover:border-[#9C27B0] hover:bg-purple-50/30 transition-colors ${
                        pd > 3 ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <span className={`text-2xl font-light ${pd > 6 ? 'text-red-600' : pd > 3 ? 'text-yellow-600' : 'text-gray-800'}`}>
                        {pd}
                      </span>
                      <span className={`text-[10px] border-t pt-1 mt-1 ${
                        gm < 0 ? 'text-orange-500 border-orange-200' : 'text-gray-400 border-gray-200'
                      }`}>
                        {gm}
                      </span>
                      <span className="text-xs text-gray-500 text-center leading-tight mt-1">{position.label}</span>
                    </Link>
                  );
                })}
              </div>
              {toothPeriodontal && (
                <div className="mt-3 text-center">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    toothPeriodontal.mobility === 0 ? 'bg-green-100 text-green-700' :
                    toothPeriodontal.mobility === 1 ? 'bg-yellow-100 text-yellow-700' :
                    toothPeriodontal.mobility === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    Mobility: Class {toothPeriodontal.mobility}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Endodontic Test Modal */}
      {activeTestModal && (
        <EndodonticTestModal
          testType={activeTestModal}
          toothNumber={toothNumber}
          currentResult={getTestResult(activeTestModal).result}
          currentPositiveDetail={getTestResult(activeTestModal).positiveDetail}
          onClose={() => setActiveTestModal(null)}
          onSave={(result, positiveDetail) => updateEndodontic(toothNumber, activeTestModal, result, positiveDetail)}
        />
      )}
    </div>
  );
}
