import { Stack, useRouter } from "expo-router";
import { View, Text, Button } from "react-native";

export default function Screen4() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}> Screen 4</Text>
            <Button title="Go to Settings Hours" onPress={() => router.push("/settings/settingsHours")} />
            <Button title=" Go Settings Prise" onPress={() => router.push("/settings/settingsPrice")} />
        </View>
    );
}
