import React, { Component, Fragment } from 'react';
import { Transition } from 'semantic-ui-react';
import { Dimmer } from 'semantic-ui-react';
import './modal.css';

export default function Modal(props) {
    
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

    const timeout = (modal) => {
        setTimeout(props.updateVisible,3000);
        return modal;
    }
    if(props.type === "error") {
        return (
            timeout(errorModal)
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
    if(props.type === "notification") {
        return (
            timeout(notificationModal)
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

