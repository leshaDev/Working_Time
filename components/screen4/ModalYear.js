import React, { useRef, useEffect, useState } from "react";
import { Text, View, Modal, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import AnimatedModal from "./AnimatedModal";

const tableTime = "settime";

const ModalYear = ({ data, visibleSelect, setVisibleSelect, getData }) => {
    const db = useSQLiteContext();
    const [arrayUpdate, setArrayUpdate] = useState([]);

    const clickClose = () => {
        setArrayUpdate([]);
        setVisibleSelect(false);
    };

    const updateObject = async (array) => {
        try {
            await db.runAsync(`UPDATE ${tableTime} SET  days = ? WHERE month = ? AND year = ?`, array);
            await getData();
        } catch (error) {
            console.log("Error while updating object");
        }
    };

    const save = () => {
        arrayUpdate.forEach((item) => {
            updateObject(item);
        });
    };

    const Selected = ({ year, month, days }) => {
        return (
            <View style={styles.item}>
                <Text style={styles.text}>{month}</Text>
                <View>
                    <AnimatedModal days={days} month={month} year={year} setArrayUpdate={setArrayUpdate} />
                </View>
            </View>
        );
    };

    return (
        <Modal transparent={true} visible={visibleSelect} onRequestClose={clickClose}>
            <View style={styles.container}>
                <Text style={styles.textHeader}>{data.year}</Text>
                <ScrollView style={styles.modalView}>
                    {data.month.map((item, index) => (
                        <Selected key={index.toString()} year={data.year} month={item.month} days={item.days} />
                    ))}
                </ScrollView>
                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.button} onPress={clickClose}>
                        <Text style={[styles.text, { color: "#ffffff" }]}>Выйти</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={save}>
                        <Text style={[styles.text, { color: "#ffffff" }]}>Сохранить</Text>
                    </TouchableOpacity>
                </View>
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
        //opacity: 0.85,
        padding: 10,
    },
    textHeader: {
        color: "#ccc",
        textAlign: "center",
        fontSize: 20,
    },
    item: {
        backgroundColor: "#14171c",
        width: "100%",
        borderRadius: 10,
        margin: 5,
        alignSelf: "center",
        padding: 15,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        color: "#ccc",
        fontSize: 16,
        textAlign: "auto",
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingTop: 40,
    },
    button: {
        padding: 10,
    },
});

export default ModalYear;
