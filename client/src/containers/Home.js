/**
 * Created by Kapil on 29/12/2018.
 */

import React from "react";
import "./Home.css";
import cookie from 'react-cookies';
import { GoogleMap, withGoogleMap, Marker } from "react-google-maps";
import withScriptjs from 'react-google-maps/lib/withScriptjs';
import Card from '@material-ui/core/Card';
import ReactTable from "react-table";
import 'react-table/react-table.css';

export default class Home extends React.Component {

    state = {
        alarms: []
    };

    getTime = (date) => {
      let d = new Date(date);
      return d.toLocaleTimeString();
    };

    componentDidMount = () => {
        fetch('/fire/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: cookie.load("user").id
            })
        }).then((res) => res.json())
            .then((res) => this.setState({alarms: res.alarms}))
    };
    render() {

        const user = cookie.load("user");
        if (!user)
        {
            this.props.history.push('/app/login');
        }
        console.log(this.state.alarms);

        const FireList = this.state.alarms.map((alarm) => {
            return (
                <Card key={alarm.id} style={{
                    width: "100%"
                }}>
                    {alarm.name}
                </Card>
            );
        });

        const Markers = this.state.alarms.map((alarm) => {
            let pos = {
                lat: alarm.lat,
                lng: alarm.long
            };
            return (
                <Marker
                    key={alarm.id}
                    position={pos}
                    icon={{
                        url: require('../assets/fireIcon.png'),
                        scaledSize: {
                            width: 85,
                            height: 100
                        }
                    }}
                />
            );
        });


        const MyMapComponent = withScriptjs(withGoogleMap(props => {
            return <GoogleMap defaultZoom={13} defaultCenter={{ lat: user.lat, lng: user.long }}>{Markers}</GoogleMap>
        }));

        const columns = [{
            Header: 'Address',
            accessor: 'addressName',
            Cell: props => <span>{props.value}</span>
        }, {
            Header: 'Detected at',
            accessor: 'updatedAt',
            Cell: props => <span>{this.getTime(props.value)}</span>,
            maxWidth: 100
        }];

        console.log(FireList);
        return (
            <div>
            <div style={{
                width: '35%',
                borderColor: 'gray',
                borderWidth: 2,
                height: '100%',
                left: -100
            }}>
                <ReactTable
                    data={this.state.alarms}
                    showPaginationBottom={false}
                    defaultPageSize={16}
                    columns={columns}
                />
            </div>
            <MyMapComponent
                style={{position: 'absolute'}}
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDl8EMGdAEUSCwTROVXP921Nc_-mKR41Wc&libraries=maps,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={
                    <div style={{    position: 'absolute',
                        top: '11%',
                        left: '35%',
                        right: 0,
                        bottom: 0,
                        justifyContent: 'flex-end'}} />
                }
                mapElement={
                    <div style={{    position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }} />
                } />
            </div>
        );
    }
}