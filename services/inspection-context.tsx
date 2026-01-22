import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Component } from '@/constants/mock-data';

export interface InspectionData {
  product_model: string;
  production_line: string;
  station_number: string;
  production_shift: string;
  operator: string;
  device_id: string;
}

interface InspectionContextType {
  inspectionData: InspectionData | null;
  components: Component[];
  currentComponentIndex: number;
  setInspectionData: (data: InspectionData) => void;
  setComponents: (components: Component[]) => void;
  setCurrentComponentIndex: (index: number) => void;
  reset: () => void;
}

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

export function InspectionProvider({ children }: { children: ReactNode }) {
  const [inspectionData, setInspectionData] = useState<InspectionData | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);
  
  const reset = () => {
    setInspectionData(null);
    setComponents([]);
    setCurrentComponentIndex(0);
  };
  
  return (
    <InspectionContext.Provider
      value={{
        inspectionData,
        components,
        currentComponentIndex,
        setInspectionData,
        setComponents,
        setCurrentComponentIndex,
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
