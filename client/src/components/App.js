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

import './App.css';

import 'semantic-ui-css/semantic.min.css'

class App extends Component {
    
    onRouteChanged() {
        console.log("ROUTE CHANGED");
    }
    render() {
        return (
            <Fragment>
                <Router onChange={this.onRouteChanged}>
                    
                    <Header />
                    <main>
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
                    </main>
                </Router>
            </Fragment>
        );
    }
}

export default App;
