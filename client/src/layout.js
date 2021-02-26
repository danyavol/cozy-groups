import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./layout.css";
import logo from "./Logo.svg"
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";

function Layout() {
    return (
        <div id='wrap'>
            <header>
                <ControlsContainer />
                <LogoContainer />
            </header>
            <main>
                <App />
            </main>
            <footer>
            </footer>
        </div>
    )
}


function LogoContainer() {
    return (
        <div id="logo-container">
            <a href="/"><img id="logo" src={logo} alt="logo"/></a>
            <h1 id="label">CozyGroups</h1>
        </div>
    )
}

function ControlsContainer() {
    return (
        <div id="controls-container">
            <HomePageButton />
            <LoginPageButton />
        </div>
    )
}

class HomePageButton extends React.Component {
    onclick () {
        window.location.assign('/');
    }

    render() {
        return (<button
                className='control-btn'
                onClick={(e) => this.onclick(e)}>Home</button>)
    }
}

class LoginPageButton extends React.Component {
    onclick () {
        window.location.assign('/login');
    }

    render() {
        return (<button
            className='control-btn'
            onClick={(e) => this.onclick(e)}>Login</button>)
    }
}



export default Layout;