import React, { Component } from 'react';
import {Link, useRouteMatch, withRouter} from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt, faUserCog, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons'

import "./header.css";

import { Icon } from 'semantic-ui-react';

class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {
            token: null,
            myGroups: []
        };
        this.exit = this.exit.bind(this);
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
                            <div id="myGroups">
                                <h5><Link to={'/'}>Название группы 1</Link></h5>
                                <h5><Link to={'/'}>Название группы 2</Link></h5>
                                {/* <h6>У вас нету групп</h6> */}
                            </div>
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

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            console.log('did update');
            this.setState({token: this.props.token});
        }
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
            <h4><Link onClick ={click ? click : null} to={to}>{label}</Link></h4>
        </div>
    )
}

export default withRouter(Header);