import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";

import axios from 'axios';

class Register extends Component {

    constructor(props){
        super(props);
        this.state = {
            passRegex: /[A-Za-z0-9!@#$%^&*]{4,20}/,
            loginRegex: /[A-Za-z0-9]{4,20}/,
            nameRegex: /^([A-Za-z]+|[А-Яа-я]+)$/,

            globalErrorTitle: '',
            globalError: '',

            login: '',
            firstName: '',
            lastName: '',
            password : '',
            passwordConfirm: '',

            loginError: '',
            firstNameError: '',
            lastNameError: '',
            passwordError: '',
            passwordConfirmError: '',

            loading: false
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hideGlobalError = this.hideGlobalError.bind(this);
    }

    render() {
        return (
            <Fragment>
                <form onSubmit = {this.handleSubmit} className="ui form attached segment padded container text" autoComplete="off">
                    <h2 className="ui header">Регистрация</h2>

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
                        <div className={`ui basic red pointing prompt label ${this.state.loginError === 'regExp' ? 'visible' : 'hidden'}`}>Неверный формат логина</div>
                    </div>
    
                    <div className="two fields">
                        <div className={`field required ${this.state.firstNameError ? 'error' : ''}`}>
                            <label>Имя</label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Введите имя"
                                value = {this.state.firstName}
                                onChange = {this.handleInputChange}
                            />
                            <div className={`ui basic red pointing prompt label ${this.state.firstNameError === 'empty' ? 'visible' : 'hidden'}`}>Введите имя</div>
                            <div className={`ui basic red pointing prompt label ${this.state.firstNameError === 'regExp' ? 'visible' : 'hidden'}`}>Неверный формат имени</div>
                        </div>
                        <div className={`field ${this.state.lastNameError ? 'error' : ''}`}>
                            <label>Фамилия</label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Введите фамилию"
                                value = {this.state.lastName}
                                onChange = {this.handleInputChange}
                            />
                            <div className={`ui basic red pointing prompt label ${this.state.lastNameError === 'regExp' ? 'visible' : 'hidden'}`}>Неверный формат фамилии</div>
                        </div>
                    </div>
                    
                    <div className="field required">
                        <label>Пароль</label>
                        <div className="two fields">
                            <div className={`field ${this.state.passwordError ? 'error' : ''}`}>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Введите пароль"
                                    value = {this.state.password}
                                    onChange = {this.handleInputChange}
                                />
                                <div className={`ui basic red pointing prompt label ${this.state.passwordError === 'empty' ? 'visible' : 'hidden'}`}>Введите пароль</div>
                                <div className={`ui basic red pointing prompt label ${this.state.passwordError === 'regExp' ? 'visible' : 'hidden'}`}>Неверный формат пароля</div>
                            </div>
                            <div className={`field ${this.state.passwordConfirmError ? 'error' : ''}`}>
                                <input
                                    type="password"
                                    name="passwordConfirm"
                                    placeholder="Повторите пароль"
                                    value = {this.state.passwordConfirm}
                                    onChange = {this.handleInputChange}
                                />
                                <div className={`ui basic red pointing prompt label ${this.state.passwordConfirmError === 'empty' ? 'visible' : 'hidden'}`}>Введите пароль повторно</div>
                                <div className={`ui basic red pointing prompt label ${this.state.passwordConfirmError === 'notEqual' ? 'visible' : 'hidden'}`}>Пароли не совпадают</div>
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
            {[e.target.name]: e.target.value}, 
            () => this.validateField(e.target.name, e.target.value)
        );
    }

    handleSubmit(event) {
        console.log('press');
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

        let data = {
            login : this.state.login,
            firstName : this.state.firstName,
            lastName : this.state.lastName,
            password : this.state.password
        }

        axios.post('http://localhost:3080/auth/register', data)
        .then(response => {
            console.log(response);

            if (response.data.ok)
                localStorage.setItem('token', response.data.token);
            else
                this.setState({
                    globalErrorTitle: 'Ошибка',
                    globalError: response.data.message,
                    loading: false
                });
        })
        .catch(() => {
            this.setState({
                globalErrorTitle: 'Ошибка',
                globalError: 'Ошибка соединения с сервером',
                loading: false
            });
        }); 
       
    }

    validateField(fieldName, value) {
        switch (fieldName) {
            case 'login':
                if (!value) {
                    this.setState({loginError: 'empty'});
                    return false;
                } 
                else if (!this.state.loginRegex.test(value)) {
                    this.setState({loginError: 'regExp'});
                    return false;
                } 
                else {
                    this.setState({loginError: null});
                    return true;
                }
            case 'firstName':
                if (!value) {
                    this.setState({firstNameError: 'empty'});
                    return false;
                } 
                else if (!this.state.nameRegex.test(value)) {
                    this.setState({firstNameError: 'regExp'});
                    return false;
                } 
                else {
                    this.setState({firstNameError: null});
                    return true;
                }
            case 'lastName':
                if (value && !this.state.nameRegex.test(value)) {
                    this.setState({lastNameError: 'regExp'});
                    return false;
                }
                else {
                    this.setState({lastNameError: null});
                    return true;
                }
            case 'password':
                if (!value) {
                    this.setState({passwordError: 'empty'});
                    return false;
                } 
                else if (!this.state.passRegex.test(value)) {
                    this.setState({passwordError: 'regExp'});
                    return false;
                }
                else {
                    this.setState({passwordError: null});
                    return true;
                }
            case 'passwordConfirm':
                if (!value) {
                    this.setState({passwordConfirmError: 'empty'});
                    return false;
                } 
                else if (this.state.password !== value) {
                    this.setState({passwordConfirmError: 'notEqual'});
                    return false;
                }
                else {
                    this.setState({passwordConfirmError: null});
                    return true;
                }
        }
    }

    
}

export default Register;