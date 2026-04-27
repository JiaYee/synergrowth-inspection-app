import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const options: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  quality: 0.9,
};

/**
 * Lets the user take a new photo or choose from the gallery. Returns a temporary
 * content URI suitable for copying into app storage.
 */
export function pickImageFromCameraOrLibrary(): Promise<string | null> {
  return new Promise((resolve) => {
    Alert.alert('Add image', 'Choose how to add the photo', [
      { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
      {
        text: 'Take photo',
        onPress: () => {
          void (async () => {
            const cam = await ImagePicker.requestCameraPermissionsAsync();
            if (!cam.granted) {
              Alert.alert(
                'Permission needed',
                'Camera access is required to take a photo.'
              );
              resolve(null);
              return;
            }
            const result = await ImagePicker.launchCameraAsync(options);
            if (result.canceled || !result.assets[0]?.uri) {
              resolve(null);
              return;
            }
            resolve(result.assets[0].uri);
          })();
        },
      },
      {
        text: 'Photo library',
        onPress: () => {
          void (async () => {
            const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!lib.granted) {
              Alert.alert(
                'Permission needed',
                'Photo library access is required to choose an existing photo.'
              );
              resolve(null);
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync(options);
            if (result.canceled || !result.assets[0]?.uri) {
              resolve(null);
              return;
            }
            resolve(result.assets[0].uri);
          })();
        },
      },
    ]);
  });
}
