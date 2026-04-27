// API service for communicating with backend
import { API_BASE_URL, DEMO_MODE } from '@/constants/config';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const ANALYZE_API_URL = `${API_BASE_URL}/analyze`;

const MAX_RESIZE = 800;
const COMPRESS_QUALITY = 0.7;

let analyzeCallCount = 0;

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
  /** 0–100 */
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
  inspection_point?: string;
  expected_specs?: string;
}

function normalizeConfidence(raw: unknown): number {
  const n = Number(raw);
  if (Number.isNaN(n)) return 0;
  if (n > 0 && n <= 1) return Math.round(n * 1000) / 10;
  return Math.min(100, Math.max(0, Math.round(n * 10) / 10));
}

export async function predictImage(
  referenceImageUri: string,
  capturedImageUri: string,
  metadata?: PredictMetadata
): Promise<PredictResponse> {
  if (DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    analyzeCallCount += 1;
    const confidence = 40 + Math.random() * 60;
    const prediction = analyzeCallCount === 1 ? 'fail' : 'pass';
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
  formData.append('product_image', {
    uri: referenceImageUri,
    type: 'image/jpeg',
    name: 'reference.jpg',
  } as any);
  formData.append('captured_photo', {
    uri: capturedImageUri,
    type: 'image/jpeg',
    name: 'captured.jpg',
  } as any);

  if (metadata) {
    if (metadata.product_model)
      formData.append('product_model', metadata.product_model);
    if (metadata.production_line)
      formData.append('production_line', metadata.production_line);
    if (metadata.station_number)
      formData.append('station_number', metadata.station_number);
    if (metadata.production_shift)
      formData.append('production_shift', metadata.production_shift);
    if (metadata.operator) formData.append('operator', metadata.operator);
    if (metadata.device_id) formData.append('device_id', metadata.device_id);
    if (metadata.inspection_point)
      formData.append('inspection_point', metadata.inspection_point);
    if (metadata.expected_specs)
      formData.append('expected_specs', metadata.expected_specs);
  }

  console.log('[API] POST /analyze');
  console.log('[API] URL:', ANALYZE_API_URL);

  const response = await fetch(ANALYZE_API_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[API] Analyze failed:', response.statusText, errorText);
    throw new Error(`Analyze failed: ${response.statusText} - ${errorText}`);
  }

  const raw = (await response.json()) as Record<string, unknown>;
  console.log('[API] Response:', JSON.stringify(raw));

  const explanation =
    (typeof raw.explanation === 'string' && raw.explanation) ||
    (typeof raw.justification === 'string' && raw.justification) ||
    '';

  const confidence = normalizeConfidence(
    raw.confidence ?? raw.matching_rate ?? raw.score
  );

  const pred =
    typeof raw.prediction === 'string'
      ? raw.prediction.toLowerCase()
      : 'fail';

  return {
    prediction: pred === 'pass' ? 'pass' : 'fail',
    confidence,
    justification: explanation,
  };
}
