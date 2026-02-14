import { View, Text, Pressable } from "react-native";
import { Calendar, User, ChevronLeft } from "lucide-react-native";
import {
  Trip,
  getStatusLabel,
  getStatusColor,
  formatHebrewDate,
} from "@/services/tripData";

interface TripCardProps {
  trip: Trip;
  dayCount: number;
  onPress: () => void;
}

export function TripCard({ trip, dayCount, onPress }: TripCardProps) {
  const statusColor = getStatusColor(trip.status);
  const statusLabel = getStatusLabel(trip.status);

  const startDisplay = formatHebrewDate(trip.start_date);
  const endDisplay = formatHebrewDate(trip.end_date);

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-2xl p-5 mb-4 mx-4 border border-navy-50"
      style={{
        shadowColor: "#001F3F",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
      }}
    >
      {/* Top Row: Status + Days */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <ChevronLeft size={16} color="#B3C2D1" />
          <Text className="font-heebo text-xs text-navy-200">
            {dayCount} ימים
          </Text>
        </View>
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: statusColor + "20" }}
        >
          <Text
            className="font-heebo-medium text-xs"
            style={{ color: statusColor }}
          >
            {statusLabel}
          </Text>
        </View>
      </View>

      {/* Client Name */}
      <View className="flex-row items-center mb-2">
        <User size={16} color="#D4AF37" />
        <Text className="font-heebo-bold text-lg text-navy mr-2">
          {trip.client_name}
        </Text>
      </View>

      {/* Date Range */}
      <View className="flex-row items-center">
        <Calendar size={14} color="#8099B3" />
        <Text className="font-heebo text-sm text-navy-200 mr-2">
          {startDisplay}
        </Text>
        <Text className="font-heebo text-sm text-navy-200 mx-1">—</Text>
        <Text className="font-heebo text-sm text-navy-200">
          {endDisplay}
        </Text>
      </View>

      {/* Gold accent line */}
      <View className="h-0.5 bg-gold-100 rounded-full mt-4" />
    </Pressable>
  );
}
