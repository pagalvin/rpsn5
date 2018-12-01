
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
            const {nuclearStrikes} = this.props.mapItem;

            if (nuclearStrikes === 1) return "*";
            if (nuclearStrikes === 2) return "**";
            if (nuclearStrikes === 3) return "***";

            return "";

        }
        return (
            <React.Fragment>

                {MapUtil.GetMapLocationSingleCharacterCode({forMapLocation: mapItem})}
                <span className="visibilityCount">{mapItem.enemyVisibility}</span>
                {nuclearDamageIndicator()}
                
            </React.Fragment>
        );

    }
}

