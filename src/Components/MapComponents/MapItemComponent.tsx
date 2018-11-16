
import React, { Component } from 'react';
import { MapLocation } from '../../Entities/MapObjects/MapLocation';
import { MapUtil } from '../../Utils/MapUtils';

export interface state {

}

export interface props {
    mapItem: MapLocation
}

export class MapItemComponent extends React.Component<props, state> {

    constructor(props: props, state: state) {
        super(props, state);
        // console.log(`MapItemComponent: Entering with props and state:`, { props: props, state: state });
    }

    componentDidMount() {
    }

    render() {

        return (
            MapUtil.GetMapLocationSingleCharacterCode({forMapLocation: this.props.mapItem})
        );

    }
}

