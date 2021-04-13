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
    const [loading, setLoader] = useState(true);
    const [loaderText, setLoaderText] = useState("Загрузка группы...")

    useEffect(() => {
        setTitle(group.name);
    }, [group]);

    useEffect(() => {
        document.title = title;
    });

    useEffect(() => {
        setLoader(true);
        setToken(props.token);
        axios.get('http://localhost:3080/groups/' + props.match.params.id, {
            headers: {
                'Authorization': props.token
            }
        })
            .then(response => {
                if (response.data.ok) {
                    setGroup(response.data.group);
                    setLoader(false);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }, [props.token, props.match.params.id]);

    const deleteGroup = () => {
        setLoader(true);
        setLoaderText("Удаление группы...");
        props.updateModal();
        axios.delete('http://localhost:3080/groups/'+props.match.params.id,{
            headers:{
                'Authorization': props.token
            }
        }).then(response => {
            if(response.data.ok) {
                setLoader(false);
                console.log('Вы удалили группу!');
                props.updateDeleteGroups(props.match.params.id);
                props.history.push("/"); 
            }
        })
        .catch((err) => {
            setLoader(false);
            if (err.response) {
                props.updateMainModal("Ошибка",err.response.data.message,"error");
            }
            else
            {
                props.updateMainModal("Ошибка",err.response.data.message,"error");
                setTimeout(() => {
                    //props.updateMainModal();
                    props.history.push("/");
                },3000);
            } 
        });
    };
    
    const leave = () => {
        setLoader(true);
        setLoaderText("Выход из группы...");
        props.updateModal();
        let data = {groupId : group.id};
        axios.post('http://localhost:3080/groups/leave',data, {
            headers:{
                'Authorization': props.token
            }
        }).
        then(response => {
            if(response.data.ok) {
                props.updateMainModal('Уведомление',"Вы вышли из группы!","notification")
                props.updateDeleteGroups(props.match.params.id);
                props.history.push("/");
            }
        })
        .catch((err) => {
            console.log(err.response.data.message);
            setLoader(false);
            if (err.response) {
               props.updateMainModal("Ошибка",err.response.data.message,"error");
            } 
            else
            {
                setTimeout(() => {
                    props.history.push("/");
                    props.close();
            },3000);
            } 
        })
    };

    return (
        <div>
            <Loader loading={loading} text={loaderText} />
            <div className={loading ? 'hidden' : ''}>
                <div className="header">
                    <div className="buttons">
                        <SettingsDropdown 
                            leave={() => props.updateModal(`Выход`,`Хотите выйти из группы "${group.name}"?`,leave,"action")}
                            delete={() => props.updateModal(`Удаление`,`Вы действительно хотите удалить группу "${group.name}"? Это безвозвратное действие!`,deleteGroup,"action")} 
                        />
                    </div>
                    <div>
                        <h1>{title}</h1>
                    </div>
                </div>
                <div>
                    <GroupsTabs token={token} group={group} />
                </div>
            </div>
        </div>
    );
}

export default GroupHooks;