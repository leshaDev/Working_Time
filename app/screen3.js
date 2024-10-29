import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useSQLiteContext } from "expo-sqlite";
import { useSelector } from "react-redux";
import AnimatedInput from "../components/screen3/AnimatedInput";
import ModalSelect from "../components/screen3/ModalSelect";

const tableDate = "date";
const tableTime = "settime";
const tableObject = "object";
const tablePrice = "price";

export default function MainScreen3() {
    const db = useSQLiteContext();
    const [dataJoin, setDataJoin] = useState([]);
    const [numberDays, setNumberDays] = useState([]);
    const [dataPrice, setDataPrice] = useState([]);

    const number_of_days = useSelector((state) => state.data.number_of_days);
    const restart_price = useSelector((state) => state.data.restart_price);

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
            setDataJoin(data);
        } catch (error) {
            console.log("Error while loading table date, object : ", error);
        }
    };

    const getNumberDays = async () => {
        try {
            const allRows = await db.getAllAsync(`SELECT * FROM ${tableTime}`);
            setNumberDays(allRows);
        } catch (error) {
            console.log("Error while loading table dataJoin : ", error);
        }
    };

    const getDataPrice = async () => {
        try {
            const allRows = await db.getAllAsync(`SELECT * FROM ${tablePrice}`);
            setDataPrice([allRows[0].time.toString(), allRows[0].overtime.toString(), allRows[0].weekend.toString()]);
        } catch (error) {
            console.log("Error while loading table dataJoin : ", error);
        }
    };

    useEffect(() => {
        getDataJoin();
        getNumberDays();
        getDataPrice();
    }, []);

    useEffect(() => {
        getDataJoin();
        getNumberDays();
    }, [number_of_days]);

    useEffect(() => {
        getDataPrice();
    }, [restart_price]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                {!dataJoin.length || !numberDays.length || !dataPrice.length ? (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator color="blue" size="large" />
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <Content dataJoin={dataJoin} numberDays={numberDays} dataPrice={dataPrice} setDataPrice={setDataPrice} />
                )}
            </View>
        </SafeAreaView>
    );
}

