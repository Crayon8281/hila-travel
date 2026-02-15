import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import {
  Crown,
  Globe,
  Phone,
  Mail,
  Info,
  ChevronLeft,
  Palette,
  Shield,
} from "lucide-react-native";

function SettingsItem({
  icon,
  label,
  sublabel,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-2 flex-row items-center border border-navy-50"
      style={{
        shadowColor: "#001F3F",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      <ChevronLeft size={16} color="#B3C2D1" />
      <View className="flex-1 mr-3">
        <Text className="font-heebo-medium text-base text-navy text-right">
          {label}
        </Text>
        {sublabel && (
          <Text className="font-heebo text-xs text-navy-200 text-right mt-0.5">
            {sublabel}
          </Text>
        )}
      </View>
      <View className="w-10 h-10 rounded-full bg-navy-50 items-center justify-center">
        {icon}
      </View>
    </Pressable>
  );
}

export default function SettingsScreen() {
  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Branded Header */}
      <View className="bg-navy mx-4 mt-4 rounded-2xl p-6 items-center">
        <View
          className="w-16 h-16 rounded-full items-center justify-center mb-3"
          style={{ backgroundColor: "#D4AF3720" }}
        >
          <Crown size={28} color="#D4AF37" />
        </View>
        <Text className="font-heebo-bold text-2xl text-gold">
          Hila Travel
        </Text>
        <Text className="font-heebo text-sm text-white/60 mt-1">
          חוויות נסיעה יוקרתיות
        </Text>
        <View className="flex-row items-center mt-3">
          <View className="w-8 h-0.5 bg-gold/30 rounded-full" />
          <Text className="font-heebo-medium text-xs text-gold/50 mx-3">
            LUXURY TRAVEL EXPERIENCES
          </Text>
          <View className="w-8 h-0.5 bg-gold/30 rounded-full" />
        </View>
      </View>

      {/* Settings Items */}
      <View className="px-4 mt-6">
        <Text className="font-heebo-bold text-sm text-navy-200 text-right mb-3">
          כללי
        </Text>

        <SettingsItem
          icon={<Palette size={18} color="#001F3F" />}
          label="ערכת נושא"
          sublabel="Navy & Gold — יוקרה"
        />
        <SettingsItem
          icon={<Globe size={18} color="#001F3F" />}
          label="שפה"
          sublabel="עברית (RTL)"
        />
        <SettingsItem
          icon={<Shield size={18} color="#001F3F" />}
          label="אבטחה ופרטיות"
          sublabel="ניהול קישורי שיתוף"
        />
      </View>

      <View className="px-4 mt-6">
        <Text className="font-heebo-bold text-sm text-navy-200 text-right mb-3">
          אודות
        </Text>

        <SettingsItem
          icon={<Phone size={18} color="#001F3F" />}
          label="צור קשר"
          sublabel="לתמיכה ושאלות"
        />
        <SettingsItem
          icon={<Mail size={18} color="#001F3F" />}
          label="דואר אלקטרוני"
          sublabel="info@hila-travel.app"
        />
        <SettingsItem
          icon={<Info size={18} color="#001F3F" />}
          label="גרסה"
          sublabel="1.0.0"
        />
      </View>

      {/* Footer */}
      <View className="items-center mt-8 px-4">
        <View className="w-12 h-0.5 bg-gold-200 rounded-full mb-3" />
        <Text className="font-heebo text-xs text-navy-200">
          Hila Travel &copy; 2025
        </Text>
        <Text className="font-heebo text-xs text-navy-200 mt-1">
          נבנה באהבה עבור חוויות נסיעה יוקרתיות
        </Text>
      </View>
    </ScrollView>
  );
}
