import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { ArmyBase } from '../../Entities/WorldObjects/Bases/ArmyBase';
import { GameLogic } from '../../Game/GameLogic';

interface props {
    base: ArmyBase;
}

interface state {
}

export class ArmyBaseComponent extends Component<props, state> {

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
        }

    }


    componentDidMount() {

        console.log(`ArmyBaseComponent: componentDidMount: state and props:`, { state: this.state, props: this.props });

    }

    private decampArmy() {
        GameLogic.activateArmyBase({forBase: this.props.base});
        this.forceUpdate();
    }

    render() {

        const readyToActivateMarkup =
            <React.Fragment>
                <Button onClick={() => this.decampArmy()}>
                    Decamp
                </Button>
            </React.Fragment>;

        const isDecampedMarkup =
            <React.Fragment>
                <span>
                    {
                        `Operating...`
                    }
                </span>
            </React.Fragment>;


        const isNotReceivingOrdersMarkup =
            <React.Fragment>
                <span>Organizing...</span>
            </React.Fragment>;

        return (
            this.props.base.isReceivingOrders
                ? (
                    this.props.base.isDecamped ? isDecampedMarkup : readyToActivateMarkup
                )
                : isNotReceivingOrdersMarkup
        );

    };


}
