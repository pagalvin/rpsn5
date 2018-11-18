
import React, { Component } from 'react';
import { MapLocation } from '../../Entities/MapObjects/MapLocation';
import { CountryMap } from '../../Entities/WorldObjects/CountryMap';
import { countrySummary, MapUtil } from '../../Utils/MapUtils';


export interface state {
    mySummary: countrySummary;
}

export interface props {
    mapToSummarize: CountryMap;
}

export class MapSummaryComponent extends React.Component<props, state> {

    constructor(props: props, state: state) {
        super(props, state);
        // console.log(`MapSummaryComponent: Entering with props and state:`, { props: props, state: state });
    }

    componentDidMount() {

    }

    render() {

        const summarizedMap = MapUtil.getMapSummary({forMap: this.props.mapToSummarize});

        return (
            <React.Fragment>
                <div>
                    Summary
                </div>
                <div>
                    {`Totals: ABMs: ${summarizedMap.totalAbmBases} | Radar: ${summarizedMap.totalRadarBases} | Air: ${summarizedMap.totalAirBases}`} 
                    &nbsp;
                    {`Army: ${summarizedMap.totalArmyBases} | Missile: ${summarizedMap.totalMissileBases} | Navy: ${summarizedMap.totalNavyBases}`}
                </div>
            </React.Fragment>
        );

    }
}

