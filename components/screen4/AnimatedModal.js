import React, { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import Animated, { withSpring, useSharedValue, useAnimatedProps, useAnimatedStyle, withTiming } from "react-native-reanimated";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function AnimatedModal({ days, month, year, setArrayUpdate }) {
    const [value, setValue] = useState(days.toString());
    const [heightInput, setHeightInput] = useState(0);
    const heigth = useSharedValue([4, 14, 32]);

    const handleLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setHeightInput(height);
    };

    const handleFocus = () => {
        heigth.value = [10, 26, 70];
    };
    const handleEndEditing = () => {
        heigth.value = [4, 14, 32];
        setArrayUpdate((array) => {
            let newArr = [+value, month, year];
            const index = array.findIndex((arr) => arr[1] === newArr[1] && arr[2] === newArr[2]);
            if (index !== -1) {
                // Если нашли, заменяем подмассив
                array[index] = newArr;
            } else {
                // Если не нашли, добавляем новый подмассив
                array.push(newArr);
            }
            return array;
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
