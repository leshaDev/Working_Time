import { View, Text, Modal, StyleSheet, ActivityIndicator } from "react-native";
import React from "react";

const ModalSave = ({ visibleSave }) => {
    return (
        <Modal transparent={true} visible={visibleSave}>
            <View style={styles.container}>
                <ActivityIndicator color="blue" size="large" />
                <Text style={styles.text}>saving...</Text>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.5,
    },
    text: {
        fontSize: 16,
        color: "#ccc",
    },
});

export default ModalSave;
