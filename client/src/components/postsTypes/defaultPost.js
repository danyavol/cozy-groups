
import React, { Fragment, useState } from 'react';
import { withRouter } from "react-router-dom";

function DefaultPost(props) {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('')

    const handleTitleChange = (e) => {
        let data = {title : e.target.value, description : description, type:'default'}
        props.update(data);
        setTitle(e.target.value)
        
        
    }
    const handleDescriptionChange = (e) => {
        let data = {title : title, description : e.target.value, type:'default'}
        props.update(data);
        setDescription(e.target.value)
    }

    return (
        <Fragment>
            <div className={`ui padded ${props.loading ? `disabled`: ``} segment`}>
                <div class="ui form">
                    <div className={`field ${props.error ==='empty' ? 'error':''}`}>
                        <label>Заголовок</label>
                        <div className={`ui fluid icon input`}>
                            <input
                                value={title}
                                type="text"
                                placeholder="Введите заголовок..."
                                onChange={handleTitleChange}
                            />
                            <i className="pencil alternate icon"></i>
                        </div>
                    </div>
                    <div class="field">
                        <label>Описание</label>
                        <textarea
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="Введите описание..."></textarea>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default withRouter(DefaultPost)