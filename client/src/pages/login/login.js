import React, { Component, Fragment } from 'react';
import axios from 'axios';

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
                <h2>Login page</h2>
                <form onSubmit = {this.handleSubmit}>
                    <input type = "text" placeholder = "Input login." value = {this.state.login} onChange = {this.handleLoginOnChange} />
                    <input type = "text" placeholder = "Input password." value = {this.state.password} onChange = {this.handlePasswordOnChange} />
                    <input type = "submit" placeholder= "Войти." value = "Войти" />
                    <a href = "/register">Ещё не зарегистрированы?</a>
                </form>
            </Fragment>
        );
    }

    handleSubmit(event){
        event.preventDefault();
        if(this.state.login === '' || this.state.password === '')
        {
            console.log("Заполните недостающие поля!")
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
                    console.log("Ошибка " + response.data.message);
                    }
                }
                ); 
        }
        }

    handleLoginOnChange(event) {
        console.log("Login Change");
        this.setState({login : event.target.value})
    }

    handlePasswordOnChange(event) {
        console.log("Password Change");
        this.setState({password : event.target.value})
    }

}

export default Login;
