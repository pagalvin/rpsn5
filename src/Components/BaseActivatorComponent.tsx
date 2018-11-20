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
import { MissileBase } from '../Entities/WorldObjects/Bases/MissileBase';
import { NavyBase } from '../Entities/WorldObjects/Bases/NavyBase';
import { AbstractMilitaryBase } from '../Entities/WorldObjects/Bases/AbstractMilitaryBase';
import { MapUtil } from '../Utils/MapUtils';

interface props {
    player: HumanPlayer;
    registerForHumanPlayerMapClicks: (args: { ui: BaseActivatorComponent }) => void;
}

type baseComponent = AbmBaseComponent |
    AirBaseComponent |
    MissileBaseComponent |
    ArmyBaseComponent |
    NavyBaseComponent |
    RadarBaseComponent;

interface initializedBase {
    baseEntity: Exclude<MilitaryBaseTypes, null>;
    ui: baseComponent;
}

interface state {
    isWaitingForSelection: boolean;
    activeBases: initializedBase[];
    inactiveBases: initializedBase[];
}

export class BaseActivatorComponent extends Component<props, state> implements GamestateWatcher {

    private uiKeyNbr: number = 0;

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
            isWaitingForSelection: false,
            activeBases: [],
            inactiveBases: []
        }

        GameLogic.registerGamestateWatcher({ watcher: this });

    }

    public handleGamestateChange(args: { details: gameStateChangeDetails }) {

        if (args.details.changeLabel === "Tick") {

            if (this.state.inactiveBases.length > 0) {

                // console.log(`BaseActivatorComponent: handleGameStateChange: Got a tick, activatig a base:`,
                //     {
                //         base: this.state.inactiveBases[0]
                //     });

                this.state.inactiveBases[0].baseEntity.activate();
                this.handleBaseActivatedAnimation({forBase: this.state.inactiveBases[0]});

                this.setState({
                    activeBases: this.state.activeBases.concat(this.state.inactiveBases[0]),
                    inactiveBases: this.state.inactiveBases.slice(1)
                })
            }
        }

    }

    private handleBaseActivatedAnimation(args: {forBase: initializedBase}) {
        const mapLocElement = document.getElementById(MapUtil.getMapLocationHtmlID(args.forBase.baseEntity.myMapLocation));
        if (mapLocElement) {
            mapLocElement.classList.remove("activatedBase");
            mapLocElement.classList.add("activatedBase");
        }

    }

    componentDidMount() {

        // console.log(`BaseActivatorComponent: componentDidMount: state and props:`, { state: this.state, props: this.props });

        this.props.registerForHumanPlayerMapClicks({ ui: this });

        // console.log(`BaseActivatorComponent: componentDidMount: Got all the available military bases: `, { bases: this.props.player.map.getAllMilitaryBases() });

        const getIB = (base: Exclude<MilitaryBaseTypes,null>) => { 
            return ( 
                {
                    baseEntity: base as any,
                    ui: this.getBaseUI({forBase: base}) as any
                } as initializedBase
            )
         }

         const allPlayerMilitaryBases = this.props.player.map.getAllMilitaryBases();

         const initializedBases = allPlayerMilitaryBases.map(b => getIB(b));

         this.setState({
             inactiveBases: initializedBases
         });

    }

    private uiKey() { return `BaseActivatorComponent_${this.uiKeyNbr++}` }

    public handlePlayerMapClick(args: { location: MapLocation }) {
        console.log(`BaseActivatorComponent: handlePlayerMapClick: Got a click! args:`, { args: args });
    }

    render() {

        console.log(`BaseActivatorComponent: render: Entering with props and state:`, { props: this.props, state: this.state });

        const baseActivationOptions = (args: { forBase: Exclude<MilitaryBaseTypes, null> }) => {

            if (args.forBase.WorldObjectLabel === "ABM") return <AbmBaseComponent key={this.uiKey()} base={args.forBase as AbmBase} />;
            if (args.forBase.WorldObjectLabel === "Army") return <ArmyBaseComponent key={this.uiKey()} base={args.forBase as ArmyBase} />;
            if (args.forBase.WorldObjectLabel === "Air") return <AirBaseComponent key={this.uiKey()} base={args.forBase as AirBase} />;
            if (args.forBase.WorldObjectLabel === "Missile") return <MissileBaseComponent key={this.uiKey()} base={args.forBase as MissileBase} />;
            if (args.forBase.WorldObjectLabel === "Navy") return <NavyBaseComponent key={this.uiKey()} base={args.forBase as NavyBase} />;
            if (args.forBase.WorldObjectLabel === "Radar") return <RadarBaseComponent key={this.uiKey()} base={args.forBase as RadarBase} />;

        };

        const toRender = (
            <React.Fragment>

                <div><h5>Active bases ({this.state.activeBases.length})</h5></div>
                {
                    // this.state.activeBases.map(activeBase => baseDetails({ forInitializedBase: activeBase }))
                    this.state.activeBases.map(activeBase => activeBase.ui)
                }

                <div><h5>Inactive bases ({this.state.inactiveBases.length})</h5></div>
                {
                    // this.state.inactiveBases.map(inactiveBase => baseDetails({ forInitializedBase: inactiveBase }))
                    this.state.inactiveBases.map(inactiveBase => inactiveBase.ui)
                }
            </React.Fragment>
        )

        return toRender;
    }

    private getBaseUI = (args: { forBase: Exclude<MilitaryBaseTypes, null> }) => {

        const { WorldObjectLabel } = args.forBase;

        if (WorldObjectLabel === "ABM") return <AbmBaseComponent key={this.uiKey()} base={args.forBase as AbmBase} />;
        else if (WorldObjectLabel === "Army") return <ArmyBaseComponent key={this.uiKey()} base={args.forBase as ArmyBase} />;
        else if (WorldObjectLabel === "Air") return <AirBaseComponent key={this.uiKey()} base={args.forBase as AirBase} />;
        else if (WorldObjectLabel === "Missile") return <MissileBaseComponent key={this.uiKey()} base={args.forBase as MissileBase} />;
        else if (WorldObjectLabel === "Navy") return <NavyBaseComponent key={this.uiKey()} base={args.forBase as NavyBase} />;
        else return <RadarBaseComponent key={this.uiKey()} base={args.forBase as RadarBase} />;

    };


}
