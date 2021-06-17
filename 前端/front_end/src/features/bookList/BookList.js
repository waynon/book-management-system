import React, {Component} from "react";
import MaterialTable from "material-table";

class BookList extends Component {
    render() {
        let data
        return (
            <div style={{maxWidth: "100%"}}>
                <MaterialTable
                    title="书籍列表"
                    columns={[
                        {title: "图书编号", field: "id", editable: 'never'},
                        {title: "书名", field: "name"},
                        {title: "价格", field: "price", type: "numeric"},
                    ]}
                    data={query =>
                        new Promise((resolve, reject) => {
                            let url = 'http://localhost:8000/api/books?'
                            url += 'per_page=' + query.pageSize
                            url += '&page=' + (query.page + 1)
                            fetch(url)
                                .then(response => response.json())
                                .then(result => {
                                    data = result.data
                                    resolve({
                                        data: result.data,
                                        page: result.page - 1,
                                        totalCount: result.total,
                                    })
                                })
                        })
                    }
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
                                let bookId = data[oldData.tableData.id].id
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
                        pageSize: 10,
                        pageSizeOptions: [5, 10, 20, 50],
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
            </div>
        );
    }
}

export default BookList
