import { View, Text, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { Plus, Map, Crown } from "lucide-react-native";
import { useTripContext } from "@/services/TripContext";
import { TripCard } from "@/components/TripCard";

export default function TripsScreen() {
  const { trips, getDaysForTrip } = useTripContext();

  return (
    <View className="flex-1 bg-white">
      {trips.length === 0 ? (
        /* Empty State */
        <View className="flex-1 items-center justify-center px-8">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-5"
            style={{ backgroundColor: "#001F3F" }}
          >
            <Crown size={36} color="#D4AF37" strokeWidth={1.5} />
          </View>
          <Text className="font-heebo-bold text-2xl text-navy mb-2 text-center">
            ברוכה הבאה, הילה
          </Text>
          <Text className="font-heebo text-base text-navy-200 text-center mb-8 leading-6">
            צרי טיול חדש כדי להתחיל לתכנן{"\n"}חוויה בלתי נשכחת ללקוחות שלך
          </Text>
          <Pressable
            onPress={() => router.push("/trip/new")}
            className="bg-navy rounded-2xl px-8 py-4 flex-row items-center"
            style={{
              shadowColor: "#001F3F",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <Plus size={20} color="#D4AF37" />
            <Text className="font-heebo-bold text-base text-gold mr-2">
              טיול חדש
            </Text>
          </Pressable>
        </View>
      ) : (
        /* Trip List */
        <FlatList
          data={trips}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TripCard
              trip={item}
              dayCount={getDaysForTrip(item._id).length}
              onPress={() => router.push(`/trip/${item._id}`)}
            />
          )}
          ListHeaderComponent={
            <View className="px-4 mb-4">
              {/* Branded Sub-header */}
              <View className="flex-row items-center justify-between mb-3">
                <Pressable
                  onPress={() => router.push("/trip/new")}
                  className="bg-gold rounded-full w-10 h-10 items-center justify-center"
                  style={{
                    shadowColor: "#D4AF37",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 3,
                  }}
                >
                  <Plus size={20} color="#001F3F" />
                </Pressable>
                <View className="flex-row items-center">
                  <Text className="font-heebo-bold text-lg text-navy">
                    הטיולים שלי
                  </Text>
                </View>
              </View>
              <Text className="font-heebo text-sm text-navy-200 text-right">
                {trips.length} טיולים פעילים
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
