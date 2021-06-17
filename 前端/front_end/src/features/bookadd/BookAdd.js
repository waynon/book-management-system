import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {useDispatch} from "react-redux";
import Snackbar from '../snackbar/Snackbar'
import {change} from "../snackbar/snackbarSlice";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
    },
}));
export default function OutlinedTextFields() {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        name: '',
        price: '',
    });
    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value});
    };
    const dispatch = useDispatch();
    const onSubmit = async e => {
        e.preventDefault()
        let url = 'http://localhost:8000/api/book/'
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...values}),
            credentials: 'include',
        })
            .then(() => {
                dispatch(change({
                    'open': true,
                    'success': true,
                }))
            })
            .catch(e => {
                dispatch(change({
                    'open': true,
                    'success': false,
                }))
            });
    }
    return (
        <React.Fragment>
            <form className={classes.container} noValidate autoComplete="off" onSubmit={onSubmit}>
                <Grid container direction='row' justify="flex-start" alignItems='stretch' spacing={1}>
                    <Grid item xs={12} justify="flex-start" alignItems='stretch'>
                        <Typography variant='h5' gutterBottom>
                            添加图书
                        </Typography>
                    </Grid>
                    <Grid item xs={12} justify="flex-start" alignItems='stretch'>
                        <Typography>
                            输入书名与价格以添加新图书，图书编号将自动生成
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="name"
                            label="书名"
                            className={classes.textField}
                            value={values.name}
                            onChange={handleChange('name')}
                            margin="normal"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="price"
                            label="价格"
                            className={classes.textField}
                            value={values.price}
                            type="number"
                            onChange={handleChange('price')}
                            margin="normal"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} alignItems='flex-start'>
                        <Button type='submit' variant="contained" color="primary" className={classes.button}>
                            添加
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Snackbar/>
        </React.Fragment>
    );
}
