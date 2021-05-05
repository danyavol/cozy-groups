import React, { Component, Fragment, useEffect, useState } from 'react';
import { Transition } from 'semantic-ui-react';
import { Dimmer } from 'semantic-ui-react';
import './modal.css';

export default function Modal(props) {
    
    const [inputModal,setInputModal] = useState("");
    const [inputErrorModal,setInputErrorModal] = useState(null);

    const timeout = (modal) => {
        setTimeout(props.updateVisible,3000);
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
            return false;
        } 
        else if (!(value.length > 3 && value.length < 50)) {
            setInputErrorModal('reqExp');
            return false;
        } 
        else {
            setInputErrorModal(null);
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

    if(props.type === "notification") {
        return (
            timeout(notificationModal)
        );
    } 
    if(props.type === "error") {
        return (
            timeout(errorModal)
        );
    }
    if(props.type === "input") {
        return (
            <Fragment>
                <div className={`ui ${props.size} modal modal-properties ${props.visible ? 'active' : ''}`}>
                    <div className="header">{props.header}
                        <i onClick={() => {props.updateVisible(); setInputModal(""); setInputErrorModal(null)}} className="close black icon float-right"></i>
                    </div>
                    <div className={`${props.scrolling ? 'scrolling' : ''} content color`}>
                        {props.element}
                        <div className={`ui fluid icon input ${inputErrorModal !==null ? 'error' : ''} input-properties `}>
                            <input 
                                value={inputModal} 
                                onChange={handleInputChange}
                                type="text" 
                                placeholder="Введите название..."
                            />
                            <i className="pencil alternate icon"></i>
                        </div>
                        <div className={`ui basic red pointing prompt label ${inputErrorModal !== null ? 'visible' : 'hidden'}`}>Неверный формат названия</div>
                    </div>
                    <div className="actions">
                        <div onClick={() => {props.updateVisible(); setInputModal(""); setInputErrorModal(null)}} className="ui black deny button">Отменить</div>
                        <div 
                            onClick={() => {props.function(inputModal); setInputModal(""); setInputErrorModal(null)}} 
                            className={`ui positive right labeled icon button ${inputErrorModal !== null ? 'disabled':''}`}
                        >
                            Подтвердить
                            <i  className="checkmark icon"></i>
                        </div>
                    </div>
                </div>
                <Dimmer.Dimmable dimmed={props.dimmer} >
                    <Dimmer className='position' simple  />
                </Dimmer.Dimmable>
            </Fragment>
        );
    }
    if(props.type === "action") {
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
                            <i  className="checkmark icon"></i>
                        </div>
                    </div>
                </div>
                <Dimmer.Dimmable dimmed={props.dimmer} >
                    <Dimmer className='position' simple  />
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

}

