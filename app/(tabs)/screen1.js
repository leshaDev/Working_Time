import { View, Text, Button, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/styles";
import { StatusBar } from "expo-status-bar";

export default function Screen1() {
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.text}>Screen 1</Text>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}
const stylesl = StyleSheet.create({ text: { color: "#fff", fontSize: 26 } });
