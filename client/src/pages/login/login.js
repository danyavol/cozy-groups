import React, { Component, Fragment } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            login:'',
            password:'',

            loginError: '',
            passwordError: '',

            globalErrorTitle: '',
            globalError: '',

            loading: false
        }
        this.handleLoginOnChange = this.handleLoginOnChange.bind(this);
        this.handlePasswordOnChange = this.handlePasswordOnChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hideGlobalError = this.hideGlobalError.bind(this);
    }


    render() {
        return (
            <Fragment>
                <form className="ui form attached segment padded container text" onSubmit = {this.handleSubmit} autoComplete="off">
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

                    {/*<div>*/}
                    {/*    <div className="field">*/}
                    {/*        <label>Логин</label>*/}
                    {/*        <input*/}
                    {/*            type="text"*/}
                    {/*            name="login"*/}
                    {/*            placeholder="Введите логин"*/}
                    {/*            value={this.state.login}*/}
                    {/*            onChange={this.handleLoginOnChange}*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div className="field">*/}
                    {/*    <label>Пароль</label>*/}
                    {/*    <input*/}
                    {/*        type="password"*/}
                    {/*        name="password"*/}
                    {/*        placeholder="Введите пароль"*/}
                    {/*        value={this.state.password}*/}
                    {/*        onChange={this.handlePasswordOnChange}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    {/*<button className="ui blue button" type="submit">Войти</button>*/}
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

        axios.post('http://localhost:3080/auth/login', data)
            .then(response => {
                this.setState({ loading: false });

                if (response.data.ok) {
                    localStorage.setItem('token', response.data.token);

                    this.props.updateToken(response.data.token);
                } else {
                    this.setState({
                        globalErrorTitle: 'Ошибка',
                        globalError: response.data.message
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    globalErrorTitle: 'Ошибка',
                    globalError: 'Ошибка соединения с сервером',
                    loading: false
                });
            });

        // if(this.state.login === '' || this.state.password === '') {
        //     ResponseError({
        //         label: "Ошибка",
        //         responseMessage: "Заполните недостающие поля!"
        //     });
        // } else {
        //     let data = { login : this.state.login, password : this.state.password }
        //     console.log("Form submitted.");
        //     axios.post('http://localhost:3080/login', data)
        //         .then(response => {
        //         console.log(response);
        //             if (response.data.ok) {
        //             // Все гуд, запрос прошел
        //             // Сохраняем токен в localStorage
        //             localStorage.setItem('token', response.data.token);
        //
        //             // Получаем доступ к приватной страничке с использованием этого токена
        //             let token = localStorage.getItem('token');
        //             axios.get('http://localhost:3080/secret', {headers: {'Authorization': token}}).then(response => {
        //                 console.log(response);
        //             })
        //             } else {
        //             // Ошибка авторизации. Выводим пользователю текст ошибки response.data.message
        //                 ResponseError({
        //                     label: "Ошибка",
        //                     responseMessage: response.data.message
        //                 });
        //             }
        //         });
        // }
    }

    handleLoginOnChange(event) {
        this.setState({ login : event.target.value })
    }

    handlePasswordOnChange(event) {
        this.setState({ password : event.target.value })
    }

    handleInputChange(e) {
        this.setState(
            {[e.target.name]: e.target.value},
            () => this.validateField(e.target.name, e.target.value)
        );
    }

    validateField(fieldName, value) {
        switch (fieldName) {
            case 'login':
                if (!value) {
                    this.setState({loginError: 'empty'});
                    return false;
                }
                else {
                    this.setState({loginError: null});
                    return true;
                }
            case 'password':
                if (!value) {
                    this.setState({passwordError: 'empty'});
                    return false;
                }
                else {
                    this.setState({passwordError: null});
                    return true;
                }
        }
    }
}

export default Login;