import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import {
  deleteFileIfInCatalog,
  getProduct,
  upsertProduct,
  type InspectionPointRecord,
} from '@/services/product-catalog';

export default function PointsListScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [productName, setProductName] = useState('');
  const [points, setPoints] = useState<InspectionPointRecord[]>([]);

  const refresh = useCallback(async () => {
    if (!productId) return;
    const p = await getProduct(productId);
    if (!p) {
      Alert.alert('Not found', 'Product was removed.');
      router.back();
      return;
    }
    setProductName(p.name);
    setPoints(p.inspectionPoints);
  }, [productId]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const deletePoint = (pointId: string) => {
    if (!productId) return;
    Alert.alert('Delete point', 'Remove this inspection point?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const p = await getProduct(productId);
          if (!p) return;
          const removed = p.inspectionPoints.find((x) => x.id === pointId);
          if (removed?.referenceImageUri) {
            await deleteFileIfInCatalog(removed.referenceImageUri);
          }
          const next = {
            ...p,
            inspectionPoints: p.inspectionPoints.filter((x) => x.id !== pointId),
          };
          await upsertProduct(next);
          await refresh();
        },
      },
    ]);
  };

  if (!productId) {
    return (
      <View style={styles.centered}>
        <Text>Missing product.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inspection points</Text>
      <Text style={styles.subtitle}>{productName}</Text>

      <FlatList
        data={points}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No points yet. Add a point and attach a reference photo.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardMain}
              onPress={() =>
                router.push({
                  pathname: '/point-form',
                  params: { productId, pointId: item.id },
                })
              }
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardMeta}>
                {item.referenceImageUri ? 'Reference photo set' : 'No reference photo'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deletePoint(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() =>
          router.push({ pathname: '/point-form', params: { productId } })
        }
      >
        <Text style={styles.primaryBtnText}>Add inspection point</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()}>
        <Text style={styles.secondaryBtnText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    paddingTop: 48,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 16 },
  list: { flexGrow: 1, paddingBottom: 16 },
  empty: { color: '#888', textAlign: 'center', marginTop: 24 },
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  cardMain: { flex: 1, padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  cardMeta: { fontSize: 13, color: '#666', marginTop: 4 },
  deleteBtn: {
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#FFF',
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
  deleteText: { color: '#DC143C', fontWeight: '600' },
  primaryBtn: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  secondaryBtn: { padding: 14, alignItems: 'center' },
  secondaryBtnText: { color: '#333', fontSize: 16 },
});
