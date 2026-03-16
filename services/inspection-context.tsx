import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  generateInspectionPoints,
  type InspectionPoint,
} from '@/utils/inspection-points';

export interface InspectionData {
  product_model: string;
  product_image: number;
  production_line: string;
  station_number: string;
  production_shift: string;
  operator: string;
  device_id: string;
}

export interface InspectionResult {
  imageUri: string;
  result: 'PASS' | 'FAIL';
  confidence: number;
  justification: string;
}

interface InspectionContextType {
  inspectionData: InspectionData | null;
  setInspectionData: (data: InspectionData) => void;
  inspectionPoints: InspectionPoint[];
  setInspectionPoints: (points: InspectionPoint[]) => void;
  inspectionResults: InspectionResult[];
  addInspectionResult: (result: InspectionResult) => void;
  currentPointIndex: number;
  advanceToNextPoint: () => boolean;
  reset: () => void;
}

const InspectionContext = createContext<InspectionContextType | undefined>(
  undefined
);

export function InspectionProvider({ children }: { children: ReactNode }) {
  const [inspectionData, setInspectionData] =
    useState<InspectionData | null>(null);
  const [inspectionPoints, setInspectionPoints] = useState<InspectionPoint[]>(
    []
  );
  const [inspectionResults, setInspectionResults] = useState<
    InspectionResult[]
  >([]);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);

  const addInspectionResult = (result: InspectionResult) => {
    setInspectionResults((prev) => [...prev, result]);
  };

  const advanceToNextPoint = (): boolean => {
    const nextIndex = currentPointIndex + 1;
    setCurrentPointIndex(nextIndex);
    return nextIndex < inspectionPoints.length;
  };

  const reset = () => {
    setInspectionData(null);
    setInspectionPoints([]);
    setInspectionResults([]);
    setCurrentPointIndex(0);
  };

  return (
    <InspectionContext.Provider
      value={{
        inspectionData,
        setInspectionData,
        inspectionPoints,
        setInspectionPoints,
        inspectionResults,
        addInspectionResult,
        currentPointIndex,
        advanceToNextPoint,
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
