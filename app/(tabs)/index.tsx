import { View, Text, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { Plus, Map } from "lucide-react-native";
import { useTripContext } from "@/services/TripContext";
import { TripCard } from "@/components/TripCard";

export default function TripsScreen() {
  const { trips, getDaysForTrip } = useTripContext();

  return (
    <View className="flex-1 bg-white">
      {trips.length === 0 ? (
        /* Empty State */
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 rounded-full bg-navy-50 items-center justify-center mb-5">
            <Map size={36} color="#001F3F" strokeWidth={1.5} />
          </View>
          <Text className="font-heebo-bold text-2xl text-navy mb-2">
            אין טיולים עדיין
          </Text>
          <Text className="font-heebo text-base text-navy-200 text-center mb-8">
            צרי טיול חדש כדי להתחיל לתכנן חוויה בלתי נשכחת ללקוחות שלך
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
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TripCard
              trip={item}
              dayCount={getDaysForTrip(item._id).length}
              onPress={() => router.push(`/trip/${item._id}`)}
            />
          )}
          ListHeaderComponent={
            <View className="flex-row items-center justify-between px-4 mb-4">
              <Pressable
                onPress={() => router.push("/trip/new")}
                className="bg-gold rounded-full w-10 h-10 items-center justify-center"
              >
                <Plus size={20} color="#001F3F" />
              </Pressable>
              <Text className="font-heebo text-sm text-navy-200">
                {trips.length} טיולים
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
