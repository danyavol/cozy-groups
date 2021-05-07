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
    const [userLoading, setUserLoading] = useState('');
    const [totalUserRole, setTotalUserRole] = useState('');

    useEffect(() => {
        setUsers(props.group.users);
    }, [props.group]);


    useEffect(() => {
        props.group.users.forEach(user => {
            if (JSON.parse(localStorage.user).login === user.login)
                if (user.role !== totalUserRole)
                    setTotalUserRole(user.role);
        });
        console.log(totalUserRole);
    }, );


    const handlerChangeUserLoading = (id) => {
        if (userLoading === '')
            setUserLoading(id);
        else
            setUserLoading('');
    }



    // useEffect(() => {
    //     console.log(usersRows);
    //     setUsersRows(
    //         users.map((user) =>
    //             <div key={user.id} className="ui segment">
    //                 <div className="userSegmentRow">
    //                     <div className={`userSegment ${userLoading === user.id ? 'hidden' : ''}`}>
    //                         <div className="userName">
    //                             <h2 className="fullName">{user.firstName} {user.lastName}</h2>
    //                             <h3 className="login">{user.login}</h3>
    //                         </div>
    //                         <div className="userRole">
    //                             <RoleDropdown
    //                                 role={user.role}
    //                                 id={user.id}
    //                                 groupId={props.group.id}
    //                                 token={props.token}
    //
    //                                 totalUserRole={totalUserRole}
    //                                 loadingUser={userLoading}
    //
    //                                 changeLoadingUser={handlerChangeUserLoading}
    //                             />
    //                         </div>
    //                         <div className="userKick">
    //                             <KickUserButton
    //                                 token={props.token}
    //                                 user={user}
    //                                 groupId={props.group.id}
    //                                 users={props.group.users}
    //
    //                                 totalUserRole={totalUserRole}
    //                                 loadingUser={userLoading}
    //
    //                                 changeUserLoading={handlerChangeUserLoading}
    //                                 usersChange={handlerUsersChange}
    //                             />
    //                         </div>
    //                     </div>
    //                     <div className={userLoading === user.id ? '' : 'hidden'}>
    //                         <UserLoader />
    //                     </div>
    //                 </div>
    //             </div>
    //         )
    //     );
    // }, [users, userLoading]);



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

    const newUsers = users.map((user) =>
        <div key={user.id} className="ui segment">
            <div className="userSegmentRow">
                <div className={`userSegment ${userLoading === user.id ? 'hidden' : ''}`}>
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
                            usersChange={handlerUsersChange}
                        />
                    </div>
                </div>
                <div className={`loader ${userLoading === user.id ? '' : 'hidden'}`}>
                    <UserLoader />
                </div>
            </div>
        </div>
    );


    return (
        <div>{newUsers}</div>
    );
}