import React from 'react';
import { Tab } from 'semantic-ui-react';
import { Dropdown } from "semantic-ui-react";
import { CopyToClipboard } from "react-copy-to-clipboard/lib/Component";

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
            loading: true
        }
    }

    render() {

        return (

            <div>
                <Loader loading={this.state.loading} />
                <div className={this.state.loading ? 'hidden' : ''}>
                    <div className="header">
                        <div className="buttons">
                            <SettingsDropdown />
                        </div>
                        <div>
                            <Title state={this.state} />
                        </div>
                    </div>
                    <div>
                        <Tabs state={this.state} />
                    </div>
                </div>
            </div>
        )
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
        {
            menuItem:
                {key: 'invite', icon: 'linkify', content: 'Ссылка для приглашения'},
            render: () => <InviteTab inviteCode={props.state.group.inviteCode} copied={props.state.copied} />
        }
    ];

    const GroupTabs = () => (
        <Tab menu={{secondary: true, pointing: true}} panes={panes} />
    );

    return (
            <GroupTabs />
        );
}


class InviteTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            copied: false
        }
    }
    render() {
        return (
            <div className="inviteCard">
                <div className="ui fluid centered card inviteCard">
                    <div className="content">
                        <a className="center aligned header">Код приглашения</a>
                        <div className="center aligned description">
                            <h1 id="inviteCode">
                                {this.props.inviteCode}
                                <CopyToClipboard text={this.props.inviteCode} onCopy={() => this.setState({copied: true})}>
                                    <h2><i className={`copy ${this.state.copied ? '' : 'disabled'} icon`}></i></h2>
                                </CopyToClipboard>
                            </h1>

                        </div>
                    </div>
                    <div className="center aligned extra content">
                        <div className="large fluid ui button">Обновить</div>
                    </div>
                </div>
            </div>

        );
    }


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


function SettingsDropdown() {
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
                <Dropdown.Item>Элемент</Dropdown.Item>
                <Dropdown.Item>Элемент</Dropdown.Item>
                <Dropdown.Item>Гейский элемент</Dropdown.Item>
                <Dropdown.Item>Элемент</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}



function Loader(props) {
    return (
        <div className={`holder ${props.loading ? '' : 'hidden'}`}>
            <div className={`ui middle aligned grid`}>
                <div className="eight column wide">
                    <div className={`ui active centered large text loader`}>Загрузка группы...</div>
                </div>
            </div>
        </div>
    );
}

export default Group;

