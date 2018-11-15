import React, { Component } from 'react';
import { HumanPlayer } from '../Game/HumanPlayer';
import { MapLocation } from '../Entities/MapObjects/MapLocation';
import { MilitaryBaseTypes } from '../Entities/WorldObjects/Bases/MilitaryBaseTypes';
import { GamestateWatcher, GameLogic, gameStateChangeDetails } from '../Game/GameLogic';
import { AbmBaseComponent } from './MilitaryBaseComponents/AbmBaseComponent';
import { RadarBaseComponent } from './MilitaryBaseComponents/RadarBaseComponent';
import { NavyBaseComponent } from './MilitaryBaseComponents/NavyBaseComponent';
import { MissileBaseComponent } from './MilitaryBaseComponents/MissileBaseComponent';
import { AirBaseComponent } from './MilitaryBaseComponents/AirBaseComponent';
import { ArmyBaseComponent } from './MilitaryBaseComponents/ArmyBaseComponent';
import { RadarBase } from '../Entities/WorldObjects/Bases/RadarBase';
import { AirBase } from '../Entities/WorldObjects/Bases/AirBase';
import { AbmBase } from '../Entities/WorldObjects/Bases/AbmBase';
import { ArmyBase } from '../Entities/WorldObjects/Bases/ArmyBase';
import { MissileBase } from '../Entities/WorldObjects/Bases/MissleBase';
import { NavyBase } from '../Entities/WorldObjects/Bases/NavyBase';

interface props {
    player: HumanPlayer;
    registerForHumanPlayerMapClicks: (args: {ui: BaseActivatorComponent}) => void;
}

interface state {
    isWaitingForSelection: boolean;
    activeBases: Exclude<MilitaryBaseTypes, null>[];
    inactiveBases: Exclude<MilitaryBaseTypes, null>[];
}

export class BaseActivatorComponent extends Component<props, state> implements GamestateWatcher {

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
            isWaitingForSelection: false,
            activeBases: [],
            inactiveBases: []
        }

        GameLogic.registerGamestateWatcher({watcher: this});

    }

    public handleGamestateChange(args: { details: gameStateChangeDetails }) {
        
        if (args.details.changeLabel === "Tick") {
            // console.log(`BaseActivatorComponent: handleGameStateChange: Got a tick.`);

            if (this.state.inactiveBases.length > 0) {

                this.state.inactiveBases[0].activate();
                
                this.setState({
                    activeBases: this.state.activeBases.concat(this.state.inactiveBases[0]),
                    inactiveBases: this.state.inactiveBases.slice(1)
                })
            }
        }

    }
    
    componentDidMount() {

        console.log(`BaseActivatorComponent: componentDidMount: state and props:`, { state: this.state, props: this.props});

        this.props.registerForHumanPlayerMapClicks({ui: this});

        // need to get active and inactive bases
        // who holds onto that? Player? the map? this thing here? how about this thing here...

        console.log(`BaseActivatorComponent: componentDidMount: Got all the available military bases: `, {bases: this.props.player.map.getAllMilitaryBases()});

        const allBases = this.props.player.map.getAllMilitaryBases();

        this.setState({
            inactiveBases: allBases
        })
    }

    public handlePlayerMapClick(args: {location: MapLocation}) {
        console.log(`BaseActivatorComponent: handlePlayerMapClick: Got a click! args:`, {args: args});
    }

    render() {

        console.log(`BaseActivatorComponent: render: Entering with props and state:`, {props: this.props, state: this.state});

        const baseActivationOptions = (args: {forBase: Exclude<MilitaryBaseTypes, null>}) => {

            if (args.forBase.WorldObjectLabel === "ABM") return <AbmBaseComponent base={args.forBase as AbmBase}/>;
            if (args.forBase.WorldObjectLabel === "Army") return <ArmyBaseComponent base={args.forBase as ArmyBase}/>;
            if (args.forBase.WorldObjectLabel === "Air") return <AirBaseComponent base={args.forBase as AirBase}/>;
            if (args.forBase.WorldObjectLabel === "Missile") return <MissileBaseComponent base={args.forBase as MissileBase}/>;
            if (args.forBase.WorldObjectLabel === "Navy") return <NavyBaseComponent base={args.forBase as NavyBase}/>;
            if (args.forBase.WorldObjectLabel === "Radar") return <RadarBaseComponent base={args.forBase as RadarBase}/>;

        };

        const baseDetails = (args: {forBase: Exclude<MilitaryBaseTypes,null>}) => {
            return(
                <div>
                    Name: {args.forBase.Name}, 
                    Type: {args.forBase.WorldObjectLabel}, 
                    {baseActivationOptions(args)}
                </div>
            )
        }

        const toRender = (
            <React.Fragment>

                <div><h5>Active bases ({this.state.activeBases.length})</h5></div>
                {
                    this.state.activeBases.map(ab => baseDetails({forBase: ab}))
                }

                <div><h5>Inactive bases ({this.state.inactiveBases.length})</h5></div>
                {
                    this.state.inactiveBases.map(ab => baseDetails({forBase: ab}))
                }
            </React.Fragment>
        )

        return toRender;
    }
}
