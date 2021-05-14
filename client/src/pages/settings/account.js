import { Fragment } from "react";
import React, { useEffect, useState } from 'react';
import "./account.css"
import { withRouter } from "react-router-dom";

function Account(props) {
    const [user, setUser] = useState({});
    
    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user !== null) {
            setUser(user);
        }
        else {
            props.history.push("/");
        }
    }, []);

    return (
        <Fragment>
            <div className="ui segments">
                <div className="ui center aligned segment flex">
                    <img className="ui small avatar image" src="https://semantic-ui.com/images/wireframe/square-image.png" />
                    <div className="information-segment">
                        <h1 id="login">{user.login}</h1>
                        <div className="informations">
                            <h3>{user.firstName} {user.lastName}</h3>
                        </div>   
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default withRouter(Account);