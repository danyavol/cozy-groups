import { Fragment, useEffect, useState } from "react";
import { Form } from 'semantic-ui-react';
import DateParser from '../../../services/dateParserService';
import axios from "axios";
import { withRouter } from "react-router-dom";
import OneUserQuiz from "./quizTypes/OneUserQuiz";
import MultipleQuiz from "./quizTypes/MultipleQuiz";
import SingleQuiz from "./quizTypes/SingleQuiz";

function QuizPost(props) {

    const [answer, setAnswer] = useState([]);

    useEffect(() => {
        setAnswer([])
    }, [])


    const user = JSON.parse(localStorage.getItem('user'));

    const updateAnswers = (answers) => {
        if (props.loading === true) answers([]);
    }

    const deleteVote = () => {
        props.updateLoading(true);
        let selectedOptions = props.post.votes.find(vote => vote.user.id === user.id).selectedOptions;
        let data = { selectedOptions: selectedOptions, removeVote: true };
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
                        setAnswer([])
                    }
                })
                props.updateMainModal("Уведомление",response.data.message,'notification');
        })
    }

    const addVote = () => {
        props.updateLoading(true);
        let data = { selectedOptions: answer, removeVote: false };
        axios.post('http://localhost:3080/posts/' + props.match.params.id + '/vote-quiz/' + props.post.id, data, {
            headers: {
                'Authorization': props.token
            }
        }).then(response => {
            //props.updateLoading(false);
            //props.updateMainModal("Уведомление",response.data.message,'notification');
            axios.get('http://localhost:3080/posts/' + props.match.params.id + '/post/' + props.post.id, {
                headers: {
                    'Authorization': props.token
                }
            })
                .then(response => {
                    const { ok, post } = response.data;
                    if (ok) {
                        props.updateLoading(false);
                        props.updatePost(post);
                        setAnswer([])
                    }
                })
                props.updateMainModal("Уведомление",response.data.message,'notification');
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
                    {props.post.quizType === 0 ?
                        <MultipleQuiz
                            post={props.post}
                            update={updateData}
                            user={user}
                            updateAnswers={updateAnswers}
                        /> : ""}
                    {props.post.quizType === 1 ?
                        <SingleQuiz
                            post={props.post}
                            update={updateData}
                            user={user}
                        /> : ""}
                    {props.post.quizType === 2 ?
                        <OneUserQuiz
                            post={props.post}
                            update={updateData}
                            user={user}
                        /> : ""}
                    <Form.Group>
                        <Form.Field>
                            <div onClick={addVote} className={`${answer.length === 0 ? 'disabled hidden' : ''} ui huge button`}>Отправить</div>
                        </Form.Field>
                        {props.post.canCancel === true ?
                            <Form.Field>
                                <div onClick={deleteVote} className={`${props.post.votes.find(vote => vote.user.id === user.id) === undefined ? 'disabled hidden' : ''} ui huge button`}>Отменить голос</div>
                            </Form.Field> : ''}
                    </Form.Group>
                </Form>
            </div>
        </Fragment>
    );
}

export default withRouter(QuizPost);