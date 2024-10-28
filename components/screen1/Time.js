import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity, TextInput } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const Time = ({ updateTime, time, column, el, i }) => {
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => (time ? new Date(time) : new Date(2024, 10, 10, 0, 0)));

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = (date) => {
        setDatePickerVisible(false);
    };

    const handleConfirm = (date) => {
        setSelectedDate(date);
        hideDatePicker(date);
        const timeForSql = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 19).replace("T", " ");
        updateTime(el.objects[i].id, timeForSql, column);
        setDatePickerVisible(false);
    };
    return (
        <View>
            <TouchableOpacity style={styles.buttonTime} onPress={showDatePicker}>
                <Text style={[styles.text, { color: time ? "green" : "#888" }]}>
                    {selectedDate.toLocaleTimeString("ru", { hour: "numeric", minute: "2-digit" })}
                </Text>
            </TouchableOpacity>

            <DateTimePickerModal
                date={selectedDate}
                isVisible={datePickerVisible}
                mode="time"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                is24Hour
            />
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 26,
        textAlign: "center",
        marginTop: 20,
        color: "green",
    },
    buttonTime: {
        backgroundColor: NaN,
        marginHorizontal: 20,
    },
});

export default Time;
