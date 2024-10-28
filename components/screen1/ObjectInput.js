import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import Time from "./Time";

const ObjectInput = ({ el, updateObject, updateTime, i }) => {
    const [object, setObject] = useState(el.objects[i].object);
    const [focus, setFocus] = useState(false);

    return (
        <>
            <View style={styles.hours}>
                <Time column={"time1"} time={el.objects[i].time1} updateTime={updateTime} el={el} i={i} />
                <Time column={"time2"} time={el.objects[i].time2} updateTime={updateTime} el={el} i={i} />
            </View>

            <TextInput
                style={[styles.input, { backgroundColor: focus ? "#23262b" : "#14171c" }]}
                onEndEditing={() => {
                    updateObject(el.objects[i].id, object);
                    setFocus(false);
                }}
                value={object}
                onChangeText={(text) => setObject(text)}
                onFocus={() => setFocus(true)}
                maxLength={12}
            />
        </>
    );
};

const styles = StyleSheet.create({
    hours: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    input: {
        borderWidth: 2,
        borderColor: "#07080a",
        fontSize: 26,
        padding: 8,
        marginVertical: 3,
        margin: 20,
        borderRadius: 10,
        textAlign: "center",
        color: "#ccc",
        placeholderTextColor: "#ccc",
        selectionColor: "#ccc",
    },
});

export default ObjectInput;
