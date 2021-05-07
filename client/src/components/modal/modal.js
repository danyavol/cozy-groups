import React, { Fragment, useEffect, useState } from 'react';
import { Dimmer } from 'semantic-ui-react';
import Users from '../users/users';
import './modal.css';
import { withRouter } from "react-router-dom";

export default withRouter(function Modal(props) {

    const [inputModal, setInputModal] = useState("");
    const [inputErrorModal, setInputErrorModal] = useState(null);
    const [inputErrorTextModal, setInputErrorTextModal] = useState('');


    const timeout = (modal) => {
        setTimeout(props.updateVisible, 3000);
        return modal;
    }

    useEffect(() => {
        setInputErrorModal(inputErrorModal);
    })

    const handleInputChange = (e) => {
        validateField(e.target.value)
        setInputModal(e.target.value)
    }

    const validateField = (value) => {
        if (!value) {
            setInputErrorModal('empty');
            setInputErrorTextModal('Введите название!');
            return false;
        }
        else if (!(value.length > 3 && value.length < 50)) {
            if (value.length < 4) {
                setInputErrorTextModal('Длинна не менее 4 символов!');
            }
            if (value.length > 50) {
                setInputErrorTextModal('Длинна не более 50 символов!')
            }
            setInputErrorModal('reqExp');
            return false;
        }
        else {
            setInputErrorModal('');
            setInputErrorTextModal('');
            return true;
        }
    }

    const errorModal = <Fragment>
        <div className={`ui error message ${props.visible ? 'active' : ''}`}>
            <div className="header">{props.header}
                <i onClick={props.updateVisible} className="close black icon float-right"></i>
            </div>
            <div className="content">
                {props.element}
            </div>
        </div>
    </Fragment>;

    const notificationModal = <Fragment>
        <div className={`ui success message ${props.visible ? 'active' : ''}`}>
            <div className="header">{props.header}
                <i onClick={props.updateVisible} className="close black icon float-right"></i>
            </div>
            <div className="content">
                {props.element}
            </div>
        </div>
    </Fragment>;

    if (props.type === "notification") {
        return (
            timeout(notificationModal)
        );
    }
    if (props.type === "error") {
        return (
            timeout(errorModal)
        );
    }
    if (props.type === "input") {
        return (
            <Fragment>
                <div className={`ui ${props.size} modal modal-properties ${props.visible ? 'active' : ''}`}>
                    <div className="header">{props.header}
                        <i onClick={() => { props.updateVisible(); setInputModal(""); setInputErrorModal(null) }} className="close black icon float-right"></i>
                    </div>
                    <div className={`${props.scrolling ? 'scrolling' : ''} content color`}>
                        {props.element}
                        <div className={`ui fluid icon input ${inputErrorModal === 'reqExp' || inputErrorModal === 'empty' ? 'error' : ''} input-properties `}>
                            <input
                                value={inputModal}
                                onChange={handleInputChange}
                                type="text"
                                placeholder="Введите название..."
                            />
                            <i className="pencil alternate icon"></i>
                        </div>
                        <div className={`ui basic red pointing prompt label ${inputErrorModal === 'reqExp' || inputErrorModal === 'empty' ? 'visible' : 'hidden'}`}>{inputErrorTextModal}</div>
                    </div>
                    <div className="actions">
                        <div onClick={() => { props.updateVisible(); setInputModal(""); setInputErrorModal(null) }} className="ui black deny button">Отменить</div>
                        <div
                            onClick={() => { props.function(inputModal); setInputModal(""); setInputErrorModal(null) }}
                            className={`ui positive right labeled icon button ${inputErrorModal === 'reqExp' || inputErrorModal === 'empty' || inputErrorModal === null ? 'disabled' : ''}`}
                        >
                            Подтвердить
                            <i className="checkmark icon"></i>
                        </div>
                    </div>
                </div>
                <Dimmer.Dimmable dimmed={props.dimmer} >
                    <Dimmer className='position' simple />
                </Dimmer.Dimmable>
            </Fragment>
        );
    }
    if (props.type === "users") {
        return (
            <Fragment>
                <div className={`ui ${props.size} modal modal-properties ${props.visible ? 'active' : ''}`}>
                    <div className="header">{props.header}
                        <i onClick={() => { props.updateVisible(); }} className="close black icon float-right"></i>
                    </div>
                    <div className={`${props.scrolling ? 'scrolling' : ''} content color`}>
                        {props.element}
                        <Users
                            group={props.group}
                            function={props.function}
                        />
                    </div>
                </div>
                <Dimmer.Dimmable dimmed={props.dimmer} >
                    <Dimmer className='position' simple />
                </Dimmer.Dimmable>
            </Fragment>
        );
    }
    if (props.type === "action") {
        return (
            <Fragment>
                <div className={`ui ${props.size} modal modal-properties ${props.visible ? 'active' : ''}`}>
                    <div className="header">{props.header}
                        <i onClick={props.updateVisible} className="close black icon float-right"></i>
                    </div>
                    <div className={`${props.scrolling ? 'scrolling' : ''} content color`}>
                        {props.element}
                    </div>
                    <div className="actions">
                        <div onClick={props.updateVisible} className="ui black deny button">Отменить</div>
                        <div onClick={props.function} className="ui positive right labeled icon button">
                            Подтвердить
                            <i className="checkmark icon"></i>
                        </div>
                    </div>
                </div>
                <Dimmer.Dimmable dimmed={props.dimmer} >
                    <Dimmer className='position' simple />
                </Dimmer.Dimmable>
            </Fragment>
        );
    }
    else {
        return (
            <Fragment>
                {props.children}
            </Fragment>
        );
    }

})
