/**
 * Created by Kapil on 29/12/2018.
 */

import React from 'react'
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import cookie from "react-cookies";
import { Link } from "react-router-dom";

export default class Signup extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            email: "",
            password: "",
            confPassword: "",
            address: "",
            loc: {},
            name: "",
            maxDistance: 25
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0 && (this.state.password === this.state.confPassword)
            && this.state.name.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleAddressChange = loc => {
        this.setState({address: loc});
    };

    handleSelect = address => {
        geocodeByAddress(address)
            .then(results => {this.setState({address: results[0].formatted_address});return getLatLng(results[0]);})
            .then(latLng => this.setState({loc: latLng}))
            .catch(error => console.error('Error', error));
    };

    handleSubmit = event => {
        event.preventDefault();
        fetch('/fire/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.name,
                loc: this.state.loc,
                password: this.state.password,
                email: this.state.email,
                maxDistance: this.state.maxDistance
            })
        }).then((res) =>
            res.json()
        ).then((res) => {
            console.log(res);
            if (res.message === "success")
            {
                cookie.save('user', res.user, { path: '/' });
                this.props.setUser(res.user);
                this.props.history.push("/app");
            }
        });
    };

    render() {
        if (cookie.load("user"))
        {
            this.props.history.push('/app');
        }
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="name" bsSize="large">
                        <ControlLabel>Service Name</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="email" bsSize="large">
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
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
                    <FormGroup controlId="confPassword" bsSize="large">
                        <ControlLabel>Confirm Password</ControlLabel>
                        <FormControl
                            value={this.state.confPassword}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <FormGroup controlId="loc" bsSize="large">
                        <ControlLabel>Location</ControlLabel>
                        <PlacesAutocomplete
                            value={this.state.address}
                            onSelect={this.handleSelect}
                            onChange={this.handleAddressChange}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div>
                                    <input
                                        {...getInputProps({
                                            placeholder: 'Search Places ...',
                                            className: 'location-search-input',
                                        })}
                                    />
                                    <div className="autocomplete-dropdown-container">
                                        {loading && <div>Loading...</div>}
                                        {suggestions.map(suggestion => {
                                            const className = suggestion.active
                                                ? 'suggestion-item--active'
                                                : 'suggestion-item';
                                            // inline style for demonstration purpose
                                            const style = suggestion.active
                                                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                            return (
                                                <div
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                        style,
                                                    })}
                                                >
                                                    <span>{suggestion.description}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </PlacesAutocomplete>
                    </FormGroup>
                    <FormGroup controlId="maxDistance">
                        <ControlLabel>Max distance (km)</ControlLabel>
                        <FormControl
                            value={this.state.maxDistance}
                            onChange={this.handleChange}
                            type="number"
                        />
                    </FormGroup>
                    <Button
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        Sign Up
                    </Button>
                    <Link to='/app/login'>Already have an account, sign in</Link>
                </form>
            </div>
        );
    }
}