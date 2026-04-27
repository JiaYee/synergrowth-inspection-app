import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { InspectionPointRecord } from '@/services/product-catalog';

export interface InspectionData {
  product_id: string;
  product_model: string;
  production_line: string;
  station_number: string;
  production_shift: string;
  operator: string;
  device_id: string;
}

export interface InspectionResult {
  pointId: string;
  pointName: string;
  imageUri: string;
  result: 'PASS' | 'FAIL';
  /** 0–100 */
  confidence: number;
  justification: string;
}

interface InspectionContextType {
  inspectionData: InspectionData | null;
  setInspectionData: (data: InspectionData) => void;
  inspectionPoints: InspectionPointRecord[];
  setInspectionPoints: (points: InspectionPointRecord[]) => void;
  inspectionResults: InspectionResult[];
  addInspectionResult: (result: InspectionResult) => void;
  currentPointIndex: number;
  advanceToNextPoint: () => boolean;
  /** Clears session state and loads a new product inspection run */
  startInspectionSession: (
    data: InspectionData,
    points: InspectionPointRecord[]
  ) => void;
  reset: () => void;
}

const InspectionContext = createContext<InspectionContextType | undefined>(
  undefined
);

export function InspectionProvider({ children }: { children: ReactNode }) {
  const [inspectionData, setInspectionData] =
    useState<InspectionData | null>(null);
  const [inspectionPoints, setInspectionPoints] = useState<
    InspectionPointRecord[]
  >([]);
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

  const startInspectionSession = (
    data: InspectionData,
    points: InspectionPointRecord[]
  ) => {
    setInspectionData(data);
    setInspectionPoints(points);
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
        startInspectionSession,
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
