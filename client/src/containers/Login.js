/**
 * Created by Kapil on 29/12/2018.
 */

import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
// import "./Login.css";
import cookie from "react-cookies";
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor(props) {
        if (cookie.load("user"))
        {
            console.log("foanfian");
            props.history.push('/app');
        }
        super(props);
        this.state = {
            email: "",
            password: "",
            errorMsg: ""
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        fetch('/fire/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        }).then(res => res.json())
            .then((res) => {
                console.log(res);
                if (res.message === "correct")
                {
                    cookie.save('user', res.user, { path: '/' });
                    this.props.setUser(res.user);
                    this.props.history.push("/app");
                } else {
                    this.setState({errorMsg: "Invalid email/password"})
                }
            })

    };

    render() {
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="email" bsSize="large">
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
                            autoFocus
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <Button
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        Login
                    </Button>
                    <Link to='/app/signup'>Create account</Link>
                </form>
                <Text>{this.state.errorMsg}</Text>
            </div>
        );
    }
}