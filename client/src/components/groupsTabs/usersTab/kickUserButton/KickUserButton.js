import axios from "axios";
import React from "react";

import "./kickUserButton.css";

export default function KickUserButton(props) {

    function userKick() {
        props.loaderChange(true);
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
                props.loaderChange(false);
            }
        }).catch((err) => {
            console.log(err);
        });
    }


    if (props.user.role !== "owner") {
        return (
            <h2
                onClick={userKick}
            >
                <i className="kickButton user times icon" ></i>
            </h2>
        );
    } else {
        return (
            <div></div>
        );
    }
}