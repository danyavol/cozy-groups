import React, { Component, Fragment } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import Home from '../pages/home/home.js';
import Login from '../pages/login/login.js';
import Register from '../pages/register/register.js';
import Error from '../pages/notFound/404.js'
import Header from './header/header.js';
import AddGroups from '../pages/groups/addGroups.js';

import './App.css';

import 'semantic-ui-css/semantic.min.css'
import axios from "axios";


class App extends Component {

    constructor() {
        super();
        this.state = {
            token: null,
            myGroups: []
        }

        this.updateToken = this.updateToken.bind(this);
    }

    componentDidMount() {
        this.setState( {token: localStorage.getItem('token')} );

        axios.get('http://localhost:8080/groups/')
            .then(response => {
                if (response.data.ok) {
                    let groups = response.data;
                    let myGroups = [];
                    groups.forEach(group => {
                        if (group.authorization === this.state.token)
                            myGroups.push(group);
                    });

                    this.setState(this.state.myGroups = myGroups);
                }
            });
    }
    
    render() {
        return (
            <Fragment>
                <Router>
                    <Header updateToken={this.updateToken} token={this.state.token} myGroups={this.state.myGroups} />
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
                        <Route path ="/add-group">
                            <AddGroups />
                        </Route>
                        <Route to="/*">
                            <Error />
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
