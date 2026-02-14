import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import {
  Calendar,
  Trash2,
  ChevronLeft,
  Clock,
} from "lucide-react-native";
import { useTripContext } from "@/services/TripContext";
import { useAssetContext } from "@/services/AssetContext";
import {
  formatHebrewDate,
  getStatusLabel,
  getStatusColor,
  TRIP_STATUSES,
} from "@/services/tripData";

export default function TripDashboardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    getTrip,
    getDaysForTrip,
    getActivitiesForDay,
    updateTrip,
    removeTrip,
  } = useTripContext();
  const { getAsset } = useAssetContext();

  const trip = getTrip(id);
  if (!trip) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="font-heebo-bold text-lg text-navy">
          הטיול לא נמצא
        </Text>
      </View>
    );
  }

  const days = getDaysForTrip(id);
  const statusColor = getStatusColor(trip.status);

  function handleStatusCycle() {
    const currentIdx = TRIP_STATUSES.findIndex(
      (s) => s.value === trip!.status
    );
    const nextIdx = (currentIdx + 1) % TRIP_STATUSES.length;
    updateTrip(id, { status: TRIP_STATUSES[nextIdx].value });
  }

  function handleDelete() {
    Alert.alert("מחיקת טיול", `למחוק את הטיול של ${trip!.client_name}?`, [
      { text: "ביטול", style: "cancel" },
      {
        text: "מחק",
        style: "destructive",
        onPress: () => {
          removeTrip(id);
          router.back();
        },
      },
    ]);
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: trip.client_name,
          headerTitleStyle: { fontFamily: "Heebo-Bold" },
          headerRight: () => (
            <Pressable onPress={handleDelete} className="p-2">
              <Trash2 size={20} color="#EF4444" />
            </Pressable>
          ),
        }}
      />
      <View className="flex-1 bg-white">
        {/* Trip Header Card */}
        <View className="bg-navy mx-4 mt-4 rounded-2xl p-5">
          <View className="flex-row items-center justify-between mb-3">
            <Pressable
              onPress={handleStatusCycle}
              className="px-4 py-1.5 rounded-full"
              style={{ backgroundColor: statusColor + "30" }}
            >
              <Text
                className="font-heebo-medium text-sm"
                style={{ color: statusColor }}
              >
                {getStatusLabel(trip.status)}
              </Text>
            </Pressable>
            <Text className="font-heebo-bold text-xl text-gold">
              {trip.client_name}
            </Text>
          </View>
          <View className="flex-row items-center justify-end">
            <Calendar size={14} color="#8099B3" />
            <Text className="font-heebo text-sm text-white/70 mr-2">
              {days.length} ימים • {formatHebrewDate(trip.start_date)} -{" "}
              {formatHebrewDate(trip.end_date)}
            </Text>
          </View>
        </View>

        {/* Section Title */}
        <View className="px-4 mt-5 mb-3">
          <Text className="font-heebo-bold text-lg text-navy">
            ימי הטיול
          </Text>
        </View>

        {/* Days List */}
        <FlatList
          data={days}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item: day }) => {
            const activities = getActivitiesForDay(day._id);

            return (
              <Pressable
                onPress={() =>
                  router.push(`/trip/day/${day._id}?tripId=${id}`)
                }
                className="bg-white rounded-2xl p-4 mb-3 mx-4 border border-navy-50"
                style={{
                  shadowColor: "#001F3F",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.06,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center justify-between">
                  <ChevronLeft size={16} color="#B3C2D1" />
                  <View className="flex-1 mr-3">
                    {/* Day Header */}
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="font-heebo text-xs text-navy-200">
                        {activities.length > 0
                          ? `${activities.length} פעילויות`
                          : "ללא פעילויות"}
                      </Text>
                      <View className="flex-row items-center">
                        <View className="bg-gold w-7 h-7 rounded-full items-center justify-center">
                          <Text className="font-heebo-bold text-xs text-navy">
                            {day.day_number}
                          </Text>
                        </View>
                        <Text className="font-heebo-bold text-base text-navy mr-2">
                          יום {day.day_number}
                        </Text>
                      </View>
                    </View>

                    {/* Date */}
                    <Text className="font-heebo text-sm text-navy-200 text-right">
                      {formatHebrewDate(day.date)}
                    </Text>

                    {/* Activity Preview */}
                    {activities.length > 0 && (
                      <View className="mt-2 border-t border-navy-50 pt-2">
                        {activities.slice(0, 3).map((act) => {
                          const asset = getAsset(act.assetId);
                          return (
                            <View
                              key={act._id}
                              className="flex-row items-center mb-1"
                            >
                              <View className="flex-row items-center flex-1">
                                <Text className="font-heebo text-xs text-navy-200 mr-2">
                                  {asset?.type}
                                </Text>
                                <Text
                                  className="font-heebo text-xs text-navy"
                                  numberOfLines={1}
                                >
                                  {asset?.title ?? "פריט לא נמצא"}
                                </Text>
                              </View>
                              {act.start_time && (
                                <View className="flex-row items-center">
                                  <Clock size={10} color="#8099B3" />
                                  <Text className="font-heebo text-xs text-navy-200 mr-1">
                                    {act.start_time}
                                  </Text>
                                </View>
                              )}
                            </View>
                          );
                        })}
                        {activities.length > 3 && (
                          <Text className="font-heebo text-xs text-gold text-right">
                            +{activities.length - 3} נוספים
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </>
  );
}
