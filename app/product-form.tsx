import { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import {
  copyImageToPersistent,
  createProductId,
  deleteFileIfInCatalog,
  deleteProduct,
  getProduct,
  upsertProduct,
  type ProductRecord,
} from '@/services/product-catalog';

export default function ProductFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [productImageUri, setProductImageUri] = useState<string | undefined>();
  const [loading, setLoading] = useState(isEdit);

  const load = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    const p = await getProduct(id);
    if (!p) {
      Alert.alert('Not found', 'Product was removed.');
      router.back();
      return;
    }
    setName(p.name);
    setProductImageUri(p.productImageUri);
    setLoading(false);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const pickOverview = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission', 'Photo library access is needed.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
    });
    if (result.canceled || !result.assets[0]?.uri) return;
    const uri = await copyImageToPersistent(result.assets[0].uri);
    if (productImageUri) {
      await deleteFileIfInCatalog(productImageUri);
    }
    setProductImageUri(uri);
  };

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Validation', 'Enter a product name.');
      return;
    }
    const now = new Date().toISOString();
    let record: ProductRecord;
    if (isEdit && id) {
      const existing = await getProduct(id);
      if (!existing) {
        Alert.alert('Error', 'Product not found.');
        return;
      }
      record = {
        ...existing,
        name: trimmed,
        productImageUri,
        updatedAt: now,
      };
    } else {
      record = {
        id: createProductId(),
        name: trimmed,
        productImageUri,
        inspectionPoints: [],
        createdAt: now,
        updatedAt: now,
      };
    }
    await upsertProduct(record);
    router.replace({
      pathname: '/points-list',
      params: { productId: record.id },
    });
  };

  const removeProduct = async () => {
    if (!id) return;
    const existing = await getProduct(id);
    if (!existing) return;
    Alert.alert(
      'Delete product',
      `Remove "${existing.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteProduct(id);
            router.replace('/products');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Product name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Breaker panel SKU-123"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Product overview image (optional)</Text>
      <Text style={styles.hint}>
        Used on the product screen with inspection area overlay.
      </Text>
      {productImageUri ? (
        <Image
          source={{ uri: productImageUri }}
          style={styles.preview}
          resizeMode="contain"
        />
      ) : null}
      <TouchableOpacity style={styles.btn} onPress={pickOverview}>
        <Text style={styles.btnText}>
          {productImageUri ? 'Change overview image' : 'Pick overview image'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => void save()}>
        <Text style={styles.primaryBtnText}>
          {isEdit ? 'Save & manage points' : 'Create & add points'}
        </Text>
      </TouchableOpacity>

      {isEdit ? (
        <>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() =>
              router.push({ pathname: '/points-list', params: { productId: id! } })
            }
          >
            <Text style={styles.secondaryBtnText}>Inspection points only</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dangerBtn} onPress={() => void removeProduct()}>
            <Text style={styles.dangerBtnText}>Delete product</Text>
          </TouchableOpacity>
        </>
      ) : null}

      <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()}>
        <Text style={styles.secondaryBtnText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    marginTop: 12,
  },
  hint: { fontSize: 13, color: '#666', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#000',
  },
  preview: {
    width: '100%',
    height: 180,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { color: '#FFF', fontWeight: '600' },
  primaryBtn: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  secondaryBtn: { padding: 14, alignItems: 'center', marginTop: 8 },
  secondaryBtnText: { color: '#333', fontSize: 16 },
  dangerBtn: {
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#DC143C',
    borderRadius: 8,
  },
  dangerBtnText: { color: '#DC143C', fontWeight: '600' },
});
