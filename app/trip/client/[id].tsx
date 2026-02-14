import { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Linking,
  Platform,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import {
  MapPin,
  Phone,
  Navigation,
  Clock,
  Star,
  Hotel,
  UtensilsCrossed,
  Compass,
  Plane,
  Car,
  Sparkles,
  Calendar,
  MessageCircle,
} from "lucide-react-native";
import { useTripContext } from "@/services/TripContext";
import { useAssetContext } from "@/services/AssetContext";
import { formatHebrewDate } from "@/services/tripData";
import { Asset } from "@/services/mockData";

// Map Hebrew asset types to icons
function getTypeIcon(type: string, size: number, color: string) {
  switch (type) {
    case "מלון":
      return <Hotel size={size} color={color} />;
    case "מסעדה":
      return <UtensilsCrossed size={size} color={color} />;
    case "אטרקציה":
      return <Compass size={size} color={color} />;
    case "טיסה":
      return <Plane size={size} color={color} />;
    case "העברה":
      return <Car size={size} color={color} />;
    case "חוויה":
      return <Sparkles size={size} color={color} />;
    default:
      return <Star size={size} color={color} />;
  }
}

function openMaps(address: string) {
  const encoded = encodeURIComponent(address);
  const url =
    Platform.OS === "ios"
      ? `maps:0,0?q=${encoded}`
      : `geo:0,0?q=${encoded}`;
  Linking.openURL(url).catch(() => {
    // Fallback to Google Maps web
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encoded}`);
  });
}

function openPhone(phone: string) {
  Linking.openURL(`tel:${phone.replace(/[^+\d]/g, "")}`);
}

interface TimelineActivityProps {
  asset: Asset;
  startTime: string;
  customNote: string;
  isLast: boolean;
}

function TimelineActivity({
  asset,
  startTime,
  customNote,
  isLast,
}: TimelineActivityProps) {
  const hasImage = asset.images.length > 0;

  return (
    <View className="flex-row mb-0">
      {/* Timeline Spine (Right side for RTL) */}
      <View className="items-center w-12">
        {/* Icon Circle */}
        <View
          className="w-10 h-10 rounded-full items-center justify-center z-10"
          style={{ backgroundColor: "#D4AF37" }}
        >
          {getTypeIcon(asset.type, 18, "#001F3F")}
        </View>
        {/* Connecting Line */}
        {!isLast && (
          <View className="w-0.5 flex-1 bg-gold-200" style={{ minHeight: 20 }} />
        )}
      </View>

      {/* Activity Card */}
      <View
        className="flex-1 mr-4 mb-5"
        style={{ marginTop: -2 }}
      >
        <View
          className="bg-white rounded-2xl overflow-hidden border border-navy-50"
          style={{
            shadowColor: "#001F3F",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 16,
            elevation: 5,
          }}
        >
          {/* Hero Image */}
          {hasImage && (
            <View className="relative">
              <Image
                source={{ uri: asset.images[0] }}
                className="w-full h-48"
                resizeMode="cover"
              />
              {/* Gradient overlay at bottom of image */}
              <View
                className="absolute bottom-0 left-0 right-0 h-16"
                style={{
                  backgroundColor: "transparent",
                }}
              />
              {/* Type badge on image */}
              <View className="absolute top-3 right-3 bg-navy/80 rounded-full px-3 py-1 flex-row items-center">
                {getTypeIcon(asset.type, 12, "#D4AF37")}
                <Text className="font-heebo-medium text-xs text-gold mr-1.5">
                  {asset.type}
                </Text>
              </View>
              {/* Time badge on image */}
              {startTime ? (
                <View className="absolute top-3 left-3 bg-white/90 rounded-full px-3 py-1 flex-row items-center">
                  <Clock size={12} color="#001F3F" />
                  <Text className="font-heebo-bold text-xs text-navy mr-1.5">
                    {startTime}
                  </Text>
                </View>
              ) : null}
            </View>
          )}

          {/* Content */}
          <View className="p-4">
            {/* Title + Time (if no image) */}
            {!hasImage && startTime ? (
              <View className="flex-row items-center justify-end mb-1">
                <Clock size={12} color="#D4AF37" />
                <Text className="font-heebo-medium text-sm text-gold mr-1">
                  {startTime}
                </Text>
              </View>
            ) : null}

            {/* Type badge if no image */}
            {!hasImage && (
              <View className="flex-row justify-end mb-2">
                <View className="bg-gold-50 rounded-full px-3 py-1 flex-row items-center">
                  {getTypeIcon(asset.type, 12, "#B8860B")}
                  <Text className="font-heebo-medium text-xs text-gold-700 mr-1.5">
                    {asset.type}
                  </Text>
                </View>
              </View>
            )}

            <Text className="font-heebo-bold text-lg text-navy text-right mb-1">
              {asset.title}
            </Text>

            {/* Location */}
            <View className="flex-row items-center justify-end mb-3">
              <MapPin size={13} color="#8099B3" />
              <Text className="font-heebo text-sm text-navy-200 mr-1">
                {asset.city}, {asset.country}
              </Text>
            </View>

            {/* Description */}
            <Text className="font-heebo text-sm text-navy-300 text-right leading-5 mb-4">
              {asset.description_he}
            </Text>

            {/* Custom Note */}
            {customNote ? (
              <View className="bg-navy-50 rounded-xl p-3 mb-4">
                <View className="flex-row items-center justify-end mb-1">
                  <MessageCircle size={13} color="#001F3F" />
                  <Text className="font-heebo-medium text-xs text-navy mr-1">
                    הערה
                  </Text>
                </View>
                <Text className="font-heebo text-sm text-navy-300 text-right">
                  {customNote}
                </Text>
              </View>
            ) : null}

            {/* Expert Notes - Hila's Tips */}
            {asset.expert_notes ? (
              <View className="bg-gold-50 rounded-xl p-3 mb-4 border border-gold-100">
                <View className="flex-row items-center justify-end mb-1.5">
                  <Star size={13} color="#D4AF37" fill="#D4AF37" />
                  <Text className="font-heebo-bold text-xs text-gold-700 mr-1">
                    הטיפ של הילה
                  </Text>
                </View>
                <Text className="font-heebo text-sm text-navy-300 text-right leading-5">
                  {asset.expert_notes}
                </Text>
              </View>
            ) : null}

            {/* Action Buttons */}
            <View className="flex-row justify-end" style={{ gap: 10 }}>
              {/* Navigate Button */}
              {asset.address ? (
                <Pressable
                  onPress={() => openMaps(asset.address!)}
                  className="bg-navy rounded-xl px-4 py-2.5 flex-row items-center"
                  style={{
                    shadowColor: "#001F3F",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 3,
                  }}
                >
                  <Navigation size={15} color="#D4AF37" />
                  <Text className="font-heebo-bold text-sm text-gold mr-2">
                    נווט
                  </Text>
                </Pressable>
              ) : null}

              {/* Call Button */}
              {asset.phone ? (
                <Pressable
                  onPress={() => openPhone(asset.phone!)}
                  className="bg-white rounded-xl px-4 py-2.5 flex-row items-center border border-navy-50"
                  style={{
                    shadowColor: "#001F3F",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.08,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Phone size={15} color="#001F3F" />
                  <Text className="font-heebo-bold text-sm text-navy mr-2">
                    התקשר
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// Day separator component
function DaySeparator({
  dayNumber,
  date,
}: {
  dayNumber: number;
  date: string;
}) {
  return (
    <View className="flex-row items-center mb-5 mt-2">
      <View className="flex-1 h-px bg-gold-200 ml-4" />
      <View className="bg-navy rounded-2xl px-5 py-2.5 flex-row items-center">
        <Calendar size={14} color="#D4AF37" />
        <View className="mr-2.5">
          <Text className="font-heebo-bold text-sm text-gold text-right">
            יום {dayNumber}
          </Text>
          <Text className="font-heebo text-xs text-white/60 text-right">
            {formatHebrewDate(date)}
          </Text>
        </View>
      </View>
      <View className="flex-1 h-px bg-gold-200 mr-4" />
    </View>
  );
}

export default function ClientTimelineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTrip, getDaysForTrip, getActivitiesForDay } = useTripContext();
  const { getAsset } = useAssetContext();

  const trip = getTrip(id);

  // Build the full timeline data
  const timelineData = useMemo(() => {
    if (!trip) return [];
    const days = getDaysForTrip(id);

    return days
      .map((day) => {
        const activities = getActivitiesForDay(day._id);
        const activitiesWithAssets = activities
          .map((act) => ({
            ...act,
            asset: getAsset(act.assetId),
          }))
          .filter((a) => a.asset !== null);

        return {
          day,
          activities: activitiesWithAssets,
        };
      })
      .filter((d) => d.activities.length > 0);
  }, [trip, id, getDaysForTrip, getActivitiesForDay, getAsset]);

  if (!trip) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="font-heebo-bold text-lg text-navy">
          הטיול לא נמצא
        </Text>
      </View>
    );
  }

  const totalActivities = timelineData.reduce(
    (sum, d) => sum + d.activities.length,
    0
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Premium Header */}
        <View className="bg-navy pt-14 pb-8 px-6">
          {/* Top bar with subtle branding */}
          <View className="flex-row items-center justify-center mb-6">
            <View className="w-8 h-0.5 bg-gold-200 rounded-full" />
            <Text className="font-heebo-medium text-xs text-gold/60 mx-3">
              LUXURY TRAVEL
            </Text>
            <View className="w-8 h-0.5 bg-gold-200 rounded-full" />
          </View>

          {/* Client Name */}
          <Text className="font-heebo-bold text-3xl text-white text-center mb-2">
            {trip.client_name}
          </Text>

          {/* Trip Dates */}
          <View className="flex-row items-center justify-center mb-4">
            <Calendar size={14} color="#D4AF37" />
            <Text className="font-heebo text-sm text-white/60 mr-2">
              {formatHebrewDate(trip.start_date)} — {formatHebrewDate(trip.end_date)}
            </Text>
          </View>

          {/* Stats Row */}
          <View className="flex-row items-center justify-center" style={{ gap: 24 }}>
            <View className="items-center">
              <Text className="font-heebo-bold text-xl text-gold">
                {timelineData.length}
              </Text>
              <Text className="font-heebo text-xs text-white/40">ימים</Text>
            </View>
            <View className="w-px h-6 bg-white/10" />
            <View className="items-center">
              <Text className="font-heebo-bold text-xl text-gold">
                {totalActivities}
              </Text>
              <Text className="font-heebo text-xs text-white/40">פעילויות</Text>
            </View>
          </View>

          {/* Gold accent line */}
          <View className="h-0.5 bg-gold/20 rounded-full mt-6" />
        </View>

        {/* Timeline Content */}
        <View className="px-2 pt-6">
          {timelineData.length === 0 ? (
            <View className="items-center py-16 px-8">
              <Compass size={48} color="#E6EBF0" strokeWidth={1} />
              <Text className="font-heebo-bold text-lg text-navy mt-4 mb-2">
                התוכנית בהכנה
              </Text>
              <Text className="font-heebo text-sm text-navy-200 text-center">
                הטיול שלכם בתהליך תכנון. בקרוב תוכלו לראות כאן את כל
                הפעילויות המתוכננות.
              </Text>
            </View>
          ) : (
            timelineData.map(({ day, activities }) => (
              <View key={day._id}>
                {/* Day Header */}
                <DaySeparator dayNumber={day.day_number} date={day.date} />

                {/* Activities for this day */}
                {activities.map((act, actIdx) => (
                  <TimelineActivity
                    key={act._id}
                    asset={act.asset!}
                    startTime={act.start_time}
                    customNote={act.custom_note}
                    isLast={
                      actIdx === activities.length - 1 &&
                      day._id === timelineData[timelineData.length - 1].day._id
                    }
                  />
                ))}
              </View>
            ))
          )}
        </View>

        {/* Footer */}
        {timelineData.length > 0 && (
          <View className="items-center mt-4 mb-8 px-8">
            <View className="w-12 h-0.5 bg-gold-200 rounded-full mb-3" />
            <Text className="font-heebo text-xs text-navy-200 text-center">
              תוכנית הטיול הוכנה במיוחד עבורכם
            </Text>
            <Text className="font-heebo-medium text-xs text-gold mt-1">
              Hila Travel
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}
