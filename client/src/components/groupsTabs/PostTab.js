import { Dropdown, Tab } from "semantic-ui-react";
import React from "react";

export default function PostsTab(props) {
    return (
        <div className="postTab">
            <Tab.Pane attached={false}>Записи</Tab.Pane>
            <CreatePostButton />
        </div>
    );
}

const CreatePostButton = () => {
    return (
        <div className="createPost">
            <Dropdown
                icon={{ name: "plus", size: "huge" }}
                className="icon"
                direction="left"
            >
                <Dropdown.Menu>
                    <Dropdown.Item text="Создать пост" />
                    <Dropdown.Item text="Создать опрос" />
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}