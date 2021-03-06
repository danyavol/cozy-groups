import React, { Component } from 'react';
import {Link, useRouteMatch} from "react-router-dom";
import "./header.css";

import { Icon } from 'semantic-ui-react';

class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {
            token: null
        };
    }

    render() {
        return (
            <header>
                <div className="logo">
                    <img src="/images/logo.svg" alt="site-logo" />
                    <h2>COZY GROUPS</h2>
                </div>
                <ul>
                    <MenuLink
                        activeOnlyWhenExact={true}
                        to="/"
                        label="Главная"
                        iconName="home"
                    />
                    <MenuLink
                        to="/login"
                        label="Войти"
                        iconName="sign-in"
                        hidden={this.state.token ? true : false}
                    />
                    <MenuLink
                        to="/register"
                        label="Регистрация"
                        iconName="unlock alternate"
                        hidden={this.state.token ? true : false}
                    />
                </ul>
            </header>
        );
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            console.log('did update');
            this.setState({token: this.props.token});
        }
    }
}

function MenuLink({ iconName, label, to, activeOnlyWhenExact, hidden }) {
    let match = useRouteMatch({
        path: to,
        exact: activeOnlyWhenExact
    });

    return (
        <li className={`${hidden ? 'hidden' : ''} ${match ? "active" : ""}`}>
            <Icon name={iconName} size="big" />
            <Link to={to}>{label}</Link>
        </li>
    )
}

export default Header;