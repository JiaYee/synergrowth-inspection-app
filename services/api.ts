// API service for communicating with backend
import { API_BASE_URL, DEMO_MODE } from '@/constants/config';
import {
  manipulateAsync,
  SaveFormat,
} from 'expo-image-manipulator';

const PREDICT_API_URL = `${API_BASE_URL}/predict`;

const MAX_RESIZE = 800;
const COMPRESS_QUALITY = 0.7;

let predictCallCount = 0;

/** Compress image: resize to max 800px, JPEG quality 0.7 */
export async function compressImage(uri: string): Promise<string> {
  const result = await manipulateAsync(
    uri,
    [{ resize: { width: MAX_RESIZE, height: MAX_RESIZE } }],
    { compress: COMPRESS_QUALITY, format: SaveFormat.JPEG }
  );
  return result.uri;
}

export interface PredictResponse {
  prediction: 'pass' | 'fail';
  confidence: number;
  justification: string;
}

export interface PredictMetadata {
  product_model?: string;
  production_line?: string;
  station_number?: string;
  production_shift?: string;
  operator?: string;
  device_id?: string;
}

export async function predictImage(
  productImageUri: string,
  capturedImageUri: string,
  metadata?: PredictMetadata
): Promise<PredictResponse> {
  if (DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    predictCallCount += 1;
    const confidence = 40 + Math.random() * 60;
    const prediction = predictCallCount === 1 ? 'fail' : 'pass';
    const result: PredictResponse = {
      prediction,
      confidence,
      justification:
        prediction === 'pass'
          ? 'Captured photo matches reference specifications within tolerance.'
          : 'Visible deviations from reference; does not meet quality standards.',
    };
    console.log('[DEMO] predictImage mocked:', result);
    return result;
  }

  const formData = new FormData();
  formData.append('file', {
    uri: capturedImageUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any);

  if (metadata) {
    if (metadata.product_model) formData.append('product_model', metadata.product_model);
    if (metadata.production_line) formData.append('production_line', metadata.production_line);
    if (metadata.station_number) formData.append('station_number', metadata.station_number);
    if (metadata.production_shift) formData.append('production_shift', metadata.production_shift);
    if (metadata.operator) formData.append('operator', metadata.operator);
    if (metadata.device_id) formData.append('device_id', metadata.device_id);
  }

  console.log('[API] POST /predict');
  console.log('[API] URL:', PREDICT_API_URL);

  const response = await fetch(PREDICT_API_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[API] Prediction failed:', response.statusText, errorText);
    throw new Error(`Prediction failed: ${response.statusText} - ${errorText}`);
  }

  const raw = await response.json();
  console.log('[API] Response:', JSON.stringify(raw));

  // Map Flask /predict response to app's expected format
  return {
    prediction: raw.prediction,
    confidence: (raw.confidence ?? raw.score) * 100,
    justification:
      raw.prediction === 'pass'
        ? 'Image meets quality standards.'
        : 'Image does not meet quality standards.',
  };
}
