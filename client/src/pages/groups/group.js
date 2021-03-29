import React from 'react';
import {Dimmer, Dropdown, Tab} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";
import Modal from '../../components/modal/modal.js';
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";

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
            loaderText: 'Загрузка группы...',

            open:false,
            dimmer:false,
            header:'Выход',
            text:'',
            type:'',
            function:null,
        }

        this.leave = this.leave.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    render() {
        return (
            <div>
                <Loader loading={this.state.loading} text={this.state.loaderText} />
                    <Modal
                         header={this.state.header}
                         visible={this.state.open}
                         element={this.state.text}
                         updateVisible={this.openModal}
                         function={this.state.function}
                         dimmer={this.state.dimmer}
                         type={this.state.type}
                    >
                        <div className={this.state.loading ? 'hidden' : ''}>
                            <div className="header">
                                <div className="buttons">
                                    <SettingsDropdown leave={() => this.openModal(`Выход`,`Хотите выйти из группы "${this.state.group.name}"?`,this.leave,"action")} />
                                </div>
                                <div>
                                    <Title state={this.state} />
                                </div>
                            </div>
                            <div>
                                <Tabs openModal={this.openModal} state={this.state} />
                            </div>
                        </div>                        
                    </Modal>
            </div>
        )
    }

    openModal( header, text, func, type) {
        if(this.state.open) {
            this.setState({open : false, dimmer : false });
        }
        else {
            this.setState({open : true, dimmer : true, header:header, text: text, type : type, function: func});
        }
    }

    leave() {
        this.setState({loading : true, loaderText : 'Выход из группы...', open : false, dimmer : false});
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
            this.setState({loading : false,open : true});
            this.props.deleteToken(err);
            if (err.response) this.setState({header:`Ошибка`,text : `${err.response.data.message}`,type: `${`error`}`, function:this.openModal });
            else
            {
                this.setState({text :'Ошибка соединения с сервером.' });
                setTimeout(() => {this.props.history.push("/");},3000);
            } 
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
        if(this.state.text !== prevState.text) {
            let sometext = this.state.text;
            this.setState({text : sometext});
        }
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
                {key: 'posts', icon: 'sticky note', content: 'Все записи'},
            render: () => <PostsTab createPost={props.createPost} />
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
            render: () => <InviteTab inviteCode={props.state.group.inviteCode} copied={props.state.copied} openModal={props.openModal} />
        }
    ];

    const GroupTabs = () => (
        <Tab menu={{secondary: true, pointing: true}} panes={panes} />
    );

    return (<GroupTabs />);
}

// Вкладка постов.
function PostsTab(props) {
    return (
        <div className="postTab">
            <Tab.Pane attached={false}>Записи</Tab.Pane>
            <CreatePostButton />
        </div>
    );
}

function CreatePostButton() {
    return (
        <div className="createPost">
            <Dropdown
                icon={{name: "big plus", size: "huge"}}
                className="icon"
                direction="left"
            >
                <Dropdown.Menu>
                    <Dropdown.Item text="Создать пост" />
                    <Dropdown.Item text="Создать опрос" />
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

// Инвайт вкладка.
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
                                <CopyToClipboard text={this.props.inviteCode}  onCopy={() => {this.setState({copied: true});this.props.openModal('Уведомление','Код успешно скопирован!','','notification')}}>
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

// Вкладка пользователей.
function UsersMenu(props) {
    if (props.state.group.length !== 0){
        return (
            <table className="ui very basic collapsed single line table">
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
                <td>
                    <div className="content">
                        <h2>{user.firstName} {user.lastName}</h2>
                        <div className="sub header">{user.login}</div>
                    </div>
                </td>
                <td className="center aligned">
                    <h2><RoleDropdown role={user.role} /></h2>
                </td>
                <td className="center aligned">
                    <KickUserButton
                        role={user.role}
                        token={props.state.token}
                        userId={user.id}
                        groupId={props.state.group.id}
                    />
                </td>
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

function RoleDropdown(props) {
    const roles = [
        {
            key: "admin",
            text: "Admin",
            value: "admin",
        },
        {
            key: "member",
            text: "Member",
            value: "member"
        }
    ];

    if (props.role === "owner") {
        return (
            <div>Owner</div>
        );
    } else {
        return (
            <Dropdown
                inline
                options={roles}
                defaultValue={props.role}
            />
        );
    }
}

function KickUserButton(props) {
    if (props.role !== "owner") {
        return (
            <h2><i className="kickButton user times icon" ></i></h2>
        );
    } else {
        return (
            <div></div>
        );
    }
}

function userKick(userId, groupId, token) {
    axios.delete('http://localhost:3080/groups/kick-user', {
        headers: {
            'Authorization': token
        },
        data: {
            groupId: groupId,
            userId: userId
        }
    }).
    then(response => {
        if(response.data.ok) {
        }
    })
        .catch((err) => {
            console.log(err);
        });
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

export default withRouter(Group);

