import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { NavyBase } from '../../Entities/WorldObjects/Bases/NavyBase';
import { GameLogic } from '../../Game/GameLogic';
import { OrdnanceTargetingComponent } from '../OrdnanceTargetingComponent';
import { UIComponent } from '../GameButton';

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
        const { base } = this.props;

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
                <UIComponent.GameButton onClick={() => this.activateNavyBase()}>
                    {`Target ${ordnance.length} Missiles`}
                </UIComponent.GameButton>
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
                    <span>{`${base.WorldObjectLabel}: ${base.Name}`}</span>
                    {toWrap}
                </React.Fragment>
            )
        };

        const wasDestroyedMarkup =
            <React.Fragment>
                <span>Nave Base ${base.Name} was destroyed.</span>
            </React.Fragment>


        if (base.wasDestroyed) { return wasDestroyedMarkup }
        if (this.state.isTargetingMissiles) { return wrapper(isTargetingMarkup); }
        if (!base.isReceivingOrders) { return wrapper(isNotReceivingOrdersMarkup); }
        if (base.isAllOrdnanceTargeted()) { return wrapper(allTargetedMarkup); }

        return wrapper(readyToActivateMarkup);

    };
}
