"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDentalStore, useDentalDataStore, SURFACE_AREAS, PathologyEntry, RestorationEntry, EndodonticEntry } from "@/store/dentalStore";
import Sidebar from "@/components/Sidebar";

// Icon Components
const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

const ToothIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C9 2 7 4 7 7c0 2-1 3-2 5s-1 5 1 7c1.5 1.5 3 1 4 0 .5-.5 1-2 2-2s1.5 1.5 2 2c1 1 2.5 1.5 4 0 2-2 2-5 1-7s-2-3-2-5c0-3-2-5-5-5z" />
  </svg>
);

const DatabaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);

// Format pathology type for display
const formatPathologyType = (type: string) => {
  return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Format restoration type for display  
const formatRestorationType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Get surfaces string
const getSurfacesString = (surfaces: number[]) => {
  return surfaces.map(s => SURFACE_AREAS[s as keyof typeof SURFACE_AREAS]?.label || s).join(', ');
};

// Pathology Card Component
const PathologyCard = ({ entry, onRemove }: { entry: PathologyEntry; onRemove: () => void }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
          <ToothIcon />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Tooth {entry.toothNumber}</h3>
          <p className="text-sm text-red-500 font-medium">{formatPathologyType(entry.type)}</p>
        </div>
      </div>
      <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors p-1">
        <TrashIcon />
      </button>
    </div>
    
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-500">Surfaces:</span>
        <span className="text-gray-700">{getSurfacesString(entry.surfaces)}</span>
      </div>
      
      {entry.depth && (
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Depth:</span>
          <span className="text-gray-700 capitalize">{entry.depth}</span>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <span className="text-gray-500">Action:</span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          entry.action === 'treat' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {entry.action.toUpperCase()}
        </span>
      </div>
      
      {entry.icdCode && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">ICD-10 Code</p>
          <p className="font-mono text-sm text-[#2196F3] font-semibold">{entry.icdCode}</p>
          <p className="text-xs text-gray-600 mt-1">{entry.icdDescription}</p>
        </div>
      )}
    </div>
  </div>
);

// Restoration Card Component
const RestorationCard = ({ entry, onRemove }: { entry: RestorationEntry; onRemove: () => void }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
          <ToothIcon />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Tooth {entry.toothNumber}</h3>
          <p className="text-sm text-[#2196F3] font-medium">{formatRestorationType(entry.type)}</p>
        </div>
      </div>
      <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors p-1">
        <TrashIcon />
      </button>
    </div>
    
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-500">Surfaces:</span>
        <span className="text-gray-700">{getSurfacesString(entry.surfaces)}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-gray-500">Action:</span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          entry.action === 'treat' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {entry.action.toUpperCase()}
        </span>
      </div>
    </div>
  </div>
);

// Endodontic Card Component
const EndodonticCard = ({ entry, onRemove }: { entry: EndodonticEntry; onRemove: () => void }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
          <ToothIcon />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Tooth {entry.toothNumber}</h3>
          <p className="text-sm text-purple-600 font-medium capitalize">{entry.testType} Test</p>
        </div>
      </div>
      <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors p-1">
        <TrashIcon />
      </button>
    </div>
    
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-500">Result:</span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
          entry.result === 'positive' ? 'bg-green-100 text-green-700' :
          entry.result === 'negative' ? 'bg-red-100 text-red-700' :
          entry.result === 'lingering' ? 'bg-orange-100 text-orange-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {entry.result || 'Not tested'}
        </span>
      </div>
      
      {entry.icdCode && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">ICD-10 Code</p>
          <p className="font-mono text-sm text-[#2196F3] font-semibold">{entry.icdCode}</p>
          <p className="text-xs text-gray-600 mt-1">{entry.icdDescription}</p>
        </div>
      )}
    </div>
  </div>
);

export default function DiagnosisPage() {
  const pathologies = useDentalStore((state) => state.pathologies);
  const restorations = useDentalStore((state) => state.restorations);
  const endodontics = useDentalStore((state) => state.endodontics);
  const removePathology = useDentalStore((state) => state.removePathology);
  const removeRestoration = useDentalStore((state) => state.removeRestoration);
  const clearAll = useDentalStore((state) => state.clearAll);
  const getAllICDCodes = useDentalStore((state) => state.getAllICDCodes);
  const getICDCategories = useDentalStore((state) => state.getICDCategories);
  
  // Load dental data from Excel (includes ICD-10 codes)
  const { dentalData, dataLoading, dataError, loadDentalData } = useDentalDataStore();
  
  // State for ICD-10 browser
  const [showICD10Browser, setShowICD10Browser] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const totalEntries = pathologies.length + restorations.length + endodontics.length;
  
  // Filter ICD-10 codes based on search and category
  const filteredCodes = getAllICDCodes().filter(code => {
    const matchesSearch = !searchQuery || 
      code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || code.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const categories = Object.keys(getICDCategories());

  return (
    <div className="flex h-screen bg-[#F5F7FA] font-sans">
      {/* Left Sidebar */}
      <Sidebar backHref="/" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Diagnosis Summary</h1>
              <p className="text-gray-500 mt-1">{totalEntries} entries recorded</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowICD10Browser(!showICD10Browser)}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
                  showICD10Browser 
                    ? 'bg-[#2196F3] text-white' 
                    : 'text-[#2196F3] hover:bg-blue-50 border border-[#2196F3]'
                }`}
              >
                <DatabaseIcon />
                ICD-10 Database
              </button>
              {totalEntries > 0 && (
                <button 
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all data?')) {
                      clearAll();
                    }
                  }}
                  className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* ICD-10 Database Browser */}
          {showICD10Browser && (
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <DatabaseIcon />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">ICD-10 Code Database</h2>
                    <p className="text-sm text-gray-500">
                      Loaded from <span className="font-mono text-[#2196F3]">derec-as-is.xlsx</span>
                      {dentalData && ` • ${dentalData.icd10Codes?.length || 0} codes available`}
                    </p>
                  </div>
                </div>
                {dataError && (
                  <button 
                    onClick={() => loadDentalData()}
                    className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                  >
                    <RefreshIcon />
                    Retry
                  </button>
                )}
              </div>
              
              {dataLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2196F3]"></div>
                  <span className="ml-3 text-gray-500">Loading ICD-10 data from Excel...</span>
                </div>
              )}
              
              {dataError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                  <p className="font-medium">Failed to load ICD-10 data</p>
                  <p className="text-sm mt-1">{dataError}</p>
                </div>
              )}
              
              {dentalData && (
                <>
                  {/* Search and Filter */}
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 relative">
                      <SearchIcon />
                      <input
                        type="text"
                        placeholder="Search codes or descriptions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <SearchIcon />
                      </div>
                    </div>
                    <select
                      value={selectedCategory || ''}
                      onChange={(e) => setSelectedCategory(e.target.value || null)}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent bg-white min-w-[200px]"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Results Table */}
                  <div className="overflow-x-auto max-h-[400px] overflow-y-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-gray-50">
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-600 w-28">Code</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-600">Description</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-600 w-64">Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCodes.slice(0, 100).map((code, idx) => (
                          <tr key={`${code.code}-${idx}`} className="border-b border-gray-100 hover:bg-blue-50/50">
                            <td className="py-2 px-4 font-mono text-[#2196F3] font-semibold">{code.code}</td>
                            <td className="py-2 px-4 text-gray-700">{code.description}</td>
                            <td className="py-2 px-4 text-gray-500 text-xs">{code.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredCodes.length > 100 && (
                      <div className="py-3 px-4 text-center text-gray-500 text-sm bg-gray-50">
                        Showing first 100 of {filteredCodes.length} results
                      </div>
                    )}
                    {filteredCodes.length === 0 && (
                      <div className="py-8 text-center text-gray-500">
                        No codes found matching your search
                      </div>
                    )}
                  </div>
                </>
              )}
            </section>
          )}
          
          {totalEntries === 0 && !showICD10Browser ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ToothIcon />
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No Diagnosis Data</h2>
              <p className="text-gray-500 mb-6">Start by selecting a tooth and adding pathology or restoration data</p>
              <Link 
                href="/"
                className="px-6 py-3 bg-[#2196F3] text-white rounded-lg hover:bg-[#1E88E5] transition-colors font-medium"
              >
                Go to Dental Chart
              </Link>
            </div>
          ) : totalEntries > 0 && (
            <div className="space-y-8">
              {/* Pathologies Section */}
              {pathologies.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    Pathologies ({pathologies.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pathologies.map((entry) => (
                      <PathologyCard 
                        key={entry.id} 
                        entry={entry} 
                        onRemove={() => removePathology(entry.id)} 
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Restorations Section */}
              {restorations.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#2196F3] rounded-full"></span>
                    Restorations ({restorations.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {restorations.map((entry) => (
                      <RestorationCard 
                        key={entry.id} 
                        entry={entry} 
                        onRemove={() => removeRestoration(entry.id)} 
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Endodontics Section */}
              {endodontics.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                    Endodontic Tests ({endodontics.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {endodontics.map((entry) => (
                      <EndodonticCard 
                        key={entry.id} 
                        entry={entry} 
                        onRemove={() => {}} 
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* ICD-10 Summary */}
              {(pathologies.some(p => p.icdCode) || endodontics.some(e => e.icdCode)) && (
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">ICD-10 Codes Summary</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-600">Code</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-600">Description</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-600">Tooth</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-600">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pathologies.filter(p => p.icdCode).map((entry) => (
                          <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-mono text-[#2196F3] font-semibold">{entry.icdCode}</td>
                            <td className="py-3 px-4 text-gray-700">{entry.icdDescription}</td>
                            <td className="py-3 px-4 text-gray-700">{entry.toothNumber}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Pathology</span>
                            </td>
                          </tr>
                        ))}
                        {endodontics.filter(e => e.icdCode).map((entry) => (
                          <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-mono text-[#2196F3] font-semibold">{entry.icdCode}</td>
                            <td className="py-3 px-4 text-gray-700">{entry.icdDescription}</td>
                            <td className="py-3 px-4 text-gray-700">{entry.toothNumber}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Endodontic</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
