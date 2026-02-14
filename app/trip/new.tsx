import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { router, Stack } from "expo-router";
import { Calendar, User, Image, X } from "lucide-react-native";
import { FormField } from "@/components/FormField";
import { useTripContext } from "@/services/TripContext";

export default function NewTripScreen() {
  const { addTrip } = useTripContext();

  const [clientName, setClientName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!clientName.trim()) {
      newErrors.clientName = "שם הלקוח חובה";
    }
    if (!startDate.trim()) {
      newErrors.startDate = "תאריך התחלה חובה";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      newErrors.startDate = "פורמט: YYYY-MM-DD";
    }
    if (!endDate.trim()) {
      newErrors.endDate = "תאריך סיום חובה";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      newErrors.endDate = "פורמט: YYYY-MM-DD";
    }

    if (startDate && endDate && startDate > endDate) {
      newErrors.endDate = "תאריך הסיום חייב להיות אחרי ההתחלה";
    }

    // Limit trip to 30 days
    if (startDate && endDate && !newErrors.startDate && !newErrors.endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffDays =
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 30) {
        newErrors.endDate = "מקסימום 30 ימים לטיול";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (!validate()) return;

    const tripId = addTrip({
      client_name: clientName.trim(),
      start_date: startDate,
      end_date: endDate,
      cover_image: coverImage.trim(),
    });

    router.replace(`/trip/${tripId}`);
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "טיול חדש",
          headerTitleStyle: { fontFamily: "Heebo-Bold" },
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
      >
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-full bg-gold-50 items-center justify-center mb-3">
              <Calendar size={28} color="#D4AF37" />
            </View>
            <Text className="font-heebo-bold text-xl text-navy">
              יצירת טיול חדש
            </Text>
            <Text className="font-heebo text-sm text-navy-200 mt-1">
              הזיני את פרטי הטיול ונתחיל לתכנן
            </Text>
          </View>

          {/* Client Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <User size={18} color="#001F3F" />
              <Text className="font-heebo-bold text-base text-navy mr-2">
                פרטי לקוח
              </Text>
            </View>
            <FormField
              label="שם הלקוח"
              value={clientName}
              onChangeText={setClientName}
              placeholder="לדוגמה: משפחת כהן"
              error={errors.clientName}
            />
          </View>

          {/* Date Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Calendar size={18} color="#001F3F" />
              <Text className="font-heebo-bold text-base text-navy mr-2">
                תאריכי הטיול
              </Text>
            </View>
            <FormField
              label="תאריך התחלה"
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
              error={errors.startDate}
              keyboardType="default"
            />
            <FormField
              label="תאריך סיום"
              value={endDate}
              onChangeText={setEndDate}
              placeholder="YYYY-MM-DD"
              error={errors.endDate}
              keyboardType="default"
            />
            {startDate && endDate && !errors.startDate && !errors.endDate && (
              <View className="bg-gold-50 rounded-xl p-3 mt-1">
                <Text className="font-heebo-medium text-sm text-gold-700 text-center">
                  {Math.ceil(
                    (new Date(endDate).getTime() -
                      new Date(startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  ) + 1}{" "}
                  ימים
                </Text>
              </View>
            )}
          </View>

          {/* Cover Image */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Image size={18} color="#001F3F" />
              <Text className="font-heebo-bold text-base text-navy mr-2">
                תמונת כיסוי
              </Text>
            </View>
            <FormField
              label="קישור לתמונה (אופציונלי)"
              value={coverImage}
              onChangeText={setCoverImage}
              placeholder="https://..."
              keyboardType="url"
            />
          </View>

          {/* Save Button */}
          <Pressable
            onPress={handleSave}
            className="bg-navy rounded-2xl py-4 items-center mb-8"
            style={{
              shadowColor: "#001F3F",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <Text className="font-heebo-bold text-base text-gold">
              צור טיול
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
