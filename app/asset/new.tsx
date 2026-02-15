import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { Save } from "lucide-react-native";
import { useAssetContext } from "@/services/AssetContext";
import { ASSET_TYPES, COUNTRIES } from "@/services/mockData";
import { FormField } from "@/components/FormField";
import { PickerSelect } from "@/components/PickerSelect";

export default function NewAssetScreen() {
  const router = useRouter();
  const { addAsset } = useAssetContext();

  const [type, setType] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [title, setTitle] = useState("");
  const [descriptionHe, setDescriptionHe] = useState("");
  const [expertNotes, setExpertNotes] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!type) newErrors.type = "חובה לבחור סוג";
    if (!country) newErrors.country = "חובה לבחור מדינה";
    if (!city.trim()) newErrors.city = "חובה להזין עיר";
    if (!title.trim()) newErrors.title = "חובה להזין שם";
    if (!descriptionHe.trim()) newErrors.descriptionHe = "חובה להזין תיאור";
    if (!costPrice || isNaN(Number(costPrice)))
      newErrors.costPrice = "חובה להזין מחיר עלות תקין";
    if (!sellingPrice || isNaN(Number(sellingPrice)))
      newErrors.sellingPrice = "חובה להזין מחיר מכירה תקין";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    addAsset({
      type,
      country,
      city: city.trim(),
      title: title.trim(),
      description_he: descriptionHe.trim(),
      images: [],
      expert_notes: expertNotes.trim(),
      tags,
      cost_price: Number(costPrice),
      selling_price: Number(sellingPrice),
    });

    Alert.alert("נשמר", "הנכס נוסף בהצלחה לספריה", [
      { text: "אישור", onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-white">
        <Stack.Screen
          options={{
            title: "נכס חדש",
            headerTitleStyle: { fontFamily: "Heebo-Bold" },
            headerBackTitle: "ביטול",
          }}
        />

        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Section: Basic Info */}
          <Text className="font-heebo-bold text-lg text-navy mb-4 text-right">
            פרטים בסיסיים
          </Text>

          <FormField
            label="שם הנכס"
            value={title}
            onChangeText={setTitle}
            placeholder="לדוגמה: Hotel de Russie"
            error={errors.title}
          />

          <PickerSelect
            label="סוג"
            value={type}
            options={[...ASSET_TYPES]}
            onValueChange={setType}
            placeholder="בחר סוג נכס..."
          />
          {errors.type && (
            <Text className="font-heebo text-xs text-red-500 -mt-3 mb-3">
              {errors.type}
            </Text>
          )}

          <PickerSelect
            label="מדינה"
            value={country}
            options={[...COUNTRIES]}
            onValueChange={setCountry}
            placeholder="בחר מדינה..."
          />
          {errors.country && (
            <Text className="font-heebo text-xs text-red-500 -mt-3 mb-3">
              {errors.country}
            </Text>
          )}

          <FormField
            label="עיר"
            value={city}
            onChangeText={setCity}
            placeholder="לדוגמה: רומא"
            error={errors.city}
          />

          {/* Section: Description */}
          <Text className="font-heebo-bold text-lg text-navy mb-4 mt-6 text-right">
            תיאור ותוכן
          </Text>

          <FormField
            label="תיאור בעברית"
            value={descriptionHe}
            onChangeText={setDescriptionHe}
            placeholder="תיאור מפורט של הנכס..."
            multiline
            numberOfLines={4}
            error={errors.descriptionHe}
            style={{ minHeight: 100, textAlignVertical: "top" }}
          />

          <FormField
            label="הערות מומחה"
            value={expertNotes}
            onChangeText={setExpertNotes}
            placeholder="טיפים, המלצות, מידע פנימי..."
            multiline
            numberOfLines={3}
            style={{ minHeight: 80, textAlignVertical: "top" }}
          />

          <FormField
            label="תגיות (מופרדות בפסיק)"
            value={tagsText}
            onChangeText={setTagsText}
            placeholder="יוקרה, ספא, רומנטי..."
          />

          {/* Section: Pricing */}
          <Text className="font-heebo-bold text-lg text-navy mb-4 mt-6 text-right">
            תמחור
          </Text>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <FormField
                label="מחיר עלות ($)"
                value={costPrice}
                onChangeText={setCostPrice}
                placeholder="0"
                keyboardType="numeric"
                error={errors.costPrice}
              />
            </View>
            <View className="flex-1">
              <FormField
                label="מחיר מכירה ($)"
                value={sellingPrice}
                onChangeText={setSellingPrice}
                placeholder="0"
                keyboardType="numeric"
                error={errors.sellingPrice}
              />
            </View>
          </View>

          {costPrice && sellingPrice && !isNaN(Number(costPrice)) && !isNaN(Number(sellingPrice)) && (
            <View className="bg-green-50 rounded-xl p-3 mt-2">
              <Text className="font-heebo-medium text-sm text-green-700 text-center">
                רווח: ${(Number(sellingPrice) - Number(costPrice)).toLocaleString()} (
                {Number(sellingPrice) > 0
                  ? Math.round(
                      ((Number(sellingPrice) - Number(costPrice)) /
                        Number(sellingPrice)) *
                        100
                    )
                  : 0}
                %)
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Save Button */}
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-navy-50 px-4 py-4">
          <Pressable
            onPress={handleSave}
            className="flex-row items-center justify-center bg-gold rounded-xl py-4"
          >
            <Save size={20} color="#FFFFFF" />
            <Text className="font-heebo-bold text-base text-white mr-2">
              שמור נכס
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