function Content({ dataJoin, numberDays, dataPrice, setDataPrice }) {
    const [visibleSelect, setVisibleSelect] = useState(false);
    const [month, setMonth] = useState(() => new Date(dataJoin[dataJoin.length - 1].date).toLocaleDateString("ru", { month: "long" }));
    const [year, setYear] = useState(() => new Date(dataJoin[dataJoin.length - 1].date).toLocaleDateString("ru", { year: "numeric" }));
    const [modal, setModal] = useState([]);
    const [onPressModal, setOnPressModal] = useState();
    const [data, setData] = useState([]);

    const hours = () => {
        let result = [];
        let timeDay = 0;
        let overTime = 0;
        let dayOff = 0;
        let ollTime = 0;
        let hoursMonth = numberDays.find((item) => item.month == month && item.year == year).days;
        dataJoin.forEach((item) => {
            let dataYear = new Date(item.date).getFullYear();
            let dateMonth = new Date(item.date).toLocaleDateString("ru", { month: "long" });
            let dateDay = new Date(item.date).getDay();
            if (dataYear == year && dateMonth == month) {
                if (dateDay == 0 || dateDay == 6) {
                    item.objects.forEach((el) => {
                        if (el.time) dayOff += el.time;
                    });
                } else {
                    item.objects.forEach((el) => {
                        if (el.time) timeDay += el.time;
                    });
                }
            }
        });

        overTime = timeDay > hoursMonth ? timeDay - hoursMonth : 0;
        timeDay = timeDay > hoursMonth ? hoursMonth : timeDay;
        ollTime = timeDay + overTime + dayOff;
        let sumTimeDay = timeDay * dataPrice[0];
        let sumOverTime = overTime * dataPrice[1];
        let sumDayOff = dayOff * dataPrice[2];
        let sum = sumTimeDay + sumOverTime + sumDayOff;
        let midl = sum / ollTime;

        result = [
            timeDay,
            overTime,
            dayOff,
            ollTime,
            sumTimeDay.toFixed(2),
            sumOverTime.toFixed(2),
            sumDayOff.toFixed(2),
            sum.toFixed(2),
            dataPrice[0],
            dataPrice[1],
            dataPrice[2],
            midl.toFixed(2),
        ];
        result = result.map((item) => item.toString());
        return result;
    };

    const dataMonth = () => {
        let dataMonth = [];
        dataJoin.forEach((el) => {
            if (!dataMonth.includes(new Date(el.date).toLocaleDateString("ru", { month: "long" }))) {
                dataMonth.push(new Date(el.date).toLocaleDateString("ru", { month: "long" }));
            }
        });
        return dataMonth;
    };

    const dataYears = () => {
        let dataYear = [];
        dataJoin.forEach((el) => {
            if (!dataYear.includes(new Date(el.date).toLocaleDateString("ru", { year: "numeric" }))) {
                dataYear.push(new Date(el.date).toLocaleDateString("ru", { year: "numeric" }));
            }
        });
        return dataYear;
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getData();
    }, [month, dataJoin, dataPrice, numberDays]);

    const selectData = (flag) => {
        setModal(flag ? dataYears : dataMonth);
        setOnPressModal(flag);
        setVisibleSelect(true);
    };

    function getData() {
        if (dataJoin.length && numberDays.length && dataPrice.length) {
            const t = hours(); // [useDay, overTime, weekDay, ollTime, sumDay, sumOverTime, sumWeekDay, sum];
            const columb1 = ["", "Годины", "Доп годины", "Годины по выходным", "Всего"]; //+
            const columb2 = ["цена годины", t[8], t[9], t[10], t[11]]; //+-
            const columb3 = ["количество годин", t[0], t[1], t[2], t[3]]; //-
            const columb4 = ["пьенендзе", t[4], t[5], t[6], t[7]]; //-

            let data = [];
            data = [...data, columb1, columb2, columb3, columb4];
            data = data[0].map((_, colIndex) => data.map((row) => row[colIndex])).flat();
            data = data.map((item, i) => {
                return { id: i, text: item };
            });

            setData(data);
        } else setData([]);
    }

    return (
        <>
            <View style={styles.header}>
                <Text style={styles.textHeader}>Сумма годин за </Text>
                <TouchableOpacity onPress={() => selectData(false)}>
                    <Text style={styles.textHeader}>{month}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => selectData(true)}>
                <Text style={styles.textHeader}>{year}</Text>
            </TouchableOpacity>
            {data.length == 0 ? (
                <Text>is loading...</Text>
            ) : (
                <View style={styles.table}>
                    <FlatList
                        data={data}
                        renderItem={({ item, index }) => (
                            <Item item={item} index={index} dataPrice={dataPrice} setDataPrice={setDataPrice} getData={getData} />
                        )}
                        keyExtractor={(item, index) => item.id.toString()}
                        numColumns={4} // Указываем количество столбцов
                    />
                </View>
            )}

            <ModalSelect
                visibleSelect={visibleSelect}
                setVisibleSelect={setVisibleSelect}
                data={modal}
                setMonth={setMonth}
                setYear={setYear}
                onPressModal={onPressModal}
            />
        </>
    );
}

const Item = ({ item, index, dataPrice, setDataPrice, getData }) => {
    const [value, setValue] = useState(item.text);

    const color = "#14171c";
    const flex = index % 4 === 0 ? 2 : 1;
    const rowIndex = Math.floor(index / 4);
    const backgroundColor = rowIndex % 2 === 0 ? "black" : color;

    useEffect(() => {
        setDataPrice((cena) => {
            if (index === 5) cena[0] = value;
            if (index === 9) cena[1] = value;
            if (index === 13) cena[2] = value;
            return cena;
        });
    }, [value]);
    useEffect(() => {
        if (index === 5) setValue(dataPrice[0]);
        if (index === 9) setValue(dataPrice[1]);
        if (index === 13) setValue(dataPrice[2]);
    }, [dataPrice]);

    return (
        <>
            {index % 4 !== 1 || index === 1 || index === 17 ? (
                <View style={[styles.cell, { flex, backgroundColor }]}>
                    <Text style={[styles.text]}>{item.text}</Text>
                </View>
            ) : (
                <View style={[styles.cell, { flex, backgroundColor }]}>
                    {index === 6 ? (
                        <AnimatedInput value={value} setValue={setValue} index={index} getData={getData} />
                    ) : (
                        <AnimatedInput value={value} setValue={setValue} index={index} getData={getData} />
                    )}
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
    },
    textHeader: {
        color: "#ccc",
        fontSize: 26,
        textAlign: "center",
        margin: 5,
    },
    table: {
        flex: 1,
    },

    text: {
        color: "#ccc",
        fontSize: 14,
        textAlign: "left",
        padding: 10,
    },
    cell: {
        flex: 1,
        justifyContent: "center",
    },
});
