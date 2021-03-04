import React, { Component, Fragment } from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';

class Register extends Component {

    constructor(props){
        super(props);
        this.state = {
            login:'',
            password :'',
            repeatPassword:'',
        }
        this.handleLoginOnChange = this.handleLoginOnChange.bind(this);
        this.handlePasswordOnChange = this.handlePasswordOnChange.bind(this);
        this.handleRepeatPasswordOnChange = this.handleRepeatPasswordOnChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <Fragment>
                <form className="ui form attached segment padded container text">
                    <h2 className="ui header">Регистрация</h2>

                    <div className="field">
                        <label>Логин</label>
                        <input type="text" name="login" placeholder="Введите логин" />
                    </div>


                    <div className="field">
                        <label>Имя</label>
                        <div className="two fields">
                            <div className="field">
                                <input type="text" name="firtName" placeholder="Введите имя" />
                            </div>
                            <div className="field">
                                <input type="text" name="lastName" placeholder="Введите фамилию" />
                            </div>
                        </div>
                    </div>


                    <div className="field">
                        <label>Пароль</label>
                        <div className="two fields">
                            <div className="field">
                                <input type="text" name="password" placeholder="Введите пароль"/>
                            </div>
                            <div className="field">
                                <input type="text" name="passwordConfirm" placeholder="Повторите пароль"/>
                            </div>
                        </div>
                    </div>
                    
                    <button className="ui blue button" type="submit">Создать аккаунт</button>
                </form>
                <div className="ui bottom attached warning message container text">
                    <i className="icon help"></i>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </div>
            </Fragment>
        );
    }

    handleSubmit(event){

        const pass_Regexp = /[A-Za-z0-9!@#$%^&*]{4,20}/;
        const login_Regexp = /[A-Za-z0-9]{4,20}/;

        event.preventDefault();
        if(this.state.password === this.state.repeatPassword)
        {
            if(!login_Regexp.test(this.state.login))
            {
                console.log("Неверный формат логина!")
            } 
            else
            {
                if(!pass_Regexp.test(this.state.password))
                {
                    console.log("Неверный формат пароля!")
                }
                else
                {
                    console.log("Данные введены корректно!")
                    let data = {login : this.state.login, password : this.state.password }
                    console.log("Form submitted.");
        
                    axios.post('http://localhost:3080/register', data)
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
                        // Ошибка регистрации. Выводим пользователю текст ошибки response.data.message
                            console.log("Ошибка " + response.data.message);
                        }
                    }
                    ); 
                }
            }
        }
        else {
            console.log("invalid repeat password!")
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
    handleRepeatPasswordOnChange(event) {
        console.log("Repeat Password Change");
        this.setState({repeatPassword : event.target.value})
    }

}

export default Register;
