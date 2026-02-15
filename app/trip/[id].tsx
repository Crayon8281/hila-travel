import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  Share,
  Modal,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import {
  Calendar,
  Trash2,
  ChevronLeft,
  Clock,
  Eye,
  Share2,
  Link2,
  Copy,
  Check,
  Crown,
} from "lucide-react-native";
import { useTripContext } from "@/services/TripContext";
import { useAssetContext } from "@/services/AssetContext";
import {
  formatHebrewDate,
  getStatusLabel,
  getStatusColor,
  getTripShareUrl,
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
    generateShareToken,
    getShareUrl,
  } = useTripContext();
  const { getAsset } = useAssetContext();

  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

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

  function handleShareLink() {
    const token = generateShareToken(id);
    const url = getTripShareUrl(token);
    setShowShareModal(true);
  }

  async function handleShareNative() {
    const token = trip!.share_token ?? generateShareToken(id);
    const url = getTripShareUrl(token);
    try {
      await Share.share({
        message: `${trip!.client_name} - צפו בתוכנית הטיול שלכם:\n${url}`,
        title: `טיול ${trip!.client_name} | Hila Travel`,
      });
    } catch (e) {
      // User cancelled
    }
  }

  function handleCopyLink() {
    const token = trip!.share_token ?? generateShareToken(id);
    const url = getTripShareUrl(token);
    // In production, use Clipboard.setStringAsync(url)
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert("הועתק!", `הקישור הועתק:\n${url}`);
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

          {/* Action Buttons Row */}
          <View className="flex-row mt-4" style={{ gap: 10 }}>
            {/* Client Timeline Button */}
            <Pressable
              onPress={() => router.push(`/trip/client/${id}`)}
              className="flex-1 bg-gold rounded-xl py-3 flex-row items-center justify-center"
              style={{
                shadowColor: "#D4AF37",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Eye size={16} color="#001F3F" />
              <Text className="font-heebo-bold text-sm text-navy mr-2">
                תצוגת לקוח
              </Text>
            </Pressable>

            {/* Share Link Button */}
            <Pressable
              onPress={handleShareLink}
              className="flex-1 bg-white/10 rounded-xl py-3 flex-row items-center justify-center border border-gold/30"
            >
              <Share2 size={16} color="#D4AF37" />
              <Text className="font-heebo-bold text-sm text-gold mr-2">
                שלח ללקוח
              </Text>
            </Pressable>
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

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowShareModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setShowShareModal(false)}
        >
          <Pressable
            className="bg-white rounded-t-3xl p-6"
            onPress={() => {}}
          >
            {/* Header */}
            <View className="items-center mb-5">
              <View
                className="w-14 h-14 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: "#001F3F" }}
              >
                <Link2 size={24} color="#D4AF37" />
              </View>
              <Text className="font-heebo-bold text-xl text-navy">
                קישור ללקוח
              </Text>
              <Text className="font-heebo text-sm text-navy-200 mt-1 text-center">
                שלח קישור פרטי ל{trip.client_name} לצפייה בטיול
              </Text>
            </View>

            {/* Token URL Display */}
            <View className="bg-navy-50 rounded-xl p-4 mb-5">
              <Text className="font-heebo text-xs text-navy-200 text-right mb-1">
                קישור הטיול
              </Text>
              <Text
                className="font-heebo-medium text-sm text-navy text-right"
                selectable
              >
                {trip.share_token
                  ? getTripShareUrl(trip.share_token)
                  : "יוצר קישור..."}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={{ gap: 10 }}>
              {/* Copy Link */}
              <Pressable
                onPress={handleCopyLink}
                className="bg-navy rounded-xl py-3.5 flex-row items-center justify-center"
                style={{
                  shadowColor: "#001F3F",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                {copied ? (
                  <Check size={16} color="#D4AF37" />
                ) : (
                  <Copy size={16} color="#D4AF37" />
                )}
                <Text className="font-heebo-bold text-sm text-gold mr-2">
                  {copied ? "הועתק!" : "העתק קישור"}
                </Text>
              </Pressable>

              {/* Share via System */}
              <Pressable
                onPress={handleShareNative}
                className="bg-gold rounded-xl py-3.5 flex-row items-center justify-center"
                style={{
                  shadowColor: "#D4AF37",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Share2 size={16} color="#001F3F" />
                <Text className="font-heebo-bold text-sm text-navy mr-2">
                  שתף ב-WhatsApp / SMS
                </Text>
              </Pressable>
            </View>

            {/* Branding */}
            <View className="items-center mt-5">
              <View className="flex-row items-center">
                <Crown size={11} color="#D4AF37" />
                <Text className="font-heebo text-xs text-navy-200 mr-1">
                  Hila Travel — קישור מאובטח
                </Text>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
