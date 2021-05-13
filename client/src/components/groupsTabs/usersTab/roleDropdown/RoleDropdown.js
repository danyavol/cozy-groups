import { Dropdown } from "semantic-ui-react";
import React, { useState } from "react";
import axios from "axios";
import './roleDropdown.css';

export default function RoleDropdown(props) {
    const [currentRole, setCurrentRole] = useState(props.role);
    const rolesForOwner = [
        {
            key: "admin",
            text: "Admin",
            value: "admin",
            className: "role-admin"
        },
        {
            key: "editor",
            text: "Editor",
            value: "editor",
            className: "role-editor"
        },
        {
            key: "member",
            text: "Member",
            value: "member",
            className: "role-member"
        }
    ];
    const rolesForAdmin = [
        {
            key: "editor",
            text: "Editor",
            value: "editor",
            className: "role-editor"
        },
        {
            key: "member",
            text: "Member",
            value: "member",
            className: "role-member"
        }
    ];

    const handleChangeRole = (event) => {
        const newRole = event.target.innerText.toLowerCase();
        const selectedElem = event.target.classList.contains('item') ? event.target : event.target.parentNode;

        selectedElem.classList.remove('role-' + currentRole);
        selectedElem.classList.add('role-' + newRole);
        setCurrentRole(newRole);

        props.changeLoadingUser(true);
        let data = { groupId: props.groupId, userId: props.id, newRole: newRole }
        axios.post('http://localhost:3080/groups/edit-role', data, {
            headers: {
                'Authorization': props.token
            }
        })
            .then(response => {
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
                        })
                }
            })
            .catch(error => {
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
                    return <div className="role-owner">Owner</div>
                default:
                    return (
                        <Dropdown
                            inline
                            options={rolesForOwner}
                            defaultValue={currentRole}
                            className={'role-' + currentRole}
                            onChange={handleChangeRole}
                            renderLabel={renderLabel}
                        />
                    );
            }
        case "admin":
            switch (props.role) {
                case "owner":
                    return <div className="role-owner">Owner</div>
                case "admin":
                    return <div className="role-admin">Admin</div>
                default:
                    return (
                        <Dropdown
                            inline
                            options={rolesForAdmin}
                            defaultValue={currentRole}
                            className={'role-' + currentRole}
                            onChange={handleChangeRole}
                        />
                    );
            }
        default:
            switch (props.role) {
                case "owner":
                    return <div className="role-owner">Owner</div>
                case "admin":
                    return <div className="role-admin">Admin</div>
                case "editor":
                    return <div className="role-editor">Editor</div>
                case "member":
                    return <div className="role-member">Member</div>
                default:
                    return ''
            }
    }
}