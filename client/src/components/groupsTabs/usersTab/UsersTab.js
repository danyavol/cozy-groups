import {useEffect, useState} from "react";

import "./usersTab.css";
import RoleDropdown from "./roleDropdown/RoleDropdown";
import KickUserButton from "./kickUserButton/KickUserButton";
import Loader from "../../loader/Loader";
import UserLoader from "../../loader/UserLoader";

export default function UsersTab(props) {
    return (
        <UsersRows group={props.group} token={props.token} changeUsers={props.changeUsers} />
    );
}

function UsersRows(props) {
    const [users, setUsers] = useState([]);
    const [usersRows, setUsersRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState([]);
    const [totalUserRole, setTotalUserRole] = useState('');

    useEffect(() => {
        setUsers(props.group.users);
        props.group.users.forEach(user => {
            if (JSON.parse(localStorage.user).login === user.login)
                setTotalUserRole(user.role);
        });
    }, [props.group]);

    useEffect(() => {
        setUsersRows(
            users.map((user) =>
                <div className="ui segment userSegment" key={user.id}>
                    <div className={`contentRow ${userLoading.toString().indexOf(user.id) > -1 ? 'hidden' : ''}`}>
                        <div className="userName">
                            <h2 className="">{user.firstName} {user.lastName}</h2>
                            <div className="">{user.login}</div>
                        </div>
                        <div className="userRole">
                            <h2>
                                <RoleDropdown
                                    role={user.role}
                                    id={user.id}
                                    groupId={props.group.id}
                                    token={props.token}

                                    totalUserRole={totalUserRole}

                                    addLoadingUser={handlerAddLoadingUser}
                                    deleteLoadingUser={handlerDeleteLoadingUser}
                                />
                            </h2>
                        </div>
                        <div className="userKick">
                            <KickUserButton
                                token={props.token}
                                user={user}
                                groupId={props.group.id}
                                users={props.group.users}

                                totalUserRole={totalUserRole}

                                loaderChange={handlerLoaderChange}
                                usersChange={handlerUsersChange}
                            />
                        </div>
                    </div>
                    <div className={userLoading.toString().indexOf(user.id) > -1 ? '' : 'hidden'}>
                        <UserLoader />
                    </div>
                </div>
            )
        );
    }, [users, userLoading]);

    // const userIsLoading = (id) => {
    //     if (typeof userLoading === 'object')
    //         userLoading.forEach(obj => {
    //             if (obj.id === id)
    //                 return true
    //         });
    //     else
    //         return false;
    // }

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
        console.log(userLoading);
        console.log(users);
        console.log(usersRows);
    }

    const handlerLoaderChange = (value) => {
        setLoading(value);
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

    if (loading) {
        return (
            <Loader loading={loading} text="Загрузка пользователей..." />
        );
    } else {
        return (
            <div className={`row ${loading ? 'hidden' : ''}`}>{usersRows}</div>
        );
    }
}