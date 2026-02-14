import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Clock,
  MapPin,
  DollarSign,
  StickyNote,
  GripVertical,
} from "lucide-react-native";
import { useTripContext } from "@/services/TripContext";
import { useAssetContext } from "@/services/AssetContext";
import { formatHebrewDate } from "@/services/tripData";

export default function TripDayScreen() {
  const { dayId, tripId } = useLocalSearchParams<{
    dayId: string;
    tripId: string;
  }>();
  const { getDay, getActivitiesForDay, removeActivity, moveActivity } =
    useTripContext();
  const { getAsset } = useAssetContext();

  const day = getDay(dayId);
  if (!day) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="font-heebo-bold text-lg text-navy">יום לא נמצא</Text>
      </View>
    );
  }

  const activities = getActivitiesForDay(dayId);

  function handleRemoveActivity(activityId: string, title: string) {
    Alert.alert("הסרת פעילות", `להסיר את "${title}" מהתוכנית?`, [
      { text: "ביטול", style: "cancel" },
      {
        text: "הסר",
        style: "destructive",
        onPress: () => removeActivity(activityId),
      },
    ]);
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `יום ${day.day_number}`,
          headerTitleStyle: { fontFamily: "Heebo-Bold" },
        }}
      />
      <View className="flex-1 bg-white">
        {/* Day Header */}
        <View className="bg-navy mx-4 mt-4 rounded-2xl p-4">
          <Text className="font-heebo-bold text-lg text-gold text-right">
            יום {day.day_number}
          </Text>
          <Text className="font-heebo text-sm text-white/60 text-right mt-1">
            {formatHebrewDate(day.date)}
          </Text>
          <View className="flex-row items-center justify-between mt-3">
            <Pressable
              onPress={() =>
                router.push(`/trip/add-activity?dayId=${dayId}`)
              }
              className="bg-gold rounded-xl px-4 py-2 flex-row items-center"
            >
              <Plus size={16} color="#001F3F" />
              <Text className="font-heebo-bold text-sm text-navy mr-1">
                הוסף פעילות
              </Text>
            </Pressable>
            <Text className="font-heebo text-sm text-white/60">
              {activities.length} פעילויות
            </Text>
          </View>
        </View>

        {/* Activities List */}
        {activities.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="font-heebo text-base text-navy-200 text-center mb-4">
              אין פעילויות ביום זה עדיין
            </Text>
            <Text className="font-heebo text-sm text-navy-200 text-center">
              לחצי על "הוסף פעילות" כדי לחפש בספריה ולהוסיף פריטים
            </Text>
          </View>
        ) : (
          <FlatList
            data={activities}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
            renderItem={({ item: activity, index }) => {
              const asset = getAsset(activity.assetId);
              if (!asset) return null;

              return (
                <View
                  className="bg-white rounded-2xl p-4 mb-3 mx-4 border border-navy-50"
                  style={{
                    shadowColor: "#001F3F",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.06,
                    shadowRadius: 6,
                    elevation: 2,
                  }}
                >
                  {/* Order Controls + Content */}
                  <View className="flex-row">
                    {/* Sort Controls */}
                    <View className="items-center justify-center mr-3 py-1">
                      <Pressable
                        onPress={() => moveActivity(dayId, activity._id, "up")}
                        className="p-1"
                        disabled={index === 0}
                      >
                        <ChevronUp
                          size={18}
                          color={index === 0 ? "#E6EBF0" : "#001F3F"}
                        />
                      </Pressable>
                      <View className="bg-navy-50 w-6 h-6 rounded-full items-center justify-center my-1">
                        <Text className="font-heebo-bold text-xs text-navy">
                          {index + 1}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() =>
                          moveActivity(dayId, activity._id, "down")
                        }
                        className="p-1"
                        disabled={index === activities.length - 1}
                      >
                        <ChevronDown
                          size={18}
                          color={
                            index === activities.length - 1
                              ? "#E6EBF0"
                              : "#001F3F"
                          }
                        />
                      </Pressable>
                    </View>

                    {/* Activity Content */}
                    <View className="flex-1">
                      {/* Type + Price Row */}
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center">
                          <DollarSign size={14} color="#D4AF37" />
                          <Text className="font-heebo-medium text-sm text-gold mr-1">
                            {asset.selling_price.toLocaleString()}
                          </Text>
                        </View>
                        <View className="bg-gold-50 px-2 py-0.5 rounded-full">
                          <Text className="font-heebo-medium text-xs text-gold-700">
                            {asset.type}
                          </Text>
                        </View>
                      </View>

                      {/* Title */}
                      <Text className="font-heebo-bold text-base text-navy text-right mb-1">
                        {asset.title}
                      </Text>

                      {/* Location */}
                      <View className="flex-row items-center justify-end mb-2">
                        <MapPin size={12} color="#8099B3" />
                        <Text className="font-heebo text-xs text-navy-200 mr-1">
                          {asset.city}, {asset.country}
                        </Text>
                      </View>

                      {/* Time */}
                      {activity.start_time && (
                        <View className="flex-row items-center justify-end mb-2">
                          <Clock size={12} color="#D4AF37" />
                          <Text className="font-heebo-medium text-sm text-navy mr-1">
                            {activity.start_time}
                          </Text>
                        </View>
                      )}

                      {/* Custom Note */}
                      {activity.custom_note && (
                        <View className="bg-gold-50 rounded-lg p-2 mb-2">
                          <View className="flex-row items-start justify-end">
                            <StickyNote size={12} color="#D4AF37" />
                            <Text className="font-heebo text-xs text-navy-300 mr-1 flex-1 text-right">
                              {activity.custom_note}
                            </Text>
                          </View>
                        </View>
                      )}

                      {/* Delete Button */}
                      <Pressable
                        onPress={() =>
                          handleRemoveActivity(activity._id, asset.title)
                        }
                        className="self-start mt-1"
                      >
                        <View className="flex-row items-center">
                          <Trash2 size={14} color="#EF4444" />
                          <Text className="font-heebo text-xs text-red-500 mr-1">
                            הסר
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </>
  );
}
