import { useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert, ActivityIndicator, Text } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useInspection } from '@/services/inspection-context';
import { uploadImage } from '@/services/api';
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

      // Prepare metadata
      const currentComponent = components[currentComponentIndex];
      const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];

      // Upload image and get prediction
      const response = await uploadImage(photo.uri, {
        product_model: inspectionData.product_model,
        production_line: inspectionData.production_line,
        station_number: inspectionData.station_number,
        production_shift: inspectionData.production_shift,
        operator: inspectionData.operator,
        component: currentComponent.id,
        timestamp: timestamp,
        device_id: inspectionData.device_id,
      });

      // Navigate to result screen with the prediction
      router.push({
        pathname: '/result',
        params: {
          machineResult: response.machine_result,
          confidence: response.confidence.toString(),
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
