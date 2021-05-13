import { Fragment } from "react";
import React, { useEffect, useState } from 'react';
import "./settings.css"
import { Link, useRouteMatch, withRouter } from "react-router-dom";

function Settings(props) {
    const [user, setUser] = useState({});
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user !== null) {
            setUser(user);
        }
        else {
            props.history.push("/");
        }
    }, []);

    useEffect(() => {
        setGroups(props.groups);
    }, [props.groups]);

    const statistic = () => {
        if (props.loading) return (<div className="ui big active inline loader"></div>);
        else return (
            <div class="ui statistic">
                <div class="value">
                    <i className="ui icon users"></i>
                    {groups.length}
                </div>
                <div class="label">Количество групп </div>
            </div>
        );
    }

    return (
        <Fragment>
            <div className="ui segments">
                <div className="ui center aligned segment flex">
                    <img className="ui small avatar image" src="https://semantic-ui.com/images/wireframe/square-image.png" />
                    <h1 id="login">{user.login}</h1>
                </div>
            </div>
            <div className="ui center aligned segment">
                <h1>Данные</h1>
            </div>
            <div className="blocks">
                <div className="ui center aligned padded segment">
                    <h1><i className="ui icon medium user"></i>Информация</h1><br />
                    <div className="ui divider"></div>
                    <table class="ui very basic table">
                        <tbody>
                            <tr>
                                <td><h4>Имя :</h4></td>
                                <td><h4>{user.firstName}</h4></td>
                            </tr>
                            <tr>
                                <td><h4>Фамилия :</h4></td>
                                <td><h4>{user.lastName}</h4></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="ui center aligned padded segment">
                    <h1><i class="id card icon"></i>ID в системе</h1><br />
                    <div className="ui divider"></div>
                    <h3>{user.id}</h3>
                </div>
                <div className="ui center aligned padded segment">
                    <h1><i className="archive icon"></i>Группы</h1><br />
                    <div className="ui divider"></div>
                    {statistic()}
                </div>
            </div>
        </Fragment>
    );
}

export default withRouter(Settings);