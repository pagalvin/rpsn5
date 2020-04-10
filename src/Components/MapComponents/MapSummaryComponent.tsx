
import React, { Component } from 'react';
import { CountryMap } from '../../Entities/WorldObjects/CountryMap';
import { countrySummary, MapUtil } from '../../Utils/MapUtils';
import { GamestateWatcher, gameStateChangeDetails, GameLogic } from '../../Game/GameLogic';
import Odometer from 'react-odometerjs'
// import 'odometer/themes/odometer-theme-default.css';
import 'odometer/themes/odometer-theme-train-station.css';
import { Game } from '../../Entities/gameEntity';


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

        const ordnanceMarkup = () => {
            return (
                <div>
                    Ordnance:
                    A: <Odometer format="d" duration={5000} value={summarizedMap.totalAbmMissilesOnLine}/> 
                    | B: <Odometer format="d" duration={5000} value={summarizedMap.totalBombersInFlight}/>
                    | S: <Odometer format="d" duration={5000} value={summarizedMap.totalSubMissilesOnLine}/>
                    | F: <Odometer format="d" duration={5000} value={summarizedMap.totalFightersOnPatrol}/>
                    | M: <Odometer format="d" duration={5000} value={summarizedMap.totalICBMsOnLine}/>
                </div>
            );
        }
        
        const warTimeMarkup = () => {
            return ( Game.getInstance().isWartime ? ordnanceMarkup() : null)
        }

        const playerNameMarkup = (args: {playerName: string}) => {
            const maxWidth = 44;
            const dashes = "- - - - - - - - - - - - - - - - - - ";

            if (args.playerName.length >= maxWidth) return args.playerName;
            
            const idx = 0.5 * (maxWidth - args.playerName.length);

            return (
                dashes.substring(0,idx) + " " + args.playerName + " " + dashes.substr(0,idx)
            );

        }

        return (
            <div className="mapSummaryContainer">
                <div className="playerName">
                    {playerNameMarkup({playerName: this.props.mapToSummarize.owningPlayer.Name})}
                    {/* {this.props.mapToSummarize.owningPlayer.Name} */}
                </div>
                <div>
                    Population: <Odometer format="(,ddd)" duration={5000} value={summarizedMap.totalPopulation}/>
                    &nbsp;
                    Casualties: <Odometer format="(,ddd)" duration={5000} value={this.props.mapToSummarize.owningPlayer.totalCausualties}/>
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
                { warTimeMarkup() }
            </div>
        );

    }

    public handleGamestateChange(args: { details: gameStateChangeDetails }) {

        if (args.details.changeLabel === "Base Activated" 
        || args.details.changeLabel === "Advance Turn"
        || args.details.changeLabel === "Location Nuked"
            ) {
            console.log(`MapSummaryComponent: handleGameStateChange: got a game state change, Base Activated.`);

            this.setState({
                summarizedMap: MapUtil.getMapSummary({ forMap: this.props.mapToSummarize })
            })
            // this.forceUpdate();
        }

    }

}

