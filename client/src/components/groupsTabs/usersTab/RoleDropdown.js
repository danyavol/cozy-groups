import {Dropdown} from "semantic-ui-react";
import React from "react";

export default function RoleDropdown(props) {
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

    if (props.role === "owner") {
        return (
            <div>Owner</div>
        );
    } else {
        return (
            <Dropdown
                inline
                options={roles}
                defaultValue={props.role}
            />
        );
    }
}