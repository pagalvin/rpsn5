
import React, { Component } from 'react';
import { GameLogic } from '../../Game/GameLogic';
import { MissileBase } from '../../Entities/WorldObjects/Bases/MissileBase';
import { Button } from '@material-ui/core';
import { OrdnanceTargetingComponent } from '../OrdnanceTargetingComponent';
import { UIComponent } from '../GameButton';

interface props {
    base: MissileBase;
}

interface state {
    isTargetingMissiles: boolean;
}

export class MissileBaseComponent extends Component<props, state> {

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
            isTargetingMissiles: false
        }

    }

    componentDidMount() {

        console.log(`MissileBaseComponent: componentDidMount: state and props:`, { state: this.state, props: this.props });

    }

    private activateMissileBase() {
        console.log(`MissileBaseComponent: activateMissileBase: entering.`);
        GameLogic.activateMissileBase({ forBase: this.props.base });
        this.setState({ isTargetingMissiles: true });
    }

    render() {

        const {base} = this.props;

        const isTargetingMarkup =
            <React.Fragment>
                <span>{`Targeting ${base.ordnance.length} missiles.`}<br /></span>
                <OrdnanceTargetingComponent
                    ordnanceLabel={"ICBM"}
                    parentBase={base}
                    targetingCompleteCallback={() => this.setState({ isTargetingMissiles: false })}
                />
            </React.Fragment>;

        const readyToActivateMarkup =
            <React.Fragment>
                <UIComponent.GameButton onClick={() => this.activateMissileBase()}>
                    {`Target ${base.ordnance.length} Missiles`}
                </UIComponent.GameButton>
            </React.Fragment>;

        const allTargetedMarkup =
            <React.Fragment>
                <span>
                    {
                        `${base.ordnance.length} en route.`
                    }
                </span>
            </React.Fragment>;


        const isNotReceivingOrdersMarkup =
            <React.Fragment>
                <span>Fueling missiles...</span>
            </React.Fragment>;

        const wrapper = (toWrap: JSX.Element) => {
            return (
                <div>
                    <span>{`${base.WorldObjectLabel}: ${base.Name}`}</span>
                    {toWrap}
                </div>
            )
        };

        const wasDestroyedMarkup = 
            <React.Fragment>
                <span>Missile base ${base.Name} was destroyed.</span>
            </React.Fragment>


        if (base.wasDestroyed) { return wasDestroyedMarkup }
        if (this.state.isTargetingMissiles) { return wrapper(isTargetingMarkup); }
        if (!base.isReceivingOrders) { return wrapper(isNotReceivingOrdersMarkup); }
        if (base.isAllOrdnanceTargeted()) { return wrapper(allTargetedMarkup); }

        return wrapper(readyToActivateMarkup);

    };

}
