import React, { Component, Fragment } from 'react';
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
    phrases = ['ЁМАЁ', 'ЁЛКИ ПАЛКИ', 'Не туда ты заполз пацанчик...', 'Мне кажется тебе не сюда :(', 'В соответсвии с законодательством о нарушении границ вы будете арестованы через 3,2...', 'От лица Cozy Groups заявляю: ты не тут где здесь!']
    render() {
        return (
            <Fragment>
                <div className="error-block">
                    <img className="error-image" src="/images/cozy-error.png" alt="site-logo" />
                    <h4 className="phrase">{this.phrases[this.number]}</h4>
                    <a className="ui huge button" href="/"><i className="reply icon"></i>Вернуться на главную страницу</a>
                </div>
            </Fragment>
        );
    }
}
{/* <h1 className="error-block-text">404</h1> */ }
export default Error;
