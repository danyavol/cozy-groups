import React from 'react';
import {Tab} from 'semantic-ui-react';

import './group.css';
import axios from "axios";

class Group extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            group: {},
            id: '',
            name: '',

            token: '',
            loading: false
        }
    }

    render() {

        return (

            <div>
                <div className="header">
                    <div className="buttons">
                        <button className="ui icon button"><i className="linkify icon"></i></button>
                        <button className="ui icon button"><i className="cogs icon"></i></button>
                    </div>
                    <div>
                        <GroupTitle state={this.state} />
                    </div>
                </div>
                <div>
                    <Tabs state={this.state} />
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.setState({token: this.props.token, loading: true});
        this.setState({loading: true});
        axios.get('http://localhost:3080/groups/' + this.props.match.params.id, {
            headers: {
                'Authorization': this.props.token
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.setState({loading: true});
            axios.get('http://localhost:3080/groups/' + this.props.match.params.id, {
                headers: {
                    'Authorization': this.props.token
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


}

function GroupTitle(props) {
    if (props.state.loading) {
        return (
            <div className="ui placeholder">
                <div className="header">
                    <div className="full line"></div>
                </div>
            </div>
        )
    } else if (props.state.group.length !== 0) {
        return (
            <h1>{props.state.group.name}</h1>
        )
    } else {
        return (<div></div>)
    }
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
                <UsersRows users={props.state.group.users}/>
            </table>
        )
    } else {
        return (
            <h1>Users</h1>
        )
    }
}

function UsersRows(props) {
    console.log(props.users);
    if (props.users.length !== 0) {
        const users = props.users;
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

export default Group;

