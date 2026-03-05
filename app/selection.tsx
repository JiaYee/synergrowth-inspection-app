import { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Modal, View, Text } from 'react-native';
import { router } from 'expo-router';
import { useInspection } from '@/services/inspection-context';
import * as Device from 'expo-device';
import {
  PRODUCT_MODELS,
  PRODUCTION_LINES,
  STATION_NUMBERS,
  PRODUCTION_SHIFTS,
  OPERATORS,
} from '@/constants/mock-data';

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
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.dropdownText}>
          {value || `Select ${label}`}
        </Text>
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
            <Text style={styles.modalTitle}>
              Select {label}
            </Text>
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

export default function SelectionScreen() {
  const { setInspectionData } = useInspection();
  const [productModel, setProductModel] = useState('');
  const [productionLine, setProductionLine] = useState('');
  const [stationNumber, setStationNumber] = useState('');
  const [productionShift, setProductionShift] = useState('');
  const [operator, setOperator] = useState('');

  const handleEnter = () => {
    if (!productModel || !productionLine || !stationNumber || !productionShift || !operator) {
      alert('Please fill up all fields to proceed');
      return;
    }

    const deviceId = Device.modelName || 'mobile_phone_1';
    
    setInspectionData({
      product_model: productModel,
      production_line: productionLine,
      station_number: stationNumber,
      production_shift: productionShift,
      operator: operator,
      device_id: deviceId,
    });
    
    router.push('/product');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Dropdown
          label="Product Model"
          value={productModel}
          options={PRODUCT_MODELS}
          onSelect={setProductModel}
        />
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

        <Text style={styles.hint}>
          Fill up all to proceed
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleEnter}>
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
