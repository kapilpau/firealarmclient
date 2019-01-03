/**
 * Created by Kapil on 29/12/2018.
 */

import React from "react";
import "./Home.css";
import { Button } from "react-bootstrap";
import cookie from 'react-cookies';
import { GoogleMap, withGoogleMap, Marker } from "react-google-maps";
import withScriptjs from 'react-google-maps/lib/withScriptjs';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import socketIOClient from "socket.io-client";
import Modal from 'react-modal';

export default class Home extends React.Component {

    state = {
        alarms: [],
        modalIsOpen: false
    };


    openModal = (alarm) => { console.log(alarm);this.setState({modalIsOpen: true, selectedAlarm: alarm, lat: alarm.lat, long: alarm.long})};

    closeModal = () => this.setState({modalIsOpen: false});

    getTime = (date) => {
      let d = new Date(date);
      return d.toLocaleTimeString();
    };

    addDisabled = (args) => {
        if (args.item.text === 'Link') {
            args.element.classList.add('e-disabled');
        }
    };

    cancelAlarm = () => {
        console.log(this.state.selectedAlarm);
        fetch('/fire/cancelAlarm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.selectedAlarm.id
            })
        }).then((res) => res.json())
        .then((res) => {this.setState({modalIsOpen: false, selectedAlarm: null})});
    };


    dispatchCrew = () => {
        console.log(this.state.selectedAlarm);
        fetch('/fire/dispatchCrew', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                alarm: this.state.selectedAlarm.id
            })
        }).then((res) => res.json())
            .then((res) => {this.setState({modalIsOpen: false, selectedAlarm: null})});
    };

    componentDidMount = () => {
        console.log(cookie.load("user"));
        if (!cookie.load("user").id)
        {
            this.props.history.push('/app/login');
        }
        this.setState({lat: cookie.load("user").lat, long: cookie.load("user").long});
        const socket = socketIOClient(`http://${window.location.hostname}:3000/`);
        fetch('/fire/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: cookie.load("user").id
            })
        }).then((res) => res.json())
        .then((res) => {this.setState({alarms: res.alarms});});
        socket.on("alarmUpdate", data => this.setState({ alarms: JSON.parse(data).alarms }));
        socket.emit('fireJoin', cookie.load("user").id);
    };
    render() {

        const user = cookie.load("user");
        if (!user)
        {
            this.props.history.push('/app/login');
        }
        console.log(this.state.alarms);

        const Markers = this.state.alarms.map((alarm) => {
            let pos = {
                lat: alarm.lat,
                lng: alarm.long
            };
            return (
                <Marker
                    class="marker"
                    key={alarm.id}
                    position={pos}
                    icon={{
                        url: require('../assets/fireIcon.png'),
                        scaledSize: {
                            width: 85,
                            height: 100
                        }
                    }}
                    onClick={() => this.openModal(alarm)}
                />
            );
        });

        const columns = [{
            Header: 'Address',
            accessor: 'addressName',
            Cell: props => <span>{props.value}</span>
        }, {
            Header: 'Detected at',
            accessor: 'detectedAt',
            Cell: props => <span>{this.getTime(props.value)}</span>,
            maxWidth: 100
        }];

        const MyMapComponent = withScriptjs(withGoogleMap(props => {
            return <GoogleMap defaultZoom={13} defaultCenter={{ lat: this.state.lat, lng: this.state.long }}>
                {Markers}
                </GoogleMap>
        }));

        const ModalMapComponent = withScriptjs(withGoogleMap(props => {
            return <GoogleMap defaultZoom={18} defaultCenter={{ lat: this.state.selectedAlarm.lat, lng: this.state.selectedAlarm.long }}>
                <Marker
                    class="marker"
                    key={this.state.selectedAlarm.id}
                    position={{lat: this.state.selectedAlarm.lat, lng: this.state.selectedAlarm.long}}
                    icon={{
                        url: require('../assets/fireIcon.png'),
                        scaledSize: {
                            width: 85,
                            height: 100
                        }
                    }}
                />
            </GoogleMap>
        }));
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
                    contextMenuId='menu_id'
                    getTrProps={(state, rowInfo) => ({
                            onClick: () => {
                                this.openModal(rowInfo.original)
                            }
                        }
                    )}
                />
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="AlarmModal"
                >

                    <button onClick={this.closeModal}>close</button>
                    <div>
                        <h3>{this.state.selectedAlarm ? this.state.selectedAlarm.addressName : ""}</h3> <h5> - {this.state.selectedAlarm ? this.state.selectedAlarm.status : ""}</h5>
                        <h5>{this.state.selectedAlarm ? this.state.selectedAlarm.comments : ""}</h5>

                        <ModalMapComponent
                            style={{position: 'absolute', border: '1px solid'}}
                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDl8EMGdAEUSCwTROVXP921Nc_-mKR41Wc&libraries=maps,places"
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={
                                <div style={{    position: 'absolute',
                                    top: '25%',
                                    left: '0%',
                                    right: 0,
                                    bottom: '15%',
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
                        <div style={{    position: 'absolute',
                            top: '90%',
                            left: '10%',
                            right: 0,
                            bottom: 0,
                        }}>
                            <Button onClick={this.cancelAlarm}>Cancel Alarm</Button>
                            <Button onClick={this.dispatchCrew}>Dispatch Crew</Button>
                        </div>
                    </div>

                </Modal>
            </div>
            <div  id="map">
            <MyMapComponent
                style={{position: 'absolute', border: '1px solid'}}
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
            </div>
        );
    }
}