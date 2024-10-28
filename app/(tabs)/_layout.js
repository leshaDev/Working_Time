import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,

                tabBarStyle: {
                    backgroundColor: "black", // Цвет фона панели вкладок
                    borderTopWidth: 0, // Убрать границу сверху (если нужно)
                },
                contentStyle: { backgroundColor: "#000000" },
            }}
        >
            <Tabs.Screen name="screen1" options={{ title: "Screen1" }} />
            <Tabs.Screen name="screen2" options={{ title: "Screen2", tabBarStyle: { display: "none" } }} />
        </Tabs>
    );
}
