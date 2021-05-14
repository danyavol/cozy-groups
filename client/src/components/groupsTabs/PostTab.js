import { Dropdown, Tab } from "semantic-ui-react";
import React, { useEffect, useState } from "react";
import "./postTab.css"

export default function PostsTab(props) {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        setPosts(props.posts);
    }, [props.posts]);

    const postsCards = posts.map(post =>
        <div class="ui card custom-width">
            <div class="content">
                <p className="right floated"><i class="user icon"></i>{post.author.login}</p>
                <div class="header">{post.title}</div>
                <div class="description">
                    <p className="word-break">{post.description}</p>
                </div>
            </div>
            <div class="extra content">
                <span class="left floated like"><i class="comment icon"></i>{post.totalComments}</span>
                <span class="right floated star"><i class="calendar icon"></i>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
        </div>
    )
    if (posts.length === 0) {
        return (
            <div className="postTab">
                <div className="null-posts">
                    <h2>У вас ещё нет постов :(</h2>
                </div>
               
                <CreatePostButton createPost={props.createPost} />
            </div>
        );
    }
    return (
        <div className="postTab">
            {postsCards}
            <CreatePostButton createPost={props.createPost} />
        </div>
    );
}

const CreatePostButton = (props) => {
    return (
        <div className="createPost">
            <Dropdown
                icon={{ name: "plus", size: "huge" }}
                className="icon"
                direction="left"
            >
                <Dropdown.Menu>
                    <Dropdown.Item onClick={props.createPost} text="Создать пост" />
                    <Dropdown.Item text="Создать опрос" />
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}