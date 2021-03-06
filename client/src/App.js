import React, { Component } from "react";
import { Navbar, NavItem, Nav } from "react-bootstrap";
import "./App.css";
import { Route, Switch, Link } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import UpdateDetails from './containers/UpdateDetails';
import NotFound from "./containers/NotFound";
import cookie from "react-cookies";


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: cookie.load("user")
        };
    }

    handleLogout = () => {
        console.log("Logging out");
      cookie.remove('user', { path: '/' });
      this.setState({user: null});
      window.location.pathname = "/app/login"

    };

    setUser = user => this.setState({user: user});

    render() {
        const childProps = {
            user: this.state.user,
            setUser: this.setUser
        };
        return (
            <div>
                <div>
              <Navbar fluid collapseOnSelect>
                <Navbar.Header>
                  <Navbar.Brand>
                    <Link to="/app">Fire Alarm App</Link>
                  </Navbar.Brand>
                  <Navbar.Toggle />
                </Navbar.Header>
                  {this.state.user ?
                      <Navbar.Collapse>
                          <Nav pullRight>
                              <NavItem href="/app/account">Account</NavItem>
                              <NavItem onClick={this.handleLogout}>Logout</NavItem>
                          </Nav>
                      </Navbar.Collapse>
                      : null}
              </Navbar>
                </div>
                <div>
                <Switch>
                    <Route path="/app/" exact render={(props) => (<Home {...props} {...childProps} />)}/>
                    <Route path="/app/login" exact render={(props) => (<Login {...props} {...childProps} />)}/>
                    <Route path="/app/signup" exact render={(props) => (<Signup {...props} {...childProps} />)}/>
                    <Route path="/app/account"  exact render={(props) => (<UpdateDetails {...props} {...childProps} />)}/>
                    <Route component={NotFound}/>
                </Switch>
                </div>
            </div>
        );
    }
}

export default App;