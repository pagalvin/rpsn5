
import React, { Component } from 'react';
import { MapLocation } from '../../Entities/MapObjects/MapLocation';
import { CountryMap } from '../../Entities/WorldObjects/CountryMap';
import { countrySummary, MapUtil } from '../../Utils/MapUtils';
import { GamestateWatcher, gameStateChangeDetails, GameLogic } from '../../Game/GameLogic';


export interface state {
    mySummary: countrySummary;
}

export interface props {
    mapToSummarize: CountryMap;
}

export class MapSummaryComponent extends React.Component<props, state> implements GamestateWatcher {

    constructor(props: props, state: state) {
        super(props, state);
        // console.log(`MapSummaryComponent: Entering with props and state:`, { props: props, state: state });
    }

    componentDidMount() {
        GameLogic.registerGamestateWatcher({ watcher: this });
    }

    render() {

        const summarizedMap = MapUtil.getMapSummary({forMap: this.props.mapToSummarize});

        return (
            <React.Fragment>
                <div>
                    Summary
                </div>
                <div>
                    {
                        `Bases: ` +
                        `A: ${summarizedMap.allAbmBases.length} | ` +
                        `R: ${summarizedMap.allRadarBases.length} | ` + 
                        `B: ${summarizedMap.allAirBases.length} | `+
                        `I: ${summarizedMap.allArmyBases.length} | ` + 
                        `M: ${summarizedMap.allMissileBases.length} | ` +
                        `N: ${summarizedMap.allNavyBases.length}`}
                </div>
                <div>
                    {
                        `Ordnance: ` +
                        `A: ${summarizedMap.totalAbmMissilesOnLine} | ` +
                        `B: ${summarizedMap.totalBombersInFlight} | ` +
                        `S: ${summarizedMap.totalSubMissilesOnLine} | ` +
                        `F: ${summarizedMap.totalFightersOnPatrol} | ` +
                        `M: ${summarizedMap.totalICBMsOnLine}`
                    }
                </div>
            </React.Fragment>
        );

    }

    
  public handleGamestateChange(args: { details: gameStateChangeDetails }) {

    if (args.details.changeLabel === "Base Activated") {
        console.log(`MapSummaryComponent: handleGameStateChange: got a game state change, Base Activated.`);
        this.forceUpdate();
    }

  }

}

