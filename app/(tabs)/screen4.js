import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, StyleSheet, FlatList, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useSelector, useDispatch } from "react-redux";
import { update_number_of_days } from "../../redux/dataSlice";

const tableDate = "date";
const tableTime = "settime";
const tableObject = "object";
const tablePrice = "price";

const SettingMain = ({ navigation, route }) => {
    const db = useSQLiteContext();
    const [data, setData] = useState([]);
    const router = useRouter();

    const color = "#14171c";

    const getData = async () => {
        try {
            const allRows = await db.getAllAsync(`SELECT * FROM settime`);
            // console.log(allRows);

            let data = [];
            allRows.forEach((item) => {
                let existingYear = data.find((entry) => entry.year === item.year);

                if (existingYear) {
                    existingYear.month.push({ month: item.month, days: item.days });
                } else {
                    data.push({ year: item.year, month: [{ month: item.month, days: item.days }] });
                }
            });
            setData(data);
        } catch (error) {
            console.log("Error while loading table dataJoin : ", error);
        }
    };
    const deleteAll = async () => {
        try {
            await db.runAsync("DROP TABLE test");
        } catch (error) {
            console.log("Error while deleting all the students : ", error);
        }
    };
    const selectTable = async () => {
        try {
            const allRows = await db.getAllAsync(`SELECT name FROM sqlite_master WHERE type ='table'`);
            console.log(allRows);
        } catch (error) {
            console.log("Error while loading table dataJoin : ", error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const onPressSettingsDay = () => {
        router.push("../settingsHours");
    };
    const onPressSettingsPrice = () => {
        //deleteAll();
        //selectTable();
        router.push("../settingsPrice");
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={onPressSettingsDay}>
                    <Text style={styles.text}>Настроить количество рабочих часов в месяц</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onPressSettingsPrice}>
                    <Text style={styles.text}>Настроить стоимость годин работы по умолчанию</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default SettingMain;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        paddingTop: 20,
    },
    text: {
        color: "#ccc",
        fontSize: 16,
        lineHeight: 30,
    },
    button: {
        backgroundColor: "#14171c",
        alignItems: "center",
        padding: 20,
        marginVertical: 10,
        borderRadius: 15,
    },
});
