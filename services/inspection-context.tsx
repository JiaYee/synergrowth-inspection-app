import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface InspectionData {
  product_model: string;
  product_image: number;
  production_line: string;
  station_number: string;
  production_shift: string;
  operator: string;
  device_id: string;
}

interface InspectionContextType {
  inspectionData: InspectionData | null;
  setInspectionData: (data: InspectionData) => void;
  reset: () => void;
}

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

export function InspectionProvider({ children }: { children: ReactNode }) {
  const [inspectionData, setInspectionData] = useState<InspectionData | null>(null);
  
  const reset = () => {
    setInspectionData(null);
  };
  
  return (
    <InspectionContext.Provider
      value={{
        inspectionData,
        setInspectionData,
        reset,
      }}
    >
      {children}
    </InspectionContext.Provider>
  );
}

export function useInspection() {
  const context = useContext(InspectionContext);
  if (context === undefined) {
    throw new Error('useInspection must be used within an InspectionProvider');
  }
  return context;
}
