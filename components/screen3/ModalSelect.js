import React, { useRef, useEffect, useState } from "react";
import { Text, View, Modal, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

const ModalSelect = ({ visibleSelect, setVisibleSelect, data, setMonth, setYear, onPressModal }) => {
    const clickClose = () => setVisibleSelect(false);

    const clickSelect = (text) => {
        onPressModal ? setYear(text) : setMonth(text);
        setVisibleSelect(false);
    };

    const Selected = ({ text }) => {
        return (
            <TouchableOpacity onPress={() => clickSelect(text)} style={styles.button}>
                <Text style={styles.text}>{text}</Text>
            </TouchableOpacity>
        );
    };
    return (
        <Modal transparent={true} visible={visibleSelect} onRequestClose={clickClose}>
            <View style={styles.container}>
                <ScrollView style={styles.modalView}>
                    {data.map((item, index) => (
                        <Selected key={index.toString()} text={item} />
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        borderRadius: 20,
        backgroundColor: "#000",
        opacity: 0.85,
        padding: 10,
    },
    text: {
        backgroundColor: "#14171c",
        color: "#ccc",
        fontSize: 16,
        alignSelf: "center",
        padding: 15,
        width: "100%",
        textAlign: "center",
        borderRadius: 10,
        margin: 5,
    },
});

export default ModalSelect;
