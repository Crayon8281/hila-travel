import { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
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
  AlertTriangle,
  Wand2,
  BookmarkPlus,
  FolderOpen,
  Sparkles,
  RotateCcw,
  X,
} from "lucide-react-native";
import { useTripContext } from "@/services/TripContext";
import { useAssetContext } from "@/services/AssetContext";
import { formatHebrewDate } from "@/services/tripData";
import { checkDayDistances, formatDistance } from "@/services/logistics";
import { polishDescription } from "@/services/aiCopywriter";
import { FormField } from "@/components/FormField";

export default function TripDayScreen() {
  const { dayId, tripId } = useLocalSearchParams<{
    dayId: string;
    tripId: string;
  }>();
  const {
    getDay,
    getActivitiesForDay,
    removeActivity,
    moveActivity,
    saveDayAsTemplate,
    dayTemplates,
    loadTemplateToDay,
    setPolishedDescription,
    getPolishedDescription,
    clearPolishedDescription,
  } = useTripContext();
  const { getAsset } = useAssetContext();

  const [polishingId, setPolishingId] = useState<string | null>(null);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [showLoadTemplate, setShowLoadTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDesc, setTemplateDesc] = useState("");

  const day = getDay(dayId);
  if (!day) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="font-heebo-bold text-lg text-navy">יום לא נמצא</Text>
      </View>
    );
  }

  const activities = getActivitiesForDay(dayId);

  // Calculate distance warnings
  const distanceWarnings = useMemo(
    () => checkDayDistances(activities, getAsset),
    [activities, getAsset]
  );

  // Build a set of activity indices that have warnings
  const warningAfterIndex = useMemo(() => {
    const map = new Map<number, (typeof distanceWarnings)[0]>();
    distanceWarnings.forEach((w) => map.set(w.fromIndex, w));
    return map;
  }, [distanceWarnings]);

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

  async function handlePolish(assetId: string) {
    const asset = getAsset(assetId);
    if (!asset) return;

    setPolishingId(assetId);
    try {
      const polished = await polishDescription(
        asset.description_he,
        asset.type,
        asset.title
      );
      setPolishedDescription(assetId, polished);
    } finally {
      setPolishingId(null);
    }
  }

  function handleSaveTemplate() {
    if (!templateName.trim()) {
      Alert.alert("שגיאה", "יש להזין שם לתבנית");
      return;
    }
    const id = saveDayAsTemplate(dayId, templateName.trim(), templateDesc.trim());
    if (id) {
      setShowSaveTemplate(false);
      setTemplateName("");
      setTemplateDesc("");
      Alert.alert("נשמר", "התבנית נשמרה בהצלחה");
    } else {
      Alert.alert("שגיאה", "אין פעילויות לשמור כתבנית");
    }
  }

  function handleLoadTemplate(templateId: string) {
    Alert.alert(
      "טעינת תבנית",
      "פעולה זו תחליף את כל הפעילויות הקיימות ביום. להמשיך?",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "טען",
          onPress: () => {
            loadTemplateToDay(templateId, dayId);
            setShowLoadTemplate(false);
          },
        },
      ]
    );
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
            <View className="flex-row" style={{ gap: 8 }}>
              <Pressable
                onPress={() =>
                  router.push(`/trip/add-activity?dayId=${dayId}`)
                }
                className="bg-gold rounded-xl px-3 py-2 flex-row items-center"
              >
                <Plus size={14} color="#001F3F" />
                <Text className="font-heebo-bold text-xs text-navy mr-1">
                  הוסף
                </Text>
              </Pressable>
              {activities.length > 0 && (
                <Pressable
                  onPress={() => setShowSaveTemplate(true)}
                  className="bg-white/10 rounded-xl px-3 py-2 flex-row items-center"
                >
                  <BookmarkPlus size={14} color="#D4AF37" />
                  <Text className="font-heebo text-xs text-gold mr-1">
                    שמור תבנית
                  </Text>
                </Pressable>
              )}
              {dayTemplates.length > 0 && (
                <Pressable
                  onPress={() => setShowLoadTemplate(true)}
                  className="bg-white/10 rounded-xl px-3 py-2 flex-row items-center"
                >
                  <FolderOpen size={14} color="#D4AF37" />
                  <Text className="font-heebo text-xs text-gold mr-1">
                    תבנית
                  </Text>
                </Pressable>
              )}
            </View>
            <Text className="font-heebo text-sm text-white/60">
              {activities.length} פעילויות
            </Text>
          </View>
        </View>

        {/* Distance Warnings Banner */}
        {distanceWarnings.length > 0 && (
          <View className="mx-4 mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <View className="flex-row items-center justify-end mb-1.5">
              <AlertTriangle size={14} color="#D97706" />
              <Text className="font-heebo-bold text-sm text-amber-700 mr-1.5">
                התראות מרחק
              </Text>
            </View>
            {distanceWarnings.map((w, idx) => (
              <Text
                key={idx}
                className="font-heebo text-xs text-amber-700 text-right mb-0.5"
              >
                {w.fromTitle} → {w.toTitle}: {formatDistance(w.distanceKm)}
              </Text>
            ))}
          </View>
        )}

        {/* Activities List */}
        {activities.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="font-heebo text-base text-navy-200 text-center mb-4">
              אין פעילויות ביום זה עדיין
            </Text>
            <Text className="font-heebo text-sm text-navy-200 text-center">
              לחצי על "הוסף" כדי לחפש בספריה ולהוסיף פריטים
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

              const polished = getPolishedDescription(activity.assetId);
              const isPolishing = polishingId === activity.assetId;
              const warning = warningAfterIndex.get(index);

              return (
                <View>
                  <View
                    className="bg-white rounded-2xl p-4 mb-1 mx-4 border border-navy-50"
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
                          onPress={() =>
                            moveActivity(dayId, activity._id, "up")
                          }
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

                        {/* Description (polished or original) */}
                        {polished && (
                          <View className="bg-purple-50 border border-purple-100 rounded-lg p-2 mb-2">
                            <View className="flex-row items-center justify-between mb-1">
                              <Pressable
                                onPress={() =>
                                  clearPolishedDescription(activity.assetId)
                                }
                              >
                                <RotateCcw size={12} color="#7C3AED" />
                              </Pressable>
                              <View className="flex-row items-center">
                                <Sparkles size={11} color="#7C3AED" />
                                <Text className="font-heebo-medium text-xs text-purple-700 mr-1">
                                  גרסה משופרת
                                </Text>
                              </View>
                            </View>
                            <Text className="font-heebo text-xs text-navy-300 text-right leading-4">
                              {polished}
                            </Text>
                          </View>
                        )}

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

                        {/* Action Buttons Row */}
                        <View
                          className="flex-row items-center mt-1"
                          style={{ gap: 12 }}
                        >
                          {/* Delete */}
                          <Pressable
                            onPress={() =>
                              handleRemoveActivity(activity._id, asset.title)
                            }
                          >
                            <View className="flex-row items-center">
                              <Trash2 size={13} color="#EF4444" />
                              <Text className="font-heebo text-xs text-red-500 mr-1">
                                הסר
                              </Text>
                            </View>
                          </Pressable>

                          {/* AI Polish Button */}
                          <Pressable
                            onPress={() => handlePolish(activity.assetId)}
                            disabled={isPolishing}
                          >
                            <View className="flex-row items-center">
                              {isPolishing ? (
                                <ActivityIndicator
                                  size="small"
                                  color="#7C3AED"
                                  style={{ width: 13, height: 13 }}
                                />
                              ) : (
                                <Wand2 size={13} color="#7C3AED" />
                              )}
                              <Text className="font-heebo text-xs text-purple-600 mr-1">
                                {isPolishing ? "משפר..." : "שפר עם AI"}
                              </Text>
                            </View>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Distance Warning between activities */}
                  {warning && (
                    <View className="mx-8 mb-2 flex-row items-center justify-center py-1.5">
                      <View className="flex-1 h-px bg-amber-200" />
                      <View className="bg-amber-50 border border-amber-200 rounded-full px-3 py-1 flex-row items-center mx-2">
                        <AlertTriangle size={11} color="#D97706" />
                        <Text className="font-heebo text-xs text-amber-700 mr-1">
                          {formatDistance(warning.distanceKm)}
                        </Text>
                      </View>
                      <View className="flex-1 h-px bg-amber-200" />
                    </View>
                  )}
                </View>
              );
            }}
          />
        )}
      </View>

      {/* Save Template Modal */}
      <Modal
        visible={showSaveTemplate}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSaveTemplate(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setShowSaveTemplate(false)}
        >
          <Pressable
            className="bg-white rounded-t-3xl p-6"
            onPress={() => {}}
          >
            <View className="flex-row items-center justify-between mb-5">
              <Pressable onPress={() => setShowSaveTemplate(false)}>
                <X size={20} color="#8099B3" />
              </Pressable>
              <View className="flex-row items-center">
                <BookmarkPlus size={20} color="#D4AF37" />
                <Text className="font-heebo-bold text-lg text-navy mr-2">
                  שמירת תבנית יום
                </Text>
              </View>
            </View>

            <Text className="font-heebo text-sm text-navy-200 text-right mb-4">
              שמרי את מבנה היום כתבנית לשימוש חוזר בטיולים אחרים
            </Text>

            <FormField
              label="שם התבנית"
              value={templateName}
              onChangeText={setTemplateName}
              placeholder="לדוגמה: יום קלאסי ברומא"
            />
            <FormField
              label="תיאור (אופציונלי)"
              value={templateDesc}
              onChangeText={setTemplateDesc}
              placeholder="תיאור קצר של התבנית..."
            />

            <Text className="font-heebo text-xs text-navy-200 text-right mb-4">
              {activities.length} פעילויות יישמרו בתבנית
            </Text>

            <Pressable
              onPress={handleSaveTemplate}
              className="bg-navy rounded-2xl py-4 items-center"
            >
              <Text className="font-heebo-bold text-base text-gold">
                שמור תבנית
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Load Template Modal */}
      <Modal
        visible={showLoadTemplate}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLoadTemplate(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setShowLoadTemplate(false)}
        >
          <Pressable
            className="bg-white rounded-t-3xl max-h-[70%]"
            onPress={() => {}}
          >
            <View className="flex-row items-center justify-between p-6 pb-3 border-b border-navy-50">
              <Pressable onPress={() => setShowLoadTemplate(false)}>
                <X size={20} color="#8099B3" />
              </Pressable>
              <View className="flex-row items-center">
                <FolderOpen size={20} color="#D4AF37" />
                <Text className="font-heebo-bold text-lg text-navy mr-2">
                  טעינת תבנית
                </Text>
              </View>
            </View>

            <FlatList
              data={dayTemplates}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ padding: 16 }}
              renderItem={({ item: template }) => (
                <Pressable
                  onPress={() => handleLoadTemplate(template._id)}
                  className="bg-white rounded-xl p-4 mb-3 border border-navy-50"
                  style={{
                    shadowColor: "#001F3F",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 1,
                  }}
                >
                  <Text className="font-heebo-bold text-base text-navy text-right mb-1">
                    {template.name}
                  </Text>
                  {template.description ? (
                    <Text className="font-heebo text-xs text-navy-200 text-right mb-2">
                      {template.description}
                    </Text>
                  ) : null}
                  <Text className="font-heebo text-xs text-gold text-right">
                    {template.activities.length} פעילויות
                  </Text>
                </Pressable>
              )}
              ListEmptyComponent={
                <Text className="font-heebo text-sm text-navy-200 text-center py-8">
                  אין תבניות שמורות
                </Text>
              }
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
