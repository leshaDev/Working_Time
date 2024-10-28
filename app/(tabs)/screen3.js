import { View, Text, Button, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function Screen3() {
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.text}>Screen </Text>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}
const stylesl = StyleSheet.create({ text: { color: "#fff", fontSize: 26 } });
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    text: { color: "#ccc" },
});
