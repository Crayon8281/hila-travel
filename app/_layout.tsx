import "@/global.css";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
  Heebo_400Regular,
  Heebo_500Medium,
  Heebo_700Bold,
} from "@expo-google-fonts/heebo";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { I18nManager } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import { AssetProvider } from "@/services/AssetContext";
import { TripProvider } from "@/services/TripContext";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Force RTL for Hebrew
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Heebo: Heebo_400Regular,
    "Heebo-Medium": Heebo_500Medium,
    "Heebo-Bold": Heebo_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AssetProvider>
      <TripProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            <Stack.Screen
              name="asset/[id]"
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="asset/new"
              options={{ headerShown: true, presentation: "modal" }}
            />
            <Stack.Screen
              name="asset/edit/[id]"
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="asset/bulk-import"
              options={{ headerShown: true, presentation: "modal" }}
            />
            <Stack.Screen
              name="trip/new"
              options={{ headerShown: true, presentation: "modal" }}
            />
            <Stack.Screen
              name="trip/[id]"
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="trip/day/[dayId]"
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="trip/add-activity"
              options={{ headerShown: true, presentation: "modal" }}
            />
            <Stack.Screen
              name="trip/client/[id]"
              options={{ headerShown: false }}
            />
          </Stack>
        </ThemeProvider>
      </TripProvider>
    </AssetProvider>
  );
}
