import {configureStore} from '@reduxjs/toolkit';
import loginFailedDialogReducer from '../features/login/dialogSlice'
import snackbarReducer from '../features/snackbar/snackbarSlice'

export default configureStore({
    reducer: {
        loginFailedDialog: loginFailedDialogReducer,
        snackbar: snackbarReducer,
    },
});
