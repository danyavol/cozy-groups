import React from 'react';
import { Tab } from 'semantic-ui-react';
import { Dropdown } from "semantic-ui-react";

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
                {/*<div className={`ui ${this.state.loading ? 'active' : 'disabled'}  loader`}></div>*/}
                {/*/!*<div className={`holder ${this.state.loading ? '' : 'hidden'}`}>*!/*/}
                {/*/!*    <div className={`ui middle aligned grid`}>*!/*/}
                {/*/!*        <div className="eight column wide">*!/*/}
                {/*/!*            <div className={`ui active centered large text loader`}>Загрузка группы...</div>*!/*/}
                {/*/!*        </div>*!/*/}
                {/*/!*    </div>*!/*/}
                {/*/!*</div>*!/*/}

                <div className={this.state.loading ? 'hidden' : ''}>
                    <div className="header">
                        <div className="buttons">
                            <LinkDropdown />
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
                    <div className={`ui active centered large text loader`}>Загрузка группы...</div>
                </div>
            </div>
        </div>
    );
}

export default Group;

