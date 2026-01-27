// API service for communicating with backend
const API_BASE_URL = 'https://synergrowth-python-api.onrender.com';
const PREDICT_API_URL = 'https://deep-learning-celestica-senai.onrender.com/predict';

export interface UploadMetadata {
  product_model: string;
  production_line: string;
  station_number: string;
  production_shift: string;
  operator: string;
  component: string;
  timestamp: string;
  device_id: string;
  machine_result?: string;
  human_result?: string;
}

export interface UploadResponse {
  machine_result: 'PASS' | 'FAIL';
  confidence: number;
}

export interface PredictResponse {
  filename: string;
  prediction: 'pass' | 'fail';
  probability: number;
}

export async function uploadImage(
  imageUri: string,
  metadata: UploadMetadata
): Promise<UploadResponse> {
  const formData = new FormData();
  
  // Add image file - React Native FormData format
  const imageFile = {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any;
  formData.append('image', imageFile);
  
  // Add metadata fields
  formData.append('product_model', metadata.product_model);
  formData.append('production_line', metadata.production_line);
  formData.append('station_number', metadata.station_number);
  formData.append('production_shift', metadata.production_shift);
  formData.append('operator', metadata.operator);
  formData.append('component', metadata.component);
  formData.append('timestamp', metadata.timestamp);
  formData.append('device_id', metadata.device_id);
  
  if (metadata.machine_result) {
    formData.append('machine_result', metadata.machine_result);
  }
  if (metadata.human_result) {
    formData.append('human_result', metadata.human_result);
  }
  
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
    // Don't set Content-Type header - let fetch set it with boundary
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${response.statusText} - ${errorText}`);
  }
  
  return response.json();
}

export async function predictImage(
  imageUri: string
): Promise<PredictResponse> {
  const formData = new FormData();
  
  // Add image file - React Native FormData format
  // The new API expects the field name to be 'file'
  const imageFile = {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any;
  formData.append('file', imageFile);
  
  const response = await fetch(PREDICT_API_URL, {
    method: 'POST',
    body: formData,
    // Don't set Content-Type header - let fetch set it with boundary
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Prediction failed: ${response.statusText} - ${errorText}`);
  }
  
  return response.json();
}
