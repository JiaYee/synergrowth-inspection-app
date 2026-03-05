// API service for communicating with backend
import { API_BASE_URL, DEMO_MODE } from '@/constants/config';
import {
  manipulateAsync,
  SaveFormat,
} from 'expo-image-manipulator';

const ANALYZE_API_URL = `${API_BASE_URL}/analyze`;

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
  score: number;
  matching_rate: number;
  justification: string;
}

export async function predictImage(
  productImageUri: string,
  capturedImageUri: string
): Promise<PredictResponse> {
  if (DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    predictCallCount += 1;
    const matching_rate = 40 + Math.random() * 60;
    const prediction = predictCallCount === 1 ? 'fail' : 'pass';
    const result: PredictResponse = {
      prediction,
      score: matching_rate / 100,
      matching_rate,
      justification:
        prediction === 'pass'
          ? 'Captured photo matches reference specifications within tolerance.'
          : 'Visible deviations from reference; does not meet quality standards.',
    };
    console.log('[DEMO] predictImage mocked:', result);
    return result;
  }

  const formData = new FormData();

  formData.append('product_image', {
    uri: productImageUri,
    type: 'image/jpeg',
    name: 'product.jpg',
  } as any);

  formData.append('captured_photo', {
    uri: capturedImageUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any);

  console.log('[API] POST /analyze');
  console.log('[API] URL:', ANALYZE_API_URL);

  const response = await fetch(ANALYZE_API_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[API] Prediction failed:', response.statusText, errorText);
    throw new Error(`Prediction failed: ${response.statusText} - ${errorText}`);
  }

  const result = await response.json();
  console.log('[API] Response:', JSON.stringify(result));

  return result;
}
