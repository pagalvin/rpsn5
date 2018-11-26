import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { NavyBase } from '../../Entities/WorldObjects/Bases/NavyBase';
import { GameLogic } from '../../Game/GameLogic';
import { OrdnanceTargetingComponent } from '../OrdnanceTargetingComponent';

interface props {
    base: NavyBase;
}

interface state {
    isTargetingMissiles: boolean;
}

export class NavyBaseComponent extends Component<props, state> {

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
            isTargetingMissiles: false
        }

    }

    private activateNavyBase() {
        console.log(`NavyBaseComponent: activateNavyBase: entering.`);
        // GameLogic.activateNavyBase({ forBase: this.props.base });
        this.setState({ isTargetingMissiles: true });
    }

    render() {

        const { ordnance } = this.props.base;

        const isTargetingMarkup =
            <React.Fragment>
                <span>{`Targeting ${ordnance.length} missiles.`}<br /></span>
                <OrdnanceTargetingComponent
                    ordnanceLabel={"Submarine missile"}
                    parentBase={this.props.base}
                    targetingCompleteCallback={() => this.setState({ isTargetingMissiles: false })}
                />
            </React.Fragment>;


        const readyToActivateMarkup =
            <React.Fragment>
                <Button onClick={() => this.activateNavyBase()}>
                    {`Target ${ordnance.length} Missiles`}
                </Button>
            </React.Fragment>;

        const allTargetedMarkup =
            <React.Fragment>
                <span>
                    {
                        `${ordnance.length} en route.`
                    }
                </span>
            </React.Fragment>;


        const isNotReceivingOrdersMarkup =
            <React.Fragment>
                <span>Setting sail...</span>
            </React.Fragment>;

        const wrapper = (toWrap: JSX.Element) => {
            return (
                <React.Fragment>
                    <span>{`${this.props.base.WorldObjectLabel}: ${this.props.base.Name}`}</span>
                    {toWrap}
                </React.Fragment>
            )
        };

        if (this.state.isTargetingMissiles) { return wrapper(isTargetingMarkup); }
        if (!this.props.base.isReceivingOrders) { return wrapper(isNotReceivingOrdersMarkup); }
        if (this.props.base.isAllOrdnanceTargeted()) { return wrapper(allTargetedMarkup); }

        return wrapper(readyToActivateMarkup);

    };
}
