import { Fragment } from "react";
import React, { useEffect, useState } from 'react';
import { withRouter } from "react-router-dom";
import { Form, Radio } from 'semantic-ui-react'
import DefaultPost from "../../components/postsTypes/createDefaultPost";
import axios from "axios";
import './post.css'
import {CreateQuizPost} from "../../components/postsTypes/createQuizPost";

function CreatePost(props) {

    const [checked, setChecked] = useState('default');
    const [cozyData, setCozyData] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateData = (value) => {
        if(value.title === '') {
            setError('empty');
        } else if (value.options && value.options.length < 1) {
            setError('optionsEmpty');
        }
        else {
            setError('');
        }
        setCozyData(value);
    }

    const returnBack = (event) => {
        event.preventDefault();
        props.history.push('/groups/' + props.match.params.id);
    }

    const createPost = () => {
        setLoading(true);
        axios.post('http://localhost:3080/posts/' + props.match.params.id + '/' + cozyData.type, cozyData, {
            headers: {
                'Authorization': props.token
            }
        })
            .then(response => {
                if (response.data.ok) {
                    setLoading(false);
                    props.updateMainModal('Уведомление', "Пост успешно создан!", "notification");
                    props.history.push('/groups/' + props.match.params.id);
                }
            })
            .catch((err) => {
                if (err.response) {
                    setLoading(false);
                    props.updateMainModal("Ошибка", err.response.data.message, "error");
                }
                else {
                    setTimeout(() => {
                        props.history.push("/");
                        props.close();
                    }, 3000);
                }
            });
    }

    return (
        <Fragment>
            <div className={`ui padded ${loading ? `disabled` : ``} segment`}>
                <div>
                    <h1 className="settings-header">Настройки поста</h1>
                </div>
                <Form>
                    <Form.Field>
                        <Radio
                            toggle
                            label='Обычный пост'
                            name='radioGroup'
                            value='default'
                            checked={checked === 'default'}
                            onChange={() => setChecked('default')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            toggle
                            label='Опрос'
                            name='radioGroup'
                            value='quiz'
                            checked={checked === 'quiz'}
                            onChange={() => setChecked('quiz')}
                        />
                    </Form.Field>
                </Form>
            </div>
            {checked === 'default' && <DefaultPost error={error} loading={loading} update={updateData} />}
            {checked === 'quiz' && <CreateQuizPost error={error} loading={loading} update={updateData} />}
            <div className='ui center aligned padded segment'>
                <a
                    className={`ui huge ${loading ? `loading` : ``} button`}
                    onClick={returnBack}
                >
                    <i className="reply icon"></i>
                    Отменить
                </a>
                <a
                    className={`ui huge olive ${error === null || error === 'empty' || error === 'optionsEmpty' ? `disabled` : ``  } 
                                              ${loading ? `loading` : ``} button`}
                    onClick={createPost}
                >
                    <i className="share icon"></i>
                    Создать пост
                </a>
            </div>
        </Fragment>
    );
}

export default withRouter(CreatePost);