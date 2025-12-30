"use client";

import { useState } from "react";
import Link from "next/link";
import { useDentalStore, SURFACE_AREAS, PathologyEntry, RestorationEntry, EndodonticEntry, PeriodontalEntry } from "@/store/dentalStore";
import Sidebar from "@/components/Sidebar";

// Icon Components
const ToothIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C9 2 7 4 7 7c0 2-1 3-2 5s-1 5 1 7c1 1 2 2 3 2 2 0 2-2 3-2s1 2 3 2c1 0 2-1 3-2 2-2 2-5 1-7s-2-3-2-5c0-3-2-5-5-5z" />
  </svg>
);

const PathologyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

const RestorationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const EndoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const PerioIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const PrintIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const ClearIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
  </svg>
);

// Helper to get surface names
const getSurfaceNames = (surfaces: number[]): string => {
  if (!surfaces || surfaces.length === 0) return '-';
  return surfaces.map(s => {
    const surface = Object.entries(SURFACE_AREAS).find(([k]) => Number(k) === s);
    return surface ? surface[1].label : `Surface ${s}`;
  }).join(', ');
};

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Pathology Card Component
const PathologyCard = ({ entry, onDelete }: { entry: PathologyEntry; onDelete: () => void }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-red-600 font-bold text-sm">{entry.toothNumber}</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 capitalize">{entry.type.replace('-', ' ')}</h4>
          <p className="text-xs text-gray-400">{formatDate(entry.createdAt)}</p>
        </div>
      </div>
      <button onClick={onDelete} className="text-gray-400 hover:text-red-500 transition-colors p-1">
        <DeleteIcon />
      </button>
    </div>
    
    <div className="space-y-2 text-sm">
      {entry.surfaces && entry.surfaces.length > 0 && (
        <div className="flex">
          <span className="text-gray-500 w-24">Surfaces:</span>
          <span className="text-gray-700">{getSurfaceNames(entry.surfaces)}</span>
        </div>
      )}
      {entry.depth && (
        <div className="flex">
          <span className="text-gray-500 w-24">Depth:</span>
          <span className="text-gray-700">{entry.depth}</span>
        </div>
      )}
      {entry.cavitation && (
        <div className="flex">
          <span className="text-gray-500 w-24">Cavitation:</span>
          <span className="text-gray-700">{entry.cavitation}</span>
        </div>
      )}
      {entry.classification && (
        <div className="flex">
          <span className="text-gray-500 w-24">Class:</span>
          <span className="text-gray-700">{entry.classification}</span>
        </div>
      )}
      <div className="flex">
        <span className="text-gray-500 w-24">Action:</span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          entry.action === 'treat' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {entry.action.toUpperCase()}
        </span>
      </div>
      {entry.icdCode && (
        <div className="flex mt-2 pt-2 border-t border-gray-100">
          <span className="text-gray-500 w-24">ICD-10:</span>
          <span className="text-blue-600 font-mono text-xs">{entry.icdCode}</span>
        </div>
      )}
    </div>
  </div>
);

// Restoration Card Component
const RestorationCard = ({ entry, onDelete }: { entry: RestorationEntry; onDelete: () => void }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-green-600 font-bold text-sm">{entry.toothNumber}</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 capitalize">{entry.type}</h4>
          <p className="text-xs text-gray-400">{formatDate(entry.createdAt)}</p>
        </div>
      </div>
      <button onClick={onDelete} className="text-gray-400 hover:text-red-500 transition-colors p-1">
        <DeleteIcon />
      </button>
    </div>
    
    <div className="space-y-2 text-sm">
      {entry.surfaces && entry.surfaces.length > 0 && (
        <div className="flex">
          <span className="text-gray-500 w-24">Surfaces:</span>
          <span className="text-gray-700">{getSurfaceNames(entry.surfaces)}</span>
        </div>
      )}
      {entry.material && (
        <div className="flex">
          <span className="text-gray-500 w-24">Material:</span>
          <span className="text-gray-700">{entry.material}</span>
        </div>
      )}
      {entry.quality && (
        <div className="flex">
          <span className="text-gray-500 w-24">Quality:</span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            entry.quality === 'Sufficient' ? 'bg-green-100 text-green-700' :
            entry.quality === 'Uncertain' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {entry.quality}
          </span>
        </div>
      )}
      {entry.qualityDetail && (
        <div className="flex">
          <span className="text-gray-500 w-24">Detail:</span>
          <span className="text-gray-700">{entry.qualityDetail}</span>
        </div>
      )}
      {entry.crownType && (
        <div className="flex">
          <span className="text-gray-500 w-24">Crown Type:</span>
          <span className="text-gray-700">{entry.crownType}</span>
        </div>
      )}
      {entry.crownBase && (
        <div className="flex">
          <span className="text-gray-500 w-24">Crown Base:</span>
          <span className="text-gray-700">{entry.crownBase}</span>
        </div>
      )}
      {entry.implantType && (
        <div className="flex">
          <span className="text-gray-500 w-24">Implant:</span>
          <span className="text-gray-700">{entry.implantType}</span>
        </div>
      )}
      <div className="flex">
        <span className="text-gray-500 w-24">Action:</span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          entry.action === 'treat' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {entry.action.toUpperCase()}
        </span>
      </div>
    </div>
  </div>
);

