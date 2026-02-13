import { View, Text, Pressable, Modal, FlatList } from "react-native";
import { useState } from "react";
import { ChevronDown, Check } from "lucide-react-native";

interface PickerSelectProps {
  label: string;
  value: string;
  options: string[];
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function PickerSelect({
  label,
  value,
  options,
  onValueChange,
  placeholder = "בחר...",
}: PickerSelectProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View className="mb-4">
      <Text className="font-heebo-medium text-sm text-navy mb-1.5">
        {label}
      </Text>
      <Pressable
        onPress={() => setVisible(true)}
        className="bg-navy-50 rounded-xl px-4 py-3 flex-row items-center justify-between border border-transparent"
      >
        <ChevronDown size={18} color="#8099B3" />
        <Text
          className={`font-heebo text-sm ${value ? "text-navy" : "text-navy-200"}`}
        >
          {value || placeholder}
        </Text>
      </Pressable>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setVisible(false)}
        >
          <View className="bg-white rounded-t-3xl max-h-[60%]">
            <View className="p-4 border-b border-navy-50">
              <Text className="font-heebo-bold text-lg text-navy text-center">
                {label}
              </Text>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onValueChange(item);
                    setVisible(false);
                  }}
                  className="flex-row items-center justify-between px-6 py-4 border-b border-navy-50"
                >
                  {value === item && <Check size={18} color="#D4AF37" />}
                  <Text
                    className={`font-heebo text-base flex-1 text-right ${
                      value === item ? "text-gold font-heebo-bold" : "text-navy"
                    }`}
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
            />
            <Pressable
              onPress={() => setVisible(false)}
              className="p-4 border-t border-navy-50"
            >
              <Text className="font-heebo-medium text-base text-navy-300 text-center">
                סגור
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
