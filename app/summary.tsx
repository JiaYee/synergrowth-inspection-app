import { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
  Modal,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useInspection } from '@/services/inspection-context';

export default function SummaryScreen() {
  const { inspectionResults, reset } = useInspection();

  useEffect(() => {
    if (inspectionResults.length === 0) {
      router.replace('/(tabs)');
    }
  }, [inspectionResults.length]);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const handleDone = () => {
    setShowCompleteModal(true);
  };

  const handleReturn = () => {
    setShowCompleteModal(false);
    reset();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
      >
        <Text style={styles.title}>Inspection Summary</Text>
        {inspectionResults.map((item, index) => (
          <View key={`${item.pointId}-${index}`} style={styles.resultCard}>
            <Image
              source={{ uri: item.imageUri }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.resultInfo}>
              <Text style={styles.pointLabel}>
                {item.pointName || `Point ${index + 1}`}
              </Text>
              <Text
                style={[
                  styles.resultText,
                  item.result === 'PASS' ? styles.passText : styles.failText,
                ]}
              >
                {item.result}
              </Text>
              <Text style={styles.confidenceText}>
                Confidence: {Number(item.confidence).toFixed(1)}%
              </Text>
              {item.justification ? (
                <Text style={styles.justificationText} numberOfLines={4}>
                  {item.justification}
                </Text>
              ) : null}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showCompleteModal}
        transparent
        animationType="fade"
        onRequestClose={handleReturn}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Complete</Text>
            <Text style={styles.modalMessage}>
              All inspections have been completed. Test completed. Data saved.
            </Text>
            <TouchableOpacity
              style={styles.returnButton}
              onPress={handleReturn}
            >
              <Text style={styles.returnButtonText}>Return</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000000',
    textAlign: 'center',
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 16,
  },
  pointLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  passText: {
    color: '#228B22',
  },
  failText: {
    color: '#DC143C',
  },
  confidenceText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  justificationText: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  doneButton: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
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
  },
  modalTitle: {
    marginBottom: 16,
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalMessage: {
    marginBottom: 20,
    color: '#000000',
    fontSize: 16,
    lineHeight: 24,
  },
  returnButton: {
    padding: 12,
    backgroundColor: '#000000',
    borderRadius: 8,
    alignItems: 'center',
  },
  returnButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
