import { Fragment, useEffect, useState } from "react";
import { Form, Checkbox } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";

function SingleQuiz(props) {

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
                <label>Опрос с 1 вариантом</label>
            </Form.Field>
            {props.post.options.map(option =>
                <Form.Field>
                    <Checkbox
                        disabled={props.post.votes.find(vote => vote.user.id === props.user.id) ? true : false}
                        radio
                        label={`${option.id}. ${option.value} ${props.post.votes.filter(vote => vote.selectedOptions.includes(option.id)).length}`}
                        value={option}
                        checked={answer.includes(option.id) || props.post.votes.find(vote => vote.user.id === props.user.id && vote.selectedOptions.includes(option.id)) !== undefined}
                        onChange={() => changeAnswer([option.id])}
                    />
                    <span className="nickname">
                        <label>
                            (голосов {props.post.votes.filter(vote => vote.selectedOptions.includes(option.id)).length})
                        </label>
                    </span>
                </Form.Field>
                
            )
            }
        </Fragment>
    );
}
export default withRouter(SingleQuiz)