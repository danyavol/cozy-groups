
import React, { Component } from 'react';
import axios from 'axios';
class Auth extends Component {

    constructor(props){
        super(props);
        this.state = {
            login:'',
            password :'',
            repeatPassword:'',
        }
        this.handleLoginOnChange = this.handleLoginOnChange.bind(this);
        this.handlePasswordOnChange = this.handlePasswordOnChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

handleSubmit(event){
    event.preventDefault();
    let data = {login : this.state.login, password : this.state.password }
    console.log("Form submitted.");

    axios.post('http://localhost:3080/register', data)
    .then(response => {
        console.log(response);

        if (response.data.ok) {
            // Все гуд, запрос проше
        } else {
            // Выводим пользователю response.data.message
        }
    }); 

    // fetch('http://localhost:3080/register', {
    //     method : 'POST',
    //     body : JSON.stringify(data),
    //     headers : {
    //         'Content-Type' : 'application/json'
    //     }
    // })
    // .then(response => response.json())
    // .then(json => {
    //     console.log(json);
    // })
}

handleLoginOnChange(event) {
    console.log("Login Change");
    this.setState({login : event.target.value})
}
handlePasswordOnChange(event) {
    console.log("Password Change");
    this.setState({password : event.target.value})
}

    render() {
        return (
            <form onSubmit = {this.handleSubmit}>
                <input type = "text" placeholder = "Input login." value = {this.state.login} onChange = {this.handleLoginOnChange}/>
                <input type = "text" placeholder = "Input password." value = {this.state.password} onChange = {this.handlePasswordOnChange}/>
                <input type = "text" placeholder = "Repeat password." value = {this.state.repeatPassword}/>
                <a href = "/login">Уже есть аккаунт?</a>
                <input type = "submit" placeholder= "Зарегистрироваться."/>
            </form>
        );
    }
}
export default Auth;