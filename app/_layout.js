import { useEffect, useState } from "react";
import { Image } from "react-native";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { store } from "../redux/store";
import { initializeDatabase } from "../constants/db";

export default function RootLayout() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    return (
        <Provider store={store}>
            <SQLiteProvider databaseName="ex8.db" onInit={initializeDatabase}>
                <>
                    {loading ? (
                        <Image
                            source={require("../assets/images/hello.png")}
                            style={{ resizeMode: "contain", backgroundColor: "#000000", width: "100%", flex: 1 }}
                        />
                    ) : (
                        <Stack screenOptions={{ contentStyle: { backgroundColor: "#000000" }, headerShown: false }}>
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="settingsHours" />
                            <Stack.Screen name="settingsPrice" />
                        </Stack>
                    )}
                </>
            </SQLiteProvider>
        </Provider>
    );
}
