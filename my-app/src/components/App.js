import React, { Component, Fragment } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import Home from '../pages/home/home.js';
import Login from '../pages/login/login.js';
import Register from '../pages/register/register.js';

import Header from './header/header.js';

class App extends Component {
    render() {
        return (
            <Fragment>
                <Router>
                    
                    <Header />

                    <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path = "/register">
                        <Register />
                    </Route>
                    </Switch>
                </Router>
            </Fragment>
        );
    }
}

export default App;
