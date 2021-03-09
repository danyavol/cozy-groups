import React, { Component } from 'react';
import axios from 'axios';

class addGroups extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            token:null,
            inviteCode : '',
            groupName : ''
        }
        this.joinGroup = this.joinGroup.bind(this);
        this.createGroup = this.createGroup.bind(this);
        this.handleGroupNameChange = this.handleGroupNameChange.bind(this);
        this.handleInviteCodeChange = this.handleInviteCodeChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    
    render() {
        return (
            <div>
                <div className="ui very padded text container segment">
                    <h2 className="ui header">Add Group page.</h2>
                </div>
                <div className="ui placeholder segment">
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
                            <div onClick={this.joinGroup} className="ui primary button">Присоединиться </div> 
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
                                <div onClick={this.createGroup} className="ui primary button">Создать </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button>Да</button>
            </div>
        );
    }

    createGroup(){
        let data = {name : this.state.groupName}
        axios.post('http://localhost:3080/groups/create',data, {
            headers: {
                'Authorization': this.props.token
            }})
            .then(response => {
                if(response.data.ok) {
                    console.log('Успешно создана группа!')
                }
            })
        .catch((err) => {
            let errorText;
            if (err.response) errorText = err.response.data.message;
            else errorText = 'Ошибка соединения с сервером';
            console.log(errorText);
        })
    }

joinGroup() {
    let data = {inviteCode : this.state.inviteCode}
        axios.post('http://localhost:3080/groups/join',data, {
            headers: {
                'Authorization': this.props.token
            }})
            .then(response => {
                if(response.data.ok) {
                    console.log('Вы присоединились к группе!')
                }
            })
        .catch((err) => {
            let errorText;
            if (err.response) errorText = err.response.data.message;
            else errorText = 'Ошибка соединения с сервером';
            console.log(errorText);
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