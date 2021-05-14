import axios from "axios";
import React from "react";

import "./kickUserButton.css";

export default function KickUserButton(props) {

    function userKick() {
        props.changeUserLoading(true);
        axios.delete('http://localhost:3080/groups/kick-user', {
            headers: {
                'Authorization': props.token
            },
            data: {
                groupId: props.groupId,
                userId: props.user.id
            }
        }).then(response => {
            if (response.data.ok) {
                axios.get('http://localhost:3080/groups/' + props.groupId, {
                    headers: {
                        'Authorization': props.token
                    }
                })
                    .then(response => {
                        if (response.data.ok) {
                            props.newUsers(response.data.group.users);
                            props.changeLoadingUser(false);
                        }
                    });
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
                            <i className="kickButton user times icon big" ></i>
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
                            <i className="kickButton user times icon big" ></i>
                        </div>
                    );
            }
        default:
            return <div></div>
    }
}