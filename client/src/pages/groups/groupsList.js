import React, { Component, Fragment } from 'react';
import "./group.css"
import { withRouter } from "react-router-dom";

class GroupsList extends Component {
    constructor(props) {
        super(props);
        this.toGroup = this.toGroup.bind(this);
    }

    componentDidMount() {
        document.title = "Группы";
    }

    toGroup(id) {
        this.props.history.push('/groups/' + id)
    }
    toAddGroup() {
        this.props.history.push('/add-group')
    }
    render() {
        const column = <div className="column">
            <div className="ui raised segment">
                <div className="ui placeholder">
                    <div className="image header">
                        <div className="line"></div>
                        <div className="line"></div>
                    </div>
                    <div className="paragraph">
                        <div className="medium line"></div>
                        <div className="short line"></div>
                    </div>
                </div>
            </div>
        </div>;

        const columns = [column, column, column, column, column, column, column, column, column];

        const listGroups = this.props.myGroups.map((group) =>
            <div className="ui card" key={group.id} onClick={() => this.toGroup(group.id)}>
                <div className="content">
                    <div className="header">{group.name} </div>
                    <div className="description">Участников: {group.users_count} </div>
                </div>
                <div className="extra content">
                    <div className="ui two buttons">
                        <div className="ui basic green button">Перейти</div>
                    </div>
                </div>
            </div>
        );

        if (!this.props.loading) {
            if (!this.props.myGroups.length) {
                return (
                    <Fragment>
                        <div className="ui center aligned grid">
                            <div className="center aligned row groupsList">
                                <h3>У вас нет групп :(</h3>
                            </div>
                            <div className="row">
                                <div className="center aligned column">
                                    <button className="ui huge button" onClick={() => this.toAddGroup()}>Присоединиться</button>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                );
            }
            else {
                return (
                    <Fragment>
                        <div className="ui three stackable cards">
                            {listGroups}
                        </div>
                    </Fragment>
                );
            }
        }
        else {
            return (
                <Fragment>
                    <div className="ui three column stackable grid">
                        {columns}
                    </div>
                </Fragment>
            );
        }
    }
}


export default withRouter(GroupsList);

