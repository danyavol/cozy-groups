import {Dropdown} from "semantic-ui-react";
import React, {useState} from "react";

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

    const handleChangeRole = (data) => {
        console.log(data.target.innerText);
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
}