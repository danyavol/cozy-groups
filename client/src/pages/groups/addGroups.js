import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';

class addGroups extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            token:null,

            loadingJoin : false,
            loadingCreate : false,

            inviteCode : '',
            groupName : '',

            groupNameError:null,
            inviteCodeError:null,
            
            globalErrorTitle: '',
            globalError: '',

            myGroups : null
        }
        this.joinGroup = this.joinGroup.bind(this);
        this.createGroup = this.createGroup.bind(this);
        this.handleGroupNameChange = this.handleGroupNameChange.bind(this);
        this.handleInviteCodeChange = this.handleInviteCodeChange.bind(this);
        this.hideGlobalError = this.hideGlobalError.bind(this);
        this.validateField = this.validateField.bind(this);
    }

    componentDidMount() {
        document.title = "Добавить группу";
    }
    
    render() {
        return (
            <div>
                <div className={`ui negative message ${this.state.globalError ? '' : 'hidden'}`}>
                        <i className="close icon" onClick={this.hideGlobalError}></i>
                        <div className="header">{this.state.globalErrorTitle}</div>
                        <p>{this.state.globalError}</p>
                </div>


                <div className="ui placeholder very padded container segment">
                    <div className="ui two column stackable center aligned grid">
                        <div className="ui vertical divider">или</div>
                        <div className="middle aligned row">


                            <div className="column">
                                <div className="ui icon header">
                                    <FontAwesomeIcon  icon={faDoorOpen} size='4x' /><br/>
                                </div>
                                <p className="header-text" data-position="top center" data-tooltip="Код приглашения состоит из 6 символов.">Присоединиться</p>
                                <div className="ui search">
                                    <div className={`ui icon input ${this.state.inviteCodeError ? 'error' : ''}`}>
                                        <input 
                                            name = "invite-code"
                                            className="prompt" 
                                            type="text" 
                                            placeholder="Введите код..." 
                                            value = {this.state.inviteCode} 
                                            onChange = {this.handleInviteCodeChange} 
                                        />
                                        <i className={`plug icon ${this.state.inviteCodeError === 'empty' || this.state.inviteCodeError === 'regExp' ? 'red' : ''}`}></i>
                                    </div>
                                </div>
                                <div className="ui hidden divider"></div>
                                <div className={`ui basic red pointing prompt label ${this.state.inviteCodeError === 'empty' ? 'visible' : 'hidden'}`}>Введите код приглашения</div>
                                <div className={`ui basic red pointing prompt label ${this.state.inviteCodeError === 'regExp' ? 'visible' : 'hidden'}`}>Неверный формат кода</div>
                                <div className="ui hidden divider"></div>
                                <div className = "margin">
                                    <div onClick={this.joinGroup}
                                        className={`ui primary button
                                            ${this.state.loadingJoin ? 'loading disabled' : ''} 
                                            ${this.state.loadingCreate ? 'disabled' : ''}
                                            ${this.state.inviteCodeError === 'empty' || this.state.inviteCodeError === 'regExp' ? 'disabled' : ''}`}>Присоединиться 
                                    </div>
                                </div>
                            </div>


                            <div className="column">
                                <div className="ui icon header">
                                    <FontAwesomeIcon icon={faPlusSquare} size='4x' /><br/>
                                </div>
                                <p className="header-text" data-position="top center" data-tooltip="Название группы должно быть больше 3 символов.">Создать группу</p>
                                <div className="ui search">
                                    <div className={` ui icon input ${this.state.groupNameError ? 'error' : ''}`}>
                                        <input 
                                            name = "group-name"
                                            className="prompt" 
                                            type="text" 
                                            placeholder="Введите название..." 
                                            value = {this.state.groupName} 
                                            onChange = {this.handleGroupNameChange} 
                                        />
                                        <i className={`keyboard icon ${this.state.groupNameError === 'empty' || this.state.groupNameError === 'regExp' ? 'red' : ''}`}></i>
                                    </div>
                                </div>
                                <div className="ui hidden divider"></div>
                                <div className={`ui basic red pointing prompt label ${this.state.groupNameError === 'empty' ? 'visible' : 'hidden'}`}>Введите название группы</div>
                                <div className={`ui basic red pointing prompt label ${this.state.groupNameError === 'regExp' ? 'visible' : 'hidden'}`}>Неверный формат названия</div>
                                <div className="ui hidden divider"></div>
                                <div className = "margin">
                                    <div 
                                        onClick={this.createGroup} 
                                        className={`ui primary button 
                                            ${this.state.loadingCreate ? 'loading disabled' : ''} 
                                            ${this.state.loadingJoin ? 'disabled' : ''}
                                            ${this.state.groupNameError === 'empty' || this.state.groupNameError === 'regExp' ? 'disabled' : ''}`}>Создать 
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        );
    }

    createGroup(){
        this.setState({loadingJoin : false, loadingCreate : true})
        this.hideGlobalError();
        let data = {name : this.state.groupName}
        axios.post('http://localhost:3080/groups/create', data, {
            headers: {
                'Authorization': this.props.token
        }})
        .then(response => {
            this.setState({loadingJoin : false, loadingCreate : false})
            if(response.data.ok) {
                console.log('Успешно создана группа!')
                this.props.updateGroups(response.data.group);
                this.props.history.push("/groups/" + response.data.group.id);
            }
        })
        .catch((err) => {
            this.setState({loadingJoin : false, loadingCreate : false})
            let errorText;
            this.props.deleteToken(err);
            this.props.clearGroups();
            if (err.response) errorText = err.response.data.message;
            else errorText = 'Ошибка соединения с сервером';
            this.setState({
                globalErrorTitle: 'Ошибка',
                globalError: errorText,
                loading: false
            });
        })
    }

    changeRoute(path) {
        this.props.history.push(path)
    }

    hideGlobalError() {
        this.setState({
            globalErrorTitle: '',
            globalError: ''
        });
    }

    joinGroup() {
        this.setState({loadingJoin : true, loadingCreate : false})
        this.hideGlobalError();
        let data = {inviteCode : this.state.inviteCode}
        axios.post('http://localhost:3080/groups/join',data, {
            headers: {
                'Authorization': this.props.token
        }})
        .then(response => {
            this.setState({ loadingCreate : false });
            this.setState({loadingJoin : false});
            if(response.data.ok) {
                console.log('Вы присоединились к группе!')
                this.props.updateGroups(response.data.group);
                this.props.history.push("/groups/" + response.data.group.id);
            }
        })
        .catch((err) => {
            this.setState({loadingJoin : false, loadingCreate : false})
            let errorText;
            this.props.deleteToken(err);
            this.props.clearGroups();
            if (err.response) errorText = err.response.data.message;
            else errorText = 'Ошибка соединения с сервером';
            this.setState({
                globalErrorTitle: 'Ошибка',
                globalError: errorText,
                loading: false
            });
        })
    }

    validateField(fieldName,value) {
        switch (fieldName) {
            case "inviteCode":
                if(!value) {
                    this.setState({inviteCodeError : 'empty'});
                    return false;
                } 
                else if((value.length < 6 || value.length > 6)) {
                    this.setState({inviteCodeError : 'regExp'});
                    return false;
                }
                else {
                    this.setState({inviteCodeError : null});
                    return true;
                }
            case "groupName":
                if(!value) {
                    this.setState({groupNameError : 'empty'});
                    return false;
                } 
                else if(!(value.length > 3 && value.length < 50)) {
                    this.setState({groupNameError : 'regExp'});
                    return false;
                }
                else {
                    this.setState({groupNameError : null});
                    return true;
                }
        } 
    }

    handleInviteCodeChange(e) {
        this.setState({inviteCode : e.target.value},() => this.validateField("inviteCode", e.target.value))
    }


    handleGroupNameChange(e) {
        this.setState({groupName : e.target.value},() => this.validateField("groupName", e.target.value));
        
    }
}

export default withRouter(addGroups);