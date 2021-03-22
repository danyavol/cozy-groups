import React from 'react';
import { Dimmer, Tab } from 'semantic-ui-react';
import { Dropdown } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import Modal from '../../components/modal/modal.js';

import './group.css';
import axios from "axios";

class Group extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            group: {},
            id: '',
            name: '',

            token: this.props.token,
            loading: true,
            loaderText:'Загрузка группы...',

            dimmer:false,
            visibleLeaveModal: false,
            visibleErrorModal: false,

            text:''
        }

        this.leave = this.leave.bind(this);
        this.updateVisibleLeaveModal = this.updateVisibleLeaveModal.bind(this);
        this.updateVisibleErrorModal = this.updateVisibleErrorModal.bind(this);
        this.openLeaveModal = this.openLeaveModal.bind(this);
    }

    render() {
        return (
            <div>
                <Modal 
                    header={'Ошибка'}
                    visible={this.state.visibleErrorModal}
                    element={<div>{this.text}</div>}
                    updateVisible={this.updateVisibleErrorModal}
                    function={this.updateVisibleErrorModal}
                />
                <Modal      
                    header={'Выход'} 
                    visible={this.state.visibleLeaveModal} 
                    element={this.state.text} 
                    updateVisible={this.updateVisibleLeaveModal}
                    function={this.leave} 
                />
                <Loader loading={this.state.loading} text={this.state.loaderText} />
                <Dimmer.Dimmable dimmed={this.state.dimmer} >
                    <Dimmer className='position' simple  />
                        <div className={this.state.loading ? 'hidden' : ''}>
                            <div className="header">
                                <div className="buttons">
                                    <LinkDropdown />
                                    <SettingsDropdown leave={this.openLeaveModal} />
                                </div>
                                <div>
                                    <Title state={this.state} />
                                </div>
                            </div>
                            <div>
                                <Tabs state={this.state} />
                            </div>
                        </div>
                </Dimmer.Dimmable>
            </div>
        )
    }

    openLeaveModal() {
        if(this.state.visibleLeaveModal) {
            this.setState({visibleLeaveModal : false, dimmer : false });
        }
        else {
            this.setState({visibleLeaveModal : true, dimmer : true, text:'Вы действительно хотите выйти из группы?' });
        }
    }

    updateVisibleErrorModal() {
        this.setState({visibleErrorModal : false, dimmer : false});
    }
    updateVisibleLeaveModal() {
        this.setState({visibleLeaveModal : false, dimmer : false});
    }

    leave() {
        this.setState({loading : true, loaderText : 'Выход из группы...', visibleLeaveModal : false, dimmer : false});
        let data = {groupId : this.state.group.id};
        axios.post('http://localhost:3080/groups/leave',data, {
            headers:{
                'Authorization':this.state.token
            }
        }).
        then(response => {
            if(response.data.ok) {
                console.log('Вы вышли из группы!');
                this.props.updateDeleteGroups(this.props.match.params.id);
                this.props.history.push("/");
            }
        })
        .catch((err) => {
            this.setState({loading : false,visibleErrorModal : true});
            this.props.deleteToken(err);
            if (err.response) this.setState({text : err.response.data.message });
            else this.setState({text :'Ошибка соединения с сервером.' });
            setTimeout(() => {this.props.history.push("/");},3000);
        })
    }

    

    componentDidMount() {
        if (this.state.token !== '') {
            axios.get('http://localhost:3080/groups/' + this.props.match.params.id, {
                headers: {
                    'Authorization': this.state.token
                }
            })
                .then(response => {
                    if (response.data.ok) {
                        this.setState({
                            group: response.data.group,
                            loading: false
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }



    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.setState({token: this.props.token, loading: true});
            axios.get('http://localhost:3080/groups/' + this.props.match.params.id, {
                headers: {
                    'Authorization': this.state.token
                }
            })
                .then(response => {
                    if (response.data.ok) {
                        this.setState({
                            group: response.data.group,
                            loading: false
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }

        if (this.props !== prevProps) {
            this.setState({token: this.props.token});
            axios.get('http://localhost:3080/groups/' + this.props.match.params.id, {
                headers: {
                    'Authorization': this.state.token
                }
            })
                .then(response => {
                    if (response.data.ok) {
                        this.setState({
                            group: response.data.group,
                            loading: false
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }


}

function Title(props) {
    return (
        <h1>{props.state.group.name}</h1>
    )
}

function Tabs(props) {
    const panes = [
        {
            menuItem:
                {key: 'notes', icon: 'sticky note', content: 'Все записи'},
            render: () => <Tab.Pane attached={false}>Все записи</Tab.Pane>
        },
        {
            menuItem:
                {key: 'favorites', icon: 'star', content: 'Важные'},
            render: () => <Tab.Pane attached={false}>Важные</Tab.Pane>
        },
        {
            menuItem:
                {key: 'users', icon: 'users', content: 'Пользователи'},
            render: () => <Tab.Pane attached={false}><UsersMenu state={props.state} /></Tab.Pane>
        },
    ];

    const GroupTabs = () => (
        <Tab menu={{secondary: true, pointing: true}} panes={panes} />
    );

    return (<GroupTabs />);
}



function UsersMenu(props) {
    if (props.state.group.length !== 0){
        return (
            <table className="ui celled table">
                <thead>
                <tr>
                    <th>Логин</th>
                    <th>Имя</th>
                    <th>Фамилия</th>
                    <th>Роль</th>
                </tr>
                </thead>
                <UsersRows state={props.state}/>
            </table>
        )
    } else {
        return (
            <h1>Users</h1>
        )
    }
}

function UsersRows(props) {
    if (!props.state.loading) {
        const users = props.state.group.users;
        const userRow = users.map((user) =>
            <tr key={user.id}>
                <td>{user.login}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.role}</td>
            </tr>
        );
        return (
            <tbody>{userRow}</tbody>
        )
    } else {
        return (
            <tr></tr>
        )
    }
}

function SettingsDropdown(props) {
    return (
        <Dropdown
            icon="settings"
            floating
            button
            direction="left"
            className="icon"
        >
            <Dropdown.Menu>
                <Dropdown.Header  content="Настройки" />
                <Dropdown.Divider />
                <Dropdown.Item>Изменить название группы</Dropdown.Item>
                <Dropdown.Item>Передать права владельца</Dropdown.Item>
                <Dropdown.Item onClick={props.leave}>Выйти из группы</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

function LinkDropdown() {
    return (
        <Dropdown
            icon="settings"
            floating
            button
            direction="left"
            className="icon"
        >
            <Dropdown.Menu>
                <Dropdown.Header  content="Тут инвайт код" />
                <Dropdown.Divider />
                <Dropdown.Item>Скопировать</Dropdown.Item>
                <Dropdown.Item>Обновить</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}
function Loader(props) {
    return (
        <div className={`holder ${props.loading ? '' : 'hidden'}`}>
            <div className={`ui middle aligned grid`}>
                <div className="eight column wide">
                    <div className={`ui active centered large text loader`}>{props.text}</div>
                </div>
            </div>
        </div>
    );
}

                {/*<div className={`ui ${this.state.loading ? 'active' : 'disabled'}  loader`}></div>*/}
                {/*/!*<div className={`holder ${this.state.loading ? '' : 'hidden'}`}>*!/*/}
                {/*/!*    <div className={`ui middle aligned grid`}>*!/*/}
                {/*/!*        <div className="eight column wide">*!/*/}
                {/*/!*            <div className={`ui active centered large text loader`}>Загрузка группы...</div>*!/*/}
                {/*/!*        </div>*!/*/}
                {/*/!*    </div>*!/*/}
                {/*/!*</div>*!/*/}

export default withRouter(Group);

