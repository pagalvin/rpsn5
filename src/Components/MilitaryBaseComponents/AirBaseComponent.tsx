import React, { Component } from 'react';
import { AirBase } from '../../Entities/WorldObjects/Bases/AirBase';
import { Button } from '@material-ui/core';

interface props {
    base: AirBase;
}

interface state {
}

export class AirBaseComponent extends Component<props, state> {

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
        }

    }


    componentDidMount() {

        console.log(`AirBaseComponent: componentDidMount: state and props:`, { state: this.state, props: this.props });

    }

    private scramble() {
        console.log(`AirbaseComponent: scramble: entering.`);
        this.props.base.isFlying = true;
        this.forceUpdate();
    }

    render() {

        const readyToActivateMarkup =
            <React.Fragment>
                <Button onClick={() => this.scramble()}>
                    {`Scramble ${this.props.base.totalFighters} fighters and ${this.props.base.totalBombers} bombers.`}
                </Button>
            </React.Fragment>;

        const isFlyingMarkup =
            <React.Fragment>
                <span>
                    {
                        `${this.props.base.totalFighters} on patrol. ${this.props.base.totalBombers} en route to their target.`
                    }
                </span>
            </React.Fragment>;


        const isNotReceivingOrdersMarkup =
            <React.Fragment>
                <span>Flight crews prepping...</span>
            </React.Fragment>;

        return (
            this.props.base.isReceivingOrders
                ? (
                    this.props.base.isFlying ? isFlyingMarkup : readyToActivateMarkup 
                )
                : isNotReceivingOrdersMarkup
        );

    };

}
