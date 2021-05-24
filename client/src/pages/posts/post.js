import axios from "axios";
import { post } from "jquery";
import { Fragment, useEffect, useState } from "react";
import { useParams, withRouter } from "react-router-dom"
import Loader from "../../components/loader/Loader";
import DateParser from '../../services/dateParserService';

function Post(props) {

    const [post, setPost] = useState({});
    const [author, SetAuthor] = useState("");
    const [loading, setLoading] = useState(true);
    const [loaderText, setLoaderText] = useState("Загрузка поста...");
    const [commentLoading, setCommentLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [totalComments, setTotalComments] = useState(0);
    const [inputComment, setInputComment] = useState("");
    const postId = useParams().postid;
    const params = useParams();

    
    const allComments = comments.map((comment) =>
        <div class="comment">
            <a class="avatar">
                <img src="/images/avatar/small/joe.jpg" />
            </a>
            <div class="content">
                <a class="author">{comment.author.firstName} {comment.author.lastName}</a>
                <div class="metadata">
                    <span class="date">{DateParser.beautify(new Date(comment.createdAt))}</span>
                </div>
                <div class="text">{comment.text} </div>
            </div>
        </div>);

    useEffect(() => {
        if (props.token !== null) {
            console.log(params.postid);
            setLoading(true);
            axios.get('http://localhost:3080/posts/' + props.match.params.id + '/post/' + postId, {
                headers: {
                    'Authorization': props.token
                }
            })
                .then(response => {
                    const { ok, post } = response.data;
                    if (ok) {
                        setLoading(false);
                        setPost(post);
                        setComments(post.comments);
                        setTotalComments(post.totalComments)
                        setInputComment("");
                        SetAuthor(post.author.firstName + ' ' + post.author.lastName);
                    }
                })
        }
    }, [props.token, props.match.params.id, postId])

const handleInputCommentChange =(e) => {
    setInputComment(e.target.value);
}

    const addComment = () => {
        setCommentLoading(true);
        let data ={text:inputComment};
        axios.post('http://localhost:3080/posts/' + props.match.params.id + '/comment/' + postId,data,{
            headers: {
                'Authorization': props.token
            }
        }).then(response => {
            let comment = response.data.comment;
            let newComments = comments;
            newComments.push(comment);
            setInputComment("");
            let total = totalComments + 1;
            setTotalComments(total);
            setComments(newComments);
            setCommentLoading(false);
        })
    }

    return (
        <Fragment>
            <Loader loading={loading} text={loaderText} />
            <div className={loading ? 'hidden' : ''}>

                <div className="ui segment">
                    <div className={`post-header`}>
                        <p><i className="user icon"></i> {author} </p>
                        <p><i className="calendar icon"></i> {DateParser.beautify(new Date(post.createdAt))} </p>
                    </div>
                    <h2 className={'post-title'}>{post.title}</h2>
                    <div className="ui divider"></div>
                    <h3>{post.description}</h3>
                </div>
                <div className="ui segment">
                    <h1>Комментарии {totalComments}</h1>
                    <div class="ui minimal comments">
                        {allComments}
                        <form className="ui reply form">
                            <div className={`field ${commentLoading ? 'disabled' : ''}`}>
                                <textarea
                                    value={inputComment}
                                    onChange={handleInputCommentChange}
                                    placeholder="Введите описание...">
                                </textarea>
                            </div>
                            <div onClick={addComment} className={`ui blue labeled submit icon button ${commentLoading ? 'loading' : ''}`}><i className="icon edit"></i> Добавить ответ </div>
                        </form>
                    </div>
                </div>
            </div>

        </Fragment>
    );
}
export default withRouter(Post)