
import React, { Component } from 'react';
import { GameLogic } from '../../Game/GameLogic';
import { MissileBase } from '../../Entities/WorldObjects/Bases/MissleBase';
import { Button } from '@material-ui/core';
import { MissileTargetingComponent } from '../MissileTargetingComponent';

interface props {
    base: MissileBase;
}

interface state {
}

export class MissileBaseComponent extends Component<props, state> {

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
        }

    }


    componentDidMount() {

        console.log(`MissileBaseComponent: componentDidMount: state and props:`, { state: this.state, props: this.props });

    }

    private activateMissileBase() {
        console.log(`MissileBaseComponent: activateMissileBase: entering.`);
        GameLogic.activateMissileBase({forBase: this.props.base});
        this.forceUpdate();
    }

    render() {

        const readyToActivateMarkup =
            <React.Fragment>
                <Button onClick={() => this.activateMissileBase()}>
                    {`Target ${this.props.base.totalMissiles} Missiles`}
                </Button>
                <MissileTargetingComponent/>                
            </React.Fragment>;

        const allTargetedMarkup =
            <React.Fragment>
                <span>
                    {
                        `${this.props.base.totalMissiles} en route.`
                    }
                </span>
            </React.Fragment>;


        const isNotReceivingOrdersMarkup =
            <React.Fragment>
                <span>Fueling missiles...</span>
            </React.Fragment>;

        return (
            this.props.base.isReceivingOrders
                ? (
                    this.props.base.totalMissiles > 0 && this.props.base.missileTargets.length === this.props.base.totalMissiles 
                        ? allTargetedMarkup 
                        : readyToActivateMarkup
                )
                : isNotReceivingOrdersMarkup
        );

    };

}
