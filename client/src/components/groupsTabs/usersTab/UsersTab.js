import {useEffect, useState} from "react";

import "./usersTab.css";
import RoleDropdown from "./roleDropdown/RoleDropdown";
import KickUserButton from "./kickUserButton/KickUserButton";
import UserLoader from "../../loader/UserLoader";

export default function UsersTab(props) {
    return (
        <UsersRows group={props.group} token={props.token} changeUsers={props.changeUsers} />
    );
}

function UsersRows(props) {
    const [users, setUsers] = useState([]);
    const [usersRows, setUsersRows] = useState([]);
    const [userLoading, setUserLoading] = useState([]);
    const [totalUserRole, setTotalUserRole] = useState('');

    useEffect(() => {
        setUsers(props.group.users);
        props.group.users.forEach(user => {
            if (JSON.parse(localStorage.user).login === user.login)
                setTotalUserRole(user.role);
        });
        console.log(totalUserRole);
    }, [props.group]);

    useEffect(() => {
        setUsersRows(
            users.map((user) =>
                <div key={user.id} className="ui segment">
                    <div className="userSegmentRow">
                        <div className={`userSegment ${userLoading.toString().indexOf(user.id) > -1 ? 'hidden' : ''}`}>
                            <div className="userName">
                                <h2 className="fullName">{user.firstName} {user.lastName}</h2>
                                <h3 className="login">{user.login}</h3>
                            </div>
                            <div className="userRole">
                                <RoleDropdown
                                    role={user.role}
                                    id={user.id}
                                    groupId={props.group.id}
                                    token={props.token}

                                    totalUserRole={totalUserRole}

                                    addLoadingUser={handlerAddLoadingUser}
                                    deleteLoadingUser={handlerDeleteLoadingUser}
                                />
                            </div>
                            <div className="userKick">
                                <KickUserButton
                                    token={props.token}
                                    user={user}
                                    groupId={props.group.id}
                                    users={props.group.users}

                                    totalUserRole={totalUserRole}

                                    addLoadingUser={handlerAddLoadingUser}
                                    deleteLoadingUser={handlerDeleteLoadingUser}
                                    usersChange={handlerUsersChange}
                                />
                            </div>
                        </div>
                        <div className={userLoading.toString().indexOf(user.id) > -1 ? '' : 'hidden'}>
                            <UserLoader />
                        </div>
                    </div>
                </div>
            )
        );
    }, [users, userLoading]);

    const handlerDeleteLoadingUser = (id) => {
        let users = [];
        userLoading.forEach(elem => users.push(elem));
        const index = users.toString().indexOf(id);
        console.log("Index: " + index);
        if (index > -1) {
            users.splice(index, 1);
            setUserLoading(users);
            console.log("Slice: " + users);
        } else {
            setUserLoading(users);
        }
    }

    const handlerAddLoadingUser = (id) => {
        if (typeof userLoading === 'object') {
            let users = [];
            userLoading.forEach(elem => users.push(elem));
            users.push(id);
            setUserLoading(users);
        }
    }

    const handlerUsersChange = (deleteUserId) => {
        console.log(deleteUserId);
        const newUsers = [];
        users.map(user => {
            if (user.id !== deleteUserId)
                newUsers.push(user);
        });
        props.changeUsers(newUsers);
        setUsers(newUsers);
    }


    return (
        <div>{usersRows}</div>
    );
}