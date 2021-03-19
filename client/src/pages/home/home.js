import React, { Component, Fragment } from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import "./home.css";
import { faDatabase, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faCss3Alt, faGoogle, faHtml5, faNode, faReact, faTrello} from '@fortawesome/free-brands-svg-icons'


class Home extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Fragment>
                <div>
                    <div className="ui vertical stripe segment">
                        <div className="ui middle aligned stackable grid container">
                            <div className="row">
                                <div className = "center aligned column">
                                    <img src="/images/logo-goat.svg" alt="site-logo2" />
                                    <h3>Мы пришли чтобы свергнуть Google.</h3>
                                </div>
                            </div>
                            <div className="row">
                                <div className="center aligned column">
                                    <h1 className="logo-text">COZY GROUPS ЭТО...</h1>
                                </div>
                            </div>
                            <div className="centered row">
                                <div className="eight wide column">
                                    <h1 className="ui header">СОЗДАВАЙТЕ. ОБЬЕДИНЯЙТЕСЬ. ПОСТИТЕ КОТИКОВ.</h1>
                                    <h3 className="ui justified header">Наше приложение имеет полный функционал для взаимодействия с группами, удобный список ваших групп, а так же ваши любимые закреплённые группы. Присоединитесь к друзьям по коду или создайте свою! </h3>
                                    <h1 className="ui header">У МЕНЯ БУДЕТ ВЛАСТЬ КОТОРАЯ И НЕ СНИЛАСЬ МОЕМУ ОТЦУ!</h1>
                                    <h3 className="ui justified header">В вашей группе есть система ролей, так что вы как истинный король можете сделать себе подданых в качестве администраторов и редакторов</h3>
                                </div>
                                <div className="eight wide center aligned column">  
                                     <FontAwesomeIcon icon={faUsers} size='10x' /><br/>   
                                </div>
                            </div>
                            <div className="row">
                               
                            </div>
                            <div className="centered row">
                                <div className="four wide center aligned column">  
                                    <FontAwesomeIcon icon={faGoogle} size='10x' /> 
                                </div>
                                <div className="four wide center aligned column">
                                    <FontAwesomeIcon icon={faTrello} size='10x' /> 
                                </div>
                                <div className="eight wide center aligned column">
                                    <h1 className="ui header">СИМБИОЗ GOOGLE КЛАССА, ГРУПП И TRELLO </h1>
                                    <h3 className="ui justified header">Мы взяли всё самое лучшее от этих приложений и подумали как было бы забавно соеденить всю эту багадельню вместе. </h3>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="center aligned column">
                                    <div className="five wide aligned two column">
                                        <div className="row">
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="center aligned column">
                                    <h1 className = "logo-text">СТЕК</h1>
                                </div>
                            </div>
                            <div className="centered row">
                                <div className="three wide center aligned column">
                                    <FontAwesomeIcon icon={faDatabase} size='6x' />
                                </div>
                                <div className="three wide center aligned column">
                                    <FontAwesomeIcon icon={faReact} size='6x' />
                                </div>
                                <div className="three wide center aligned column">
                                    <FontAwesomeIcon icon={faNode} size='6x' />
                                </div>
                                <div className="three wide center aligned column">
                                    <FontAwesomeIcon icon={faHtml5} size='6x' />
                                </div>
                                <div className="three wide center aligned column">
                                    <FontAwesomeIcon icon={faCss3Alt} size='6x' />
                                </div>
                            </div>
                            <div className="centered row">
                                <div className="sixteen wide center aligned column">
                                    <h2>РАЗРАБОТАНО С ПОМОЩЬЮ СТЕКА MERN.</h2>
                                    <h3  className="ui justified header" >Стек MERN - это JavaScript-стек, разработанный для упрощения процесса разработки. MERN включает в себя четыре компонента с открытым исходным кодом: MongoDB, Express, React и Node.js. Эти компоненты обеспечивают комплексную среду для работы разработчиков. Наш проект Open-Source поэтому вы можете ознакомится с ним в GitHub репозитории.</h3>
                                </div>
                            </div>
                            <div className="row">
                                <div className="center aligned column">
                                <a className="ui huge button">Перейти на GitHub</a>
                                </div>
                            </div>
                            <div className="row">
                                <div className="sixteen wide aligned center column">
                                    <h1 className="logo-text">JOIN US</h1>
                                </div>
                            </div>
                            <div className="row">
                                <div className="center aligned column">
                                <a className="ui huge button">Зарегистрироваться</a>
                                </div>
                            </div>                       
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Home;

