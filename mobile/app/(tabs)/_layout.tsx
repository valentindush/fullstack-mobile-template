import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import tw from "twrnc"

export default function TabsLayout() {

    return (
        <SafeAreaProvider style={{ flex: 1, backgroundColor: "white", }}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: "orange",
                    tabBarStyle: {...tw`bg-white rounded-full shadow-2xl shadow-gray-500 p-4 h-[24] mb-4 mt-3 mx-2 border-t border-t-black/5`}
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={30} />,
                    }}
                />
                <Tabs.Screen
                    name="books"
                    options={{
                        tabBarIcon: ({ color }) => <Ionicons size={30} name="notifications" color={color} />,
                    }}
                />
              
            </Tabs>
        </SafeAreaProvider>
    )
}