// Endodontic Card Component
const EndodonticCard = ({ entry, onDelete }: { entry: EndodonticEntry; onDelete: () => void }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-purple-600 font-bold text-sm">{entry.toothNumber}</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 capitalize">{entry.testType.replace('-', ' ')} Test</h4>
          <p className="text-xs text-gray-400">{formatDate(entry.createdAt)}</p>
        </div>
      </div>
      <button onClick={onDelete} className="text-gray-400 hover:text-red-500 transition-colors p-1">
        <DeleteIcon />
      </button>
    </div>
    
    <div className="space-y-2 text-sm">
      <div className="flex">
        <span className="text-gray-500 w-24">Result:</span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          entry.result === 'positive' ? 'bg-green-100 text-green-700' :
          entry.result === 'negative' ? 'bg-red-100 text-red-700' :
          entry.result === 'lingering' ? 'bg-orange-100 text-orange-700' :
          'bg-gray-100 text-gray-600'
        }`}>
          {entry.result?.toUpperCase() || 'N/A'}
        </span>
      </div>
      {entry.icdCode && (
        <div className="flex mt-2 pt-2 border-t border-gray-100">
          <span className="text-gray-500 w-24">ICD-10:</span>
          <span className="text-blue-600 font-mono text-xs">{entry.icdCode}</span>
        </div>
      )}
    </div>
  </div>
);

// Periodontal Card Component
const PeriodontalCard = ({ entry }: { entry: PeriodontalEntry }) => {
  const sites = entry.sites;
  const siteNames = ['Mesio Palatal', 'Palatal', 'Disto Palatal', 'Mesio Buccal', 'Buccal', 'Disto Buccal'];
  const siteKeys = ['mesioPalatal', 'palatal', 'distoPalatal', 'mesioBuccal', 'buccal', 'distoBuccal'] as const;
  
  // Calculate max values
  const maxPD = Math.max(...siteKeys.map(k => sites[k]?.probingDepth || 0));
  const bleedingSites = siteKeys.filter(k => sites[k]?.bleeding).length;
  const plaqueSites = siteKeys.filter(k => sites[k]?.plaque).length;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">{entry.toothNumber}</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Periodontal Probing</h4>
            <p className="text-xs text-gray-400">{formatDate(entry.updatedAt)}</p>
          </div>
        </div>
      </div>
      
      {/* Diagnosis Banner */}
      {entry.icdCode && (
        <div className="mb-3 p-3 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 uppercase tracking-wide">Diagnosis</p>
              <p className="text-sm font-semibold text-green-800">{entry.icdDescription}</p>
            </div>
            <span className="text-lg font-mono font-bold text-green-700">{entry.icdCode}</span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        {siteKeys.map((key, idx) => (
          <div key={key} className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">{siteNames[idx]}</p>
            <p className="text-lg font-semibold text-gray-800">{sites[key]?.probingDepth || 0}</p>
            <div className="flex justify-center gap-1 mt-1">
              {sites[key]?.bleeding && <span className="w-2 h-2 rounded-full bg-red-500" title="Bleeding"></span>}
              {sites[key]?.plaque && <span className="w-2 h-2 rounded-full bg-blue-500" title="Plaque"></span>}
              {sites[key]?.pus && <span className="w-2 h-2 rounded-full bg-yellow-500" title="Pus"></span>}
              {sites[key]?.tartar && <span className="w-2 h-2 rounded-full bg-gray-500" title="Tartar"></span>}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
        <span className="text-gray-500">Max PD: <span className="font-semibold text-gray-800">{maxPD}mm</span></span>
        <span className="text-gray-500">BOP: <span className="font-semibold text-red-600">{bleedingSites}/6</span></span>
        <span className="text-gray-500">Plaque: <span className="font-semibold text-blue-600">{plaqueSites}/6</span></span>
        <span className="text-gray-500">Mobility: <span className="font-semibold text-gray-800">Class {entry.mobility}</span></span>
      </div>
    </div>
  );
};

export default function PatientHistoryPage() {
  const pathologies = useDentalStore((state) => state.pathologies);
  const restorations = useDentalStore((state) => state.restorations);
  const endodontics = useDentalStore((state) => state.endodontics);
  const periodontal = useDentalStore((state) => state.periodontal);
  const removePathology = useDentalStore((state) => state.removePathology);
  const removeRestoration = useDentalStore((state) => state.removeRestoration);
  const clearAll = useDentalStore((state) => state.clearAll);
  
  const [activeTab, setActiveTab] = useState<'all' | 'pathology' | 'restoration' | 'endodontic' | 'periodontal'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const totalEntries = pathologies.length + restorations.length + endodontics.length + periodontal.length;
  
  // Group by tooth number
  const getToothNumbers = () => {
    const teeth = new Set<number>();
    pathologies.forEach(p => teeth.add(p.toothNumber));
    restorations.forEach(r => teeth.add(r.toothNumber));
    endodontics.forEach(e => teeth.add(e.toothNumber));
    periodontal.forEach(p => teeth.add(p.toothNumber));
    return Array.from(teeth).sort((a, b) => a - b);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleClearAll = () => {
    clearAll();
    setShowClearConfirm(false);
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] font-sans">
      {/* Left Sidebar */}
      <Sidebar backHref="/" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 print:border-none">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Patient History</h1>
              <p className="text-sm text-gray-500">{totalEntries} entries recorded</p>
            </div>
            <div className="flex items-center gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
              >
                <PrintIcon />
                Print
              </button>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600"
              >
                <ClearIcon />
                Clear All
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mt-4 print:hidden">
            {[
              { id: 'all', label: 'All', count: totalEntries },
              { id: 'pathology', label: 'Pathology', count: pathologies.length, icon: <PathologyIcon /> },
              { id: 'restoration', label: 'Restoration', count: restorations.length, icon: <RestorationIcon /> },
              { id: 'endodontic', label: 'Endodontic', count: endodontics.length, icon: <EndoIcon /> },
              { id: 'periodontal', label: 'Periodontal', count: periodontal.length, icon: <PerioIcon /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#2196F3] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.icon}
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </header>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {totalEntries === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ToothIcon />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Patient Data</h3>
              <p className="text-gray-500 mb-4">Start by selecting a tooth and adding clinical findings</p>
              <Link
                href="/"
                className="px-6 py-3 bg-[#2196F3] text-white rounded-lg hover:bg-[#1E88E5] transition-colors font-medium"
              >
                Go to Dental Chart
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* By Tooth View */}
              {getToothNumbers().map(toothNumber => {
                const toothPathologies = pathologies.filter(p => p.toothNumber === toothNumber);
                const toothRestorations = restorations.filter(r => r.toothNumber === toothNumber);
                const toothEndodontics = endodontics.filter(e => e.toothNumber === toothNumber);
                const toothPeriodontal = periodontal.filter(p => p.toothNumber === toothNumber);
                
                // Filter based on active tab
                const showPathology = activeTab === 'all' || activeTab === 'pathology';
                const showRestoration = activeTab === 'all' || activeTab === 'restoration';
                const showEndodontic = activeTab === 'all' || activeTab === 'endodontic';
                const showPeriodontal = activeTab === 'all' || activeTab === 'periodontal';
                
                const hasContent = 
                  (showPathology && toothPathologies.length > 0) ||
                  (showRestoration && toothRestorations.length > 0) ||
                  (showEndodontic && toothEndodontics.length > 0) ||
                  (showPeriodontal && toothPeriodontal.length > 0);
                
                if (!hasContent) return null;
                
                return (
                  <div key={toothNumber} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#2196F3] flex items-center justify-center">
                        <span className="text-white font-bold">{toothNumber}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Tooth {toothNumber}</h3>
                        <p className="text-xs text-gray-500">
                          {toothPathologies.length + toothRestorations.length + toothEndodontics.length + toothPeriodontal.length} entries
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {showPathology && toothPathologies.map(entry => (
                        <PathologyCard
                          key={entry.id}
                          entry={entry}
                          onDelete={() => removePathology(entry.id)}
                        />
                      ))}
                      
                      {showRestoration && toothRestorations.map(entry => (
                        <RestorationCard
                          key={entry.id}
                          entry={entry}
                          onDelete={() => removeRestoration(entry.id)}
                        />
                      ))}
                      
                      {showEndodontic && toothEndodontics.map(entry => (
                        <EndodonticCard
                          key={entry.id}
                          entry={entry}
                          onDelete={() => {/* TODO: Add remove endodontic */}}
                        />
                      ))}
                      
                      {showPeriodontal && toothPeriodontal.map(entry => (
                        <PeriodontalCard
                          key={`${entry.toothNumber}-${entry.updatedAt}`}
                          entry={entry}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      
      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:hidden">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Clear All Data?</h3>
            <p className="text-gray-600 mb-6">This will permanently delete all patient history data. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

