// API service for communicating with backend
import { API_BASE_URL, DEMO_MODE } from '@/constants/config';

const ANALYZE_API_URL = `${API_BASE_URL}/analyze`;

let predictCallCount = 0;

export interface PredictResponse {
  prediction: 'pass' | 'fail';
  score: number;
}

export async function predictImage(
  imageUri: string
): Promise<PredictResponse> {
  if (DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    predictCallCount += 1;
    const score = 0.9 + Math.random() * 0.1;
    const prediction = predictCallCount === 1 ? 'fail' : 'pass';
    const result: PredictResponse = { prediction, score };
    console.log('[DEMO] predictImage mocked:', result);
    return result;
  }

  const formData = new FormData();

  // Add image file - React Native FormData format
  // The new API expects the field name to be 'file'
  const imageFile = {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any;
  formData.append('file', imageFile);

  // Log request payload
  const payload = {
    file: {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    },
  };
  console.log('[API] POST /predict');
  console.log('[API] URL:', ANALYZE_API_URL);
  console.log('[API] Request payload:', JSON.stringify(payload, null, 2));

  const response = await fetch(ANALYZE_API_URL, {
    method: 'POST',
    body: formData,
    // Don't set Content-Type header - let fetch set it with boundary
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
