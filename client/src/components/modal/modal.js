import React, { Component, Fragment } from 'react';
import { Transition } from 'semantic-ui-react';
import './modal.css'

class Modal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Fragment>
                <Transition visible={this.props.visible} animation='scale' duration={500}>
                <div className={`ui modal ${this.props.visible ? 'active' : ''}`}>
                    <div className="header">{this.props.header}
                        <i onClick={this.props.updateVisible} className="close black icon float-right"></i>
                    </div>
                    <div className="content">
                        {this.props.element}
                    </div>
                </div>
                </Transition> 
            </Fragment>
        );
    }
}

export default Modal;

