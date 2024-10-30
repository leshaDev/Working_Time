// app/_layout.js
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const name1 = "index";
const name2 = "screen2";
const name3 = "screen3";
const name4 = "screen4";

export default function TabsLayout() {
    return (
        <Tabs
            initialRouteName={name1}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;
                    if (rn === name1) {
                        iconName = focused ? "time" : "time-outline";
                    }
                    if (rn === name2) {
                        iconName = focused ? "calendar" : "calendar-outline";
                    }
                    if (rn === name3) {
                        iconName = focused ? "calculator" : "calculator-outline";
                    }
                    if (rn === name4) {
                        iconName = focused ? "settings" : "settings-outline";
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "black", // Цвет фона панели вкладок
                    borderTopWidth: 0, // Убрать границу сверху (если нужно)
                },
                contentStyle: { backgroundColor: "#000000" },
            })}
        >
            <Tabs.Screen name={name1} options={{ title: "Time" }} />
            <Tabs.Screen name={name2} options={{ title: "Table", tabBarStyle: { display: "none" } }} />
            <Tabs.Screen name={name3} options={{ title: "Calculator" }} />
            <Tabs.Screen name={name4} options={{ title: "Settings" }} />
        </Tabs>
    );
}
