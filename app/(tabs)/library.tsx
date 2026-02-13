import { View, Text } from "react-native";

export default function LibraryScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="font-heebo-bold text-2xl text-navy">ספריה גלובלית</Text>
      <Text className="font-heebo text-base text-navy/60 mt-2">
        כאן תנהל את הנכסים שלך
      </Text>
    </View>
  );
}
