import React, { Component, Fragment } from 'react';
import { Transition } from 'semantic-ui-react';
import { Dimmer } from 'semantic-ui-react';
import './modal.css';

class Modal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        if(this.props.type === "error") {
            return (
                <Fragment>
                    <Transition visible={this.props.visible} animation='scale' duration={500}>
                        <div className={`ui error message ${this.props.visible ? 'active' : ''}`}>
                            <div className="header">{this.props.header}
                                <i onClick={this.props.updateVisible} className="close black icon float-right"></i>
                            </div>
                            <div className="content">
                                {this.props.element}
                            </div>
                        </div>
                    </Transition> 
                    {this.props.children}
                </Fragment>
            );
        }
        if(this.props.type === "action") {
            return (
                <Fragment>
                    <Transition visible={this.props.visible} animation='scale' duration={500}>
                        <div className={`ui ${this.props.size} modal modal-properties ${this.props.visible ? 'active' : ''}`}>
                            <div className="header">{this.props.header}
                                <i onClick={this.props.updateVisible} className="close black icon float-right"></i>
                            </div>
                            <div className={`${this.props.scrolling ? 'scrolling' : ''} content color`}>
                                {this.props.element}
                            </div>
                            <div className="actions">
                                <div onClick={this.props.updateVisible} className="ui black deny button">Отменить</div>
                                <div onClick={this.props.function} className="ui positive right labeled icon button">
                                    Подтвердить
                                    <i  className="checkmark icon"></i>
                                </div>
                            </div>
                        </div>
                    </Transition> 
                    <Dimmer.Dimmable dimmed={this.props.dimmer} >
                        <Dimmer className='position' simple  />
                        {this.props.children}
                    </Dimmer.Dimmable>
                </Fragment>
            );
        }
        if(this.props.type === "notification") {
            return (
                <Fragment>
                    <Transition visible={this.props.visible} animation='scale' duration={500}>
                        <div className={`ui success message ${this.props.visible ? 'active' : ''}`}>
                            <div className="header">{this.props.header}
                                <i onClick={this.props.updateVisible} className="close black icon float-right"></i>
                            </div>
                            <div className="content">
                                {this.props.element}
                            </div>
                        </div>
                    </Transition> 
                    {this.props.children}
                </Fragment>
            );
        } 
        else {
            return (
                <Fragment>
                    {this.props.children}
                </Fragment>
            );
        }
    }
}

export default Modal;

