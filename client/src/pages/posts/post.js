import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { withRouter } from "react-router-dom"
import Loader from "../../components/loader/Loader";

function Post(props) {

    const [post, setPost] = useState({});
    const [author, SetAuthor] = useState("");
    const [loading, setLoading] = useState(true);
    const [loaderText, setLoaderText] = useState("Загрузка поста...")

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:3080/posts/' + props.match.params.id + '/post/' + props.match.params.postid, {
            headers: {
                'Authorization': props.token
            }
        })
            .then(response => {
                if (response.data.ok) {
                    setLoading(false);
                    setPost(response.data.post);
                    SetAuthor(response.data.post.author.login)
                    console.log(response.data.post);
                }
            })
    }, [props.token, props.match.params.id, props.match.params.postid])

    return (
        <Fragment>
            <Loader loading={loading} text={loaderText} />
            <div className={loading ? 'hidden' : ''}>
                <div className={``}>

                    <p className="right floated"><i class="user icon"></i> {author} {new Date(post.createdAt).toLocaleString()}</p>
                </div>
                <div className="ui segment">
                    <h2>{post.title}</h2>
                    <div className="ui divider"></div>
                    <h3>{post.description}</h3>
                </div>
                <div className="ui segment">
                    <h1>Комментарии {post.totalComments}</h1>
                    <div class="ui minimal comments">
                        <div class="comment">
                            <a class="avatar">
                                <img src="/images/avatar/small/matt.jpg" />
                            </a>
                            <div class="content">
                                <a class="author">Matt</a>
                                <div class="metadata">
                                    <span class="date">Сегодня вечером в 5:42</span>
                                </div>
                                <div class="text">Как артистично! </div>
                            </div>
                        </div>
                        <div class="comment">
                            <a class="avatar">
                                <img src="/images/avatar/small/elliot.jpg" />
                            </a>
                            <div class="content">
                                <a class="author">Elliot Fu</a>
                                <div class="metadata">
                                    <span class="date">Вчера в 12:30 утра</span>
                                </div>
                                <div class="text">
                                    <p>Это будет очень полезно для моих исследований. Спасибо!</p>
                                </div>
                            </div>
                        </div>
                        <div class="comment">
                            <a class="avatar">
                                <img src="/images/avatar/small/joe.jpg" />
                            </a>
                            <div class="content">
                                <a class="author">Джо Хендерсон</a>
                                <div class="metadata">
                                    <span class="date">5 дней назад</span>
                                </div>
                                <div class="text">Чувак, это удивительно. Огромное спасибо. </div>
                            </div>
                        </div>
                        <form class="ui reply form">
                            <div class="field">
                                <textarea></textarea>
                            </div>
                            <div class="ui blue labeled submit icon button"><i class="icon edit"></i> Добавить ответ </div>
                        </form>
                    </div>
                </div>
            </div>

        </Fragment>
    );
}
export default withRouter(Post)