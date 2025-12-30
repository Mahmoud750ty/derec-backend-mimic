"use client";

import { useState, useEffect, useRef } from 'react';
import { fetchEasyDiagnosisData, EasyDiagnosisData, DiagnosisCondition, CATEGORY_SHORT_LABELS } from '@/lib/easyDiagnosis';

// Tooth Level Icons
const CariesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c-2.5 0-4.5 1.5-5 4-.3 1.5-.8 2.5-1.5 4-.7 1.5-1 3.5-.5 5.5.5 2 2 3.5 3.5 3 1-.3 1.5-1.5 2-2.5.3-.7.8-1 1.5-1s1.2.3 1.5 1c.5 1 1 2.2 2 2.5 1.5.5 3-1 3.5-3 .5-2 .2-4-.5-5.5-.7-1.5-1.2-2.5-1.5-4-.5-2.5-2.5-4-5-4z" />
    <circle cx="10" cy="9" r="1.5" fill="currentColor" />
    <circle cx="14" cy="11" r="1" fill="currentColor" />
  </svg>
);

const PulpIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c-2.5 0-4.5 1.5-5 4-.3 1.5-.8 2.5-1.5 4-.7 1.5-1 3.5-.5 5.5.5 2 2 3.5 3.5 3 1-.3 1.5-1.5 2-2.5.3-.7.8-1 1.5-1s1.2.3 1.5 1c.5 1 1 2.2 2 2.5 1.5.5 3-1 3.5-3 .5-2 .2-4-.5-5.5-.7-1.5-1.2-2.5-1.5-4-.5-2.5-2.5-4-5-4z" />
    <path d="M12 6v10M10 8v6M14 8v6" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
  </svg>
);

const PeriapicalIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c-2.5 0-4.5 1.5-5 4-.3 1.5-.8 2.5-1.5 4-.7 1.5-1 3.5-.5 5.5.5 2 2 3.5 3.5 3 1-.3 1.5-1.5 2-2.5.3-.7.8-1 1.5-1s1.2.3 1.5 1c.5 1 1 2.2 2 2.5 1.5.5 3-1 3.5-3 .5-2 .2-4-.5-5.5-.7-1.5-1.2-2.5-1.5-4-.5-2.5-2.5-4-5-4z" />
    <circle cx="12" cy="20" r="2" fill="currentColor" opacity="0.4" stroke="currentColor" />
  </svg>
);

const ImpactedIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 6c-2 0-3.5 1.2-4 3.2-.2 1.2-.6 2-1.2 3.2-.5 1.2-.8 2.8-.4 4.4.4 1.6 1.6 2.8 2.8 2.4.8-.2 1.2-1.2 1.6-2 .2-.6.6-.8 1.2-.8s1 .2 1.2.8c.4.8.8 1.8 1.6 2 1.2.4 2.4-.8 2.8-2.4.4-1.6.2-3.2-.4-4.4-.5-1.2-1-2-1.2-3.2-.5-2-2-3.2-4-3.2z" />
    <path d="M8 4l4 2-4 2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 4l-4 2 4 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HardTissueIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c-2.5 0-4.5 1.5-5 4-.3 1.5-.8 2.5-1.5 4-.7 1.5-1 3.5-.5 5.5.5 2 2 3.5 3.5 3 1-.3 1.5-1.5 2-2.5.3-.7.8-1 1.5-1s1.2.3 1.5 1c.5 1 1 2.2 2 2.5 1.5.5 3-1 3.5-3 .5-2 .2-4-.5-5.5-.7-1.5-1.2-2.5-1.5-4-.5-2.5-2.5-4-5-4z" />
    <path d="M7 10l10-3M7 7l10 6" strokeDasharray="2 2" opacity="0.6" />
  </svg>
);

const EndoCompIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c-2.5 0-4.5 1.5-5 4-.3 1.5-.8 2.5-1.5 4-.7 1.5-1 3.5-.5 5.5.5 2 2 3.5 3.5 3 1-.3 1.5-1.5 2-2.5.3-.7.8-1 1.5-1s1.2.3 1.5 1c.5 1 1 2.2 2 2.5 1.5.5 3-1 3.5-3 .5-2 .2-4-.5-5.5-.7-1.5-1.2-2.5-1.5-4-.5-2.5-2.5-4-5-4z" />
    <circle cx="12" cy="10" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 8v4M10 10h4" strokeLinecap="round" />
  </svg>
);

// Oral Cavity Level Icons
const GingivaIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10c2-2 5-3 9-3s7 1 9 3" />
    <path d="M3 10c0 4 2 8 9 8s9-4 9-8" fill="currentColor" fillOpacity="0.1" />
    <path d="M8 13v3M12 14v4M16 13v3" strokeLinecap="round" />
  </svg>
);

const PerioIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 9v12" />
    <path d="M7 13h4M7 17h4" strokeLinecap="round" />
    <circle cx="15" cy="15" r="3" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

const CystIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.15" />
    <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

const InfectionIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 16h.01" strokeLinecap="round" strokeWidth="2" />
    <path d="M8 8l1.5 1.5M16 8l-1.5 1.5M8 16l1.5-1.5M16 16l-1.5-1.5" opacity="0.5" />
  </svg>
);

const MucosaIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="12" rx="9" ry="6" fill="currentColor" fillOpacity="0.1" />
    <ellipse cx="12" cy="12" rx="9" ry="6" />
    <path d="M6 12c2-1 4-1.5 6-1.5s4 .5 6 1.5" strokeDasharray="2 2" opacity="0.6" />
  </svg>
);

const LipsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12c0 0 3.5 5 10 5s10-5 10-5" />
    <path d="M2 12c0 0 3.5-5 10-5s10 5 10 5" />
    <path d="M2 12h20" />
    <path d="M12 7c-1 1-2 2.5-2 5s1 4 2 5" opacity="0.4" />
    <path d="M12 7c1 1 2 2.5 2 5s-1 4-2 5" opacity="0.4" />
  </svg>
);

const TongueIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10c0-3 2.2-6 5-6s5 3 5 6c0 5-2.5 10-5 10s-5-5-5-10z" fill="currentColor" fillOpacity="0.1" />
    <path d="M7 10c0-3 2.2-6 5-6s5 3 5 6c0 5-2.5 10-5 10s-5-5-5-10z" />
    <path d="M12 10v6" strokeLinecap="round" />
    <circle cx="10" cy="8" r="0.5" fill="currentColor" />
    <circle cx="14" cy="8" r="0.5" fill="currentColor" />
  </svg>
);

const JawIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6c0-1.5 1.5-3 3-3h10c1.5 0 3 1.5 3 3v6c0 5-4 9-8 9s-8-4-8-9V6z" fill="currentColor" fillOpacity="0.1" />
    <path d="M4 6c0-1.5 1.5-3 3-3h10c1.5 0 3 1.5 3 3v6c0 5-4 9-8 9s-8-4-8-9V6z" />
    <path d="M8 9h8" strokeLinecap="round" />
    <path d="M7 13h10" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const SalivaryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v4" />
    <path d="M12 21c-4 0-6-2.5-6-5.5 0-3.5 6-9.5 6-9.5s6 6 6 9.5c0 3-2 5.5-6 5.5z" fill="currentColor" fillOpacity="0.15" />
    <path d="M12 21c-4 0-6-2.5-6-5.5 0-3.5 6-9.5 6-9.5s6 6 6 9.5c0 3-2 5.5-6 5.5z" />
    <circle cx="12" cy="16" r="1.5" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

const TMJIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7" cy="12" r="4" fill="currentColor" fillOpacity="0.1" />
    <circle cx="17" cy="12" r="4" fill="currentColor" fillOpacity="0.1" />
    <circle cx="7" cy="12" r="4" />
    <circle cx="17" cy="12" r="4" />
    <path d="M11 12h2" strokeWidth="2" />
    <path d="M7 9v6M17 9v6" opacity="0.4" />
  </svg>
);

// Get icon component for category
const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    'Caries': <CariesIcon />,
    'Pulp': <PulpIcon />,
    'Periapical': <PeriapicalIcon />,
    'Impacted': <ImpactedIcon />,
    'Hard Tissue Defect': <HardTissueIcon />,
    'Endodontic Complication': <EndoCompIcon />,
    'Gingiva': <GingivaIcon />,
    'Periodontal': <PerioIcon />,
    'Odontogenic Cyst': <CystIcon />,
    'Soft Tissue Infection': <InfectionIcon />,
    'Oral Mucosa': <MucosaIcon />,
    'Lips': <LipsIcon />,
    'Tongue': <TongueIcon />,
    'Jaw': <JawIcon />,
    'Salivary Glands': <SalivaryIcon />,
    'TMJ': <TMJIcon />,
  };
  return icons[category] || <CariesIcon />;
};

interface QuickDiagnosisToolbarProps {
  selectedTooth: number | null;
  onSelectCondition: (condition: DiagnosisCondition) => void;
}

