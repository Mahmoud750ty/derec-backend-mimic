"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDentalStore, PeriodontalSiteData, useDentalDataStore } from "@/store/dentalStore";
import { getPeriodontalICD10 } from "@/lib/dentalData";
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

// Sites configuration - ordered like derec (palatal first, then buccal)
const SITES = [
  { id: 'mesioPalatal', name: 'Mesio Palatal', shortName: 'Mesio Palatal' },
  { id: 'palatal', name: 'Palatal', shortName: 'Palatal' },
  { id: 'distoPalatal', name: 'Disto Palatal', shortName: 'Disto Palatal' },
  { id: 'mesioBuccal', name: 'Mesio Buccal', shortName: 'Mesio Buccal' },
  { id: 'buccal', name: 'Buccal', shortName: 'Buccal' },
  { id: 'distoBuccal', name: 'Disto Buccal', shortName: 'Disto Buccal' },
] as const;

type SiteId = typeof SITES[number]['id'];

// Default site data
const defaultSiteData: PeriodontalSiteData = {
  probingDepth: 0,
  gingivalMargin: 0,
  bleeding: false,
  plaque: false,
  pus: false,
  tartar: false,
};

export default function PeriodontalPage() {
  const params = useParams();
  const router = useRouter();
  const toothNumber = parseInt(params.toothNumber as string, 10);
  
  const updatePeriodontal = useDentalStore((state) => state.updatePeriodontal);
  const getToothPeriodontal = useDentalStore((state) => state.getToothPeriodontal);
  
  // Load dental data for diagnosis calculation
  const { dentalData, dataLoading, loadDentalData } = useDentalDataStore();
  
  // Load dental data on mount
  useEffect(() => {
    if (!dentalData && !dataLoading) {
      loadDentalData();
    }
  }, [dentalData, dataLoading, loadDentalData]);
  
  // Initialize site data
  const [siteData, setSiteData] = useState<Record<SiteId, PeriodontalSiteData>>({
    distoPalatal: { ...defaultSiteData },
    palatal: { ...defaultSiteData },
    mesioPalatal: { ...defaultSiteData },
    distoBuccal: { ...defaultSiteData },
    buccal: { ...defaultSiteData },
    mesioBuccal: { ...defaultSiteData },
  });
  
  const [selectedSite, setSelectedSite] = useState<SiteId>('mesioPalatal');
  const [mobility, setMobility] = useState<number>(0);
  
  // Load existing data
  useEffect(() => {
    const existing = getToothPeriodontal(toothNumber);
    if (existing) {
      setSiteData(existing.sites);
      setMobility(existing.mobility);
    }
  }, [toothNumber, getToothPeriodontal]);
  
  // All teeth numbers for navigation
  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerLeft = [38, 37, 36, 35, 34, 33, 32, 31];
  const lowerRight = [41, 42, 43, 44, 45, 46, 47, 48];
  const allTeeth = [...upperRight, ...upperLeft, ...lowerLeft, ...lowerRight];
  
  const mirrorH = shouldMirrorHorizontally(toothNumber);
  
  // Probing depth values
  const probingDepthValues = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, '>12'],
  ];
  
  // Gingival margin values
  const gingivalMarginValues = [
    [0, -1, -2, -3, -4],
    [-5, -6, -7, -8, -9],
    [-10, -11, -12, '<-12', '+/-'],
  ];

  const handleProbingDepthSelect = (value: number | string) => {
    const numValue = typeof value === 'string' ? (value === '>12' ? 13 : 0) : value;
    setSiteData(prev => ({
      ...prev,
      [selectedSite]: {
        ...prev[selectedSite],
        probingDepth: numValue,
      }
    }));
  };

  const handleGingivalMarginSelect = (value: number | string) => {
    let numValue: number;
    if (typeof value === 'string') {
      if (value === '<-12') numValue = -13;
      else if (value === '+/-') {
        // Toggle between positive and negative
        const current = siteData[selectedSite].gingivalMargin;
        numValue = -current;
      } else {
        numValue = 0;
      }
    } else {
      numValue = value;
    }
    
    setSiteData(prev => ({
      ...prev,
      [selectedSite]: {
        ...prev[selectedSite],
        gingivalMargin: numValue,
      }
    }));
  };

  const handleIndicatorToggle = (indicator: 'bleeding' | 'plaque' | 'pus' | 'tartar') => {
    setSiteData(prev => ({
      ...prev,
      [selectedSite]: {
        ...prev[selectedSite],
        [indicator]: !prev[selectedSite][indicator],
      }
    }));
  };

  const handleClose = () => {
    router.push(`/tooth/${toothNumber}`);
  };

  const handleSave = () => {
    updatePeriodontal({
      toothNumber,
      sites: siteData,
      mobility,
    });
    
    router.push('/patient-history');
  };

  // Calculate CAL for current site
  const currentSiteData = siteData[selectedSite];
  const cal = currentSiteData.probingDepth + Math.abs(Math.min(currentSiteData.gingivalMargin, 0));
  
  // Calculate diagnosis based on current measurements
  const calculatedDiagnosis = useMemo(() => {
    if (!dentalData?.perioDiagnosis) return null;
    
    const sites = Object.values(siteData);
    const maxPD = Math.max(...sites.map(s => s.probingDepth));
    const minGM = Math.min(...sites.map(s => s.gingivalMargin));
    const hasBleeding = sites.some(s => s.bleeding);
    const hasPlaque = sites.some(s => s.plaque);
    
    // Calculate max CAL
    const maxCAL = Math.max(...sites.map(s => {
      const gm = s.gingivalMargin;
      return gm < 0 ? s.probingDepth + Math.abs(gm) : Math.max(0, s.probingDepth - gm);
    }));
    
    return getPeriodontalICD10(
      dentalData.perioDiagnosis,
      maxPD,
      minGM,
      hasBleeding,
      hasPlaque,
      30, // Default age
      10  // Assume <30% teeth affected for single tooth
    );
  }, [dentalData, siteData]);

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
              href={`/tooth/${tooth}/periodontal`}
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
      <div className="w-[200px] bg-[#f8f9fa] border-r border-gray-200 flex flex-col items-center justify-center py-4 px-3 h-full relative">
        <div className="flex-1 flex flex-col items-center justify-end relative">
          <Image 
            src={getBuccalImagePath(toothNumber)} 
            alt={`Tooth ${toothNumber} buccal`} 
            width={120} 
            height={140} 
            className="object-contain" 
            style={{ transform: mirrorH ? 'scaleX(-1)' : undefined }} 
          />
          {/* Red line indicator for mesio-palatal */}
          <div className="absolute top-[35%] left-0 right-0 h-0.5 bg-red-500"></div>
        </div>
        <div className="flex flex-col items-center justify-center py-3">
          <Image 
            src={getIncisalImagePath(toothNumber)} 
            alt={`Tooth ${toothNumber} occlusal`} 
            width={80} 
            height={70} 
            className="object-contain" 
            style={{ transform: mirrorH ? 'scaleX(-1)' : undefined }} 
          />
        </div>
        <div className="flex-1 flex flex-col items-center justify-start relative">
          <Image 
            src={getLingualImagePath(toothNumber)} 
            alt={`Tooth ${toothNumber} lingual`} 
            width={120} 
            height={140} 
            className="object-contain" 
            style={{ transform: 'scaleX(-1) scaleY(-1)' }} 
          />
          {/* Red line indicator for buccal */}
          <div className="absolute bottom-[35%] left-0 right-0 h-0.5 bg-red-500"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl font-light text-gray-800">Periodontal</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <CloseIcon />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Site Selection Buttons */}
          <div className="grid grid-cols-6 gap-2 mb-6">
            {SITES.map((site) => {
              const siteCal = siteData[site.id].probingDepth + Math.abs(Math.min(siteData[site.id].gingivalMargin, 0));
              return (
                <button
                  key={site.id}
                  onClick={() => setSelectedSite(site.id)}
                  className={`py-3 px-2 rounded-lg border-2 text-center transition-all ${
                    selectedSite === site.id
                      ? 'border-[#2196F3] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`text-2xl font-light ${selectedSite === site.id ? 'text-[#2196F3]' : 'text-gray-800'}`}>
                    {siteData[site.id].probingDepth}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{siteCal}</p>
                  <p className={`text-xs mt-1 ${selectedSite === site.id ? 'text-[#2196F3]' : 'text-gray-500'}`}>
                    {site.shortName}
                  </p>
                </button>
              );
            })}
          </div>
          
          {/* Probing Depth & Gingival Margin Grids */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            {/* Probing Depth */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Probing Depth</p>
              <div className="space-y-2">
                {probingDepthValues.map((row, rowIdx) => (
                  <div key={rowIdx} className="grid grid-cols-5 gap-2">
                    {row.map((value) => (
                      <button
                        key={value}
                        onClick={() => handleProbingDepthSelect(value)}
                        className={`py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                          currentSiteData.probingDepth === (typeof value === 'string' ? (value === '>12' ? 13 : -1) : value)
                            ? 'border-gray-600 bg-gray-600 text-white'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Gingival Margin */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Gingival Margin</p>
              <div className="space-y-2">
                {gingivalMarginValues.map((row, rowIdx) => (
                  <div key={rowIdx} className="grid grid-cols-5 gap-2">
                    {row.map((value) => (
                      <button
                        key={value}
                        onClick={() => handleGingivalMarginSelect(value)}
                        className={`py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                          currentSiteData.gingivalMargin === (typeof value === 'number' ? value : (value === '<-12' ? -13 : -999))
                            ? 'border-gray-600 bg-gray-600 text-white'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Clinical Indicators */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <button
              onClick={() => handleIndicatorToggle('bleeding')}
              className={`py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                currentSiteData.bleeding
                  ? 'border-gray-300 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${currentSiteData.bleeding ? 'bg-red-500' : 'border-2 border-red-400'}`}></span>
              <span className="text-sm text-gray-600">Bleeding</span>
            </button>
            
            <button
              onClick={() => handleIndicatorToggle('plaque')}
              className={`py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                currentSiteData.plaque
                  ? 'border-gray-300 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${currentSiteData.plaque ? 'bg-blue-500' : 'border-2 border-blue-400'}`}></span>
              <span className="text-sm text-gray-600">Plaque</span>
            </button>
            
            <button
              onClick={() => handleIndicatorToggle('pus')}
              className={`py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                currentSiteData.pus
                  ? 'border-gray-300 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${currentSiteData.pus ? 'bg-yellow-500' : 'border-2 border-yellow-400'}`}></span>
              <span className="text-sm text-gray-600">Pus</span>
            </button>
            
            <button
              onClick={() => handleIndicatorToggle('tartar')}
              className={`py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                currentSiteData.tartar
                  ? 'border-gray-300 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${currentSiteData.tartar ? 'bg-gray-500' : 'border-2 border-gray-400'}`}></span>
              <span className="text-sm text-gray-600">Tartar</span>
            </button>
          </div>
          
          {/* Tooth Mobility */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Tooth Mobility</p>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((cls) => (
                <button
                  key={cls}
                  onClick={() => setMobility(cls)}
                  className={`py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                    mobility === cls
                      ? 'border-gray-300 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Arrow icons based on class */}
                  <span className="text-gray-400 text-xs">
                    {cls === 1 && '‹ ›'}
                    {cls === 2 && '« »'}
                    {cls === 3 && '«»'}
                  </span>
                  <span className="text-sm text-gray-600">Class {cls}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Diagnosis Preview */}
          {calculatedDiagnosis && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm font-semibold text-green-800 mb-1 uppercase tracking-wide">Calculated Diagnosis</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-green-700">{calculatedDiagnosis.description}</p>
                  <p className="text-sm text-green-600">Based on: CAL, BOP, Plaque status</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">ICD-10</p>
                  <p className="text-xl font-mono font-bold text-green-700">{calculatedDiagnosis.code}</p>
                </div>
              </div>
            </div>
          )}
          
          {!calculatedDiagnosis && dentalData && (
            <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">Diagnosis</p>
              <p className="text-gray-500">Enter probing depth and clinical indicators to calculate diagnosis</p>
            </div>
          )}
        </div>
        
        {/* Save Button */}
        <div className="p-6 border-t border-gray-100">
          {calculatedDiagnosis && (
            <div className="mb-3 text-center">
              <p className="text-sm text-gray-500">Will save with diagnosis:</p>
              <p className="font-semibold text-[#2196F3]">{calculatedDiagnosis.code} - {calculatedDiagnosis.description}</p>
            </div>
          )}
          <button 
            onClick={handleSave}
            className="w-full py-3 px-4 bg-[#2196F3] hover:bg-[#1E88E5] text-white font-semibold rounded-lg transition-colors"
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
}
