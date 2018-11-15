import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { NavyBase } from '../../Entities/WorldObjects/Bases/NavyBase';
import { GameLogic } from '../../Game/GameLogic';

interface props {
    base: NavyBase;
}

interface state {
}

export class NavyBaseComponent extends Component<props, state> {

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
        }

    }

    private activateNavyBase() {
        console.log(`NavyBaseComponent: activateNavyBase: entering.`);
        GameLogic.activateNavyBase({forBase: this.props.base});
        this.forceUpdate();
    }

    render() {

        const readyToActivateMarkup =
            <React.Fragment>
                <Button onClick={() => this.activateNavyBase()}>
                    {`Target ${this.props.base.totalSubMissiles} Missiles`}
                </Button>
            </React.Fragment>;

        const allTargetedMarkup =
            <React.Fragment>
                <span>
                    {
                        `${this.props.base.totalSubMissiles} en route.`
                    }
                </span>
            </React.Fragment>;


        const isNotReceivingOrdersMarkup =
            <React.Fragment>
                <span>Setting sail...</span>
            </React.Fragment>;

        return (
            this.props.base.isReceivingOrders
                ? (
                    this.props.base.didLaunchMissles 
                        ? allTargetedMarkup  
                        : readyToActivateMarkup
                )
                : isNotReceivingOrdersMarkup
        );

    };
}
