import {useEffect, useState} from "react";
import {Tab} from "semantic-ui-react";

import "./usersTab.css";
import RoleDropdown from "./RoleDropdown";
import KickUserButton from "./KickUserButton";

export default function UsersTab(props) {
    return (
        <Tab.Pane attached={false}>
            <table className="ui very basic collapsed single line table">
                <UsersRows group={props.group}/>
            </table>
        </Tab.Pane>
    );
}

function UsersRows(props) {
    const [users, setUsers] = useState([]);
    const [usersRows, setUsersRows] = useState([]);

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
                        <h2><RoleDropdown role={user.role} /></h2>
                    </td>
                    <td className="center aligned">
                        <KickUserButton
                            role={user.role}
                            token={props.token}
                            userId={user.id}
                            groupId={props.group.id}
                            kickUser={props.kickUser}
                        />
                    </td>
                </tr>
            )
        );
    }, [users]);

    return (
        <tbody>{usersRows}</tbody>
    );
}