import { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, View, Alert, ActivityIndicator, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useInspection } from '@/services/inspection-context';
import { submitInspectionResult } from '@/services/api';

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const machineResult = params.machineResult as 'PASS' | 'FAIL';
  const confidence = parseFloat(params.confidence as string);
  const imageUri = params.imageUri as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { inspectionData, reset } = useInspection();

  const handleFeedback = async (humanResult: 'PASS' | 'FAIL') => {
    if (!inspectionData) {
      Alert.alert('Error', 'Inspection data not found.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Format current datetime as "YYYY-MM-DD HH:MM:SS"
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const currentDatetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      // Map fields from app format to backend format
      const metadata = {
        product_code: inspectionData.product_model,
        production_line: inspectionData.production_line,
        line_station: inspectionData.station_number,
        production_shift: inspectionData.production_shift,
        component_number: inspectionData.product_model,
        operator_id: inspectionData.operator,
        current_datetime: currentDatetime,
        device_id: inspectionData.device_id,
        machine_prediction: machineResult.toLowerCase() as 'pass' | 'fail',
        human_prediction: humanResult.toLowerCase() as 'pass' | 'fail',
      };

      // Submit inspection result to backend
      await submitInspectionResult(imageUri, metadata);

      // Inspection complete, reset and go back to welcome
      reset();
      Alert.alert('Complete', 'Inspection complete.', [
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)'),
        },
      ]);
    } catch (error) {
      console.error('Error submitting inspection result:', error);
      Alert.alert('Error', 'Failed to submit inspection result. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAgreeButtonLabel = () => {
    return machineResult === 'PASS' ? 'YES, PASS' : 'YES, FAIL';
  };

  const getDisagreeButtonLabel = () => {
    return machineResult === 'PASS' ? 'NO, FAIL' : 'NO, PASS';
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
          Confidence: {(Math.floor(confidence * 10000) / 100).toFixed(2)}%
        </Text>

        {/* Feedback Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.feedbackButton, styles.agreeButton]}
            onPress={() => handleFeedback(machineResult)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>
                {getAgreeButtonLabel()}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.feedbackButton, styles.disagreeButton]}
            onPress={() => handleFeedback(machineResult === 'PASS' ? 'FAIL' : 'PASS')}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>
                {getDisagreeButtonLabel()}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
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
    marginBottom: 30,
    color: '#666666',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  feedbackButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  agreeButton: {
    backgroundColor: '#000000',
  },
  disagreeButton: {
    backgroundColor: '#000000',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
