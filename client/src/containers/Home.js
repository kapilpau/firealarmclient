/**
 * Created by Kapil on 29/12/2018.
 */

import React from "react";
import "./Home.css";
import cookie from 'react-cookies';

export default class Home extends React.Component {
    constructor(props){
        super(props);
        console.log(props);

        if (!props.user)
        {
            props.history.push('/app/login');
        }
    }

    render() {
        if (!cookie.load("user"))
        {
            this.props.history.push('/login');
        }
        return (
            <div className="Home">
                <div className="lander">
                    <h1>Fire Alarm App</h1>
                    <p>TODO: Add maps and list</p>
                </div>
            </div>
        );
    }
}