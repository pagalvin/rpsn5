
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

    }

    private handleMapLocationHover: hoverListenerFunc = (args: {onMapLocation: MapLocation}) => {
        this.setState({hoverMapLocation: args.onMapLocation})
    }

    componentDidMount() {

        this.props.registerHoverListener({hoverListener: this.handleMapLocationHover.bind(this)});
    }

    render() {

        if (! this.state.hoverMapLocation) {
            return null;
        }

        return (
            <React.Fragment>
            <p>map location: {this.state.hoverMapLocation.uniqueID}</p>
            <p>map pop: {this.state.hoverMapLocation.Contents.Population.toLocaleString()}</p>
            <p>map location: {this.state.hoverMapLocation.Contents.Name}</p>
            </React.Fragment>
        )
    }
}

