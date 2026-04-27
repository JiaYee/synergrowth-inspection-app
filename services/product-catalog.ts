/**
 * Local persisted catalog: products and inspection points with reference photos.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

const STORAGE_KEY = '@synergrowth_products_v1';

function getCatalogImagesDir(): string {
  const base = FileSystem.documentDirectory;
  if (!base) {
    throw new Error('FileSystem.documentDirectory is not available');
  }
  return `${base}catalog_images/`;
}

export interface InspectionPointRecord {
  id: string;
  name: string;
  /** Copied into app document directory */
  referenceImageUri: string;
  specNotes?: string;
}

export interface ProductRecord {
  id: string;
  name: string;
  /** Optional product overview image (file URI) */
  productImageUri?: string;
  inspectionPoints: InspectionPointRecord[];
  createdAt: string;
  updatedAt: string;
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function createInspectionPointId(): string {
  return generateId();
}

export function createProductId(): string {
  return generateId();
}

async function ensureImagesDir(): Promise<void> {
  const dir = getCatalogImagesDir();
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, {
      intermediates: true,
    });
  }
}

/**
 * Copy a picked or captured image into persistent app storage.
 */
export async function copyImageToPersistent(sourceUri: string): Promise<string> {
  await ensureImagesDir();
  const catalogDir = getCatalogImagesDir();
  const base = sourceUri.split('/').pop() ?? 'img.jpg';
  const ext =
    base.includes('.') ? base.split('.').pop()?.split('?')[0] ?? 'jpg' : 'jpg';
  const dest = `${catalogDir}${generateId()}.${ext}`;
  await FileSystem.copyAsync({ from: sourceUri, to: dest });
  return dest;
}

export async function deleteFileIfInCatalog(uri: string): Promise<void> {
  let catalogDir: string;
  try {
    catalogDir = getCatalogImagesDir();
  } catch {
    return;
  }
  if (!uri || !uri.startsWith(catalogDir)) return;
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch {
    /* ignore */
  }
}

export async function loadProducts(): Promise<ProductRecord[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ProductRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveProducts(products: ProductRecord[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export async function getProduct(id: string): Promise<ProductRecord | null> {
  const products = await loadProducts();
  return products.find((p) => p.id === id) ?? null;
}

export async function upsertProduct(product: ProductRecord): Promise<void> {
  const products = await loadProducts();
  const now = new Date().toISOString();
  const idx = products.findIndex((p) => p.id === product.id);
  const next: ProductRecord = {
    ...product,
    updatedAt: now,
    createdAt:
      idx >= 0 ? products[idx].createdAt : product.createdAt || now,
  };
  if (idx >= 0) {
    products[idx] = next;
  } else {
    products.push(next);
  }
  await saveProducts(products);
}

export async function deleteProduct(id: string): Promise<void> {
  const product = await getProduct(id);
  if (!product) return;
  if (product.productImageUri) {
    await deleteFileIfInCatalog(product.productImageUri);
  }
  for (const pt of product.inspectionPoints) {
    await deleteFileIfInCatalog(pt.referenceImageUri);
  }
  const products = (await loadProducts()).filter((p) => p.id !== id);
  await saveProducts(products);
}

export function defaultInspectionPoint(
  partial?: Partial<InspectionPointRecord>
): InspectionPointRecord {
  return {
    id: createInspectionPointId(),
    name: partial?.name ?? 'Inspection point',
    referenceImageUri: partial?.referenceImageUri ?? '',
    specNotes: partial?.specNotes,
  };
}
