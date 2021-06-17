import {createSlice} from "@reduxjs/toolkit";

const loginFailedDialogSlice = createSlice({
    name: 'loginFailedDialog',
    initialState: {
        open: false
    },
    reducers: {
        open: state => {
            state.open = true;
        },
        close: state => {
            state.open = false;
        }
    }
});
export const {open, close} = loginFailedDialogSlice.actions;
export const selectOpen = state => state.loginFailedDialog.open;
export default loginFailedDialogSlice.reducer;
