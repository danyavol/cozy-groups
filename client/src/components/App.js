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

    constructor() {
        super();
        this.state = {
            token: null
        }

        this.updateToken = this.updateToken.bind(this);
    }

    componentDidMount() {
        this.setState( {token: localStorage.getItem('token')} );
    }
    
    render() {
        return (
            <Fragment>
                <Router>
                    <Header token={this.state.token} />
                    <main>
                        <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route path="/login">
                            <Login updateToken={this.updateToken} />
                        </Route>
                        <Route path = "/register">
                            <Register updateToken={this.updateToken} />
                        </Route>
                        </Switch>
                    </main>
                </Router>
            </Fragment>
        );
    }

    updateToken(value) {
        console.log(123, value);
        this.setState({token: value});
    }
}

export default App;
