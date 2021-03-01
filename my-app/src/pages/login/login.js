import React, { Component, Fragment } from 'react';

class Login extends Component {
    render() {
        return (
            <Fragment>
                <h2>Login page</h2>
                <form>
                    <input type = "text" placeholder = "Input login." />
                    <input type = "text" placeholder = "Input password." />
                    <input type = "submit" placeholder= "Войти." />
                </form>
            </Fragment>
        );
    }
}

export default Login;
