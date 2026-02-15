import { View, Text } from "react-native";
import { Crown } from "lucide-react-native";

interface HilaLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  showTagline?: boolean;
}

const SIZES = {
  sm: { icon: 14, title: "text-sm", tagline: "text-xs", divider: "w-6" },
  md: { icon: 20, title: "text-lg", tagline: "text-xs", divider: "w-8" },
  lg: { icon: 28, title: "text-2xl", tagline: "text-sm", divider: "w-10" },
};

export function HilaLogo({
  size = "md",
  variant = "dark",
  showTagline = true,
}: HilaLogoProps) {
  const s = SIZES[size];
  const titleColor = variant === "dark" ? "text-gold" : "text-navy";
  const taglineColor = variant === "dark" ? "text-white/50" : "text-navy-200";
  const dividerBg = variant === "dark" ? "bg-gold/30" : "bg-gold-200";

  return (
    <View className="items-center">
      <View className="flex-row items-center mb-1">
        <Crown size={s.icon} color="#D4AF37" />
        <Text className={`font-heebo-bold ${s.title} ${titleColor} mr-2`}>
          Hila Travel
        </Text>
      </View>
      {showTagline && (
        <View className="flex-row items-center">
          <View className={`${s.divider} h-0.5 ${dividerBg} rounded-full`} />
          <Text
            className={`font-heebo-medium ${s.tagline} ${taglineColor} mx-2`}
          >
            חוויות נסיעה יוקרתיות
          </Text>
          <View className={`${s.divider} h-0.5 ${dividerBg} rounded-full`} />
        </View>
      )}
    </View>
  );
}
