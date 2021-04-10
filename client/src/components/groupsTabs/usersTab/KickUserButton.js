import axios from "axios";
import React, {useState} from "react";

export default function KickUserButton(props) {
    function userKick(event) {
        event.preventDefault();
        console.log("userId: " + props.userId + " groupId: " + props.groupId);
        axios.delete('http://localhost:3080/groups/kick-user', {
            headers: {
                'Authorization': props.token
            },
            data: {
                groupId: props.groupId,
                userId: props.userId
            }
        }).
        then(response => {
            if(response.data.ok) {
                console.log("Пользователь удален");
                props.kickUser();
            }
        })
            .catch((err) => {
                console.log(err);

            });
    }

    if (props.role !== "owner") {
        return (
            <h2
                onClick={(event) =>
                    userKick(event)}
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