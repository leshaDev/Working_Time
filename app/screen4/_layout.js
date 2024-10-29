// app/screen2/_layout.js
import { Stack } from "expo-router";

export default function Screen4Layout() {
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#000000" } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="settingsHours" />
            <Stack.Screen name="settingsPrice" />
        </Stack>
    );
}
