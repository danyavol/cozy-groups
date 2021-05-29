import { Fragment, useEffect, useState } from "react";
import { Form, Checkbox } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";

function MultipleQuiz(props) {

    const [answer, setAnswer] = useState([]);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        setAnswer([])
    }, [setAnswer])

    useEffect(() => {
        setOptions(props.post.options);
    }, [props, answer, props.loading])

    useEffect(() => {
        props.updateAnswers(setAnswer)
    }, [props])

    const changeAnswer = (value) => {
        let newAnswer = answer;
        if (answer.includes(value)) {
            let index = newAnswer.indexOf(newAnswer.find(answer => answer === value));
            newAnswer.splice(index, 1);
        }
        else {
            newAnswer.push(value);
        }
        props.update(newAnswer);
        setAnswer(newAnswer);
    }
    return (
        <Fragment>
            <Form.Field>
                <label>Опрос с множественным выбором</label>
            </Form.Field>
            {props.post.options.map(option =>
                <Form.Field key={option.id}>
                    <Checkbox
                        disabled={!!props.post.votes.find(vote => vote.user.id === props.user.id)}
                        label={`${option.id}. ${option.value} `}
                        checked={answer.includes(option.id) || props.post.votes.find(vote => vote.user.id === props.user.id && vote.selectedOptions.includes(option.id)) !== undefined}
                        onChange={() => changeAnswer(option.id)}
                        onClick={() => setOptions([])}
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
export default withRouter(MultipleQuiz)