import React, {Component, useEffect} from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {connect, useDispatch, useSelector} from "react-redux";
import {close, open, selectOpen} from "./dialogSlice";
import styles from './Login.module.css'
import {withRouter} from "react-router-dom";

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = 'http://localhost:8000/api/'

class CoreLoginPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: '',
        }
        this.change = this.change.bind(this);
    }

    change(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        return (
            <form id={styles.coreLoginPanel} onSubmit={e => {
                e.preventDefault()
                axios.post('session', {...this.state})
                    .then((res) => {
                        if (!res.data.success)
                            this.props.dispatch(open())
                        else
                            this.props.history.push("/book")
                    })
            }}>
                <span className={styles.formLabel}>用户</span>
                <input className={styles.formInput} name="username" onChange={this.change}/>
                <div className={styles.formLabel}>密码</div>
                <input className={styles.formInput} name="password" onChange={this.change}/>
                <div id={styles.formButtons}>
                    <button className={styles.formButton} type="submit">登陆</button>
                    <button className={styles.formButton} type="reset">重置</button>
                </div>
            </form>
        )
    }
}

const WrappedCoreLoginPanel = withRouter(connect()(CoreLoginPanel))
const header = (
    <div className={styles.header}>
        <img style={{display: "inline-block"}} src={require('./images/header.png')} alt="header"/>
    </div>
)
const leftPanel = (
    <div className={styles.leftPanel}/>
)
const rightPanel = (
    <div className={styles.rightPanel}/>
)
const footer = (
    <div className={styles.footer}>
        <span><img src={require('./images/down_icon.png')} alt="Footer icon"/> 版本 2012V1.0</span>
    </div>
)
export default function LoginWrapper() {
    useEffect(() => {
            document.body.style = 'min-height: 100vh;background: linear-gradient(to bottom, rgba(229, 246, 207, 1), rgba(255, 255, 255, 1) 53%,rgba(109, 170, 32, 1) 47%,rgba(162, 217, 98, 1));';
            return () => document.body.style = ''
        }
    );
    return (
        <>
            <div id={styles.rootContainer}>
                <div id={styles.container}>
                    {header}
                    {leftPanel}
                    <WrappedCoreLoginPanel/>
                    {rightPanel}
                    {footer}
                </div>
            </div>
            <AlertDialog/>
        </>
    );
}

function AlertDialog() {
    const dispatch = useDispatch()
    const handleClose = () => {
        dispatch(close())
    };
    return (
        <div>
            <Dialog
                open={useSelector(selectOpen)}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"登陆错误"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        输入的密码或用户名不正确
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        关闭
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
