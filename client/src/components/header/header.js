import React, { Component } from 'react';
import { Link } from "react-router-dom";
import "./header.css";

import { Icon } from 'semantic-ui-react';

class Header extends Component {

    render() {
        return (
            <header>
                <div className="logo">
                    <img src="/images/logo.svg"></img>
                    <h2>COZY GROUPS</h2>
                </div>
                <ul>
                    <li className="active">
                        <Icon name="home" size="big" />
                        <Link to="/">Главная</Link>
                    </li>
                    <li>
                        <Icon name="sign-in" size="big" />
                        <Link to="/login">Войти</Link>
                    </li>
                    <li>
                        <Icon name="unlock alternate" size="big" />
                        <Link to="/register">Регистрация</Link>
                    </li>
                </ul>
            </header>
        );
    }
}

export default Header;
