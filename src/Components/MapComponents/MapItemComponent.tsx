
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

        const { mapItem } = this.props;

        const nuclearDamageIndicator = () => {
            const {nuclearDamage} = this.props.mapItem;

            if (nuclearDamage === 1) return "*";
            if (nuclearDamage === 2) return "**";
            if (nuclearDamage === 3) return "***";

            return "";

        }
        return (
            <React.Fragment>

                {MapUtil.GetMapLocationSingleCharacterCode({forMapLocation: mapItem})}
                {nuclearDamageIndicator()}
                
            </React.Fragment>
        );

    }
}

