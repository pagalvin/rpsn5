import React from 'react';
import { Constants } from '../Game/constants';
import { MissileBase } from '../Entities/WorldObjects/Bases/MissileBase';
import { GameLogic } from '../Game/GameLogic';
import { targetMissileResult } from './MapComponents/MapComponent';

export interface props { parentBase: MissileBase }
export interface state { }

export class MissileTargetingComponent extends React.Component<props, state> {

    private nextUIKey: number = 0;

    constructor(props: props, state: state) {
        super(props, state);
    }

    private uiKey() { return `MissileTargetingComponent_${this.nextUIKey++}` }

    render() {

        const dragStartMarkup = (args: { dragEvent: React.DragEvent, missileIndex: number }) => {
            console.log(`MissileTargetingComponent: tacticalOptionsMarkup: onDragStart: e, index:`,
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
                    {`Missile ${args.forMissileIndex} is targeted.`}
                </div>
            )
        }

        const toTargetMarkup = (args: { forMissileIndex: number }) => {
            return (
                    <div key={this.uiKey()}
                        draggable
                        onDragStart={(e) => dragStartMarkup({ dragEvent: e, missileIndex: args.forMissileIndex })}
                    >
                        {`Missile ${args.forMissileIndex}.`}
                </div>
            )
        };

        return (
            this.props.parentBase.missiles.map( (m, idx) => {

                if (m.myTarget) {
                    return targetedMarkup({forMissileIndex: idx});
                }

                return toTargetMarkup({forMissileIndex: idx});
            })
        );

    }

    private handleDropResult(args: { result: targetMissileResult }) {
        console.log(`MissileTargetingComponent: handleDropResult: drop finished, result:`, args.result);


        GameLogic.handleMissileTargeted({atMapLocation: args.result.targetedLocation, targetingMissile: this.props.parentBase.missiles[args.result.missileIndex]});

        // this.props.parentBase.missiles[args.result.missileIndex].myTarget = args.result.targetedLocation;

        this.forceUpdate();

    }

}
