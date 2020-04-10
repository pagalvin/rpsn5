
import React, { Component } from 'react';
import { MapLocation } from '../../Entities/MapObjects/MapLocation';

export type hoverListenerFunc = ((args: {onMapLocation: MapLocation}) => void);
export type hoverListenerRegistrationFunction = (args: {hoverListener: hoverListenerFunc}) => void;

export interface state {
    hoverMapLocation: MapLocation | null
}

export interface props {
    registerHoverListener: hoverListenerRegistrationFunction;
}

export class MapItemHoverComponent extends React.Component<props, state> {

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
            hoverMapLocation: null
        };

        // console.log(`MapItemHoverComponent: Entering with props and state:`, { props: props, state: state });
    }

    private handleMapLocationHover: hoverListenerFunc = (args: {onMapLocation: MapLocation}) => {
        // console.log(`MapItemHoverComponent: handleMapLocationHover: Entering with args:`, args);
        this.setState({hoverMapLocation: args.onMapLocation})
    }

    componentDidMount() {

        // console.log(`MapItemHoverComponent: componentDidMount: my props and state:`, {props: this.props, state: this.state});
        // console.log(`MapItemHoverComponent: componentDidMount: registering my map location hover handler.`);

        this.props.registerHoverListener({hoverListener: this.handleMapLocationHover.bind(this)});
    }

    render() {

        // console.log(`MapItemHoverLocation: render: entering.`);

        if (! this.state.hoverMapLocation) {
            return null;
        }

        return (
            <React.Fragment>
            <p>map location: {this.state.hoverMapLocation.uniqueID}</p>
            <p>map location: {this.state.hoverMapLocation.Contents.Name}</p>
            </React.Fragment>
        )
    }
}

