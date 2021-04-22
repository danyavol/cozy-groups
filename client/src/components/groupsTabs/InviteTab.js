import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";
import Loader from "../../components/loader/Loader";


export default function InviteTab(props) {
    const [inviteCode, setInviteCode] = useState("");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      setInviteCode(props.inviteCode);   
    },[props.inviteCode])

    const updateInviteCode = () => {
        setLoading(true);
        let data = {groupId : props.groupId};
        axios.put("http://localhost:3080/groups/invite-code", data,{
            headers:{
                'Authorization': props.token
            }
        }).then(response => {
            if(response.data.ok) {
                setInviteCode(response.data.inviteCode);
                setLoading(false);
            }
        })
    }

    return (
        <Fragment>
            <Loader loading={loading} text="Получаем код..." />
            <div  className="inviteCard" className={loading ? 'hidden' : ''}>
                <div className="ui fluid centered card inviteCard">
                    <div className="content">
                        <a className="center aligned header">Код приглашения</a>
                        <div className="center aligned description">
                            <div   id="inviteCode">
                                <h1>{inviteCode}</h1>
                                <CopyToClipboard
                                    text={inviteCode}
                                    onCopy={() => setCopied(true)}
                                >
                                    <h2><i className={`copy ${copied ? '' : 'disabled'} icon`}></i></h2>
                                </CopyToClipboard>
                            </div>
                            
                        </div>
                    </div>
                    <div className="center aligned extra content">
                        <div className="large fluid ui button" onClick={updateInviteCode}>Обновить</div>
                    </div>
                </div>
            </div>
        </Fragment>
        
    );
}