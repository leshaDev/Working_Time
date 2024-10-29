import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Button } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSQLiteContext } from "expo-sqlite";
import { useSelector, useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { update_price } from "../../redux/dataSlice";
import AnimatedInputPrice from "../../components/screen4/AnimatedInputPrise";

const SettingsPrice = () => {
    const db = useSQLiteContext();
    const [dataValue, setDataValue] = useState([]);

    const router = useRouter();

    // const number_of_days = useSelector((state) => state.data.number_of_days);
    const restart_price = useSelector((state) => state.data.restart_price);
    const dispatch = useDispatch();

    const getData = async () => {
        try {
            const allRows = await db.getAllAsync(`SELECT * FROM price`);
            setDataValue([allRows[0].time, allRows[0].overtime, allRows[0].weekend]);
        } catch (error) {
            console.log("Error while loading table dataJoin : ", error);
        }
    };

    const updatePrice = async (array) => {
        try {
            await db.runAsync(`UPDATE price SET  time = ?, overtime = ?, weekend = ?  WHERE id = 1 `, array);
            await getData();
            dispatch(update_price(!restart_price));
        } catch (error) {
            console.log("Error while updating object");
        }
    };

    const clickSave = () => {
        updatePrice(dataValue);
    };

    useEffect(() => {
        getData();
    }, []);

    const onPressBack = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            {!dataValue.length ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator color="blue" size="large" />
                    <Text>Loading...</Text>
                </View>
            ) : (
                <View style={styles.container}>
                    <View style={styles.iconsContent}>
                        <Ionicons style={styles.icons} onPress={onPressBack} name="chevron-back" size={32} color="#ccc" />
                        <Text style={styles.text}>Настроить стоимость годин</Text>
                    </View>
                    <ScrollView>
                        <View style={styles.items}>
                            <Text style={styles.text}>Рабочие годины</Text>
                            <AnimatedInputPrice data={dataValue[0]} setDataValue={setDataValue} i={0} />
                        </View>
                        <View style={styles.items}>
                            <Text style={styles.text}>Сверх годины</Text>
                            <AnimatedInputPrice data={dataValue[1]} setDataValue={setDataValue} i={1} />
                        </View>
                        <View style={styles.items}>
                            <Text style={styles.text}>Выходные годины</Text>
                            <AnimatedInputPrice data={dataValue[2]} setDataValue={setDataValue} i={2} />
                        </View>
                    </ScrollView>
                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.button} onPress={onPressBack}>
                            <Text style={[styles.text, { color: "#ffffff" }]}>Выйти</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={clickSave}>
                            <Text style={[styles.text, { color: "#ffffff" }]}>Сохранить</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        paddingTop: 5,
    },
    icons: {
        padding: 10,
        marginRight: 10,
        //backgroundColor: "gray",
    },
    iconsContent: {
        flexDirection: "row",
        margin: 10,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    text: {
        color: "#ccc",
        fontSize: 18,
        //textAlign: "center",
    },
    items: {
        backgroundColor: "#14171c",
        marginVertical: 5,
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 15,
        alignItems: "center",
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingTop: 40,
        margin: 20,
    },
    button: {
        padding: 10,
    },
});

export default SettingsPrice;
