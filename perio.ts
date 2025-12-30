interface PeriodontalData {
  toothNumber: string; // FDI or Universal tooth number (e.g., "16", "3")
  
  // Six-site measurements around the tooth
  sites: {
    distoPalatal: {
      probingDepth: number; // 0-12 or >12 mm pocket depth measurement
      gingivalMargin: number; // -12 to +7 mm (negative = recession, positive = overgrowth)
      bleeding: boolean; // Red dot indicator when true
      plaque: boolean; // Blue dot indicator when true
      pus: boolean; // Yellow dot indicator when true  
      tartar: boolean; // Black dot indicator when true
        },
    palatal: {
      probingDepth: number;     
      gingivalMargin: number;   
      bleeding: boolean;        
      plaque: boolean;          
      pus: boolean;             
      tartar: boolean;
        },
    mesioPalatal: {
      probingDepth: number;     
      gingivalMargin: number;   
      bleeding: boolean;        
      plaque: boolean;          
      pus: boolean;             
      tartar: boolean;
        },
    distoBuccal: {
      probingDepth: number;     
      gingivalMargin: number;   
      bleeding: boolean;        
      plaque: boolean;          
      pus: boolean;             
      tartar: boolean;
        },
    buccal: {
      probingDepth: number;     
      gingivalMargin: number;   
      bleeding: boolean;        
      plaque: boolean;          
      pus: boolean;             
      tartar: boolean;
        },
    mesioBuccal: {
      probingDepth: number;     
      gingivalMargin: number;   
      bleeding: boolean;        
      plaque: boolean;          
      pus: boolean;             
      tartar: boolean;
        }
    },
  
  toothMobility: {
    class: number; // 0, 1, 2, or 3 (0 = no mobility, 3 = severe)
    }
}