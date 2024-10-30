// dataSlice.js
import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
    name: "data",
    initialState: {
        restart_price: false,
        number_of_days: false,
    },
    reducers: {
        update_price: (state, action) => {
            state.restart_price = action.payload;
        },
        update_number_of_days: (state, action) => {
            state.number_of_days = action.payload;
        },
    },
});

// Експортуємо дії
export const { update_price, update_number_of_days } = dataSlice.actions;
// Експортуємо редуктор
export default dataSlice.reducer;
