/** Inspection point with normalized coordinates (0-1) for overlay on product image */
export interface InspectionPoint {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Hardcoded to 2 inspection points per product */
export function generateInspectionPoints(): InspectionPoint[] {
  return [
    { id: 'point-1', x: 0.15, y: 0.2, width: 0.3, height: 0.3 },
    { id: 'point-2', x: 0.55, y: 0.5, width: 0.3, height: 0.3 },
  ];
}
