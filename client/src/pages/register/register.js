import React, { Component, Fragment } from 'react';
import { Link, withRouter } from "react-router-dom";

import axios from 'axios';

import "./register.css"

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            passRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\d\w\W]{4,}$/,
            loginRegex: /^[\w\d]{2,15}$/,
            nameRegex: /^([A-Za-z]{2,20}|[А-Яа-я]{2,20})$/,

            globalErrorTitle: '',
            globalError: '',

            login: '',
            firstName: '',
            lastName: '',
            password: '',
            passwordConfirm: '',

            loginError: '',
            firstNameError: '',
            lastNameError: '',
            passwordError: '',
            passwordConfirmError: '',

            loginErrorText: '',
            firstNameErrorText: '',
            lastNameErrorText: '',
            passwordErrorText: '',
            passwordConfirmErrorText: '',

            loading: false
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hideGlobalError = this.hideGlobalError.bind(this);
    }

    componentDidMount() {
        document.title = "Регистрация"
    }

    changeRoute(path) {
        this.props.history.push(path)
    }

    render() {
        return (
            <Fragment>
                <form onSubmit={this.handleSubmit} className="ui form attached segment padded container text" autoComplete="off">
                    <h2 className="ui header">Регистрация</h2>

                    <div className={`ui negative message ${this.state.globalError ? '' : 'hidden'}`}>
                        <i className="close icon" onClick={this.hideGlobalError}></i>
                        <div className="header">{this.state.globalErrorTitle}</div>
                        <p>{this.state.globalError}</p>
                    </div>

                    <div className={`field required ${this.state.loginError ? 'error' : ''}`}>
                        <label className="promt">
                            <div data-position="top left">
                                Логин
                            </div>
                        </label>
                        <input
                            type="text"
                            name="login"
                            placeholder="Введите логин"
                            value={this.state.login}
                            onChange={this.handleInputChange}
                        />
                        <div className={`ui basic red pointing prompt label ${this.state.loginError === 'regExp' || this.state.loginError === 'empty' ? 'visible' : 'hidden'}`}>{this.state.loginErrorText}</div>
                    </div>

                    <div className="two fields">
                        <div className={`field required ${this.state.firstNameError ? 'error' : ''}`}>
                            <label className="promt">
                                <div data-position="top left">
                                    Имя
                                </div>
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Введите имя"
                                value={this.state.firstName}
                                onChange={this.handleInputChange}
                            />
                            <div className={`ui basic red pointing prompt label ${this.state.firstNameError === 'regExp' || this.state.firstNameError === 'empty' ? 'visible' : 'hidden'}`}>{this.state.firstNameErrorText}</div>
                        </div>
                        <div className={`field ${this.state.lastNameError ? 'error' : ''}`}>
                            <label className="promt">
                                <div data-position="top left">
                                    Фамилия
                                </div>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Введите фамилию"
                                value={this.state.lastName}
                                onChange={this.handleInputChange}
                            />
                            <div className={`ui basic red pointing prompt label ${this.state.lastNameError === 'regExp' ? 'visible' : 'hidden'}`}>{this.state.lastNameErrorText}</div>
                        </div>
                    </div>

                    <div className="field required">
                        <label className="promt">
                            <div data-position="top left">
                                Пароль
                            </div>
                        </label>
                        <div className="two fields">
                            <div className={`field ${this.state.passwordError ? 'error' : ''}`}>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Введите пароль"
                                    value={this.state.password}
                                    onChange={this.handleInputChange}
                                />
                                <div className={`ui basic red pointing prompt label ${this.state.passwordError === 'regExp' || this.state.passwordError === 'empty' ? 'visible' : 'hidden'}`}>{this.state.passwordErrorText}</div>
                            </div>
                            <div className={`field ${this.state.passwordConfirmError ? 'error' : ''}`}>
                                <input
                                    type="password"
                                    name="passwordConfirm"
                                    placeholder="Повторите пароль"
                                    value={this.state.passwordConfirm}
                                    onChange={this.handleInputChange}
                                />
                                <div className={`ui basic red pointing prompt label ${this.state.passwordConfirmError === 'notEqual' || this.state.passwordConfirmError === 'empty' ? 'visible' : 'hidden'}`}>{this.state.passwordConfirmErrorText}</div>
                            </div>
                        </div>
                    </div>

                    <button
                        className={`ui blue button ${this.state.loading ? 'loading' : ''}`}
                        type="submit"
                        disabled={this.state.loading ? 'disabled' : ''}
                    >Создать аккаунт</button>
                </form>
                <div className="ui bottom attached warning message container text">
                    <i className="icon help"></i>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
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

    handleInputChange(e) {
        this.setState(
            { [e.target.name]: e.target.value },
            () => this.validateField(e.target.name, e.target.value)
        );
    }

    handleSubmit(event) {
        event.preventDefault();

        let isValid = true;

        if (!this.validateField('login', this.state.login)) isValid = false;
        if (!this.validateField('firstName', this.state.firstName)) isValid = false;
        if (!this.validateField('lastName', this.state.lastName)) isValid = false;
        if (!this.validateField('password', this.state.password)) isValid = false;
        if (!this.validateField('passwordConfirm', this.state.passwordConfirm)) isValid = false;

        // Выход из функции, если хоть одно поле невалидно
        if (!isValid) return;


        this.setState({ loading: true });

        this.setState({ globalError: '', globalErrorTitle: '' });

        let data = {
            login: this.state.login,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            password: this.state.password
        }

        axios.post('http://localhost:3080/auth/register', data)
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

    validateField(fieldName, value) {
        let rus = /^[а-яА-ЯёЁ\s-]+$/;
        switch (fieldName) {
            case 'login':
                if (!value) {
                    this.setState({ loginErrorText: 'Введите логин!' })
                    this.setState({ loginError: 'empty' });

                    return false;
                }
                else if (!this.state.loginRegex.test(value)) {


                    if (value.length < 3) {
                        this.setState({ loginErrorText: 'Минимальная длина логина 2 символа!' })
                    }
                    if (value.length > 15) {
                        this.setState({ loginErrorText: 'Максимальная длина логина 15 символов!' })
                    }
                    if (rus.test(value)) {
                        this.setState({ loginErrorText: 'Логин не должен содержать русских букв!' })
                    }
                    this.setState({ loginError: 'regExp' });

                    return false;
                }
                else {
                    this.setState({ loginError: null });
                    this.setState({ loginErrorText: '' })
                    return true;
                }
            case 'firstName':
                if (!value) {
                    this.setState({ firstNameErrorText: 'Введите имя!' })
                    this.setState({ firstNameError: 'empty' });
                    return false;
                }
                else if (!this.state.nameRegex.test(value)) {
                    if (value.length < 3) {
                        this.setState({ firstNameErrorText: 'Минимальная длина имени 2 символа!' })
                    }
                    else if (value.length > 20) {
                        this.setState({ firstNameErrorText: 'Максимальная длина имени 20 символов!' })
                    }
                    else {
                        this.setState({ firstNameErrorText: 'Имя должно состоять только из русских или только из английский букв!' })
                    }
                    this.setState({ firstNameError: 'regExp' });
                    return false;
                }
                else {
                    this.setState({ firstNameError: null });
                    this.setState({ firstNameErrorText: '' })
                    return true;
                }
            case 'lastName':
                if (value && !this.state.nameRegex.test(value)) {
                    if (value.length < 3) {
                        this.setState({ lastNameErrorText: 'Минимальная длина фамилии 2 символа!' })
                    }
                    else if (value.length > 20) {
                        this.setState({ lastNameErrorText: 'Максимальная длина фамилии 20 символов!' })
                    }
                    else {
                        this.setState({ lastNameErrorText: 'Фамилия должна состоять только из русских или только из английский букв!' })
                    }
                    this.setState({ lastNameError: 'regExp' });
                    return false;
                }
                else {
                    this.setState({ lastNameError: null });
                    this.setState({ lastNameErrorText: '' })
                    return true;
                }
            case 'password':
                if (!value) {
                    this.setState({ passwordError: 'empty' });
                    this.setState({ passwordErrorText: 'Введите пароль!' })
                    return false;
                }
                else if (!this.state.passRegex.test(value)) {
                    this.setState({ passwordErrorText: 'Пароль должен содержать маленькие буквы, большие буквы и цифры!' })
                    if (rus.test(value)) {
                        this.setState({ passwordErrorText: 'Пароль не должен содержать русских букв!' })
                    }
                    if (value.length < 4) {
                        this.setState({ passwordErrorText: 'Минимальная длина пароля 4 символа!' })
                    }
                    this.setState({ passwordError: 'regExp' });
                    return false;
                }
                else {
                    this.setState({ passwordError: null });
                    this.setState({ passwordErrorText: '' })
                    return true;
                }
            case 'passwordConfirm':
                if (!value) {
                    this.setState({ passwordConfirmError: 'empty' });
                    this.setState({ passwordConfirmErrorText: 'Подтвердите пароль!' })
                    return false;
                }
                else if (this.state.password !== value) {
                    this.setState({ passwordConfirmError: 'notEqual' });
                    this.setState({ passwordConfirmErrorText: 'Пароли не совпадают!' })
                    return false;
                }
                else {
                    this.setState({ passwordConfirmError: null });
                    this.setState({ passwordConfirmErrorText: '' })
                    return true;
                }
            default:
                return true;
        }
    }


}

export default withRouter(Register);