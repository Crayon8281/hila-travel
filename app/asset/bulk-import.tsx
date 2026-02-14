import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import {
  Link2,
  Play,
  Check,
  X,
  AlertCircle,
  Plus,
  Loader,
  Clipboard,
  Trash2,
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react-native";
import { useAssetContext } from "@/services/AssetContext";
import {
  ExtractionItem,
  parseUrls,
  extractUrl,
  createExtractionItem,
} from "@/services/urlExtractor";

type Phase = "paste" | "processing" | "review";

export default function BulkImportScreen() {
  const router = useRouter();
  const { addAsset } = useAssetContext();

  const [phase, setPhase] = useState<Phase>("paste");
  const [rawText, setRawText] = useState("");
  const [items, setItems] = useState<ExtractionItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Parse URLs from pasted text
  const handleStartExtraction = useCallback(async () => {
    const urls = parseUrls(rawText);
    if (urls.length === 0) {
      Alert.alert("אין קישורים", "לא נמצאו קישורים תקינים בטקסט שהודבק.");
      return;
    }

    const newItems = urls.map((url) => createExtractionItem(url));
    setItems(newItems);
    setPhase("processing");

    // Process each URL sequentially to show real-time progress
    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i];

      // Mark as extracting
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, status: "extracting" } : it
        )
      );

      try {
        const data = await extractUrl(item.url);
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id ? { ...it, status: "done", data } : it
          )
        );
      } catch (err) {
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? {
                  ...it,
                  status: "error",
                  error:
                    err instanceof Error ? err.message : "שגיאה לא ידועה",
                }
              : it
          )
        );
      }
    }

    setPhase("review");
  }, [rawText]);

  // Add a single extracted item to the library
  const handleAddItem = useCallback(
    (item: ExtractionItem) => {
      if (!item.data) return;

      addAsset({
        type: item.data.type || "אטרקציה",
        country: item.data.country || "",
        city: item.data.city || "",
        title: item.data.title,
        description_he: item.data.description_he,
        images: [],
        expert_notes: item.data.lat
          ? `קואורדינטות: ${item.data.lat}, ${item.data.lng}\nמקור: ${item.url}`
          : `מקור: ${item.url}`,
        tags: item.data.tags,
        cost_price: 0,
        selling_price: 0,
      });

      // Remove from list
      setItems((prev) => prev.filter((it) => it.id !== item.id));
    },
    [addAsset]
  );

  // Add all successful extractions to the library
  const handleAddAll = useCallback(() => {
    const successItems = items.filter((it) => it.status === "done" && it.data);
    if (successItems.length === 0) return;

    successItems.forEach((item) => {
      if (!item.data) return;
      addAsset({
        type: item.data.type || "אטרקציה",
        country: item.data.country || "",
        city: item.data.city || "",
        title: item.data.title,
        description_he: item.data.description_he,
        images: [],
        expert_notes: item.data.lat
          ? `קואורדינטות: ${item.data.lat}, ${item.data.lng}\nמקור: ${item.url}`
          : `מקור: ${item.url}`,
        tags: item.data.tags,
        cost_price: 0,
        selling_price: 0,
      });
    });

    Alert.alert(
      "נוספו לספריה",
      `${successItems.length} נכסים נוספו בהצלחה לספריה הגלובלית.`,
      [{ text: "אישור", onPress: () => router.back() }]
    );
  }, [items, addAsset, router]);

  // Remove an item from the list
  const handleRemoveItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  // Reset to paste phase
  const handleReset = useCallback(() => {
    setPhase("paste");
    setRawText("");
    setItems([]);
    setExpandedId(null);
  }, []);

  const successCount = items.filter(
    (it) => it.status === "done" && it.data
  ).length;
  const errorCount = items.filter((it) => it.status === "error").length;
  const processingCount = items.filter(
    (it) => it.status === "extracting" || it.status === "pending"
  ).length;

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "ייבוא מרובה",
          headerTitleStyle: { fontFamily: "Heebo-Bold" },
          headerBackTitle: "ביטול",
        }}
      />

      {/* Phase 1: Paste URLs */}
      {phase === "paste" && (
        <View className="flex-1">
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Instructions */}
            <View className="bg-navy rounded-2xl p-5 mb-5">
              <View className="flex-row items-center mb-3">
                <Link2 size={20} color="#D4AF37" />
                <Text className="font-heebo-bold text-lg text-white ml-2">
                  ייבוא חכם מקישורים
                </Text>
              </View>
              <Text className="font-heebo text-sm text-white/80 leading-6">
                הדבק קישורים מ-Google Maps או Booking.com (כל קישור בשורה
                נפרדת). המערכת תחלץ אוטומטית את הפרטים של כל מקום באמצעות AI.
              </Text>
            </View>

            {/* URL Input Area */}
            <Text className="font-heebo-bold text-base text-navy mb-2">
              הדבק קישורים כאן
            </Text>
            <TextInput
              value={rawText}
              onChangeText={setRawText}
              multiline
              numberOfLines={10}
              placeholder={`https://www.google.com/maps/place/Hotel+de+Russie/...\nhttps://www.booking.com/hotel/it/de-russie.html\nhttps://maps.app.goo.gl/abc123...`}
              placeholderTextColor="#B3C2D1"
              className="bg-navy-50 rounded-xl px-4 py-3 font-heebo text-sm text-navy border border-navy-100"
              style={{
                minHeight: 200,
                textAlignVertical: "top",
                textAlign: "right",
                writingDirection: "rtl",
              }}
            />

            {/* URL Count Preview */}
            {rawText.trim().length > 0 && (
              <View className="flex-row items-center mt-3">
                <Clipboard size={14} color="#8099B3" />
                <Text className="font-heebo text-sm text-navy-300 ml-1">
                  {parseUrls(rawText).length} קישורים זוהו
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Start Button */}
          <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-navy-50 px-4 py-4">
            <Pressable
              onPress={handleStartExtraction}
              disabled={!rawText.trim()}
              className={`flex-row items-center justify-center rounded-xl py-4 ${
                rawText.trim() ? "bg-gold" : "bg-navy-100"
              }`}
            >
              <Text
                className={`font-heebo-bold text-base ml-2 ${
                  rawText.trim() ? "text-white" : "text-navy-300"
                }`}
              >
                התחל חילוץ
              </Text>
              <Play
                size={20}
                color={rawText.trim() ? "#FFFFFF" : "#8099B3"}
              />
            </Pressable>
          </View>
        </View>
      )}

      {/* Phase 2: Processing & Phase 3: Review */}
      {(phase === "processing" || phase === "review") && (
        <View className="flex-1">
          {/* Status Header */}
          <View className="bg-navy px-4 py-4">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-4">
                {errorCount > 0 && (
                  <View className="flex-row items-center">
                    <X size={14} color="#EF4444" />
                    <Text className="font-heebo text-sm text-red-300 ml-1">
                      {errorCount}
                    </Text>
                  </View>
                )}
                <View className="flex-row items-center">
                  <Check size={14} color="#4ADE80" />
                  <Text className="font-heebo text-sm text-green-300 ml-1">
                    {successCount}
                  </Text>
                </View>
                {processingCount > 0 && (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#D4AF37" />
                    <Text className="font-heebo text-sm text-gold-200 ml-1">
                      {processingCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text className="font-heebo-bold text-base text-white">
                {phase === "processing"
                  ? "מחלץ נתונים..."
                  : "סיכום ייבוא"}
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="bg-white/20 rounded-full h-2 mt-3">
              <View
                className="bg-gold rounded-full h-2"
                style={{
                  width: `${
                    items.length > 0
                      ? ((successCount + errorCount) / items.length) * 100
                      : 0
                  }%`,
                }}
              />
            </View>
          </View>

          {/* Items List */}
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            {items.map((item) => (
              <ExtractionItemCard
                key={item.id}
                item={item}
                isExpanded={expandedId === item.id}
                onToggleExpand={() =>
                  setExpandedId(expandedId === item.id ? null : item.id)
                }
                onAdd={() => handleAddItem(item)}
                onRemove={() => handleRemoveItem(item.id)}
              />
            ))}
          </ScrollView>

          {/* Bottom Actions (only in review phase) */}
          {phase === "review" && items.length > 0 && (
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-navy-50 px-4 py-4 flex-row gap-3">
              <Pressable
                onPress={handleReset}
                className="flex-row items-center justify-center bg-navy-50 rounded-xl px-4 py-3"
              >
                <Text className="font-heebo-medium text-sm text-navy">
                  התחל מחדש
                </Text>
              </Pressable>
              {successCount > 0 && (
                <Pressable
                  onPress={handleAddAll}
                  className="flex-1 flex-row items-center justify-center bg-gold rounded-xl py-3"
                >
                  <Text className="font-heebo-bold text-base text-white ml-2">
                    הוסף {successCount} לספריה
                  </Text>
                  <Plus size={18} color="#FFFFFF" />
                </Pressable>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

// Individual extraction item card
function ExtractionItemCard({
  item,
  isExpanded,
  onToggleExpand,
  onAdd,
  onRemove,
}: {
  item: ExtractionItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const statusIcon = {
    pending: <Loader size={16} color="#8099B3" />,
    extracting: <ActivityIndicator size="small" color="#D4AF37" />,
    done: <Check size={16} color="#4ADE80" />,
    error: <AlertCircle size={16} color="#EF4444" />,
  };

  const statusBg = {
    pending: "bg-navy-50",
    extracting: "bg-gold-50",
    done: "bg-green-50",
    error: "bg-red-50",
  };

  // Truncate URL for display
  const shortUrl =
    item.url.length > 60 ? item.url.substring(0, 57) + "..." : item.url;

  return (
    <View
      className={`mx-4 mt-3 rounded-xl border ${
        item.status === "error"
          ? "border-red-200"
          : item.status === "done"
            ? "border-green-200"
            : "border-navy-50"
      }`}
    >
      {/* Header Row */}
      <Pressable
        onPress={item.status === "done" ? onToggleExpand : undefined}
        className={`flex-row items-center p-3 ${statusBg[item.status]} rounded-t-xl`}
      >
        <View className="flex-row items-center flex-1">
          <View className="mr-2">{statusIcon[item.status]}</View>
          <Text
            className="font-heebo text-xs text-navy-300 flex-1"
            numberOfLines={1}
          >
            {shortUrl}
          </Text>
        </View>
        {item.status === "done" && (
          <View className="ml-2">
            {isExpanded ? (
              <ChevronUp size={16} color="#8099B3" />
            ) : (
              <ChevronDown size={16} color="#8099B3" />
            )}
          </View>
        )}
      </Pressable>

      {/* Extracted Title (always visible when done) */}
      {item.status === "done" && item.data && (
        <View className="px-3 py-2 border-t border-navy-50">
          <View className="flex-row items-center justify-between">
            <View className="flex-row gap-2">
              <Pressable
                onPress={onRemove}
                className="p-1.5 bg-red-50 rounded-lg"
              >
                <Trash2 size={14} color="#EF4444" />
              </Pressable>
              <Pressable
                onPress={onAdd}
                className="p-1.5 bg-gold rounded-lg"
              >
                <Plus size={14} color="#FFFFFF" />
              </Pressable>
            </View>
            <View className="flex-1 mr-3">
              <Text
                className="font-heebo-bold text-sm text-navy text-right"
                numberOfLines={1}
              >
                {item.data.title}
              </Text>
              <Text className="font-heebo text-xs text-navy-300 text-right">
                {item.data.type}
                {item.data.city ? ` · ${item.data.city}` : ""}
                {item.data.country ? `, ${item.data.country}` : ""}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Expanded Details */}
      {item.status === "done" && item.data && isExpanded && (
        <View className="px-3 pb-3 border-t border-navy-50">
          <Text className="font-heebo text-sm text-navy-400 mt-2 leading-5">
            {item.data.description_he}
          </Text>

          {item.data.lat && (
            <View className="flex-row items-center mt-2">
              <MapPin size={12} color="#D4AF37" />
              <Text className="font-heebo text-xs text-navy-300 ml-1">
                {item.data.lat.toFixed(6)}, {item.data.lng?.toFixed(6)}
              </Text>
            </View>
          )}

          <View className="flex-row flex-wrap mt-2">
            {item.data.tags.map((tag) => (
              <View
                key={tag}
                className="bg-navy-50 px-2 py-0.5 rounded-full mr-1 mb-1"
              >
                <Text className="font-heebo text-xs text-navy">{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Error Message */}
      {item.status === "error" && (
        <View className="px-3 py-2 border-t border-red-100">
          <Text className="font-heebo text-xs text-red-500">
            {item.error}
          </Text>
        </View>
      )}
    </View>
  );
}
