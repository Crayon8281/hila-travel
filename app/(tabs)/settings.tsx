import { View, Text } from "react-native";

export default function SettingsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="font-heebo-bold text-2xl text-navy">הגדרות</Text>
      <Text className="font-heebo text-base text-navy/60 mt-2">
        הגדרות המערכת
      </Text>
    </View>
  );
}
