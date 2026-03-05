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

// Per-product images (add product_x.png, product_y.png, product_z.png to assets/images)
export const PRODUCT_MODEL_IMAGES: Record<string, number> = {
  PRODUCT_X: require('@/assets/images/product_x.png'),
  PRODUCT_Y: require('@/assets/images/product_y.png'),
  PRODUCT_Z: require('@/assets/images/product_z.png'),
};
