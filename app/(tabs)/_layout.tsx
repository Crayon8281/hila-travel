import React from "react";
import { Tabs } from "expo-router";
import { Library, Map, Settings, Crown } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#D4AF37",
        tabBarInactiveTintColor: "#8099B3",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E6EBF0",
          borderTopWidth: 1,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontFamily: "Heebo-Medium",
          fontSize: 11,
        },
        headerStyle: {
          backgroundColor: "#001F3F",
        },
        headerTintColor: "#D4AF37",
        headerTitleStyle: {
          fontFamily: "Heebo-Bold",
          color: "#FFFFFF",
        },
        headerTitleAlign: "center",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "טיולים",
          headerTitle: () => (
            <React.Fragment>
              {/* Custom branded header — rendered inline */}
            </React.Fragment>
          ),
          headerLeft: () => (
            <Crown size={18} color="#D4AF37" style={{ marginLeft: 16 }} />
          ),
          headerRight: () => null,
          tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "ספריה",
          tabBarIcon: ({ color, size }) => (
            <Library size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "הגדרות",
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
