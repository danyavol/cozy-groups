import React, { Component, Fragment } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import ReactDOM from 'react-dom'

class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            login:'',
            password :'',
        }
        this.handleLoginOnChange = this.handleLoginOnChange.bind(this);
        this.handlePasswordOnChange = this.handlePasswordOnChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    render() {
        return (
            <Fragment> 
                <form className="ui form attached segment padded container text" onSubmit = {this.handleSubmit}>
                    <h2 className="ui header">Авторизация</h2>
                    <div id="errorBlock"></div>
                    <div className="field">
                        <label>Логин</label>
                        <input
                            type="text"
                            name="login"
                            placeholder="Введите логин"
                            value={this.state.login}
                            onChange={this.handleLoginOnChange}
                        />
                    </div>
                    <div className="field">
                        <label>Пароль</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Введите пароль"
                            value={this.state.password}
                            onChange={this.handlePasswordOnChange}
                        />
                    </div>
                    <button className="ui blue button" type="submit">Войти</button>
                </form>
                <div className="ui bottom attached warning message container text">
                    <i className="icon help"></i>
                    Ещё не зарегистрированы? <Link to="/register">Создать аккаунт</Link>
                </div>
            </Fragment>
        );
    }

    handleSubmit(event){
        event.preventDefault();
        if(this.state.login === '' || this.state.password === '')
        {
            ResponseError({
                label: "Ошибка",
                responseMessage: "Заполните недостающие поля!"
            });
        }
        else
        {
            let data = {login : this.state.login, password : this.state.password }
            console.log("Form submitted.");
            axios.post('http://localhost:3080/login', data)
                .then(response => {
                console.log(response);
                    if (response.data.ok) {
                    // Все гуд, запрос прошел
                    // Сохраняем токен в localStorage
                    localStorage.setItem('token', response.data.token);
    
                    // Получаем доступ к приватной страничке с использованием этого токена
                    let token = localStorage.getItem('token');
                    axios.get('http://localhost:3080/secret', {headers: {'Authorization': token}}).then(response => {
                        console.log(response);
                    })
                    } 
                    else {
                    // Ошибка авторизации. Выводим пользователю текст ошибки response.data.message
                        ResponseError({
                            label: "Ошибка",
                            responseMessage: response.data.message
                        });
                    }
                }
                ); 
        }
        }

    handleLoginOnChange(event) {
        this.setState({login : event.target.value})
    }

    handlePasswordOnChange(event) {
        this.setState({password : event.target.value})
    }

}

function ResponseError({ label, responseMessage }) {
    const element = (
        <div className="ui negative message">
            {/*<i className="close icon"></i>*/}
            <div className="header">{label}</div>
            <p>{responseMessage}</p>
        </div>
    );
    ReactDOM.render(element, document.getElementById("errorBlock"));
}

export default Login;
