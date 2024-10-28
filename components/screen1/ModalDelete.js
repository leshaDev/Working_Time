import React, { useRef, useEffect, useState } from "react";
import { Text, View, Modal, StyleSheet, TouchableOpacity } from "react-native";

export default ModalDelete = ({ deleteObject, idObject, visibleDelete, setVisibleDelete }) => {
    const clickCancel = () => {
        setVisibleDelete(false);
    };
    const clickDelete = () => {
        deleteObject(idObject);
        setVisibleDelete(false);
    };
    return (
        <Modal transparent={true} visible={visibleDelete} onRequestClose={clickCancel}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.text}>Are you sure you want to delete ?</Text>
                    <View style={styles.viewButtons}>
                        <TouchableOpacity onPress={clickCancel}>
                            <Text style={{ color: "#263FC0", fontSize: 16 }}>cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => clickDelete()}>
                            <Text style={{ color: "#263FC0", fontSize: 16 }}>delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        width: "100%",
        margin: 20,
        backgroundColor: "#14171c",
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    viewButtons: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 5,
        marginTop: 10,
    },
    text: {
        width: "100%",
        padding: 5,
        fontSize: 20,
        marginBottom: 20,
        color: "#ccc",
        textAlign: "center",
        paddingVertical: 20,
    },
});
