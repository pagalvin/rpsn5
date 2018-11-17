import React from 'react';
import { Constants } from '../Game/constants';
import { MissileBase } from '../Entities/WorldObjects/Bases/MissileBase';
import { GameLogic } from '../Game/GameLogic';
import { targetMissileResult } from './MapComponents/MapComponent';
import { NavyBase } from '../Entities/WorldObjects/Bases/NavyBase';
import { AirBase } from '../Entities/WorldObjects/Bases/AirBase';

export interface props { 
    parentBase: MissileBase | NavyBase | AirBase;
    ordnanceLabel: string;
    targetingCompleteCallback: () => void;
}

export interface state { }

export class OrdnanceTargetingComponent extends React.Component<props, state> {

    private nextUIKey: number = 0;

    constructor(props: props, state: state) {
        super(props, state);
    }

    private uiKey() { return `OrdnanceTargetingComponent_${this.nextUIKey++}` }

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

                console.log(`OrdnanceTargetComponent: mapping ordnance for render:`, {currentMissile: m});

                if (m.myTarget !== null) {
                    return targetedMarkup({forMissileIndex: idx});
                }

                return toTargetMarkup({forMissileIndex: idx});
            })
        );

    }

    private handleDropResult(args: { result: targetMissileResult }) {
        console.log(`OrdnanceTargetingComponent: handleDropResult: drop finished, result:`, args.result);

        GameLogic.handleMissileTargeted(
            {
                atMapLocation: args.result.targetedLocation, 
                targetingMissile: this.props.parentBase.ordnance[args.result.missileIndex]
            });
        
        if (this.props.parentBase.isAllOrdnanceTargeted()) {
            this.props.targetingCompleteCallback();
        }
        else {
        this.forceUpdate();
        }
        
    }

}
