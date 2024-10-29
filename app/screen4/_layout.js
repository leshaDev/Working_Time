// app/screen2/_layout.js
import { Stack } from "expo-router";

export default function Screen4Layout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="settingsHours" options={{ headerShown: false }} />
            <Stack.Screen name="settingsPrice" options={{ headerShown: false, tabBarStyle: { display: "none" } }} />
        </Stack>
    );
}
