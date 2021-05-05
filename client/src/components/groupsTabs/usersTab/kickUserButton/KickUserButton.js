import axios from "axios";
import React from "react";

import "./kickUserButton.css";

export default function KickUserButton(props) {

    function userKick() {
        props.addLoadingUser(props.user.id);
        axios.delete('http://localhost:3080/groups/kick-user', {
            headers: {
                'Authorization': props.token
            },
            data: {
                groupId: props.groupId,
                userId: props.user.id
            }
        }).then(response => {
            if(response.data.ok) {
                console.log("Пользователь удален");
                props.usersChange(props.user.id);
                props.deleteLoadingUser(props.user.id);
            }
        }).catch((err) => {
            console.log(err);
        });
    }


    switch (props.totalUserRole) {
        case "owner":
            switch (props.user.role) {
                case "owner":
                    return <div></div>
                default:
                    return (
                        <div className="userKickButton" onClick={userKick}>
                            <i className="kickButton user times icon" ></i>
                        </div>
                    );
            }
        case "admin":
            switch (props.user.role) {
                case "owner":
                    return <div></div>
                case "admin":
                    return <div></div>
                default:
                    return (
                        <div className="userKickButton" onClick={userKick}>
                            <i className="kickButton user times icon" ></i>
                        </div>
                    );
            }
        default:
            console.log(props.totalUserRole);
            return <div></div>
    }
}