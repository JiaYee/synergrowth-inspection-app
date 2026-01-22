// Mock data for POC
export const PRODUCT_MODELS = [
  'PRODUCT_X',
  'PRODUCT_Y',
  'PRODUCT_Z',
];

export const PRODUCTION_LINES = [
  'LINE_A',
  'LINE_B',
  'LINE_C',
];

export const STATION_NUMBERS = [
  'STATION_1',
  'STATION_2',
  'STATION_3',
];

export const PRODUCTION_SHIFTS = [
  'SHIFT_A',
  'SHIFT_B',
  'SHIFT_C',
];

export const OPERATORS = [
  'OPERATOR_1',
  'OPERATOR_2',
  'OPERATOR_3',
];

// Mock component data with coordinates (x1, y1, x2, y2)
export interface Component {
  id: string;
  name: string;
  coordinates: { x1: number; y1: number; x2: number; y2: number };
}

export const MOCK_COMPONENTS: Component[] = [
  {
    id: 'COMPONENT_1',
    name: 'Component 1',
    coordinates: { x1: 100, y1: 50, x2: 200, y2: 150 },
  },
  {
    id: 'COMPONENT_2',
    name: 'Component 2',
    coordinates: { x1: 250, y1: 50, x2: 350, y2: 150 },
  },
];

// Mock product image
export const MOCK_PRODUCT_IMAGE = require('@/assets/images/fce55b4f-896e-4763-83c2-1bc574fc6926.jpg');
