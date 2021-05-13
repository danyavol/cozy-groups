import {useCallback, useEffect, useState} from "react";

import "./usersTab.css";
import RoleDropdown from "./roleDropdown/RoleDropdown";
import KickUserButton from "./kickUserButton/KickUserButton";
import UserLoader from "../../loader/UserLoader";
import Loader from "../../loader/Loader";

export default function UsersTab(props) {
    return (
        <UsersRows group={props.group} token={props.token} changeUsers={props.changeUsers} />
    );
}

function UsersRows(props) {
    const [users, setUsers] = useState([]);
    const [usersRows, setUsersRows] = useState([]);
    const [userLoading, setUserLoading] = useState('');
    const [totalUserRole, setTotalUserRole] = useState('');
    const [totalUserId, setTotalUserId] = useState('');

    useEffect(() => {
        setUsers(props.group.users);
    }, [props.group]);


    useEffect(() => {
        props.group.users.forEach(user => {
            if (JSON.parse(localStorage.user).login === user.login) {
                if (user.role !== totalUserRole)
                    setTotalUserRole(user.role);
                if (user.id !== totalUserId)
                    setTotalUserId(user.id);
            }

        });
    }, [props.group]);


    const handlerChangeUserLoading = (value) => {
        setUserLoading(value);
    }

    const handleUsersChange = (usersList) => {
        setUsers(usersList);
        props.changeUsers(usersList);
    }


    const newUsers = users.map((user) =>
        <div key={user.id} className={`ui segment ${user.id === totalUserId ? 'totalUser' : ''}`}>
            <div className="userSegmentRow">
                <div className="userSegment">
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
                            loadingUser={userLoading}

                            newUsers={handleUsersChange}
                            changeLoadingUser={handlerChangeUserLoading}
                        />
                    </div>
                    <div className="userKick">
                        <KickUserButton
                            token={props.token}
                            user={user}
                            groupId={props.group.id}
                            users={props.group.users}

                            totalUserRole={totalUserRole}
                            loadingUser={userLoading}

                            changeUserLoading={handlerChangeUserLoading}
                            newUsers={handleUsersChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    if (userLoading)
        return (
          <Loader loading={true} text="Загрузка пользователей..."/>
        );
    else
        return (
            <div>{newUsers}</div>
        );
}