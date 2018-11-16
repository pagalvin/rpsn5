
import React, { Component } from 'react';
import { MapLocation } from '../../Entities/MapObjects/MapLocation';
import { CountryMap } from '../../Entities/WorldObjects/CountryMap';

export interface countrySummary {
    totalAbmBases: number;
    totalRadarBases: number;
    totalArmyBases: number;
    totalNavyBases: number;
    totalAirBases: number;
    totalMissileBases: number;
}

export interface state {
    mySummary: countrySummary;
}

export interface props {
    mapToSummary: CountryMap;
}

export class MapSummaryComponent extends React.Component<props, state> {

    private readonly initialSummary: countrySummary = {
        totalAbmBases: 0,
        totalRadarBases: 0,
        totalAirBases: 0,
        totalArmyBases: 0,
        totalNavyBases: 0,
        totalMissileBases: 0
    }

    constructor(props: props, state: state) {
        super(props, state);
        // console.log(`MapSummaryComponent: Entering with props and state:`, { props: props, state: state });
    }

    componentDidMount() {

    }

    render() {

        const addLocationToSummary = (l: MapLocation, s: countrySummary) =>
            l.Contents
                ? (
                    {
                        totalAbmBases: l.Contents.WorldObjectLabel === "ABM" ? s.totalAbmBases += 1 : s.totalAbmBases,
                        totalRadarBases: l.Contents.WorldObjectLabel === "Radar" ? s.totalRadarBases += 1 : s.totalRadarBases,
                        totalArmyBases: l.Contents.WorldObjectLabel === "Army" ? s.totalArmyBases += 1 : s.totalArmyBases,
                        totalAirBases: l.Contents.WorldObjectLabel === "Air" ? s.totalAirBases += 1 : s.totalAirBases,
                        totalMissileBases: l.Contents.WorldObjectLabel === "Missile" ? s.totalMissileBases += 1 : s.totalMissileBases,
                        totalNavyBases: l.Contents.WorldObjectLabel === "Navy" ? s.totalNavyBases += 1 : s.totalNavyBases,
                    } as countrySummary
                )
                : s
            ;

        const mapRowSummary = (row: MapLocation[]) =>
            row.reduce((prev, curr) => addLocationToSummary(curr, prev), this.initialSummary);

        const addTwoSummaries = (s1: countrySummary, s2: countrySummary) => (
            {
                totalAbmBases: s1.totalAbmBases + s2.totalAbmBases,
                totalRadarBases: s1.totalRadarBases + s2.totalRadarBases,
                totalAirBases: s1.totalAirBases + s2.totalAirBases,
                totalArmyBases: s1.totalArmyBases + s2.totalArmyBases,
                totalMissileBases: s1.totalMissileBases + s2.totalMissileBases,
                totalNavyBases: s1.totalNavyBases + s2.totalNavyBases
            } as countrySummary
        );

        const allIn = this.props.mapToSummary.map.reduce (
            (prev, curr) => addTwoSummaries(prev, mapRowSummary(curr)), this.initialSummary
        );

        console.log(`MapSummaryComponent: componentDidMount: allIn:`, {allIn2: allIn});

        return (
            <React.Fragment>
                <div>
                    Summary
                </div>
                <div>
                    {`Totals: ABMs: ${allIn.totalAbmBases} | Radar: ${allIn.totalRadarBases} | Air: ${allIn.totalAirBases}&nbsp;`}
                    {`Army: ${allIn.totalArmyBases} | Missile: ${allIn.totalMissileBases} | Navy: ${allIn.totalNavyBases}`}
                </div>
            </React.Fragment>
        );

    }
}

