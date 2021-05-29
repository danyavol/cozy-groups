import { Fragment, useEffect, useState } from "react";
import { Form, Checkbox } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";

function OneUserQuiz(props) {

    const [answer, setAnswer] = useState([]);

    useEffect(() => {
        setAnswer([])
    }, [])

    const changeAnswer = (value) => {
        props.update(value);
        setAnswer(value);
    }

    return (
        <Fragment>
            <Form.Field>
                <label>Опрос с 1 вариантом для 1 пользователя</label>
            </Form.Field>
            {props.post.options.map(option =>
                <Form.Field key={option.id}>
                    <Checkbox
                        disabled={!!(props.post.votes.filter(vote => vote.selectedOptions.includes(option.id)).length > 0 ||
                            props.post.votes.find(vote => vote.user.id === props.user.id))}
                        radio
                        label={`${option.id}. ${option.value}`}
                        checked={answer.includes(option.id) || props.post.votes.find(vote => vote.user.id === props.user.id && vote.selectedOptions.includes(option.id)) !== undefined}
                        onChange={() => changeAnswer([option.id])}
                    />
                    <span className="nickname">
                        <label>
                            {props.post.votes.find(vote => vote.selectedOptions.includes(option.id)) !== undefined ? props.post.votes.find(vote => vote.selectedOptions.includes(option.id)).user.login : ""}
                        </label>
                    </span>
                </Form.Field>
            )
            }
        </Fragment>
    );
}
export default withRouter(OneUserQuiz)