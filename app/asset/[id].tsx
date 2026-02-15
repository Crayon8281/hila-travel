import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import {
  MapPin,
  Tag,
  DollarSign,
  FileText,
  Pencil,
  Trash2,
  ArrowRight,
} from "lucide-react-native";
import { useAssetContext } from "@/services/AssetContext";

export default function AssetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getAsset, removeAsset } = useAssetContext();

  const asset = getAsset(id);

  if (!asset) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Stack.Screen options={{ title: "נכס לא נמצא" }} />
        <Text className="font-heebo-bold text-xl text-navy">
          הנכס לא נמצא
        </Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="font-heebo text-gold">חזור לספריה</Text>
        </Pressable>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert("מחיקת נכס", `האם למחוק את "${asset.title}"?`, [
      { text: "ביטול", style: "cancel" },
      {
        text: "מחק",
        style: "destructive",
        onPress: () => {
          removeAsset(asset._id);
          router.back();
        },
      },
    ]);
  };

  const profit = asset.selling_price - asset.cost_price;
  const margin =
    asset.selling_price > 0
      ? Math.round((profit / asset.selling_price) * 100)
      : 0;

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: asset.title,
          headerTitleStyle: { fontFamily: "Heebo-Bold" },
          headerBackTitle: "חזרה",
        }}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Type & Location Header */}
        <View className="bg-navy px-4 pt-4 pb-6 rounded-b-3xl">
          <View className="bg-gold/20 self-end px-3 py-1 rounded-full mb-3">
            <Text className="font-heebo-medium text-sm text-gold-100">
              {asset.type}
            </Text>
          </View>
          <Text className="font-heebo-bold text-2xl text-white mb-2 text-right">
            {asset.title}
          </Text>
          <View className="flex-row items-center">
            <MapPin size={16} color="#D4AF37" />
            <Text className="font-heebo text-base text-gold-200 mr-2">
              {asset.city}, {asset.country}
            </Text>
          </View>
        </View>

        {/* Pricing Card */}
        <View
          className="bg-white rounded-2xl p-4 mx-4 -mt-4 border border-navy-50"
          style={{
            shadowColor: "#001F3F",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View className="flex-row justify-between items-center">
            <View className="items-center">
              <Text className="font-heebo text-xs text-navy-200">רווח</Text>
              <Text className="font-heebo-bold text-lg text-green-600">
                ${profit.toLocaleString()}
              </Text>
              <Text className="font-heebo text-xs text-green-600">
                {margin}%
              </Text>
            </View>
            <View className="w-px h-10 bg-navy-50" />
            <View className="items-center">
              <Text className="font-heebo text-xs text-navy-200">
                מחיר מכירה
              </Text>
              <Text className="font-heebo-bold text-lg text-gold">
                ${asset.selling_price.toLocaleString()}
              </Text>
            </View>
            <View className="w-px h-10 bg-navy-50" />
            <View className="items-center">
              <Text className="font-heebo text-xs text-navy-200">
                מחיר עלות
              </Text>
              <Text className="font-heebo-bold text-lg text-navy">
                ${asset.cost_price.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="px-4 mt-6">
          <View className="flex-row items-center mb-2">
            <FileText size={16} color="#001F3F" />
            <Text className="font-heebo-bold text-base text-navy mr-2">
              תיאור
            </Text>
          </View>
          <Text className="font-heebo text-sm text-navy-300 leading-6 text-right">
            {asset.description_he}
          </Text>
        </View>

        {/* Expert Notes */}
        {asset.expert_notes ? (
          <View className="px-4 mt-6">
            <View className="flex-row items-center mb-2">
              <ArrowRight size={16} color="#D4AF37" />
              <Text className="font-heebo-bold text-base text-navy mr-2">
                הערות מומחה
              </Text>
            </View>
            <View className="bg-gold-50 rounded-xl p-4 border border-gold-100">
              <Text className="font-heebo text-sm text-navy-400 leading-6 text-right">
                {asset.expert_notes}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Tags */}
        <View className="px-4 mt-6">
          <View className="flex-row items-center mb-2">
            <Tag size={16} color="#001F3F" />
            <Text className="font-heebo-bold text-base text-navy mr-2">
              תגיות
            </Text>
          </View>
          <View className="flex-row flex-wrap">
            {asset.tags.map((tag) => (
              <View
                key={tag}
                className="bg-navy-50 px-3 py-1.5 rounded-full mr-2 mb-2"
              >
                <Text className="font-heebo text-sm text-navy">{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-navy-50 px-4 py-4 flex-row gap-3">
        <Pressable
          onPress={handleDelete}
          className="flex-row items-center justify-center bg-red-50 rounded-xl px-4 py-3"
        >
          <Trash2 size={18} color="#EF4444" />
        </Pressable>
        <Pressable
          onPress={() => router.push(`/asset/edit/${asset._id}`)}
          className="flex-1 flex-row items-center justify-center bg-gold rounded-xl py-3"
        >
          <Pencil size={18} color="#FFFFFF" />
          <Text className="font-heebo-bold text-base text-white mr-2">
            ערוך נכס
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
