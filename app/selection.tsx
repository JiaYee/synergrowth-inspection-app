import { useCallback, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  View,
  Text,
  Alert,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useInspection } from '@/services/inspection-context';
import * as Device from 'expo-device';
import {
  PRODUCTION_LINES,
  STATION_NUMBERS,
  PRODUCTION_SHIFTS,
  OPERATORS,
} from '@/constants/mock-data';
import { getProduct, loadProducts, type ProductRecord } from '@/services/product-catalog';

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}

function Dropdown({ label, value, options, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setIsOpen(true)}>
        <Text style={styles.dropdownText}>{value || `Select ${label}`}</Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select {label}</Text>
            <ScrollView>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.option}
                  onPress={() => {
                    onSelect(option);
                    setIsOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsOpen(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ProductPicker({
  products,
  selectedId,
  onSelect,
}: {
  products: ProductRecord[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = products.find((p) => p.id === selectedId);
  const label = selected?.name ?? '';

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>Product</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setIsOpen(true)}>
        <Text style={styles.dropdownText}>{label || 'Select product'}</Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select product</Text>
            <ScrollView>
              {products.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.option}
                  onPress={() => {
                    onSelect(p.id);
                    setIsOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{p.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsOpen(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function SelectionScreen() {
  const { startInspectionSession } = useInspection();
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productionLine, setProductionLine] = useState('');
  const [stationNumber, setStationNumber] = useState('');
  const [productionShift, setProductionShift] = useState('');
  const [operator, setOperator] = useState('');

  const refreshProducts = useCallback(async () => {
    const list = await loadProducts();
    setProducts(list);
    setSelectedProductId((prev) => {
      if (prev && list.some((p) => p.id === prev)) return prev;
      return '';
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshProducts();
    }, [refreshProducts])
  );

  const handleEnter = async () => {
    if (
      !selectedProductId ||
      !productionLine ||
      !stationNumber ||
      !productionShift ||
      !operator
    ) {
      Alert.alert('Required', 'Please fill all fields to proceed.');
      return;
    }

    const product = await getProduct(selectedProductId);
    if (!product) {
      Alert.alert('Error', 'Selected product no longer exists.');
      void refreshProducts();
      return;
    }
    if (product.inspectionPoints.length === 0) {
      Alert.alert(
        'No inspection points',
        'Add at least one inspection point with a reference photo.',
        [
          { text: 'OK' },
          {
            text: 'Manage',
            onPress: () =>
              router.push({
                pathname: '/points-list',
                params: { productId: product.id },
              }),
          },
        ]
      );
      return;
    }
    const missingRef = product.inspectionPoints.filter(
      (pt) => !pt.referenceImageUri?.trim()
    );
    if (missingRef.length > 0) {
      Alert.alert(
        'Missing reference photos',
        'Every inspection point must have a reference photo.'
      );
      return;
    }

    const deviceId = Device.modelName ?? 'mobile_phone_1';

    startInspectionSession(
      {
        product_id: product.id,
        product_model: product.name,
        product_image_uri: product.productImageUri,
        production_line: productionLine,
        station_number: stationNumber,
        production_shift: productionShift,
        operator,
        device_id: deviceId,
      },
      product.inspectionPoints
    );

    router.push('/product');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {products.length === 0 ? (
          <Text style={styles.warn}>
            No products yet. Create a product and inspection points first.
          </Text>
        ) : null}

        <ProductPicker
          products={products}
          selectedId={selectedProductId}
          onSelect={setSelectedProductId}
        />

        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => router.push('/products')}
        >
          <Text style={styles.linkText}>Manage products &amp; reference photos</Text>
        </TouchableOpacity>

        <Dropdown
          label="Production Line"
          value={productionLine}
          options={PRODUCTION_LINES}
          onSelect={setProductionLine}
        />
        <Dropdown
          label="Station Number"
          value={stationNumber}
          options={STATION_NUMBERS}
          onSelect={setStationNumber}
        />
        <Dropdown
          label="Production Shift"
          value={productionShift}
          options={PRODUCTION_SHIFTS}
          onSelect={setProductionShift}
        />
        <Dropdown
          label="Operator"
          value={operator}
          options={OPERATORS}
          onSelect={setOperator}
        />

        <Text style={styles.hint}>Fill all fields to start inspection</Text>

        <TouchableOpacity style={styles.button} onPress={() => void handleEnter()}>
          <Text style={styles.buttonText}>Enter</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  warn: {
    color: '#B8860B',
    marginBottom: 16,
    fontSize: 14,
  },
  linkBtn: {
    marginBottom: 20,
  },
  linkText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000000',
  },
  dropdown: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
  },
  dropdownArrow: {
    color: '#FFF',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    marginBottom: 16,
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#000000',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontSize: 14,
    color: '#666666',
  },
  button: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
