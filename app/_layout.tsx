import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { InspectionProvider } from '@/services/inspection-context';

export default function RootLayout() {
  return (
    <InspectionProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="selection" options={{ title: 'Select Details' }} />
          <Stack.Screen name="product" options={{ title: 'Product View' }} />
          <Stack.Screen name="camera" options={{ title: 'Camera', headerShown: false }} />
          <Stack.Screen name="result" options={{ title: 'Inspection Result' }} />
          <Stack.Screen name="summary" options={{ title: 'Inspection Summary' }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </InspectionProvider>
  );
}
