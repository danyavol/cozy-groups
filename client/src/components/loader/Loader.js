import React from "react";

export default function Loader(props) {
    return (
        <div className={`holder ${props.loading ? '' : 'hidden'}`}>
            <div className={`ui middle aligned grid`}>
                <div className="eight column wide">
                    <div className={`ui active centered large text loader`}>{props.text}</div>
                </div>
            </div>
        </div>
    );
}