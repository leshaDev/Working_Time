import React, { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import Animated, { withSpring, useSharedValue, useAnimatedProps, useAnimatedStyle, withTiming } from "react-native-reanimated";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function AnimatedInputPrice({ data, setDataValue, i }) {
    const [value, setValue] = useState(data.toString());
    const [heightInput, setHeightInput] = useState(0);
    const heigth = useSharedValue([4, 14, 38]);

    const handleLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setHeightInput(height);
    };

    const handleFocus = () => {
        heigth.value = [10, 26, 70];
    };
    const handleEndEditing = () => {
        heigth.value = [4, 14, 38];
        setDataValue((arr) => {
            arr[i] = +value;
            return arr;
        });
    };

    const animatedStyles = useAnimatedStyle(() => ({
        fontSize: withSpring(heigth.value[1]),
        padding: withSpring(heigth.value[0]),
        height: withSpring(heigth.value[2]),
    }));

    return (
        <AnimatedTextInput
            onLayout={handleLayout}
            inputMode={"numeric"}
            style={[styles.input, animatedStyles, { width: heightInput, borderRadius: heightInput / 2, backgroundColor: "#16271c" }]}
            value={value}
            //value={data}
            onChangeText={(text) => setValue(text)}
            onFocus={handleFocus}
            onEndEditing={handleEndEditing}
            maxLength={4}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        margin: 5,
        color: "#ccc",
        textAlign: "center",
    },
});
