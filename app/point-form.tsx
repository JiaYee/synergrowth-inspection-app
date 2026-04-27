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
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import {
  copyImageToPersistent,
  defaultInspectionPoint,
  deleteFileIfInCatalog,
  getProduct,
  upsertProduct,
  type InspectionPointRecord,
} from '@/services/product-catalog';
import { pickImageFromCameraOrLibrary } from '@/utils/pick-image';

export default function PointFormScreen() {
  const { productId, pointId } = useLocalSearchParams<{
    productId: string;
    pointId?: string;
  }>();
  const isEdit = Boolean(pointId);

  const [name, setName] = useState('');
  const [specNotes, setSpecNotes] = useState('');
  const [referenceImageUri, setReferenceImageUri] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      return;
    }
    const p = await getProduct(productId);
    if (!p) {
      Alert.alert('Not found', 'Product was removed.');
      router.back();
      return;
    }
    if (pointId) {
      const pt = p.inspectionPoints.find((x) => x.id === pointId);
      if (!pt) {
        Alert.alert('Not found', 'Inspection point was removed.');
        router.back();
        return;
      }
      setName(pt.name);
      setSpecNotes(pt.specNotes ?? '');
      setReferenceImageUri(pt.referenceImageUri);
    } else {
      setName('Inspection point');
      setSpecNotes('');
      setReferenceImageUri('');
    }
    setLoading(false);
  }, [productId, pointId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const pickReference = async () => {
    const picked = await pickImageFromCameraOrLibrary();
    if (!picked) return;
    const uri = await copyImageToPersistent(picked);
    if (referenceImageUri) {
      await deleteFileIfInCatalog(referenceImageUri);
    }
    setReferenceImageUri(uri);
  };

  const save = async () => {
    if (!productId) return;
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Validation', 'Enter a point name.');
      return;
    }
    if (!referenceImageUri) {
      Alert.alert('Validation', 'Pick a reference photo for this point.');
      return;
    }

    const p = await getProduct(productId);
    if (!p) {
      Alert.alert('Error', 'Product not found.');
      return;
    }

    let nextPoints: InspectionPointRecord[];
    if (isEdit && pointId) {
      nextPoints = p.inspectionPoints.map((pt) =>
        pt.id === pointId
          ? {
              ...pt,
              name: trimmedName,
              specNotes: specNotes.trim() || undefined,
              referenceImageUri,
            }
          : pt
      );
    } else {
      const nu = defaultInspectionPoint({
        name: trimmedName,
        specNotes: specNotes.trim() || undefined,
        referenceImageUri,
      });
      nextPoints = [...p.inspectionPoints, nu];
    }

    await upsertProduct({ ...p, inspectionPoints: nextPoints });
    router.replace({ pathname: '/points-list', params: { productId } });
  };

  if (!productId) {
    return (
      <View style={styles.centered}>
        <Text>Missing product.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Point name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Main rating label"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Expected specs / notes (optional)</Text>
      <Text style={styles.hint}>
        Shown to the operator before capture. Also sent to the AI (e.g. &quot;Must read 40A&quot;).
      </Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={specNotes}
        onChangeText={setSpecNotes}
        placeholder="Free text for expected markings…"
        placeholderTextColor="#999"
        multiline
      />

      <Text style={styles.label}>Reference photo (required)</Text>
      {referenceImageUri ? (
        <Image
          source={{ uri: referenceImageUri }}
          style={styles.preview}
          resizeMode="contain"
        />
      ) : null}
      <TouchableOpacity style={styles.btn} onPress={pickReference}>
        <Text style={styles.btnText}>
          {referenceImageUri ? 'Change reference photo' : 'Add reference photo'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => void save()}>
        <Text style={styles.primaryBtnText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() =>
          router.replace({ pathname: '/points-list', params: { productId } })
        }
      >
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
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  preview: {
    width: '100%',
    height: 200,
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
});