export default function QuickDiagnosisToolbar({ 
  selectedTooth, 
  onSelectCondition 
}: QuickDiagnosisToolbarProps) {
  const [data, setData] = useState<EasyDiagnosisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showConditions, setShowConditions] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayLevel, setDisplayLevel] = useState<'tooth' | 'oral'>('oral');
  const prevToothRef = useRef<number | null>(null);

  useEffect(() => {
    fetchEasyDiagnosisData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Handle transition when tooth selection changes
  useEffect(() => {
    const newLevel = selectedTooth !== null ? 'tooth' : 'oral';
    
    if (prevToothRef.current !== selectedTooth && data) {
      // Trigger flip animation
      setIsFlipping(true);
      setShowConditions(false);
      setSelectedCategory(null);
      
      // After flip out, change the content
      setTimeout(() => {
        setDisplayLevel(newLevel);
      }, 150);
      
      // Complete the flip animation
      setTimeout(() => {
        setIsFlipping(false);
      }, 300);
    }
    
    prevToothRef.current = selectedTooth;
  }, [selectedTooth, data]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-3 px-6 bg-white border-2 border-[#2196F3] rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#2196F3] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500 text-sm font-medium">Loading diagnosis options...</span>
        </div>
      </div>
    );
  }

  const isToothLevel = displayLevel === 'tooth';
  const categories = isToothLevel ? data.toothLevel.categories : data.oralCavityLevel.categories;
  const conditions = isToothLevel ? data.toothLevel.conditions : data.oralCavityLevel.conditions;

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category && showConditions) {
      setShowConditions(false);
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
      setShowConditions(true);
    }
  };

  const handleConditionSelect = (condition: DiagnosisCondition) => {
    onSelectCondition(condition);
    setShowConditions(false);
    setSelectedCategory(null);
  };

  return (
    <div className="relative z-50" style={{ perspective: '1000px' }}>
      {/* Level Indicator Badge */}
      <div 
        className={`absolute -top-7 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white text-xs font-semibold rounded-full shadow-lg z-10 transition-all duration-300 ${
          isFlipping ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
        }`}
      >
        {isToothLevel ? ` Tooth ${selectedTooth}` : ' Oral Cavity'}
      </div>

      {/* Main Toolbar with Flip Animation */}
      <div 
        className={`relative transition-all duration-300 ease-out ${
          isFlipping 
            ? 'transform rotateX-90 opacity-0 scale-95' 
            : 'transform rotateX-0 opacity-100 scale-100'
        }`}
        style={{
          transform: isFlipping ? 'rotateX(90deg) scale(0.95)' : 'rotateX(0deg) scale(1)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="flex items-center gap-1 py-3 px-4 bg-white border-2 border-[#2196F3] rounded-2xl shadow-lg">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`group flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all duration-200 min-w-[72px] ${
                selectedCategory === category 
                  ? 'bg-[#2196F3] text-white shadow-md scale-105' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-[#2196F3] hover:scale-102'
              }`}
              style={{
                animationDelay: `${index * 30}ms`,
              }}
            >
              <div className={`w-6 h-6 transition-transform duration-200 ${
                selectedCategory === category ? '' : 'group-hover:scale-110'
              }`}>
                {getCategoryIcon(category)}
              </div>
              <span className="text-[10px] font-semibold leading-tight text-center whitespace-nowrap">
                {CATEGORY_SHORT_LABELS[category] || category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Conditions Dropdown with Animation */}
      <div 
        className={`absolute top-full left-0 right-0 mt-3 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[100] overflow-hidden transition-all duration-300 ease-out ${
          showConditions && selectedCategory 
            ? 'opacity-100 translate-y-0 max-h-[350px]' 
            : 'opacity-0 -translate-y-4 max-h-0 pointer-events-none'
        }`}
      >
        {/* Dropdown Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-white px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#2196F3]/10 rounded-lg flex items-center justify-center text-[#2196F3]">
              {selectedCategory && getCategoryIcon(selectedCategory)}
            </div>
            <span className="font-semibold text-gray-800">{selectedCategory}</span>
          </div>
          <button 
            onClick={() => setShowConditions(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Conditions List */}
        <div className="p-2 max-h-[280px] overflow-y-auto">
          {selectedCategory && conditions[selectedCategory]?.map((condition, idx) => (
            <button
              key={idx}
              onClick={() => handleConditionSelect(condition)}
              className="w-full text-left px-4 py-3.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-white transition-all group mb-1"
              style={{
                animationDelay: `${idx * 50}ms`,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 group-hover:text-[#2196F3] transition-colors">
                    {condition.condition}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{condition.description}</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#2196F3] bg-blue-50 px-2.5 py-1 rounded-lg shrink-0 group-hover:bg-[#2196F3] group-hover:text-white transition-all">
                  {condition.icdCode}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
