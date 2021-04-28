import {Dropdown} from "semantic-ui-react";
import React, {useState} from "react";
import axios from "axios";

export default function RoleDropdown(props) {
    const [currentRole, setCurrentRole] = useState(props.role);
    const roles = [
        {
            key: "admin",
            text: "Admin",
            value: "admin",
        },
        {
            key: "member",
            text: "Member",
            value: "member"
        }
    ];

    const handleChangeRole = (value) => {
        console.log(value);
        props.addLoadingUser(props.id);
        let data = {groupId : props.groupId, userId : props.id, newRole : value.target.innerText.toLowerCase()}
        console.log(data);
        axios.post('http://localhost:3080/groups/edit-role', data, {
           headers: {
               'Authorization' : props.token
           }
        }).
        then(response => {
            if (response.data.ok) {
                console.log("Смена Роли");
                props.deleteLoadingUser(props.id);
            }
        }).
        catch(error => {
            console.log(error);
        });
    }

    if (props.role === "owner") {
        return (
            <div>Owner</div>
        );
    } else {
        return (
            <Dropdown
                inline
                options={roles}
                defaultValue={currentRole}
                onChange={handleChangeRole}
            />
        );
    }

    function hi() {
        props.deleteLoadingUser(props.id);
    }
}