import React, { Component } from 'react';
import axios from 'axios';

class addGroups extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            token:null,

            loading : false,

            inviteCode : '',
            groupName : '',
            
            globalErrorTitle: '',
            globalError: '',

        }
        this.joinGroup = this.joinGroup.bind(this);
        this.createGroup = this.createGroup.bind(this);
        this.handleGroupNameChange = this.handleGroupNameChange.bind(this);
        this.handleInviteCodeChange = this.handleInviteCodeChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.hideGlobalError = this.hideGlobalError.bind(this);
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
                                    
                                    <div className="ui icon header"><i className="search icon"></i> Присоединиться </div>
                            <div className="ui search">
                                <div className="ui icon input">
                                        <input 
                                            name = "invite-code"
                                            className="prompt" 
                                            type="text" 
                                            placeholder="Введите код..." 
                                            value = {this.state.inviteCode} 
                                            onChange = {this.handleInviteCodeChange} 
                                        />
                                    <i className="search icon"></i>
                                </div>
                                <div className="results"></div>
                            </div>
                            <div className="ui hidden divider"></div>
                            <div className = "margin">
                                <div onClick={this.joinGroup} className={`ui primary button ${this.state.loading ? 'loading disabled' : ''}`}>Присоединиться </div> 
                            </div>
                        </div>
                        <div className="column">
                            <div className="ui icon header"><i className="world icon"></i> Создать группу </div>
                                <div className="ui search">
                                    <div className="ui icon input">
                                        <input 
                                            name = "group-name"
                                            className="prompt" 
                                            type="text" 
                                            placeholder="Введите название..." 
                                            value = {this.state.groupName} 
                                            onChange = {this.handleGroupNameChange} 
                                        />
                                        <i className="search icon"></i>
                                    </div>
                                    <div className="results"></div>
                                </div>
                                <div className="ui hidden divider"></div>
                                <div className = "margin">
                                    <div onClick={this.createGroup} className={`ui primary button ${this.state.loading ? 'loading disabled' : ''}`}>Создать </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    createGroup(){
        this.setState({ loading: true });
        this.hideGlobalError();
        let data = {name : this.state.groupName}
        axios.post('http://localhost:3080/groups/create', data, {
            headers: {
                'Authorization': this.props.token
            }})
            .then(response => {
                this.setState({ loading: false });
                if(response.data.ok) {
                    console.log('Успешно создана группа!')
                }
            })
        .catch((err) => {
            this.setState({ loading: false });
            let errorText;
            if (err.response) errorText = err.response.data.message;
            else errorText = 'Ошибка соединения с сервером';
            this.setState({
                globalErrorTitle: 'Ошибка',
                globalError: errorText,
                loading: false
            });
        })
    }


    hideGlobalError() {
        this.setState({
            globalErrorTitle: '',
            globalError: ''
        });
    }

    joinGroup() {
        this.setState({ loading: true });
        this.hideGlobalError();
        let data = {inviteCode : this.state.inviteCode}
        axios.post('http://localhost:3080/groups/join',data, {
            headers: {
                'Authorization': this.props.token
            }})
            .then(response => {
                this.setState({ loading: false });
                if(response.data.ok) {
                    console.log('Вы присоединились к группе!')
                }
            })
        .catch((err) => {
            this.setState({ loading: false });
            let errorText;
            if (err.response) errorText = err.response.data.message;
            else errorText = 'Ошибка соединения с сервером';
            this.setState({
                globalErrorTitle: 'Ошибка',
                globalError: errorText,
                loading: false
            });
        })
}

    handleInviteCodeChange(e) {
        this.setState({inviteCode : e.target.value})
    }


    handleGroupNameChange(e) {
        this.setState({groupName : e.target.value})
    }

    handleInputChange(e) {
        this.setState(
            {[e.target.name]: e.target.value}
        );
    }

}

export default addGroups;