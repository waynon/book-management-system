import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Login from "./features/login/Login";
import './App.css';
import Book from "./features/book/Book";

function App() {
    return (
        <div className="App">
            <Switch>
                <Route path="/" exact component={Login}/>
                <Route path="/book" component={Book}/>
                <Route from="/*" to="/"/>
            </Switch>
        </div>
    );
}

export default App;
