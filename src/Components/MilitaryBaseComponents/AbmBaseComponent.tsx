import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { AbmBase } from '../../Entities/WorldObjects/Bases/AbmBase';
import { GameLogic } from '../../Game/GameLogic';
import { UIComponent } from '../GameButton';
import { Game } from '../../Entities/gameEntity';

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
        GameLogic.activateAbmBase({ forBase: this.props.base });
        this.forceUpdate();
    }

    render() {

        const {base} = this.props;

        const readyToActivateMarkup =
            <React.Fragment>
                <UIComponent.GameButton onClick={() => this.activateAbmBase()}>
                    Enable Active Tracking
                </UIComponent.GameButton>
            </React.Fragment>;

        const isTrackingMarkup =
            <React.Fragment>
                <span>
                    {
                        `Actively tracking incoming missiles and bombers, ${base.totalMissiles} missiles remain in arsenal.`
                    }
                </span>
            </React.Fragment>;

        const isNotReceivingOrdersMarkup =
            <React.Fragment>
                <span>Spinning up...</span>
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
                <span>ABM base ${base.Name} was destroyed.</span>
            </React.Fragment>

        if (base.wasDestroyed) { return wasDestroyedMarkup }

        // if (base.isTracking && base.totalMissiles < 1) {
        //     GameLogic.notifyBaseConsumed({atMapLocation: base.myMapLocation, attackingPlayer: Game.getInstance().humanPlayer});
        // }

        return (

            this.props.base.isReceivingOrders
                ? (
                    this.props.base.isTracking ? wrapper(isTrackingMarkup) : wrapper(readyToActivateMarkup)
                )
                : wrapper(isNotReceivingOrdersMarkup)
        );

    };


}
