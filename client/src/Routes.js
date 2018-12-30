/**
 * Created by Kapil on 29/12/2018.
 */

import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NotFound from "./containers/NotFound";
import cookie from "react-cookies";

export default () =>
    <Switch>
        <Route path="/" exact render={(props) => (<Home {...this.props} />)}/>
        <Route path="/login" exact component={Login} />
        <Route path="/signup" exact component={Signup} />
        {/*<Route path='/logout' exact render={(props) => {*/}
            {/*cookie.remove('user');*/}
            {/*this.props.setUser(null);*/}
             {/*return (< Redirect to="/login"/>);*/}
        {/*}} />*/}
        <Route component={NotFound} />
    </Switch>;