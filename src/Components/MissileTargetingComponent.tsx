import React from 'react';
import { Constants } from '../Game/constants';

export interface props {}
export interface state {}

export class MissileTargetingComponent extends React.Component<props, state> {

    constructor(props: props, state: state) {
        super(props, state);
    }



    render() {
 
        const dragStartMarkup = (args: {dragEvent: React.DragEvent, missileIndex: number}) => {
            console.log(`MissileTargetingComponent: tacticalOptionsMarkup: onDragStart: e, index:`, 
            { 
                e: args.dragEvent, 
                manifestIndex: args.missileIndex
            });

            args.dragEvent.dataTransfer.setData("dropType", Constants.TARGET_MISSILE_DROP);
 
            (window as any)[Constants.NOTIFY_TARGET_RESULT_CALLBACK_NAME] = this.handleDropResult.bind(this);
        }


        const toTargetMarkup = (args: {forMissileIndex: number}) => {
            return (
                <span 
                    draggable
                    onDragStart={(e) => dragStartMarkup({dragEvent: e, missileIndex: args.forMissileIndex})}
                    >
                    draggableMissile
                </span>
            )};

        return (
            toTargetMarkup({forMissileIndex: 0})
        );
        
    }

    private handleDropResult(args: {result: any}) {
        console.log(`MissileTargetingComponent: handleDropResult: drop finished, result:`, args.result);

        // this.setState({
        //     buildManifest: this.state.buildManifest.reduce( (prev, curr, idx) => {

        //         if (idx === args.result.manifestIndex) {
        //             const newBuildManfest: buildSelection = {
        //                 buildWhat: null,
        //                 buildWhere: null,
        //                 didBuild: args.result.didSucceed,
        //                 buildResultText: args.result.message
        //             }

        //             console.log(`MissileTargetingComponent: handleDropResult: updated manifest:`, {updatedManifest: newBuildManfest});

        //             return prev.concat(newBuildManfest);
        //         }
        //         else {
        //             return prev.concat(curr);
        //         }

        //     }, [] as buildSelection[])
        // })
    }

}
