import React from 'react';
import { Constants } from '../Game/constants';
import { MissileBase } from '../Entities/WorldObjects/Bases/MissileBase';
import { GameLogic, GamestateWatcher, gameStateChangeDetails } from '../Game/GameLogic';
import { targetMissileResult } from './MapComponents/MapComponent';
import { NavyBase } from '../Entities/WorldObjects/Bases/NavyBase';
import { AirBase } from '../Entities/WorldObjects/Bases/AirBase';
import { Game } from '../Entities/gameEntity';

export interface props { 
    parentBase: MissileBase | NavyBase | AirBase;
    ordnanceLabel: string;
    targetingCompleteCallback: () => void;
}

export interface state { }

export class OrdnanceTargetingComponent extends React.Component<props, state> implements GamestateWatcher{

    private nextUIKey: number = 0;

    constructor(props: props, state: state) {
        super(props, state);

    }

    private uiKey() { return `OrdnanceTargetingComponent_${this.nextUIKey++}` }

    componentDidMount() {
        GameLogic.registerGamestateWatcher({ watcher: this });
    }

    public handleGamestateChange(args: { details: gameStateChangeDetails }) {

        // console.log(`MapComponent: handleGamestateChange: Got a game state change:`, args);
    
        if (args.details.changeLabel === "Location Nuked") {
          this.forceUpdate();
        }
      }
    
    render() {

        const {ordnanceLabel } = this.props;

        const dragStartMarkup = (args: { dragEvent: React.DragEvent, missileIndex: number }) => {
            console.log(`OrdnanceTargetingComponent: tacticalOptionsMarkup: onDragStart: e, index:`,
                {
                    e: args.dragEvent,
                    manifestIndex: args.missileIndex
                });

            args.dragEvent.dataTransfer.setData("dropType", Constants.TARGET_MISSILE_DROP);
            args.dragEvent.dataTransfer.setData("missileIndex", args.missileIndex.toString());

            (window as any)[Constants.NOTIFY_TARGET_RESULT_CALLBACK_NAME] = this.handleDropResult.bind(this);


        }

        const targetedMarkup = (args: { forMissileIndex: number}) => {
            return (
                <div key={this.uiKey()}>
                    {`${ordnanceLabel} ${args.forMissileIndex} is targeted.`}
                </div>
            )
        }

        const wasInterceptedMarkup = (args: {forMissileIndex: number}) => {
            return (
                <div key={this.uiKey()}>
                    {`${ordnanceLabel} ${args.forMissileIndex} was shot down.`}
                </div>
            )
        }

        const consumedMarkup = (args: { forMissileIndex: number}) => {
            return (
                <div key={this.uiKey()}>
                    {`${ordnanceLabel} ${args.forMissileIndex} hit its target.`}
                </div>
            )
        }

        const toTargetMarkup = (args: { forMissileIndex: number }) => {
            return (
                    <div key={this.uiKey()}
                        draggable
                        onDragStart={(e) => dragStartMarkup({ dragEvent: e, missileIndex: args.forMissileIndex })}
                    >
                        {`${ordnanceLabel} ${args.forMissileIndex}.`}
                </div>
            )
        };

        return (
            this.props.parentBase.ordnance.map( (m, idx) => {

                // console.log(`OrdnanceTargetComponent: mapping ordnance for render:`, {currentMissile: m});

                if (m.wasIntercepted) { return wasInterceptedMarkup({forMissileIndex: idx})}
                
                if (m.wasConsumed) { return consumedMarkup({forMissileIndex: idx}) }

                if (m.myTarget !== null) {
                    return targetedMarkup({forMissileIndex: idx});
                }

                return toTargetMarkup({forMissileIndex: idx});
            })
        );

    }

    private handleDropResult(args: { result: targetMissileResult }) {
        console.log(`OrdnanceTargetingComponent: handleDropResult: drop finished, result:`, args.result);

        const currentPlayerType = this.props.parentBase.myMapLocation.myMap.owner;

        GameLogic.handleMissileTargeted(
            {
                attackingPlayer: currentPlayerType === "Computer" ? Game.getInstance().computerPlayer : Game.getInstance().humanPlayer,
                atMapLocation: args.result.targetedLocation, 
                targetingOrdnance: this.props.parentBase.ordnance[args.result.missileIndex]
            });
        
        if (this.props.parentBase.isAllOrdnanceTargeted()) {
            this.props.targetingCompleteCallback();
        }
        else {
        this.forceUpdate();
        }
        
    }

}
