import { View, TextInput } from "react-native";
import { Search } from "lucide-react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "חיפוש...",
}: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-navy-50 rounded-xl mx-4 px-4 py-3 mb-3">
      <Search size={18} color="#8099B3" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8099B3"
        className="flex-1 font-heebo text-sm text-navy mr-3"
        style={{ textAlign: "right", writingDirection: "rtl" }}
      />
    </View>
  );
}
