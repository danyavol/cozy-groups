import { Tab } from "semantic-ui-react";
import React from "react";
import PostsTab from "./postTab/PostTab";
import InviteTab from "./InviteTab";
import UsersTab from "./usersTab/UsersTab";

export default function Tabs(props) {

    const panes = [
        {
            menuItem:
                { key: 'posts', icon: 'book', content: 'Записи группы' },
            render: () => <PostsTab posts={props.posts} createPost={props.createPost} group={props.group} />
        },
        {
            menuItem:
                { key: 'users', icon: 'users', content: 'Пользователи' },
            render: () => <UsersTab
                token={props.token}
                group={props.group}
                changeUsers={props.changeUsers}
            />
        },
        {
            menuItem:
                { key: 'invite', icon: 'linkify', content: 'Код приглашения' },
            render: () => <InviteTab
                groupId={props.group.id}
                inviteCode={props.group.inviteCode}
                token={props.token}
            />
        }
    ];

    if (props.role === "member" || props.role === "editor") {
        panes.pop();
    }

    return (
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    );
}