import { useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert, ActivityIndicator, Text } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useInspection } from '@/services/inspection-context';
import { predictImage } from '@/services/api';
import * as Device from 'expo-device';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { inspectionData, components, currentComponentIndex } = useInspection();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleTakePicture = async () => {
    if (!cameraRef.current || !inspectionData || !components[currentComponentIndex]) {
      return;
    }

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1.0, // Full resolution
        base64: false,
      });

      if (!photo?.uri) {
        throw new Error('Failed to capture photo');
      }

      const currentComponent = components[currentComponentIndex];

      // Get prediction from new API
      const response = await predictImage(photo.uri);

      // Map response: prediction ("pass"/"fail") to uppercase, score to confidence
      const machineResult = response.prediction.toUpperCase() as 'PASS' | 'FAIL';
      const confidence = response.score;

      // Navigate to result screen with the prediction
      router.push({
        pathname: '/result',
        params: {
          machineResult: machineResult,
          confidence: confidence.toString(),
          imageUri: photo.uri,
          componentId: currentComponent.id,
        },
      });
    } catch (error) {
      console.error('Error capturing/uploading photo:', error);
      Alert.alert('Error', 'Failed to capture or upload photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        {/* Centering guide overlay - red border */}
        <View style={styles.overlay}>
          <View style={styles.guideBox} />
        </View>

        {/* Take Picture Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
            onPress={handleTakePicture}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.captureButtonText}>Take Picture</Text>
            )}
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideBox: {
    width: '70%',
    aspectRatio: 1,
    borderWidth: 3,
    borderColor: '#FF0000',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000000',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
