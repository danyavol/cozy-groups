import {useEffect, useState} from "react";

export default function Users(props) {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        let users = [...props.group.users];
        let login = JSON.parse(localStorage.user).login;
        users.forEach(user => {
            if (login === user.login) {
                let index =users.indexOf(users.find(user => user.login === login));
                users.splice(index,1);
            }
        });
        setUsers(users);
    }, [users]);

    return(
        users.map((user) =>
            <div key={user.id} className="ui segment" onClick={() => props.function(user.id)}>
                <div className="userName">
                    <h2>{user.firstName} {user.lastName}</h2>
                    <div>{user.login}</div>
                </div>
            </div>
    ));   
}