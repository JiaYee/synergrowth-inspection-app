import { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, View, Text, Modal } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useInspection } from '@/services/inspection-context';

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const machineResult = params.machineResult as 'PASS' | 'FAIL';
  const confidence = parseFloat(params.confidence as string);
  const justification = params.justification as string;
  const imageUri = params.imageUri as string;

  const { reset } = useInspection();
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const handleDone = () => {
    setShowCompleteModal(true);
  };

  const handleReturn = () => {
    setShowCompleteModal(false);
    reset();
    router.replace('/(tabs)');
  };

  const handleRetry = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Component Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.componentImage}
            resizeMode="contain"
          />
          <View style={styles.imageBorder} />
        </View>

        {/* Result Display */}
        <Text style={styles.resultText}>
          Result: {machineResult}
        </Text>
        <Text style={styles.confidenceText}>
          Confidence: {Number(confidence).toFixed(1)}%
        </Text>
        {justification ? (
          <Text style={styles.justificationText}>{justification}</Text>
        ) : null}

        {/* Retry Button */}
        <TouchableOpacity
          style={styles.retryButton}
          onPress={handleRetry}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>

        {/* Done Button */}
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleDone}
        >
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Completion Modal */}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    width: '80%',
    aspectRatio: 1,
    marginBottom: 20,
    position: 'relative',
  },
  componentImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imageBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderColor: '#FF0000',
    borderRadius: 8,
  },
  resultText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  confidenceText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666666',
  },
  justificationText: {
    fontSize: 14,
    marginBottom: 20,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
  retryButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#000000',
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
  doneButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  buttonText: {
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
