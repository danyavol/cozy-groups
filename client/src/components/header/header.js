import React, { Component } from 'react';
import {Link, useRouteMatch} from "react-router-dom";
import "./header.css";

import { Icon } from 'semantic-ui-react';

class Header extends Component {

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
                    />
                    <MenuLink
                        to="/register"
                        label="Регистрация"
                        iconName="unlock alternate"
                    />
                </ul>
            </header>
        );
    }
}

function MenuLink({ iconName, label, to, activeOnlyWhenExact }) {
    let match = useRouteMatch({
        path: to,
        exact: activeOnlyWhenExact
    });

    return (
        <li className={match ? "active" : ""}>
            <Icon name={iconName} size="big" />
            <Link to={to}>{label}</Link>
        </li>
    )
}

export default Header;