import { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import {
  Search,
  Plus,
  MapPin,
  DollarSign,
  Check,
  Clock,
} from "lucide-react-native";
import { SearchBar } from "@/components/SearchBar";
import { FilterChip } from "@/components/FilterChip";
import { FormField } from "@/components/FormField";
import { useAssetContext } from "@/services/AssetContext";
import { useTripContext } from "@/services/TripContext";
import { Asset } from "@/services/mockData";

export default function AddActivityScreen() {
  const { dayId } = useLocalSearchParams<{ dayId: string }>();
  const { allAssets } = useAssetContext();
  const { addActivity, getDay } = useTripContext();

  const day = getDay(dayId);

  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [startTime, setStartTime] = useState("");
  const [customNote, setCustomNote] = useState("");

  // Get available types
  const types = useMemo(() => {
    return [...new Set(allAssets.map((a) => a.type))].sort();
  }, [allAssets]);

  // Filter assets
  const filteredAssets = useMemo(() => {
    let result = allAssets;
    if (filterType) {
      result = result.filter((a) => a.type === filterType);
    }
    if (searchText) {
      const search = searchText.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(search) ||
          a.city.toLowerCase().includes(search) ||
          a.country.toLowerCase().includes(search) ||
          a.tags.some((t) => t.toLowerCase().includes(search))
      );
    }
    return result;
  }, [allAssets, filterType, searchText]);

  function handleAdd() {
    if (!selectedAsset) return;
    addActivity(dayId, selectedAsset._id, startTime, customNote);
    router.back();
  }

  // Phase 1: Select asset
  if (!selectedAsset) {
    return (
      <>
        <Stack.Screen
          options={{
            title: day ? `הוספת פעילות - יום ${day.day_number}` : "הוספת פעילות",
            headerTitleStyle: { fontFamily: "Heebo-Bold" },
          }}
        />
        <View className="flex-1 bg-white">
          {/* Search */}
          <View className="pt-4">
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              placeholder="חיפוש בספריה..."
            />
          </View>

          {/* Type Filters */}
          <View className="px-4 mb-3">
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={types}
              keyExtractor={(item) => item}
              contentContainerStyle={{ gap: 8 }}
              inverted
              renderItem={({ item }) => (
                <FilterChip
                  label={item}
                  isActive={filterType === item}
                  onPress={() =>
                    setFilterType(filterType === item ? null : item)
                  }
                />
              )}
            />
          </View>

          {/* Results count */}
          <View className="px-4 mb-2">
            <Text className="font-heebo text-xs text-navy-200 text-right">
              {filteredAssets.length} פריטים בספריה
            </Text>
          </View>

          {/* Asset List */}
          <FlatList
            data={filteredAssets}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setSelectedAsset(item)}
                className="bg-white rounded-xl p-4 mb-2 mx-4 border border-navy-50 flex-row items-center"
              >
                <Plus size={18} color="#D4AF37" />
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center justify-between mb-1">
                    <View className="flex-row items-center">
                      <DollarSign size={12} color="#D4AF37" />
                      <Text className="font-heebo-medium text-xs text-gold mr-1">
                        {item.selling_price.toLocaleString()}
                      </Text>
                    </View>
                    <Text className="font-heebo-bold text-sm text-navy">
                      {item.title}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-end">
                    <View className="bg-gold-50 px-2 py-0.5 rounded-full mr-2">
                      <Text className="font-heebo text-xs text-gold-700">
                        {item.type}
                      </Text>
                    </View>
                    <MapPin size={12} color="#8099B3" />
                    <Text className="font-heebo text-xs text-navy-200 mr-1">
                      {item.city}, {item.country}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <View className="items-center py-12">
                <Text className="font-heebo text-base text-navy-200">
                  לא נמצאו פריטים
                </Text>
              </View>
            }
          />
        </View>
      </>
    );
  }

  // Phase 2: Configure activity details
  return (
    <>
      <Stack.Screen
        options={{
          title: "פרטי פעילות",
          headerTitleStyle: { fontFamily: "Heebo-Bold" },
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
      >
        <View className="flex-1 p-5">
          {/* Selected Asset Card */}
          <View className="bg-navy rounded-2xl p-4 mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Pressable
                onPress={() => setSelectedAsset(null)}
                className="bg-white/10 rounded-full px-3 py-1"
              >
                <Text className="font-heebo text-xs text-white/70">שנה</Text>
              </Pressable>
              <View className="bg-gold-50 px-2 py-0.5 rounded-full">
                <Text className="font-heebo text-xs text-gold-700">
                  {selectedAsset.type}
                </Text>
              </View>
            </View>
            <Text className="font-heebo-bold text-lg text-gold text-right">
              {selectedAsset.title}
            </Text>
            <View className="flex-row items-center justify-end mt-1">
              <MapPin size={12} color="#8099B3" />
              <Text className="font-heebo text-sm text-white/60 mr-1">
                {selectedAsset.city}, {selectedAsset.country}
              </Text>
            </View>
          </View>

          {/* Time Input */}
          <View className="flex-row items-center mb-3">
            <Clock size={18} color="#001F3F" />
            <Text className="font-heebo-bold text-base text-navy mr-2">
              שעה (אופציונלי)
            </Text>
          </View>
          <FormField
            label="שעת התחלה"
            value={startTime}
            onChangeText={setStartTime}
            placeholder="לדוגמה: 09:00"
          />

          {/* Custom Note */}
          <FormField
            label="הערה מותאמת (אופציונלי)"
            value={customNote}
            onChangeText={setCustomNote}
            placeholder="הערות מיוחדות לפעילות זו..."
            multiline
            numberOfLines={3}
            style={{ minHeight: 80, textAlignVertical: "top" }}
          />

          {/* Spacer */}
          <View className="flex-1" />

          {/* Add Button */}
          <Pressable
            onPress={handleAdd}
            className="bg-gold rounded-2xl py-4 flex-row items-center justify-center mb-6"
            style={{
              shadowColor: "#D4AF37",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <Check size={20} color="#001F3F" />
            <Text className="font-heebo-bold text-base text-navy mr-2">
              הוסף לתוכנית היום
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
