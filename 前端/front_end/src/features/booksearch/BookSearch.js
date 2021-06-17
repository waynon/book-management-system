import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '../snackbar/Snackbar'
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Grid from "@material-ui/core/Grid";
import MaterialTable from "material-table";

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
    root: {
        width: 300,
    },
}));
const ResultTable = ({values}) => (
    <div style={{maxWidth: "100%"}}>
        <MaterialTable
            title="搜索结果"
            columns={[
                {title: "图书编号", field: "id", editable: 'never'},
                {title: "书名", field: "name"},
                {title: "价格", field: "price", type: "numeric"},
            ]}
            data={values.tableData}
            editable={{
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                        const url = `http://localhost:8000/api/book/${oldData.id}/`
                        fetch(url, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(newData),
                            credentials: 'include',
                        })
                            .then(() => {
                                resolve()
                            })
                    }),
                onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                        let bookId = values.tableData[oldData.tableData.id].id
                        let url = `http://localhost:8000/api/book/${bookId}/`
                        fetch(url, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'same-origin',
                        })
                            .then(() => {
                                resolve()
                            })
                    }),
            }}
            options={{
                search: false,
                paging: false,
            }}
            localization={{
                header: {
                    actions: '操作'
                },
                body: {
                    deleteTooltip: '删除',
                    editRow: {
                        deleteText: '你确定要删除这一行吗？',
                        cancelTooltip: '取消',
                        saveTooltip: '保存',
                    },
                    editTooltip: '编辑',
                },
                pagination: {
                    labelRowsSelect: '行',
                    firstTooltip: '第1页',
                    previousTooltip: '上1页',
                    nextTooltip: '下一页',
                    lastTooltip: '最后1页'
                }
            }}
        />
    </div>)
export default function OutlinedTextFields() {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        id: '',
        name: '',
        price: [0, 200],
        tableData: null,
    });
    const handleChange = name => (event, newValue) => {
        if (name === 'price') {
            setValues({...values, [name]: newValue})
            return
        }
        setValues({...values, [name]: event.target.value});
    };
    const onSubmit = e => {
        e.preventDefault()
        new Promise((resolve, reject) => {
            let url = 'http://localhost:8000/api/search?'
            url += 'id=' + values.id
            url += '&name=' + values.name
            url += '&price_lower_bound=' + values.price[0]
            url += '&price_upper_bound=' + values.price[1]
            fetch(url)
                .then(response => response.json())
                .then(result => resolve(result)
                )
        })
            .then(data => setValues({...values, tableData: data}))
    }
    return (
        <React.Fragment>
            <form className={classes.container} noValidate autoComplete="off" onSubmit={onSubmit}>
                <Grid container spacing={1} justify='center'>
                    <Grid item xs={12}>
                        <Typography variant='h5' gutterBottom>
                            图书搜索
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>
                            输入图书的检索条件，留空的项将不作为过滤条件
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="id"
                            label="图书编号"
                            className={classes.textField}
                            value={values.id}
                            onChange={handleChange('id')}
                            margin="normal"
                            variant="outlined"
                        />
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
                    <Grid item xs={4}>
                        <Typography id="range-slider" gutterBottom>
                            价格区间
                        </Typography>
                        <Slider
                            value={values.price}
                            onChange={handleChange('price')}
                            valueLabelDisplay="auto"
                            step={5}
                            max={200}
                            aria-labelledby="range-slider"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type='submit' variant="contained" color="primary" className={classes.button}>
                            搜索
                        </Button>
                    </Grid>
                </Grid>
            </form>
            {values.tableData ? <ResultTable values={values}/> : null}
            <Snackbar/>
        </React.Fragment>
    );
}
