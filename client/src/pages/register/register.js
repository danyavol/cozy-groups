import React, { Component, Fragment } from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
import ReactDOM from 'react-dom'

class Register extends Component {

    constructor(props){
        super(props);
        this.state = {
            login:'',
            firstName:'',
            lastName:'',
            password :'',
            repeatPassword:'',
        }
        this.handleLoginOnChange = this.handleLoginOnChange.bind(this);
        this.handleFirstNameOnChange = this.handleFirstNameOnChange.bind(this);
        this.handleLastNameOnChange = this.handleLastNameOnChange.bind(this);
        this.handlePasswordOnChange = this.handlePasswordOnChange.bind(this);
        this.handleRepeatPasswordOnChange = this.handleRepeatPasswordOnChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <Fragment>
                <form onSubmit = {this.handleSubmit} className="ui form attached segment padded container text">
                    <h2 className="ui header">Регистрация</h2>
                    <div id="errorBlock"></div>
                    <div className="field">
                        <label>Логин</label>
                        <input type="text" name="login" placeholder="Введите логин" value = {this.state.login} onChange = {this.handleLoginOnChange} />
                    </div>


                    <div className="field">
                        <label>Имя</label>
                        <div className="two fields">
                            <div className="field">
                                <input type="text" name="firtName" placeholder="Введите имя" value = {this.state.firstName} onChange = {this.handleFirstNameOnChange} />
                            </div>
                            <div className="field">
                                <input type="text" name="lastName" placeholder="Введите фамилию" value = {this.state.lastName} onChange = {this.handleLastNameOnChange} />
                            </div>
                        </div>
                    </div>


                    <div className="field">
                        <label>Пароль</label>
                        <div className="two fields">
                            <div className="field">
                                <input type="password" name="password" placeholder="Введите пароль" value = {this.state.password} onChange = {this.handlePasswordOnChange} />
                            </div>
                            <div className="field">
                                <input type="password" name="passwordConfirm" placeholder="Повторите пароль" value = {this.state.repeatPassword} onChange = {this.handleRepeatPasswordOnChange}  />
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
        const name_Regexp = /[A-Za-z0-9А-Яа-я]{4,20}/;
        

        event.preventDefault();
        if(this.state.password === this.state.repeatPassword)
        {
            if(!login_Regexp.test(this.state.login))
            {
                ResponseError({
                    label: "Ошибка",
                    responseMessage: "Неверный формат логина!"
                });
            } 
            else
            {
                if(!pass_Regexp.test(this.state.password))
                {
                    ResponseError({
                        label: "Ошибка",
                        responseMessage: "Неверный формат пароля!"
                    });
                }
                else
                {
                    if(!name_Regexp.test(this.state.firstName))
                    {
                        ResponseError({
                            label: "Ошибка",
                            responseMessage: "Неверный формат имени!"
                        });  
                    }
                    else
                    {
                        if(!name_Regexp.test(this.state.lastName))
                        {
                            ResponseError({
                                label: "Ошибка",
                                responseMessage: "Неверный формат фамилии!"
                            });   
                        }
                        else
                        {
                            console.log("Данные введены корректно!")
                            let data = {
                                login : this.state.login,
                                firstName : this.state.firstName,
                                lastName : this.state.lastName,
                                password : this.state.password 
                                }
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
                                ResponseError({
                                    label: "Ошибка",
                                    responseMessage: response.data.message
                                });
                                }
                            }
                            ); 
                        }
                    }
                }
            }
        }
        else {
            ResponseError({
                label: "Ошибка",
                responseMessage: "Пароли не совпадают!"
            });
        }
    }


    handleLoginOnChange(event) {
        console.log("Login Change");
        this.setState({login : event.target.value})
    }

    handleFirstNameOnChange(event) {
        this.setState({firstName : event.target.value})
    }

    handleLastNameOnChange(event) {
        this.setState({lastName : event.target.value})
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

export default Register;
