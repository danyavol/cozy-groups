import { Dropdown, Tab } from "semantic-ui-react";
import React, { useEffect, useState } from "react";
import "./postTab.css"
import { Link, useLocation, withRouter } from "react-router-dom";
import DateParser from '../../../services/dateParserService';

function PostsTab(props) {

    const [posts, setPosts] = useState([]);


    useEffect(() => {
        setPosts(props.posts);
        console.log(props.posts);
    }, [props.posts]);

    const postsCards = posts.map(post =>
        <div key={post.id} onClick={() => props.history.push('/groups/'+ props.match.params.id + '/post/' + post.id)} className="ui card custom-width pointer post-element">
            <div className="content">
                <p className="right floated"><i className="user icon"></i>{post.author.firstName} {post.author.lastName}</p>
                <div className="header" >{post.title}</div>
                <div className="description">
                    <p className="word-break">{post.description}</p>
                </div>
            </div>
            <div className="extra content">
                <span className="left floated like"><i className="comment icon"></i>{post.totalComments}</span>
                <span className="right floated star"><i className="calendar icon"></i>{DateParser.beautify(new Date(post.createdAt))}</span>
            </div>
        </div>
    );

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