import { View, Text, TextInput, TextInputProps } from "react-native";

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function FormField({ label, error, ...inputProps }: FormFieldProps) {
  return (
    <View className="mb-4">
      <Text className="font-heebo-medium text-sm text-navy mb-1.5">
        {label}
      </Text>
      <TextInput
        {...inputProps}
        placeholderTextColor="#B3C2D1"
        className={`bg-navy-50 rounded-xl px-4 py-3 font-heebo text-sm text-navy border ${
          error ? "border-red-400" : "border-transparent"
        }`}
        style={[
          { textAlign: "right", writingDirection: "rtl" },
          inputProps.style,
        ]}
      />
      {error && (
        <Text className="font-heebo text-xs text-red-500 mt-1">{error}</Text>
      )}
    </View>
  );
}
