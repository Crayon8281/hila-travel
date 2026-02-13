import { StatusBar } from "expo-status-bar";
import { Platform, View, Text } from "react-native";

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="font-heebo-bold text-xl text-navy">Modal</Text>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
