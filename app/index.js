import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useSQLiteContext } from "expo-sqlite";
import PagerView from "react-native-pager-view";
import { AntDesign } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSelector, useDispatch } from "react-redux";
import ObjectInput from "../components/screen1/ObjectInput";
import ModalDelete from "../components/screen1/ModalDelete";
import { update_number_of_days } from "../redux/dataSlice";

const tableDate = "date";
const tableTime = "settime";
const tableObject = "object";
const tablePrice = "price";

const Content = () => {
    const db = useSQLiteContext();
    const [dataJoin, setDataJoin] = useState([]);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const pagerRef = useRef(null);
    const idRef = useRef(null);

    const number_of_days = useSelector((state) => state.data.number_of_days);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(update_number_of_days(!number_of_days));
    }, [dataJoin]);

    const getDataJoin = async () => {
        try {
            // const allRowsJoin = await db.getAllAsync(`SELECT  *
            // FROM date
            // INNER JOIN object ON object.id_parents = date.id;`);
            // const allRowsDate = await db.getAllAsync(`SELECT * FROM ${tableDate}`);
            // const allRowsObject = await db.getAllAsync(`SELECT * FROM ${tableObject}`);
            const [allRowsDate, allRowsObject] = await Promise.all([
                db.getAllAsync(`SELECT * FROM ${tableDate}`),
                db.getAllAsync(`SELECT * FROM ${tableObject}`),
            ]);
            const data = allRowsDate.map((item) => {
                const filtr = allRowsObject
                    .filter((f) => f.id_parents === item.id)
                    .map((obj) => {
                        return { id: obj.id, object: obj.object, time1: obj.time1, time2: obj.time2 };
                    });
                return { ...item, objects: filtr };
            });
            setDataJoin(data);
        } catch (error) {
            console.log("Error while loading table object : ", error);
        }
    };

    const deleteAll = async () => {
        try {
            await db.runAsync("DROP TABLE object");
            await db.runAsync("DROP TABLE date");
            await getDataJoin();
        } catch (error) {
            console.log("Error while deleting all the students : ", error);
        }
    };

    const deleteObject = async (id) => {
        try {
            await db.runAsync(
                `DELETE  FROM object WHERE id = (SELECT MAX(id) FROM object  WHERE id_parents = ${id}) AND (SELECT COUNT(*) FROM object WHERE id_parents = ${id}) > 1`
            );
            await getDataJoin();
        } catch (error) {
            console.log("Error while deleting the student : ", error);
        }
    };

    const updateObject = async (id, object) => {
        try {
            await db.runAsync(`UPDATE ${tableObject} SET  object = ? WHERE id = ?`, [object, id]);
            await getDataJoin();
        } catch (error) {
            console.log("Error while updating object");
        }
    };

    const updateTime = async (id, time, column) => {
        try {
            await db.runAsync(`UPDATE ${tableObject} SET  ${column} = ? WHERE id = ?`, [time, id]);
            await getDataJoin();
        } catch (error) {
            console.log("Error while updating object");
        }
    };

    const addObject = async (id, object) => {
        const statement = await db.prepareAsync(
            `INSERT INTO ${tableObject} (object, id_parents) SELECT ?,? WHERE (SELECT COUNT(*) FROM ${tableObject} WHERE id_parents = ${id}) < 4`
        );

        try {
            await statement.executeAsync([object, id]);
            await getDataJoin();
        } catch (error) {
            console.log("Error while adding object : ", error);
        } finally {
            await statement.finalizeAsync();
        }
    };

    useEffect(() => {
        getDataJoin();
    }, []);

    const selectedDate = (date) => {
        const index = dataJoin.findIndex((item) => item.date === date);
        pagerRef.current.setPage(index);
    };

    const weekday = (date) => new Date(date).toLocaleDateString("ru", { weekday: "long" });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                {dataJoin.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator color="blue" size="large" />
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <PagerView style={styles.container} initialPage={dataJoin.length - 1} ref={pagerRef}>
                        {dataJoin.map((el, index) => (
                            <ScrollView key={index}>
                                <View style={styles.page}>
                                    <View style={styles.iconsContent}>
                                        <AntDesign
                                            name="pluscircleo"
                                            size={24}
                                            color="blue"
                                            onPress={() => {
                                                addObject(el.id, "");
                                            }}
                                            style={styles.icon}
                                        />

                                        <SelectDate selectedDate={selectedDate} />
                                        <AntDesign
                                            name="minuscircleo"
                                            size={24}
                                            color="blue"
                                            onPress={() => {
                                                idRef.current = el.id;
                                                console.log(el.id);
                                                setVisibleDelete(true);
                                            }}
                                            style={styles.icon}
                                        />
                                    </View>
                                    <ModalDelete
                                        deleteObject={deleteObject}
                                        idObject={idRef.current}
                                        setVisibleDelete={setVisibleDelete}
                                        visibleDelete={visibleDelete}
                                    />

                                    {new Date(el.date).toLocaleDateString() === new Date().toLocaleDateString() ? (
                                        <Text style={[styles.text, { color: "#ffffff" }]}>дисяй</Text>
                                    ) : null}

                                    <Text
                                        style={[
                                            styles.text,
                                            { color: weekday(el.date) == "воскресенье" ? "red" : weekday(el.date) == "суббота" ? "#f5895b" : "#ccc" },
                                        ]}
                                    >
                                        {weekday(el.date)}
                                    </Text>
                                    <Text style={styles.text}>{new Date(el.date).toLocaleDateString()}</Text>
                                    {el.objects.map((element, index) => (
                                        <ObjectInput el={el} updateObject={updateObject} updateTime={updateTime} key={index} i={index} />
                                    ))}
                                    <View style={styles.container}>
                                        <Text style={styles.text}></Text>
                                    </View>
                                </View>
                            </ScrollView>
                        ))}
                    </PagerView>
                )}
            </View>
        </SafeAreaView>
    );
};

const SelectDate = ({ selectedDate: selectedDate }) => {
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleConfirm = (date) => {
        setDatePickerVisible(false);
        const dateLocal = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10).replace("T", " ");
        selectedDate(dateLocal);
    };
    return (
        <>
            <SimpleLineIcons name="magnifier" size={28} color="blue" style={styles.icon} onPress={showDatePicker} />
            <DateTimePickerModal isVisible={datePickerVisible} mode="date" onConfirm={handleConfirm} onCancel={hideDatePicker} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    page: {
        justifyContent: "center",
    },
    text: {
        fontSize: 26,
        textAlign: "center",
        marginBottom: 20,
        color: "#ccc",
    },
    icon: {
        margin: 10,
        padding: 10,
    },
    iconsContent: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

export default Content;
