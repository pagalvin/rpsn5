
import React, { Component } from 'react';
import { CountryMap } from '../../Entities/WorldObjects/CountryMap';
import { countrySummary, MapUtil } from '../../Utils/MapUtils';
import { GamestateWatcher, gameStateChangeDetails, GameLogic } from '../../Game/GameLogic';
import Odometer from 'react-odometerjs'
// import 'odometer/themes/odometer-theme-default.css';
import 'odometer/themes/odometer-theme-train-station.css';


export interface state {
    summarizedMap: countrySummary;
}

export interface props {
    mapToSummarize: CountryMap;
}

export class MapSummaryComponent extends React.Component<props, state> implements GamestateWatcher {

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
            summarizedMap: MapUtil.initialSummary
        }

        // console.log(`MapSummaryComponent: Entering with props and state:`, { props: props, state: state });
    }

    componentDidMount() {

        GameLogic.registerGamestateWatcher({ watcher: this });

        this.setState(
            {
                summarizedMap: MapUtil.getMapSummary({ forMap: this.props.mapToSummarize })
            });

    }

    render() {

        // const summarizedMap = MapUtil.getMapSummary({ forMap: this.props.mapToSummarize });
        const { summarizedMap } = this.state;

        return (
            <React.Fragment>
                <div>
                    Summary
                </div>
                <div>
                    Population: <Odometer format="(,ddd)" duration={5000} value={summarizedMap.totalPopulation}/>
                </div>
                <div>
                    Bases:
                    A: <Odometer format="d" duration={5000} value={summarizedMap.allAbmBases.length}/>
                    | R: <Odometer format="d" duration={5000} value={summarizedMap.allRadarBases.length}/>
                    | B: <Odometer format="d" duration={5000} value={summarizedMap.allAirBases.length}/>
                    | T: <Odometer format="d" duration={5000} value={summarizedMap.allArmyBases.length}/>
                    | M: <Odometer format="d" duration={5000} value={summarizedMap.allMissileBases.length}/>
                    | N: <Odometer format="d" duration={5000} value={summarizedMap.allNavyBases.length}/>

                </div>
                <div>
                    Ordnance:
                    A: <Odometer format="d" duration={5000} value={summarizedMap.totalAbmMissilesOnLine}/> 
                    | B: <Odometer format="d" duration={5000} value={summarizedMap.totalBombersInFlight}/>
                    | S: <Odometer format="d" duration={5000} value={summarizedMap.totalSubMissilesOnLine}/>
                    | F: <Odometer format="d" duration={5000} value={summarizedMap.totalFightersOnPatrol}/>
                    | M: <Odometer format="d" duration={5000} value={summarizedMap.totalICBMsOnLine}/>

                </div>
            </React.Fragment>
        );

    }

    public handleGamestateChange(args: { details: gameStateChangeDetails }) {

        if (args.details.changeLabel === "Base Activated" || args.details.changeLabel === "Advance Turn") {
            console.log(`MapSummaryComponent: handleGameStateChange: got a game state change, Base Activated.`);

            this.setState({
                summarizedMap: MapUtil.getMapSummary({ forMap: this.props.mapToSummarize })
            })
            // this.forceUpdate();
        }

    }

}

