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

            dimmer: false,
            visibleLeaveModal: false,
            visibleErrorModal: false,
            visibleCreatePostModal: false,

            text: ''
        }

        this.leave = this.leave.bind(this);
        this.updateVisibleLeaveModal = this.updateVisibleLeaveModal.bind(this);
        this.updateVisibleErrorModal = this.updateVisibleErrorModal.bind(this);
        this.updateVisibleCreateModal = this.updateVisibleCreateModal.bind(this);
        this.openLeaveModal = this.openLeaveModal.bind(this);
        this.openCreatePostModal = this.openCreatePostModal.bind(this);
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
                <Modal
                    header={'Создать пост'}
                    visible={this.state.visibleCreatePostModal}
                    element={this.state.text}
                    updateVisible={this.updateVisibleCreateModal}
                />
                <Loader loading={this.state.loading} text={this.state.loaderText} />
                <Dimmer.Dimmable dimmed={this.state.dimmer} >
                    <Dimmer className='position' simple  />
                        <div className={this.state.loading ? 'hidden' : ''}>
                            <div className="header">
                                <div className="buttons">
                                    <SettingsDropdown leave={this.openLeaveModal} />
                                </div>
                                <div>
                                    <Title state={this.state} />
                                </div>
                            </div>
                            <div>
                                <Tabs state={this.state} createPost={this.openCreatePostModal}/>
                            </div>
                        </div>
                </Dimmer.Dimmable>
            </div>
        )
    }

    openLeaveModal() {
        if (this.state.visibleLeaveModal) {
            this.setState({visibleLeaveModal: false, dimmer: false });
        } else {
            this.setState({visibleLeaveModal: true, dimmer: true, text: 'Вы действительно хотите выйти из группы?' });
        }
    }

    openCreatePostModal() {
        if (this.state.visibleCreatePostModal) {
            this.setState({visibleCreatePostModal: false, dimmer: false});
        } else {
            this.setState({visibleCreatePostModal: true, dimmer: true, text: 'Создать пост?'});
        }
    }

    updateVisibleErrorModal() {
        this.setState({visibleErrorModal: false, dimmer: false});
    }

    updateVisibleLeaveModal() {
        this.setState({visibleLeaveModal: false, dimmer: false});
    }

    updateVisibleCreateModal() {
                this.setState({visibleCreatePostModal: false, dimmer: false});
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
            if (err.response)
                this.setState({text : err.response.data.message });
            else
                this.setState({text :'Ошибка соединения с сервером.' });
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
            render: () => <InviteTab inviteCode={props.state.group.inviteCode} copied={props.state.copied} />
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
                                <CopyToClipboard
                                    text={this.props.inviteCode}
                                    onCopy={() => this.setState({copied: true})}
                                >
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
    function userKick(event, userId, groupId, token) {
        event.preventDefault();
        console.log("userId: " + userId + "groupId: " + groupId);
        axios.delete('http://localhost:3080/groups/kick-user', {
            headers: {
                'Authorization': token
            },
            body: {
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

    if (props.role !== "owner") {
        return (
            <h2 onClick={(event) => userKick(event, props.userId, props.groupId, props.token)}><i className="kickButton user times icon" ></i></h2>
        );
    } else {
        return (
            <div></div>
        );
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

