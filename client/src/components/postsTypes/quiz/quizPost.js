import { Fragment, useEffect, useState  } from "react";
import { Form, Checkbox } from 'semantic-ui-react';
import DateParser from '../../../services/dateParserService';
import axios from "axios";
import { withRouter } from "react-router-dom";
import OneUserQuiz from "./quizTypes/OneUserQuiz";

function QuizPost(props) {

    const [answer, setAnswer] = useState("");

    useEffect(() => {
        setAnswer("")
    },[])

    const addVote = () => {
        props.updateLoading(true);
        let data = { selectedOptions: answer, removeVote: false };
        axios.post('http://localhost:3080/posts/' + props.match.params.id + '/vote-quiz/' + props.post.id, data, {
            headers: {
                'Authorization': props.token
            }
        }).then(response => {
            axios.get('http://localhost:3080/posts/' + props.match.params.id + '/post/' + props.post.id, {
                headers: {
                    'Authorization': props.token
                }
            })
                .then(response => {
                    const { ok, post } = response.data;
                    if (ok) {
                        props.updatePost(post);
                    }
                })
        }).catch(e => {
            props.updateLoading(false);
            console.log(e.response);
        })
    }

    const updateData = (value) => {
        setAnswer(value);
    }

    return (
        <Fragment>
            <div className="ui segment">
                <div className={`post-header`}>
                    <p><i className="user icon"></i> {props.author} </p>
                    <p><i className="calendar icon"></i> {DateParser.beautify(new Date(props.post.createdAt))} </p>
                </div>
                <h2 className={'post-title'}>{props.post.title}</h2>

                <div className="ui divider"></div>
                <Form>
                    <OneUserQuiz
                        post={props.post}
                        update={updateData}
                    />
                    <Form.Field>
                        <a onClick={addVote} className={'ui huge button'}>Отправить</a>
                    </Form.Field>
                </Form>
            </div>
        </Fragment>
    );
}

export default withRouter(QuizPost);