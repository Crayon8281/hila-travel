import { Link, Stack } from "expo-router";
import { View, Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "דף לא נמצא" }} />
      <View className="flex-1 items-center justify-center p-5 bg-white">
        <Text className="font-heebo-bold text-xl text-navy">
          הדף הזה לא קיים
        </Text>
        <Link href="/" className="mt-4 py-4">
          <Text className="font-heebo text-sm text-gold">חזרה למסך הראשי</Text>
        </Link>
      </View>
    </>
  );
}
