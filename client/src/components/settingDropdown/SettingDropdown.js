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
                <Dropdown.Item>Изменить название группы</Dropdown.Item>
                <Dropdown.Item>Передать права владельца</Dropdown.Item>
                <Dropdown.Item onClick={props.leave}>Выйти из группы</Dropdown.Item>
                <Dropdown.Item onClick={props.delete}>Удалить группу</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}