import { Pressable, Text } from "react-native";

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export function FilterChip({ label, isActive, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 border ${
        isActive
          ? "bg-gold border-gold"
          : "bg-white border-navy-100"
      }`}
    >
      <Text
        className={`font-heebo text-sm ${
          isActive ? "text-white" : "text-navy"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
