/**
 * Created by Kapil on 29/12/2018.
 */

import React from 'react'
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import cookie from "react-cookies";

export default class UpdateDetails extends React.Component {

    state = {
        id: "",
        email: "",
        address: "",
        loc: {},
        name: "",
        maxDistance: ""
    };

    constructor(props) {
        super(props);
        console.log(props);
        console.log(cookie.load("user"));
        if (!cookie.load("user"))
        {
            this.props.history.push('/app/login');
        } else {
            let user = cookie.load("user");
            this.state = {
                id: user.id,
                email: user.email,
                loc: {
                    lat: user.lat,
                    lng: user.long
                },
                name: user.name,
                maxDistance: user.maxDistance
            };
            console.log(this.state);
        }
    }


    validateForm() {
        return (this.state.email.length > 0) && (this.state.name.length > 0);
    }


    handleAddressChange = loc => {
        this.setState({address: loc});
    };

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSelect = address => {
        geocodeByAddress(address)
            .then(results => {this.setState({address: results[0].formatted_address});return getLatLng(results[0]);})
            .then(latLng => this.setState({loc: latLng}))
            .catch(error => console.error('Error', error));
    };

    handleSubmit = event => {
        event.preventDefault();
        fetch('/fire/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        }).then((res) =>
            res.json()
        ).then((res) => {
            if (res.message === "Success")
            {
                let user = cookie.load('user');
                user.name = this.state.name;
                user.lat = this.state.loc.lat;
                user.long = this.state.loc.lng;
                user.email = this.state.email;
                user.maxDistance = this.state.maxDistance;
                console.log(user);
                cookie.save('user', user, { path: '/' });
                this.props.setUser(res.user);
            }
        });
    };

    render() {
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="name" bsSize="large">
                        <ControlLabel>Service Name</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.name}
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
                        Update Account
                    </Button>
                </form>
            </div>
        );
    }
}