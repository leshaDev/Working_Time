import { View, Text, Button, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/styles";
import { StatusBar } from "expo-status-bar";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { useFocusEffect } from "@react-navigation/native";

export default function Screen2() {
    const router = useRouter();

    useFocusEffect(
        React.useCallback(() => {
            // Сохраните текущую ориентацию
            const changeOrientation = async () => {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
                //console.log("Orientation changed to LANDSCAPE");
            };

            changeOrientation();

            // Возвращаем функцию для сброса ориентации при потере фокуса
            return async () => {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
                //console.log("Orientation changed back to PORTRAIT");
            };
        }, [])
    );
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: "#fff" }]}>
            <View>
                <Text>Screen 2</Text>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}
