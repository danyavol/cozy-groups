import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Link, withRouter } from "react-router-dom";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',

            loginError: '',
            passwordError: '',

            globalErrorTitle: '',
            globalError: '',

            loading: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hideGlobalError = this.hideGlobalError.bind(this);
    }

    changeRoute(path) {
        this.props.history.push(path)
    }

    componentDidMount() {
        document.title = "Авторизация";
    }

    render() {
        return (
            <Fragment>
                <form className="ui form attached segment padded container text" onSubmit={this.handleSubmit} autoComplete="off">
                    <h2 className="ui header">Авторизация</h2>

                    <div className={`ui negative message ${this.state.globalError ? '' : 'hidden'}`}>
                        <i className="close icon" onClick={this.hideGlobalError}></i>
                        <div className="header">{this.state.globalErrorTitle}</div>
                        <p>{this.state.globalError}</p>
                    </div>

                    <div className={`field required ${this.state.loginError ? 'error' : ''}`}>
                        <label>Логин</label>
                        <input
                            type="text"
                            name="login"
                            placeholder="Введите логин"
                            value={this.state.login}
                            onChange={this.handleInputChange}
                        />
                        <div className={`ui basic red pointing prompt label ${this.state.loginError === 'empty' ? 'visible' : 'hidden'}`}>Введите логин</div>
                    </div>

                    <div className={`field required ${this.state.passwordError ? 'error' : ''}`}>
                        <label>Пароль</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Введите пароль"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                        />
                        <div className={`ui basic red pointing prompt label ${this.state.passwordError === 'empty' ? 'visible' : 'hidden'}`}>Введите пароль</div>
                    </div>

                    <button
                        className={`ui blue button ${this.state.loading ? 'loading' : ''}`}
                        type="submit"
                        disabled={this.state.loading ? 'disabled' : ''}
                    >Войти</button>


                </form>
                <div className="ui bottom attached warning message container text">
                    <i className="icon help"></i>
                    Ещё не зарегистрированы? <Link to="/register">Создать аккаунт</Link>
                </div>
            </Fragment>
        );
    }

    hideGlobalError() {
        this.setState({
            globalErrorTitle: '',
            globalError: ''
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        let isValid = true;

        if (!this.validateField('login', this.state.login)) isValid = false;
        if (!this.validateField('password', this.state.password)) isValid = false;

        if (!isValid) return;

        this.setState({ loading: true });

        let data = {
            login: this.state.login,
            password: this.state.password
        }

        this.hideGlobalError();

        axios.post('http://localhost:3080/auth/login', data)
            .then(response => {
                this.setState({ loading: false });

                if (response.data.ok) {
                    localStorage.setItem('token', response.data.token);

                    localStorage.setItem('user', JSON.stringify(response.data.user))

                    this.props.updateUser(response.data.user);

                    this.props.updateToken(response.data.token);

                    this.changeRoute('/');
                }
            })
            .catch((err) => {
                let errorText;

                if (err.response) errorText = err.response.data.message;
                else errorText = 'Ошибка соединения с сервером';

                this.setState({
                    globalErrorTitle: 'Ошибка',
                    globalError: errorText,
                    loading: false
                });

            });


    }

    handleInputChange(e) {
        this.setState(
            { [e.target.name]: e.target.value },
            () => this.validateField(e.target.name, e.target.value)
        );
    }

    validateField(fieldName, value) {
        switch (fieldName) {
            case 'login':
                if (!value) {
                    this.setState({ loginError: 'empty' });
                    return false;
                }
                else {
                    this.setState({ loginError: null });
                    return true;
                }
            case 'password':
                if (!value) {
                    this.setState({ passwordError: 'empty' });
                    return false;
                }
                else {
                    this.setState({ passwordError: null });
                    return true;
                }
            default:
                return true;
        }
    }
}

export default withRouter(Login);