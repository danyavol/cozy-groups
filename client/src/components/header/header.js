import React, { Component } from 'react';
import { Link } from "react-router-dom";
import "./header.css";

class Header extends Component {

    render() {
        return (
            <header>
                <ul>
                    <li>
                        <Link to="/">Главная</Link>
                    </li>
                    <li>
                        <Link to="/login">Войти</Link>
                    </li>
                    <li>
                        <Link to="/register">Регистрация</Link>
                    </li>
                </ul>
            </header>
        );
    }
}

export default Header;
