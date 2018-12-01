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
        GameLogic.activateArmyBase({ forBase: this.props.base });
        this.forceUpdate();
    }

    render() {

        const {base} = this.props;

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
                <span>Army base ${base.Name} was destroyed.</span>
            </React.Fragment>


        if (base.wasDestroyed) { return wasDestroyedMarkup }

        return (
            base.isReceivingOrders
                ? (
                    base.isDecamped ? wrapper(isDecampedMarkup) : wrapper(readyToActivateMarkup)
                )
                : wrapper(isNotReceivingOrdersMarkup)
        );

    };


}
