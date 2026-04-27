import { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import {
  createProductId,
  deleteProduct,
  getProduct,
  upsertProduct,
  type ProductRecord,
} from '@/services/product-catalog';

export default function ProductFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
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
    setLoading(false);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

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
        updatedAt: now,
      };
    } else {
      record = {
        id: createProductId(),
        name: trimmed,
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

      <Text style={styles.hint}>
        Add inspection points next; each point has its own reference photo used when capturing and analyzing.
      </Text>

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
  hint: { fontSize: 13, color: '#666', marginBottom: 16, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#000',
  },
  primaryBtn: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
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
