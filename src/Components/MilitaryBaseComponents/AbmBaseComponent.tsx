import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { AbmBase } from '../../Entities/WorldObjects/Bases/AbmBase';
import { GameLogic } from '../../Game/GameLogic';

interface props {
    base: AbmBase;
}

interface state {
}

export class AbmBaseComponent extends Component<props, state> {

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
        }

    }


    componentDidMount() {

        console.log(`AbmBaseComponent: componentDidMount: state and props:`, { state: this.state, props: this.props });

    }

    private activateAbmBase() {
        GameLogic.activateAbmBase({forBase: this.props.base});
        this.forceUpdate();
    }

    render() {

        const readyToActivateMarkup =
            <React.Fragment>
                <Button onClick={() => this.activateAbmBase()}>
                    Enable Active Tracking
                </Button>
            </React.Fragment>;

        const isTrackingMarkup =
            <React.Fragment>
                <span>
                    {
                        `Actively tracking incoming missiles and bombers, ${this.props.base.totalMissiles} missiles remain in arsenal.`
                    }
                </span>
            </React.Fragment>;


        const isNotReceivingOrdersMarkup =
            <React.Fragment>
                <span>Spinning up...</span>
            </React.Fragment>;

        return (
            this.props.base.isReceivingOrders
                ? (
                    this.props.base.isTracking ? isTrackingMarkup : readyToActivateMarkup
                )
                : isNotReceivingOrdersMarkup
        );

    };

}
