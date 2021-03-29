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
import GroupsList from '../pages/groups/groupsList.js'

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
        this.updateDeleteGroups=this.updateDeleteGroups.bind(this);
        this.clearGroups=this.clearGroups.bind(this);
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
    }

    render() {
        return (
            <Fragment>
                <Router>
                    <Header 
                        updateToken={this.updateToken}
                        deleteToken={this.deleteToken}
                        updateGroups={this.updateGroups}
                        clearGroups={this.clearGroups}
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
                                    clearGroups={this.clearGroups}
                                    deleteToken={this.deleteToken}
                                    token={this.state.token} 
                                    myGroups={this.state.Groups} 
                                />
                            </Route>
                            <Route path="/groups/:id"
                                   render={(props) => (
                                       <Group
                                           {...props}
                                           token={this.state.token}
                                           updateDeleteGroups={this.updateDeleteGroups}
                                           clearGroups={this.clearGroups}
                                           deleteToken={this.deleteToken}
                                       />)}
                            />
                            <Route path="/groups/:id" component={Group} />
                            <Route path="/groups">
                                <GroupsList
                                    token={this.state.token}
                                    myGroups={this.state.Groups}
                                    loading={this.state.loading}
                                 />
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

    deleteToken(error) {
        if(error.response.status === 401) {
            localStorage.removeItem('token');
            this.props.clearGroups();
            this.updateToken(null);
        }
    }

    updateDeleteGroups(value) {
        let groups = this.state.Groups;
        let index =groups.indexOf(groups.find(group => group.id === value));
        groups.splice(index,1);
        this.setState({Groups:groups});
    }
    updateGroups(value) {
        let groups = this.state.Groups;
        groups.push(value);
        this.setState({Groups : groups});
    }
    clearGroups() {
        this.setState({Groups : []})
    }
}

export default App;
