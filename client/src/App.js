import React, { Component } from "react";
import { Navbar, NavItem, Nav } from "react-bootstrap";
import "./App.css";
import { Route, Switch, Link } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NotFound from "./containers/NotFound";
import cookie from "react-cookies";


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: cookie.load("user")
        };
        console.log(this.state);
    }

    handleLogout = () => {
      cookie.remove('user');
      this.setState({user: null});
    };

    setUser = user => this.setState({user: user});

    render() {
        const childProps = {
            user: this.state.user,
            setUser: this.setUser
        };
        return (
            <div className="App container">
              <Navbar fluid collapseOnSelect>
                <Navbar.Header>
                  <Navbar.Brand>
                    <Link to="/">Fire Alarm App</Link>
                  </Navbar.Brand>
                  <Navbar.Toggle />
                </Navbar.Header>
                  {this.state.user ?
                      <Navbar.Collapse>
                          <Nav pullRight>
                              <NavItem onClick={this.handleLogout}>Logout</NavItem>
                          </Nav>
                      </Navbar.Collapse>
                      : null}
              </Navbar>
                <Switch>
                    <Route path="/" exact render={(props) => (<Home {...props} {...childProps} />)}/>
                    <Route path="/login" exact render={(props) => (<Login {...props} {...childProps} />)}/>
                    <Route path="/signup" exact render={(props) => (<Signup {...props} {...childProps} />)}/>
                    <Route to='/logout'>Logout</Route>
                    <Route component={NotFound} />
                </Switch>
            </div>
        );
    }
}

export default App;