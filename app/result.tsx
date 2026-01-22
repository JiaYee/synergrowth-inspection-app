import { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, View, Alert, ActivityIndicator, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useInspection } from '@/services/inspection-context';
import { uploadImage } from '@/services/api';

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const machineResult = params.machineResult as 'PASS' | 'FAIL';
  const confidence = parseFloat(params.confidence as string);
  const imageUri = params.imageUri as string;
  const componentId = params.componentId as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { inspectionData, components, currentComponentIndex, setCurrentComponentIndex, reset } = useInspection();

  const handleFeedback = async (humanResult: 'PASS' | 'FAIL') => {
    if (!inspectionData) {
      return;
    }

    setIsSubmitting(true);
    try {
      const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];

      // Send feedback back to server
      await uploadImage(imageUri, {
        product_model: inspectionData.product_model,
        production_line: inspectionData.production_line,
        station_number: inspectionData.station_number,
        production_shift: inspectionData.production_shift,
        operator: inspectionData.operator,
        component: componentId,
        timestamp: timestamp,
        device_id: inspectionData.device_id,
        machine_result: machineResult,
        human_result: humanResult,
      });

      // Move to next component or finish
      if (currentComponentIndex < components.length - 1) {
        setCurrentComponentIndex(currentComponentIndex + 1);
        router.push('/component');
      } else {
        // All components inspected, reset and go back to welcome
        reset();
        Alert.alert('Complete', 'All components have been inspected.', [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)'),
          },
        ]);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
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
          Confidence: {(confidence * 100).toFixed(0)}%
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
