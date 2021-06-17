import {createSlice} from "@reduxjs/toolkit";

const snackbarSlice = createSlice({
    name: 'snackbar',
    initialState: {
        open: false,
        success: true
    },
    reducers: {
        change: (state, action) => {
            state.open = action.payload['open']
            state.success = action.payload['success']
        },
        close: state => {
            state.open = false
        }
    }
});
export const {change, close} = snackbarSlice.actions;

export default snackbarSlice.reducer;
