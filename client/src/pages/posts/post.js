import { Fragment } from "react";
import React, { useEffect, useState } from 'react';
import { withRouter } from "react-router-dom";
import { Form, Radio } from 'semantic-ui-react'
import DefaultPost from "../../components/postsTypes/defaultPost";
import axios from "axios";
import './post.css'

function Post(props) {

    const [checked, setChecked] = useState('default');
    const [cozyData, setCozyData] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateData = (value) => {
        if(value.title === '') {
            setError('empty');
        }
        else {
            setError('');
        }
        setCozyData(value);
    }

    const createPost = () => {
        setLoading(true);
        let data = { title: cozyData.title, description: cozyData.description };
        axios.post('http://localhost:3080/posts/' + props.match.params.id + '/' + cozyData.type, data, {
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
            })
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
            {checked === 'default' ? <DefaultPost error={error} loading={loading} update={updateData} /> : "а нихуя"}
            <div className='ui center aligned padded segment'>
                <a className={`ui huge ${error === null || error === 'empty' ? `disabled` : `` } ${loading ? `loading` : ``} button`} onClick={createPost}><i className="reply icon"></i>Создать пост</a>
            </div>
        </Fragment>
    );
}

export default withRouter(Post);