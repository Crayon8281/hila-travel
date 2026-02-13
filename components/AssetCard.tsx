import { View, Text, Pressable } from "react-native";
import { MapPin, Tag, DollarSign } from "lucide-react-native";
import { Asset } from "@/services/mockData";

interface AssetCardProps {
  asset: Asset;
  onPress: () => void;
}

export function AssetCard({ asset, onPress }: AssetCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3 mx-4 border border-navy-50"
      style={{
        shadowColor: "#001F3F",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Header Row */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="bg-gold-50 px-3 py-1 rounded-full">
          <Text className="font-heebo-medium text-xs text-gold-700">
            {asset.type}
          </Text>
        </View>
        <View className="flex-row items-center">
          <DollarSign size={14} color="#D4AF37" />
          <Text className="font-heebo-bold text-sm text-gold ml-1">
            {asset.selling_price.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text className="font-heebo-bold text-lg text-navy mb-1">
        {asset.title}
      </Text>

      {/* Location */}
      <View className="flex-row items-center mb-2">
        <MapPin size={14} color="#8099B3" />
        <Text className="font-heebo text-sm text-navy-200 ml-1">
          {asset.city}, {asset.country}
        </Text>
      </View>

      {/* Description preview */}
      <Text
        className="font-heebo text-sm text-navy-300 mb-3"
        numberOfLines={2}
      >
        {asset.description_he}
      </Text>

      {/* Tags */}
      <View className="flex-row flex-wrap">
        {asset.tags.slice(0, 3).map((tag) => (
          <View key={tag} className="flex-row items-center mr-2 mb-1">
            <Tag size={10} color="#B3C2D1" />
            <Text className="font-heebo text-xs text-navy-200 ml-1">
              {tag}
            </Text>
          </View>
        ))}
        {asset.tags.length > 3 && (
          <Text className="font-heebo text-xs text-navy-200">
            +{asset.tags.length - 3}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
