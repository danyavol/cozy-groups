import {useEffect, useState} from "react";
import {Tab} from "semantic-ui-react";

import "./usersTab.css";
import RoleDropdown from "./roleDropdown/RoleDropdown";
import KickUserButton from "./kickUserButton/KickUserButton";
import Loader from "../../loader/Loader";

export default function UsersTab(props) {
    return (
        <Tab.Pane attached={false}>
            <table className="ui very basic collapsed single line table">
                <UsersRows group={props.group} token={props.token} changeUsers={props.changeUsers} />
            </table>
        </Tab.Pane>
    );
}

function UsersRows(props) {
    const [users, setUsers] = useState([]);
    const [usersRows, setUsersRows] = useState([]);
    const [loading, setLoading] = useState(false);
    console.log(props);

    useEffect(() => {
        setUsers(props.group.users);
    }, [props.group]);


    useEffect(() => {
        setUsersRows(
            users.map((user) =>
                <tr key={user.id}>
                    <td>
                        <div className="content">
                            <h2>{user.firstName} {user.lastName}</h2>
                            <div className="sub header">{user.login}</div>
                        </div>
                    </td>
                    <td className="center aligned">
                        <h2><RoleDropdown role={user.role}/></h2>
                    </td>
                    <td className="center aligned">
                        <KickUserButton
                            token={props.token}
                            user={user}
                            groupId={props.group.id}

                            users={props.group.users}

                            loaderChange={handlerLoaderChange}
                            usersChange={handlerUsersChange}
                        />
                    </td>
                </tr>
            )
        );
    }, [users]);

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
        )
    }
    return (
        <tbody className={loading ? 'hidden' : ''} >{usersRows}</tbody>
    );

}