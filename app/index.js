import { Text, View } from "react-native";
import { Link } from "expo-router";
import { Redirect } from "expo-router";

export default function Index() {
    return <Redirect href="/(tabs)/screen1" />;
}
