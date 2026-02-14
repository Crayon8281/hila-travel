import { View, Text, FlatList, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Plus, Package, Link2 } from "lucide-react-native";
import { useAssetContext } from "@/services/AssetContext";
import { SearchBar } from "@/components/SearchBar";
import { FilterChip } from "@/components/FilterChip";
import { AssetCard } from "@/components/AssetCard";

export default function LibraryScreen() {
  const router = useRouter();
  const {
    assets,
    searchText,
    setSearchText,
    filterType,
    setFilterType,
    filterCountry,
    setFilterCountry,
    filterOptions,
  } = useAssetContext();

  return (
    <View className="flex-1 bg-white">
      {/* Search */}
      <View className="pt-2">
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="חיפוש לפי שם, עיר, תגית..."
        />
      </View>

      {/* Type Filters */}
      <View className="mb-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          <FilterChip
            label="הכל"
            isActive={!filterType}
            onPress={() => setFilterType(null)}
          />
          {filterOptions.types.map((type) => (
            <FilterChip
              key={type}
              label={type}
              isActive={filterType === type}
              onPress={() =>
                setFilterType(filterType === type ? null : type)
              }
            />
          ))}
        </ScrollView>
      </View>

      {/* Country Filters */}
      <View className="mb-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          <FilterChip
            label="כל המדינות"
            isActive={!filterCountry}
            onPress={() => setFilterCountry(null)}
          />
          {filterOptions.countries.map((country) => (
            <FilterChip
              key={country}
              label={country}
              isActive={filterCountry === country}
              onPress={() =>
                setFilterCountry(filterCountry === country ? null : country)
              }
            />
          ))}
        </ScrollView>
      </View>

      {/* Results count + Actions */}
      <View className="flex-row items-center justify-between mx-4 mb-2">
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => router.push("/asset/bulk-import")}
            className="flex-row items-center bg-navy rounded-xl px-3 py-2"
          >
            <Text className="font-heebo-bold text-sm text-white ml-1">
              ייבוא
            </Text>
            <Link2 size={14} color="#D4AF37" />
          </Pressable>
          <Pressable
            onPress={() => router.push("/asset/new")}
            className="flex-row items-center bg-gold rounded-xl px-3 py-2"
          >
            <Text className="font-heebo-bold text-sm text-white ml-1">
              הוסף נכס
            </Text>
            <Plus size={16} color="#FFFFFF" />
          </Pressable>
        </View>
        <Text className="font-heebo text-sm text-navy-300">
          {assets.length} נכסים
        </Text>
      </View>

      {/* Asset List */}
      <FlatList
        data={assets}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <AssetCard
            asset={item}
            onPress={() => router.push(`/asset/${item._id}`)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Package size={48} color="#B3C2D1" />
            <Text className="font-heebo-medium text-base text-navy-200 mt-4">
              לא נמצאו נכסים
            </Text>
            <Text className="font-heebo text-sm text-navy-200 mt-1">
              נסה לשנות את מסנני החיפוש
            </Text>
          </View>
        }
      />
    </View>
  );
}
