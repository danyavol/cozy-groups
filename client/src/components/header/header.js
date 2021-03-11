import React, {Component} from 'react';
import {Link, useRouteMatch, withRouter} from "react-router-dom";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSignInAlt, faSignOutAlt, faUnlockAlt, faUserCog} from '@fortawesome/free-solid-svg-icons';
import {faPlusSquare} from '@fortawesome/free-regular-svg-icons'

import "./header.css";
import axios from "axios";

class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {
            token: null,
            myGroups: []
        };
        this.exit = this.exit.bind(this);
        this.refreshGroups = this.refreshGroups.bind(this);
    }

    changeRoute(path) {
        this.props.history.push(path)
    }

    exit() {
        localStorage.removeItem('token');
        this.props.history.push("/")
        this.props.updateToken(null)
    }

    render() {
        return (
            <header>
                <div className="logo">
                    <img src="/images/logo.svg" alt="site-logo" onClick={() => this.changeRoute('/')} />
                    <h2 onClick={() => this.changeRoute('/')}>COZY GROUPS</h2>
                </div>
                {/* Для не авторизованных пользователей */}
                <div className={this.state.token ? 'hidden' : ''}>
                    <MenuLink
                        to="/login"
                        label="Вход"
                        icon={faSignInAlt}
                    />
                    <MenuLink
                        to="/register"
                        label="Регистрация"
                        icon={faUnlockAlt}
                    />
                </div>
                {/* Для авторизованных */}
                <div className={`header-menu ${this.state.token ? '' : 'hidden'}`}>
                    <div className="menu-top">
                        <div className="myGroups">
                            <div className="title">
                                <h3>Мои группы</h3>
                                <Link to={'/add-group'} ><FontAwesomeIcon icon={faPlusSquare} size='2x' /></Link>
                            </div>
                            <GroupsList myGroups={this.state.myGroups} />
                        </div> 
                    </div>
                    <div className="menu-bottom">
                        <MenuLink
                            to="/settings"
                            label="Настройки"
                            icon={faUserCog}
                        />
                        <MenuLink
                            click={this.exit}
                            to="/"
                            label="Выйти"
                            icon={faSignOutAlt}
                        />
                    </div>
                </div>
            </header>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            console.log('did update');
            this.setState({token: this.props.token});
        }

        if (this.props.myGroups !== prevProps.myGroups) {
            this.setState({myGroups: this.props.myGroups});
            console.log(this.state.myGroups, 'header');
        }
    }

    refreshGroups() {
        axios.get('http://localhost:3080/groups/', {
            headers: {
                'Authorization': this.state.token
            }
        })
            .then(response => {
                if (response.data.ok) {
                    this.setState(this.state.myGroups = response.data.groups);
                    console.log(this.state.myGroups);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }


}

function GroupsList(props) {
    console.log(props.myGroups);
    if (props.myGroups.length !== 0) {
        console.log('выполняется');
        const listGroups = props.myGroups.map((group) =>
            <li key={group.id}>
                <GroupsMenuLinks to={'/groups/' + group.id} label={group.name} />
            </li>
        );

        return (
            <ul id="myGroups">{listGroups}</ul>
        )
    } else {
        return (
            <h6>У вас нет групп</h6>
        )
    }
}

function MenuLink({ icon, label, to, click }) {
    let match = useRouteMatch({
        path: to,
        exact: true
    });

    return (
        <div className={`header-link ${match ? 'active' : ''}`}>
            <FontAwesomeIcon icon={icon} size='2x' />
            <h4><Link onClick={click ? click : null} to={to}>{label}</Link></h4>
        </div>
    )
}

function GroupsMenuLinks({ label, to, click }) {
    let match = useRouteMatch({
        path: to,
        exact: true
    });

    return (
        <div className={`groups-link ${match ? 'active' : ''}`}>
            <h5><Link onClick={click ? click : null} to={to}>{label}</Link></h5>
        </div>
    )
}

export default withRouter(Header);