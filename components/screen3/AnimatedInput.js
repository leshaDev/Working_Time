import React, { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import Animated, { withSpring, useSharedValue, useAnimatedProps, useAnimatedStyle, withTiming } from "react-native-reanimated";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function AnimatedInput({ value, setValue, index, getData }) {
    const [heightInput, setHeightInput] = useState(0);
    const [focus, setFocus] = useState(false);
    const heigth = useSharedValue([4, 14]);

    const rowIndex = Math.floor(index / 4);

    const handleLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setHeightInput(height);
    };

    const handleFocus = () => {
        heigth.value = [20, 26];
    };
    const handleEndEditing = () => {
        heigth.value = [4, 14];
    };

    const animatedStyles = useAnimatedStyle(() => ({
        //height: withTiming(heigth.value),
        fontSize: withSpring(heigth.value[1]),
        padding: withSpring(heigth.value[0]),
    }));

    return (
        <AnimatedTextInput
            onLayout={handleLayout}
            inputMode={"numeric"}
            style={[styles.input, animatedStyles, { width: heightInput, borderRadius: heightInput / 2 }]}
            value={value}
            onChangeText={(text) => setValue(text)}
            onFocus={() => {
                setFocus(true);
                handleFocus();
            }}
            onEndEditing={() => {
                setFocus(false);
                handleEndEditing();
                getData();
            }}
            maxLength={4}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        margin: 5,
        color: "#ccc",
        backgroundColor: "#16271c",
        textAlign: "center",
    },
});
