import React, { useState, useEffect, useRef } from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useFocusEffect } from "@react-navigation/native";
import PagerView from "react-native-pager-view";
import { useSQLiteContext } from "expo-sqlite";

const tableDate = "date";
const tableObject = "object";

export default function MainScreen2() {
    const db = useSQLiteContext();
    const [dataJoin, setDataJoin] = useState([]);

    const router = useRouter();

    useFocusEffect(
        React.useCallback(() => {
            // Сохраните текущую ориентацию
            const changeOrientation = async () => {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
                // console.log("Orientation changed to LANDSCAPE");
                getDataJoin();
            };

            changeOrientation();

            // Возвращаем функцию для сброса ориентации при потере фокуса
            return async () => {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
                //console.log("Orientation changed back to PORTRAIT");
            };
        }, [])
    );

    //масив існуючих об'єктів
    const getObjects = (data) => {
        let object = ["KONTRAKT/DATA"]; //  title
        // 7 day  //
        data.forEach((item) => {
            // 1 day
            item.objects.forEach((el) => {
                if (el.object !== null && el.object !== "" && el.time) object = [...object, el.object];
                // if (el.time1 && el.time2) a = [...a, (new Date(el.time2) - new Date(el.time1)) / 1000 / 60 / 60];
                //if (el.time) a = [...a, el.time];
            });
        });
        return [...new Set(object)];
    };

    //масив годин
    const getTable = (data) => {
        let timeWeek = []; //масив з датами
        const objects = getObjects(data); //масив об'єктів
        let index = objects.length - 1;
        let maxKey = 0;
        const strDay = (date) => new Date(date).toLocaleDateString();

        // 7 day   знаходимо існуючі години //перебираємо по дням
        data.forEach((item) => {
            let timeDay = []; //масив об'єктів різниці годин в день
            let maxTime = -Infinity; //max година за день
            let minTime = Infinity; //min година за день
            let summ = 0; //сума годин в день
            if (!timeDay.length) timeDay = [...timeDay, { 0: strDay(item.date) }]; //1-шим елем-м запис. дату(об'єкт)
            // 1 day  //шукаєм робочі години і присвоюємо індекс відповідно до об'єкта
            item.objects.forEach((el) => {
                if (el.time) {
                    index++;
                    let flag = false;
                    if (objects.includes(el.object)) {
                        flag = objects.indexOf(el.object);
                        if (index !== flag) index--;
                    }

                    timeDay = [...timeDay, { [flag ? flag : index]: el.time }];
                    summ += el.time;
                    if (index > maxKey) maxKey = index;
                    if (new Date(el.time1) < minTime) minTime = new Date(el.time1);
                    if (new Date(el.time2) > maxTime) maxTime = new Date(el.time2);
                }
            });
            if (summ === 0) summ = "";
            summ = { summ: summ };
            minTime === Infinity ? (minTime = "") : (minTime = new Date(minTime).toLocaleTimeString("ru", { hour: "numeric", minute: "2-digit" }));
            maxTime === -Infinity ? (maxTime = "") : (maxTime = new Date(maxTime).toLocaleTimeString("ru", { hour: "numeric", minute: "2-digit" }));
            let minMaxTime = { time: minTime + " - " + maxTime };

            timeDay = [...timeDay, summ, minMaxTime];
            timeWeek = [...timeWeek, timeDay]; //масив з датами
        });

        //стовбець об'єктів
        let colObjects = Array(maxKey + 5).fill("");
        colObjects = colObjects.map((_, i) => {
            let text = "";
            if (i < objects.length) text = objects[i];
            if (i === colObjects.length - 1) text = "SUMA GODZIN";
            if (i === colObjects.length - 2) text = "CZAS PRACY";
            return text;
        });

        // weekNew = [...weekNew, colObjects];
        // console.log(weekNew);

        //стовбець дати
        timeWeek = timeWeek.map((item, index) => {
            let timeWeekNew = Array(maxKey + 5).fill(0); //    [{"0": "понедельник"}, {"1": 8} , {"4": 4.5}]

            const timeNew = timeWeekNew.map((_, i) => {
                let text = "";
                item.forEach((el) => {
                    if (i in el) text = el[i];
                });
                if (i === timeWeekNew.length - 2) {
                    item.forEach((el) => {
                        if ("time" in el) text = el["time"];
                    });
                }
                if (i === timeWeekNew.length - 1) {
                    item.forEach((el) => {
                        if ("summ" in el) text = el["summ"];
                    });
                }
                return text;
            });
            return timeNew;
        });
        //weekNew = [...weekNew, ...timeWeek];log

        timeWeek = [colObjects, ...timeWeek];

        return timeWeek;
    };

    const getDataJoin = async () => {
        try {
            const [allRowsDate, allRowsObject] = await Promise.all([
                db.getAllAsync(`SELECT * FROM ${tableDate}`),
                db.getAllAsync(`SELECT * FROM ${tableObject}`),
            ]);

            const data = allRowsDate.map((item) => {
                const filtr = allRowsObject
                    .filter((f) => f.id_parents === item.id)
                    .map((obj) => {
                        let time = null;
                        obj.time1 && obj.time2 ? (time = (new Date(obj.time2) - new Date(obj.time1)) / 1000 / 60 / 60) : (time = null);
                        return { ...obj, time: time };
                    });
                return { ...item, objects: filtr };
            });
            const weekNum = (date) => new Date(date).getDay();
            let dataDay = data.map((item) => {
                return { ...item, day: weekNum(item.date) };
            });
            let firstDate = new Date(dataDay[0].date);
            let lastDate = new Date(dataDay[dataDay.length - 1].date);
            let shiftLastDateDay = dataDay[dataDay.length - 1].day !== 0 ? dataDay[dataDay.length - 1].day : 7;
            let shiftFirstDateDay = dataDay[0].day !== 0 ? dataDay[0].day : 7;
            for (let i = shiftLastDateDay; i < 7; i++) {
                lastDate.setDate(lastDate.getDate() + 1);
                let dateForSql = lastDate.toISOString().slice(0, 10).replace("T", " ");
                dataDay = [
                    ...dataDay,
                    {
                        date: dateForSql,
                        day: i !== 6 ? i + 1 : 0,
                        objects: [{ object: null, time: null, time1: null, time2: null }],
                    },
                ];
            }
            for (let i = shiftFirstDateDay; i > 1; i--) {
                firstDate.setDate(firstDate.getDate() - 1);
                let dateForSql = firstDate.toISOString().slice(0, 10).replace("T", " ");
                dataDay = [
                    {
                        date: dateForSql,
                        day: i - 1,
                        objects: [{ object: null, time: null, time1: null, time2: null }],
                    },
                    ...dataDay,
                ];
            }

            function splitWeek(arr) {
                const result = [];
                let temp = [];

                arr.forEach((num) => {
                    if (num.day === 1 && temp.length > 0) {
                        result.push(temp);
                        temp = [];
                    }
                    temp.push(num);
                });

                if (temp.length > 0) {
                    result.push(temp);
                }

                return result;
            }
            const datass = splitWeek(dataDay);

            const datas = datass.map((item) => getTable(item));

            setDataJoin(datas);
        } catch (error) {
            console.log("Error while loading table dataJoin : ", error);
        }
    };

    useEffect(() => {
        getDataJoin();
    }, []);

    const onPress = () => {};

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: "#fff" }]}>
            <View style={styles.container}>
                {dataJoin.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator color="blue" size="large" />
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <PagerView style={styles.container} initialPage={dataJoin.length - 1}>
                        {dataJoin.map((item, index) => (
                            <View style={styles.page} key={index}>
                                <Table data={item} />

                                {/* <TouchableOpacity style={styles.button} onPress={onPress}>
                                <Text style={styles.text}></Text>
                            </TouchableOpacity> */}
                            </View>
                        ))}
                    </PagerView>
                )}
            </View>
        </SafeAreaView>
    );
}

const Table = ({ data }) => {
    const transposedData = data[0].map((_, colIndex) => data.map((row) => row[colIndex])).flat();

    return (
        <View style={styles.table}>
            <FlatList
                numColumns={8}
                data={transposedData}
                renderItem={({ item, index }) => <Item item={item} index={index} />}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};
const Item = ({ item, index }) => {
    const flex = index % 8 === 0 ? 5 : 3;
    return (
        <View style={[styles.cell, { flex }]}>
            <Text style={styles.textTable} adjustsFontSizeToFit numberOfLines={1}>
                {item}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    page: {
        justifyContent: "space-between",
        flexDirection: "row",
    },
    table: {
        flex: 1,
        //flexDirection: "row",
        margin: 5,
    },
    cell: {
        borderWidth: 1,
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    textTable: {
        textAlign: "center",
        fontSize: 16,
    },
    button: {
        backgroundColor: "#9ca2a6",
        margin: 20,
        borderRadius: 10,
        marginTop: 150,
        marginRight: 50,
        width: 50,
        height: 50,
    },
    text: {
        fontSize: 26,
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 20,
        color: "red",
    },
});
