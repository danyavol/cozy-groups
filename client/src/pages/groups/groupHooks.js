import React, {useEffect, useState} from 'react';
import "./group.css"
import axios from "axios";

import SettingsDropdown from "../../components/settingDropdown/SettingDropdown";
import Loader from "../../components/loader/Loader";
import GroupsTabs from "../../components/groupsTabs/GroupsTabs";

function GroupHooks(props) {
    const [token, setToken] = useState("")
    const [title, setTitle] = useState("");
    const [group, setGroup] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTitle(group.name);
    }, [group]);

    useEffect(() => {
        document.title = title;
    });

    useEffect(() => {
        setLoading(true);
        setToken(props.token);
        axios.get('http://localhost:3080/groups/' + props.match.params.id, {
            headers: {
                'Authorization': props.token
            }
        })
            .then(response => {
                if (response.data.ok) {
                    setGroup(response.data.group);
                    setLoading(false);
                    console.log("token: " + token);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }, [props.token, props.match.params.id]);

    const handleUserChange = (newUsers) => {
        let newGroup = group;
        newGroup.users = newUsers;
        setGroup(newGroup);
    }

    return (
        <div>
            <Loader loading={loading} text="Загрузка группы..." />
            <div className={loading ? 'hidden' : ''}>
                <div className="header">
                    <div className="buttons">
                        <SettingsDropdown />
                    </div>
                    <div>
                        <h1>{title}</h1>
                    </div>
                </div>
                <div>
                    <GroupsTabs token={props.token} group={group} changeUsers={handleUserChange} />
                </div>
            </div>
        </div>
    );
}

export default GroupHooks;