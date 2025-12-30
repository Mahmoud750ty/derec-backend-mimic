"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

// Icon Components
const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const ChartIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="currentColor">
    <circle cx="5" cy="5" r="2.5" /><circle cx="13" cy="5" r="2.5" /><circle cx="21" cy="5" r="2.5" />
    <circle cx="5" cy="13" r="2.5" /><circle cx="13" cy="13" r="2.5" /><circle cx="21" cy="13" r="2.5" />
    <circle cx="5" cy="21" r="2.5" /><circle cx="13" cy="21" r="2.5" /><circle cx="21" cy="21" r="2.5" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const DiagnosisIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 7h6M9 11h6M9 15h3" />
    <path d="M14 17l2 2 3-3" />
  </svg>
);

interface SidebarProps {
  backHref?: string;
  showBack?: boolean;
}

export default function Sidebar({ backHref, showBack = true }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };
  
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="w-[72px] bg-[#2196F3] flex flex-col items-center py-4 shadow-lg shrink-0">
      <nav className="flex flex-col items-center gap-1 flex-1">
        {/* Back Button */}
        {showBack && (
          <button 
            onClick={handleBack}
            className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/20 rounded-xl transition-colors"
            title="Go Back"
          >
            <BackIcon />
          </button>
        )}
        
        {/* Chart/Home Link */}
        <Link 
          href="/" 
          className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors mt-2 ${
            isActive('/') && !isActive('/diagnosis') && !isActive('/patient-history')
              ? 'text-white bg-white/20'
              : 'text-white/70 hover:bg-white/20'
          }`}
          title="Dental Chart"
        >
          <ChartIcon />
        </Link>
        
        {/* Patient History Link */}
        <Link 
          href="/patient-history" 
          className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors mt-2 ${
            isActive('/patient-history')
              ? 'text-white bg-white/20'
              : 'text-white/70 hover:bg-white/20'
          }`}
          title="Patient History"
        >
          <HistoryIcon />
        </Link>
        
        {/* Diagnosis Link */}
        <Link 
          href="/diagnosis" 
          className={`w-12 h-12 flex items-center justify-center rounded-xl mt-6 transition-colors ${
            isActive('/diagnosis')
              ? 'text-white bg-white/20'
              : 'text-white bg-white/10 hover:bg-white/20'
          }`}
          title="View Diagnoses"
        >
          <DiagnosisIcon />
        </Link>
      </nav>
    </aside>
  );
}

