import React, { Component, Fragment } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {Link, useRouteMatch, withRouter} from "react-router-dom";

import Home from '../pages/home/home.js';
import Login from '../pages/login/login.js';
import Register from '../pages/register/register.js';
import Error from '../pages/notFound/404.js'
import Header from './header/header.js';
import AddGroups from '../pages/groups/addGroups.js';
import Group from '../pages/groups/group';

import './App.css';

import 'semantic-ui-css/semantic.min.css'
import axios from "axios";


class App extends Component {

    constructor() {
        super();
        this.state = {
            token: null,
            Groups: [],

            loading: false
        }

        this.updateToken = this.updateToken.bind(this);
        this.updateGroups = this.updateGroups.bind(this);
        this.deleteToken = this.deleteToken.bind(this);
    }

    componentDidMount() {
        this.setState( {token: localStorage.getItem('token')} );


    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.state.token !== prevState.token) && this.state.token !== null) {
            this.setState({loading: true});
            axios.get('http://localhost:3080/groups/', {
                headers: {
                    'Authorization': this.state.token
                }
            })
                .then(response => {
                    console.log(response);
                    if (response.data.ok) {
                        this.setState({
                            Groups: response.data.groups,
                            loading: false
                        })
                    }
                })
                .catch(err => {
                    this.deleteToken(err);
                })
        }
        console.log(this.state.Groups, 'app.js');
    }

    render() {
        return (
            <Fragment>
                <Router>
                    <Header 
                        updateToken={this.updateToken}
                        deleteToken={this.deleteToken}
                        token={this.state.token} 
                        myGroups={this.state.Groups} 
                        loading={this.state.loading} 
                    />
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
                                <AddGroups 
                                    updateGroups={this.updateGroups} 
                                    deleteToken={this.deleteToken}
                                    token={this.state.token} 
                                    myGroups={this.state.Groups} 
                                />
                            </Route>
                            <Route path="/groups/:id" component={Group} />
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

    deleteToken(error) {
        if(error.response.status === 401) {
            localStorage.removeItem('token');
            this.updateToken(null);
        }
    }

    updateGroups(value) {
        let groups = this.state.Groups;
        groups.push(value);
        this.setState({Groups : groups});
    }
}

export default App;
