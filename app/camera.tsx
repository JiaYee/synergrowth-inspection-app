import { compressImage, predictImage } from "@/services/api";
import { useInspection } from "@/services/inspection-context";
import { Asset } from "expo-asset";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { manipulateAsync } from "expo-image-manipulator";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const GUIDE_BOX_WIDTH_RATIO = 0.7; // 70% of preview width

async function cropToGuideBox(
  uri: string,
  photoWidth: number,
  photoHeight: number,
  previewWidth: number,
  previewHeight: number,
): Promise<string> {
  if (
    previewWidth <= 0 ||
    previewHeight <= 0 ||
    photoWidth <= 0 ||
    photoHeight <= 0
  ) {
    return uri;
  }

  const boxSize = previewWidth * GUIDE_BOX_WIDTH_RATIO;
  const originX = (previewWidth - boxSize) / 2;
  const originY = (previewHeight - boxSize) / 2;

  // Camera preview uses "cover" mode: photo fills view, excess cropped. This is the display scale.
  const displayScale = Math.max(
    previewWidth / photoWidth,
    previewHeight / photoHeight,
  );
  const visibleWidth = previewWidth / displayScale;
  const visibleHeight = previewHeight / displayScale;
  const offsetX = (photoWidth - visibleWidth) / 2;
  const offsetY = (photoHeight - visibleHeight) / 2;

  const cropOriginX = Math.max(0, Math.round(offsetX + originX / displayScale));
  const cropOriginY = Math.max(0, Math.round(offsetY + originY / displayScale));
  const cropWidth = Math.min(
    photoWidth - cropOriginX,
    Math.round(boxSize / displayScale),
  );
  const cropHeight = Math.min(
    photoHeight - cropOriginY,
    Math.round(boxSize / displayScale),
  );

  if (cropWidth <= 0 || cropHeight <= 0) {
    return uri;
  }

  const result = await manipulateAsync(uri, [
    {
      crop: {
        originX: cropOriginX,
        originY: cropOriginY,
        width: cropWidth,
        height: cropHeight,
      },
    },
  ]);

  return result.uri;
}

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    result: "PASS" | "FAIL";
    confidence: number;
    justification: string;
  } | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const previewLayoutRef = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const {
    inspectionData,
    addInspectionResult,
    advanceToNextPoint,
  } = useInspection();

  useFocusEffect(
    useCallback(() => {
      setCapturedPhotoUri(null);
      setAnalysisResult(null);
      setIsCapturing(false);
    }, [])
  );

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleTakePicture = async () => {
    if (!cameraRef.current || !inspectionData) {
      return;
    }

    setIsCapturing(true);
    setAnalysisResult(null);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1.0, // Full resolution
        base64: false,
      });

      if (!photo?.uri) {
        throw new Error("Failed to capture photo");
      }

      const { width: photoWidth, height: photoHeight } = photo;
      const { width: previewWidth, height: previewHeight } =
        previewLayoutRef.current;

      const croppedUri =
        photoWidth > 0 &&
        photoHeight > 0 &&
        previewWidth > 0 &&
        previewHeight > 0
          ? await cropToGuideBox(
              photo.uri,
              photoWidth,
              photoHeight,
              previewWidth,
              previewHeight,
            )
          : photo.uri;

      // Show preview immediately
      setCapturedPhotoUri(croppedUri);

      // Immediately send to API for analysis
      const productAsset = Asset.fromModule(inspectionData.product_image);
      await productAsset.downloadAsync();
      const productImageUri = productAsset.localUri ?? productAsset.uri;
      const compressedProduct = await compressImage(productImageUri);
      const compressedCaptured = await compressImage(croppedUri);

      const response = await predictImage(compressedProduct, compressedCaptured, {
        product_model: inspectionData.product_model,
        production_line: inspectionData.production_line,
        station_number: inspectionData.station_number,
        production_shift: inspectionData.production_shift,
        operator: inspectionData.operator,
        device_id: inspectionData.device_id,
      });

      const machineResult = response.prediction.toUpperCase() as "PASS" | "FAIL";

      setAnalysisResult({
        result: machineResult,
        confidence: response.confidence,
        justification: response.justification,
      });
    } catch (error) {
      console.error("Error capturing/analyzing photo:", error);
      Alert.alert("Error", "Failed to capture or analyze photo. Please retry.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRetake = () => {
    setCapturedPhotoUri(null);
    setAnalysisResult(null);
    setIsCapturing(false);
  };

  const handleNext = () => {
    if (!capturedPhotoUri || !analysisResult) return;

    addInspectionResult({
      imageUri: capturedPhotoUri,
      result: analysisResult.result,
      confidence: analysisResult.confidence,
      justification: analysisResult.justification,
    });

    const hasMorePoints = advanceToNextPoint();

    setCapturedPhotoUri(null);
    setAnalysisResult(null);
    if (hasMorePoints) {
      router.replace("/product");
    } else {
      router.replace("/summary");
    }
  };

  // Photo preview screen - show result at bottom, above Retake/Next
  if (capturedPhotoUri) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: capturedPhotoUri }}
          style={styles.previewImage}
          resizeMode="contain"
        />
        {isCapturing && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>Analyzing...</Text>
          </View>
        )}
        {!isCapturing && (
          <View style={styles.bottomSection}>
            {analysisResult && (
              <View style={styles.resultPanel}>
                <Text style={styles.resultLabel}>Result:</Text>
                <Text
                  style={[
                    styles.resultValue,
                    analysisResult.result === "PASS"
                      ? styles.passText
                      : styles.failText,
                  ]}
                >
                  {analysisResult.result}
                </Text>
                <Text style={styles.confidenceText}>
                  Confidence:{" "}
                  {(Math.floor(analysisResult.confidence * 100) / 100).toFixed(2)}%
                </Text>
                {analysisResult.justification ? (
                  <Text style={styles.justificationText} numberOfLines={2}>
                    {analysisResult.justification}
                  </Text>
                ) : null}
              </View>
            )}
            {!analysisResult && (
              <Text style={styles.analysisErrorText}>
                Analysis failed. Tap Retake to try again.
              </Text>
            )}
            <View style={styles.previewButtonRow}>
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={handleRetake}
              >
                <Text style={styles.retakeButtonText}>Retake</Text>
              </TouchableOpacity>
              {analysisResult && (
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNext}
                >
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    );
  }

  // Live camera view
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        {/* Centering guide overlay - red border */}
        <View
          style={styles.overlay}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            previewLayoutRef.current = { width, height };
          }}
        >
          <View style={styles.guideBox} />
        </View>

        {/* Take Picture Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.captureButton,
              isCapturing && styles.captureButtonDisabled,
            ]}
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
    backgroundColor: "#000000",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  guideBox: {
    width: "70%",
    aspectRatio: 1,
    borderWidth: 3,
    borderColor: "#FF0000",
    backgroundColor: "transparent",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "#000000",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  previewImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  resultPanel: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  resultLabel: {
    color: "#FFF",
    fontSize: 14,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  passText: {
    color: "#90EE90",
  },
  failText: {
    color: "#FF6B6B",
  },
  confidenceText: {
    color: "#FFF",
    fontSize: 14,
    marginBottom: 4,
  },
  justificationText: {
    color: "#CCC",
    fontSize: 12,
    fontStyle: "italic",
  },
  analysisErrorText: {
    color: "#FF6B6B",
    fontSize: 14,
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  previewButtonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  retakeButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#FFF",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 140,
    alignItems: "center",
  },
  retakeButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: "#000000",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 140,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  message: {
    textAlign: "center",
    marginBottom: 20,
    color: "#000000",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#000000",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
