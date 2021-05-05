import {Dropdown} from "semantic-ui-react";
import React from "react";

export default function SettingsDropdown(props) {
    return (
        <Dropdown
            icon="settings"
            floating
            button
            direction="left"
            className="icon"
        >
            <Dropdown.Menu>
                <Dropdown.Header  content="Настройки" />
                <Dropdown.Divider />
                {props.role === "admin" || props.role ==="owner" ? <Dropdown.Item onClick={props.change}>Изменить название группы</Dropdown.Item>  : ""}
                {props.role === "owner" ? <Dropdown.Item onClick={props.transfer}>Передать права владельца</Dropdown.Item>  : ""}
                {props.role !== "owner" ? <Dropdown.Item onClick={props.leave}>Выйти из группы</Dropdown.Item> : ""}
                {props.role === "owner" ? <Dropdown.Item onClick={props.delete}>Удалить группу</Dropdown.Item>  : ""}
            </Dropdown.Menu>
        </Dropdown>
    )
}