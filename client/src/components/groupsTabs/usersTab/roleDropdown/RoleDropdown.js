import {Dropdown} from "semantic-ui-react";
import React, {useState} from "react";
import axios from "axios";

export default function RoleDropdown(props) {
    const [currentRole, setCurrentRole] = useState(props.role);
    const rolesForOwner = [
        {
            key: "admin",
            text: "Admin",
            value: "admin",
            color: "red"
        },
        {
            key: "editor",
            text: "Editor",
            value: "editor"
        },
        {
            key: "member",
            text: "Member",
            value: "member"
        }
    ];
    const rolesForAdmin = [
        {
            key: "editor",
            text: "Editor",
            value: "editor"
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

    const renderLabel = (option) => ({
        color: option.color,
        content: option.text
    });

    switch (props.totalUserRole) {
        case "owner":
            switch (props.role) {
                case "owner":
                    return <div>Owner</div>
                default:
                    return (
                        <Dropdown
                            inline

                            options={rolesForOwner}
                            defaultValue={currentRole}
                            onChange={handleChangeRole}
                            renderLabel={renderLabel}
                        />
                    );
            }
        case "admin":
            switch (props.role) {
                case "owner":
                    return <div>Owner</div>
                case "admin":
                    return <div>Admin</div>
                default:
                    return (
                        <Dropdown
                            inline
                            options={rolesForAdmin}
                            defaultValue={currentRole}
                            onChange={handleChangeRole}
                        />
                    );
            }
        default:
            switch (props.role) {
                case "owner":
                    return <div>Owner</div>
                case "admin":
                    return <div>Admin</div>
                case "editor":
                    return <div>Editor</div>
                case "member":
                    return <div>Member</div>
            }
    }
}