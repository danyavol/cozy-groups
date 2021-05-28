import React, {Fragment, useCallback, useEffect, useState} from "react";
import "./quizPost.css";
import {Checkbox, Form, Radio, Visibility} from "semantic-ui-react";

export const QuizPost = ({ loading, error, update }) => {
    const [id, setId] = useState(1);
    const [title, setTitle] = useState('');
    const [optionTitle, setOptionTitle] = useState('');
    const [options, setOptions] = useState([]);
    const [quizType, setQuizType] = useState(0);
    const [canCancel, setCanCancel] = useState(false);

    useEffect(() => {
        let data = {title, options,  type:'quiz', quizType, canCancel}
        update(data);
        // console.log(data);
    }, [title, options.length, quizType, canCancel]);

    const handleTitleChange = e => {
        setTitle(e.target.value);
    }

    const handleOptionTitleChange = event => {
        setOptionTitle(event.target.value);
    }

    const handleAddOption = event => {
        event.preventDefault();
        let newOptions = options;
        if (optionTitle) {
            newOptions.push({ id, value: optionTitle });
            setId(id + 1);
            setOptions(newOptions);
            setOptionTitle('');
        }
    }

    const handleRemoveOption = ({ id }) => {
        let newOptions = [];

        options.forEach(option => {
            if (option.id !== id)
                newOptions.push(option);
        });

        setOptions(newOptions);
    }

    return (
        <Fragment>
            <div className={`ui padded ${loading ? `disabled`: ``} segment`}>
                <div className="ui form">
                    <div className={`field ${error ==='empty' ? 'error':''}`}>
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
                    <div className={`field ${error ==='optionsEmpty' ? 'error':''}`}>
                        <label>Добавить вариант ответа</label>
                        <div className={`ui icon fluid input`}>
                            <input
                                value={optionTitle}
                                type="text"
                                placeholder="Введите вариант ответа..."
                                onChange={handleOptionTitleChange}
                            />
                            <i className="inverted circular check link icon" onClick={handleAddOption}></i>
                        </div>
                    </div>
                </div>
                <div>
                    <table className="optionsTable ui very basic celled table">
                        <tbody>
                        {options.map(option => (
                            <tr key={option.id}>
                                <td>{option.value}</td>
                                <td className="removeOptionTd">
                                    <i className="removeOptionBtn x link icon" onClick={() => handleRemoveOption(option)}/>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <Form>
                    <Form.Field>
                        <Radio
                            toggle
                            label='Множественный выбор'
                            name='radioGroup'
                            value={quizType}
                            checked={quizType === 0}
                            onChange={() => setQuizType(0)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            toggle
                            label='Выбор одного варианта'
                            name='radioGroup'
                            value={quizType}
                            checked={quizType === 1}
                            onChange={() => setQuizType(1)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            toggle
                            label='Один вариант для одного человека'
                            name='radioGroup'
                            value={quizType}
                            checked={quizType === 2}
                            onChange={() => setQuizType(2)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            label='Возможность отменять голос'
                            name='canCancel'
                            onChange={() => setCanCancel(!canCancel)}
                        />
                    </Form.Field>
                </Form>
            </div>
        </Fragment>
    );
}