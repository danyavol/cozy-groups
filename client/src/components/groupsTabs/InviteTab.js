import React from "react";
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";

export default class InviteTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            copied: false
        }
    }
    render() {
        return (
            <div className="inviteCard">
                <div className="ui fluid centered card inviteCard">
                    <div className="content">
                        <a className="center aligned header">Код приглашения</a>
                        <div className="center aligned description">
                            <h1 id="inviteCode">
                                {this.props.inviteCode}
                                <CopyToClipboard
                                    text={this.props.inviteCode}
                                    onCopy={() => this.setState({copied: true})}
                                >
                                    <h2><i className={`copy ${this.state.copied ? '' : 'disabled'} icon`}></i></h2>
                                </CopyToClipboard>
                            </h1>

                        </div>
                    </div>
                    <div className="center aligned extra content">
                        <div className="large fluid ui button">Обновить</div>
                    </div>
                </div>
            </div>

        );
    }
}