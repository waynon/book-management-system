import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import {amber, green} from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import {makeStyles} from '@material-ui/core/styles';
import {connect} from "react-redux";
import {close} from "./snackbarSlice";

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};
const useStyles1 = makeStyles(theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
}));

function MySnackbarContentWrapper(props) {
    const classes = useStyles1();
    const {className, message, onClose, variant, ...other} = props;
    const Icon = variantIcon[variant];
    return (
        <SnackbarContent
            className={clsx(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)}/>
                    {message}
        </span>
            }
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                    <CloseIcon className={classes.icon}/>
                </IconButton>,
            ]}
            {...other}
        />
    );
}

MySnackbarContentWrapper.propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
};
const mapStateToProps = state => ({
    open: state.snackbar.open,
    success: state.snackbar.success
})
const mapDispatchToProps = dispatch => ({
    close: () => dispatch(close())
})
export default connect(mapStateToProps, mapDispatchToProps)(
    function CustomizedSnackbars({open, close, success}) {
        function handleClose(event, reason) {
            if (reason === 'clickaway') {
                return;
            }
            close();
        }

        return (
            <div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={open}
                    autoHideDuration={2000}
                    onClose={handleClose}
                >
                    {
                        success ? <MySnackbarContentWrapper
                            onClose={handleClose}
                            variant="success"
                            message="操作成功"
                        /> : <MySnackbarContentWrapper
                            variant="error"
                            message="操作失败"
                        />
                    }
                </Snackbar>
            </div>
        );
    }
)
