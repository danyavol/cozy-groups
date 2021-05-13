import React, { Component } from 'react';
import "./404.css"
class Error extends Component {
    componentDidMount() {
        document.title = "Ошибка";
        this.number = this.getRandomInt(this.phrases.length)
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
    number = null;
    phrases = ['ЁМАЁ','ЁЛКИ ПАЛКИ','Не туда ты заполз пацанчик...','Мне кажется тебе не сюда :(','В соответсвии с законодательством о нарушении границ вы будете арестованы через 3,2...','От лица Cozy Groups заявляю: ты не тут где здесь!']
    render() {
        return (
           <div className="error-block">
               <h1 className="text">404</h1>
               <h4 className="phrase">{this.phrases[this.number]}</h4>
               <a className="ui huge button" href="/"><i className="reply icon"></i>Вернуться на главную страницу</a>
           </div>
        );
    }
}

export default Error;
