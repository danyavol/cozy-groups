import { Dropdown, Tab } from "semantic-ui-react";
import React, { useEffect, useState } from "react";
import "./postTab.css"
import { Link, useLocation, withRouter } from "react-router-dom";

function PostsTab(props) {

    const [posts, setPosts] = useState([]);


    useEffect(() => {
        setPosts(props.posts);
    }, [props.posts]);

    const postsCards = posts.map(post =>
        <div key={post.id} onClick={() => props.history.push('/groups/'+ props.match.params.id + '/post/' + post.id)} class="ui card custom-width">
            <div class="content">
                <p className="right floated"><i class="user icon"></i>{post.author.login}</p>
                <div class="header" >{post.title}</div>
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
                
               <Link color='black' to={"/groups/" + props.match.params.id + "/post/new"}><i className=" createPost plus huge icon"></i></Link> 
            </div>
        );
    }
    return (
        <div className="postTab">
            {postsCards}
            <Link color='black' to={"/groups/" + props.match.params.id + "/post/new"}><i className=" createPost plus huge icon"></i></Link> 
        </div>
    );
}


export default withRouter(PostsTab)