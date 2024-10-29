import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSQLiteContext } from "expo-sqlite";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { update_number_of_days } from "../../redux/dataSlice";
import ModalYear from "../../components/screen4/ModalYear";

export default function SettingsDays() {
    const db = useSQLiteContext();
    const [data, setData] = useState([]);

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
            await db.runAsync("DROP TABLE settime");
        } catch (error) {
            console.log("Error while deleting all the students : ", error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {!data.length ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator color="blue" size="large" />
                    <Text>Loading...</Text>
                </View>
            ) : (
                <Content data={data} getData={getData} />
            )}
        </SafeAreaView>
    );
}

const Content = ({ data, getData }) => {
    const [visibleSelect, setVisibleSelect] = useState(false);
    const [indexOn, setIndexOn] = useState(0);
    const router = useRouter();

    const number_of_days = useSelector((state) => state.data.number_of_days);
    const dispatch = useDispatch();

    const onPressYear = (index) => {
        setIndexOn(index);
        setVisibleSelect(true);
    };
    useEffect(() => {
        dispatch(update_number_of_days(!number_of_days));
    }, [data]);

    const onPressBack = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconsContent}>
                <Ionicons style={styles.icons} onPress={onPressBack} name="chevron-back" size={32} color="#ccc" />
                <Text style={styles.textHeader}>Настроить количество рабочих часов в месяц</Text>
            </View>
            <View style={styles.container}>
                <FlatList
                    data={data}
                    renderItem={({ item, index }) => (
                        <>
                            <TouchableOpacity onPress={() => onPressYear(index)}>
                                <Text style={styles.text}>{item.year}</Text>
                            </TouchableOpacity>
                            <ModalYear visibleSelect={visibleSelect} setVisibleSelect={setVisibleSelect} getData={getData} data={data[indexOn]} />
                        </>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    text: {
        width: "100%",
        backgroundColor: "#14171c",
        fontSize: 16,
        padding: 20,
        margin: 10,
        textAlign: "center",
        alignSelf: "center",
        borderRadius: 15,
        color: "#ccc",
    },
    textHeader: {
        color: "#ccc",
        fontSize: 20,
        padding: 5,
        lineHeight: 30,
        // backgroundColor: "gray",
    },
    icons: {
        padding: 10,
        marginRight: 5,
        //backgroundColor: "gray",
    },
    iconsContent: {
        flexDirection: "row",
        margin: 10,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        alignSelf: "center",
    },
});
