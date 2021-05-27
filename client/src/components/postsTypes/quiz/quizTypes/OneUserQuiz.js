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
            {props.post.options.map(option =>
                <Form.Field>
                    <Checkbox
                        disabled={props.post.votes.filter(vote => vote.selectedOptions.includes(option.id)).length > 0 ||
                            props.post.votes.find(vote => vote.user.id === JSON.parse(localStorage.getItem('user')).id) ? true : false}
                        radio
                        label={`${option.id}. ${option.value} 
                            ${props.post.votes.find(vote => vote.selectedOptions.includes(option.id)) !== undefined ?
                                props.post.votes.find(vote => vote.selectedOptions.includes(option.id)).user.login : ""}`}
                        value={option}
                        checked={answer.includes(option.id)}
                        onChange={() => changeAnswer([option.id])}
                    />
                </Form.Field>
            )
            }
        </Fragment>
    );
}
export default withRouter(OneUserQuiz)